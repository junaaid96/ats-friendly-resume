'use client';

import { useEffect, useRef, useState } from 'react';
import { Resume } from '@/types/resume';
import ResumeDocument from '@/components/ResumeDocument';

const PAGE_WIDTH = 816; // US Letter at 96dpi (8.5in)
const PAGE_HEIGHT = 1056; // 11in

/**
 * Renders the resume at true page width and scales it to fit the container,
 * so the preview has the same line breaks as the printed PDF. Dashed rules
 * mark where each printed page ends.
 */
export default function PaperPreview({
  resume,
  zoom = 1,
  maxScale = 1,
  showPageBreaks = true,
}: {
  resume: Partial<Resume>;
  zoom?: number;
  maxScale?: number;
  showPageBreaks?: boolean;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0);
  const [height, setHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    const o = outer.current;
    const c = content.current;
    if (!o || !c) return;
    const observer = new ResizeObserver(() => {
      setFit(Math.min(maxScale, o.clientWidth / PAGE_WIDTH));
      // offsetHeight ignores the scale transform, so this is the unscaled page height.
      setHeight(Math.max(PAGE_HEIGHT, c.offsetHeight));
    });
    observer.observe(o);
    observer.observe(c);
    return () => observer.disconnect();
  }, [maxScale]);

  const scale = fit * zoom;
  const pages = Math.max(1, Math.ceil(height / PAGE_HEIGHT));

  return (
    <div ref={outer} className="w-full">
      <div
        className="relative mx-auto"
        style={{ width: PAGE_WIDTH * scale, height: pages * PAGE_HEIGHT * scale, opacity: fit ? 1 : 0 }}
      >
        <div
          className="paper absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: PAGE_WIDTH, minHeight: pages * PAGE_HEIGHT, transform: `scale(${scale})` }}
        >
          <div ref={content}>
            <ResumeDocument resume={resume} printable={false} />
          </div>
          {showPageBreaks &&
            Array.from({ length: pages - 1 }, (_, n) => (
              <div
                key={n}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-brand/40"
                style={{ top: (n + 1) * PAGE_HEIGHT }}
              >
                <span className="absolute right-3 -top-3 rounded bg-brand px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  Page {n + 2}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
