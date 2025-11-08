import { Resume } from '@/types/resume';
import { sql } from '@vercel/postgres';
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

// Helper function to convert database row to Resume object
function rowToResume(row: any): Resume {
  return {
    id: row.id,
    personalInfo: row.personal_info,
    summary: row.summary,
    experience: row.experience || [],
    education: row.education || [],
    skills: row.skills || [],
    projects: row.projects || [],
    certifications: row.certifications || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Postgres implementation
export async function getAllResumes(): Promise<Resume[]> {
  if (USE_POSTGRES) {
    try {
      const { rows } = await sql`
        SELECT * FROM resumes
        ORDER BY created_at DESC
      `;
      return rows.map(rowToResume);
    } catch (error) {
      console.error('Error reading resumes from Postgres:', error);
      return [];
    }
  } else {
    // File system fallback
    try {
      const data = fs.readFileSync(RESUMES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading resumes from file:', error);
      return [];
    }
  }
}

export async function getResumeById(id: string): Promise<Resume | null> {
  if (USE_POSTGRES) {
    try {
      const { rows } = await sql`
        SELECT * FROM resumes
        WHERE id = ${id}
        LIMIT 1
      `;
      return rows.length > 0 ? rowToResume(rows[0]) : null;
    } catch (error) {
      console.error('Error fetching resume from Postgres:', error);
      return null;
    }
  } else {
    // File system fallback
    const resumes = await getAllResumes();
    return resumes.find(resume => resume.id === id) || null;
  }
}

export async function saveResume(resume: Resume): Promise<Resume> {
  const now = new Date().toISOString();
  
  if (USE_POSTGRES) {
    try {
      // Check if resume exists
      const existing = await sql`
        SELECT id FROM resumes WHERE id = ${resume.id}
      `;

      if (existing.rows.length > 0) {
        // Update existing resume
        await sql`
          UPDATE resumes SET
            personal_info = ${JSON.stringify(resume.personalInfo)}::jsonb,
            summary = ${resume.summary},
            experience = ${JSON.stringify(resume.experience)}::jsonb,
            education = ${JSON.stringify(resume.education)}::jsonb,
            skills = ${JSON.stringify(resume.skills)}::jsonb,
            projects = ${JSON.stringify(resume.projects || [])}::jsonb,
            certifications = ${JSON.stringify(resume.certifications || [])}::jsonb,
            updated_at = ${now}
          WHERE id = ${resume.id}
        `;
      } else {
        // Insert new resume
        await sql`
          INSERT INTO resumes (
            id, personal_info, summary, experience, education, 
            skills, projects, certifications, created_at, updated_at
          )
          VALUES (
            ${resume.id},
            ${JSON.stringify(resume.personalInfo)}::jsonb,
            ${resume.summary},
            ${JSON.stringify(resume.experience)}::jsonb,
            ${JSON.stringify(resume.education)}::jsonb,
            ${JSON.stringify(resume.skills)}::jsonb,
            ${JSON.stringify(resume.projects || [])}::jsonb,
            ${JSON.stringify(resume.certifications || [])}::jsonb,
            ${resume.createdAt || now},
            ${now}
          )
        `;
      }
      
      return {
        ...resume,
        createdAt: resume.createdAt || now,
        updatedAt: now,
      };
    } catch (error) {
      console.error('Error saving resume to Postgres:', error);
      throw error;
    }
  } else {
    // File system fallback
    const resumes = await getAllResumes();
    const existingIndex = resumes.findIndex(r => r.id === resume.id);

    if (existingIndex >= 0) {
      resumes[existingIndex] = {
        ...resume,
        updatedAt: now,
      };
    } else {
      resumes.push({
        ...resume,
        createdAt: resume.createdAt || now,
        updatedAt: now,
      });
    }

    fs.writeFileSync(RESUMES_FILE, JSON.stringify(resumes, null, 2));
    return resume;
  }
}

export async function deleteResume(id: string): Promise<boolean> {
  if (USE_POSTGRES) {
    try {
      const { rowCount } = await sql`
        DELETE FROM resumes
        WHERE id = ${id}
      `;
      return (rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting resume from Postgres:', error);
      return false;
    }
  } else {
    // File system fallback
    const resumes = await getAllResumes();
    const filteredResumes = resumes.filter(resume => resume.id !== id);

    if (filteredResumes.length === resumes.length) {
      return false; // Resume not found
    }

    fs.writeFileSync(RESUMES_FILE, JSON.stringify(filteredResumes, null, 2));
    return true;
  }
}
