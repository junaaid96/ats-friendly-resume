'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { forgetResume, listMyResumes, MyResume, MY_RESUMES_EVENT } from '@/lib/my-resumes';
import { getTemplate } from '@/lib/templates';
import { showToast } from '@/components/Toast';
import Icon from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';

function subscribe(onChange: () => void) {
  window.addEventListener(MY_RESUMES_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(MY_RESUMES_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

// useSyncExternalStore needs a stable snapshot, so cache the parsed list by its raw value.
let cache: { raw: string | null; list: MyResume[] } = { raw: null, list: [] };
function snapshot(): MyResume[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem('arvix:my-resumes');
  } catch {
    // storage blocked
  }
  if (raw !== cache.raw) cache = { raw, list: listMyResumes() };
  return cache.list;
}

/**
 * Resumes created in this browser. They're read from localStorage (together
 * with their edit tokens), so nobody else's resumes are ever listed here.
 */
export default function MyResumes() {
  const resumes = useSyncExternalStore(subscribe, snapshot, () => null);

  const handleDelete = async (resume: MyResume) => {
    if (!window.confirm(`Delete "${resume.fullName}"? The share link will stop working.`)) return;
    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: 'DELETE',
      headers: { 'x-edit-token': resume.editToken },
    });
    if (response.ok || response.status === 404) {
      forgetResume(resume.id);
      showToast('Resume deleted', 'success');
    } else {
      showToast('Could not delete this resume. Please try again.', 'error');
    }
  };

  if (resumes === null) return <div className="h-40" />;

  return (
    <section id="my-resumes" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">Your resumes</h2>
          <p className="mt-1 text-[15px] text-muted">Saved privately to this browser. Only you can edit them.</p>
        </div>
        {resumes.length > 0 && (
          <ButtonLink href="/create" variant="primary" icon="plus">New resume</ButtonLink>
        )}
      </div>

      {resumes.length === 0 ? (
        <Link
          href="/create"
          className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-line-strong bg-surface/50 px-6 py-14 text-center transition-colors hover:border-ink/30 hover:bg-surface"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white transition-transform group-hover:scale-105">
            <Icon name="plus" size={22} />
          </span>
          <span className="mt-4 font-display text-xl font-semibold text-ink">Start your first resume</span>
          <span className="mt-1 max-w-sm text-sm text-muted">
            Takes about 10 minutes. Your draft saves as you type, so you can come back any time.
          </span>
        </Link>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => {
            const template = getTemplate(resume.template);
            return (
              <li key={resume.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow hover:shadow-pop">
                <Link href={`/resume/${resume.id}`} className="block bg-paper-2 px-6 pt-6" aria-label={`Open ${resume.fullName}`}>
                  {/* Mini page sketch in the resume's template colour */}
                  <div className="mx-auto h-28 w-full max-w-[220px] rounded-t-md bg-white px-4 pt-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="h-2 w-2/5 rounded-full" style={{ background: template.colors.primary }} />
                    <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-neutral-200" />
                    <div className="mt-4 flex items-center gap-1.5">
                      <div className="h-1.5 w-1/4 rounded-full" style={{ background: template.colors.primary }} />
                      <div className="h-px flex-1" style={{ background: template.colors.primary, opacity: 0.35 }} />
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100" />
                    <div className="mt-1 h-1.5 w-4/5 rounded-full bg-neutral-100" />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/resume/${resume.id}`} className="font-semibold text-ink hover:underline">
                    {resume.fullName}
                  </Link>
                  <p className="mt-0.5 truncate text-sm text-muted">{resume.headline || template.name}</p>
                  <p className="mt-3 text-xs text-muted">
                    Updated{' '}
                    {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="mt-4 flex items-center gap-1 border-t border-line pt-3 text-[13px]">
                    <Link href={`/resume/${resume.id}/edit`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-ink-2 hover:bg-paper-2 hover:text-ink">
                      <Icon name="pencil" size={14} /> Edit
                    </Link>
                    <Link href={`/create?from=${resume.id}`} title="Start a copy to tailor for a specific job"
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-ink-2 hover:bg-paper-2 hover:text-ink">
                      <Icon name="copy" size={14} /> Duplicate
                    </Link>
                    <button type="button" onClick={() => handleDelete(resume)} aria-label={`Delete ${resume.fullName}`}
                      className="ml-auto rounded-lg p-1.5 text-muted hover:bg-brand-soft hover:text-brand">
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
