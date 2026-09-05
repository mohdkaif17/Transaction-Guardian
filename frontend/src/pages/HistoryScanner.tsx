import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LoadingState } from '../components/common/LoadingState';
import { TransactionUpload } from '../components/history/TransactionUpload';
import { TransactionSummary } from '../components/history/TransactionSummary';
import { RiskDistributionCard } from '../components/history/RiskDistributionCard';
import { TransactionFilters, FilterState } from '../components/history/TransactionFilters';
import { TransactionTable } from '../components/history/TransactionTable';
import { TransactionDetailModal } from '../components/history/TransactionDetailModal';
import { mockHistoryTransactions } from '../data/mockTransactions';
import { HistoryTransaction } from '../types/transaction';
import { uploadHistoryApi } from '../services/api';

export const HistoryScanner: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<HistoryTransaction | null>(null);

  const [transactions, setTransactions] = useState<HistoryTransaction[]>([]);
  const [counts, setCounts] = useState({ safe: 0, review: 0, highRisk: 0, total: 0 });

  // Filters and Sorting State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    riskLevel: 'ALL',
    category: 'ALL',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const handleStartAnalysis = async (file: File | null, isDemo: boolean) => {
    setIsLoading(true);
    setError(null);

    if (isDemo || !file) {
      // Use fallback mock transactions if demo mode requested
      setTimeout(() => {
        setTransactions(mockHistoryTransactions);
        const safe = mockHistoryTransactions.filter((t) => t.riskLevel === 'SAFE').length;
        const review = mockHistoryTransactions.filter((t) => t.riskLevel === 'REVIEW').length;
        const high = mockHistoryTransactions.filter((t) => t.riskLevel === 'HIGH_RISK').length;
        setCounts({ safe, review, highRisk: high, total: mockHistoryTransactions.length });
        setIsLoading(false);
        setHasAnalyzed(true);
      }, 1000);
      return;
    }

    try {
      const res = await uploadHistoryApi(file);
      setTransactions(res.transactions);
      setCounts({
        safe: res.safeCount,
        review: res.reviewCount,
        highRisk: res.highRiskCount,
        total: res.totalCount,
      });
      setHasAnalyzed(true);
    } catch (err: any) {
      console.error('Upload analysis failed:', err);
      setError(err?.message || 'Backend service unreachable. Failed to process history CSV file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasAnalyzed(false);
    setError(null);
    setSelectedTransaction(null);
    setTransactions([]);
    setCounts({ safe: 0, review: 0, highRisk: 0, total: 0 });
    setFilters({
      search: '',
      riskLevel: 'ALL',
      category: 'ALL',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  // Download report
  const handleDownloadReport = () => {
    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Transaction_Guardian_Risk_Report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Summary Metrics calculation
  const totalCount = counts.total || transactions.length;
  const safeCount = counts.safe;
  const reviewCount = counts.review;
  const highRiskCount = counts.highRisk;
  const totalVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered & Sorted Transactions List
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => {
        // Search filter
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchId = txn.id.toLowerCase().includes(query);
          const matchRecipient = txn.recipient.toLowerCase().includes(query);
          const matchUpi = txn.recipientUpi?.toLowerCase().includes(query);
          if (!matchId && !matchRecipient && !matchUpi) return false;
        }

        // Risk Level filter
        if (filters.riskLevel !== 'ALL' && txn.riskLevel !== filters.riskLevel) {
          return false;
        }

        // Category filter
        if (filters.category !== 'ALL' && txn.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (filters.sortBy === 'amount') {
          comp = a.amount - b.amount;
        } else if (filters.sortBy === 'riskScore') {
          comp = a.riskScore - b.riskScore;
        } else {
          // Date sort
          comp = a.id.localeCompare(b.id);
        }
        return filters.sortOrder === 'asc' ? comp : -comp;
      });
  }, [filters, transactions]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>
              Dashboard
            </span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-800 dark:text-slate-300 font-semibold">Scan Payment History</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Scan Your Payment History
            </h1>
            <Badge variant="neutral" size="md" dot>
              <FileSpreadsheet className="w-3.5 h-3.5 inline mr-1 text-cyan-600 dark:text-cyan-400" />
              Build Fingerprint & Discover Anomalies
            </Badge>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Upload your transaction history to build your personal payment fingerprint and discover unusual activity.
          </p>
        </div>

        {hasAnalyzed && !isLoading && (
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleReset}
            >
              Upload Another File
            </Button>
          </div>
        )}
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <Card className="p-12 border-cyan-500/30 bg-slate-900/90 shadow-glow-shield">
          <LoadingState
            message="Processing History CSV with Python Risk Engine..."
            subtext="Extracting features, evaluating behavioral baselines, and scoring Isolation Forest anomalies"
          />
        </Card>
      )}

      {/* 3. ERROR STATE */}
      {!isLoading && error && (
        <Card className="p-8 border-rose-500/30 bg-rose-950/20 text-center space-y-4">
          <div className="p-3.5 rounded-full bg-rose-900/40 border border-rose-800 text-rose-400 w-12 h-12 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-rose-200">History Upload Error</h4>
            <p className="text-xs text-rose-300/80 max-w-md mx-auto">{error}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* 4. INITIAL STATE: Upload Card + Empty Placeholder */}
      {!isLoading && !hasAnalyzed && !error && (
        <div className="space-y-8">
          <TransactionUpload onAnalyze={handleStartAnalysis} isLoading={isLoading} />

          {/* Empty State Banner */}
          <div className="p-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-center space-y-3">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 w-12 h-12 mx-auto flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-200">No transaction history analyzed yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Upload a CSV statement to begin analyzing your transaction history against ML anomaly baselines.
            </p>
          </div>
        </div>
      )}

      {/* 5. RESULTS STATE: Summary, Risk Distribution, Filters, Table */}
      {!isLoading && hasAnalyzed && !error && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Summary Metric Cards */}
          <TransactionSummary
            totalCount={totalCount}
            safeCount={safeCount}
            reviewCount={reviewCount}
            highRiskCount={highRiskCount}
            totalVolume={totalVolume}
            onDownloadReport={handleDownloadReport}
          />

          {/* Risk Distribution Card */}
          <RiskDistributionCard
            safeCount={safeCount}
            reviewCount={reviewCount}
            highRiskCount={highRiskCount}
            totalCount={totalCount}
          />

          {/* Transaction Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Analyzed Transactions</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {filteredTransactions.length} items found
              </span>
            </div>

            {/* Filters & Sorting */}
            <TransactionFilters filters={filters} onChange={setFilters} />

            {/* Transactions Table */}
            <TransactionTable
              transactions={filteredTransactions}
              onSelectTransaction={(txn) => setSelectedTransaction(txn)}
              pageSize={10}
            />
          </div>
        </div>
      )}

      {/* 6. Suspicious Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
