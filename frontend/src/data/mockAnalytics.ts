import {
  SpendingDataPoint,
  RiskTrendPoint,
  CategorySpendingData,
  RiskFactorStat,
  BehavioralInsightItem,
} from '../types/analytics';
import { mockHistoryTransactions } from './mockTransactions';

export const mockSpendingOverview: SpendingDataPoint[] = [
  { date: '2026-09-01', displayDate: 'Sep 01', amount: 4500, transactionCount: 4 },
  { date: '2026-09-03', displayDate: 'Sep 03', amount: 7200, transactionCount: 6 },
  { date: '2026-09-05', displayDate: 'Sep 05', amount: 3800, transactionCount: 3 },
  { date: '2026-09-07', displayDate: 'Sep 07', amount: 8500, transactionCount: 7 },
  { date: '2026-09-10', displayDate: 'Sep 10', amount: 5400, transactionCount: 5 },
  { date: '2026-09-13', displayDate: 'Sep 13', amount: 6100, transactionCount: 6 },
  { date: '2026-09-16', displayDate: 'Sep 16', amount: 2900, transactionCount: 3 },
  { date: '2026-09-20', displayDate: 'Sep 20', amount: 4100, transactionCount: 4 },
  { date: '2026-09-24', displayDate: 'Sep 24', amount: 7800, transactionCount: 7 },
  { date: '2026-09-28', displayDate: 'Sep 28', amount: 3600, transactionCount: 5 },
];

export const mockRiskTrendData: RiskTrendPoint[] = [
  { date: '2026-09-01', displayDate: 'Sep 01', reviewCount: 0, highRiskCount: 0 },
  { date: '2026-09-05', displayDate: 'Sep 05', reviewCount: 1, highRiskCount: 0 },
  { date: '2026-09-10', displayDate: 'Sep 10', reviewCount: 0, highRiskCount: 1 },
  { date: '2026-09-15', displayDate: 'Sep 15', reviewCount: 1, highRiskCount: 0 },
  { date: '2026-09-20', displayDate: 'Sep 20', reviewCount: 1, highRiskCount: 0 },
  { date: '2026-09-25', displayDate: 'Sep 25', reviewCount: 1, highRiskCount: 0 },
  { date: '2026-09-30', displayDate: 'Sep 30', reviewCount: 1, highRiskCount: 1 },
];

export const mockCommonRiskFactors: RiskFactorStat[] = [
  {
    id: 'factor-recip',
    name: 'Recipient Novelty',
    percentage: 80,
    status: 'HIGH',
    description: 'First appearance of unverified external recipient address.',
  },
  {
    id: 'factor-amt',
    name: 'Amount Deviation',
    percentage: 70,
    status: 'HIGH',
    description: 'Transaction amount exceeds 3× category baseline standard deviation.',
  },
  {
    id: 'factor-time',
    name: 'Time Deviation',
    percentage: 50,
    status: 'MEDIUM',
    description: 'Activity initiated during late-night or off-peak hours.',
  },
  {
    id: 'factor-freq',
    name: 'Transaction Frequency',
    percentage: 30,
    status: 'MEDIUM',
    description: 'Burst transfer rate within a short rolling time window.',
  },
  {
    id: 'factor-cat',
    name: 'Category Deviation',
    percentage: 20,
    status: 'LOW',
    description: 'Unusual spending in rarely utilized transaction categories.',
  },
];

export const mockBehavioralInsightsList: BehavioralInsightItem[] = [
  {
    id: 'ins-1',
    title: 'Typical Transaction Amount',
    value: '₹500 – ₹1,500',
    description: 'Most normal transactions fall within this range.',
    iconName: 'DollarSign',
  },
  {
    id: 'ins-2',
    title: 'Most Active Category',
    value: 'Shopping',
    description: 'Most transactions belong to this category.',
    iconName: 'Tag',
  },
  {
    id: 'ins-3',
    title: 'Normal Activity Hours',
    value: '9:00 AM – 10:00 PM',
    description: 'Transactions outside this window may require additional review.',
    iconName: 'Clock',
  },
  {
    id: 'ins-4',
    title: 'Known Recipients',
    value: '25',
    description: 'Recipients previously observed in transaction history.',
    iconName: 'UserCheck',
  },
];

export function getCategorySpendingBreakdown(): CategorySpendingData[] {
  const categoryMap: Record<string, { count: number; total: number }> = {
    Shopping: { count: 0, total: 0 },
    Food: { count: 0, total: 0 },
    Travel: { count: 0, total: 0 },
    Bills: { count: 0, total: 0 },
    Entertainment: { count: 0, total: 0 },
    Transfer: { count: 0, total: 0 },
  };

  mockHistoryTransactions.forEach((txn) => {
    let cat = txn.category;
    if (cat === 'Transport') cat = 'Travel';
    if (cat === 'Healthcare' || cat === 'Education' || cat === 'Other') cat = 'Shopping';

    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, total: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].total += txn.amount;
  });

  const totalAll = Object.values(categoryMap).reduce((acc, curr) => acc + curr.total, 0) || 1;

  return Object.entries(categoryMap).map(([category, data]) => ({
    category,
    transactionCount: data.count,
    totalAmount: data.total,
    percentage: Math.round((data.total / totalAll) * 100),
  })).sort((a, b) => b.totalAmount - a.totalAmount);
}
