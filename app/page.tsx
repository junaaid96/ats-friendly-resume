import { Resume } from '@/types/resume';
import Link from 'next/link';

async function getResumes(): Promise<Resume[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/resumes`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
}

export default async function Home() {
  const resumes = await getResumes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ATS-Friendly Resume Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create professional, ATS-optimized resumes that get noticed by recruiters
          </p>
          <Link
            href="/create"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            + Create New Resume
          </Link>
        </header>

        {resumes.length > 0 ? (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">All Resumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Link
                  key={resume.id}
                  href={`/resume/${resume.id}`}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-400"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {resume.personalInfo.fullName}
                  </h3>
                  <p className="text-gray-600 mb-2">{resume.personalInfo.email}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {resume.personalInfo.location}
                  </p>
                  {resume.experience && resume.experience.length > 0 && (
                    <p className="text-sm font-medium text-blue-600">
                      {resume.experience[0].position} at {resume.experience[0].company}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-4">
                    Created: {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first ATS-friendly resume to get started
            </p>
            <Link
              href="/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Create Your First Resume
            </Link>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-600">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              What is ATS-Friendly?
            </h3>
            <p className="text-left max-w-3xl mx-auto mb-4">
              <span className="font-semibold">ATS (Applicant Tracking System)</span> is
              software used by employers to filter and rank resumes. An ATS-friendly
              resume is formatted to be easily parsed by these systems, increasing your
              chances of getting noticed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-2 text-blue-600">
                  ✓ Clean Formatting
                </h4>
                <p className="text-sm text-gray-600">
                  Simple, structured layout that ATS can easily read and parse
                </p>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-2 text-blue-600">
                  ✓ Standard Sections
                </h4>
                <p className="text-sm text-gray-600">
                  Common section headers that ATS recognizes and categorizes correctly
                </p>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-2 text-blue-600">
                  ✓ Keyword Optimized
                </h4>
                <p className="text-sm text-gray-600">
                  Structured fields for skills and experience that match job descriptions
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
