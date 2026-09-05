import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, Shield, Info } from 'lucide-react';

export interface UnifiedContributionBreakdownProps {
  confidence: {
    level: 'High' | 'Medium' | 'Low';
    description: string;
    scorePercent?: number;
  };
}

export const UnifiedContributionBreakdown: React.FC<UnifiedContributionBreakdownProps> = ({
  confidence,
}) => {
  const contributions = [
    { label: 'Amount behavior', status: 'HIGH', percent: 80, barClass: 'bg-rose-500' },
    { label: 'Recipient familiarity', status: 'HIGH', percent: 90, barClass: 'bg-rose-500' },
    { label: 'Time behavior', status: 'MEDIUM', percent: 60, barClass: 'bg-amber-500' },
    { label: 'Category behavior', status: 'LOW', percent: 20, barClass: 'bg-emerald-500' },
    { label: 'Transaction frequency', status: 'MEDIUM', percent: 60, barClass: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Risk Contribution Card */}
      <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-mono">
            Risk Contribution
          </h4>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Relative Signals</span>
        </div>

        <div className="space-y-3 text-xs">
          {contributions.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 dark:text-slate-300 font-medium">{c.label}</span>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    c.status === 'HIGH'
                      ? 'text-rose-700 dark:text-rose-400'
                      : c.status === 'MEDIUM'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${c.barClass}`}
                  style={{ width: `${c.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Assessment Confidence Card */}
      <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-mono">
            Assessment Confidence
          </h4>
          <span className="text-xs font-bold font-mono text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/20">
            {confidence.level}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
          {confidence.description}
        </p>
      </Card>
    </div>
  );
};
