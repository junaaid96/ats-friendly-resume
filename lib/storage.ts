import { Resume } from '@/types/resume';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const RESUMES_FILE = path.join(DATA_DIR, 'resumes.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize resumes file if it doesn't exist
if (!fs.existsSync(RESUMES_FILE)) {
  fs.writeFileSync(RESUMES_FILE, JSON.stringify([], null, 2));
}

export function getAllResumes(): Resume[] {
  try {
    const data = fs.readFileSync(RESUMES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading resumes:', error);
    return [];
  }
}

export function getResumeById(id: string): Resume | null {
  const resumes = getAllResumes();
  return resumes.find(resume => resume.id === id) || null;
}

export function saveResume(resume: Resume): Resume {
  const resumes = getAllResumes();
  const existingIndex = resumes.findIndex(r => r.id === resume.id);

  if (existingIndex >= 0) {
    // Update existing resume
    resumes[existingIndex] = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Add new resume
    resumes.push({
      ...resume,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  fs.writeFileSync(RESUMES_FILE, JSON.stringify(resumes, null, 2));
  return resume;
}

export function deleteResume(id: string): boolean {
  const resumes = getAllResumes();
  const filteredResumes = resumes.filter(resume => resume.id !== id);

  if (filteredResumes.length === resumes.length) {
    return false; // Resume not found
  }

  fs.writeFileSync(RESUMES_FILE, JSON.stringify(filteredResumes, null, 2));
  return true;
}
