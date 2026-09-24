'use client';

import { ReactNode } from 'react';
import Icon from '@/components/ui/Icon';

/** Shared look for inline AI helpers: a soft card with a header and pickable results. */
export function AiCard({ title, children, onClose }: { title: string; children: ReactNode; onClose?: () => void }) {
  return (
    <div className="animate-rise rounded-2xl border border-brand/20 bg-gradient-to-b from-brand-soft/70 to-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-brand-ink">
          <Icon name="sparkles" size={15} />
          {title}
        </p>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-md p-1 text-muted hover:text-ink" aria-label="Close suggestions">
            <Icon name="x" size={15} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function SuggestionList({
  items,
  actionLabel = 'Use this',
  onPick,
}: {
  items: string[];
  actionLabel?: string;
  onPick: (value: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => onPick(item)}
            className="group w-full rounded-xl border border-line bg-surface p-3 text-left text-sm leading-relaxed text-ink-2 transition-colors hover:border-brand/40 hover:text-ink"
          >
            {item}
            <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand opacity-70 group-hover:opacity-100">
              <Icon name="check" size={13} /> {actionLabel}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
