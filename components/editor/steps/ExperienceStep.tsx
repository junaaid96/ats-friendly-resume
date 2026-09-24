'use client';

import { useState } from 'react';
import { WorkExperience } from '@/types/resume';
import { TextField } from '@/components/ui/Field';
import Icon, { Spinner } from '@/components/ui/Icon';
import EntryCard, { AddButton, EmptyState, move } from '@/components/editor/EntryCard';
import { AiCard, SuggestionList } from '@/components/editor/AiSuggestions';
import { newId, StepProps } from '@/components/editor/types';
import { formatDate } from '@/components/ResumeDocument';
import { ai } from '@/lib/ai-client';
import { showToast } from '@/components/Toast';

const blank = (): WorkExperience => ({
  id: newId('exp'),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  responsibilities: [''],
});

export default function ExperienceStep({ resume, update, errors, showError, touch }: StepProps) {
  const list = resume.experience || [];
  const [openId, setOpenId] = useState<string | null>(list[0]?.id ?? null);
  const [improving, setImproving] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{ key: string; items: string[] } | null>(null);

  const setList = (experience: WorkExperience[]) => update({ experience });
  const patch = (index: number, value: Partial<WorkExperience>) =>
    setList(list.map((e, i) => (i === index ? { ...e, ...value } : e)));
  const setBullet = (index: number, b: number, value: string) =>
    patch(index, { responsibilities: list[index].responsibilities.map((r, j) => (j === b ? value : r)) });

  const add = () => {
    const entry = blank();
    setList([...list, entry]);
    setOpenId(entry.id);
  };

  const improve = async (index: number, b: number) => {
    const exp = list[index];
    const bullet = exp.responsibilities[b];
    if (!bullet.trim()) {
      showToast('Write a rough version first, then let AI polish it.', 'error');
      return;
    }
    const key = `${exp.id}:${b}`;
    setImproving(key);
    try {
      setSuggestions({ key, items: await ai.improveBullet(bullet, exp.position || 'professional') });
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setImproving(null);
    }
  };

  if (!list.length) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={<Icon name="briefcase" />}
          title="No work experience yet"
          text="Add your jobs, internships or freelance work. Students can skip this and lean on projects instead."
        />
        <AddButton onClick={add}>Add a position</AddButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((exp, i) => {
        const e = errors.experience?.[i];
        const err = (field: keyof NonNullable<typeof e>) =>
          showError(`experience.${i}.${field}`, e?.[field] as string | undefined);
        const dates = [formatDate(exp.startDate), exp.current ? 'Present' : formatDate(exp.endDate)].filter(Boolean).join(' – ');

        return (
          <EntryCard
            key={exp.id}
            title={exp.position || 'New position'}
            subtitle={[exp.company, dates].filter(Boolean).join(' · ')}
            open={openId === exp.id}
            onToggle={() => setOpenId(openId === exp.id ? null : exp.id)}
            onRemove={() => setList(list.filter((_, j) => j !== i))}
            onMoveUp={i > 0 ? () => setList(move(list, i, -1)) : undefined}
            onMoveDown={i < list.length - 1 ? () => setList(move(list, i, 1)) : undefined}
            hasError={!!e && Object.keys(e).length > 0 && !!showError(`experience.${i}`, 'x')}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Job title" required value={exp.position} placeholder="Software Engineer"
                onChange={(ev) => patch(i, { position: ev.target.value })} onBlur={() => touch(`experience.${i}.position`)} error={err('position')} />
              <TextField label="Company" required value={exp.company} placeholder="Acme Inc."
                onChange={(ev) => patch(i, { company: ev.target.value })} onBlur={() => touch(`experience.${i}.company`)} error={err('company')} />
              <TextField label="Location" required value={exp.location} placeholder="Remote or City, Country" className="sm:col-span-2"
                onChange={(ev) => patch(i, { location: ev.target.value })} onBlur={() => touch(`experience.${i}.location`)} error={err('location')} />
              <TextField label="Start" required type="month" value={exp.startDate} placeholder="YYYY-MM"
                onChange={(ev) => patch(i, { startDate: ev.target.value })} onBlur={() => touch(`experience.${i}.startDate`)} error={err('startDate')} />
              <div>
                {exp.current ? (
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-ink-2">End</p>
                    <p className="field flex items-center bg-paper-2 text-ink-2">Present</p>
                  </div>
                ) : (
                  <TextField label="End" required type="month" value={exp.endDate} placeholder="YYYY-MM"
                    onChange={(ev) => patch(i, { endDate: ev.target.value })} onBlur={() => touch(`experience.${i}.endDate`)} error={err('endDate')} />
                )}
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
                  <input type="checkbox" className="h-4 w-4 accent-[var(--color-brand)]" checked={exp.current}
                    onChange={(ev) => patch(i, { current: ev.target.checked, endDate: ev.target.checked ? '' : exp.endDate })} />
                  I currently work here
                </label>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-baseline justify-between">
                <h4 className="text-[13px] font-medium text-ink-2">
                  What you achieved <span className="text-brand">*</span>
                </h4>
                <span className="text-xs text-muted">3–5 bullets work best</span>
              </div>
              <ul className="space-y-2">
                {exp.responsibilities.map((bullet, b) => {
                  const key = `${exp.id}:${b}`;
                  const bulletError = showError(`experience.${i}`, e?.responsibilities?.[b]);
                  return (
                    <li key={b}>
                      <div className="flex items-start gap-2">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                        <textarea
                          rows={2}
                          value={bullet}
                          aria-label={`Achievement ${b + 1}`}
                          aria-invalid={!!bulletError}
                          placeholder="Cut page load time by 40% by moving images to a CDN and lazy loading below-the-fold content"
                          onChange={(ev) => setBullet(i, b, ev.target.value)}
                          className="field min-h-0 flex-1 resize-y py-2 text-sm leading-relaxed"
                        />
                        <div className="flex flex-col gap-1 pt-1">
                          <button type="button" onClick={() => improve(i, b)} disabled={improving === key}
                            className="grid h-8 w-8 place-items-center rounded-lg text-brand hover:bg-brand-soft disabled:opacity-60"
                            aria-label="Improve with AI" title="Improve with AI">
                            {improving === key ? <Spinner size={15} /> : <Icon name="sparkles" size={16} />}
                          </button>
                          {exp.responsibilities.length > 1 && (
                            <button type="button"
                              onClick={() => patch(i, { responsibilities: exp.responsibilities.filter((_, j) => j !== b) })}
                              className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-paper-2 hover:text-ink"
                              aria-label="Remove bullet" title="Remove">
                              <Icon name="x" size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                      {bulletError && <p className="ml-4 mt-1 text-xs font-medium text-red-600">{bulletError}</p>}
                      {suggestions?.key === key && (
                        <div className="ml-4 mt-2">
                          <AiCard title="Stronger versions" onClose={() => setSuggestions(null)}>
                            <SuggestionList items={suggestions.items} actionLabel="Replace bullet"
                              onPick={(value) => { setBullet(i, b, value); setSuggestions(null); }} />
                          </AiCard>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <button type="button" onClick={() => patch(i, { responsibilities: [...exp.responsibilities, ''] })}
                className="ml-4 mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-ink-2 hover:bg-paper-2 hover:text-ink">
                <Icon name="plus" size={14} /> Add bullet
              </button>
            </div>
          </EntryCard>
        );
      })}
      <AddButton onClick={add}>Add another position</AddButton>
    </div>
  );
}
