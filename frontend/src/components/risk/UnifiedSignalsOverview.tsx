import React from 'react';
import { Card } from '../common/Card';
import { DollarSign, UserCheck, Clock, Tag, Activity, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { UnifiedRiskSignal } from '../../types/risk';

export interface UnifiedSignalsOverviewProps {
  signals: UnifiedRiskSignal[];
}

export const UnifiedSignalsOverview: React.FC<UnifiedSignalsOverviewProps> = ({ signals }) => {
  const getSignalIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('amount')) return <DollarSign className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
    if (lower.includes('recipient')) return <UserCheck className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
    if (lower.includes('time')) return <Clock className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
    if (lower.includes('frequency')) return <Activity className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
    return <Tag className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
  };

  const getStatusMeta = (status: UnifiedRiskSignal['status']) => {
    switch (status) {
      case 'HIGH':
        return {
          badge: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
          dot: 'bg-rose-500 dark:bg-rose-400',
          bar: 'bg-rose-500',
        };
      case 'MEDIUM':
        return {
          badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
          dot: 'bg-amber-500 dark:bg-amber-400',
          bar: 'bg-amber-500',
        };
      case 'LOW':
        return {
          badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
          dot: 'bg-emerald-500 dark:bg-emerald-400',
          bar: 'bg-emerald-500',
        };
    }
  };

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Risk Signal Overview</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">5 Telemetry Vectors</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {signals.map((signal) => {
          const meta = getStatusMeta(signal.status);
          const percent = signal.contributionPercent || (signal.status === 'HIGH' ? 80 : signal.status === 'MEDIUM' ? 60 : 20);

          return (
            <div
              key={signal.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                    {getSignalIcon(signal.name)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{signal.name}</span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${meta.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {signal.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white tracking-tight leading-snug">
                  {signal.value}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{signal.description}</p>
              </div>

              {/* Severity Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
