'use client';

import { useState } from 'react';
import { Resume } from '@/types/resume';
import { ai, AtsAnalysis } from '@/lib/ai-client';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { showToast } from '@/components/Toast';

function ScoreRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const color = score >= 80 ? 'var(--color-ok)' : score >= 60 ? 'var(--color-warn)' : 'var(--color-brand)';
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-line)" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="text-center leading-none">
          <span className="block font-display text-2xl font-semibold text-ink">{score}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">of 100</span>
        </span>
      </span>
    </div>
  );
}

/** AI review of how well an applicant tracking system can read the resume. */
export default function AtsScore({ resume, compact = false }: { resume: Partial<Resume>; compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);

  const run = async () => {
    if (!resume.summary && !resume.experience?.length) {
      showToast('Add a summary or some experience first.', 'error');
      return;
    }
    setLoading(true);
    try {
      setAnalysis(await ai.analyzeAts(resume));
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <div className={`flex flex-col gap-4 ${compact ? '' : 'sm:flex-row sm:items-center sm:justify-between'}`}>
        <p className="text-sm text-muted">
          An AI reviewer scores how readable your resume is for applicant tracking systems and lists concrete fixes.
        </p>
        <Button variant="ai" icon="sparkles" loading={loading} onClick={run} className="shrink-0">
          {loading ? 'Analysing…' : 'Get ATS score'}
        </Button>
      </div>
    );
  }

  const label = analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good, with room to improve' : 'Needs work';

  return (
    <div className="animate-rise space-y-5">
      <div className="flex items-center gap-5">
        <ScoreRing score={analysis.score} />
        <div>
          <p className="font-display text-xl font-semibold text-ink">{label}</p>
          <p className="mt-1 text-sm text-muted">Scores change as you edit, so run it again after making fixes.</p>
          <button type="button" onClick={run} disabled={loading}
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline disabled:opacity-50">
            <Icon name="refresh" size={14} /> {loading ? 'Re-checking…' : 'Check again'}
          </button>
        </div>
      </div>

      {analysis.suggestions?.length > 0 && (
        <div>
          <h4 className="mb-2 text-[13px] font-semibold text-ink">What to improve</h4>
          <ol className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-paper-2/70 p-3 text-sm leading-relaxed text-ink-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-surface text-[11px] font-semibold text-ink">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {analysis.keywords?.length > 0 && (
        <div>
          <h4 className="mb-2 text-[13px] font-semibold text-ink">Keywords to consider</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.map((k) => (
              <span key={k} className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[13px] text-ink-2">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
