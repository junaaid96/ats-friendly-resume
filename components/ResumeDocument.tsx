import { ReactNode } from 'react';
import { Resume, SectionKey } from '@/types/resume';
import { getTemplate } from '@/lib/templates';
import { isSectionHidden, orderedSections, SECTION_LABELS } from '@/lib/sections';

/**
 * The printable resume. Shared by the resume page and the editor's live
 * preview so both always look the same. Pure markup, no hooks, so it works
 * in server and client components.
 */

export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  if (!year || !month) return dateString;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function ResumeDocument({ resume }: { resume: Partial<Resume> }) {
  const template = getTemplate(resume.template);
  const personal = resume.personalInfo || { fullName: '', email: '', phone: '', location: '' };
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const heading = (key: SectionKey, spacing = 'mb-2 print:mb-1') => (
    <h3
      className={`font-semibold ${spacing} uppercase print:text-black tracking-wide`}
      style={{ color: template.colors.primary }}
    >
      {SECTION_LABELS[key]}
    </h3>
  );

  const contact = [personal.email, personal.phone, personal.location].filter(Boolean);
  const links = [
    { label: 'LinkedIn', href: personal.linkedin },
    { label: 'Website', href: personal.website },
    { label: 'GitHub', href: personal.github },
  ].filter((l) => l.href);

  const sections: Record<SectionKey, ReactNode> = {
    summary: resume.summary ? (
      <section className="mb-4 print:mb-3">
        {heading('summary', 'mb-1 print:mb-0.5')}
        <p className="text-xs print:text-xs text-black leading-relaxed print:leading-snug font-light mt-1 print:mt-0.5 whitespace-pre-line">
          {resume.summary}
        </p>
      </section>
    ) : null,

    experience: experience.length ? (
      <section className="mb-4 print:mb-3">
        {heading('experience')}
        {experience.map((exp, idx) => (
          <div key={exp.id} className={idx < experience.length - 1 ? 'mb-2.5 print:mb-2' : 'mb-0'}>
            <div className="flex justify-between items-start mb-0.5 print:mb-0 gap-2">
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-sm print:text-xs text-black leading-tight">{exp.position}</h5>
                <p className="text-xs print:text-xs text-black font-medium leading-tight">{exp.company}</p>
              </div>
              <div className="text-right text-xs print:text-xs text-black leading-tight flex-shrink-0">
                <p className="whitespace-nowrap">{exp.location}</p>
                <p className="whitespace-nowrap">
                  {formatDate(exp.startDate)}
                  {(exp.startDate || exp.endDate || exp.current) && ' - '}
                  {exp.current ? 'Present' : formatDate(exp.endDate)}
                </p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-0.5 print:space-y-0 text-xs print:text-xs text-black ml-1 print:ml-0.5 leading-relaxed print:leading-snug">
              {(exp.responsibilities || [])
                .filter((r) => r.trim())
                .map((resp, i) => (
                  <li key={i} className="leading-relaxed print:leading-snug">{resp}</li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    ) : null,

    education: education.length ? (
      <section className="mb-4 print:mb-3">
        {heading('education')}
        {education.map((edu, idx) => (
          <div key={edu.id} className={idx < education.length - 1 ? 'mb-2 print:mb-1.5' : 'mb-0'}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-sm print:text-xs text-black leading-tight">
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                </h5>
                <p className="text-xs print:text-xs text-black leading-tight">{edu.institution}</p>
                {edu.gpa && <p className="text-xs print:text-xs text-black leading-tight">GPA: {edu.gpa}</p>}
              </div>
              <div className="text-right text-xs print:text-xs text-black leading-tight flex-shrink-0">
                <p className="whitespace-nowrap">{edu.location}</p>
                <p className="whitespace-nowrap">
                  {formatDate(edu.startDate)}
                  {edu.startDate && edu.endDate && ' - '}
                  {formatDate(edu.endDate)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    ) : null,

    skills: skills.length ? (
      <section className="mb-4 print:mb-3">
        {heading('skills', 'mb-1 print:mb-0.5')}
        <p className="text-xs print:text-xs text-black font-light leading-relaxed print:leading-snug mt-1 print:mt-0.5">
          {skills.join(' • ')}
        </p>
      </section>
    ) : null,

    projects: projects.length ? (
      <section className="mb-4 print:mb-3">
        {heading('projects')}
        {projects.map((project, idx) => (
          <div key={project.id} className={idx < projects.length - 1 ? 'mb-2 print:mb-1.5' : 'mb-0'}>
            <h5 className="font-bold text-sm print:text-xs text-black leading-tight">
              {project.name}
              {project.link && (
                <>
                  {' '}
                  <span className="text-black">-</span>{' '}
                  <a
                    href={project.link}
                    className="text-black hover:underline text-xs print:text-xs font-normal break-all"
                  >
                    {project.link}
                  </a>
                </>
              )}
            </h5>
            <p className="text-xs print:text-xs text-black mb-0.5 print:mb-0 leading-relaxed print:leading-snug mt-0.5 print:mt-0">
              {project.description}
            </p>
            {project.technologies?.length > 0 && (
              <p className="text-xs print:text-xs text-black leading-tight">
                <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </section>
    ) : null,

    certifications: certifications.length ? (
      <section className="mb-4 print:mb-3">
        {heading('certifications')}
        {certifications.map((cert, idx) => (
          <div key={cert.id} className={idx < certifications.length - 1 ? 'mb-1.5 print:mb-1' : 'mb-0'}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-sm print:text-xs text-black leading-tight">{cert.name}</h5>
                <p className="text-xs print:text-xs text-black leading-tight">{cert.issuer}</p>
                {cert.credentialId && (
                  <p className="text-xs print:text-xs text-black leading-tight">ID: {cert.credentialId}</p>
                )}
              </div>
              <div className="text-right text-xs print:text-xs text-black leading-tight flex-shrink-0">
                {cert.date && <p className="whitespace-nowrap">Issued: {formatDate(cert.date)}</p>}
                {cert.expiryDate && <p className="whitespace-nowrap">Expires: {formatDate(cert.expiryDate)}</p>}
              </div>
            </div>
          </div>
        ))}
      </section>
    ) : null,
  };

  const align =
    template.styles.headerAlign === 'center'
      ? 'text-center'
      : template.styles.headerAlign === 'right'
        ? 'text-right'
        : 'text-left';
  const rowAlign =
    template.styles.headerAlign === 'center'
      ? 'justify-center'
      : template.styles.headerAlign === 'right'
        ? 'justify-end'
        : 'justify-start';

  return (
    <div
      className="bg-white shadow-sm border border-gray-200 p-6 print:p-4 print:shadow-none print:border-0 rounded-xl print:rounded-none"
      id="resume-content"
    >
      <header className={`pb-2 mb-3 print:pb-1.5 print:mb-2 ${align}`}>
        <h1
          className="text-[1.5rem] print:text-[1.5rem] font-bold mb-1 print:mb-0.5 print:text-black tracking-tight"
          style={{ color: template.colors.primary }}
        >
          {personal.fullName || 'Your Name'}
        </h1>
        {contact.length > 0 && (
          <div className={`flex flex-wrap ${rowAlign} gap-x-3 gap-y-0.5 text-xs print:text-xs text-black leading-tight`}>
            {contact.map((item, i) => (
              <span key={i} className="flex gap-x-3">
                {i > 0 && <span aria-hidden>•</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className={`flex flex-wrap ${rowAlign} gap-x-3 gap-y-0.5 text-xs print:text-xs text-black mt-1 print:mt-0.5 leading-tight`}>
            {links.map((link, i) => (
              <span key={link.label} className="flex gap-x-3">
                {i > 0 && <span aria-hidden>•</span>}
                <a href={link.href} className="text-black hover:underline print:text-black">
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        )}
        <div
          className="mt-3 print:mt-2"
          style={{
            borderBottom:
              template.styles.sectionDivider !== 'space'
                ? `${template.styles.sectionDivider === 'border' ? '2px' : '1px'} solid ${template.colors.primary}`
                : 'none',
          }}
        />
      </header>

      {orderedSections(resume)
        .filter((key) => !isSectionHidden(resume, key))
        .map((key) => (
          <div key={key}>{sections[key]}</div>
        ))}
    </div>
  );
}
