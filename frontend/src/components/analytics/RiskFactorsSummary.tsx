import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { RiskFactorStat } from '../../types/analytics';
import { ShieldAlert } from 'lucide-react';

export interface RiskFactorsSummaryProps {
  factors: RiskFactorStat[];
}

export const RiskFactorsSummary: React.FC<RiskFactorsSummaryProps> = ({ factors }) => {
  const getFactorColor = (status: RiskFactorStat['status']) => {
    switch (status) {
      case 'HIGH':
        return {
          text: 'text-rose-700 dark:text-rose-400',
          bar: 'bg-rose-500',
          badge: 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
        };
      case 'MEDIUM':
        return {
          text: 'text-amber-700 dark:text-amber-400',
          bar: 'bg-amber-500',
          badge: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
        };
      case 'LOW':
        return {
          text: 'text-emerald-700 dark:text-emerald-400',
          bar: 'bg-emerald-500',
          badge: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        };
    }
  };

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Common Risk Factors</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Most prevalent anomaly triggers across flagged payments</p>
        </div>
        <Badge variant="neutral" size="sm" className="text-[10px] font-mono">
          Illustrative demo insights
        </Badge>
      </div>

      <div className="space-y-4 pt-1">
        {factors.map((factor) => {
          const meta = getFactorColor(factor.status);

          return (
            <div key={factor.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{factor.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${meta.badge}`}>
                    {factor.status}
                  </span>
                </div>
                <span className={`font-mono font-bold ${meta.text}`}>{factor.percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                  style={{ width: `${factor.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{factor.description}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
