import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../risk/RiskBadge';
import { RiskScore } from '../risk/RiskScore';
import { RiskSignalCard } from './RiskSignalCard';
import { PaymentSummary } from './PaymentSummary';
import { PrePaymentRiskResult } from '../../services/mockRiskService';
import { getRiskColors } from '../../utils/riskCalculators';

export interface RiskAnalysisCardProps {
  result: PrePaymentRiskResult;
  onReset: () => void;
}

export const RiskAnalysisCard: React.FC<RiskAnalysisCardProps> = ({
  result,
  onReset,
}) => {
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const colors = getRiskColors(result.riskLevel);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP RESULT & SCORE BANNER */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl transition-all ${colors.bg} ${colors.border} ${colors.glow}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Big Score Meter */}
          <div className="flex items-center gap-6 shrink-0">
            <RiskScore score={result.riskScore} level={result.riskLevel} size="lg" />
            <div className="space-y-1.5 text-center md:text-left">
              <RiskBadge level={result.riskLevel} size="lg" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Pre-Payment Safety Evaluation
              </p>
            </div>
          </div>

          {/* Right: Recommendation & Key Highlights */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-300 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Recommended Action</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {result.recommendation}
            </h3>

            {/* Reasons Bullets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block">
                Contributing Risk Factors:
              </span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {result.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 shrink-0 mt-1.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID: RISK SIGNAL ANALYSIS & PAYMENT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Risk Signal Analysis */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Why is this payment unusual for you?
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Personal Baseline Anomaly Signals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {result.signals.map((signal) => (
              <RiskSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>

        {/* Right (1 col): Payment Summary */}
        <div className="space-y-4">
          <PaymentSummary summary={result.paymentSummary} />
        </div>
      </div>

      {/* 3. IMPORTANT DISCLAIMER */}
      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-slate-300">Important Safety Principle: </span>
          A known recipient is not automatically safe. A new recipient is not automatically fraud. Transaction Guardian recommends verification rather than making a definitive bank-grade fraud determination.
        </p>
      </div>

      {/* 4. RESULT ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="primary"
            onClick={() => setShowReviewModal(true)}
            className="font-semibold"
          >
            Verify Recipient
          </Button>

          <Button
            size="md"
            variant="secondary"
            leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            onClick={onReset}
            className="text-xs"
          >
            Mark as Legitimate
          </Button>

          <Button
            size="md"
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onReset}
          >
            Check Another Payment
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

      {/* Review Payment Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Payment Security Review"
        description="Pre-transaction safety guidance and checklist"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> High Anomaly Score Detected
            </p>
            <p className="text-slate-300 text-[11px]">
              This payment to <span className="font-mono text-white">{result.paymentSummary.recipient}</span> ({result.paymentSummary.upiId}) deviates significantly from your typical transactions.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-200">Recommended Safety Checklist:</p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Call the recipient via a trusted phone number to verify payment details.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Never enter your UPI PIN to receive refunds, cashbacks, or lottery rewards.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Consider sending a test transaction of ₹1 first before transferring the full amount.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setShowReviewModal(false)}>
              Close Guidance
            </Button>
            <Button size="sm" variant="primary" onClick={onReset}>
              Check Another Payee
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
