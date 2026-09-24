import Editor from "@/components/editor/Editor";
import { getResumeById } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function CreatePage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string }>;
}) {
    // "Duplicate": start a new resume pre-filled from an existing one.
    const { from } = await searchParams;
    const source = from ? await getResumeById(from) : null;

    if (!source) return <Editor key="blank" />;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...content } = source;
    return <Editor key={from} initialResume={content} />;
}
