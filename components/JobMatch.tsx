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

  const tone = !result ? '' : result.score >= 70 ? 'var(--color-ok)' : result.score >= 45 ? 'var(--color-warn)' : 'var(--color-brand)';

  return (
    <div>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={5}
        aria-label="Job description"
        placeholder="Paste a job description to compare…"
        className="field resize-y text-sm leading-relaxed"
      />
      <p className="mt-1.5 text-xs text-muted">Runs in your browser. Nothing is uploaded.</p>

      {result && (
        <div className="animate-rise mt-4 space-y-4">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-ink-2">Keyword coverage</span>
              <span className="font-display text-2xl font-semibold" style={{ color: tone }}>{result.score}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${result.score}%`, background: tone }} />
            </div>
          </div>

          {result.missing.length > 0 && (
            <div>
              <h4 className="mb-2 text-[13px] font-semibold text-ink">
                Missing <span className="font-normal text-muted">· add the ones that honestly apply</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((k) => (
                  <span key={k} className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-ink">{k}</span>
                ))}
              </div>
            </div>
          )}

          {result.matched.length > 0 && (
            <div>
              <h4 className="mb-2 text-[13px] font-semibold text-ink">Covered</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.matched.map((k) => (
                  <span key={k} className="rounded-md bg-ok-soft px-2 py-0.5 text-xs font-medium text-ok">{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
