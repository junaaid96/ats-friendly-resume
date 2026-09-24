'use client';

import { ReactNode } from 'react';
import Icon from '@/components/ui/Icon';

/** Collapsible card for one list entry (a job, a degree, a project...). */
export default function EntryCard({
  title,
  subtitle,
  open,
  onToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
  hasError,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  hasError?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-surface shadow-card transition-colors ${
        hasError ? 'border-red-300' : open ? 'border-line-strong' : 'border-line'
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <Icon
            name="chevronRight"
            size={16}
            className={`shrink-0 text-muted transition-transform ${open ? 'rotate-90' : ''}`}
          />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-ink">{title}</span>
            {subtitle && <span className="block truncate text-[13px] text-muted">{subtitle}</span>}
          </span>
          {hasError && !open && (
            <span className="ml-auto shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
              Needs attention
            </span>
          )}
        </button>
        <div className="flex shrink-0 items-center">
          {onMoveUp && (
            <button type="button" onClick={onMoveUp} className="rounded-lg p-1.5 text-muted hover:bg-paper-2 hover:text-ink" aria-label="Move up">
              <Icon name="chevronUp" size={16} />
            </button>
          )}
          {onMoveDown && (
            <button type="button" onClick={onMoveDown} className="rounded-lg p-1.5 text-muted hover:bg-paper-2 hover:text-ink" aria-label="Move down">
              <Icon name="chevronDown" size={16} />
            </button>
          )}
          <button type="button" onClick={onRemove} className="rounded-lg p-1.5 text-muted hover:bg-brand-soft hover:text-brand" aria-label="Remove">
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
      {open && <div className="border-t border-line px-4 pb-5 pt-4">{children}</div>}
    </div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong px-4 py-4 text-sm font-medium text-ink-2 transition-colors hover:border-ink/40 hover:bg-surface hover:text-ink"
    >
      <Icon name="plus" size={16} />
      {children}
    </button>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface/60 px-6 py-10 text-center">
      <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-paper-2 text-ink-2">{icon}</div>
      <p className="font-medium text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{text}</p>
    </div>
  );
}

export function move<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
