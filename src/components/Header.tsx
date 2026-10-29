import React from 'react';
import { 
  ShieldCheck, 
  Share2, 
  Smartphone, 
  Eye, 
  Users, 
  Lock, 
  CheckCircle,
  Menu,
  X,
  Download,
  KeyRound,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { GatewayStatus } from '../types';
import { GoogleUser } from '../services/googleAuthService';

interface HeaderProps {
  gatewayStatus: GatewayStatus | null;
  activeTenant: string;
  setActiveTenant: (tenant: string) => void;
  onOpenShare: () => void;
  onOpenPWA: () => void;
  onOpenA11y: () => void;
  onOpenExport: () => void;
  onOpenGoogleAuth: () => void;
  currentUser: GoogleUser | null;
  lastSyncedAt?: Date | null;
  isSyncing?: boolean;
  isOnline?: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  gatewayStatus,
  activeTenant,
  setActiveTenant,
  onOpenShare,
  onOpenPWA,
  onOpenA11y,
  onOpenExport,
  onOpenGoogleAuth,
  currentUser,
  lastSyncedAt = null,
  isSyncing = false,
  isOnline = true,
  isInstallable,
  isInstalled,
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [syncTimeAgo, setSyncTimeAgo] = React.useState('Just now');

  React.useEffect(() => {
    const updateSyncLabel = () => {
      if (!lastSyncedAt) {
        setSyncTimeAgo('Connected');
        return;
      }
      const diffSec = Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000);
      if (diffSec < 5) {
        setSyncTimeAgo('Synced just now');
      } else if (diffSec < 60) {
        setSyncTimeAgo(`Synced ${diffSec}s ago`);
      } else {
        const diffMin = Math.floor(diffSec / 60);
        setSyncTimeAgo(`Synced ${diffMin}m ago`);
      }
    };

    updateSyncLabel();
    const interval = setInterval(updateSyncLabel, 2000);
    return () => clearInterval(interval);
  }, [lastSyncedAt]);

  const tenantOptions = [
    { id: 'user_enterprise_corp', label: 'Enterprise Summit', role: 'Host (Alok - alokinfo.proict)' },
    { id: 'user_secure_alice', label: 'Alice & David Wedding', role: 'Guest (Alok - alokinfo30)' },
    { id: 'user_alokinfo_proict', label: 'Marcus 30th Birthday', role: 'Host (Alok - alokinfo.proict)' },
    { id: 'user_alokinfo30', label: 'Greenwood Community Fest', role: 'Admin (Alok - alokinfo30)' },
  ];

  const navItems = [
    { id: 'assistant', label: 'AI Planning Studio' },
    { id: 'checklist', label: 'Vendor Checklist' },
    { id: 'financials', label: 'Financials & Budget' },
    { id: 'timeline', label: 'Timeline & Agents' },
    { id: 'venues', label: 'Venues & Map' },
    { id: 'blueprint', label: 'Blueprint' },
    { id: 'security-matrix', label: 'Pentest Matrix' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PlanGuard<span className="text-cyan-400">.AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Zero-Trust
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Mid-Tier Gateway &middot; Hardened Prompt Boundaries &middot; RLS
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800" aria-label="Main Navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            
            {/* Database Sync Status Indicator */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
              title="Remote database synchronization status"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span className="text-cyan-300 font-mono">Syncing...</span>
                </>
              ) : isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-slate-300">{syncTimeAgo}</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="text-amber-400 font-mono">Offline</span>
                </>
              )}
            </div>

            {/* Google Authentication Account Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenGoogleAuth}
                aria-label="Google Authentication & Account Manager"
                title="Google OAuth & Account Switcher"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition cursor-pointer"
              >
                {currentUser ? (
                  <>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-4 h-4 rounded-full object-cover border border-emerald-400" 
                    />
                    <span className="hidden xl:inline text-[11px] font-medium text-cyan-300">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {currentUser.isLiveGoogleAccount && (
                      <span className="hidden 2xl:inline text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        Live Google
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span className="hidden sm:inline text-[11px] font-medium text-slate-200">Sign in with Google</span>
                  </>
                )}
              </button>

              {currentUser && (
                <button
                  onClick={onOpenGoogleAuth}
                  aria-label="Switch Google Account"
                  title="Switch to another Google Account"
                  className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden lg:inline">Switch</span>
                </button>
              )}
            </div>

            {/* Export Data Modal Button */}
            <button
              onClick={onOpenExport}
              aria-label="Export Encrypted Event Data"
              title="Download Secure Encrypted JSON (AES-256)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Export Data</span>
            </button>

            {/* Multi-Tenant Switcher (RLS Demonstration) */}
            <div className="relative hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
              <Lock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              <label htmlFor="tenant-select" className="sr-only">Tenant Selector</label>
              <select
                id="tenant-select"
                value={activeTenant}
                onChange={(e) => setActiveTenant(e.target.value)}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
                title="Demonstrates Zero-Trust Row-Level Security (RLS) data isolation"
              >
                {tenantOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility Quick Button */}
            <button
              onClick={onOpenA11y}
              aria-label="Open Accessibility Options"
              title="Accessibility & Keyboard shortcuts (A)"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Share Blueprint Button */}
            <button
              onClick={onOpenShare}
              aria-label="Share Event Blueprint"
              title="Share Blueprint on Social Networks (S)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Add to Home Screen (PWA Button) */}
            <button
              onClick={onOpenPWA}
              aria-label="Add to Home Screen"
              title="Add to Home Screen / Install PWA (I)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isInstalled
                  ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-sm shadow-indigo-500/20'
              }`}
            >
              {isInstalled ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Installed</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Add to Home</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-2">
              <button
                onClick={() => { onOpenExport(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs text-cyan-300 py-1"
              >
                <Download className="w-4 h-4" />
                <span>Export Encrypted JSON</span>
              </button>
              <button
                onClick={() => { onOpenGoogleAuth(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 text-xs text-slate-300 py-1"
              >
                <span>Google Auth</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
