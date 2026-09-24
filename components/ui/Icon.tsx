import { SVGProps } from 'react';

/** Small inline icon set (24px grid, 1.75 stroke) so the app needs no icon dependency. */
const PATHS = {
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  check: 'm5 12.5 4.5 4.5L19 7',
  plus: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6 6 18',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
  sparkles:
    'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
  download: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  upload: 'M12 20V9m-5 5 5-5 5 5M5 4h14',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  printer: 'M7 9V3h10v6M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3M7 14h10v7H7z',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zm0 0v5h5M9 13h6m-6 4h4',
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  chevronDown: 'm6 9 6 6 6-6',
  chevronUp: 'm6 15 6-6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  alert: 'M12 8v5m0 3.5h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  layout: 'M4 4h16v16H4zM4 10h16M10 10v10',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0',
  text: 'M4 6h16M4 12h16M4 18h10',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  graduation: 'M2 9l10-5 10 5-10 5L2 9zm4 2v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6',
  tools: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5z',
  folder: 'M3 6h6l2 2h10v11H3z',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-3.5-1L7 22l5-3 5 3-1.5-8',
  palette: 'M12 3a9 9 0 0 0 0 18c1 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8zM7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01M17 11h.01',
  flag: 'M5 21V4h11l-1.5 4L16 12H5',
  refresh: 'M20 11a8 8 0 0 0-14.8-4M4 5v4h4M4 13a8 8 0 0 0 14.8 4M20 19v-4h-4',
  zoomIn: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 2-4-4M8 11h6m-3-3v6',
  zoomOut: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 2-4-4M8 11h6',
  cloud: 'M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8H7z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  size = 18,
  className,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Spinner({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={`animate-spin ${className}`} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
