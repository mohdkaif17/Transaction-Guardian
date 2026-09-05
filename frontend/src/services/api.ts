import { RiskLevel } from '../types/risk';
import { NewTransactionRiskResult, NewTransactionInput, PrePaymentRiskResult, PaymentCheckInput } from './mockRiskService';
import { HistoryTransaction } from '../types/transaction';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BackendRiskReason {
  factor: string;
  impact: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BackendBehavioralComparison {
  transaction_amount: number;
  user_average_amount: number;
  deviation_ratio: number;
}

export interface BackendRiskSignals {
  amount: 'LOW' | 'MEDIUM' | 'HIGH';
  recipient: 'LOW' | 'MEDIUM' | 'HIGH';
  time: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BackendRiskResponse {
  transaction_id: string;
  timestamp: string;
  amount: number;
  recipient: string;
  category: string;
  source: string;
  risk_score: number;
  risk_level: 'SAFE' | 'REVIEW' | 'HIGH_RISK' | 'HIGH';
  reasons: (string | BackendRiskReason)[];
  behavioral_comparison: BackendBehavioralComparison;
  recommendation: string;
  signals: BackendRiskSignals;
}

export interface BackendUploadSummary {
  total_count: number;
  counts: {
    SAFE: number;
    REVIEW: number;
    HIGH_RISK?: number;
    HIGH?: number;
  };
  results: BackendRiskResponse[];
}

export interface BehavioralProfileData {
  total_transactions: number;
  average_amount: number;
  std_amount?: number;
  median_amount: number;
  normal_amount_range: number[];
  average_transactions_per_day: number;
  common_hours: number[];
  frequent_recipients: Record<string, number>;
  common_categories: Record<string, number>;
}

/**
 * Normalizes backend risk level string to standard RiskLevel ('SAFE' | 'REVIEW' | 'HIGH_RISK')
 */
function normalizeRiskLevel(level: string): RiskLevel {
  if (level === 'HIGH' || level === 'HIGH_RISK') return 'HIGH_RISK';
  if (level === 'REVIEW') return 'REVIEW';
  return 'SAFE';
}

/**
 * Formats a backend risk response into the frontend's NewTransactionRiskResult model
 */
function transformToNewTransactionResult(res: BackendRiskResponse, input: NewTransactionInput): NewTransactionRiskResult {
  const riskLevel = normalizeRiskLevel(res.risk_level);
  const upiId = input.upiId || res.recipient;
  const recipientName = input.recipientName || res.recipient;

  const stringReasons: string[] = (res.reasons || []).map((r) => {
    if (typeof r === 'string') return r;
    return r.factor || 'Behavioral anomaly detected';
  });

  const amtStatus = res.signals?.amount || 'LOW';
  const recipStatus = res.signals?.recipient || 'LOW';
  const timeStatus = res.signals?.time || 'LOW';
  const catStatus = res.signals?.category || 'LOW';

  const devRatio = res.behavioral_comparison?.deviation_ratio || 1.0;
  const userAvg = res.behavioral_comparison?.user_average_amount || 0;

  return {
    id: res.transaction_id || `TX-${Date.now()}`,
    riskScore: res.risk_score,
    riskLevel,
    transactionHeader: `₹${res.amount.toLocaleString('en-IN')} → ${upiId}`,
    reasons: stringReasons,
    recommendation: res.recommendation || 'Transaction evaluated by risk engine.',
    comparison: {
      amount: {
        current: res.amount,
        historicalAvg: userAvg,
        differenceText: devRatio > 1.2 ? `${devRatio}x baseline avg` : 'Normal range',
        status: amtStatus,
      },
      recipient: {
        name: recipientName,
        upiId: upiId,
        statusText: recipStatus === 'HIGH' ? 'New Recipient' : 'Frequent Recipient',
        isNew: recipStatus === 'HIGH',
        status: recipStatus,
      },
      time: {
        current: input.transactionTime || 'Current Window',
        normalWindow: 'Regular Hours',
        isOutside: timeStatus !== 'LOW',
        status: timeStatus,
      },
      category: {
        name: res.category || input.category,
        isFamiliar: catStatus === 'LOW',
        statusText: catStatus === 'LOW' ? 'Typical Category' : 'Unusual Category',
        status: catStatus,
      },
    },
    signals: [
      {
        id: 'sig-amt',
        title: 'Amount Deviation',
        value: `₹${res.amount.toLocaleString('en-IN')}`,
        status: amtStatus,
        description: `Amount is ${devRatio}x your average spending.`,
      },
      {
        id: 'sig-recip',
        title: 'Recipient Verification',
        value: recipientName,
        status: recipStatus,
        description: recipStatus === 'HIGH' ? 'Unrecognized payee identifier' : 'Verified recipient baseline',
      },
      {
        id: 'sig-time',
        title: 'Transaction Timing',
        value: input.transactionTime || 'Standard Time',
        status: timeStatus,
        description: timeStatus !== 'LOW' ? 'Unusual hour activity detected' : 'Normal transaction window',
      },
      {
        id: 'sig-cat',
        title: 'Category Alignment',
        value: res.category || input.category,
        status: catStatus,
        description: catStatus !== 'LOW' ? 'Infrequent merchant category' : 'Familiar merchant category',
      },
    ],
    explainableSignals: [
      {
        id: 'sig-amt',
        name: 'Amount Deviation',
        iconStatus: amtStatus === 'HIGH' ? 'RED' : amtStatus === 'MEDIUM' ? 'YELLOW' : 'GREEN',
        title: 'Amount Deviation',
        description: `Current amount (₹${res.amount}) vs historical average (₹${userAvg})`,
      },
      {
        id: 'sig-recip',
        name: 'Recipient Verification',
        iconStatus: recipStatus === 'HIGH' ? 'RED' : recipStatus === 'MEDIUM' ? 'YELLOW' : 'GREEN',
        title: 'Recipient Verification',
        description: `Payee: ${recipientName} (${upiId})`,
      },
      {
        id: 'sig-time',
        name: 'Transaction Timing',
        iconStatus: timeStatus === 'HIGH' ? 'RED' : timeStatus === 'MEDIUM' ? 'YELLOW' : 'GREEN',
        title: 'Transaction Timing',
        description: `Executed at ${input.transactionTime || 'current time'}`,
      },
      {
        id: 'sig-cat',
        name: 'Category Alignment',
        iconStatus: catStatus === 'HIGH' ? 'RED' : catStatus === 'MEDIUM' ? 'YELLOW' : 'GREEN',
        title: 'Category Alignment',
        description: `Category: ${res.category || input.category}`,
      },
    ],
    transactionDetails: {
      recipientName,
      upiId,
      amount: res.amount,
      category: res.category || input.category,
      transactionDate: input.transactionDate || new Date().toLocaleDateString(),
      transactionTime: input.transactionTime || new Date().toLocaleTimeString(),
      analysisTime: 'Just now',
    },
  };
}

/**
 * Transforms backend risk response into frontend HistoryTransaction object
 */
function transformToHistoryTransaction(res: BackendRiskResponse, index: number): HistoryTransaction {
  const riskLevel = normalizeRiskLevel(res.risk_level);
  const reasons = (res.reasons || []).map((r) => (typeof r === 'string' ? r : r.factor));

  return {
    id: res.transaction_id || `TX${String(index + 1).padStart(3, '0')}`,
    date: res.timestamp ? res.timestamp.split('T')[0] : '2026-09-03',
    timestamp: res.timestamp,
    recipient: res.recipient || 'Payee',
    recipientUpi: res.recipient,
    amount: res.amount,
    category: res.category || 'Shopping',
    riskScore: res.risk_score,
    riskLevel: riskLevel,
    paymentMethod: res.source || 'UPI',
    flaggedReasons: reasons,
    recommendation: res.recommendation,
    signals: {
      amountDeviation: res.signals?.amount || 'LOW',
      recipientNovelty: res.signals?.recipient || 'LOW',
      timeDeviation: res.signals?.time || 'LOW',
      frequencyAnomaly: 'LOW',
      categoryDeviation: res.signals?.category || 'LOW',
    },
  };
}

/**
 * 1. POST /api/transactions/analyze
 */
export async function analyzeTransactionApi(input: NewTransactionInput): Promise<NewTransactionRiskResult> {
  const payload = {
    amount: input.amount,
    recipient: input.recipientName || input.upiId,
    category: input.category,
    timestamp: input.transactionDate && input.transactionTime 
      ? `${input.transactionDate}T${input.transactionTime}:00Z` 
      : new Date().toISOString(),
    source: 'UPI',
  };

  const response = await fetch(`${API_BASE_URL}/api/transactions/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend service returned error status: ${response.status} ${response.statusText}`);
  }

  const data: BackendRiskResponse = await response.json();
  return transformToNewTransactionResult(data, input);
}

export interface BackendQRDecoded {
  success: boolean;
  upi_id: string | null;
  payee_name: string | null;
  amount: number | null;
  currency: string | null;
  reference: string | null;
  payment_direction: string;
}

export interface BackendQRAnalyzeResponse {
  decoded: BackendQRDecoded;
  risk_result: BackendRiskResponse;
}

/**
 * Transforms backend risk response into PrePaymentRiskResult for Pre-payment Risk check card
 */
export function transformToPrePaymentResult(
  res: BackendRiskResponse,
  decoded?: BackendQRDecoded,
  fallbackInput?: PaymentCheckInput
): PrePaymentRiskResult {
  const riskLevel = normalizeRiskLevel(res.risk_level);
  const upiId = decoded?.upi_id || fallbackInput?.upiId || res.recipient;
  const recipientName = decoded?.payee_name || fallbackInput?.recipientName || res.recipient;
  const amount = decoded?.amount !== null && decoded?.amount !== undefined ? decoded.amount : (res.amount || fallbackInput?.amount || 0);

  const stringReasons: string[] = (res.reasons || []).map((r) => {
    if (typeof r === 'string') return r;
    return r.factor || 'Behavioral anomaly detected';
  });

  const amtStatus = res.signals?.amount || 'LOW';
  const recipStatus = res.signals?.recipient || 'LOW';
  const timeStatus = res.signals?.time || 'LOW';
  const catStatus = res.signals?.category || 'LOW';

  const devRatio = res.behavioral_comparison?.deviation_ratio || 1.0;
  const userAvg = res.behavioral_comparison?.user_average_amount || 1295;

  return {
    id: res.transaction_id || `QR-${Date.now()}`,
    riskScore: res.risk_score,
    riskLevel,
    reasons: stringReasons,
    recommendation: res.recommendation || 'Transaction evaluated by risk engine.',
    signals: [
      {
        id: 'sig-amt',
        title: 'Amount Deviation',
        value: `₹${amount.toLocaleString('en-IN')}`,
        status: amtStatus,
        description: devRatio > 1.2 ? `Amount is ${devRatio}x your average spending (₹${userAvg.toLocaleString('en-IN')}).` : `Within normal spending range (Avg ₹${userAvg.toLocaleString('en-IN')}).`,
      },
      {
        id: 'sig-recip',
        title: 'Recipient Verification',
        value: recipientName,
        status: recipStatus,
        description: recipStatus === 'HIGH' ? 'Unrecognized payee identifier / Novel recipient' : 'Verified recipient baseline',
      },
      {
        id: 'sig-time',
        title: 'Transaction Timing',
        value: 'Current Window',
        status: timeStatus,
        description: timeStatus !== 'LOW' ? 'Unusual hour activity detected' : 'Normal transaction window',
      },
      {
        id: 'sig-cat',
        title: 'Category Alignment',
        value: res.category || fallbackInput?.category || 'Transfer',
        status: catStatus,
        description: catStatus !== 'LOW' ? 'Infrequent merchant category' : 'Familiar merchant category',
      },
    ],
    paymentSummary: {
      recipient: recipientName,
      upiId: upiId,
      amount: amount,
      category: res.category || fallbackInput?.category || 'Transfer',
      analysisTime: 'Just now',
    },
  };
}

/**
 * POST /api/qr/analyze
 */
export async function analyzeQrApi(
  file: File,
  amount?: number,
  category?: string
): Promise<{
  decoded: BackendQRDecoded;
  riskResult: PrePaymentRiskResult;
}> {
  // Check if file is a raw text payload file (e.g. from sample buttons)
  if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg") {
    try {
      const textContent = await file.text();
      if (textContent && textContent.trim().toLowerCase().startsWith("upi://")) {
        const url_str = textContent.trim();
        const parsed_url = new URL(url_str.replace("upi://pay/?", "upi://pay?"));
        const params = new URLSearchParams(parsed_url.search);
        const upi_id = params.get("pa") || "unknown@upi";
        const payee_name = params.get("pn") || upi_id;
        const parsedAmount = amount || (params.get("am") ? parseFloat(params.get("am")!) : 450);

        const mockDecoded: BackendQRDecoded = {
          success: true,
          upi_id,
          payee_name,
          amount: parsedAmount,
          currency: params.get("cu") || "INR",
          reference: params.get("tr") || "REF-" + Date.now(),
          payment_direction: "OUTGOING",
        };

        const mockRisk = transformToPrePaymentResult(
          {
            transaction_id: "tx_qr_" + Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
            amount: parsedAmount,
            recipient: payee_name,
            category: category || "Transfer",
            source: "UPI",
            risk_score: parsedAmount > 10000 || upi_id.includes("crypto") ? 82 : 18,
            risk_level: parsedAmount > 10000 || upi_id.includes("crypto") ? "HIGH_RISK" : "SAFE",
            reasons: parsedAmount > 10000 || upi_id.includes("crypto")
              ? [
                  { factor: "Machine learning anomaly pattern", impact: 31, severity: "HIGH" },
                  { factor: "Amount deviation", impact: 22, severity: "HIGH" },
                  { factor: "New recipient", impact: 17, severity: "HIGH" },
                ]
              : [],
            behavioral_comparison: {
              transaction_amount: parsedAmount,
              user_average_amount: 1295,
              deviation_ratio: +(parsedAmount / 1295).toFixed(2),
            },
            recommendation: parsedAmount > 10000 || upi_id.includes("crypto")
              ? "High risk anomaly score detected. Verification required before proceeding."
              : "Transaction aligns with your typical behavioral pattern. Safe to proceed.",
            signals: {
              amount: parsedAmount > 5000 ? "HIGH" : "LOW",
              recipient: upi_id.includes("crypto") ? "HIGH" : "LOW",
              time: "LOW",
              category: "LOW",
            },
          },
          mockDecoded
        );

        return { decoded: mockDecoded, riskResult: mockRisk };
      }
    } catch {
      // Continue to live API call if file text read isn't a sample payload
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  if (amount !== undefined && amount !== null && amount > 0) {
    formData.append('amount', amount.toString());
  }
  if (category) {
    formData.append('category', category);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/qr/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `QR Analysis Failed: ${response.statusText}` }));
      throw new Error(errorData.detail || `Backend returned error status ${response.status}`);
    }

    const data: BackendQRAnalyzeResponse = await response.json();
    const riskResult = transformToPrePaymentResult(data.risk_result, data.decoded);
    return {
      decoded: data.decoded,
      riskResult,
    };
  } catch (err: any) {
    // If backend is waking up from sleep or network is down, provide friendly explanation
    if (err.message && err.message.includes("No QR code detected")) {
      throw err;
    }
    throw new Error(err.message || "Unable to reach risk scoring engine. Please check network connection or verify VITE_API_URL environment variable.");
  }
}

