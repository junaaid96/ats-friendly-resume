'use client';

import { useState } from 'react';
import { Certification } from '@/types/resume';
import { TextField } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import EntryCard, { AddButton, EmptyState, move } from '@/components/editor/EntryCard';
import { newId, StepProps } from '@/components/editor/types';
import { formatDate } from '@/components/ResumeDocument';

const blank = (): Certification => ({ id: newId('cert'), name: '', issuer: '', date: '', expiryDate: '', credentialId: '' });

export default function CertificationsStep({ resume, update, errors, showError, touch }: StepProps) {
  const list = resume.certifications || [];
  const [openId, setOpenId] = useState<string | null>(list[0]?.id ?? null);
  const setList = (certifications: Certification[]) => update({ certifications });
  const patch = (index: number, value: Partial<Certification>) =>
    setList(list.map((c, i) => (i === index ? { ...c, ...value } : c)));

  const add = () => {
    const entry = blank();
    setList([...list, entry]);
    setOpenId(entry.id);
  };

  if (!list.length) {
    return (
      <div className="space-y-4">
        <EmptyState icon={<Icon name="award" />} title="No certifications"
          text="Optional. Add the ones a recruiter for your target role would look for, like AWS, PMP or CPA." />
        <AddButton onClick={add}>Add a certification</AddButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((cert, i) => {
        const e = errors.certifications?.[i];
        const field = (key: keyof Certification, label: string, extra: Record<string, unknown> = {}) => (
          <TextField
            label={label}
            value={(cert[key] as string) || ''}
            onChange={(ev) => patch(i, { [key]: ev.target.value })}
            onBlur={() => touch(`certifications.${i}.${key}`)}
            error={showError(`certifications.${i}.${key}`, e?.[key as keyof typeof e])}
            {...extra}
          />
        );
        return (
          <EntryCard
            key={cert.id}
            title={cert.name || 'New certification'}
            subtitle={[cert.issuer, formatDate(cert.date)].filter(Boolean).join(' · ')}
            open={openId === cert.id}
            onToggle={() => setOpenId(openId === cert.id ? null : cert.id)}
            onRemove={() => setList(list.filter((_, j) => j !== i))}
            onMoveUp={i > 0 ? () => setList(move(list, i, -1)) : undefined}
            onMoveDown={i < list.length - 1 ? () => setList(move(list, i, 1)) : undefined}
            hasError={!!e && !!showError(`certifications.${i}`, 'x')}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {field('name', 'Certification', { placeholder: 'AWS Certified Developer', className: 'sm:col-span-2' })}
              {field('issuer', 'Issued by', { placeholder: 'Amazon Web Services' })}
              {field('credentialId', 'Credential ID', { optional: true })}
              {field('date', 'Issued', { type: 'month', placeholder: 'YYYY-MM' })}
              {field('expiryDate', 'Expires', { optional: true, type: 'month', placeholder: 'YYYY-MM' })}
            </div>
          </EntryCard>
        );
      })}
      <AddButton onClick={add}>Add another</AddButton>
    </div>
  );
}
