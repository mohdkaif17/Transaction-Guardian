import { UserBehavioralBaseline } from '../types/baseline';

export const mockBaselineData: UserBehavioralBaseline = {
  userId: 'USR-94821',
  userEmail: 'alex.vance@fintech-corp.internal',
  userName: 'Alex Vance',
  accountAgeMonths: 28,
  averageMonthlyVolume: 84500,
  averageTransactionAmount: 1450,
  medianTransactionAmount: 620,
  maxHistoricalAmount: 35000,
  commonCategories: [
    { category: 'GROCERIES', percentage: 38, avgAmount: 850 },
    { category: 'UTILITIES', percentage: 22, avgAmount: 2200 },
    { category: 'ENTERTAINMENT', percentage: 18, avgAmount: 1100 },
    { category: 'TRAVEL', percentage: 12, avgAmount: 3400 },
    { category: 'OTHER', percentage: 10, avgAmount: 750 },
  ],
  peakActivityHours: {
    startHour: 9,
    endHour: 22,
    timeZone: 'Asia/Kolkata (IST)',
  },
  knownRecipientsCount: 42,
  frequentUpiDomains: ['oksbi', 'okhdfcbank', 'okaxis', 'paytm'],
  riskProfileStatus: 'NORMAL',
  lastBaselineUpdate: new Date(Date.now() - 3600000 * 12).toISOString(),
};
