import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card } from '../common/Card';

export interface AnalyticsKPIProps {
  total: number;
  safe: number;
  review: number;
  highRisk: number;
}

export const AnalyticsKPI: React.FC<AnalyticsKPIProps> = ({
  total,
  safe,
  review,
  highRisk,
}) => {
  const safePercent = total > 0 ? Math.round((safe / total) * 100) : 86;
  const reviewPercent = total > 0 ? Math.round((review / total) * 100) : 10;
  const highPercent = total > 0 ? Math.max(1, 100 - safePercent - reviewPercent) : 4;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Transactions */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Transactions</span>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">{total}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Analyzed transactions</p>
        </div>
      </Card>

      {/* Card 2: Safe Transactions */}
      <Card borderGlow="safe" className="p-5 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Safe Transactions</span>
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">{safe}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">{safePercent}%</span> of transactions
          </p>
        </div>
      </Card>

      {/* Card 3: Review Required */}
      <Card borderGlow="review" className="p-5 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Review Required</span>
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold font-mono text-amber-700 dark:text-amber-400 tracking-tight">{review}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-semibold text-amber-700 dark:text-amber-400 font-mono">{reviewPercent}%</span> of transactions
          </p>
        </div>
      </Card>

      {/* Card 4: High Risk */}
      <Card borderGlow="high" className="p-5 hover:border-rose-400 dark:hover:border-rose-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-700 dark:text-rose-400">High Risk</span>
          <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold font-mono text-rose-700 dark:text-rose-400 tracking-tight">{highRisk}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-semibold text-rose-700 dark:text-rose-400 font-mono">{highPercent}%</span> of transactions
          </p>
        </div>
      </Card>
    </div>
  );
};
