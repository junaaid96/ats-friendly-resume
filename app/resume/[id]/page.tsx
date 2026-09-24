import type { Metadata } from 'next';
import { ReactNode } from 'react';
import ShareResume from '@/components/ShareResume';
import AtsScore from '@/components/AtsScore';
import ResumeDocument from '@/components/ResumeDocument';
import PaperPreview from '@/components/PaperPreview';
import ResumeToolbar from '@/components/ResumeToolbar';
import JobMatch from '@/components/JobMatch';
import Logo from '@/components/ui/Logo';
import Icon, { IconName } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { getResumeById } from '@/lib/storage';

// Force dynamic rendering to prevent caching stale data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resume = await getResumeById(id);
  const name = resume?.personalInfo.fullName;
  return {
    title: name ? `${name} - Resume` : 'Resume not found',
    // Shared resumes contain personal contact details: keep them out of search engines.
    robots: { index: false, follow: false },
  };
}

function Panel({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <Icon name={icon} size={16} className="text-muted" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ResumePage({ params }: Props) {
  const { id } = await params;
  const resume = await getResumeById(id);

  if (!resume) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6">
        <div className="max-w-sm text-center">
          <Logo />
          <h1 className="mt-8 font-display text-3xl font-semibold text-ink">Resume not found</h1>
          <p className="mt-2 text-muted">The link may be mistyped, or the owner deleted this resume.</p>
          <ButtonLink href="/" variant="primary" icon="arrowLeft" className="mt-6">Back home</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper print:bg-white">
      <ResumeToolbar resume={resume} />

      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] print:hidden">
        <div className="min-w-0">
          <PaperPreview resume={resume} showPageBreaks={false} />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Panel icon="link" title="Share">
            <ShareResume />
          </Panel>
          <Panel icon="target" title="Match a job">
            <JobMatch resume={resume} />
          </Panel>
          <Panel icon="sparkles" title="ATS check">
            <AtsScore resume={resume} compact />
          </Panel>
        </aside>
      </div>

      {/* Unscaled copy used for printing / Save as PDF */}
      <div className="hidden print:block">
        <ResumeDocument resume={resume} />
      </div>
    </div>
  );
}
