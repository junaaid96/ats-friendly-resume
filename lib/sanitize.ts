import {
  Certification,
  Education,
  Project,
  Resume,
  ResumeSettings,
  SectionKey,
  WorkExperience,
} from '@/types/resume';
import { SECTION_KEYS } from '@/lib/sections';

/**
 * Server-side shape check for resumes coming from the API. Keeps only known
 * fields, coerces them to the right types and caps sizes, so a client can't
 * store arbitrary payloads under a public share link.
 */

const MAX_ITEMS = 30;
const MAX_TEXT = 3000;
const MAX_SHORT = 300;

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, max = MAX_SHORT) => (typeof v === 'string' ? v.slice(0, max) : '');
const optStr = (v: unknown, max = MAX_SHORT) => (typeof v === 'string' && v ? v.slice(0, max) : undefined);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v.slice(0, MAX_ITEMS) : []);
const strList = (v: unknown, max = MAX_SHORT) =>
  list(v).filter((x): x is string => typeof x === 'string').map((x) => x.slice(0, max));
const itemId = (v: unknown) => str(v, 100) || Math.random().toString(36).slice(2, 11);

function experience(v: unknown): WorkExperience {
  const o = isObj(v) ? v : {};
  return {
    id: itemId(o.id),
    company: str(o.company),
    position: str(o.position),
    location: str(o.location),
    startDate: str(o.startDate, 20),
    endDate: str(o.endDate, 20),
    current: o.current === true,
    responsibilities: strList(o.responsibilities, 1000),
  };
}

function education(v: unknown): Education {
  const o = isObj(v) ? v : {};
  return {
    id: itemId(o.id),
    institution: str(o.institution),
    degree: str(o.degree),
    field: str(o.field),
    location: str(o.location),
    startDate: str(o.startDate, 20),
    endDate: str(o.endDate, 20),
    gpa: optStr(o.gpa, 20),
  };
}

function project(v: unknown): Project {
  const o = isObj(v) ? v : {};
  return {
    id: itemId(o.id),
    name: str(o.name),
    description: str(o.description, MAX_TEXT),
    technologies: strList(o.technologies, 100),
    link: optStr(o.link, 500),
  };
}

function certification(v: unknown): Certification {
  const o = isObj(v) ? v : {};
  return {
    id: itemId(o.id),
    name: str(o.name),
    issuer: str(o.issuer),
    date: str(o.date, 20),
    expiryDate: optStr(o.expiryDate, 20),
    credentialId: optStr(o.credentialId, 200),
  };
}

function settings(v: unknown): ResumeSettings {
  const o = isObj(v) ? v : {};
  const keys = (x: unknown) =>
    strList(x, 40).filter((k): k is SectionKey => (SECTION_KEYS as string[]).includes(k));
  return {
    sectionOrder: keys(o.sectionOrder),
    hiddenSections: keys(o.hiddenSections),
  };
}

export function sanitizeResume(input: unknown, id: string): Resume | null {
  if (!isObj(input) || !isObj(input.personalInfo)) return null;
  const p = input.personalInfo;
  const now = new Date().toISOString();

  return {
    id,
    personalInfo: {
      fullName: str(p.fullName),
      email: str(p.email),
      phone: str(p.phone, 50),
      location: str(p.location),
      linkedin: optStr(p.linkedin, 500),
      website: optStr(p.website, 500),
      github: optStr(p.github, 500),
    },
    summary: str(input.summary, MAX_TEXT),
    experience: list(input.experience).map(experience),
    education: list(input.education).map(education),
    skills: strList(input.skills, 100),
    projects: list(input.projects).map(project),
    certifications: list(input.certifications).map(certification),
    template: str(input.template, 50) || 'classic-red',
    settings: settings(input.settings),
    createdAt: now,
    updatedAt: now,
  };
}
