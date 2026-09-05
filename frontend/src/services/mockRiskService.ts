import { RiskLevel, UnifiedRiskResult } from '../types/risk';
import {
  analyzeTransaction,
  getRiskResult,
  TransactionInput,
} from './riskEngine';

export interface PaymentCheckInput {
  upiId: string;
  recipientName?: string;
  amount: number;
  category: string;
  transactionTime?: string;
}

export interface RiskSignal {
  id: string;
  title: string;
  value: string;
  status: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface PrePaymentRiskResult {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendation: string;
  signals: RiskSignal[];
  paymentSummary: {
    recipient: string;
    upiId: string;
    amount: number;
    category: string;
    analysisTime: string;
  };
}

export interface NewTransactionInput {
  upiId: string;
  recipientName: string;
  amount: number;
  category: string;
  transactionTime: string;
  transactionDate: string;
}

export interface BehavioralComparisonData {
  amount: {
    current: number;
    historicalAvg: number;
    differenceText: string;
    status: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  recipient: {
    name: string;
    upiId: string;
    statusText: string;
    isNew: boolean;
    status: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  time: {
    current: string;
    normalWindow: string;
    isOutside: boolean;
    status: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  category: {
    name: string;
    isFamiliar: boolean;
    statusText: string;
    status: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

export interface ExplainableRiskSignal {
  id: string;
  name: string;
  iconStatus: 'RED' | 'YELLOW' | 'GREEN';
  title: string;
  description: string;
}

export interface NewTransactionRiskResult {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  transactionHeader: string;
  reasons: string[];
  recommendation: string;
  comparison: BehavioralComparisonData;
  signals: RiskSignal[];
  explainableSignals: ExplainableRiskSignal[];
  transactionDetails: {
    recipientName: string;
    upiId: string;
    amount: number;
    category: string;
    transactionDate: string;
    transactionTime: string;
    analysisTime: string;
  };
}

/**
 * Mode 1: Pre-payment check (delegates to common risk engine)
 */
export async function analyzePaymentRisk(input: PaymentCheckInput): Promise<PrePaymentRiskResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const unified = analyzeTransaction({
    recipientUpi: input.upiId,
    recipientName: input.recipientName,
    amount: input.amount,
    category: input.category,
    transactionTime: input.transactionTime,
    source: 'QR_CHECK',
  });

  return {
    id: unified.id,
    riskScore: unified.riskScore,
    riskLevel: unified.riskLevel,
    reasons: unified.flaggedReasons.map((r) => r.description),
    recommendation: unified.recommendation.supportingText,
    signals: unified.signals.map((s) => ({
      id: s.id,
      title: s.name,
      value: s.value,
      status: s.status,
      description: s.description,
    })),
    paymentSummary: {
      recipient: unified.recipientName,
      upiId: unified.recipientUpi,
      amount: unified.amount,
      category: unified.category,
      analysisTime: 'Just now',
    },
  };
}

/**
 * Mode 2: New transaction behavioral check (delegates to common risk engine)
 */
export async function analyzeNewTransactionRisk(
  input: NewTransactionInput
): Promise<NewTransactionRiskResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 900));

  const unified = analyzeTransaction({
    recipientUpi: input.upiId,
    recipientName: input.recipientName,
    amount: input.amount,
    category: input.category,
    transactionDate: input.transactionDate,
    transactionTime: input.transactionTime,
    source: 'NEW_TRANSACTION',
  });

  const comparisonRows = unified.comparisonRows;
  const amtRow = comparisonRows.find((r) => r.signal === 'Amount');
  const recipRow = comparisonRows.find((r) => r.signal === 'Recipient');
  const timeRow = comparisonRows.find((r) => r.signal === 'Time');
  const catRow = comparisonRows.find((r) => r.signal === 'Category');

  return {
    id: unified.id,
    riskScore: unified.riskScore,
    riskLevel: unified.riskLevel,
    transactionHeader: `₹${unified.amount.toLocaleString('en-IN')} → ${unified.recipientUpi}`,
    reasons: unified.flaggedReasons.map((r) => r.description),
    recommendation: unified.recommendation.supportingText,
    comparison: {
      amount: {
        current: unified.amount,
        historicalAvg: 1250,
        differenceText: amtRow?.difference || 'Normal',
        status: amtRow?.status || 'LOW',
      },
      recipient: {
        name: unified.recipientName,
        upiId: unified.recipientUpi,
        statusText: recipRow?.difference || 'Known',
        isNew: recipRow?.status === 'HIGH',
        status: recipRow?.status || 'LOW',
      },
      time: {
        current: unified.timeFormatted,
        normalWindow: '9:00 AM – 10:00 PM',
        isOutside: timeRow?.status !== 'LOW',
        status: timeRow?.status || 'LOW',
      },
      category: {
        name: unified.category,
        isFamiliar: catRow?.status === 'LOW',
        statusText: catRow?.difference || 'Normal',
        status: catRow?.status || 'LOW',
      },
    },
    signals: unified.signals.map((s) => ({
      id: s.id,
      title: s.name,
      value: s.value,
      status: s.status,
      description: s.description,
    })),
    explainableSignals: unified.signals.map((s) => ({
      id: s.id,
      name: s.name,
      iconStatus: s.status === 'HIGH' ? 'RED' : s.status === 'MEDIUM' ? 'YELLOW' : 'GREEN',
      title: s.name,
      description: s.description,
    })),
    transactionDetails: {
      recipientName: unified.recipientName,
      upiId: unified.recipientUpi,
      amount: unified.amount,
      category: unified.category,
      transactionDate: unified.dateFormatted,
      transactionTime: unified.timeFormatted,
      analysisTime: 'Just now',
    },
  };
}
