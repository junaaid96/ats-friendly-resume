'use client';

import { PersonalInfo } from '@/types/resume';
import { TextField } from '@/components/ui/Field';
import { StepProps } from '@/components/editor/types';

export default function ContactStep({ resume, update, errors, showError, touch }: StepProps) {
  const info = resume.personalInfo as PersonalInfo;
  const set = (field: keyof PersonalInfo, value: string) =>
    update({ personalInfo: { ...info, [field]: value } });

  const field = (
    key: keyof PersonalInfo,
    label: string,
    props: { type?: string; placeholder?: string; autoComplete?: string; required?: boolean; hint?: string; className?: string }
  ) => (
    <TextField
      label={label}
      value={info[key] || ''}
      onChange={(e) => set(key, e.target.value)}
      onBlur={() => touch(`personalInfo.${key}`)}
      error={showError(`personalInfo.${key}`, errors.personalInfo?.[key])}
      optional={!props.required}
      {...props}
    />
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {field('fullName', 'Full name', { required: true, placeholder: 'Jane Doe', autoComplete: 'name', className: 'sm:col-span-2' })}
        {field('email', 'Email', { required: true, type: 'email', placeholder: 'jane@example.com', autoComplete: 'email' })}
        {field('phone', 'Phone', { required: true, type: 'tel', placeholder: '+1 555 123 4567', autoComplete: 'tel' })}
        {field('location', 'Location', {
          required: true,
          placeholder: 'City, Country',
          autoComplete: 'address-level2',
          hint: 'City and country is enough. Skip your street address.',
          className: 'sm:col-span-2',
        })}
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-ink">Links</h3>
        <p className="mb-4 text-[13px] text-muted">Shown as short labels on the page; the full address stays clickable in the PDF.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {field('linkedin', 'LinkedIn', { type: 'url', placeholder: 'https://linkedin.com/in/jane' })}
          {field('github', 'GitHub', { type: 'url', placeholder: 'https://github.com/jane' })}
          {field('website', 'Portfolio / website', { type: 'url', placeholder: 'https://jane.dev', className: 'sm:col-span-2' })}
        </div>
      </div>
    </div>
  );
}
