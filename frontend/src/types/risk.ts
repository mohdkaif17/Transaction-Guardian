export type RiskLevel = 'SAFE' | 'REVIEW' | 'HIGH_RISK';

export type AnalysisSource = 'QR_CHECK' | 'NEW_TRANSACTION' | 'HISTORY_SCAN';

export interface UnifiedRiskSignal {
  id: string;
  name: string;
  status: 'LOW' | 'MEDIUM' | 'HIGH';
  value: string;
  description: string;
  contributionPercent?: number; // 0 - 100 for visual progress bar
}

export interface UnifiedFlaggedReason {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UnifiedBehavioralRow {
  signal: string;
  currentValue: string;
  normalBehavior: string;
  difference: string;
  status: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UnifiedRiskResult {
  id: string;
  transactionId: string;
  source: AnalysisSource;
  timestamp: string;
  dateFormatted: string;
  timeFormatted: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  statusMessage: string;
  recipientName: string;
  recipientUpi: string;
  amount: number;
  category: string;
  recommendation: {
    title: string;
    supportingText: string;
    action?: 'PROCEED' | 'WARN_USER' | 'REQUIRE_2FA' | 'BLOCK';
  };
  confidence: {
    level: 'High' | 'Medium' | 'Low';
    description: string;
    scorePercent?: number;
  };
  signals: UnifiedRiskSignal[];
  flaggedReasons: UnifiedFlaggedReason[];
  comparisonRows: UnifiedBehavioralRow[];
}

export interface RiskFactor {
  id: string;
  name: string;
  category: 'RECIPIENT' | 'AMOUNT' | 'VELOCITY' | 'BEHAVIORAL' | 'NETWORK' | 'TIME';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scoreImpact: number;
  description: string;
  detectedValue?: string | number;
  expectedBaseline?: string | number;
}

export interface RiskAnalysisResult {
  id: string;
  transactionId?: string;
  referenceId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  primaryReason: string;
  summaryText: string;
  factors: RiskFactor[];
  recommendation: {
    action: 'PROCEED' | 'WARN_USER' | 'REQUIRE_2FA' | 'BLOCK';
    message: string;
    warningPoints: string[];
  };
  recipientDetails?: {
    upiId?: string;
    name: string;
    verifiedMerchant: boolean;
    trustScore: number;
    accountAgeDays?: number;
    flaggedReportsCount: number;
    priorInteractionsCount: number;
  };
  metrics: {
    amountDeviationPercent: number;
    noveltyScore: number;
    timeAnomalyDetected: boolean;
    velocityPerHour: number;
  };
}
