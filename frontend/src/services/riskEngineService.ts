import { RiskAnalysisResult, RiskLevel } from '../types/risk';
import { Transaction } from '../types/transaction';
import { mockRiskResults, defaultMockResult } from '../data/mockRiskData';
import { mockTransactionsList } from '../data/mockTransactions';
import { mockBaselineData } from '../data/mockBaseline';
import { getRiskLevelFromScore } from '../utils/riskCalculators';

export interface PaymentCheckPayload {
  upiId: string;
  recipientName?: string;
  amount?: number;
  rawQrPayload?: string;
}

export interface NewTransactionCheckPayload {
  amount: number;
  recipientName: string;
  recipientUpi?: string;
  category: string;
  paymentMethod: string;
  notes?: string;
}

class RiskEngineService {
  /**
   * Mode 1: Check Payment (QR or UPI manual lookup)
   */
  async checkPayment(payload: PaymentCheckPayload): Promise<RiskAnalysisResult> {
    // Simulate network latency for realistic analysis experience
    await new Promise((resolve) => setTimeout(resolve, 800));

    const isSuspicious =
      payload.upiId.toLowerCase().includes('refund') ||
      payload.upiId.toLowerCase().includes('support') ||
      payload.upiId.toLowerCase().includes('winner') ||
      (payload.amount && payload.amount > 30000);

    const isModerate =
      payload.upiId.toLowerCase().includes('rohit') ||
      payload.upiId.toLowerCase().includes('crypto') ||
      (payload.amount && payload.amount > 10000);

    if (isSuspicious) {
      return {
        ...mockRiskResults['TXN-HIGH-03'],
        id: `RISK-${Date.now()}`,
        referenceId: `UPI-CHK-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        recipientDetails: {
          upiId: payload.upiId,
          name: payload.recipientName || 'Unverified External Party',
          verifiedMerchant: false,
          trustScore: 12,
          flaggedReportsCount: 19,
          priorInteractionsCount: 0,
        },
      };
    }

    if (isModerate) {
      return {
        ...mockRiskResults['TXN-REVIEW-02'],
        id: `RISK-${Date.now()}`,
        referenceId: `UPI-CHK-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        recipientDetails: {
          upiId: payload.upiId,
          name: payload.recipientName || 'Individual Contact',
          verifiedMerchant: false,
          trustScore: 59,
          flaggedReportsCount: 1,
          priorInteractionsCount: 0,
        },
      };
    }

    // Default safe
    return {
      ...mockRiskResults['TXN-SAFE-01'],
      id: `RISK-${Date.now()}`,
      referenceId: `UPI-CHK-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      recipientDetails: {
        upiId: payload.upiId,
        name: payload.recipientName || "Verified Merchant",
        verifiedMerchant: true,
        trustScore: 95,
        flaggedReportsCount: 0,
        priorInteractionsCount: 6,
      },
    };
  }

  /**
   * Mode 2: Check New Transaction against user behavioral baseline
   */
  async checkNewTransaction(payload: NewTransactionCheckPayload): Promise<RiskAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const baseline = mockBaselineData;
    let score = 10;
    const factors = [];

    // Amount deviation check
    const amountDevRatio = payload.amount / baseline.averageTransactionAmount;
    if (payload.amount > baseline.maxHistoricalAmount) {
      score += 45;
      factors.push({
        id: 'F-AMT-MAX',
        name: 'Historical Maximum Exceeded',
        category: 'AMOUNT' as const,
        severity: 'HIGH' as const,
        scoreImpact: 45,
        description: `Amount exceeds your historical maximum of ₹${baseline.maxHistoricalAmount.toLocaleString()}`,
        detectedValue: `₹${payload.amount.toLocaleString()}`,
        expectedBaseline: `< ₹${baseline.maxHistoricalAmount.toLocaleString()}`,
      });
    } else if (amountDevRatio > 4) {
      score += 30;
      factors.push({
        id: 'F-AMT-SPIKE',
        name: 'Significant Amount Deviation',
        category: 'AMOUNT' as const,
        severity: 'MEDIUM' as const,
        scoreImpact: 30,
        description: `Amount is ${amountDevRatio.toFixed(1)}x higher than your average transaction (₹${baseline.averageTransactionAmount.toLocaleString()})`,
        detectedValue: `₹${payload.amount.toLocaleString()}`,
        expectedBaseline: `₹${baseline.averageTransactionAmount.toLocaleString()} avg`,
      });
    }

    // Time window check (current hour vs peak activity)
    const currentHour = new Date().getHours();
    if (currentHour < baseline.peakActivityHours.startHour || currentHour > baseline.peakActivityHours.endHour) {
      score += 15;
      factors.push({
        id: 'F-TIME-OFF',
        name: 'Unusual Active Hour',
        category: 'TIME' as const,
        severity: 'LOW' as const,
        scoreImpact: 15,
        description: `Transaction initiated at off-peak hour (${currentHour}:00). Your typical window is ${baseline.peakActivityHours.startHour}:00 - ${baseline.peakActivityHours.endHour}:00.`,
      });
    }

    const riskLevel: RiskLevel = getRiskLevelFromScore(score);

    return {
      id: `RISK-${Date.now()}`,
      referenceId: `TXN-CHK-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      riskScore: Math.min(score, 99),
      riskLevel,
      confidenceScore: 92,
      primaryReason:
        riskLevel === 'HIGH_RISK'
          ? 'Transaction significantly deviates from your baseline profile.'
          : riskLevel === 'REVIEW'
          ? 'Moderate baseline deviation detected in amount or time pattern.'
          : 'Transaction aligns with your historical spending baseline.',
      summaryText: `Analyzed transaction for ${payload.recipientName} against 28-month behavioral baseline.`,
      factors: factors.length > 0 ? factors : mockRiskResults['TXN-SAFE-01'].factors,
      recommendation: {
        action: riskLevel === 'HIGH_RISK' ? 'BLOCK' : riskLevel === 'REVIEW' ? 'REQUIRE_2FA' : 'PROCEED',
        message:
          riskLevel === 'HIGH_RISK'
            ? 'High probability of anomaly. Verification required.'
            : riskLevel === 'REVIEW'
            ? 'Proceed with caution and verify recipient details.'
            : 'Safe to proceed.',
        warningPoints:
          riskLevel === 'HIGH_RISK'
            ? ['Severe amount deviation from baseline', 'Novel recipient profile']
            : riskLevel === 'REVIEW'
            ? ['Transaction size exceeds standard deviation']
            : [],
      },
      recipientDetails: {
        upiId: payload.recipientUpi,
        name: payload.recipientName,
        verifiedMerchant: false,
        trustScore: riskLevel === 'SAFE' ? 90 : riskLevel === 'REVIEW' ? 65 : 20,
        flaggedReportsCount: riskLevel === 'HIGH_RISK' ? 12 : 0,
        priorInteractionsCount: riskLevel === 'SAFE' ? 4 : 0,
      },
      metrics: {
        amountDeviationPercent: Math.round(amountDevRatio * 100),
        noveltyScore: riskLevel === 'SAFE' ? 10 : 75,
        timeAnomalyDetected: currentHour < 9 || currentHour > 22,
        velocityPerHour: 1,
      },
    };
  }

