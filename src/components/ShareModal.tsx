import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Smartphone,
  ShieldCheck 
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
  totalBudget?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  eventTitle = 'Global Tech Summit 2027', 
  totalBudget = 150000 
}) => {
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://planguard.ai';
  const shareText = `🛡️ Engineered on PlanGuard AI: "${eventTitle}" with hardened prompt isolation and verified deterministic financial modeling ($${totalBudget.toLocaleString()}).`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PlanGuard Blueprint: ${eventTitle}`,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share dismissed or aborted', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareInstagram = async () => {
    const instagramCaption = `🛡️ [PlanGuard AI Blueprint]\nEvent: ${eventTitle}\nBudget Model: $${totalBudget.toLocaleString()} (Guarded with 10% Deterministic Contingency)\nSecurity Protocol: Zero-Trust Prompt Boundary & RLS Isolated\nExplore the architecture: ${currentUrl}`;
    try {
      await navigator.clipboard.writeText(instagramCaption);
      setInstaCopied(true);
      setTimeout(() => setInstaCopied(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-lg font-bold text-white tracking-tight">
                Share Event Blueprint
              </h2>
              <p className="text-xs text-slate-400">
                Encrypted architectural blueprint and budget model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blueprint Preview Card */}
        <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Trust Guarded Blueprint</span>
          </div>
          <div className="text-sm font-semibold text-white">{eventTitle}</div>
          <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-4">
            <span>Budget: <strong className="text-slate-200">${totalBudget.toLocaleString()}</strong></span>
            <span>Security: <strong className="text-indigo-400">Isolated Prompt Buffer</strong></span>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* WhatsApp */}
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/50 hover:border-emerald-600 text-emerald-300 font-medium text-xs transition"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-semibold">WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={shareFacebook}
            className="flex items-center gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 hover:bg-blue-900/50 hover:border-blue-600 text-blue-300 font-medium text-xs transition"
          >
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Facebook className="w-4 h-4" />
            </div>
            <span className="font-semibold">Facebook</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={shareTwitter}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-500 text-slate-200 font-medium text-xs transition"
          >
            <div className="p-2 rounded-lg bg-white/10 text-white">
              <Twitter className="w-4 h-4" />
            </div>
            <span className="font-semibold">Twitter / X</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={shareLinkedIn}
            className="flex items-center gap-3 p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 hover:bg-sky-900/50 hover:border-sky-600 text-sky-300 font-medium text-xs transition"
          >
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Linkedin className="w-4 h-4" />
            </div>
            <span className="font-semibold">LinkedIn</span>
          </button>

          {/* Instagram */}
          <button
            onClick={shareInstagram}
            className="flex items-center gap-3 p-3 rounded-xl bg-pink-950/40 border border-pink-800/40 hover:bg-pink-900/50 hover:border-pink-600 text-pink-300 font-medium text-xs transition"
            title="Copy Instagram formatted story text"
          >
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-semibold block">Instagram</span>
              <span className="text-[10px] text-pink-400/80">{instaCopied ? 'Caption Copied!' : 'Copy Caption'}</span>
            </div>
          </button>

          {/* Web Share API */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 hover:bg-indigo-900/50 hover:border-indigo-600 text-indigo-300 font-medium text-xs transition"
            >
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="font-semibold">System Share</span>
            </button>
          )}

        </div>

        {/* Copy Link Direct Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Sharable Applet URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