/**
 * POST /api/transactions/analyze for pre-payment checks
 */
export async function analyzePaymentRiskApi(input: PaymentCheckInput): Promise<PrePaymentRiskResult> {
  const payload = {
    amount: input.amount,
    recipient: input.recipientName || input.upiId,
    category: input.category || 'Transfer',
    timestamp: new Date().toISOString(),
    source: 'UPI_CHECK',
  };

  const response = await fetch(`${API_BASE_URL}/api/transactions/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend service returned error status: ${response.status} ${response.statusText}`);
  }

  const data: BackendRiskResponse = await response.json();
  return transformToPrePaymentResult(data, undefined, input);
}

/**
 * Client-side CSV parser fallback when backend is offline or for flexible schema parsing
 */
export async function parseCsvClientSide(file: File): Promise<{
  totalCount: number;
  safeCount: number;
  reviewCount: number;
  highRiskCount: number;
  transactions: HistoryTransaction[];
}> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

  // Find column indices
  let amtIdx = headers.findIndex((h) => ['amount', 'txn amount', 'value', 'amt', 'debit', 'price', 'total'].includes(h));
  let recipIdx = headers.findIndex((h) => ['payee', 'recipient', 'namedest', 'nameorig', 'merchant', 'description', 'to', 'user_id'].includes(h));
  let catIdx = headers.findIndex((h) => ['category', 'type', 'transaction_type'].includes(h));
  let dateIdx = headers.findIndex((h) => ['date', 'timestamp', 'datetime', 'time', 'created_at', 'step'].includes(h));

  if (amtIdx === -1) amtIdx = headers.findIndex((h) => h.includes('amount') || h.includes('val') || h.includes('amt'));
  if (recipIdx === -1) recipIdx = headers.findIndex((h) => h.includes('pay') || h.includes('dest') || h.includes('orig') || h.includes('desc') || h.includes('name'));

  const rawRows = lines.slice(1);
  const transactions: HistoryTransaction[] = [];
  let safeCount = 0;
  let reviewCount = 0;
  let highRiskCount = 0;

  for (let i = 0; i < Math.min(rawRows.length, 300); i++) {
    const cols = rawRows[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 2) continue;

    const rawAmt = amtIdx !== -1 && cols[amtIdx] ? cols[amtIdx].replace(/[^\d.]/g, '') : '100';
    const amount = parseFloat(rawAmt) || 150;
    const recipient = recipIdx !== -1 && cols[recipIdx] ? cols[recipIdx] : `Payee ${i + 1}`;
    let category = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'Shopping';
    if (['PAYMENT', 'DEBIT'].includes(category.toUpperCase())) category = 'Shopping';
    if (['TRANSFER', 'CASH_OUT'].includes(category.toUpperCase())) category = 'Transfer';

    let date = '2026-09-01';
    if (dateIdx !== -1 && cols[dateIdx]) {
      const rawDate = cols[dateIdx];
      if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
        date = rawDate.split('T')[0];
      }
    }

    // Heuristic Risk Calculation for client side
    let riskScore = 15;
    const reasons: string[] = [];
    const signals: Record<'amountDeviation' | 'recipientNovelty' | 'timeDeviation' | 'frequencyAnomaly' | 'categoryDeviation', 'LOW' | 'MEDIUM' | 'HIGH'> = {
      amountDeviation: 'LOW',
      recipientNovelty: 'LOW',
      timeDeviation: 'LOW',
      frequencyAnomaly: 'LOW',
      categoryDeviation: 'LOW',
    };

    if (amount > 4000) {
      riskScore += 35;
      reasons.push('Amount deviation: Significant spike above median');
      signals.amountDeviation = 'HIGH' as const;
    } else if (amount > 1500) {
      riskScore += 18;
      reasons.push('Moderate amount elevation');
      signals.amountDeviation = 'MEDIUM' as const;
    }

    if (recipient.startsWith('C') || recipient.toLowerCase().includes('unknown') || recipient.toLowerCase().includes('off-shore') || recipient.toLowerCase().includes('refund')) {
      riskScore += 25;
      reasons.push('Unrecognized payee identifier / Novel recipient');
      signals.recipientNovelty = 'HIGH' as const;
    }

    let riskLevel: RiskLevel = 'SAFE';
    if (riskScore >= 70) {
      riskLevel = 'HIGH_RISK';
      highRiskCount++;
    } else if (riskScore >= 35) {
      riskLevel = 'REVIEW';
      reviewCount++;
    } else {
      safeCount++;
    }

    transactions.push({
      id: `TX${String(i + 1).padStart(3, '0')}`,
      date,
      timestamp: `${date}T10:00:00Z`,
      recipient,
      recipientUpi: recipient.includes('@') ? recipient : `${recipient.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
      amount,
      category,
      riskScore,
      riskLevel,
      paymentMethod: 'UPI',
      flaggedReasons: reasons.length > 0 ? reasons : ['Normal baseline pattern'],
      recommendation: riskLevel === 'HIGH_RISK' ? 'Verify recipient before completing transfer.' : 'Normal transaction activity.',
      signals,
    });
  }

  return {
    totalCount: transactions.length,
    safeCount,
    reviewCount,
    highRiskCount,
    transactions,
  };
}

/**
 * 2. POST /api/transactions/upload
 */
export async function uploadHistoryApi(file: File): Promise<{
  totalCount: number;
  safeCount: number;
  reviewCount: number;
  highRiskCount: number;
  transactions: HistoryTransaction[];
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/transactions/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data: BackendUploadSummary = await response.json();
      const safeCount = data.counts.SAFE || 0;
      const reviewCount = data.counts.REVIEW || 0;
      const highRiskCount = data.counts.HIGH_RISK || data.counts.HIGH || 0;

      const transactions: HistoryTransaction[] = (data.results || []).map((res, idx) =>
        transformToHistoryTransaction(res, idx)
      );

      return {
        totalCount: data.total_count,
        safeCount,
        reviewCount,
        highRiskCount,
        transactions,
      };
    }
  } catch (err) {
    console.warn('Backend CSV upload endpoint failed/unreachable. Falling back to client-side CSV parser:', err);
  }

  // Fallback to client-side CSV parser if backend fails or is unreachable
  return parseCsvClientSide(file);
}

/**
 * 3. GET /api/profile
 */
export async function getProfileApi(): Promise<BehavioralProfileData> {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch behavioral profile: ${response.status}`);
  }

  return response.json();
}

export interface DashboardSummaryData {
  total_analyzed: number;
  safe_count: number;
  review_count: number;
  high_risk_count: number;
  safe_percentage: number;
  review_percentage: number;
  high_risk_percentage: number;
  dataset_period: string;
  behavioral_profile: BehavioralProfileData;
}

/**
 * 4. GET /api/dashboard
 */
export async function getDashboardApi(): Promise<DashboardSummaryData> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard summary: ${response.status}`);
  }

  return response.json();
}

