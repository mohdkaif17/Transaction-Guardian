export interface UserBehavioralBaseline {
  userId: string;
  userEmail: string;
  userName: string;
  accountAgeMonths: number;
  averageMonthlyVolume: number;
  averageTransactionAmount: number;
  medianTransactionAmount: number;
  maxHistoricalAmount: number;
  commonCategories: {
    category: string;
    percentage: number;
    avgAmount: number;
  }[];
  peakActivityHours: {
    startHour: number;
    endHour: number;
    timeZone: string;
  };
  knownRecipientsCount: number;
  frequentUpiDomains: string[];
  riskProfileStatus: 'NORMAL' | 'ELEVATED_VIGILANCE' | 'RESTRICTED';
  lastBaselineUpdate: string;
}

export interface BehavioralAnomalyCheck {
  amountZScore: number;
  isAmountOutlier: boolean;
  isNewRecipient: boolean;
  isUnusualTime: boolean;
  isCategoryShift: boolean;
  velocityExceeded: boolean;
  overallAnomalyScore: number; // 0 - 100
}
