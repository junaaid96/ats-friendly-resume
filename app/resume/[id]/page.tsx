import type { Metadata } from 'next';
import Link from 'next/link';
import ShareResume from '@/components/ShareResume';
import ATSAnalyzer from '@/components/ATSAnalyzer';
import ResumeDocument from '@/components/ResumeDocument';
import ResumeToolbar from '@/components/ResumeToolbar';
import JobMatch from '@/components/JobMatch';
import { getResumeById } from '@/lib/storage';
import { getTemplate } from '@/lib/templates';

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

export default async function ResumePage({ params }: Props) {
  const { id } = await params;
  const resume = await getResumeById(id);

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Resume Not Found</h1>
        <Link href="/" className="text-red-600 hover:text-red-700 hover:underline mt-4 inline-block font-medium">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const template = getTemplate(resume.template);

  return (
    <div className="min-h-screen print:bg-white py-4 print:py-0" style={{ backgroundColor: template.colors.accent }}>
      <div className="max-w-4xl mx-auto px-4 print:px-0 print:bg-white">
        <ResumeToolbar resume={resume} color={template.colors.primary} />

        {/* ATS-Friendly Resume Display */}
        <ResumeDocument resume={resume} />

        <JobMatch resume={resume} />

        {/* ATS Analyzer */}
        <ATSAnalyzer resume={resume} />

        {/* Share Link */}
        <ShareResume resumeId={id} />
      </div>
    </div>
  );
}
