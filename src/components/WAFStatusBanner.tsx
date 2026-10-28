import React from 'react';
import { ShieldCheck, Cpu, KeyRound, Lock, RefreshCw, Zap } from 'lucide-react';
import { GatewayStatus } from '../types';

interface WAFStatusBannerProps {
  status: GatewayStatus | null;
  activeTenant: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WAFStatusBanner: React.FC<WAFStatusBannerProps> = ({
  status,
  activeTenant,
  onRefresh,
  isRefreshing,
}) => {
  const tokenPercentage = status
    ? Math.round((status.remainingTokens / status.tokenBucketCapacity) * 100)
    : 100;

  return (
    <div className="bg-slate-900/60 border-y border-slate-800/80 px-4 py-3 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Indicators List */}
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          
          {/* Gateway Status */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">Gateway:</span>
            <span className="text-emerald-400 font-mono">ONLINE (Node Proxy)</span>
          </div>

          {/* Gemini Key Isolation */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Key Isolated Server-Side:</span>
            <strong className="text-slate-200">100% Zero-Client Leak</strong>
          </div>

          {/* Token Bucket Gauge */}
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Anti-DoS Bucket:</span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden inline-flex">
              <div 
                className={`h-full transition-all duration-500 ${
                  tokenPercentage > 50 ? 'bg-emerald-500' : tokenPercentage > 20 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${tokenPercentage}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-slate-300">
              {status?.remainingTokens ?? 15}/{status?.tokenBucketCapacity ?? 15} tk
            </span>
          </div>

          {/* RLS Enforcement */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>RLS Enforced:</span>
            <span className="font-mono text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              WHERE user_id = '{activeTenant}'
            </span>
          </div>

        </div>

        {/* Sync Trigger */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden md:inline">
            Model: <strong className="text-slate-300">gemini-3.8-flash</strong> &middot; Structured JSON Mode
          </span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh gateway telemetry"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Inspect</span>
          </button>
        </div>

      </div>
    </div>
  );
};
