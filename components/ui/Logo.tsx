import Link from 'next/link';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Arvix Resume Builder home">
      <span className="relative grid h-8 w-8 place-items-center rounded-[9px] bg-ink text-white shadow-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 3h7l5 5v13H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M10 13h6M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-brand" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[19px] font-semibold tracking-tight text-ink">Arvix</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Resume Builder
          </span>
        </span>
      )}
    </Link>
  );
}
