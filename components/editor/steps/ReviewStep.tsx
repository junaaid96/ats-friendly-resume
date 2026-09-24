'use client';

import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import AtsScore from '@/components/AtsScore';
import { hasErrors } from '@/lib/resume-validation';
import { STEPS, StepId, StepProps } from '@/components/editor/types';

export default function ReviewStep({
  resume,
  errors,
  goTo,
  onSave,
  saving,
  canSave,
  isEdit,
}: StepProps & {
  goTo: (step: StepId) => void;
  onSave: () => void;
  saving: boolean;
  canSave: boolean;
  isEdit: boolean;
}) {
  const checks = STEPS.filter((s) => s.id !== 'review' && s.id !== 'design').map((step) => {
    const invalid = hasErrors(errors, step.errorKeys);
    const complete = step.isComplete(resume);
    return { step, invalid, complete };
  });
  const blocking = checks.filter((c) => c.invalid);
  const done = checks.filter((c) => c.complete && !c.invalid).length;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Checklist</h3>
          <span className="text-xs font-medium text-muted">
            {done} of {checks.length} sections ready
          </span>
        </div>
        <ul className="divide-y divide-line">
          {checks.map(({ step, invalid, complete }) => (
            <li key={step.id}>
              <button type="button" onClick={() => goTo(step.id)}
                className="group flex w-full items-center gap-3 py-2.5 text-left">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                    invalid ? 'bg-red-50 text-red-600' : complete ? 'bg-ok-soft text-ok' : 'bg-paper-2 text-muted'
                  }`}
                >
                  <Icon name={invalid ? 'alert' : complete ? 'check' : step.icon} size={13} />
                </span>
                <span className="flex-1 text-sm text-ink">{step.label}</span>
                <span className={`text-xs ${invalid ? 'font-medium text-red-600' : 'text-muted'}`}>
                  {invalid ? 'Fix issues' : complete ? 'Done' : step.optional ? 'Optional' : 'Not started'}
                </span>
                <Icon name="chevronRight" size={15} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="target" size={16} /> ATS readiness
        </h3>
        <AtsScore resume={resume} />
      </section>

      <section className="rounded-2xl bg-ink p-6 text-white">
        <h3 className="font-display text-xl font-semibold">
          {isEdit ? 'Save your changes' : 'Ready when you are'}
        </h3>
        <p className="mt-1 text-sm text-white/70">
          {blocking.length
            ? `${blocking.length} section${blocking.length > 1 ? 's need' : ' needs'} attention before you can save.`
            : isEdit
              ? 'Your share link stays the same.'
              : 'You get a private, view-only link to share, plus PDF, text and JSON downloads.'}
        </p>
        <Button className="mt-5 !bg-white !text-ink hover:!bg-paper" size="lg" icon={blocking.length ? 'alert' : 'check'}
          loading={saving} disabled={!canSave} onClick={onSave}>
          {isEdit ? 'Save changes' : 'Create my resume'}
        </Button>
      </section>
    </div>
  );
}
