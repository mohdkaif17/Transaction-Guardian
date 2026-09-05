import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Zap,
  FileSpreadsheet,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  ArrowRight,
  ScanLine,
  LockKeyhole,
  CheckCircle2,
  Cpu,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RiskBadge } from '../components/risk/RiskBadge';
import { RiskLevel } from '../types/risk';
import { getDashboardApi, DashboardSummaryData } from '../services/api';

interface RecentTxn {
  id: string;
  recipient: string;
  amount: string;
  date: string;
  category: string;
  risk: RiskLevel;
}

const datasetTransactions: RecentTxn[] = [
  {
    id: 'REF1001930',
    recipient: 'Amazon India',
    amount: '₹2,500',
    date: 'Sep 02, 2026',
    category: 'Shopping',
    risk: 'SAFE',
  },
  {
    id: 'REF1001928',
    recipient: 'Swiggy Food Order',
    amount: '₹120.50',
    date: 'Sep 01, 2026',
    category: 'Food',
    risk: 'SAFE',
  },
  {
    id: 'REF1001929',
    recipient: 'Uber Trip Delhi',
    amount: '₹15.20',
    date: 'Sep 01, 2026',
    category: 'Transport',
    risk: 'SAFE',
  },
  {
    id: 'REF1001931',
    recipient: 'Zomato Restaurant',
    amount: '₹45',
    date: 'Sep 02, 2026',
    category: 'Food',
    risk: 'SAFE',
  },
  {
    id: 'REF1001932',
    recipient: 'Netflix Subscription',
    amount: '₹89.99',
    date: 'Sep 03, 2026',
    category: 'Entertainment',
    risk: 'SAFE',
  },
  {
    id: 'REF1001933',
    recipient: 'Salary Transfer',
    amount: '₹5,000',
    date: 'Sep 03, 2026',
    category: 'Other',
    risk: 'HIGH_RISK',
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);

  useEffect(() => {
    getDashboardApi()
      .then((data) => setSummary(data))
      .catch((err) => console.error('Failed to load dashboard metrics from backend:', err));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-8">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 md:p-10 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>YOUR PAYMENT FIREWALL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Is this payment safe for you?
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Transaction Guardian learns how you normally pay and warns you when a payment doesn't look like you — before your money leaves your account.
            </p>

            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-cyan-500/30 text-xs text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Core Question: <strong className="text-cyan-600 dark:text-cyan-400 font-semibold">"Does this payment make sense for YOU?"</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                variant="primary"
                leftIcon={<QrCode className="w-4 h-4 text-slate-950" />}
                onClick={() => navigate('/check-payment?mode=qr')}
              >
                📷 SCAN QR
              </Button>

              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                onClick={() => navigate('/check-payment?mode=upi')}
              >
                @ ENTER UPI ID
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftIcon={<ScanLine className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
                onClick={() => navigate('/check-payment')}
              >
                CHECK PAYMENT
              </Button>
            </div>
          </div>

          {/* Hero Telemetry Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shrink-0 w-72 space-y-4">
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping opacity-30" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-glow-shield">
                <LockKeyhole className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Payment Firewall Active</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Personal Baseline: Active</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Protection</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE ACTION CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Core Safety Modes</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">All modes connect to unified Risk Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Check Payment */}
          <Card
            hoverEffect
            className="p-6 flex flex-col justify-between border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 group transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                Check Payment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Checks payee UPI & QR against YOUR verified recipient profile & typical payment range before sending money.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-between group-hover:border-cyan-500/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
                onClick={() => navigate('/check-payment')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Check Payment →
              </Button>
            </div>
          </Card>

          {/* Card 2 — Check New Transaction */}
          <Card
            hoverEffect
            className="p-6 flex flex-col justify-between border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 group transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                Check New Transaction
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Compares this payment against YOUR typical amount, recipients, and timing — flags what doesn't match, with the specific reason why.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-between group-hover:border-cyan-500/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
                onClick={() => navigate('/new-transaction')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Check Transaction →
              </Button>
            </div>
          </Card>

          {/* Card 3 — Scan Transaction History */}
          <Card
            hoverEffect
            className="p-6 flex flex-col justify-between border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 group transition-all"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                Scan Transaction History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Scans batch CSV statements against YOUR historical spending baseline to spot hidden anomalies & outlier payments.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-between group-hover:border-cyan-500/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
                onClick={() => navigate('/history')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Upload Statement →
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. SECURITY OVERVIEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Your Transaction Security</h2>
            <Badge variant="safe" size="sm" className="text-[10px] font-mono">
              {summary ? summary.dataset_period : 'Live Dataset Telemetry'}
            </Badge>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Live risk engine monitoring</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 0: Promoted Baseline Credibility Metric */}
          <Card className="p-5 border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-glow-shield">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Baseline Built From</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                28 Months of Your History
              </p>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 font-medium">Personal profile active</p>
            </div>
          </Card>

          {/* Card 1: Payments Checked */}
          <Card className="p-5 border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Payments Checked</span>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {summary ? summary.total_analyzed : 1248}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Evaluated against fingerprint</p>
            </div>
          </Card>

          {/* Card 2: Safe Payments */}
          <Card borderGlow="safe" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Safe Payments</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                {summary ? summary.safe_count : 1086}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Matched normal behavior</p>
            </div>
          </Card>

          {/* Card 3: Need Verification */}
          <Card borderGlow="review" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Need Verification</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tracking-tight">
                {summary ? summary.review_count : 124}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Moderate baseline deviation</p>
            </div>
          </Card>

          {/* Card 4: Unusual Payments */}
          <Card borderGlow="high" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Unusual Payments</span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400 tracking-tight">
                {summary ? summary.high_risk_count : 38}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Significant anomaly detected</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4 & 5. RECENT TRANSACTIONS + RISK DISTRIBUTION IN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. RECENT TRANSACTIONS TABLE (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Dataset Historical Transactions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500"
            >
              View All Transactions →
            </Button>
          </div>

          <Card className="overflow-hidden border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80">
            {/* Desktop / Tablet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Recipient</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Risk</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {datasetTransactions.map((txn, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/result/${txn.id}`)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:border-cyan-500/50 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 shrink-0 transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate max-w-[140px]">
                            {txn.recipient}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{txn.amount}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{txn.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <RiskBadge level={txn.risk} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/result/${txn.id}`);
                          }}
                          className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                        >
                          Inspect <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* 5. RISK DISTRIBUTION VISUALIZATION (1 Col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Risk Distribution</h2>

          <Card className="p-5 space-y-5 border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                System-wide risk classification ratio across all historical dataset payments.
              </p>
            </div>

            {/* Horizontal Stacked Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-800 gap-0.5">
                <div
                  style={{ width: `${summary ? summary.safe_percentage : 83.3}%` }}
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-500 hover:opacity-90"
                  title={`SAFE — ${summary ? summary.safe_percentage : 83.3}%`}
                />
                <div
                  style={{ width: `${summary ? summary.review_percentage : 0}%` }}
                  className="bg-amber-500 h-full transition-all duration-500 hover:opacity-90"
                  title={`REVIEW — ${summary ? summary.review_percentage : 0}%`}
                />
                <div
                  style={{ width: `${summary ? summary.high_risk_percentage : 16.7}%` }}
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-500 hover:opacity-90"
                  title={`HIGH RISK — ${summary ? summary.high_risk_percentage : 16.7}%`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              {/* Safe */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">SAFE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {summary ? summary.safe_percentage : 83.3}%
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    ({summary ? summary.safe_count : 5})
                  </span>
                </div>
              </div>

              {/* Review */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">REVIEW</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {summary ? summary.review_percentage : 0}%
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    ({summary ? summary.review_count : 0})
                  </span>
                </div>
              </div>

              {/* High Risk */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/5 border border-rose-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 dark:bg-rose-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">HIGH RISK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {summary ? summary.high_risk_percentage : 16.7}%
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    ({summary ? summary.high_risk_count : 1})
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">How It Works</h2>
          <span className="text-xs text-slate-400">Three-step intelligent security pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {/* Step 1 */}
          <Card className="p-6 relative bg-slate-900/80 border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                01
              </div>

              <h3 className="text-base font-bold text-slate-100">1. Provide Transaction Data</h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                QR, UPI ID, new transaction details, or transaction history.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
              <ScanLine className="w-3.5 h-3.5" />
              <span>Multi-Source Ingestion</span>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 relative bg-slate-900/80 border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                02
              </div>

              <h3 className="text-base font-bold text-slate-100">2. Analyze Risk Signals</h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                The system evaluates behavioral and transaction-level signals.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>Anomaly Baseline Engine</span>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 relative bg-slate-900/80 border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                03
              </div>

              <h3 className="text-base font-bold text-slate-100">3. Receive a Risk Assessment</h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                SAFE, REVIEW, or HIGH RISK with an explainable risk score.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Explainable Outcome</span>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
