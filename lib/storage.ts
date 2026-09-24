import { Resume } from '@/types/resume';
import { sql } from '@vercel/postgres';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import fs from 'fs';
import path from 'path';

// Check if we're using Postgres (production) or file system (local dev)
// Supports Vercel Postgres, Neon, Supabase, or any PostgreSQL database
const USE_POSTGRES = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);

// File system fallback for local development
const DATA_DIR = path.join(process.cwd(), 'data');
const RESUMES_FILE = path.join(DATA_DIR, 'resumes.json');

// Initialize file system storage for local development
if (!USE_POSTGRES) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RESUMES_FILE)) {
    fs.writeFileSync(RESUMES_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Resumes are public by link (read-only). Changing or deleting one needs the
 * edit token handed to its creator, which only lives in their browser. The
 * database stores a SHA-256 hash of the token, never the token itself.
 */
export type OwnershipError = 'not_found' | 'forbidden';

type StoredResume = Resume & { editTokenHash?: string };

function newEditToken(): string {
  return randomBytes(32).toString('base64url');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function tokenMatches(token: string | null | undefined, hash: string | null | undefined): boolean {
  if (!token || !hash) return false;
  const a = Buffer.from(hashToken(token), 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

function stripSecrets(stored: StoredResume): Resume {
  const resume = { ...stored };
  delete resume.editTokenHash;
  return resume;
}

// Adds the columns introduced after the first release. Runs once per server process.
let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb`;
      await sql`ALTER TABLE resumes ADD COLUMN IF NOT EXISTS edit_token_hash TEXT`;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

// Helper function to convert database row to Resume object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToResume(row: any): StoredResume {
  // Ensure JSONB fields are properly parsed (Vercel Postgres should handle this, but be safe)
  const parseJsonb = (value: unknown) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  return {
    id: row.id,
    personalInfo: parseJsonb(row.personal_info),
    summary: row.summary || '',
    experience: parseJsonb(row.experience) || [],
    education: parseJsonb(row.education) || [],
    skills: parseJsonb(row.skills) || [],
    projects: parseJsonb(row.projects) || [],
    certifications: parseJsonb(row.certifications) || [],
    template: row.template || 'classic-red',
    settings: parseJsonb(row.settings) || {},
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    editTokenHash: row.edit_token_hash || undefined,
  };
}

function readFileStore(): StoredResume[] {
  try {
    return JSON.parse(fs.readFileSync(RESUMES_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error reading resumes from file:', error);
    return [];
  }
}

function writeFileStore(resumes: StoredResume[]) {
  fs.writeFileSync(RESUMES_FILE, JSON.stringify(resumes, null, 2));
}

async function getStoredResume(id: string): Promise<StoredResume | null> {
  if (USE_POSTGRES) {
    await ensureSchema();
    const { rows } = await sql`
      SELECT * FROM resumes
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows.length ? rowToResume(rows[0]) : null;
  }
  return readFileStore().find((resume) => resume.id === id) || null;
}

export async function getResumeById(id: string): Promise<Resume | null> {
  try {
    const stored = await getStoredResume(id);
    return stored ? stripSecrets(stored) : null;
  } catch (error) {
    console.error('Error fetching resume:', error, 'Resume ID:', id);
    return null;
  }
}

/** Creates a resume and returns it with the one-time edit token for its creator. */
export async function createResume(
  resume: Resume
): Promise<{ resume: Resume; editToken: string }> {
  const now = new Date().toISOString();
  const editToken = newEditToken();
  const stored: StoredResume = {
    ...resume,
    createdAt: now,
    updatedAt: now,
    editTokenHash: hashToken(editToken),
  };

  if (USE_POSTGRES) {
    await ensureSchema();
    await sql`
      INSERT INTO resumes (
        id, personal_info, summary, experience, education,
        skills, projects, certifications, template, settings,
        edit_token_hash, created_at, updated_at
      )
      VALUES (
        ${stored.id},
        ${JSON.stringify(stored.personalInfo)}::jsonb,
        ${stored.summary},
        ${JSON.stringify(stored.experience)}::jsonb,
        ${JSON.stringify(stored.education)}::jsonb,
        ${JSON.stringify(stored.skills)}::jsonb,
        ${JSON.stringify(stored.projects || [])}::jsonb,
        ${JSON.stringify(stored.certifications || [])}::jsonb,
        ${stored.template || 'classic-red'},
        ${JSON.stringify(stored.settings || {})}::jsonb,
        ${stored.editTokenHash},
        ${now},
        ${now}
      )
    `;
  } else {
    const resumes = readFileStore();
    resumes.push(stored);
    writeFileStore(resumes);
  }

  return { resume: stripSecrets(stored), editToken };
}

/** Updates a resume if `editToken` belongs to it. */
export async function updateResume(
  id: string,
  resume: Resume,
  editToken: string | null
): Promise<Resume | OwnershipError> {
  const existing = await getStoredResume(id);
  if (!existing) return 'not_found';
  if (!tokenMatches(editToken, existing.editTokenHash)) return 'forbidden';

  const now = new Date().toISOString();
  const updated: StoredResume = {
    ...resume,
    id,
    createdAt: existing.createdAt,
    updatedAt: now,
    editTokenHash: existing.editTokenHash,
  };

  if (USE_POSTGRES) {
    await sql`
      UPDATE resumes SET
        personal_info = ${JSON.stringify(updated.personalInfo)}::jsonb,
        summary = ${updated.summary},
        experience = ${JSON.stringify(updated.experience)}::jsonb,
        education = ${JSON.stringify(updated.education)}::jsonb,
        skills = ${JSON.stringify(updated.skills)}::jsonb,
        projects = ${JSON.stringify(updated.projects || [])}::jsonb,
        certifications = ${JSON.stringify(updated.certifications || [])}::jsonb,
        template = ${updated.template || 'classic-red'},
        settings = ${JSON.stringify(updated.settings || {})}::jsonb,
        updated_at = ${now}
      WHERE id = ${id}
    `;
  } else {
    writeFileStore(readFileStore().map((r) => (r.id === id ? updated : r)));
  }

  return stripSecrets(updated);
}

/** Deletes a resume if `editToken` belongs to it. */
export async function deleteResume(
  id: string,
  editToken: string | null
): Promise<true | OwnershipError> {
  const existing = await getStoredResume(id);
  if (!existing) return 'not_found';
  if (!tokenMatches(editToken, existing.editTokenHash)) return 'forbidden';

  if (USE_POSTGRES) {
    await sql`
      DELETE FROM resumes
      WHERE id = ${id}
    `;
  } else {
    writeFileStore(readFileStore().filter((resume) => resume.id !== id));
  }
  return true;
}
