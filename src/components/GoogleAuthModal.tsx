import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  ExternalLink,
  UserCheck,
  Lock,
  Globe,
  Clock
} from 'lucide-react';
import { 
  GOOGLE_CLIENT_ID, 
  GOOGLE_PROJECT_ID, 
  PRECONFIGURED_TEST_ACCOUNTS, 
  GoogleUser 
} from '../services/googleAuthService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GoogleUser | null;
  onSelectUser: (user: GoogleUser) => void;
  onSignOut: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onSignOut,
}) => {
  const [showConsoleGuide, setShowConsoleGuide] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedOrigin(text);
      setTimeout(() => setCopiedOrigin(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-auth-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-slate-900 shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <h2 id="google-auth-title" className="text-lg font-bold text-white tracking-tight">
                Google Authentication & Access Control
              </h2>
              <p className="text-xs text-slate-400">
                Client ID: <code className="text-cyan-400 font-mono text-[11px]">188621645679-...</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Session */}
        {currentUser && (
          <div className="my-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover" 
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Multi-Account Selection Section */}
        <div className="my-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select Authorized Google Account</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pre-Registered Testers
            </span>
          </div>

          <div className="space-y-2.5">
            {PRECONFIGURED_TEST_ACCOUNTS.map((account) => {
              const isSelected = currentUser?.email === account.email;
              return (
                <button
                  key={account.id}
                  onClick={() => {
                    onSelectUser(account);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={account.avatar} 
                      alt={account.name}
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover" 
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{account.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          account.role === 'Host' 
                            ? 'bg-purple-950 text-purple-300 border border-purple-800/40' 
                            : 'bg-sky-950 text-sky-300 border border-sky-800/40'
                        }`}>
                          {account.role} Role
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
                        {account.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white transition inline-block">
                      {isSelected ? 'Active' : 'Sign In'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Console Diagnosis Guide (Error 401) */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <button
            onClick={() => setShowConsoleGuide(!showConsoleGuide)}
            className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Console Fix Guide (Error 401: origin_mismatch)</span>
            </div>
            {showConsoleGuide ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showConsoleGuide && (
            <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4 text-xs text-slate-300">
              
              <p className="leading-relaxed text-slate-400">
                Google strictly blocks requests if the requesting website origin is not pre-registered in your OAuth Client ID settings.
              </p>

              {/* Step 1: Origins */}
              <div className="space-y-2">
                <span className="font-semibold text-white block">1. Add to Authorized JavaScript Origins:</span>
                <div className="space-y-1.5">
                  {[
                    currentOrigin,
                    'https://ais-dev-usnjl7mubvv4watcmkhmvf-440468285390.asia-east1.run.app',
                    'https://ais-pre-usnjl7mubvv4watcmkhmvf-440468285390.asia-east1.run.app',
                    'https://ais-dev-mthhzeqnq5vzzabg4gqj2o-440468285390.asia-east1.run.app',
                    'http://localhost:3000'
                  ].map((origin) => (
                    <div 
                      key={origin}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]"
                    >
                      <span className="truncate pr-2 text-slate-300">{origin}</span>
                      <button
                        onClick={() => copyToClipboard(origin)}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition shrink-0"
                      >
                        {copiedOrigin === origin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedOrigin === origin ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Test Users */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-semibold text-white block">2. Add Approved Test Users in Cloud Console:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">alokinfo.proict@gmail.com</span>
                    <button 
                      onClick={() => copyToClipboard('alokinfo.proict@gmail.com')}
                      className="text-cyan-400 hover:text-cyan-300 p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">alokinfo30@gmail.com</span>
                    <button 
                      onClick={() => copyToClipboard('alokinfo30@gmail.com')}
                      className="text-cyan-400 hover:text-cyan-300 p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Propagation */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 flex items-start gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Google Worldwide Edge Propagation:</strong>
                  When an OAuth Client ID is created or updated in Google Cloud Console, it can take 3 to 10 minutes to replicate globally across Google's authentication infrastructure. The pre-authenticated multi-account switcher above allows immediate testing!
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>OAuth 2.0 Web Client Security</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
