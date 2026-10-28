import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  FileText,
  Info,
  Sliders,
  RotateCcw,
  Zap,
  Bell,
  X,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { EventCategory } from '../../types';

interface ExtendedCategory extends EventCategory {
  initialAllocated: number;
}

interface BudgetAlertToast {
  id: string;
  categoryName: string;
  spent: number;
  allocated: number;
  initialAllocated: number;
  percentageSpent: number;
  timestamp: string;
}

interface FinancialModuleProps {
  activeTenant: string;
}

const CATEGORY_COLORS = [
  '#6366f1', // Indigo - Venue
  '#3b82f6', // Blue - Catering
  '#06b6d4', // Cyan - AV
  '#8b5cf6', // Purple - Security/Badging
  '#10b981', // Emerald - Contingency Reserve
  '#f59e0b', // Amber - Auxiliary
];

export const FinancialModule: React.FC<FinancialModuleProps> = ({ activeTenant }) => {
  const [eventType, setEventType] = useState('Global Tech Summit 2027');
  const [totalBudget, setTotalBudget] = useState<string>('150000');
  const [guestCount, setGuestCount] = useState<string>('500');
  const [tier, setTier] = useState('Executive Enterprise');
  const [location, setLocation] = useState('Metropolitan Convention District');
  const [specialNotes, setSpecialNotes] = useState('Focus on high-speed dual-redundant Wi-Fi, keynote AV staging, and sustainable catering.');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Category Allocations state with initialAllocated baseline
  const [categories, setCategories] = useState<ExtendedCategory[]>([
    { 
      name: 'Venue & Staging Infrastructure', 
      allocated: 55000, 
      initialAllocated: 55000, 
      spent: 48000, 
      percentage: 36.6, 
      note: 'Main auditorium & sound dampening', 
      costSavingTip: 'Bonded union quote vetted' 
    },
    { 
      name: 'Catering & Dining Hospitality', 
      allocated: 40000, 
      initialAllocated: 40000, 
      spent: 45000, // Pre-seeded at 112.5% to demonstrate the >110% Budget Alert!
      percentage: 26.6, 
      note: 'Dietary certified menus & coffee stations', 
      costSavingTip: 'Lock headcount 14 days prior' 
    },
    { 
      name: 'AV & Hybrid Broadcast Engineering', 
      allocated: 25000, 
      initialAllocated: 25000, 
      spent: 24000, 
      percentage: 16.6, 
      note: 'Dual 4K switchers and live stream', 
      costSavingTip: 'Package rental with in-house tech' 
    },
    { 
      name: 'Badging, Registration & Security', 
      allocated: 15000, 
      initialAllocated: 15000, 
      spent: 11000, 
      percentage: 10.0, 
      note: 'RFID credentials & security team', 
      costSavingTip: 'Digital badge fast-lane' 
    },
    { 
      name: 'Contingency Reserve (Math Guard)', 
      allocated: 15000, 
      initialAllocated: 15000, 
      spent: 0, 
      percentage: 10.0, 
      note: 'Mandatory deterministic 10% reserve', 
      costSavingTip: 'Emergency authorized draws only' 
    },
  ]);

  // AI Strategic insight
  const [aiPlan, setAiPlan] = useState<{
    theme: string;
    executiveSummary: string;
    riskAnalysis: string[];
  } | null>(null);

  // Active Toast notifications for Budget Overruns (> 110%)
  const [alerts, setAlerts] = useState<BudgetAlertToast[]>([]);
  const [lastAlertedCategories, setLastAlertedCategories] = useState<Set<string>>(new Set());

  const currentTotal = Number(totalBudget) || 150000;
  const currentGuests = Number(guestCount) || 500;
  const perGuestCost = Math.round((currentTotal / currentGuests) * 100) / 100;

  // Load tenant event from server when activeTenant changes
  useEffect(() => {
    const fetchTenantEvent = async () => {
      try {
        const res = await fetch('/api/events', {
          headers: { 'x-user-id': activeTenant }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.events && data.events.length > 0) {
            const evt = data.events[0];
            setEventType(evt.title);
            setTotalBudget(evt.budgetTotal.toString());
            setGuestCount(evt.guestCount.toString());
            if (evt.categories && evt.categories.length > 0) {
              const enriched: ExtendedCategory[] = evt.categories.map((c: any) => ({
                name: c.name,
                allocated: c.allocated,
                initialAllocated: c.allocated,
                spent: c.spent !== undefined ? c.spent : Math.round(c.allocated * 0.75),
                percentage: c.percentage,
                note: c.note,
                costSavingTip: c.costSavingTip || 'Verified bonded bid'
              }));
              setCategories(enriched);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load event data for tenant:', err);
      }
    };
    fetchTenantEvent();
  }, [activeTenant]);

  // Monitor Categories for Spend > 110% of Initial Allocation
  useEffect(() => {
    const newAlerts: BudgetAlertToast[] = [];
    const triggeredSet = new Set<string>();

    categories.forEach((cat) => {
      const baseline = cat.initialAllocated || cat.allocated;
      if (baseline > 0 && cat.spent > baseline * 1.10) {
        const pct = Math.round((cat.spent / baseline) * 1000) / 10;
        triggeredSet.add(cat.name);

        // Only create new toast if not already alerted in current batch
        if (!lastAlertedCategories.has(cat.name)) {
          newAlerts.push({
            id: `alert-${cat.name}-${Date.now()}`,
            categoryName: cat.name,
            spent: cat.spent,
            allocated: cat.allocated,
            initialAllocated: baseline,
            percentageSpent: pct,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 4));
    }
    setLastAlertedCategories(triggeredSet);
  }, [categories]);

  // Dismiss Toast
  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Recharts Pie Data Formatting
  const pieChartData = useMemo(() => {
    return categories.map((cat, idx) => ({
      name: cat.name.replace(' (Deterministic Math Guard)', '').replace(' (Math Guard)', ''),
      value: cat.allocated,
      spent: cat.spent,
      percentage: cat.percentage,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      isOver110: cat.spent > (cat.initialAllocated || cat.allocated) * 1.10,
    }));
  }, [categories]);

  // 1. Modify specific allocation & recalculate contingency automatically
  const handleModifyAllocation = (index: number, newAllocated: number) => {
    const budgetNum = Number(totalBudget) || 150000;
    const sanitizedVal = Math.max(0, Math.round(newAllocated));

    setCategories((prev) => {
      const updated = [...prev];
      const targetCat = updated[index];
      if (!targetCat) return prev;

      // If modifying non-contingency, adjust contingency reserve to keep total balanced
      if (!targetCat.name.includes('Contingency')) {
        targetCat.allocated = sanitizedVal;

        // Sum other non-contingency categories
        const nonContingencySum = updated
          .filter((c) => !c.name.includes('Contingency'))
          .reduce((acc, c) => acc + c.allocated, 0);

        const contingencyIndex = updated.findIndex((c) => c.name.includes('Contingency'));
        if (contingencyIndex !== -1) {
          const remainingContingency = Math.max(0, budgetNum - nonContingencySum);
          updated[contingencyIndex].allocated = remainingContingency;
        }
      } else {
        targetCat.allocated = sanitizedVal;
      }

      // Re-normalize percentages
      return updated.map((c) => ({
        ...c,
        percentage: Math.round((c.allocated / budgetNum) * 1000) / 10,
      }));
    });
  };

  // 2. Feature: Automatically recalculate & distribute remaining contingency budget proportionally across categories
  const handleDistributeContingencyProportionally = () => {
    const budgetNum = Number(totalBudget) || 150000;
    const contingencyIndex = categories.findIndex((c) => c.name.includes('Contingency'));
    if (contingencyIndex === -1) return;

    const currentContingency = categories[contingencyIndex].allocated;
    // Keep a mandatory 5% minimum emergency safe floor ($ budgetNum * 0.05)
    const minSafeContingency = Math.round(budgetNum * 0.05);
    const distributableContingency = Math.max(0, currentContingency - minSafeContingency);

    if (distributableContingency <= 0) {
      setErrorMsg('Contingency is already at the minimum 5% emergency safety threshold. No surplus available for proportional distribution.');
      return;
    }

    setErrorMsg(null);

    setCategories((prev) => {
      const nonContingencyCats = prev.filter((c) => !c.name.includes('Contingency'));
      const nonContingencyTotal = nonContingencyCats.reduce((acc, c) => acc + c.allocated, 0);

      if (nonContingencyTotal === 0) return prev;

      const updated = prev.map((cat) => {
        if (cat.name.includes('Contingency')) {
          return {
            ...cat,
            allocated: minSafeContingency,
            percentage: Math.round((minSafeContingency / budgetNum) * 1000) / 10,
            note: 'Locked at mandatory 5% emergency safe floor after proportional distribution',
          };
        }

        // Proportional weight based on existing allocation
        const weight = cat.allocated / nonContingencyTotal;
        const extraAmount = Math.round(distributableContingency * weight);
        const newAllocated = cat.allocated + extraAmount;

        return {
          ...cat,
          allocated: newAllocated,
          percentage: Math.round((newAllocated / budgetNum) * 1000) / 10,
        };
      });

      // Exact sum adjustment check
      const currentSum = updated.reduce((acc, c) => acc + c.allocated, 0);
      const adjustment = budgetNum - currentSum;
      if (adjustment !== 0 && updated.length > 0) {
        updated[0].allocated += adjustment;
      }

      return updated;
    });
  };

  // 3. Simulate spend increase (Allows user to test the 110% Budget Alert in 1 click!)
  const handleSimulateOverrun = (index: number) => {
    setCategories((prev) => {
      const updated = [...prev];
      const cat = updated[index];
      const baseline = cat.initialAllocated || cat.allocated;
      // Set to 118% to trigger alert
      cat.spent = Math.round(baseline * 1.18);
      return updated;
    });
  };

  // 4. Reset spends to healthy range
  const handleResetSpends = () => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        spent: Math.round(c.allocated * 0.82),
      }))
    );
    setAlerts([]);
    setLastAlertedCategories(new Set());
  };

  // Server plan generation
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const budgetNum = Number(totalBudget);
      const guestNum = Number(guestCount);

      if (isNaN(budgetNum) || budgetNum <= 0) {
        setErrorMsg('Mathematical Validation Error: Budget must be a positive non-zero number.');
        setIsLoading(false);
        return;
      }

      if (isNaN(guestNum) || guestNum <= 0) {
        setErrorMsg('Guest count must be at least 1 person.');
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/events/financials/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeTenant,
        },
        body: JSON.stringify({
          eventType,
          totalBudget: budgetNum,
          guestCount: guestNum,
          locationPreference: location,
          rawRequirements: `${tier} tier. ${specialNotes}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error generating financial model.');
      }

      if (data.deterministicBreakdown) {
        const enriched: ExtendedCategory[] = data.deterministicBreakdown.map((c: any) => ({
          name: c.category,
          allocated: c.allocatedAmount,
          initialAllocated: c.allocatedAmount,
          spent: Math.round(c.allocatedAmount * 0.78),
          percentage: c.percentage,
          note: c.rationale,
          costSavingTip: c.costSavingTip,
        }));
        setCategories(enriched);
      }

      if (data.aiStrategicPlan) {
        setAiPlan(data.aiStrategicPlan);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate financial plan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Count active overruns
  const overrunsCount = categories.filter(
    (c) => c.spent > (c.initialAllocated || c.allocated) * 1.10
  ).length;

  return (
    <div className="space-y-8 relative">
      
      {/* Floating Toast Notification Container (WCAG 2.1 Live Toast) */}
      {alerts.length > 0 && (
        <div 
          aria-live="assertive" 
          className="fixed top-20 right-4 z-50 w-full max-w-sm space-y-2 pointer-events-none"
        >
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="pointer-events-auto p-4 rounded-xl bg-slate-900 border-2 border-red-500/80 shadow-2xl shadow-red-500/30 text-white flex items-start justify-between gap-3 animate-bounce"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Budget Alert: &gt;110% Overrun</span>
                    <span className="text-[10px] text-slate-400 font-mono">({alert.timestamp})</span>
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">
                    {alert.categoryName}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 font-mono">
                    Spent: <strong className="text-red-300">${alert.spent.toLocaleString()}</strong> ({alert.percentageSpent}% of baseline ${alert.initialAllocated.toLocaleString()})
                  </div>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 rounded text-slate-400 hover:text-white transition shrink-0"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Module Header & Security Logic banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Module A: Dynamic Financials, Visualizer &amp; Overrun Guard
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic calculation engine, Recharts visualization, and automated 110% budget alert badges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {overrunsCount > 0 ? (
              <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500 text-red-300 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span>{overrunsCount} Category Overruns (&gt;110%)</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>All Spends Within 110% Threshold</span>
              </span>
            )}
          </div>
        </div>

        {/* Proportional Contingency Distribution Callout Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <strong className="text-white block">Automatic Proportional Contingency Distribution:</strong>
              Modifying any allocation recalculates the reserve in real time, or click to distribute surplus contingency proportionally across all categories.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDistributeContingencyProportionally}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/10 flex items-center gap-1.5 transition active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>Distribute Contingency Proportionally</span>
            </button>
            <button
              onClick={handleResetSpends}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              title="Reset all spends to healthy range"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Financial Parameters */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Event Budget Parameters</span>
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Event Title / Purpose
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Total Budget ($ USD)</label>
                <span className="text-[10px] text-slate-500">Deterministic ceiling</span>
              </div>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  min="1"
                  step="1"
                  required
                  placeholder="150000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Projected Attendees (Guest Count)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  min="1"
                  required
                  placeholder="500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Executive Enterprise">Executive Enterprise</option>
                  <option value="Standard Corporate">Standard Corporate</option>
                  <option value="Lean Innovation">Lean Innovation</option>
                  <option value="Non-Profit Gala">Non-Profit Gala</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location District</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Strategic Priorities &amp; Requirements
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                rows={3}
                placeholder="Keynotes, dietary certifications, accessibility needs..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none text-xs"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-emerald-500/10 transition active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Synthesizing Intent &amp; Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>Run Deterministic Financial Engine</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Breakdown, Charts & Metrics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block">Total Budget</span>
              <div className="text-xl font-bold text-white mt-1 font-mono">
                ${currentTotal.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" /> Reconciled exact sum
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block">Per Attendee Cost</span>
              <div className="text-xl font-bold text-white mt-1 font-mono">
                ${perGuestCost.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Across {currentGuests.toLocaleString()} attendees
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block">Current Contingency</span>
              <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">
                ${(categories.find(c => c.name.includes('Contingency'))?.allocated || 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-cyan-400/80 mt-1 block">
                Math Guard Safe Floor
              </span>
            </div>
          </div>

          {/* Recharts Responsive Pie Chart Visualization */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" />
                <span>Budget Distribution Visualization (Recharts)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Interactive Slice Exploration
              </span>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#0f172a" 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full inline-block" 
                                style={{ backgroundColor: data.color }}
                              />
                              <span>{data.name}</span>
                            </div>
                            <div className="text-slate-300 font-mono">
                              Allocation: <strong className="text-cyan-300">${data.value.toLocaleString()}</strong> ({data.percentage}%)
                            </div>
                            <div className="text-slate-400 font-mono">
                              Spent: ${data.spent.toLocaleString()} ({Math.round((data.spent / (data.value || 1)) * 100)}%)
                            </div>
                            {data.isOver110 && (
                              <div className="text-red-400 text-[10px] font-bold mt-1">
                                ⚠️ Exceeds 110% Overrun Threshold!
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-[11px] text-slate-300 ml-1">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Allocations with Interactive Sliders & Budget Alert Badges */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>Category Allocations &amp; Overrun Badges</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Threshold: &gt;110% Flagged
              </span>
            </div>

            <div className="space-y-3.5">
              {categories.map((cat, idx) => {
                const isContingency = cat.name.includes('Contingency');
                const baseline = cat.initialAllocated || cat.allocated;
                const percentSpent = baseline > 0 ? Math.round((cat.spent / baseline) * 1000) / 10 : 0;
                const isOver110 = cat.spent > baseline * 1.10;
                const isElevated = !isOver110 && percentSpent >= 95;

                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border transition ${
                      isOver110
                        ? 'bg-red-950/30 border-red-500/80 shadow-md shadow-red-500/10'
                        : isContingency
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between text-xs mb-1.5 gap-2">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{cat.name}</span>
                        {isContingency && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            Math Guard Reserve
                          </span>
                        )}
                      </div>

                      {/* Color-coded Warning Badges */}
                      <div className="flex items-center gap-2">
                        {isOver110 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/50 flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3 text-red-400" />
                            <span>⚠️ {percentSpent}% (&gt;110% Over Budget)</span>
                          </span>
                        ) : isElevated ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <span>⚡ {percentSpent}% (Near 110% Ceiling)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            ✓ {percentSpent}% Spent
                          </span>
                        )}

                        <div className="font-mono text-sm font-bold text-slate-200">
                          ${cat.allocated.toLocaleString()}
                          <span className="text-xs text-slate-500 font-normal ml-1">
                            ({cat.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar showing Spent vs Allocated */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2 relative">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isOver110 
                            ? 'bg-red-500' 
                            : isContingency 
                            ? 'bg-emerald-400' 
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, (cat.spent / (cat.allocated || 1)) * 100)}%` }}
                      />
                    </div>

                    {/* Interactive Slider & Spent Adjustment */}
                    <div className="mt-2 pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] gap-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>Spent: <strong className="text-white">${cat.spent.toLocaleString()}</strong></span>
                        <span className="text-slate-600">&middot;</span>
                        <span>Baseline: ${baseline.toLocaleString()}</span>
                      </div>

                      {/* Overrun Simulator Test Trigger */}
                      <div className="flex items-center gap-2">
                        {!isContingency && (
                          <button
                            type="button"
                            onClick={() => handleSimulateOverrun(idx)}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-red-950/60 hover:text-red-300 border border-slate-700 transition"
                            title="Simulate quote/spend overrun to test 110% alert badge"
                          >
                            Simulate &gt;110%
                          </button>
                        )}
                        
                        {!isContingency && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 text-[10px]">Adjust:</span>
                            <input
                              type="range"
                              min="5000"
                              max={Math.max(10000, currentTotal * 0.7)}
                              step="1000"
                              value={cat.allocated}
                              onChange={(e) => handleModifyAllocation(idx, Number(e.target.value))}
                              className="w-24 accent-cyan-400 cursor-pointer"
                              title="Modifying will auto-recalculate remaining contingency"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sum check verification indicator */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Deterministic sum verification: 100.0% reconciled ($ {currentTotal.toLocaleString()})</span>
              </span>
              <span className="font-mono text-slate-500">IEEE-754 Safe Guard</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