  /**
   * Mode 3: Scan Transaction History Batch
   */
  async scanHistoryBatch(transactions: Transaction[]): Promise<{
    total: number;
    safe: number;
    review: number;
    highRisk: number;
    results: Transaction[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const enriched = transactions.map((txn) => {
      if (txn.riskResult) return txn;
      const level = txn.riskLevel || getRiskLevelFromScore(txn.riskScore || 20);
      return {
        ...txn,
        riskLevel: level,
        riskScore: txn.riskScore || (level === 'HIGH_RISK' ? 88 : level === 'REVIEW' ? 55 : 12),
      };
    });

    return {
      total: enriched.length,
      safe: enriched.filter((t) => t.riskLevel === 'SAFE').length,
      review: enriched.filter((t) => t.riskLevel === 'REVIEW').length,
      highRisk: enriched.filter((t) => t.riskLevel === 'HIGH_RISK').length,
      results: enriched,
    };
  }

  /**
   * Fetch a single Risk Result by ID (used by /result/:id)
   */
  async getResultById(id: string): Promise<RiskAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (mockRiskResults[id]) {
      return mockRiskResults[id];
    }

    // If ID matches a transaction in mock list
    const foundTxn = mockTransactionsList.find((t) => t.id === id || t.referenceNo === id);
    if (foundTxn && foundTxn.riskResult) {
      return foundTxn.riskResult;
    }

    // Dynamic fallback for any query ID
    return {
      ...defaultMockResult,
      id: id,
      referenceId: id.startsWith('TXN') ? id : `TXN-${id}`,
    };
  }

  /**
   * Fetch baseline summary for current user
   */
  getBehavioralBaseline() {
    return mockBaselineData;
  }

  /**
   * Fetch recent transactions
   */
  getRecentTransactions(): Transaction[] {
    return mockTransactionsList;
  }
}

export const riskEngineService = new RiskEngineService();
