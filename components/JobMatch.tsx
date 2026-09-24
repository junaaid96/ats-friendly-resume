'use client';

import { useMemo, useState } from 'react';
import { Resume } from '@/types/resume';
import { matchJobDescription } from '@/lib/resume-text';

/**
 * Paste a job description and see which of its keywords the resume already
 * covers. Runs entirely in the browser, so the job text is never uploaded.
 */
export default function JobMatch({ resume }: { resume: Resume }) {
  const [jobDescription, setJobDescription] = useState('');
  const result = useMemo(
    () => (jobDescription.trim().length > 40 ? matchJobDescription(resume, jobDescription) : null),
    [resume, jobDescription]
  );

  const tone =
    !result ? '' : result.score >= 70 ? 'text-green-700' : result.score >= 45 ? 'text-amber-600' : 'text-red-600';
  const bar =
    !result ? '' : result.score >= 70 ? 'bg-green-500' : result.score >= 45 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <section className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm print:hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h2 className="text-lg font-semibold text-gray-900">Job match checker</h2>
        <span className="text-xs text-gray-500">Runs in your browser, nothing is uploaded</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Paste a job description to see which of its key terms your resume already mentions.
      </p>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        placeholder="Paste the job description here…"
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />

      {result && (
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">Keyword coverage</span>
              <span className={`text-2xl font-bold ${tone}`}>{result.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full ${bar} transition-all`} style={{ width: `${result.score}%` }} />
            </div>
          </div>

          {result.missing.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Missing ({result.missing.length}): add the ones that honestly apply to you
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((k) => (
                  <span key={k} className="px-2 py-1 rounded-md text-xs bg-red-50 text-red-700 border border-red-100">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.matched.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Already covered ({result.matched.length})</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.matched.map((k) => (
                  <span key={k} className="px-2 py-1 rounded-md text-xs bg-green-50 text-green-700 border border-green-100">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
