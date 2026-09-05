import { RiskLevel, RiskAnalysisResult } from './risk';

export type TransactionCategory =
  | 'GROCERIES'
  | 'UTILITIES'
  | 'ENTERTAINMENT'
  | 'ELECTRONICS'
  | 'P2P_TRANSFER'
  | 'INVESTMENT'
  | 'TRAVEL'
  | 'LUXURY'
  | 'Shopping'
  | 'Food'
  | 'Transport'
  | 'Bills'
  | 'Transfer'
  | 'Education'
  | 'Healthcare'
  | 'OTHER';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'QR_CODE';

export interface HistoryTransaction {
  id: string; // e.g. "TX001"
  date: string; // e.g. "Sep 02, 2026"
  timestamp?: string;
  recipient: string; // e.g. "Swiggy"
  recipientUpi?: string; // e.g. "swiggy@icici"
  amount: number; // e.g. 540
  category: string; // e.g. "Food"
  riskScore: number; // e.g. 18
  riskLevel: RiskLevel; // 'SAFE' | 'REVIEW' | 'HIGH_RISK'
  paymentMethod?: string;
  flaggedReasons?: string[];
  recommendation?: string;
  signals?: {
    amountDeviation: 'LOW' | 'MEDIUM' | 'HIGH';
    recipientNovelty: 'LOW' | 'MEDIUM' | 'HIGH';
    timeDeviation: 'LOW' | 'MEDIUM' | 'HIGH';
    frequencyAnomaly: 'LOW' | 'MEDIUM' | 'HIGH';
    categoryDeviation: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  detailsText?: {
    amountExplanation?: string;
    recipientExplanation?: string;
    timeExplanation?: string;
    velocityExplanation?: string;
  };
}

export interface Transaction {
  id: string;
  referenceNo: string;
  timestamp: string;
  amount: number;
  currency: string;
  recipientName: string;
  recipientUpi?: string;
  recipientAccount?: string;
  category: string;
  paymentMethod: PaymentMethod;
  status: 'COMPLETED' | 'PENDING' | 'BLOCKED' | 'FLAGGED';
  riskLevel: RiskLevel;
  riskScore: number;
  riskResult?: RiskAnalysisResult;
  notes?: string;
  location?: string;
  device?: string;
}

export interface QrScanData {
  rawPayload: string;
  upiId: string;
  recipientName: string;
  amount?: number;
  currency?: string;
  merchantCategoryCode?: string;
  transactionRef?: string;
}

export interface BatchScanSummary {
  batchId: string;
  fileName: string;
  uploadedAt: string;
  totalTransactions: number;
  safeCount: number;
  reviewCount: number;
  highRiskCount: number;
  totalVolume: number;
  flaggedVolume: number;
  transactions: Transaction[];
}
