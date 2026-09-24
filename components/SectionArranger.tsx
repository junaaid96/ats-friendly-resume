'use client';

import { Resume, ResumeSettings, SectionKey } from '@/types/resume';
import { isSectionHidden, orderedSections, SECTION_LABELS } from '@/lib/sections';

interface Props {
  resume: Partial<Resume>;
  onChange: (settings: ResumeSettings) => void;
}

/** Reorder resume sections and hide the ones that don't fit a given application. */
export default function SectionArranger({ resume, onChange }: Props) {
  const order = orderedSections(resume);
  const hidden = resume.settings?.hiddenSections || [];

  const move = (index: number, delta: -1 | 1) => {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...resume.settings, sectionOrder: next, hiddenSections: hidden });
  };

  const toggle = (key: SectionKey) => {
    const nextHidden = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key];
    onChange({ ...resume.settings, sectionOrder: order, hiddenSections: nextHidden });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 text-gray-900">Section Layout</h2>
      <p className="text-sm text-gray-600 mb-4">
        Put your strongest section first. Hidden sections keep their content but aren&apos;t shown.
      </p>
      <ol className="space-y-2">
        {order.map((key, index) => {
          const isHidden = isSectionHidden(resume, key);
          return (
            <li
              key={key}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                isHidden ? 'border-dashed border-gray-300 bg-gray-50 text-gray-400' : 'border-gray-200 bg-white text-gray-800'
              }`}
            >
              <span className="w-5 text-xs font-mono text-gray-400">{index + 1}</span>
              <span className={`flex-1 text-sm font-medium ${isHidden ? 'line-through' : ''}`}>
                {SECTION_LABELS[key]}
              </span>
              <button
                type="button"
                onClick={() => toggle(key)}
                className="text-xs font-medium px-2 py-1 rounded-md border border-gray-200 hover:border-red-300 hover:text-red-700"
                aria-pressed={!isHidden}
              >
                {isHidden ? 'Show' : 'Hide'}
              </button>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="w-7 h-7 rounded-md border border-gray-200 hover:border-red-300 disabled:opacity-30"
                aria-label={`Move ${SECTION_LABELS[key]} up`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                className="w-7 h-7 rounded-md border border-gray-200 hover:border-red-300 disabled:opacity-30"
                aria-label={`Move ${SECTION_LABELS[key]} down`}
              >
                ↓
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
