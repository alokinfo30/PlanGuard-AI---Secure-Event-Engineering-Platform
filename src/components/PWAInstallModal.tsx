import React from 'react';
import { X, Smartphone, Download, Share, PlusSquare, ShieldCheck, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 id="pwa-install-title" className="text-lg font-bold text-white tracking-tight">
                Add to Home Screen
              </h2>
              <p className="text-xs text-slate-400">
                Install PlanGuard AI as a standalone Progressive Web App
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close installation dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Content */}
        {isInstalled ? (
          <div className="my-6 text-center py-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white">Application Installed</h3>
            <p className="text-xs text-slate-400 mt-1">
              PlanGuard AI is already installed and running with standalone system isolation.
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="my-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
                <span>iOS Safari Installation Protocol:</span>
              </div>
              Apple iOS requires adding web apps manually through Safari's system menu:
            </div>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">1. Tap the Share button</strong>
                  Located at the bottom toolbar of Safari (box with upward arrow).
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">2. Select "Add to Home Screen"</strong>
                  Scroll down the share sheet and tap <span className="text-cyan-300 font-mono">Add to Home Screen</span>.
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">3. Tap "Add" in Top Right</strong>
                  The app icon will appear directly on your iOS launcher with offline capabilities.
                </div>
              </li>
            </ol>
          </div>
        ) : isInstallable ? (
          /* Android / Chrome / Edge Native Prompt */
          <div className="my-6 space-y-4">
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
              <p className="font-semibold text-white mb-1">Instant Native Experience</p>
              Install without app store downloads. Enjoy fullscreen standalone execution, fast cached loading, and zero browser chrome.
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen / Desktop</span>
            </button>
          </div>
        ) : (
          /* General Desktop or unsupported browser */
          <div className="my-6 space-y-4 text-xs text-slate-300">
            <p>
              Your current browser does not support programmatic install triggers. You can still install PlanGuard AI:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1">
              <li>In Chrome / Edge desktop: Click the <strong className="text-white">Install icon (⊕)</strong> in the URL bar.</li>
              <li>On Mobile: Use browser menu → <strong className="text-white">Add to Home screen</strong>.</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
