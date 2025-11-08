'use client';

import { useEffect, useState } from 'react';

interface ShareResumeProps {
  resumeId: string;
}

export default function ShareResume({ resumeId }: ShareResumeProps) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Only set the URL on the client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 print:hidden">
      <h3 className="font-semibold mb-2 text-gray-900">Share this resume:</h3>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-1 border border-gray-300 p-2.5 rounded-lg bg-white text-sm"
        />
        <button
          onClick={handleCopyLink}
          className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}

