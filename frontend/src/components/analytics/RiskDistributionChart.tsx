import React, { useState } from 'react';
import { Card } from '../common/Card';
import { ShieldCheck, ShieldAlert, AlertTriangle, PieChart } from 'lucide-react';

export interface RiskDistributionChartProps {
  safeCount: number;
  reviewCount: number;
  highRiskCount: number;
  totalCount: number;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  safeCount,
  reviewCount,
  highRiskCount,
  totalCount,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const safePercent = totalCount > 0 ? (safeCount / totalCount) * 100 : 86;
  const reviewPercent = totalCount > 0 ? (reviewCount / totalCount) * 100 : 10;
  const highPercent = totalCount > 0 ? (highRiskCount / totalCount) * 100 : 4;

  const radius = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dashes
  const safeDash = (safePercent / 100) * circumference;
  const reviewDash = (reviewPercent / 100) * circumference;
  const highDash = (highPercent / 100) * circumference;

  const safeOffset = 0;
  const reviewOffset = -safeDash;
  const highOffset = -(safeDash + reviewDash);

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Risk Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Transaction safety breakdown</p>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
          <PieChart className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
        {/* SVG Donut Chart */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-200 dark:text-slate-950"
            />

            {/* SAFE Slice (Emerald) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={hoveredSlice === 'SAFE' ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={`${safeDash} ${circumference}`}
              strokeDashoffset={safeOffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSlice('SAFE')}
              onMouseLeave={() => setHoveredSlice(null)}
            />

            {/* REVIEW Slice (Amber) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={hoveredSlice === 'REVIEW' ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={`${reviewDash} ${circumference}`}
              strokeDashoffset={reviewOffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSlice('REVIEW')}
              onMouseLeave={() => setHoveredSlice(null)}
            />

            {/* HIGH RISK Slice (Rose) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth={hoveredSlice === 'HIGH' ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={`${highDash} ${circumference}`}
              strokeDashoffset={highOffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSlice('HIGH')}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          </svg>

          {/* Center Text Summary */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white leading-none">
              {totalCount}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mt-1">Total Txns</span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-2.5 w-full max-w-[220px] text-xs font-mono">
          {/* Safe */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
              hoveredSlice === 'SAFE'
                ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            onMouseEnter={() => setHoveredSlice('SAFE')}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">Safe</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{safeCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">({safePercent.toFixed(0)}%)</span>
            </div>
          </div>

          {/* Review */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
              hoveredSlice === 'REVIEW'
                ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            onMouseEnter={() => setHoveredSlice('REVIEW')}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/40" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">Review</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-amber-700 dark:text-amber-400">{reviewCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">({reviewPercent.toFixed(0)}%)</span>
            </div>
          </div>

          {/* High Risk */}
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
              hoveredSlice === 'HIGH'
                ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
            onMouseEnter={() => setHoveredSlice('HIGH')}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/40" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">High Risk</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-rose-700 dark:text-rose-400">{highRiskCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">({highPercent.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
