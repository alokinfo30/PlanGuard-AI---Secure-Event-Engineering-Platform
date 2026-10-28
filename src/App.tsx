import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WAFStatusBanner } from './components/WAFStatusBanner';
import { ShareModal } from './components/ShareModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ExportDataModal } from './components/ExportDataModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ArchitectureBlueprintModule } from './components/modules/ArchitectureBlueprintModule';
import { FinancialModule } from './components/modules/FinancialModule';
import { TimelineVendorModule } from './components/modules/TimelineVendorModule';
import { VenueMapModule } from './components/modules/VenueMapModule';
import { TestMatrixModule } from './components/modules/TestMatrixModule';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useAccessibility } from './hooks/useAccessibility';
import { GatewayStatus, Milestone, EventCategory, Vendor, Venue } from './types';
import { 
  GoogleUser, 
  PRECONFIGURED_TEST_ACCOUNTS 
} from './services/googleAuthService';
import { 
  Layers, 
  Calculator, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  Share2, 
  Smartphone,
  Eye,
  WifiOff,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('blueprint');
  const [activeTenant, setActiveTenant] = useState<string>('user_enterprise_corp');
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus | null>(null);
  const [isRefreshingGateway, setIsRefreshingGateway] = useState(false);

  // Authenticated Google User state
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(PRECONFIGURED_TEST_ACCOUNTS[0]);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPWAOpen, setIsPWAOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);

  // PWA Install hook
  const { isInstallable, isInstalled } = usePWAInstall();

  // Accessibility hook
  const {
    highContrast,
    setHighContrast,
    textScale,
    setTextScale,
    reducedMotion,
    setReducedMotion,
    liveAnnouncement,
    announce,
  } = useAccessibility();

  // Online / Offline status
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      announce('Internet connection restored.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      announce('Working in offline mode. Local service worker caching active.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [announce]);

  // Fetch Gateway Status & Telemetry
  const fetchGatewayStatus = useCallback(async () => {
    setIsRefreshingGateway(true);
    try {
      const res = await fetch('/api/gateway/status', {
        headers: {
          'x-user-id': activeTenant,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data);
      }
    } catch (err) {
      console.error('Failed to query gateway status:', err);
    } finally {
      setIsRefreshingGateway(false);
    }
  }, [activeTenant]);

  useEffect(() => {
    fetchGatewayStatus();
    const interval = setInterval(fetchGatewayStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchGatewayStatus]);

  // User Selection handler
  const handleSelectGoogleUser = (user: GoogleUser) => {
    setCurrentUser(user);
    setActiveTenant(user.tenantId);
    announce(`Signed in as ${user.name} (${user.role} role)`);
  };

  const handleSignOutGoogleUser = () => {
    setCurrentUser(null);
    announce('Signed out of Google account.');
  };

  // Keyboard Shortcuts Listener (WCAG 2.1 AA)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'Escape') {
        setIsShareOpen(false);
        setIsPWAOpen(false);
        setIsA11yOpen(false);
        setIsExportOpen(false);
        setIsGoogleAuthOpen(false);
      } else if (e.key === '1') {
        setActiveTab('blueprint');
        announce('Switched to Architecture Blueprint');
      } else if (e.key === '2') {
        setActiveTab('financials');
        announce('Switched to Module A: Financials');
      } else if (e.key === '3') {
        setActiveTab('timeline');
        announce('Switched to Module B: Timelines & Vendors');
      } else if (e.key === '4') {
        setActiveTab('venues');
        announce('Switched to Module C: Venues & Map');
      } else if (e.key === '5') {
        setActiveTab('security-matrix');
        announce('Switched to Phase 4: Test Matrix');
      } else if (e.key.toLowerCase() === 's') {
        setIsShareOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'i') {
        setIsPWAOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'a') {
        setIsA11yOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'e') {
        setIsExportOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [announce]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-20 lg:pb-8">
      
      {/* Screen Reader ARIA Live Region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* Offline Toast */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2 font-medium">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode Active — PlanGuard PWA service worker is caching local operations.</span>
        </div>
      )}

      {/* Primary Header */}
      <Header
        gatewayStatus={gatewayStatus}
        activeTenant={activeTenant}
        setActiveTenant={setActiveTenant}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenPWA={() => setIsPWAOpen(true)}
        onOpenA11y={() => setIsA11yOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        currentUser={currentUser}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Mid-Tier WAF Telemetry Banner */}
      <WAFStatusBanner
        status={gatewayStatus}
        activeTenant={activeTenant}
        onRefresh={fetchGatewayStatus}
        isRefreshing={isRefreshingGateway}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none" tabIndex={-1}>
        {activeTab === 'blueprint' && <ArchitectureBlueprintModule />}
        {activeTab === 'financials' && <FinancialModule activeTenant={activeTenant} />}
        {activeTab === 'timeline' && <TimelineVendorModule activeTenant={activeTenant} />}
        {activeTab === 'venues' && <VenueMapModule activeTenant={activeTenant} />}
        {activeTab === 'security-matrix' && (
          <TestMatrixModule 
            activeTenant={activeTenant} 
            onRefreshGateway={fetchGatewayStatus} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            PlanGuard AI &middot; High-Security Event Engineering & Automated Agents
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>WCAG 2.1 AA Compliant</span>
            <span>&middot;</span>
            <span>Zero-Trust Mid-Tier Proxy</span>
            <span>&middot;</span>
            <span>Gemini 3.8 Flash SDK</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1 text-[10px]"
        aria-label="Mobile Navigation Bar"
      >
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'blueprint' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'financials' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'timeline' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('venues')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'venues' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Venues</span>
        </button>

        <button
          onClick={() => setActiveTab('security-matrix')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'security-matrix' ? 'text-red-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pentest</span>
        </button>

        <button
          onClick={() => setIsExportOpen(true)}
          className="flex flex-col items-center gap-1 p-1 rounded-lg text-cyan-400"
          title="Export Encrypted JSON"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        <button
          onClick={() => setIsPWAOpen(true)}
          className="flex flex-col items-center gap-1 p-1 rounded-lg text-emerald-400"
          title="Add to Home Screen"
        >
          <Smartphone className="w-4 h-4" />
          <span>Install</span>
        </button>
      </nav>

      {/* Modals */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        eventTitle={activeTenant === 'user_secure_alice' ? 'Alice & David Wedding Gala' : 'Global Tech Summit 2027'}
        totalBudget={activeTenant === 'user_secure_alice' ? 45000 : 150000}
      />

      <PWAInstallModal
        isOpen={isPWAOpen}
        onClose={() => setIsPWAOpen(false)}
      />

      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        textScale={textScale}
        setTextScale={setTextScale}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        announce={announce}
      />

      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeTenant={activeTenant}
        financialData={{
          totalBudget: activeTenant === 'user_secure_alice' ? 45000 : 150000,
          guestCount: activeTenant === 'user_secure_alice' ? 120 : 500,
          perAttendeeCost: activeTenant === 'user_secure_alice' ? 375 : 300,
          contingencyReserve: activeTenant === 'user_secure_alice' ? 4500 : 15000,
          categories: [
            { name: 'Venue & Staging Infrastructure', allocated: 55000, spent: 48000, percentage: 36.6, note: 'Auditorium rental' },
            { name: 'Catering & Dining Hospitality', allocated: 40000, spent: 39500, percentage: 26.6, note: 'Dietary certified menus' },
            { name: 'AV & Hybrid Broadcast Engineering', allocated: 25000, spent: 24000, percentage: 16.6, note: '4K switchers & stream' },
            { name: 'Badging, Registration & Security', allocated: 15000, spent: 11000, percentage: 10.0, note: 'RFID credentials' },
            { name: 'Contingency Reserve (Math Guard)', allocated: 15000, spent: 0, percentage: 10.0, note: 'Deterministic 10% reserve' },
          ]
        }}
        milestonesData={[
          { daysBefore: 180, title: 'Contract Convention Center', dueDate: '2026-11-16', status: 'completed', priority: 'high', assignedAgent: 'VenueShield' },
          { daysBefore: 120, title: 'Keynote & Executive Speakers', dueDate: '2027-01-15', status: 'in_progress', priority: 'high', assignedAgent: 'TalentBroker' },
          { daysBefore: 90, title: 'Early-Bird Registration', dueDate: '2027-02-14', status: 'in_progress', priority: 'medium', assignedAgent: 'RegManager' },
          { daysBefore: 60, title: 'AV Rigging & Broadcast Audit', dueDate: '2027-03-16', status: 'pending', priority: 'high', assignedAgent: 'AVEngineer' },
          { daysBefore: 30, title: 'Catering Headcount Lockdown', dueDate: '2027-04-15', status: 'pending', priority: 'medium', assignedAgent: 'CateringAgent' },
        ]}
        vendorsData={[
          { id: 'vnd-1', name: 'Apex Staging Systems', category: 'Audio/Visual', trustScore: 98, quoteAmount: 24500, status: 'vetted' },
          { id: 'vnd-2', name: 'Grand Horizon Center', category: 'Venue', trustScore: 99, quoteAmount: 52000, status: 'vetted' },
        ]}
        venuesData={[
          { id: 'ven-1', name: 'The Citadel Cyber Pavilion', address: '780 Mission Street, San Francisco', maxCapacity: 650, approxCostPerDay: 48000, securityRating: 'Tier 4 Enterprise Defense', lat: 37.7857, lng: -122.4011, highlights: ['Biometric gates', 'Faraday room', '4K LED wall'] },
          { id: 'ven-2', name: 'Grand Horizon Concourse', address: '1000 4th Street, San Francisco', maxCapacity: 800, approxCostPerDay: 54000, securityRating: 'Tier 3 Corporate', lat: 37.7735, lng: -122.3925, highlights: ['Waterfront', 'Loading dock', 'Dual power'] },
        ]}
      />

      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectGoogleUser}
        onSignOut={handleSignOutGoogleUser}
      />

    </div>
  );
}
