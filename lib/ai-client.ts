'use client';

import { Resume } from '@/types/resume';

/** Browser-side wrappers for the /api/ai routes (Groq, Llama 3.3). */

export interface AtsAnalysis {
  score: number;
  suggestions: string[];
  keywords: string[];
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/ai/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'The AI assistant is unavailable right now.');
  }
  return response.json();
}

export const ai = {
  summaries: (jobTitle: string, yearsExperience: string, keySkills: string[]) =>
    post<{ summaries: string[] }>('generate-summary', { jobTitle, yearsExperience, keySkills }).then(
      (d) => d.summaries || []
    ),

  improveBullet: (bulletPoint: string, jobTitle: string) =>
    post<{ improvements: string[] }>('improve-bullet', { bulletPoint, jobTitle }).then((d) => d.improvements || []),

  suggestSkills: (jobTitle: string, currentSkills: string[]) =>
    post<{ skills: string[] }>('suggest-skills', { jobTitle, currentSkills }).then((d) => d.skills || []),

  analyzeAts: (resume: Partial<Resume>) => post<AtsAnalysis>('analyze-ats', resume),

  recommendTemplate: (resume: Partial<Resume>) =>
    post<{ templateId: string; reason: string }>('recommend-template', resume),
};

/** Rough years of experience from the work history, for AI prompts. */
export function yearsOfExperience(resume: Partial<Resume>): string {
  const starts = (resume.experience || [])
    .map((e) => e.startDate)
    .filter(Boolean)
    .map((d) => new Date(`${d}-01`).getTime())
    .filter((t) => !isNaN(t));
  if (!starts.length) return '';
  const years = Math.max(0, Math.round((Date.now() - Math.min(...starts)) / (365.25 * 24 * 3600 * 1000)));
  return years < 1 ? 'less than 1 year' : `${years} years`;
}
