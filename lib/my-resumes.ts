'use client';

import { Resume } from '@/types/resume';

/**
 * Resumes created in this browser, with the edit token the API issued for
 * each one. This list is what lets its owner edit or delete a resume; anyone
 * else with the share link can only view it.
 */
export interface MyResume {
  id: string;
  editToken: string;
  fullName: string;
  headline: string;
  template?: string;
  updatedAt: string;
}

const KEY = 'arvix:my-resumes';
const DRAFT_KEY = 'arvix:draft';
export const MY_RESUMES_EVENT = 'arvix:my-resumes-changed';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the app still works, it just can't remember.
  }
}

export function listMyResumes(): MyResume[] {
  return read<MyResume[]>(KEY, []).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getEditToken(id: string): string | null {
  return read<MyResume[]>(KEY, []).find((r) => r.id === id)?.editToken || null;
}

export function rememberResume(resume: Resume, editToken: string) {
  const entry: MyResume = {
    id: resume.id,
    editToken,
    fullName: resume.personalInfo?.fullName || 'Untitled resume',
    headline: resume.experience?.[0]?.position || '',
    template: resume.template,
    updatedAt: resume.updatedAt || new Date().toISOString(),
  };
  write(KEY, [entry, ...read<MyResume[]>(KEY, []).filter((r) => r.id !== resume.id)]);
  window.dispatchEvent(new Event(MY_RESUMES_EVENT));
}

export function forgetResume(id: string) {
  write(KEY, read<MyResume[]>(KEY, []).filter((r) => r.id !== id));
  window.dispatchEvent(new Event(MY_RESUMES_EVENT));
}

/** Unsaved work on the create page, restored if the tab is closed by accident. */
export function loadDraft(): Partial<Resume> | null {
  return read<Partial<Resume> | null>(DRAFT_KEY, null);
}

export function saveDraft(resume: Partial<Resume>) {
  write(DRAFT_KEY, resume);
}

export function clearDraft() {
  write(DRAFT_KEY, null);
}
