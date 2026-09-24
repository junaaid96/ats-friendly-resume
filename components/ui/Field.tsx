'use client';

import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, useId } from 'react';

interface FieldShellProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  counter?: { value: number; min?: number; max?: number };
  className?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
}

/** Label, control, hint/error and optional character counter, wired up for screen readers. */
export function FieldShell({ label, hint, error, required, optional, counter, className = '', children }: FieldShellProps) {
  const id = useId();
  const messageId = `${id}-msg`;
  const tone =
    counter && counter.max && counter.value > counter.max
      ? 'text-red-600'
      : counter && counter.min && counter.value < counter.min
        ? 'text-muted'
        : 'text-ok';

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
          {label}
          {required && <span className="text-brand"> *</span>}
          {optional && <span className="font-normal text-muted"> (optional)</span>}
        </label>
        {counter && (
          <span className={`text-xs tabular-nums ${tone}`}>
            {counter.value}
            {counter.max ? ` / ${counter.max}` : ''}
          </span>
        )}
      </div>
      {children(id, error || hint ? messageId : undefined)}
      {error ? (
        <p id={messageId} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Base = Omit<FieldShellProps, 'children' | 'counter'> & { showCount?: boolean; min?: number; max?: number };

export function TextField({
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...props
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          className="field"
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function TextArea({
  label,
  hint,
  error,
  required,
  optional,
  className,
  showCount,
  min,
  max,
  value,
  ...props
}: Base & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & { value: string }) {
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={className}
      counter={showCount ? { value: value.trim().length, min, max } : undefined}
    >
      {(id, describedBy) => (
        <textarea
          id={id}
          value={value}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          className="field min-h-24 resize-y leading-relaxed"
          {...props}
        />
      )}
    </FieldShell>
  );
}
