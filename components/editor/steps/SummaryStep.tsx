'use client';

import { useState } from 'react';
import { TextArea, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { AiCard, SuggestionList } from '@/components/editor/AiSuggestions';
import { StepProps } from '@/components/editor/types';
import { ai, yearsOfExperience } from '@/lib/ai-client';
import { showToast } from '@/components/Toast';

export default function SummaryStep({ resume, update, errors, showError, touch }: StepProps) {
  const [jobTitle, setJobTitle] = useState(resume.experience?.[0]?.position || '');
  const [years, setYears] = useState(yearsOfExperience(resume));
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const generate = async () => {
    if (!jobTitle.trim()) {
      showToast('Add the job title you are aiming for first.', 'error');
      return;
    }
    setLoading(true);
    try {
      setOptions(await ai.summaries(jobTitle, years || 'a few years', resume.skills || []));
    } catch (error) {
      showToast((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <TextArea
        label="Summary"
        required
        rows={6}
        showCount
        min={50}
        max={500}
        value={resume.summary || ''}
        onChange={(e) => update({ summary: e.target.value })}
        onBlur={() => touch('summary')}
        error={showError('summary', errors.summary)}
        placeholder="Full-stack engineer with 5 years of experience building React and Node.js products used by 200k people. I lead projects from idea to launch and care about fast, accessible interfaces."
        hint="Aim for 50–500 characters. Mention your role, years of experience and one or two results."
      />

      <AiCard title="Write it with AI">
        <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
          <TextField label="Target job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Frontend Engineer" />
          <TextField label="Experience" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5 years" />
          <Button variant="ai" icon="sparkles" loading={loading} onClick={generate}>
            {options.length ? 'Regenerate' : 'Generate'}
          </Button>
        </div>
        {options.length > 0 && (
          <div className="mt-4">
            <SuggestionList
              items={options}
              actionLabel="Use this summary"
              onPick={(value) => {
                update({ summary: value });
                showToast('Summary updated. Edit it to sound like you.', 'success');
              }}
            />
          </div>
        )}
      </AiCard>
    </div>
  );
}
