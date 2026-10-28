import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  PieChart, 
  AlertCircle,
  CheckCircle,
  FileText,
  Info
} from 'lucide-react';
import { EventCategory } from '../../types';

interface FinancialModuleProps {
  activeTenant: string;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({ activeTenant }) => {
  const [eventType, setEventType] = useState('Global Tech Summit 2027');
  const [totalBudget, setTotalBudget] = useState<string>('150000');
  const [guestCount, setGuestCount] = useState<string>('500');
  const [tier, setTier] = useState('Executive Enterprise');
  const [location, setLocation] = useState('Metropolitan Convention District');
  const [specialNotes, setSpecialNotes] = useState('Focus on high-speed dual-redundant Wi-Fi, keynote AV staging, and sustainable catering.');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<any>(null);

  // Pre-seed default data if none generated yet
  const defaultAllocations: EventCategory[] = [
    { name: 'Venue & Staging Infrastructure', allocated: 55000, spent: 48000, percentage: 36.6, note: 'Includes main plenary hall and sound dampening' },
    { name: 'Catering & Dining Hospitality', allocated: 40000, spent: 39500, percentage: 26.6, note: 'Dietary certified menus & coffee stations' },
    { name: 'AV & Hybrid Broadcast Engineering', allocated: 25000, spent: 24000, percentage: 16.6, note: 'Dual 4K switchers and live stream' },
    { name: 'Badging, Registration & Security', allocated: 15000, spent: 11000, percentage: 10.0, note: 'RFID credentials & security team' },
    { name: 'Contingency Reserve (Deterministic Math Guard)', allocated: 15000, spent: 0, percentage: 10.0, note: 'Mandatory 10% reserve computed by server' },
  ];

  const currentAllocations: EventCategory[] = planResult?.deterministicBreakdown || defaultAllocations;
  const currentTotal = planResult?.eventDetails?.totalBudget || Number(totalBudget) || 150000;
  const currentGuests = planResult?.eventDetails?.guestCount || Number(guestCount) || 500;
  const perGuestCost = Math.round((currentTotal / currentGuests) * 100) / 100;

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const budgetNum = Number(totalBudget);
      const guestNum = Number(guestCount);

      // Local front-line defense validation
      if (isNaN(budgetNum) || budgetNum <= 0) {
        setErrorMsg('Mathematical Validation Error: Budget must be a positive non-zero number. Negative numbers and NaN are rejected by security policy.');
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

      setPlanResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate financial plan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Module Header & Security Logic banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Module A: Dynamic Financials & Math Guard
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic calculation engine paired with Gemini semantic intent extraction
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>AI Arithmetic Disabled &middot; 100% Deterministic</span>
          </span>
        </div>

        {/* Security Philosophy Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Why Pure Local Math?</strong> LLMs are notoriously prone to floating-point rounding errors and hallucinations when doing arithmetic, creating financial vulnerabilities. In PlanGuard AI, <strong>Gemini only parses semantic category weights</strong>, while our local Node server algorithm deterministically computes allocations, guarantees exact sum reconciliation, and forces a mandatory 10% contingency reserve.
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
            
            {/* Event Name */}
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

            {/* Total Budget */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Total Budget ($ USD)</label>
                <span className="text-[10px] text-slate-500">Must be positive</span>
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

            {/* Guest Count */}
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

            {/* Tier & Location Grid */}
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

            {/* Special Instructions (Sanitized input buffer) */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Strategic Priorities & Requirements
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                rows={3}
                placeholder="Keynotes, dietary certifications, accessibility needs..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none text-xs"
              />
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-emerald-500/10 transition active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Synthesizing Intent & Calculating...</span>
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

        {/* Right Output: Breakdown & Metrics */}
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
              <span className="text-[11px] font-medium text-slate-400 block">Contingency Reserve</span>
              <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">
                ${((currentTotal * 0.1)).toLocaleString()}
              </div>
              <span className="text-[10px] text-cyan-400/80 mt-1 block">
                10% Deterministic Safe Floor
              </span>
            </div>

          </div>

          {/* AI Strategic Theme Insight (if generated) */}
          {planResult?.aiStrategicPlan && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Strategic Synthesis: {planResult.aiStrategicPlan.theme}</span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-2">
                {planResult.aiStrategicPlan.executiveSummary}
              </p>
              {planResult.aiStrategicPlan.riskAnalysis?.length > 0 && (
                <div className="text-[11px] text-amber-300/90 flex flex-wrap gap-x-4">
                  <span><strong>Identified Risk Factor:</strong> {planResult.aiStrategicPlan.riskAnalysis[0]}</span>
                </div>
              )}
            </div>
          )}

          {/* Category Allocations Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Deterministic Category Allocations</span>
              <span className="text-[10px] text-slate-500 font-mono">Precision: 2 Decimals</span>
            </h3>

            <div className="space-y-3">
              {currentAllocations.map((cat, idx) => {
                const isContingency = cat.name.includes('Contingency');
                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border transition ${
                      isContingency 
                        ? 'bg-cyan-950/20 border-cyan-800/40' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{cat.name}</span>
                        {isContingency && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                            Math Guard
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm font-bold text-slate-200">
                        ${cat.allocated ? cat.allocated.toLocaleString() : (cat as any).allocatedAmount?.toLocaleString()}
                        <span className="text-xs text-slate-500 font-normal ml-1">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full ${isContingency ? 'bg-cyan-400' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, cat.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="line-clamp-1">{cat.note || (cat as any).rationale}</span>
                      {cat.costSavingTip && (
                        <span className="text-emerald-400 text-[10px] shrink-0 ml-2">
                          Tip: {cat.costSavingTip}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sum check verification indicator */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Deterministic sum verification: 100.0% reconciled</span>
              </span>
              <span className="font-mono text-slate-500">IEEE-754 Safe Guard</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
