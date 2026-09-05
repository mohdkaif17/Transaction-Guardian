import React from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  DollarSign,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

export interface TransactionSummaryProps {
  totalCount: number;
  safeCount: number;
  reviewCount: number;
  highRiskCount: number;
  totalVolume: number;
  onDownloadReport: () => void;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  totalCount,
  safeCount,
  reviewCount,
  highRiskCount,
  totalVolume,
  onDownloadReport,
}) => {
  const flaggedCount = reviewCount + highRiskCount;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Success Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50/80 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Analysis complete</span>
              <Badge variant="neutral" size="sm" className="text-[10px] font-mono">
                Demo analysis
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              <span className="font-semibold text-slate-900 dark:text-white">{totalCount} transactions</span> were analyzed and{' '}
              <span className="font-semibold text-amber-700 dark:text-amber-400">{flaggedCount} were flagged</span> for further review.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />}
          onClick={onDownloadReport}
          className="shrink-0 text-xs"
        >
          Download Risk Report
        </Button>
      </div>

      {/* 2. Four Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Scanned */}
        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Transactions Analyzed</span>
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{totalCount}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Full statement batch</p>
          </div>
        </Card>

        {/* Card 2: Safe */}
        <Card borderGlow="safe" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Safe Transactions</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">{safeCount}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Verified normal activity</p>
          </div>
        </Card>

        {/* Card 3: Needs Review */}
        <Card borderGlow="review" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Needs Review</span>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-400">{reviewCount}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Moderate variance</p>
          </div>
        </Card>

        {/* Card 4: High Risk */}
        <Card borderGlow="high" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700 dark:text-rose-400">High Risk</span>
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold font-mono text-rose-700 dark:text-rose-400">{highRiskCount}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Severe anomaly signals</p>
          </div>
        </Card>

        {/* Card 5: Total Spending */}
        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">Total Spending</span>
            <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{formatCurrency(totalVolume)}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Cumulative statement total</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
