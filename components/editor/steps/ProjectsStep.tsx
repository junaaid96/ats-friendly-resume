'use client';

import { useState } from 'react';
import { Project } from '@/types/resume';
import { TextArea, TextField } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import EntryCard, { AddButton, EmptyState, move } from '@/components/editor/EntryCard';
import { newId, StepProps } from '@/components/editor/types';

const blank = (): Project => ({ id: newId('proj'), name: '', description: '', technologies: [], link: '' });

export default function ProjectsStep({ resume, update, errors, showError, touch }: StepProps) {
  const list = resume.projects || [];
  const [openId, setOpenId] = useState<string | null>(list[0]?.id ?? null);
  const setList = (projects: Project[]) => update({ projects });
  const patch = (index: number, value: Partial<Project>) =>
    setList(list.map((p, i) => (i === index ? { ...p, ...value } : p)));

  const add = () => {
    const entry = blank();
    setList([...list, entry]);
    setOpenId(entry.id);
  };

  if (!list.length) {
    return (
      <div className="space-y-4">
        <EmptyState icon={<Icon name="folder" />} title="No projects yet"
          text="Optional, but great for students, career changers and anyone with work they can link to." />
        <AddButton onClick={add}>Add a project</AddButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((project, i) => {
        const e = errors.projects?.[i];
        return (
          <EntryCard
            key={project.id}
            title={project.name || 'New project'}
            subtitle={project.technologies.filter(Boolean).join(', ')}
            open={openId === project.id}
            onToggle={() => setOpenId(openId === project.id ? null : project.id)}
            onRemove={() => setList(list.filter((_, j) => j !== i))}
            onMoveUp={i > 0 ? () => setList(move(list, i, -1)) : undefined}
            onMoveDown={i < list.length - 1 ? () => setList(move(list, i, 1)) : undefined}
            hasError={!!e && !!showError(`projects.${i}`, 'x')}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Project name" value={project.name} placeholder="Budget tracker"
                onChange={(ev) => patch(i, { name: ev.target.value })} onBlur={() => touch(`projects.${i}.name`)}
                error={showError(`projects.${i}.name`, e?.name)} />
              <TextField label="Link" optional type="url" value={project.link || ''} placeholder="https://github.com/you/project"
                onChange={(ev) => patch(i, { link: ev.target.value })} onBlur={() => touch(`projects.${i}.link`)}
                error={showError(`projects.${i}.link`, e?.link)} />
              <TextArea label="What it does and your impact" className="sm:col-span-2" rows={3} value={project.description}
                placeholder="A PWA that categorises spending automatically. 2k monthly users; built the sync engine and offline mode."
                onChange={(ev) => patch(i, { description: ev.target.value })} onBlur={() => touch(`projects.${i}.description`)}
                error={showError(`projects.${i}.description`, e?.description)} />
              <TextField label="Technologies" className="sm:col-span-2" value={project.technologies.join(', ')}
                placeholder="React, Node.js, PostgreSQL" hint="Separate with commas."
                onChange={(ev) => patch(i, { technologies: ev.target.value.split(',').map((t) => t.trimStart()) })} />
            </div>
          </EntryCard>
        );
      })}
      <AddButton onClick={add}>Add another project</AddButton>
    </div>
  );
}
