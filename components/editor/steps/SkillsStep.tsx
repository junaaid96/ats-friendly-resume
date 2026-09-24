'use client';

import { KeyboardEvent, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { AiCard } from '@/components/editor/AiSuggestions';
import { StepProps } from '@/components/editor/types';
import { ai } from '@/lib/ai-client';
import { showToast } from '@/components/Toast';

export default function SkillsStep({ resume, update, errors, showError, touch }: StepProps) {
  const skills = resume.skills || [];
  const [input, setInput] = useState('');
  const [jobTitle, setJobTitle] = useState(resume.experience?.[0]?.position || '');
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);

  const has = (s: string) => skills.some((k) => k.toLowerCase() === s.toLowerCase());

  const addMany = (raw: string) => {
    const incoming = raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    const next = [...skills];
    for (const s of incoming) if (!next.some((k) => k.toLowerCase() === s.toLowerCase())) next.push(s);
    update({ skills: next });
    setInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addMany(input);
    } else if (e.key === 'Backspace' && !input && skills.length) {
      update({ skills: skills.slice(0, -1) });
    }
  };

  const suggest = async () => {
    if (!jobTitle.trim()) {
      showToast('Add a target job title first.', 'error');
      return;
    }
    setLoading(true);
    try {
      setSuggested(await ai.suggestSkills(jobTitle, skills));
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const error = showError('skills', errors.skills);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="skill-input" className="mb-1.5 block text-[13px] font-medium text-ink-2">
          Skills <span className="text-brand">*</span>
        </label>
        <div
          className={`field flex min-h-12 flex-wrap items-center gap-1.5 !p-2 ${error ? '!border-red-500' : ''}`}
          onClick={() => document.getElementById('skill-input')?.focus()}
        >
          {skills.map((skill, i) => (
            <span key={skill + i} className="inline-flex items-center gap-1 rounded-lg bg-paper-2 py-1 pl-2.5 pr-1 text-[13px] font-medium text-ink">
              {skill}
              <button type="button" onClick={() => update({ skills: skills.filter((_, j) => j !== i) })}
                className="rounded p-0.5 text-muted hover:bg-line hover:text-ink" aria-label={`Remove ${skill}`}>
                <Icon name="x" size={13} />
              </button>
            </span>
          ))}
          <input
            id="skill-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (input.trim()) addMany(input);
              touch('skills');
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData('text');
              if (/[,\n]/.test(text)) {
                e.preventDefault();
                addMany(text);
              }
            }}
            placeholder={skills.length ? 'Add more…' : 'Type a skill and press Enter'}
            className="min-w-40 flex-1 bg-transparent px-1.5 py-1 text-[15px] outline-none"
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted">Press Enter or comma to add. You can paste a comma-separated list. Aim for 8–15.</p>
        )}
      </div>

      <AiCard title="Skills recruiters look for">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <TextField label="Target job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Data Analyst" />
          <Button variant="ai" icon="sparkles" loading={loading} onClick={suggest}>
            Suggest skills
          </Button>
        </div>
        {suggested.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggested.map((s) =>
              has(s) ? (
                <span key={s} className="inline-flex items-center gap-1 rounded-lg bg-ok-soft px-2.5 py-1 text-[13px] font-medium text-ok">
                  <Icon name="check" size={13} /> {s}
                </span>
              ) : (
                <button key={s} type="button" onClick={() => addMany(s)}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-[13px] font-medium text-ink-2 hover:border-brand/40 hover:text-brand">
                  <Icon name="plus" size={13} /> {s}
                </button>
              )
            )}
          </div>
        )}
      </AiCard>
    </div>
  );
}
