import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Editor from "@/components/editor/Editor";
import { getResumeById } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Edit resume - Arvix Resume Builder",
    robots: { index: false, follow: false },
};

export default async function EditResumePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const resume = await getResumeById(id);
    if (!resume) notFound();

    // Ownership is checked in the browser (edit token) and again by the API on save.
    return <Editor mode="edit" initialResume={resume} />;
}
