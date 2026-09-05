import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UnifiedBehavioralRow } from '../../types/risk';

export interface UnifiedBehavioralComparisonProps {
  rows: UnifiedBehavioralRow[];
}

export const UnifiedBehavioralComparison: React.FC<UnifiedBehavioralComparisonProps> = ({ rows }) => {
  const getDiffBadge = (status: UnifiedBehavioralRow['status']) => {
    switch (status) {
      case 'HIGH':
        return 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      case 'MEDIUM':
        return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'LOW':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Compared With Your Normal Behavior
          </h3>
          <Badge variant="neutral" size="sm" className="text-[10px] font-mono">
            Demo behavioral profile
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Signal</th>
              <th className="py-3 px-4 font-semibold">Current Transaction</th>
              <th className="py-3 px-4 font-semibold">Normal Behavior</th>
              <th className="py-3 px-4 font-semibold text-right">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-200">{row.signal}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{row.currentValue}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{row.normalBehavior}</td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${getDiffBadge(
                      row.status
                    )}`}
                  >
                    {row.difference}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
