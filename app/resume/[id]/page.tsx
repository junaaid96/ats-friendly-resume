import { Resume } from '@/types/resume';
import Link from 'next/link';
import ShareResume from '@/components/ShareResume';
import PrintButton from '@/components/PrintButton';
import { getResumeById } from '@/lib/storage';

// Force dynamic rendering to prevent caching stale data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getResume(id: string): Promise<Resume | null> {
  try {
    const resume = await getResumeById(id);
    return resume;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResume(id);

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Resume Not Found</h1>
        <Link href="/" className="text-red-600 hover:text-red-700 hover:underline mt-4 inline-block font-medium">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-50 print:bg-white py-4 print:py-0">
      <div className="max-w-4xl mx-auto px-4 print:px-0 print:bg-white">
        <div className="mb-4 flex justify-between items-center print:hidden">
          <Link href="/" className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <PrintButton />
        </div>

        {/* ATS-Friendly Resume Display */}
        <div className="bg-white shadow-sm border border-gray-200 p-6 print:p-4 print:shadow-none print:border-0 rounded-xl print:rounded-none" id="resume-content">
          {/* Header */}
          <header className="text-center pb-2 mb-3 print:pb-1.5 print:mb-2">
            <h1 className="text-[1.5rem] print:text-[1.5rem] font-bold mb-1 print:mb-0.5 text-black tracking-tight">{resume.personalInfo.fullName}</h1>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs print:text-xs text-black leading-tight">
              <span>{resume.personalInfo.email}</span>
              <span className="text-black">•</span>
              <span>{resume.personalInfo.phone}</span>
              <span className="text-black">•</span>
              <span>{resume.personalInfo.location}</span>
            </div>
            {(resume.personalInfo.linkedin ||
              resume.personalInfo.website ||
              resume.personalInfo.github) && (
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs print:text-xs text-black mt-1 print:mt-0.5 leading-tight">
                    {resume.personalInfo.linkedin && (
                  <>
                    <a
                      href={resume.personalInfo.linkedin}
                      className="text-black hover:underline print:text-black"
                    >
                      LinkedIn
                    </a>
                  </>
                )}
                {resume.personalInfo.website && (
                  <>
                    {resume.personalInfo.linkedin && <span className="text-black">•</span>}
                    <a
                      href={resume.personalInfo.website}
                      className="text-black hover:underline print:text-black"
                    >
                      Website
                    </a>
                  </>
                )}
                {resume.personalInfo.github && (
                  <>
                    {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
                      <span className="text-black">•</span>
                    )}
                    <a
                      href={resume.personalInfo.github}
                      className="text-black hover:underline print:text-black"
                    >
                      GitHub
                    </a>
                  </>
                )}
              </div>
            )}
            {/* Subtle horizontal line separator */}
            <div className="border-b border-gray-300 mt-3 print:mt-2"></div>
          </header>

          {/* Professional Summary */}
          {resume.summary && (
            <section className="mb-3 print:mb-2">
              <h3 className="font-semibold mb-1 print:mb-0.5 uppercase text-black tracking-wide">
                Professional Summary
              </h3>
              <p className="text-xs print:text-xs text-black leading-relaxed print:leading-snug font-light mt-1 print:mt-0.5">{resume.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="mb-3 print:mb-2">
              <h3 className="font-semibold mb-2 print:mb-1 uppercase text-black tracking-wide">
                Work Experience
              </h3>
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className={idx < resume.experience.length - 1 ? "mb-2.5 print:mb-2" : "mb-0"}>
                  <div className="flex justify-between items-start mb-0.5 print:mb-0 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm print:text-xs text-black leading-tight">{exp.position}</h3>
                      <p className="text-xs print:text-xs text-black font-medium leading-tight">{exp.company}</p>
                    </div>
                    <div className="text-right text-xs print:text-xs text-black leading-tight flex-shrink-0">
                      <p className="whitespace-nowrap">{exp.location}</p>
                      <p className="whitespace-nowrap">
                        {formatDate(exp.startDate)} -{' '}
                        {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 print:space-y-0 text-xs print:text-xs text-black ml-1 print:ml-0.5 leading-relaxed print:leading-snug">
                    {exp.responsibilities
                      .filter((r) => r.trim())
                      .map((resp, idx) => (
                        <li key={idx} className="leading-relaxed print:leading-snug">{resp}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section className="mb-3 print:mb-2">
              <h3 className="font-semibold mb-2 print:mb-1 uppercase text-black tracking-wide">
                Education
              </h3>
              {resume.education.map((edu, idx) => (
                <div key={edu.id} className={idx < resume.education.length - 1 ? "mb-2 print:mb-1.5" : "mb-0"}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm print:text-xs text-black leading-tight">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-xs print:text-xs text-black leading-tight">{edu.institution}</p>
                      {edu.gpa && <p className="text-xs print:text-xs text-black leading-tight">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-xs print:text-xs text-black leading-tight flex-shrink-0">
                      <p className="whitespace-nowrap">{edu.location}</p>
                      <p className="whitespace-nowrap">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="mb-3 print:mb-2">
              <h3 className="font-semibold mb-1 print:mb-0.5 uppercase text-black tracking-wide">
                Skills
              </h3>
              <p className="text-xs print:text-xs text-black font-light leading-relaxed print:leading-snug mt-1 print:mt-0.5">{resume.skills.join(' • ')}</p>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-3 print:mb-2">
              <h3 className="font-semibold mb-2 print:mb-1 uppercase text-black tracking-wide">
                Projects
              </h3>
              {resume.projects.map((project, idx) => (
                <div key={project.id} className={idx < resume.projects.length - 1 ? "mb-2 print:mb-1.5" : "mb-0"}>
                  <h3 className="font-bold text-sm print:text-xs text-black leading-tight">
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
                  </h3>
                  <p className="text-xs print:text-xs text-black mb-0.5 print:mb-0 leading-relaxed print:leading-snug mt-0.5 print:mt-0">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-xs print:text-xs text-black leading-tight">
                      <span className="font-medium">Technologies:</span>{' '}
                      {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section className="mb-0 print:mb-0">
              <h3 className="font-semibold mb-2 print:mb-1 uppercase text-black tracking-wide">
                Certifications
              </h3>
              {resume.certifications.map((cert, idx) => (
                <div key={cert.id} className={idx < resume.certifications.length - 1 ? "mb-1.5 print:mb-1" : "mb-0"}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm print:text-xs text-black leading-tight">{cert.name}</h3>
                      <p className="text-xs print:text-xs text-black leading-tight">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-xs print:text-xs text-black leading-tight">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    <div className="text-right text-xs print:text-xs text-black leading-tight flex-shrink-0">
                      <p className="whitespace-nowrap">Issued: {formatDate(cert.date)}</p>
                      {cert.expiryDate && <p className="whitespace-nowrap">Expires: {formatDate(cert.expiryDate)}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Share Link */}
        <ShareResume resumeId={id} />
      </div>
    </div>
  );
}
