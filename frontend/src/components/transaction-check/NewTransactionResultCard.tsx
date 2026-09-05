import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Lock,
  DollarSign,
  User,
  Clock,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../risk/RiskBadge';
import { RiskScore } from '../risk/RiskScore';
import { RiskSignalCard } from '../payment/RiskSignalCard';
import { BehaviorComparison } from './BehaviorComparison';
import { RiskExplanation } from './RiskExplanation';
import { NewTransactionRiskResult } from '../../services/mockRiskService';
import { getRiskColors } from '../../utils/riskCalculators';

export interface NewTransactionResultCardProps {
  result: NewTransactionRiskResult;
  onReset: () => void;
}

export const NewTransactionResultCard: React.FC<NewTransactionResultCardProps> = ({
  result,
  onReset,
}) => {
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const colors = getRiskColors(result.riskLevel);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP RESULT & SCORE BANNER */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl transition-all ${colors.bg} ${colors.border} ${colors.glow}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Score Gauge */}
          <div className="flex items-center gap-6 shrink-0">
            <RiskScore score={result.riskScore} level={result.riskLevel} size="lg" />
            <div className="space-y-1.5 text-center md:text-left">
              <RiskBadge level={result.riskLevel} size="lg" />
              <p className="text-xs text-slate-300 font-mono font-bold">
                {result.transactionHeader}
              </p>
            </div>
          </div>

          {/* Right: Recommendation & Reasons */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommendation</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">
              {result.recommendation}
            </h3>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-300 block">
                Contributing Risk Factors:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RISK SIGNAL BREAKDOWN (4 Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Risk Signal Breakdown
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Core Indicators</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {result.signals.map((signal) => (
            <RiskSignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>

      {/* 3. BEHAVIORAL COMPARISON & EXPLAINABLE RISK SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BehaviorComparison comparison={result.comparison} />
        <RiskExplanation signals={result.explainableSignals} />
      </div>

      {/* 4. RESULT ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="primary"
            onClick={() => setShowReviewModal(true)}
            className="w-full sm:w-auto font-semibold"
          >
            Review Transaction
          </Button>

          <Button
            size="md"
            variant="secondary"
            leftIcon={<ExternalLink className="w-4 h-4 text-cyan-400" />}
            onClick={() => navigate(`/result/${result.id}`)}
            className="w-full sm:w-auto text-xs"
          >
            Full Risk Report
          </Button>

          <Button
            size="md"
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            Check Another Transaction
          </Button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => navigate('/')}
          className="text-xs text-slate-400 hover:text-white"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Transaction Risk Advisory"
        description="Behavioral anomaly verification protocol"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Outlier Transfer Intercepted
            </p>
            <p className="text-slate-300 text-[11px]">
              Transfer of <span className="font-mono text-white font-bold">{result.transactionHeader}</span> is 8× above your normal average and is scheduled during off-peak hours.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-200">Recommended Security Steps:</p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Verify if this transaction was initiated directly by you or via a third-party payment prompt.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Confirm recipient bank/UPI credentials over an alternate trusted communication channel.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>If unsure, cancel the transaction and monitor your linked bank accounts.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setShowReviewModal(false)}>
              Close Advisory
            </Button>
            <Button size="sm" variant="primary" onClick={onReset}>
              Analyze Another Txn
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
