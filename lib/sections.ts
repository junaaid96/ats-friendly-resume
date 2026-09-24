import { Resume, SectionKey } from '@/types/resume';

export const SECTION_KEYS: SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
};

/** The resume's section order, with any missing sections appended in default order. */
export function orderedSections(resume: Partial<Resume>): SectionKey[] {
  const saved = (resume.settings?.sectionOrder || []).filter((k) => SECTION_KEYS.includes(k));
  const unique = Array.from(new Set(saved));
  return [...unique, ...SECTION_KEYS.filter((k) => !unique.includes(k))];
}

export function isSectionHidden(resume: Partial<Resume>, key: SectionKey): boolean {
  return !!resume.settings?.hiddenSections?.includes(key);
}
