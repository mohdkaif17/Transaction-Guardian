import React from 'react';
import { ShieldCheck, AlertCircle, AlertOctagon, HelpCircle } from 'lucide-react';
import { RiskFactor } from '../../types/risk';
import { getFactorCategoryBadge } from '../../utils/riskCalculators';
import { cn } from '../../utils/cn';

export interface RiskFactorsListProps {
  factors: RiskFactor[];
  className?: string;
}

export const RiskFactorsList: React.FC<RiskFactorsListProps> = ({ factors, className }) => {
  if (!factors || factors.length === 0) {
    return (
      <div className="text-xs text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
        No active risk flags detected for this transaction.
      </div>
    );
  }

  const getSeverityIcon = (severity: RiskFactor['severity']) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertOctagon className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" />;
      case 'MEDIUM':
        return <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />;
      case 'LOW':
        return <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />;
    }
  };

  const getSeverityBadge = (severity: RiskFactor['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/40';
      case 'HIGH':
        return 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'LOW':
        return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className={cn('space-y-2.5', className)}>
      {factors.map((factor) => {
        const categoryBadge = getFactorCategoryBadge(factor.category);

        return (
          <div
            key={factor.id}
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-150 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{getSeverityIcon(factor.severity)}</div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{factor.name}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{factor.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border',
                    getSeverityBadge(factor.severity)
                  )}
                >
                  {factor.severity}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold',
                    factor.scoreImpact > 0
                      ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                      : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                  )}
                >
                  {factor.scoreImpact > 0 ? `+${factor.scoreImpact}` : factor.scoreImpact} pts
                </span>
              </div>
            </div>

            {(factor.detectedValue || factor.expectedBaseline) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
                <span className={cn('px-2 py-0.5 rounded border text-[10px]', categoryBadge.color)}>
                  {categoryBadge.label}
                </span>

                {factor.detectedValue && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Detected: </span>
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">{factor.detectedValue}</span>
                  </div>
                )}

                {factor.expectedBaseline && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Baseline: </span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">{factor.expectedBaseline}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
