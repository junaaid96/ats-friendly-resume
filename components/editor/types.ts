import { Resume } from '@/types/resume';
import { ValidationErrors } from '@/lib/validation';
import { IconName } from '@/components/ui/Icon';

export type Draft = Partial<Resume>;

export interface StepProps {
  resume: Draft;
  update: (patch: Draft) => void;
  errors: ValidationErrors;
  /** Returns the error for a field once the user has touched it or tried to move on. */
  showError: (path: string, message: string | undefined) => string | undefined;
  touch: (path: string) => void;
}

export type StepId =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'design'
  | 'review';

export interface StepDef {
  id: StepId;
  label: string;
  title: string;
  description: string;
  icon: IconName;
  optional?: boolean;
  errorKeys: (keyof ValidationErrors)[];
  isComplete: (r: Draft) => boolean;
}

export const STEPS: StepDef[] = [
  {
    id: 'contact',
    label: 'Contact',
    title: 'Who are you?',
    description: 'Recruiters use these details to reach you. Use a professional email address.',
    icon: 'user',
    errorKeys: ['personalInfo'],
    isComplete: (r) =>
      !!(r.personalInfo?.fullName && r.personalInfo.email && r.personalInfo.phone && r.personalInfo.location),
  },
  {
    id: 'summary',
    label: 'Summary',
    title: 'Your professional summary',
    description: 'Two to four sentences on who you are, what you are great at and what you want next.',
    icon: 'text',
    errorKeys: ['summary'],
    isComplete: (r) => (r.summary || '').trim().length >= 50,
  },
  {
    id: 'experience',
    label: 'Experience',
    title: 'Work experience',
    description: 'Most recent first. Lead each bullet with a strong verb and add a number where you can.',
    icon: 'briefcase',
    errorKeys: ['experience'],
    isComplete: (r) => (r.experience || []).length > 0,
  },
  {
    id: 'education',
    label: 'Education',
    title: 'Education',
    description: 'Degrees, diplomas and relevant coursework. Add your GPA only if it helps.',
    icon: 'graduation',
    errorKeys: ['education'],
    isComplete: (r) => (r.education || []).length > 0,
  },
  {
    id: 'skills',
    label: 'Skills',
    title: 'Skills',
    description: 'Use the exact wording from job ads (e.g. “PostgreSQL”, not “databases”). ATS systems match on keywords.',
    icon: 'tools',
    errorKeys: ['skills'],
    isComplete: (r) => (r.skills || []).length > 0,
  },
  {
    id: 'projects',
    label: 'Projects',
    title: 'Projects',
    description: 'Side projects, open source or notable work that shows what you can do.',
    icon: 'folder',
    optional: true,
    errorKeys: ['projects'],
    isComplete: (r) => (r.projects || []).length > 0,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    title: 'Certifications',
    description: 'Licences and certificates that are relevant to the roles you want.',
    icon: 'award',
    optional: true,
    errorKeys: ['certifications'],
    isComplete: (r) => (r.certifications || []).length > 0,
  },
  {
    id: 'design',
    label: 'Design',
    title: 'Design & layout',
    description: 'Every template is single-column and ATS-safe. Reorder or hide sections for each application.',
    icon: 'palette',
    errorKeys: [],
    isComplete: () => true,
  },
  {
    id: 'review',
    label: 'Review',
    title: 'Review & save',
    description: 'Check what is missing, get an AI ATS score, then save to get your shareable link.',
    icon: 'flag',
    errorKeys: [],
    isComplete: () => false,
  },
];

export const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
