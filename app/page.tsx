import Link from "next/link";
import MyResumes from "@/components/MyResumes";
import PaperPreview from "@/components/PaperPreview";
import Logo from "@/components/ui/Logo";
import Icon, { IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { SAMPLE_RESUME } from "@/lib/sample-resume";
import { templates } from "@/lib/templates";

const STEPS = [
    {
        n: "01",
        title: "Fill in guided steps",
        text: "One section at a time, with examples and inline tips. Your draft saves as you type.",
    },
    {
        n: "02",
        title: "Sharpen it with AI",
        text: "Draft a summary, turn duties into achievements and find the skills recruiters search for.",
    },
    {
        n: "03",
        title: "Tailor, share, apply",
        text: "Check a job ad for missing keywords, then download a PDF or share a private link.",
    },
];

const FEATURES: { icon: IconName; title: string; text: string }[] = [
    { icon: "eye", title: "Live, page-accurate preview", text: "See exactly where lines and pages break before you download." },
    { icon: "target", title: "Job match checker", text: "Paste a job ad to see which of its keywords you cover and which you're missing." },
    { icon: "sparkles", title: "AI writing help", text: "Summaries, stronger bullet points and skill suggestions, right where you need them." },
    { icon: "layout", title: "Reorder & hide sections", text: "Lead with your strongest section and drop what doesn't fit a role." },
    { icon: "download", title: "PDF, text & JSON", text: "Print-ready PDF, a plain-text copy for web forms, and a JSON backup." },
    { icon: "shield", title: "Private by default", text: "No account and no public listing. Only this browser can edit your resume." },
];

export default function Home() {
    return (
        <div className="min-h-screen overflow-x-clip bg-paper">
            <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <Logo />
                    <nav className="hidden items-center gap-7 text-sm text-ink-2 md:flex">
                        <a href="#how" className="hover:text-ink">How it works</a>
                        <a href="#templates" className="hover:text-ink">Templates</a>
                        <a href="#my-resumes" className="hover:text-ink">My resumes</a>
                    </nav>
                    <ButtonLink href="/create" variant="primary" size="sm" icon="plus">
                        Create resume
                    </ButtonLink>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
                    <div className="animate-rise">
                        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                            Free · No sign-up · ATS-friendly
                        </span>
                        <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                            A resume that gets read, by <em className="font-normal text-brand">people</em> and by robots.
                        </h1>
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
                            Arvix guides you section by section, helps you write with AI, and shows a live, page-accurate preview in
                            templates that applicant tracking systems can actually parse.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <ButtonLink href="/create" variant="primary" size="lg" iconRight="arrowRight">
                                Build my resume
                            </ButtonLink>
                            <ButtonLink href="#how" variant="secondary" size="lg">
                                How it works
                            </ButtonLink>
                        </div>
                        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                            {["Saves as you type", "12 templates", "PDF & plain text"].map((t) => (
                                <li key={t} className="flex items-center gap-1.5">
                                    <Icon name="check" size={15} className="text-ok" /> {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative mx-auto w-full max-w-[520px] animate-rise [animation-delay:120ms]">
                        <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-brand-soft via-paper-2 to-transparent" />
                        <div className="rotate-[1.5deg] transition-transform duration-500 hover:rotate-0">
                            <PaperPreview resume={SAMPLE_RESUME} showPageBreaks={false} />
                        </div>
                        <div className="absolute -left-6 -top-4 hidden rounded-2xl border border-line bg-surface px-4 py-3 shadow-pop sm:block">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">ATS score</p>
                            <p className="font-display text-2xl font-semibold text-ok">92<span className="text-sm text-muted">/100</span></p>
                        </div>
                        <div className="absolute -right-3 bottom-20 hidden items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 shadow-pop sm:flex">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
                                <Icon name="target" size={16} />
                            </span>
                            <span>
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">Job match</span>
                                <span className="block text-sm font-semibold text-ink">14 of 16 keywords</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how" className="scroll-mt-20 border-y border-line bg-surface">
                    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">How it works</p>
                        <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-ink">
                            From blank page to applied in one sitting.
                        </h2>
                        <ol className="mt-12 grid gap-10 md:grid-cols-3">
                            {STEPS.map((s) => (
                                <li key={s.n} className="border-t border-ink pt-5">
                                    <span className="font-display text-sm font-semibold text-brand">{s.n}</span>
                                    <h3 className="mt-2 text-lg font-semibold text-ink">{s.title}</h3>
                                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="bg-paper p-6">
                                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-ink shadow-card">
                                        <Icon name={f.icon} size={18} />
                                    </span>
                                    <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Templates */}
                <section id="templates" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Templates</p>
                            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
                                Twelve looks, one rule: readable.
                            </h2>
                            <p className="mt-3 max-w-xl text-[15px] text-muted">
                                Single column, real text, standard headings. Switch any time; your content stays put.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        {templates.map((t) => (
                            <Link key={t.id} href="/create" className="group rounded-xl border border-line bg-surface p-3 transition-shadow hover:shadow-card">
                                <div className="aspect-[8.5/11] rounded-md border border-line bg-white p-2 transition-transform group-hover:-translate-y-0.5">
                                    <div
                                        className={`h-1.5 w-1/2 rounded-full ${t.styles.headerAlign === "center" ? "mx-auto" : ""}`}
                                        style={{ background: t.colors.primary }}
                                    />
                                    {[0, 1, 2].map((n) => (
                                        <div key={n} className="mt-2.5">
                                            <div className="h-1 w-1/3 rounded-full" style={{ background: t.colors.primary, opacity: 0.8 }} />
                                            <div className="mt-1 h-1 w-full rounded-full bg-neutral-100" />
                                            <div className="mt-0.5 h-1 w-4/5 rounded-full bg-neutral-100" />
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-2 truncate text-xs font-medium text-ink-2">{t.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Saved resumes */}
                <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
                    <MyResumes />
                </div>
            </main>

            <footer className="border-t border-line">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
                    <Logo />
                    <p>Free and private. Your resumes never appear in a public list.</p>
                </div>
            </footer>
        </div>
    );
}
