// Temporary frontend mock risk engine.
// This will later be replaced or backed by the FastAPI/ML risk service.

import {
  RiskLevel,
  AnalysisSource,
  UnifiedRiskResult,
  UnifiedRiskSignal,
  UnifiedFlaggedReason,
  UnifiedBehavioralRow,
} from '../types/risk';
import { mockBehaviorProfile, BehaviorProfile } from '../data/mockBehaviorProfile';
import { unifiedMockResults } from '../data/mockRiskResults';
import { formatCurrency } from '../utils/formatters';

export interface TransactionInput {
  id?: string;
  recipientUpi: string;
  recipientName?: string;
  amount: number;
  category: string;
  timestamp?: string;
  transactionDate?: string;
  transactionTime?: string;
  source?: AnalysisSource;
}

// In-memory dynamic result registry
const resultRegistry: Map<string, UnifiedRiskResult> = new Map();

// Initialize registry with baseline fixtures
Object.entries(unifiedMockResults).forEach(([id, result]) => {
  resultRegistry.set(id, result);
});

/**
 * Standard risk-level classification mapping
 * 0–39    SAFE
 * 40–69   REVIEW
 * 70–100  HIGH RISK
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score < 40) return 'SAFE';
  if (score < 70) return 'REVIEW';
  return 'HIGH_RISK';
}

/**
 * Parse time string "HH:mm" or ISO timestamp to extract 24-hr integer hour
 */
function extractHour(input: TransactionInput): number {
  if (input.transactionTime) {
    const parts = input.transactionTime.split(':');
    if (parts.length > 0) {
      const h = parseInt(parts[0], 10);
      if (!isNaN(h)) return h;
    }
  }

  if (input.timestamp) {
    try {
      const d = new Date(input.timestamp);
      if (!isNaN(d.getTime())) return d.getHours();
    } catch {
      // fallback
    }
  }

  return new Date().getHours();
}

/**
 * Common Risk Engine Core Function
 * Extracts features, applies heuristic anomaly detection, and aggregates risk weights.
 */
