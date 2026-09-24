import { Resume } from '@/types/resume';
import { isSectionHidden, orderedSections, SECTION_LABELS } from '@/lib/sections';

const monthYear = (d?: string) => {
  if (!d) return '';
  const [y, m] = d.split('-');
  const date = new Date(parseInt(y), parseInt(m) - 1);
  return isNaN(date.getTime())
    ? d
    : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const range = (start?: string, end?: string, current?: boolean) =>
  [monthYear(start), current ? 'Present' : monthYear(end)].filter(Boolean).join(' - ');

/**
 * Plain-text resume in the section order the user chose. Handy for pasting
 * into application forms, and it's exactly what an ATS parser "sees".
 */
export function resumeToPlainText(resume: Resume): string {
  const p = resume.personalInfo;
  const out: string[] = [p.fullName.toUpperCase()];
  out.push([p.email, p.phone, p.location].filter(Boolean).join(' | '));
  const links = [p.linkedin, p.website, p.github].filter(Boolean);
  if (links.length) out.push(links.join(' | '));

  for (const key of orderedSections(resume)) {
    if (isSectionHidden(resume, key)) continue;
    const body: string[] = [];

    if (key === 'summary' && resume.summary) body.push(resume.summary);
    if (key === 'skills' && resume.skills.length) body.push(resume.skills.join(', '));
    if (key === 'experience') {
      for (const e of resume.experience) {
        body.push(`${e.position}, ${e.company}${e.location ? ` (${e.location})` : ''}`);
        body.push(range(e.startDate, e.endDate, e.current));
        e.responsibilities.filter((r) => r.trim()).forEach((r) => body.push(`- ${r}`));
        body.push('');
      }
    }
    if (key === 'education') {
      for (const e of resume.education) {
        body.push(`${[e.degree, e.field].filter(Boolean).join(' in ')}, ${e.institution}`);
        body.push(
          [range(e.startDate, e.endDate), e.location, e.gpa && `GPA: ${e.gpa}`].filter(Boolean).join(' | ')
        );
        body.push('');
      }
    }
    if (key === 'projects') {
      for (const pr of resume.projects || []) {
        body.push(pr.link ? `${pr.name} - ${pr.link}` : pr.name);
        if (pr.description) body.push(pr.description);
        if (pr.technologies.length) body.push(`Technologies: ${pr.technologies.join(', ')}`);
        body.push('');
      }
    }
    if (key === 'certifications') {
      for (const c of resume.certifications || []) {
        body.push(
          [c.name, c.issuer, c.date && `Issued ${monthYear(c.date)}`, c.credentialId && `ID ${c.credentialId}`]
            .filter(Boolean)
            .join(' | ')
        );
      }
    }

    while (body.length && body[body.length - 1] === '') body.pop();
    if (body.length) out.push('', SECTION_LABELS[key].toUpperCase(), ...body);
  }

  return out.join('\n') + '\n';
}

// --- Job description matching -------------------------------------------

const STOPWORDS = new Set(
  `a about above across after again against all also am an and any are as at be because been before being below
  between both but by can could did do does doing down during each either else etc every few for from further get
  had has have having he her here hers him his how i if in into is it its itself just least less like made make
  many may me might more most must my no nor not now of off on once only or other our ours out over own per
  please plus same shall she should so some such than that the their theirs them then there these they this
  those through to too under until up upon us very via was we well were what when where whether which while who
  whom whose why will with within without would you your yours yourself
  ability able apply applicant applicants candidate candidates company day days degree desired etc excellent
  experience experienced including job join knowledge looking minimum new opportunity plus position preferred
  qualifications required requirement requirements responsibilities role skills strong team teams work working
  year years hiring hire seeking ideal senior junior mid level lead great good nice bonus environment
  fast-paced based across help across ensure within`.split(/\s+/)
);

const tokenize = (text: string) =>
  (text.toLowerCase().match(/[a-z0-9][a-z0-9+#./-]*/g) || [])
    .map((t) => t.replace(/[./-]+$/, ''))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t) && !/^\d+$/.test(t));

export interface KeywordMatch {
  score: number;
  matched: string[];
  missing: string[];
}

/**
 * Pulls the most frequent terms (and repeated two-word phrases) out of a job
 * description and checks which ones appear anywhere in the resume.
 */
export function matchJobDescription(resume: Resume, jobDescription: string, limit = 30): KeywordMatch {
  const words = tokenize(jobDescription);
  const counts = new Map<string, number>();
  words.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));

  const phrases = new Map<string, number>();
  const sentences = jobDescription.toLowerCase().split(/[\n.;:!?()]+/);
  for (const sentence of sentences) {
    const t = tokenize(sentence);
    for (let i = 0; i < t.length - 1; i++) {
      const phrase = `${t[i]} ${t[i + 1]}`;
      phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
    }
  }

  const repeatedPhrases = [...phrases].filter(([, n]) => n > 1);
  const keywords = [
    ...repeatedPhrases,
    ...[...counts].filter(([w]) => !repeatedPhrases.some(([p]) => p.split(' ').includes(w))),
  ]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k]) => k);

  const haystack = ` ${tokenize(resumeToPlainText(resume)).join(' ')} `;
  const matched = keywords.filter((k) => haystack.includes(` ${k} `));
  const missing = keywords.filter((k) => !matched.includes(k));

  return {
    score: keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0,
    matched,
    missing,
  };
}
