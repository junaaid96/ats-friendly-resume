'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { forgetResume, listMyResumes, MyResume, MY_RESUMES_EVENT } from '@/lib/my-resumes';
import { getTemplate } from '@/lib/templates';
import { showToast } from '@/components/Toast';

/**
 * Resumes created in this browser. They're read from localStorage (together
 * with their edit tokens), so nobody else's resumes are ever listed here.
 */
export default function MyResumes() {
  const [resumes, setResumes] = useState<MyResume[] | null>(null);

  useEffect(() => {
    const refresh = () => setResumes(listMyResumes());
    refresh();
    window.addEventListener(MY_RESUMES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(MY_RESUMES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleDelete = async (resume: MyResume) => {
    if (!window.confirm(`Delete "${resume.fullName}"? The share link will stop working.`)) return;
    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: 'DELETE',
      headers: { 'x-edit-token': resume.editToken },
    });
    if (response.ok || response.status === 404) {
      forgetResume(resume.id);
      showToast('Resume deleted', 'success');
    } else {
      showToast('Could not delete this resume. Please try again.', 'error');
    }
  };

  if (resumes === null) return null;

  if (resumes.length === 0) {
    return (
      <section className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          Ready to start your journey?
        </h2>
        <p className="text-base text-gray-600 mb-8 max-w-md mx-auto font-light">
          Resumes you create are saved privately to this browser. Only you can edit them;
          anyone you share the link with can view them.
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-semibold text-base"
        >
          + Create your first resume
        </Link>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Your Resumes</h2>
          <p className="text-gray-600 font-light">
            Saved to this browser. Only you can edit or delete them.
          </p>
        </div>
        <div className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg font-semibold text-sm shrink-0">
          {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => {
          const template = getTemplate(resume.template);
          return (
            <article
              key={resume.id}
              className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-red-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ backgroundColor: template.colors.primary }}
                >
                  {resume.fullName.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                  {template.name}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-1 break-words">
                {resume.fullName}
              </h3>
              {resume.headline && (
                <p className="text-sm text-gray-600 mb-2 break-words">{resume.headline}</p>
              )}
              <p className="text-xs text-gray-500 mb-5">
                Updated{' '}
                {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 text-sm">
                <Link
                  href={`/resume/${resume.id}`}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  View
                </Link>
                <Link
                  href={`/resume/${resume.id}/edit`}
                  className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-700 transition-colors font-medium"
                >
                  Edit
                </Link>
                <Link
                  href={`/create?from=${resume.id}`}
                  className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-700 transition-colors font-medium"
                  title="Start a new resume from this one, e.g. to tailor it for a specific job"
                >
                  Duplicate
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(resume)}
                  className="ml-auto text-gray-500 hover:text-red-700 px-2 py-1.5 font-medium"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
