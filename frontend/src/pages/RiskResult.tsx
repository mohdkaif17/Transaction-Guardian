import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  DollarSign,
  User,
  Tag,
  Hash,
  Calendar,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RiskBadge } from '../components/risk/RiskBadge';
import { RiskScore } from '../components/risk/RiskScore';
import { LoadingState } from '../components/common/LoadingState';
import { AnalysisSourceBadge } from '../components/risk/AnalysisSourceBadge';
import { UnifiedSignalsOverview } from '../components/risk/UnifiedSignalsOverview';
import { UnifiedWhyFlagged } from '../components/risk/UnifiedWhyFlagged';
import { UnifiedBehavioralComparison } from '../components/risk/UnifiedBehavioralComparison';
import { UnifiedContributionBreakdown } from '../components/risk/UnifiedContributionBreakdown';
import { getRiskResult } from '../services/riskEngine';
import { UnifiedRiskResult } from '../types/risk';
import { formatCurrency } from '../utils/formatters';
import { getRiskColors } from '../utils/riskCalculators';

export const RiskResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<UnifiedRiskResult | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const queryId = id || 'new-demo-001';

    // Simulate realistic model retrieval delay
    const timer = setTimeout(() => {
      const data = getRiskResult(queryId);
      setResult(data);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-16">
        <LoadingState
          message="Generating risk assessment..."
          subtext="Synthesizing behavioral baseline, recipient trust telemetry, and anomaly vectors"
        />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-rose-400 w-12 h-12 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">No risk assessment available</h3>
        <p className="text-xs text-slate-400">
          Unable to generate or find the risk assessment for identifier <span className="font-mono">{id}</span>.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const colors = getRiskColors(result.riskLevel);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>
              Dashboard
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold">Risk Result</span>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-slate-400">{result.transactionId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Transaction Risk Assessment
            </h1>
            <AnalysisSourceBadge source={result.source} />
            <Badge variant="safe" size="md" dot>
              Transaction Safety Engine
            </Badge>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Review the detected risk signals and understand why this transaction received its risk score.
          </p>
        </div>

        {/* Quick Test Demo State Switcher for Presentation */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => navigate(-1)}
            className="text-xs"
          >
            Back
          </Button>
        </div>
      </div>

      {/* 2. MAIN RISK RESULT CARD */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl transition-all ${colors.bg} ${colors.border} ${colors.glow}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Score Gauge */}
          <div className="flex items-center gap-6 shrink-0">
            <RiskScore score={result.riskScore} level={result.riskLevel} size="lg" />
            <div className="space-y-1.5 text-center md:text-left">
              <RiskBadge level={result.riskLevel} size="lg" />
              <p className="text-xs text-slate-300 font-mono font-bold">
                {formatCurrency(result.amount)} → {result.recipientUpi}
              </p>
            </div>
          </div>

          {/* Right: Status Message & Range Thresholds */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Risk Evaluation Summary</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {result.statusMessage}
            </h3>

            {/* Threshold Ranges Note */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 0–39 SAFE
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 40–69 REVIEW
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> 70–100 HIGH RISK
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRANSACTION DETAILS + RECOMMENDED ACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Details (2 Cols) */}
        <Card className="lg:col-span-2 p-6 space-y-4 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white tracking-tight">Transaction Details</h3>
            <span className="text-xs text-slate-400 font-mono">Reference Metadata</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs divide-y sm:divide-y-0 divide-slate-800/60">
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Recipient
              </span>
              <span className="font-bold text-slate-100 text-sm">{result.recipientName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-cyan-400" /> UPI ID
              </span>
              <span className="font-mono text-cyan-400 font-semibold">{result.recipientUpi}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Amount
              </span>
              <span className="font-mono font-extrabold text-base text-white">
                {formatCurrency(result.amount)}
              </span>
            </div>

            <div className="space-y-1 pt-3 sm:pt-0">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> Category
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium inline-block text-[11px]">
                {result.category}
              </span>
            </div>

            <div className="space-y-1 pt-3 sm:pt-0">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date & Time
              </span>
              <span className="font-mono text-slate-200">
                {result.dateFormatted} • {result.timeFormatted}
              </span>
            </div>

            <div className="space-y-1 pt-3 sm:pt-0">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Transaction ID
              </span>
              <span className="font-mono text-slate-300 font-bold">{result.transactionId}</span>
            </div>
          </div>
        </Card>

        {/* Recommended Action Card (1 Col) */}
        <Card className={`p-6 flex flex-col justify-between space-y-4 border ${colors.border} bg-slate-900/90`}>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Recommended Action
            </h4>
            <h3 className="text-base font-bold text-white leading-snug">
              {result.recommendation.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.recommendation.supportingText}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>Safety protocol: Proceed with verified payee authorization.</span>
          </div>
        </Card>
      </div>

      {/* 4. RISK SIGNAL OVERVIEW (5 Signals) */}
      <UnifiedSignalsOverview signals={result.signals} />

      {/* 5. WHY WAS THIS FLAGGED + BEHAVIORAL COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UnifiedWhyFlagged reasons={result.flaggedReasons} />
        <UnifiedBehavioralComparison rows={result.comparisonRows} />
      </div>

      {/* 6. RISK CONTRIBUTION & ASSESSMENT CONFIDENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UnifiedContributionBreakdown confidence={result.confidence} />
        </div>

        {/* 7. IMPORTANT DISCLAIMER */}
        <Card className="p-6 border-slate-800 bg-slate-950/70 space-y-2.5 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Important Product Notice</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A risk score indicates how unusual a transaction appears based on available transaction and behavioral signals. It does not prove that a transaction or recipient is fraudulent or genuine.
          </p>
        </Card>
      </div>

      {/* 8. RESULT ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/new-transaction')}
            className="font-semibold shadow-glow-shield w-full sm:w-auto"
          >
            Check Another Transaction
          </Button>

          <Button
            size="md"
            variant="outline"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-cyan-400" />}
            onClick={() => navigate('/history')}
            className="w-full sm:w-auto text-xs"
          >
            View Transaction History
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
    </div>
  );
};
