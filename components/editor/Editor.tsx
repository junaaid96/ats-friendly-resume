'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Resume } from '@/types/resume';
import Logo from '@/components/ui/Logo';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import PaperPreview from '@/components/PaperPreview';
import { showToast } from '@/components/Toast';
import { validateResume, hasErrors } from '@/lib/resume-validation';
import { clearDraft, getEditToken, loadDraft, rememberResume, saveDraft } from '@/lib/my-resumes';
import { getTemplate, templates } from '@/lib/templates';
import { Draft, STEPS, StepId, StepProps } from '@/components/editor/types';
import ContactStep from '@/components/editor/steps/ContactStep';
import SummaryStep from '@/components/editor/steps/SummaryStep';
import ExperienceStep from '@/components/editor/steps/ExperienceStep';
import EducationStep from '@/components/editor/steps/EducationStep';
import SkillsStep from '@/components/editor/steps/SkillsStep';
import ProjectsStep from '@/components/editor/steps/ProjectsStep';
import CertificationsStep from '@/components/editor/steps/CertificationsStep';
import DesignStep from '@/components/editor/steps/DesignStep';
import ReviewStep from '@/components/editor/steps/ReviewStep';

const EMPTY: Draft = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', github: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  template: 'classic-red',
  settings: {},
};

/** Fills gaps in resumes from older saves or imported JSON so every field the editor touches exists. */
function withDefaults(data: Draft): Draft {
  return {
    ...EMPTY,
    ...data,
    personalInfo: { ...EMPTY.personalInfo!, ...(data.personalInfo || {}) },
    settings: data.settings || {},
  };
}

/** Which editor step owns an error path like "experience.2.company". */
const STEP_FOR: Record<string, StepId> = {
  personalInfo: 'contact',
  summary: 'summary',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  certifications: 'certifications',
};

/** Drops blank bullets and technologies before saving. */
function tidy(resume: Draft): Draft {
  return {
    ...resume,
    experience: resume.experience?.map((e) => ({ ...e, responsibilities: e.responsibilities.filter((r) => r.trim()) })),
    projects: resume.projects?.map((p) => ({ ...p, technologies: p.technologies.map((t) => t.trim()).filter(Boolean) })),
  };
}

