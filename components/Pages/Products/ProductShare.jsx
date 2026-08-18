'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ProductShare({ title, text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = title || 'AFP Technologies - Machinery Equipment';
    const shareText = text || `Check out ${shareTitle} at AFP Technologies!`;

    // 1. Mobile Native Web Share API Check
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // 2. Desktop Fallback -> Clipboard me Copy
      copyToClipboard(shareUrl);
    }
  };

  

  const copyToClipboard = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } else {
      // Old fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs border ${
        copied
          ? 'bg-emerald-600/15 border-emerald-500/40 text-emerald-400'
          : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
      } ${className}`}
      title="Share this product page"
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400 animate-bounce" />
          <span>Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={14} className="text-sky-400" />
          <span>Share Product</span>
        </>
      )}
    </button>
  );
}