import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RiskBadge } from '../risk/RiskBadge';
import { RiskScore } from '../risk/RiskScore';
import { HistoryTransaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';
import { getRiskColors } from '../../utils/riskCalculators';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  DollarSign,
  User,
  Tag,
  Activity,
  Layers,
  ExternalLink,
} from 'lucide-react';

export interface TransactionDetailModalProps {
  transaction: HistoryTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!transaction) return null;

  const colors = getRiskColors(transaction.riskLevel);

  // Default flags if not explicitly provided
  const flaggedReasons =
    transaction.flaggedReasons && transaction.flaggedReasons.length > 0
      ? transaction.flaggedReasons
      : transaction.riskLevel === 'SAFE'
      ? ['Transaction matches established behavioral baseline and frequent merchant pattern.']
      : [
          'Moderate variance detected in spending pattern.',
          'Review recommended to confirm payee identity.',
        ];

  const signals = transaction.signals || {
    amountDeviation: transaction.riskLevel === 'HIGH_RISK' ? 'HIGH' : transaction.riskLevel === 'REVIEW' ? 'MEDIUM' : 'LOW',
    recipientNovelty: transaction.riskLevel === 'HIGH_RISK' ? 'HIGH' : transaction.riskLevel === 'REVIEW' ? 'HIGH' : 'LOW',
    timeDeviation: transaction.riskLevel === 'HIGH_RISK' ? 'MEDIUM' : 'LOW',
    frequencyAnomaly: transaction.riskLevel === 'HIGH_RISK' ? 'HIGH' : 'LOW',
    categoryDeviation: 'LOW',
  };

  const getSignalBadge = (status: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (status) {
      case 'HIGH':
        return 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'LOW':
        return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Transaction Risk Details • ${transaction.id}`}
      description="Post-transaction anomaly inspection and signal breakdown"
      maxWidth="lg"
    >
      <div className="space-y-6 text-xs">
        {/* Top Summary Banner */}
        <div
          className={`p-5 rounded-xl border backdrop-blur-md transition-all ${colors.bg} ${colors.border} flex flex-col sm:flex-row items-center justify-between gap-5`}
        >
          <div className="flex items-center gap-4">
            <RiskScore score={transaction.riskScore} level={transaction.riskLevel} size="md" />
            <div>
              <RiskBadge level={transaction.riskLevel} size="md" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {formatCurrency(transaction.amount)} → {transaction.recipient}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {transaction.category} • {transaction.date}
              </p>
            </div>
          </div>
        </div>

        {/* Section: Why was this flagged? */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
            Why was this flagged?
          </h4>

          <div className="space-y-2">
            {transaction.id === 'TX004' ? (
              // Exact 4 detailed points for TX004 from project spec
              <>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 shadow-sm shadow-rose-500/50" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block">Amount deviation</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      ₹25,000 is significantly higher than the user's normal transaction range (avg ₹1,250).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 shadow-sm shadow-rose-500/50" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block">New recipient</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      The recipient has not appeared in previous transaction history.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1 shadow-sm shadow-amber-500/50" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block">Unusual transaction time</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      The transaction occurred outside the user's typical activity period (11:45 PM).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 shadow-sm shadow-rose-500/50" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block">Transaction velocity</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Multiple transactions occurred within a short period.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              flaggedReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                      transaction.riskLevel === 'HIGH_RISK'
                        ? 'bg-rose-500'
                        : transaction.riskLevel === 'REVIEW'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{reason}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section: Risk Signals (5 signals) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
            Risk Signals
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Amount Deviation</span>
              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getSignalBadge(signals.amountDeviation)}`}>
                {signals.amountDeviation}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Recipient Novelty</span>
              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getSignalBadge(signals.recipientNovelty)}`}>
                {signals.recipientNovelty}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Time Deviation</span>
              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getSignalBadge(signals.timeDeviation)}`}>
                {signals.timeDeviation}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Transaction Frequency</span>
              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getSignalBadge(signals.frequencyAnomaly)}`}>
                {signals.frequencyAnomaly}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1 sm:col-span-2">
              <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Category Deviation</span>
              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getSignalBadge(signals.categoryDeviation)}`}>
                {signals.categoryDeviation}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">Recommendation: </span>
            <span>
              {transaction.recommendation || 'Verify the transaction and recipient details.'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ExternalLink className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />}
            onClick={() => {
              onClose();
              window.location.href = `#/result/${transaction.id}`;
            }}
            className="text-xs"
          >
            Full Assessment Report
          </Button>

          <Button size="sm" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