export default function Editor({ mode = 'create', initialResume }: { mode?: 'create' | 'edit'; initialResume?: Draft }) {
  const router = useRouter();
  const isEdit = mode === 'edit' && !!initialResume?.id;

  const [resume, setResume] = useState<Draft>(() =>
    withDefaults(initialResume ? { ...initialResume, id: isEdit ? initialResume.id : undefined } : EMPTY)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [attempted, setAttempted] = useState<Set<StepId>>(new Set());
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  // null until checked on the client; false means this browser didn't create the resume.
  const [canEdit, setCanEdit] = useState<boolean | null>(isEdit ? null : true);
  const importInput = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const draftChecked = useRef(false);

  const step = STEPS[stepIndex];
  const errors = useMemo(() => validateResume(resume), [resume]);

  // Restore an unsaved draft on a blank create page, then keep autosaving it.
  useEffect(() => {
    if (mode !== 'create' || initialResume) return;
    if (!draftChecked.current) {
      draftChecked.current = true;
      const draft = loadDraft();
      if (draft?.personalInfo?.fullName || draft?.summary || draft?.experience?.length) {
        setResume(withDefaults(draft));
        setDraftRestored(true);
      }
      return;
    }
    const timer = setTimeout(() => {
      saveDraft(resume);
      setDraftSavedAt(new Date());
    }, 700);
    return () => clearTimeout(timer);
  }, [resume, mode, initialResume]);

  useEffect(() => {
    if (isEdit) setCanEdit(!!getEditToken(initialResume!.id!));
  }, [isEdit, initialResume]);

  // Warn before leaving with unsaved edits to an existing resume.
  useEffect(() => {
    if (!isEdit || !dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isEdit, dirty]);

  const update = (patch: Draft) => {
    setResume((r) => ({ ...r, ...patch }));
    setDirty(true);
  };

  const touch = (path: string) => setTouched((t) => (t.has(path) ? t : new Set(t).add(path)));

  const showError: StepProps['showError'] = (path, message) => {
    if (!message) return undefined;
    const owner = STEP_FOR[path.split('.')[0]];
    return touched.has(path) || (owner && attempted.has(owner)) ? message : undefined;
  };

  const goTo = (id: StepId) => {
    setStepIndex(STEPS.findIndex((s) => s.id === id));
    mainRef.current?.scrollIntoView({ block: 'start' });
    window.scrollTo({ top: 0 });
  };

  const next = () => {
    setAttempted((a) => new Set(a).add(step.id));
    if (stepIndex < STEPS.length - 1) goTo(STEPS[stepIndex + 1].id);
  };

  const discardDraft = () => {
    clearDraft();
    setResume(withDefaults(EMPTY));
    setDraftRestored(false);
    setTouched(new Set());
    setAttempted(new Set());
    goTo('contact');
  };

  const handleImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      if (typeof data !== 'object' || !data?.personalInfo) throw new Error('not a resume');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, editToken, ...content } = data;
      setResume(withDefaults({ ...content, id: resume.id }));
      setDirty(true);
      showToast('Resume imported. Review each step, then save.', 'success');
    } catch {
      showToast('That file is not a resume exported from Arvix.', 'error');
    }
  };

  const save = async () => {
    setAttempted(new Set(STEPS.map((s) => s.id)));
    const firstInvalid = STEPS.find((s) => hasErrors(errors, s.errorKeys));
    if (firstInvalid) {
      showToast(`Please fix the highlighted fields in ${firstInvalid.label}.`, 'error');
      goTo(firstInvalid.id);
      return;
    }

    const editToken = isEdit ? getEditToken(resume.id!) : null;
    if (isEdit && !editToken) {
      showToast('This resume was created in another browser, so it can only be edited there.', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(isEdit ? `/api/resumes/${resume.id}` : '/api/resumes', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(editToken ? { 'x-edit-token': editToken } : {}) },
        body: JSON.stringify(tidy(resume)),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save. Please try again.');
      }
      const saved: Resume & { editToken?: string } = await response.json();
      rememberResume(saved, isEdit ? editToken! : saved.editToken!);
      if (!isEdit) clearDraft();
      setDirty(false);
      showToast(isEdit ? 'Changes saved' : 'Your resume is ready', 'success');
      router.push(`/resume/${saved.id}`);
      router.refresh();
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const stepProps: StepProps = { resume, update, errors, showError, touch };
  const canSave = canEdit !== false && !saving;
  const template = getTemplate(resume.template);

  const status = isEdit
    ? dirty
      ? 'Unsaved changes'
      : 'All changes saved'
    : draftSavedAt
      ? 'Draft saved in this browser'
      : 'Drafts save automatically';

  const stepState = (s: (typeof STEPS)[number]) => {
    if (s.id !== 'review' && hasErrors(errors, s.errorKeys) && attempted.has(s.id)) return 'error';
    if (s.isComplete(resume) && !hasErrors(errors, s.errorKeys)) return 'done';
    return 'todo';
  };
  const readyCount = STEPS.filter((s) => s.id !== 'review' && s.id !== 'design' && stepState(s) === 'done').length;
  const progress = Math.round((readyCount / (STEPS.length - 2)) * 100);

  const previewToolbar = (
    <div className="flex items-center justify-between gap-3 px-1 pb-3">
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Template colour">
        {templates.map((t) => (
          <button key={t.id} type="button" role="radio" aria-checked={t.id === template.id} title={t.name}
            onClick={() => update({ template: t.id })}
            className={`h-4 w-4 rounded-full transition-transform hover:scale-110 ${
              t.id === template.id ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper-2' : ''
            }`}
            style={{ background: t.colors.primary }} />
        ))}
      </div>
      <div className="flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5">
        <button type="button" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(1)))}
          className="grid h-7 w-7 place-items-center rounded-md text-ink-2 hover:bg-paper-2" aria-label="Zoom out">
          <Icon name="zoomOut" size={15} />
        </button>
        <span className="w-10 text-center text-xs tabular-nums text-muted">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(1)))}
          className="grid h-7 w-7 place-items-center rounded-md text-ink-2 hover:bg-paper-2" aria-label="Zoom in">
          <Icon name="zoomIn" size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1680px] items-center gap-3 px-4 sm:px-6">
          <Logo compact />
          <span className="hidden h-6 w-px bg-line sm:block" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {resume.personalInfo?.fullName || (isEdit ? 'Edit resume' : 'New resume')}
            </p>
            <p className="flex items-center gap-1.5 truncate text-xs text-muted">
              <Icon name={dirty && isEdit ? 'pencil' : 'cloud'} size={12} />
              {status}
            </p>
          </div>
          <span className="hidden md:block">
            <Button variant="ghost" size="sm" icon="upload" onClick={() => importInput.current?.click()}>
              Import
            </Button>
          </span>
          <span className="xl:hidden">
            <Button variant="secondary" size="sm" icon="eye" onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
          </span>
          <Button variant="primary" size="sm" icon="check" loading={saving} disabled={!canSave} onClick={save}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
          <input ref={importInput} type="file" accept="application/json,.json" className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }} />
        </div>

        {/* Mobile step chips */}
        <nav className="scrollbar-none flex gap-1.5 overflow-x-auto border-t border-line px-4 py-2 lg:hidden" aria-label="Steps">
          {STEPS.map((s, i) => {
            const state = stepState(s);
            return (
              <button key={s.id} type="button" onClick={() => goTo(s.id)} aria-current={i === stepIndex ? 'step' : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  i === stepIndex ? 'bg-ink text-white' : 'bg-surface text-ink-2 ring-1 ring-line'
                }`}>
                {state === 'done' && <Icon name="check" size={12} />}
                {state === 'error' && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                {s.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-[1680px] lg:grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_minmax(0,600px)]">
        {/* Step rail */}
        <nav className="sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-col border-r border-line px-4 py-6 lg:flex" aria-label="Steps">
          <div className="mb-5 px-2">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-2">Progress</span>
              <span className="tabular-nums text-muted">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <ol className="space-y-0.5">
            {STEPS.map((s, i) => {
              const state = stepState(s);
              const active = i === stepIndex;
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => goTo(s.id)} aria-current={active ? 'step' : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
                      active ? 'bg-surface font-semibold text-ink shadow-card' : 'text-ink-2 hover:bg-paper-2'
                    }`}>
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                      state === 'error' ? 'bg-red-50 text-red-600' : state === 'done' ? 'bg-ok-soft text-ok' : active ? 'bg-ink text-white' : 'bg-paper-2 text-muted'
                    }`}>
                      <Icon name={state === 'done' ? 'check' : state === 'error' ? 'alert' : s.icon} size={14} />
                    </span>
                    <span className="flex-1">{s.label}</span>
                    {s.optional && <span className="text-[11px] font-normal text-muted">Optional</span>}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-auto space-y-1 px-2 text-[13px]">
            <button type="button" onClick={() => importInput.current?.click()} className="flex items-center gap-2 py-1 text-ink-2 hover:text-ink">
              <Icon name="upload" size={14} /> Import from JSON
            </button>
            <Link href="/" className="flex items-center gap-2 py-1 text-ink-2 hover:text-ink">
              <Icon name="arrowLeft" size={14} /> Back to my resumes
            </Link>
          </div>
        </nav>

        {/* Active step */}
        <main ref={mainRef} className="min-w-0 px-4 pb-28 pt-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl">
            {draftRestored && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn">
                <span className="flex items-center gap-2"><Icon name="refresh" size={15} /> We restored the draft you were working on.</span>
                <button type="button" onClick={discardDraft} className="font-semibold hover:underline">Start over</button>
              </div>
            )}
            {canEdit === false && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                This resume was created in another browser, so only that browser can save changes. You can{' '}
                <Link href={`/create?from=${resume.id}`} className="font-semibold underline">duplicate it</Link> and save your own copy.
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight tracking-tight text-ink">{step.title}</h1>
            <p className="mb-8 mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{step.description}</p>

            <div key={step.id} className="animate-rise">
              {step.id === 'contact' && <ContactStep {...stepProps} />}
              {step.id === 'summary' && <SummaryStep {...stepProps} />}
              {step.id === 'experience' && <ExperienceStep {...stepProps} />}
              {step.id === 'education' && <EducationStep {...stepProps} />}
              {step.id === 'skills' && <SkillsStep {...stepProps} />}
              {step.id === 'projects' && <ProjectsStep {...stepProps} />}
              {step.id === 'certifications' && <CertificationsStep {...stepProps} />}
              {step.id === 'design' && <DesignStep {...stepProps} />}
              {step.id === 'review' && (
                <ReviewStep {...stepProps} goTo={goTo} onSave={save} saving={saving} canSave={canSave} isEdit={isEdit} />
              )}
            </div>

            {step.id !== 'review' && (
              <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                <Button variant="ghost" icon="arrowLeft" disabled={stepIndex === 0} onClick={() => goTo(STEPS[stepIndex - 1].id)}>
                  Back
                </Button>
                <Button variant="primary" iconRight="arrowRight" onClick={next}>
                  {step.optional && !step.isComplete(resume) ? 'Skip for now' : `Continue to ${STEPS[stepIndex + 1].label}`}
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Live preview (wide screens) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-auto border-l border-line bg-paper-2 px-6 py-5 xl:block" aria-label="Live preview">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-ok" /> Live preview · {template.name}
          </p>
          {previewToolbar}
          <PaperPreview resume={resume} zoom={zoom} />
        </aside>
      </div>

      {/* Preview overlay (narrow screens) */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-paper-2 px-4 pb-10 pt-4 xl:hidden" role="dialog" aria-modal="true" aria-label="Preview">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-ink">Preview</p>
              <Button variant="secondary" size="sm" icon="x" onClick={() => setPreviewOpen(false)}>Close</Button>
            </div>
            {previewToolbar}
            <PaperPreview resume={resume} zoom={zoom} />
          </div>
        </div>
      )}
    </div>
  );
}
