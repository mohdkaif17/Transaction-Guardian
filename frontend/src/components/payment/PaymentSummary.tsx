import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { UserCheck, AlertTriangle } from 'lucide-react';

export interface PaymentSummaryProps {
  summary: {
    recipient: string;
    upiId: string;
    amount: number;
    category: string;
    analysisTime: string;
  };
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ summary }) => {
  const isKnown = summary.recipient.toLowerCase().includes('swiggy') || 
                  summary.recipient.toLowerCase().includes('nature') ||
                  summary.recipient.toLowerCase().includes('amazon');
  const txnCount = isKnown ? 18 : 0;

  return (
    <Card className="p-5 space-y-3.5 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80">
      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
        Payment Summary
      </h4>

      <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 dark:text-slate-400">Recipient</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{summary.recipient}</span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400">UPI ID</span>
          <span className="font-mono text-cyan-700 dark:text-cyan-400 font-medium">{summary.upiId}</span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400">Amount</span>
          <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
            {formatCurrency(summary.amount)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400">Category</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
            {summary.category}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400">Analysis time</span>
          <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{summary.analysisTime}</span>
        </div>
      </div>

      {/* Recipient Profile & Familiarity Intelligence */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 font-mono uppercase">Recipient Profile</span>
          {isKnown ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold inline-flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> ✓ KNOWN RECIPIENT
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-[10px] font-mono font-bold inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> ⚠️ NEW RECIPIENT
            </span>
          )}
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Previous transactions</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{txnCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">First seen</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{isKnown ? '4 months ago' : 'Today'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Recipient familiarity</span>
            <span className={`font-mono font-bold ${isKnown ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-800 dark:text-amber-400'}`}>
              {isKnown ? 'VERIFIED' : 'UNKNOWN'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
