import React from 'react';
import { UserCheck, DollarSign, Clock, Layers, AlertCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RiskSignal } from '../../services/mockRiskService';
import { cn } from '../../utils/cn';

export interface RiskSignalCardProps {
  signal: RiskSignal;
}

export const RiskSignalCard: React.FC<RiskSignalCardProps> = ({ signal }) => {
  const getStatusBadge = (status: RiskSignal['status']) => {
    switch (status) {
      case 'HIGH':
        return {
          badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
          dotClass: 'bg-rose-500 dark:bg-rose-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
        };
      case 'MEDIUM':
        return {
          badgeClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30',
          dotClass: 'bg-amber-500 dark:bg-amber-400',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        };
      case 'LOW':
        return {
          badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-500 dark:bg-emerald-400',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        };
    }
  };

  const getSignalIcon = (title: string) => {
    if (title.toLowerCase().includes('recipient')) return <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    if (title.toLowerCase().includes('amount')) return <DollarSign className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    if (title.toLowerCase().includes('time')) return <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    return <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
  };

  const statusMeta = getStatusBadge(signal.status);

  return (
    <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
            {getSignalIcon(signal.title)}
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 truncate">{signal.title}</span>
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase',
            statusMeta.badgeClass
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', statusMeta.dotClass)} />
          {signal.status}
        </span>
      </div>

      <div>
        <p className="text-base font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">{signal.value}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{signal.description}</p>
      </div>
    </div>
  );
};
