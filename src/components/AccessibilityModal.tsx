import React from 'react';
import { X, Eye, Type, Activity, Keyboard, Volume2 } from 'lucide-react';
import { TextScale } from '../hooks/useAccessibility';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  textScale: TextScale;
  setTextScale: (v: TextScale) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  announce: (msg: string) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  highContrast,
  setHighContrast,
  textScale,
  setTextScale,
  reducedMotion,
  setReducedMotion,
  announce,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-lg font-bold text-white tracking-tight">
                Accessibility (WCAG 2.1 AA/AAA)
              </h2>
              <p className="text-xs text-slate-400">
                Personalize contrast, typography, screen-reader cues & motion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Section */}
        <div className="my-5 space-y-5">
          
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">High Contrast Mode</span>
                <span className="text-xs text-slate-400">
                  Elevates contrast ratios and enforces solid borders for low-vision readability.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const newVal = !highContrast;
                setHighContrast(newVal);
                announce(`High contrast mode ${newVal ? 'enabled' : 'disabled'}`);
              }}
              aria-pressed={highContrast}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                highContrast ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Text Sizing Scale */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Font Size Scaling</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xlarge'] as TextScale[]).map((scale) => {
                const label = scale === 'normal' ? 'Normal (100%)' : scale === 'large' ? 'Large (115%)' : 'Extra Large (130%)';
                const isSelected = textScale === scale;
                return (
                  <button
                    key={scale}
                    onClick={() => {
                      setTextScale(scale);
                      announce(`Font scale set to ${label}`);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Reduced Motion</span>
                <span className="text-xs text-slate-400">
                  Suppresses spring animations and decorative transitions for vestibular sensitivities.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const newVal = !reducedMotion;
                setReducedMotion(newVal);
                announce(`Reduced motion ${newVal ? 'enabled' : 'disabled'}`);
              }}
              aria-pressed={reducedMotion}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                reducedMotion ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Keyboard Navigation Shortcuts */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 mb-2.5 text-white font-semibold">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <span>Keyboard Navigation Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span>Modules 1 - 5</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] border border-slate-700">1 - 5</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span>Share Blueprint</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] border border-slate-700">S</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span>Add to Home / PWA</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] border border-slate-700">I</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span>Close Modals</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] border border-slate-700">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Screen Reader Test Button */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-300">Test Live ARIA Announcer:</span>
            <button
              onClick={() => announce('PlanGuard AI zero-trust gateway verified and active.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trigger Alert</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
