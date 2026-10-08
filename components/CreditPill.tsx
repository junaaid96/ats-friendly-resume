import Icon from "@/components/ui/Icon";

/** "Developed by <CodeJBorg />" credit link, styled with the Arvix brand token. */
export default function CreditPill({ className = "" }: { className?: string }) {
    return (
        <a
            href="https://junaidul.pro.bd/codejborg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Developed by CodeJBorg — visit developer website"
            className={`group inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 py-1.5 pr-3 pl-1.5 font-mono text-[11px] tracking-wide text-muted transition-colors duration-300 hover:border-brand/45 hover:bg-brand-soft hover:text-ink focus-visible:border-brand/45 focus-visible:bg-brand-soft focus-visible:text-ink ${className}`}
        >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                <Icon name="code" size={14} strokeWidth={2.25} />
            </span>
            <span>Developed by</span>
            <span className="font-semibold text-ink">
                <span className="text-brand">&lt;</span>CodeJBorg<span className="text-brand"> /&gt;</span>
            </span>
            <span aria-hidden="true" className="inline-block h-3.5 w-0.5 bg-brand motion-safe:animate-credit-blink" />
            <Icon
                name="arrowUpRight"
                size={14}
                className="opacity-40 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:opacity-100"
            />
        </a>
    );
}
