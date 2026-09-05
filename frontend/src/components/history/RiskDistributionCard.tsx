import React from 'react';
import { Card } from '../common/Card';

export interface RiskDistributionCardProps {
  safeCount: number;
  reviewCount: number;
  highRiskCount: number;
  totalCount: number;
}

export const RiskDistributionCard: React.FC<RiskDistributionCardProps> = ({
  safeCount,
  reviewCount,
  highRiskCount,
  totalCount,
}) => {
  const safePercent = totalCount > 0 ? Math.round((safeCount / totalCount) * 100) : 86;
  const reviewPercent = totalCount > 0 ? Math.round((reviewCount / totalCount) * 100) : 10;
  const highPercent = totalCount > 0 ? Math.max(1, 100 - safePercent - reviewPercent) : 4;

  return (
    <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Risk Distribution</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Statement Health</span>
      </div>

      {/* Horizontal Stacked Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-800 gap-0.5">
          <div
            style={{ width: `${safePercent}%` }}
            className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
            title={`SAFE: ${safePercent}%`}
          />
          <div
            style={{ width: `${reviewPercent}%` }}
            className="bg-amber-500 h-full transition-all duration-500"
            title={`REVIEW: ${reviewPercent}%`}
          />
          <div
            style={{ width: `${highPercent}%` }}
            className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
            title={`HIGH RISK: ${highPercent}%`}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        {/* SAFE */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-200">SAFE</span>
          </div>
          <div className="text-right font-mono">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{safePercent}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">({safeCount} txns)</span>
          </div>
        </div>

        {/* REVIEW */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-200">REVIEW</span>
          </div>
          <div className="text-right font-mono">
            <span className="font-bold text-amber-700 dark:text-amber-400">{reviewPercent}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">({reviewCount} txns)</span>
          </div>
        </div>

        {/* HIGH RISK */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-200">HIGH RISK</span>
          </div>
          <div className="text-right font-mono">
            <span className="font-bold text-rose-700 dark:text-rose-400">{highPercent}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">({highRiskCount} txns)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
