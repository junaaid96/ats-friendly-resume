'use client';

import { useState } from 'react';
import { Education } from '@/types/resume';
import { TextField } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import EntryCard, { AddButton, EmptyState, move } from '@/components/editor/EntryCard';
import { newId, StepProps } from '@/components/editor/types';

const blank = (): Education => ({
  id: newId('edu'),
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
});

export default function EducationStep({ resume, update, errors, showError, touch }: StepProps) {
  const list = resume.education || [];
  const [openId, setOpenId] = useState<string | null>(list[0]?.id ?? null);
  const setList = (education: Education[]) => update({ education });
  const patch = (index: number, value: Partial<Education>) =>
    setList(list.map((e, i) => (i === index ? { ...e, ...value } : e)));

  const add = () => {
    const entry = blank();
    setList([...list, entry]);
    setOpenId(entry.id);
  };

  if (!list.length) {
    return (
      <div className="space-y-4">
        <EmptyState icon={<Icon name="graduation" />} title="No education added"
          text="Add your highest degree first. Bootcamps and diplomas count too." />
        <AddButton onClick={add}>Add education</AddButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((edu, i) => {
        const e = errors.education?.[i];
        const field = (key: keyof Education, label: string, extra: Record<string, unknown> = {}) => (
          <TextField
            label={label}
            value={(edu[key] as string) || ''}
            onChange={(ev) => patch(i, { [key]: ev.target.value })}
            onBlur={() => touch(`education.${i}.${key}`)}
            error={showError(`education.${i}.${key}`, e?.[key as keyof typeof e])}
            {...extra}
          />
        );
        return (
          <EntryCard
            key={edu.id}
            title={[edu.degree, edu.field].filter(Boolean).join(' in ') || 'New education'}
            subtitle={edu.institution}
            open={openId === edu.id}
            onToggle={() => setOpenId(openId === edu.id ? null : edu.id)}
            onRemove={() => setList(list.filter((_, j) => j !== i))}
            onMoveUp={i > 0 ? () => setList(move(list, i, -1)) : undefined}
            onMoveDown={i < list.length - 1 ? () => setList(move(list, i, 1)) : undefined}
            hasError={!!e && !!showError(`education.${i}`, 'x')}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {field('degree', 'Degree', { required: true, placeholder: 'B.Sc.' })}
              {field('field', 'Field of study', { required: true, placeholder: 'Computer Science' })}
              {field('institution', 'School', { required: true, placeholder: 'University of Dhaka', className: 'sm:col-span-2' })}
              {field('location', 'Location', { required: true, placeholder: 'City, Country' })}
              {field('gpa', 'GPA', { optional: true, placeholder: '3.8', hint: 'Format 0.0 – 4.0' })}
              {field('startDate', 'Start', { required: true, type: 'month', placeholder: 'YYYY-MM' })}
              {field('endDate', 'End (or expected)', { required: true, type: 'month', placeholder: 'YYYY-MM' })}
            </div>
          </EntryCard>
        );
      })}
      <AddButton onClick={add}>Add another</AddButton>
    </div>
  );
}
