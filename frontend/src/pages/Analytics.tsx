import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  Activity,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { AnalyticsKPI } from '../components/analytics/AnalyticsKPI';
import { SpendingChart } from '../components/analytics/SpendingChart';
import { RiskDistributionChart } from '../components/analytics/RiskDistributionChart';
import { RiskTrendChart } from '../components/analytics/RiskTrendChart';
import { CategoryChart } from '../components/analytics/CategoryChart';
import { BehavioralInsights } from '../components/analytics/BehavioralInsights';
import { HighRiskActivity } from '../components/analytics/HighRiskActivity';
import { RiskFactorsSummary } from '../components/analytics/RiskFactorsSummary';
import { AnalyticsSummary } from '../components/analytics/AnalyticsSummary';
import { AnalyticsFilterState } from '../types/analytics';
import {
  mockSpendingOverview,
  mockRiskTrendData,
  mockCommonRiskFactors,
  mockBehavioralInsightsList,
  getCategorySpendingBreakdown,
} from '../data/mockAnalytics';
import { mockHistoryTransactions } from '../data/mockTransactions';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();

  // Filters State
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    dateRange: '30d',
    riskLevel: 'ALL',
    category: 'All Categories',
  });

  const handleResetFilters = () => {
    setFilters({
      dateRange: '30d',
      riskLevel: 'ALL',
      category: 'All Categories',
    });
  };

  // Filtered dataset for dynamic statistics
  const filteredTransactions = useMemo(() => {
    return mockHistoryTransactions.filter((txn) => {
      // Risk filter
      if (filters.riskLevel !== 'ALL' && txn.riskLevel !== filters.riskLevel) {
        return false;
      }

      // Category filter
      if (
        filters.category !== 'All Categories' &&
        txn.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Derived metrics
  const totalCount = filteredTransactions.length;
  const safeCount = filteredTransactions.filter((t) => t.riskLevel === 'SAFE').length;
  const reviewCount = filteredTransactions.filter((t) => t.riskLevel === 'REVIEW').length;
  const highRiskCount = filteredTransactions.filter((t) => t.riskLevel === 'HIGH_RISK').length;

  const categoryBreakdown = useMemo(() => getCategorySpendingBreakdown(), []);

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
            <span className="text-slate-800 dark:text-slate-300 font-semibold">Risk Insights</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Risk Insights
            </h1>
            <Badge variant="neutral" size="md" dot>
              <BarChart3 className="w-3.5 h-3.5 inline mr-1 text-cyan-600 dark:text-cyan-400" />
              Fingerprint Metrics & Trends
            </Badge>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Understand your normal spending pattern, new recipients, and unusual payment behavior.
          </p>
        </div>
      </div>

      {/* 2. FILTER BAR */}
      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* 3. FOUR KPI STATISTIC CARDS */}
      <AnalyticsKPI
        total={totalCount}
        safe={safeCount}
        review={reviewCount}
        highRisk={highRiskCount}
      />

      {/* 4. ROW 1: SPENDING OVERVIEW & RISK DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={mockSpendingOverview} />
        </div>
        <div>
          <RiskDistributionChart
            safeCount={safeCount}
            reviewCount={reviewCount}
            highRiskCount={highRiskCount}
            totalCount={totalCount}
          />
        </div>
      </div>

      {/* 5. ROW 2: RISK TREND & SPENDING BY CATEGORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChart data={mockRiskTrendData} />
        <CategoryChart categories={categoryBreakdown} />
      </div>

      {/* 6. ROW 3: BEHAVIORAL INSIGHTS */}
      <BehavioralInsights insights={mockBehavioralInsightsList} />

      {/* 7. ROW 4: RECENT HIGH-RISK ACTIVITY & COMMON RISK FACTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <HighRiskActivity transactions={mockHistoryTransactions} />
        </div>
        <div className="lg:col-span-2">
          <RiskFactorsSummary factors={mockCommonRiskFactors} />
        </div>
      </div>

      {/* 8. ROW 5: SUMMARY INTELLIGENCE CARD + DISCLAIMER */}
      <AnalyticsSummary />
    </div>
  );
};
