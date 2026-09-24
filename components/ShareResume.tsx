'use client';

import { useSyncExternalStore } from 'react';
import { showToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const noop = () => () => {};

export default function ShareResume() {
  // The page URL is only known in the browser; render a placeholder on the server.
  const shareUrl = useSyncExternalStore(noop, () => window.location.href, () => '');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied', 'success');
    } catch {
      showToast('Could not copy. Select the link and copy it manually.', 'error');
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input readOnly value={shareUrl} aria-label="Share link" onFocus={(e) => e.target.select()}
          className="field min-w-0 flex-1 truncate !py-2 text-[13px] text-ink-2" />
        <Button variant="primary" size="md" icon="link" onClick={copy}>Copy</Button>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
        <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
        Anyone with the link can view it. It isn&apos;t listed anywhere or indexed by search engines.
      </p>
    </div>
  );
}
