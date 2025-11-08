import { Resume } from '@/types/resume';
import Link from 'next/link';

async function getResume(id: string): Promise<Resume | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/resumes/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
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
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print / Save as PDF
          </button>
        </div>

        {/* ATS-Friendly Resume Display */}
        <div className="bg-white shadow-lg p-12 print:shadow-none" id="resume-content">
          {/* Header */}
          <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-3xl font-bold mb-2">{resume.personalInfo.fullName}</h1>
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
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
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
              <h2 className="text-xl font-bold mb-2 uppercase border-b border-gray-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-800 leading-relaxed">{resume.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-300 pb-1">
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
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-300 pb-1">
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
              <h2 className="text-xl font-bold mb-2 uppercase border-b border-gray-300 pb-1">
                Skills
              </h2>
              <p className="text-gray-800">{resume.skills.join(' • ')}</p>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-300 pb-1">
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
                          className="text-blue-600 hover:underline text-sm font-normal"
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
              <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-300 pb-1">
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
        <div className="mt-6 p-4 bg-blue-50 rounded print:hidden">
          <h3 className="font-semibold mb-2">Share this resume:</h3>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="flex-1 border p-2 rounded bg-white"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
