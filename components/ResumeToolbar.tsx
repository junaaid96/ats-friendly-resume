'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Resume } from '@/types/resume';
import { forgetResume, getEditToken, MY_RESUMES_EVENT } from '@/lib/my-resumes';
import { resumeToPlainText } from '@/lib/resume-text';
import { showToast } from '@/components/Toast';
import Logo from '@/components/ui/Logo';
import Icon, { IconName } from '@/components/ui/Icon';
import { Button, ButtonLink } from '@/components/ui/Button';

const slug = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resume';

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function subscribe(onChange: () => void) {
  window.addEventListener(MY_RESUMES_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(MY_RESUMES_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Only the browser that created the resume holds its edit token. */
export function useEditToken(id: string) {
  return useSyncExternalStore(subscribe, () => getEditToken(id), () => null);
}

function MenuItem({ icon, children, onClick, danger }: { icon: IconName; children: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" role="menuitem" onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm ${
        danger ? 'text-brand hover:bg-brand-soft' : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
      }`}>
      <Icon name={icon} size={16} />
      {children}
    </button>
  );
}

export default function ResumeToolbar({ resume }: { resume: Resume }) {
  const router = useRouter();
  const editToken = useEditToken(resume.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const name = slug(resume.personalInfo.fullName);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [menuOpen]);

  const run = (fn: () => void) => () => {
    setMenuOpen(false);
    fn();
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(resumeToPlainText(resume));
      showToast('Plain-text resume copied', 'success');
    } catch {
      showToast('Copy failed. Try the .txt download instead.', 'error');
    }
  };

  const exportJson = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...data } = resume;
    download(`${name}.json`, JSON.stringify(data, null, 2), 'application/json');
  };

  const handleDelete = async () => {
    if (!editToken || !window.confirm('Delete this resume? The share link will stop working.')) return;
    const response = await fetch(`/api/resumes/${resume.id}`, { method: 'DELETE', headers: { 'x-edit-token': editToken } });
    if (response.ok) {
      forgetResume(resume.id);
      showToast('Resume deleted', 'success');
      router.push('/');
    } else {
      showToast('Could not delete this resume.', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
        <Logo compact />
        <span className="hidden h-6 w-px bg-line sm:block" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{resume.personalInfo.fullName}</p>
          <p className="truncate text-xs text-muted">
            Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {editToken && (
          <ButtonLink href={`/resume/${resume.id}/edit`} variant="secondary" size="sm" icon="pencil">
            Edit
          </ButtonLink>
        )}
        <div className="relative" ref={menuRef}>
          <Button variant="secondary" size="sm" iconRight="chevronDown" aria-haspopup="menu" aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}>
            <span className="hidden sm:inline">More</span>
            <span className="sm:hidden">
              <Icon name="more" size={15} />
            </span>
          </Button>
          {menuOpen && (
            <div role="menu" className="animate-toast absolute right-0 z-50 mt-2 w-60 rounded-xl border border-line bg-surface p-1.5 shadow-pop">
              <MenuItem icon="copy" onClick={run(copyText)}>Copy as plain text</MenuItem>
              <MenuItem icon="file" onClick={run(() => download(`${name}.txt`, resumeToPlainText(resume), 'text/plain'))}>
                Download .txt (ATS)
              </MenuItem>
              <MenuItem icon="download" onClick={run(exportJson)}>Download .json backup</MenuItem>
              <MenuItem icon="copy" onClick={run(() => router.push(`/create?from=${resume.id}`))}>Duplicate to tailor</MenuItem>
              {editToken && (
                <>
                  <div className="my-1 h-px bg-line" />
                  <MenuItem icon="trash" danger onClick={run(handleDelete)}>Delete resume</MenuItem>
                </>
              )}
            </div>
          )}
        </div>
        <Button variant="primary" size="sm" icon="printer" onClick={() => window.print()}>
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </header>
  );
}
