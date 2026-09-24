'use client';

import { useSyncExternalStore } from 'react';
import Icon from '@/components/ui/Icon';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Tiny global store so any component can call showToast() without context.
const store = {
  toasts: [] as Toast[],
  listeners: new Set<() => void>(),
  set(next: Toast[]) {
    store.toasts = next;
    store.listeners.forEach((l) => l());
  },
};

const EMPTY: Toast[] = [];

function dismiss(id: string) {
  store.set(store.toasts.filter((t) => t.id !== id));
}

export function showToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2, 11);
  store.set([...store.toasts.slice(-2), { id, message, type }]);
  setTimeout(() => dismiss(id), type === 'error' ? 6000 : 4000);
}

const TONE: Record<ToastType, { icon: 'check' | 'alert' | 'sparkles'; className: string }> = {
  success: { icon: 'check', className: 'bg-ok text-white' },
  error: { icon: 'alert', className: 'bg-brand text-white' },
  info: { icon: 'sparkles', className: 'bg-ink-2 text-white' },
};

export function ToastContainer() {
  const toasts = useSyncExternalStore(
    (listener) => {
      store.listeners.add(listener);
      return () => store.listeners.delete(listener);
    },
    () => store.toasts,
    () => EMPTY
  );

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end print:hidden"
    >
      {toasts.map((toast) => {
        const tone = TONE[toast.type];
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className="animate-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-pop"
          >
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${tone.className}`}>
              <Icon name={tone.icon} size={12} strokeWidth={2.5} />
            </span>
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded p-0.5 text-white/60 hover:text-white"
              aria-label="Dismiss"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
