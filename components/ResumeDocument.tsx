import { ReactNode } from 'react';
import { Resume, SectionKey } from '@/types/resume';
import { getTemplate } from '@/lib/templates';
import { isSectionHidden, orderedSections, SECTION_LABELS } from '@/lib/sections';

/**
 * The printable resume. Shared by the resume page, the editor preview and
 * the landing page sample so they always match. Single column, real text and
 * standard headings keep it ATS-friendly. Pure markup, no hooks.
 */

export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  if (!year || !month) return dateString;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const dateRange = (start?: string, end?: string, current?: boolean) =>
  [formatDate(start), current ? 'Present' : formatDate(end)].filter(Boolean).join(' – ');

const BULLETS = { disc: 'list-disc', circle: 'list-[circle]', square: 'list-[square]' } as const;

export default function ResumeDocument({
  resume,
  className = '',
  printable = true,
}: {
  resume: Partial<Resume>;
  className?: string;
  /** The printable copy carries id="resume-content", which the print stylesheet targets. */
  printable?: boolean;
}) {
  const template = getTemplate(resume.template);
  const { primary } = template.colors;
  const { headerAlign, sectionDivider, bulletStyle } = template.styles;
  const personal = resume.personalInfo || { fullName: '', email: '', phone: '', location: '' };
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const align = headerAlign === 'center' ? 'text-center' : headerAlign === 'right' ? 'text-right' : 'text-left';
  const rowAlign = headerAlign === 'center' ? 'justify-center' : headerAlign === 'right' ? 'justify-end' : 'justify-start';
  const bullets = BULLETS[bulletStyle] || 'list-disc';

  const heading = (key: SectionKey) => (
    <h2
      className="mb-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] print:tracking-normal"
      style={{ color: primary }}
    >
      {SECTION_LABELS[key]}
      {sectionDivider !== 'space' && (
        <span
          aria-hidden
          className="flex-1"
          style={{ borderTop: `${sectionDivider === 'border' ? 1.5 : 1}px solid ${primary}`, opacity: 0.55 }}
        />
      )}
    </h2>
  );

  const entryHeader = (title: ReactNode, subtitle: ReactNode, place?: string, when?: string) => (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-[13px] font-semibold leading-snug text-neutral-900">{title}</h3>
        {subtitle && <p className="text-[12px] leading-snug text-neutral-700">{subtitle}</p>}
      </div>
      {(place || when) && (
        <div className="shrink-0 text-right text-[11.5px] leading-snug text-neutral-600">
          {when && <p className="whitespace-nowrap font-medium text-neutral-800">{when}</p>}
          {place && <p className="whitespace-nowrap">{place}</p>}
        </div>
      )}
    </div>
  );

  const sections: Record<SectionKey, ReactNode> = {
    summary: resume.summary ? (
      <section className="mb-4">
        {heading('summary')}
        <p className="whitespace-pre-line text-[12px] leading-relaxed text-neutral-800">{resume.summary}</p>
      </section>
    ) : null,

    experience: experience.length ? (
      <section className="mb-4">
        {heading('experience')}
        <div className="space-y-3">
          {experience.map((exp) => (
            <article key={exp.id}>
              {entryHeader(exp.position, exp.company, exp.location, dateRange(exp.startDate, exp.endDate, exp.current))}
              {(exp.responsibilities || []).some((r) => r.trim()) && (
                <ul className={`${bullets} mt-1 space-y-0.5 pl-4 text-[12px] leading-relaxed text-neutral-800 marker:text-neutral-500`}>
                  {exp.responsibilities
                    .filter((r) => r.trim())
                    .map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    ) : null,

    education: education.length ? (
      <section className="mb-4">
        {heading('education')}
        <div className="space-y-2.5">
          {education.map((edu) => (
            <article key={edu.id}>
              {entryHeader(
                [edu.degree, edu.field].filter(Boolean).join(' in '),
                [edu.institution, edu.gpa && `GPA ${edu.gpa}`].filter(Boolean).join(' · '),
                edu.location,
                dateRange(edu.startDate, edu.endDate)
              )}
            </article>
          ))}
        </div>
      </section>
    ) : null,

    skills: skills.length ? (
      <section className="mb-4">
        {heading('skills')}
        <p className="text-[12px] leading-relaxed text-neutral-800">{skills.join(' · ')}</p>
      </section>
    ) : null,

    projects: projects.length ? (
      <section className="mb-4">
        {heading('projects')}
        <div className="space-y-2.5">
          {projects.map((project) => (
            <article key={project.id}>
              <h3 className="text-[13px] font-semibold leading-snug text-neutral-900">
                {project.name}
                {project.link && (
                  <a href={project.link} className="ml-2 break-all text-[11.5px] font-normal text-neutral-600 hover:underline">
                    {project.link.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </h3>
              {project.description && (
                <p className="text-[12px] leading-relaxed text-neutral-800">{project.description}</p>
              )}
              {project.technologies?.length > 0 && (
                <p className="text-[11.5px] leading-snug text-neutral-600">
                  <span className="font-medium text-neutral-800">Tech:</span> {project.technologies.join(', ')}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    ) : null,

    certifications: certifications.length ? (
      <section className="mb-4">
        {heading('certifications')}
        <div className="space-y-2">
          {certifications.map((cert) => (
            <article key={cert.id}>
              {entryHeader(
                cert.name,
                [cert.issuer, cert.credentialId && `ID ${cert.credentialId}`].filter(Boolean).join(' · '),
                cert.expiryDate ? `Expires ${formatDate(cert.expiryDate)}` : undefined,
                formatDate(cert.date)
              )}
            </article>
          ))}
        </div>
      </section>
    ) : null,
  };

  const contact = [personal.email, personal.phone, personal.location].filter(Boolean);
  const links = [
    { label: 'LinkedIn', href: personal.linkedin },
    { label: 'Portfolio', href: personal.website },
    { label: 'GitHub', href: personal.github },
  ].filter((l) => l.href);

  return (
    <div
      id={printable ? 'resume-content' : undefined}
      className={`bg-white px-10 py-9 font-sans text-neutral-900 print:px-0 print:py-0 ${className}`}
    >
      <header className={`mb-5 ${align}`}>
        <h1 className="text-[26px] font-bold leading-tight tracking-tight" style={{ color: primary }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {resume.experience?.[0]?.position && (
          <p className="mt-0.5 text-[13px] font-medium text-neutral-700">{resume.experience[0].position}</p>
        )}
        {(contact.length > 0 || links.length > 0) && (
          <div className={`mt-2 flex flex-wrap ${rowAlign} gap-x-2 gap-y-0.5 text-[11.5px] text-neutral-700`}>
            {[...contact.map((c) => <span key={c}>{c}</span>), ...links.map((l) => (
              <a key={l.label} href={l.href} className="hover:underline">
                {l.label}
              </a>
            ))].map((node, i) => (
              <span key={i} className="inline-flex gap-x-2">
                {i > 0 && <span aria-hidden className="text-neutral-400">|</span>}
                {node}
              </span>
            ))}
          </div>
        )}
      </header>

      {orderedSections(resume)
        .filter((key) => !isSectionHidden(resume, key))
        .map((key) => (
          <div key={key}>{sections[key]}</div>
        ))}
    </div>
  );
}
