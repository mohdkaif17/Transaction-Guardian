import { RiskLevel } from './risk';

export type AnalyticsDateRange = '7d' | '30d' | '90d' | 'all';

export interface AnalyticsFilterState {
  dateRange: AnalyticsDateRange;
  riskLevel: 'ALL' | 'SAFE' | 'REVIEW' | 'HIGH_RISK';
  category: string;
}

export interface SpendingDataPoint {
  date: string;
  displayDate: string;
  amount: number;
  transactionCount: number;
}

export interface RiskTrendPoint {
  date: string;
  displayDate: string;
  reviewCount: number;
  highRiskCount: number;
}

export interface CategorySpendingData {
  category: string;
  transactionCount: number;
  totalAmount: number;
  percentage: number;
}

export interface RiskFactorStat {
  id: string;
  name: string;
  percentage: number;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface BehavioralInsightItem {
  id: string;
  title: string;
  value: string;
  description: string;
  iconName: string;
}
