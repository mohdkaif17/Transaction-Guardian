import React from 'react';
import { Card } from '../common/Card';
import { UnifiedFlaggedReason } from '../../types/risk';
import { Activity } from 'lucide-react';

export interface UnifiedWhyFlaggedProps {
  reasons: UnifiedFlaggedReason[];
}

export const UnifiedWhyFlagged: React.FC<UnifiedWhyFlaggedProps> = ({ reasons }) => {
  const getSeverityBadge = (severity: UnifiedFlaggedReason['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'LOW':
        return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
    }
  };

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Why was this transaction flagged?
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Ranked Heuristic Breakdown</span>
      </div>

      <div className="space-y-3">
        {reasons.map((reason, index) => (
          <div
            key={reason.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all flex items-start gap-3.5"
          >
            {/* Number Pill */}
            <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-cyan-700 dark:text-cyan-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
              {index + 1}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{reason.title}</h4>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge(
                    reason.severity
                  )}`}
                >
                  {reason.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
