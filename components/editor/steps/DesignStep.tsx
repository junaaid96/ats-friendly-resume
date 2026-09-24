'use client';

import { useState } from 'react';
import { SectionKey } from '@/types/resume';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { AiCard } from '@/components/editor/AiSuggestions';
import { StepProps } from '@/components/editor/types';
import { getTemplate, templates } from '@/lib/templates';
import { isSectionHidden, orderedSections, SECTION_LABELS } from '@/lib/sections';
import { ai } from '@/lib/ai-client';
import { showToast } from '@/components/Toast';

function TemplateThumb({ color, align }: { color: string; align: 'left' | 'center' | 'right' }) {
  const x = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className="aspect-[8.5/11] w-full rounded-md border border-line bg-white p-2.5 shadow-sm">
      <div className={`h-1.5 w-1/2 rounded-full ${x}`} style={{ background: color }} />
      <div className={`mt-1 h-1 w-2/3 rounded-full bg-neutral-200 ${x}`} />
      {[0, 1, 2].map((n) => (
        <div key={n} className="mt-2.5">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1/4 rounded-full" style={{ background: color }} />
            <div className="h-px flex-1" style={{ background: color, opacity: 0.4 }} />
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-neutral-200" />
          <div className="mt-0.5 h-1 w-5/6 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

export default function DesignStep({ resume, update }: StepProps) {
  const current = getTemplate(resume.template);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{ templateId: string; reason: string } | null>(null);

  const order = orderedSections(resume);
  const hidden = resume.settings?.hiddenSections || [];
  const setLayout = (sectionOrder: SectionKey[], hiddenSections: SectionKey[]) =>
    update({ settings: { ...resume.settings, sectionOrder, hiddenSections } });

  const recommend = async () => {
    setLoading(true);
    try {
      setRecommendation(await ai.recommendTemplate(resume));
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">Template</h3>
            <p className="text-[13px] text-muted">
              Selected: <span className="font-medium text-ink-2">{current.name}</span>
            </p>
          </div>
          <Button variant="secondary" size="sm" icon="sparkles" loading={loading} onClick={recommend}>
            Recommend one for me
          </Button>
        </div>

        {recommendation && (
          <div className="mb-4">
            <AiCard title={`Try ${getTemplate(recommendation.templateId).name}`} onClose={() => setRecommendation(null)}>
              <p className="text-sm text-ink-2">{recommendation.reason}</p>
              <Button className="mt-3" size="sm" variant="ai" icon="check"
                onClick={() => { update({ template: recommendation.templateId }); setRecommendation(null); }}>
                Apply template
              </Button>
            </AiCard>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {templates.map((t) => {
            const selected = t.id === current.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => update({ template: t.id })}
                aria-pressed={selected}
                className={`group rounded-xl border p-2 text-left transition-all ${
                  selected ? 'border-ink bg-surface shadow-card ring-1 ring-ink' : 'border-line bg-surface/60 hover:border-line-strong hover:bg-surface'
                }`}
              >
                <TemplateThumb color={t.colors.primary} align={t.styles.headerAlign} />
                <span className="mt-2 flex items-center gap-1.5 px-0.5 text-[13px] font-medium text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.colors.primary }} />
                  <span className="truncate">{t.name}</span>
                  {selected && <Icon name="check" size={14} className="ml-auto text-ink" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-ink">Section order</h3>
        <p className="mb-4 text-[13px] text-muted">
          Put your strongest section first. Hidden sections keep their content but are left off the page.
        </p>
        <ol className="overflow-hidden rounded-2xl border border-line bg-surface">
          {order.map((key, index) => {
            const isHidden = isSectionHidden(resume, key);
            const swap = (delta: -1 | 1) => {
              const next = [...order];
              [next[index], next[index + delta]] = [next[index + delta], next[index]];
              setLayout(next, hidden);
            };
            return (
              <li key={key} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
                <span className="w-5 text-center font-mono text-xs text-muted">{index + 1}</span>
                <span className={`flex-1 text-sm font-medium ${isHidden ? 'text-muted line-through' : 'text-ink'}`}>
                  {SECTION_LABELS[key]}
                </span>
                <button type="button" aria-pressed={!isHidden}
                  onClick={() => setLayout(order, isHidden ? hidden.filter((k) => k !== key) : [...hidden, key])}
                  className="rounded-lg p-1.5 text-muted hover:bg-paper-2 hover:text-ink"
                  aria-label={`${isHidden ? 'Show' : 'Hide'} ${SECTION_LABELS[key]}`} title={isHidden ? 'Show' : 'Hide'}>
                  <Icon name={isHidden ? 'eyeOff' : 'eye'} size={16} />
                </button>
                <button type="button" disabled={index === 0} onClick={() => swap(-1)}
                  className="rounded-lg p-1.5 text-muted hover:bg-paper-2 hover:text-ink disabled:opacity-30"
                  aria-label={`Move ${SECTION_LABELS[key]} up`}>
                  <Icon name="chevronUp" size={16} />
                </button>
                <button type="button" disabled={index === order.length - 1} onClick={() => swap(1)}
                  className="rounded-lg p-1.5 text-muted hover:bg-paper-2 hover:text-ink disabled:opacity-30"
                  aria-label={`Move ${SECTION_LABELS[key]} down`}>
                  <Icon name="chevronDown" size={16} />
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