export function analyzeTransaction(
  input: TransactionInput,
  profile: BehaviorProfile = mockBehaviorProfile
): UnifiedRiskResult {
  // 1. Safe Error Handling & Default Fallbacks
  const amount = isNaN(input.amount) || input.amount < 0 ? 0 : input.amount;
  const upiId = (input.recipientUpi || '').trim().toLowerCase();
  const recipientName = (input.recipientName || upiId || 'Unknown Payee').trim();
  const category = input.category || 'Shopping';
  const source: AnalysisSource = input.source || 'NEW_TRANSACTION';
  const hour = extractHour(input);

  const txnId =
    input.id ||
    `TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;

  // Formatted date & time strings
  const now = new Date();
  const dateFormatted =
    input.transactionDate ||
    now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const timeFormatted =
    input.transactionTime ||
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // 2. FEATURE EXTRACTION & ANOMALY WEIGHTS

  // --- Signal 1: Amount Deviation (0–30 pts) ---
  let amountScore = 2;
  let amountStatus: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let amountMultiplierText = 'Within baseline';
  let amountContribution = 10;

  const ratio = profile.averageAmount > 0 ? amount / profile.averageAmount : 1;
  if (ratio >= 5 || amount > 8000) {
    amountScore = 30;
    amountStatus = 'HIGH';
    amountMultiplierText = `${ratio.toFixed(0)}× normal`;
    amountContribution = 80;
  } else if (ratio >= 2.2 || amount > profile.typicalAmountRange.max) {
    amountScore = 18;
    amountStatus = 'MEDIUM';
    amountMultiplierText = `${ratio.toFixed(1)}× normal`;
    amountContribution = 55;
  } else {
    amountScore = 3;
    amountStatus = 'LOW';
    amountMultiplierText = 'Within baseline';
    amountContribution = 15;
  }

  // --- Signal 2: Recipient Novelty (0–25 pts) ---
  const isKnown = profile.knownRecipients.some(
    (k) =>
      (k.upiId && k.upiId.toLowerCase() === upiId) ||
      (k.name && k.name.toLowerCase() === recipientName.toLowerCase())
  );

  let recipientScore = isKnown ? 2 : 25;
  let recipientStatus: 'LOW' | 'MEDIUM' | 'HIGH' = isKnown ? 'LOW' : 'HIGH';
  let recipientValue = isKnown ? 'KNOWN' : 'NEW';
  let recipientContribution = isKnown ? 10 : 90;

  // --- Signal 3: Time Deviation (0–15 pts) ---
  const isOffHours = hour < profile.normalStartHour || hour >= profile.normalEndHour;
  let timeScore = isOffHours ? (hour >= 23 || hour <= 4 ? 15 : 10) : 0;
  let timeStatus: 'LOW' | 'MEDIUM' | 'HIGH' = isOffHours ? (timeScore === 15 ? 'HIGH' : 'MEDIUM') : 'LOW';
  let timeValue = isOffHours ? `${timeFormatted} (Off-hours)` : `${timeFormatted} (Active window)`;
  let timeContribution = isOffHours ? 60 : 15;

  // --- Signal 4: Category Deviation (0–15 pts) ---
  const isCommonCategory = profile.commonCategories.some(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  let categoryScore = 0;
  let categoryStatus: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let categoryContribution = 15;

  if (category.toLowerCase() === 'transfer' && amount > 5000) {
    categoryScore = 14;
    categoryStatus = 'HIGH';
    categoryContribution = 70;
  } else if (!isCommonCategory) {
    categoryScore = 8;
    categoryStatus = 'MEDIUM';
    categoryContribution = 45;
  } else {
    categoryScore = 2;
    categoryStatus = 'LOW';
    categoryContribution = 15;
  }

  // --- Signal 5: Frequency / Velocity Anomaly (0–15 pts) ---
  let freqScore = (amountStatus === 'HIGH' && isOffHours) ? 14 : (amountStatus === 'HIGH' || isOffHours) ? 8 : 2;
  let freqStatus: 'LOW' | 'MEDIUM' | 'HIGH' = freqScore >= 12 ? 'HIGH' : freqScore >= 7 ? 'MEDIUM' : 'LOW';
  let freqValue = freqStatus === 'HIGH' ? 'Burst activity' : freqStatus === 'MEDIUM' ? 'Elevated velocity' : 'Normal frequency';
  let freqContribution = freqStatus === 'HIGH' ? 75 : freqStatus === 'MEDIUM' ? 50 : 15;

  // 3. TOTAL RISK SCORE & LEVEL
  const totalScore = Math.min(
    100,
    Math.max(5, amountScore + recipientScore + timeScore + categoryScore + freqScore)
  );
  const riskLevel = getRiskLevel(totalScore);

  // 4. DYNAMIC RECOMMENDATION & STATUS MESSAGE
  let recommendationTitle = '';
  let recommendationText = '';
  let statusMessage = '';

  if (riskLevel === 'HIGH_RISK') {
    recommendationTitle = '⚠️ Verify the recipient before proceeding.';
    recommendationText =
      'Multiple unusual characteristics were detected. Verify the recipient independently before proceeding with this payment.';
    statusMessage =
      'This transaction contains multiple signals that differ significantly from the user\'s normal transaction behavior.';
  } else if (riskLevel === 'REVIEW') {
    recommendationTitle = 'Review the transaction details before proceeding.';
    recommendationText =
      'Some unusual transaction characteristics were detected. Verify the recipient and payment details before proceeding.';
    statusMessage = 'Some transaction characteristics differ from normal behavior.';
  } else {
    recommendationTitle = 'You can proceed, while continuing to verify payment details.';
    recommendationText =
      'This transaction appears consistent with your usual transaction behavior. Proceed only after confirming the recipient and payment details.';
    statusMessage =
      'This transaction appears consistent with the available transaction and behavioral signals.';
  }

  // 5. EXPLAINABLE REASONS
  const flaggedReasons: UnifiedFlaggedReason[] = [];

  if (amountStatus === 'HIGH') {
    flaggedReasons.push({
      id: 'r-amt',
      title: 'Unusual transaction amount',
      description: `Transaction amount (${formatCurrency(amount)}) is significantly higher than your typical transaction average (${formatCurrency(profile.averageAmount)}).`,
      severity: 'HIGH',
    });
  } else if (amountStatus === 'MEDIUM') {
    flaggedReasons.push({
      id: 'r-amt',
      title: 'Elevated transaction amount',
      description: `Transaction amount (${formatCurrency(amount)}) is above your normal range (${formatCurrency(profile.typicalAmountRange.min)} – ${formatCurrency(profile.typicalAmountRange.max)}).`,
      severity: 'MEDIUM',
    });
  }

  if (recipientStatus === 'HIGH') {
    flaggedReasons.push({
      id: 'r-recip',
      title: 'New recipient',
      description: 'Recipient is new and has not appeared in your transaction history.',
      severity: 'HIGH',
    });
  }

  if (isOffHours) {
    flaggedReasons.push({
      id: 'r-time',
      title: 'Unusual transaction time',
      description: `Transaction occurred at ${timeFormatted}, outside your normal activity hours (${profile.normalStartHour}:00 AM – ${profile.normalEndHour - 12}:00 PM).`,
      severity: timeStatus,
    });
  }

  if (categoryStatus !== 'LOW') {
    flaggedReasons.push({
      id: 'r-cat',
      title: 'Category variance',
      description: 'Transaction category differs from your usual spending pattern.',
      severity: categoryStatus,
    });
  }

  if (freqStatus !== 'LOW') {
    flaggedReasons.push({
      id: 'r-freq',
      title: 'Increased transaction activity',
      description: 'Multiple transactions were detected within a short period.',
      severity: freqStatus,
    });
  }

  if (flaggedReasons.length === 0) {
    flaggedReasons.push({
      id: 'r-safe',
      title: 'Baseline alignment',
      description: 'Transaction parameters match historical verified baseline profile.',
      severity: 'LOW',
    });
  }

  // 6. STRUCTURED RISK SIGNALS
  const signals: UnifiedRiskSignal[] = [
    {
      id: 'sig-amt',
      name: 'Amount Deviation',
      status: amountStatus,
      value: amountMultiplierText,
      description: `${formatCurrency(amount)} compared against typical avg ${formatCurrency(profile.averageAmount)}.`,
      contributionPercent: amountContribution,
    },
    {
      id: 'sig-recip',
      name: 'Recipient Novelty',
      status: recipientStatus,
      value: recipientValue,
      description: isKnown ? 'Verified payee in known contacts list.' : 'Recipient not previously seen.',
      contributionPercent: recipientContribution,
    },
    {
      id: 'sig-time',
      name: 'Time Deviation',
      status: timeStatus,
      value: timeValue,
      description: isOffHours ? 'Transaction outside normal activity hours.' : 'Normal daytime activity window.',
      contributionPercent: timeContribution,
    },
    {
      id: 'sig-freq',
      name: 'Transaction Frequency',
      status: freqStatus,
      value: freqValue,
      description: freqStatus === 'HIGH' ? 'Elevated velocity within short window.' : 'Standard transaction spacing.',
      contributionPercent: freqContribution,
    },
    {
      id: 'sig-cat',
      name: 'Category Deviation',
      status: categoryStatus,
      value: category,
      description: isCommonCategory ? 'Category matches previous behavior.' : 'Unfrequent spending category.',
      contributionPercent: categoryContribution,
    },
  ];

  // 7. BEHAVIORAL COMPARISON TABLE ROWS
  const comparisonRows: UnifiedBehavioralRow[] = [
    {
      signal: 'Amount',
      currentValue: formatCurrency(amount),
      normalBehavior: `${formatCurrency(profile.averageAmount)} avg`,
      difference: amountMultiplierText,
      status: amountStatus,
    },
    {
      signal: 'Recipient',
      currentValue: recipientName,
      normalBehavior: `Known recipients (${profile.knownRecipients.length})`,
      difference: recipientValue,
      status: recipientStatus,
    },
    {
      signal: 'Time',
      currentValue: timeFormatted,
      normalBehavior: `${profile.normalStartHour} AM – ${profile.normalEndHour - 12} PM`,
      difference: isOffHours ? 'Unusual' : 'Normal',
      status: timeStatus,
    },
    {
      signal: 'Category',
      currentValue: category,
      normalBehavior: profile.commonCategories[0] || 'Shopping',
      difference: isCommonCategory ? 'Normal' : 'Unusual',
      status: categoryStatus,
    },
  ];

  // 8. ASSEMBLE COMPLETE UNIFIED RISK RESULT
  const result: UnifiedRiskResult = {
    id: txnId,
    transactionId: txnId,
    source,
    timestamp: input.timestamp || now.toISOString(),
    dateFormatted,
    timeFormatted,
    riskScore: totalScore,
    riskLevel,
    statusMessage,
    recipientName,
    recipientUpi: upiId,
    amount,
    category,
    recommendation: {
      title: recommendationTitle,
      supportingText: recommendationText,
      action: riskLevel === 'HIGH_RISK' ? 'WARN_USER' : riskLevel === 'REVIEW' ? 'REQUIRE_2FA' : 'PROCEED',
    },
    confidence: {
      level: 'High',
      description: 'Multiple transaction and behavioral signals contributed to this assessment.',
      scorePercent: 94,
    },
    signals,
    flaggedReasons,
    comparisonRows,
  };

  // Register in memory so `/result/:id` can look it up immediately
  resultRegistry.set(txnId, result);

  return result;
}

/**
 * Retrieve analyzed risk result by transaction or query ID
 */
export function getRiskResult(id: string): UnifiedRiskResult {
  if (resultRegistry.has(id)) {
    return resultRegistry.get(id)!;
  }

  // Dynamic fallback generation if custom URL param passed
  return analyzeTransaction({
    id,
    recipientUpi: 'payee@upi',
    recipientName: 'Payee Merchant',
    amount: 10000,
    category: 'Shopping',
  });
}
