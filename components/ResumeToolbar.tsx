'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Resume } from '@/types/resume';
import { forgetResume, getEditToken, MY_RESUMES_EVENT } from '@/lib/my-resumes';
import { resumeToPlainText } from '@/lib/resume-text';
import { showToast } from '@/components/Toast';

const slug = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resume';

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function subscribe(onChange: () => void) {
  window.addEventListener(MY_RESUMES_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(MY_RESUMES_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const button =
  'px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-colors';

export default function ResumeToolbar({ resume, color }: { resume: Resume; color: string }) {
  const router = useRouter();
  // Only the browser that created the resume holds its edit token.
  const editToken = useSyncExternalStore(
    subscribe,
    () => getEditToken(resume.id),
    () => null
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const name = slug(resume.personalInfo.fullName);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(resumeToPlainText(resume));
      showToast('Plain-text resume copied', 'success');
    } catch {
      showToast('Copy failed. Try the .txt download instead.', 'error');
    }
  };

  const exportJson = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...data } = resume;
    download(`${name}.json`, JSON.stringify(data, null, 2), 'application/json');
  };

  const handleDelete = async () => {
    if (!editToken) return;
    if (!window.confirm('Delete this resume? The share link will stop working.')) return;
    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: 'DELETE',
      headers: { 'x-edit-token': editToken },
    });
    if (response.ok) {
      forgetResume(resume.id);
      showToast('Resume deleted', 'success');
      router.push('/');
    } else {
      showToast('Could not delete this resume.', 'error');
    }
  };

  return (
    <div className="mb-4 flex flex-wrap justify-between items-center gap-3 print:hidden">
      <Link
        href="/"
        className="font-medium text-sm flex items-center gap-1 hover:underline"
        style={{ color }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {editToken && (
          <Link href={`/resume/${resume.id}/edit`} className={button}>
            Edit
          </Link>
        )}
        <div className="relative">
          <button
            type="button"
            className={button}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            Export ▾
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-20 py-1 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={copyText}>
                Copy as plain text
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
                onClick={() => download(`${name}.txt`, resumeToPlainText(resume), 'text/plain')}
              >
                Download .txt (ATS)
              </button>
              <button type="button" className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={exportJson}>
                Download .json (backup)
              </button>
              <Link href={`/create?from=${resume.id}`} className="block px-4 py-2 hover:bg-gray-50">
                Duplicate as new resume
              </Link>
              {editToken && (
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 border-t border-gray-100"
                  onClick={handleDelete}
                >
                  Delete resume
                </button>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90 font-medium text-sm"
          style={{ backgroundColor: color }}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
