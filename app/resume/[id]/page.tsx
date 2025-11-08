import { Resume } from '@/types/resume';
import Link from 'next/link';
import ShareResume from '@/components/ShareResume';
import PrintButton from '@/components/PrintButton';
import { getResumeById } from '@/lib/storage';

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link href="/" className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <PrintButton />
        </div>

        {/* ATS-Friendly Resume Display */}
        <div className="bg-white shadow-sm border border-gray-200 p-12 print:shadow-none rounded-xl" id="resume-content">
          {/* Header */}
          <header className="text-center border-b-2 border-red-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">{resume.personalInfo.fullName}</h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
              <span>{resume.personalInfo.email}</span>
              <span>•</span>
              <span>{resume.personalInfo.phone}</span>
              <span>•</span>
              <span>{resume.personalInfo.location}</span>
            </div>
            {(resume.personalInfo.linkedin ||
              resume.personalInfo.website ||
              resume.personalInfo.github) && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 mt-2">
                    {resume.personalInfo.linkedin && (
                  <>
                    <a
                      href={resume.personalInfo.linkedin}
                      className="text-red-600 hover:text-red-700 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </>
                )}
                {resume.personalInfo.website && (
                  <>
                    {resume.personalInfo.linkedin && <span>•</span>}
                    <a
                      href={resume.personalInfo.website}
                      className="text-red-600 hover:text-red-700 hover:underline"
                    >
                      Website
                    </a>
                  </>
                )}
                {resume.personalInfo.github && (
                  <>
                    {(resume.personalInfo.linkedin || resume.personalInfo.website) && (
                      <span>•</span>
                    )}
                    <a
                      href={resume.personalInfo.github}
                      className="text-red-600 hover:text-red-700 hover:underline"
                    >
                      GitHub
                    </a>
                  </>
                )}
              </div>
            )}
          </header>

          {/* Professional Summary */}
          {resume.summary && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-2 uppercase border-b border-red-200 pb-1 text-gray-900 tracking-wide">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed font-light">{resume.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-red-200 pb-1 text-gray-900 tracking-wide">
                Work Experience
              </h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{exp.location}</p>
                      <p>
                        {formatDate(exp.startDate)} -{' '}
                        {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 ml-2">
                    {exp.responsibilities
                      .filter((r) => r.trim())
                      .map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-red-200 pb-1 text-gray-900 tracking-wide">
                Education
              </h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{edu.location}</p>
                      <p>
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
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-2 uppercase border-b border-red-200 pb-1 text-gray-900 tracking-wide">
                Skills
              </h2>
              <p className="text-gray-700 font-light">{resume.skills.join(' • ')}</p>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-red-200 pb-1 text-gray-900 tracking-wide">
                Projects
              </h2>
              {resume.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h3 className="font-bold">
                    {project.name}
                    {project.link && (
                      <>
                        {' '}
                        -{' '}
                        <a
                          href={project.link}
                          className="text-red-600 hover:text-red-700 hover:underline text-sm font-normal"
                        >
                          {project.link}
                        </a>
                      </>
                    )}
                  </h3>
                  <p className="text-gray-800 mb-1">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600">
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
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-red-200 pb-1 text-gray-900 tracking-wide">
                Certifications
              </h2>
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{cert.name}</h3>
                      <p className="text-gray-700">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-600">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>Issued: {formatDate(cert.date)}</p>
                      {cert.expiryDate && <p>Expires: {formatDate(cert.expiryDate)}</p>}
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
