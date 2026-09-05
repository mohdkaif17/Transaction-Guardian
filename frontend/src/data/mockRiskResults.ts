import { UnifiedRiskResult } from '../types/risk';

export const unifiedMockResults: Record<string, UnifiedRiskResult> = {
  // 1. Example 2 / Default: New Transaction (HIGH RISK — 89)
  'new-demo-001': {
    id: 'new-demo-001',
    transactionId: 'TX-DEMO-001',
    source: 'NEW_TRANSACTION',
    timestamp: '2026-09-03T23:45:00.000Z',
    dateFormatted: 'Sep 03, 2026',
    timeFormatted: '11:45 PM',
    riskScore: 89,
    riskLevel: 'HIGH_RISK',
    statusMessage:
      'This transaction contains multiple signals that differ significantly from the user\'s normal transaction behavior.',
    recipientName: 'ABC Store',
    recipientUpi: 'abc123@upi',
    amount: 10000,
    category: 'Shopping',
    recommendation: {
      title: '⚠️ Verify the recipient before proceeding.',
      supportingText:
        'Review the recipient details and transaction amount before completing the payment.',
      action: 'WARN_USER',
    },
    confidence: {
      level: 'High',
      description:
        'Multiple transaction and behavioral signals contributed to this assessment.',
      scorePercent: 94,
    },
    signals: [
      {
        id: 'sig-amt',
        name: 'Amount Deviation',
        status: 'HIGH',
        value: '8× above historical average',
        description: 'Amount ₹10,000 departs substantially from typical spending range.',
        contributionPercent: 80,
      },
      {
        id: 'sig-recip',
        name: 'Recipient Novelty',
        status: 'HIGH',
        value: 'Recipient not previously seen',
        description: 'This recipient has not appeared in previous transaction history.',
        contributionPercent: 90,
      },
      {
        id: 'sig-time',
        name: 'Time Deviation',
        status: 'MEDIUM',
        value: 'Transaction outside normal activity hours',
        description: 'Initiated at 11:45 PM outside regular 9:00 AM – 10:00 PM baseline.',
        contributionPercent: 60,
      },
      {
        id: 'sig-freq',
        name: 'Transaction Frequency',
        status: 'MEDIUM',
        value: 'Higher transaction activity than usual',
        description: 'Elevated transaction frequency within the current 1-hour window.',
        contributionPercent: 60,
      },
      {
        id: 'sig-cat',
        name: 'Category Deviation',
        status: 'LOW',
        value: 'Category matches previous behavior',
        description: 'Shopping is a familiar transaction category in your baseline.',
        contributionPercent: 20,
      },
    ],
    flaggedReasons: [
      {
        id: 'f-1',
        title: 'Unusual transaction amount',
        description: '₹10,000 is significantly higher than the user\'s historical average of ₹1,250.',
        severity: 'HIGH',
      },
      {
        id: 'f-2',
        title: 'New recipient',
        description: 'This recipient has not appeared in the user\'s previous transaction history.',
        severity: 'HIGH',
      },
      {
        id: 'f-3',
        title: 'Unusual transaction time',
        description: 'The transaction occurred at 11:45 PM, outside the user\'s typical activity window.',
        severity: 'MEDIUM',
      },
      {
        id: 'f-4',
        title: 'Increased transaction activity',
        description: 'Transaction frequency is higher than the user\'s normal pattern.',
        severity: 'MEDIUM',
      },
    ],
    comparisonRows: [
      {
        signal: 'Amount',
        currentValue: '₹10,000',
        normalBehavior: '₹1,250 avg',
        difference: '8× higher',
        status: 'HIGH',
      },
      {
        signal: 'Recipient',
        currentValue: 'ABC Store',
        normalBehavior: 'Known recipients (25)',
        difference: 'New',
        status: 'HIGH',
      },
      {
        signal: 'Time',
        currentValue: '11:45 PM',
        normalBehavior: '9 AM – 10 PM',
        difference: 'Unusual',
        status: 'MEDIUM',
      },
      {
        signal: 'Category',
        currentValue: 'Shopping',
        normalBehavior: 'Shopping',
        difference: 'Normal',
        status: 'LOW',
      },
    ],
  },

  // 2. Example 1: QR / UPI Check (HIGH RISK — 86)
  'qr-demo-001': {
    id: 'qr-demo-001',
    transactionId: 'TX-QR-8821',
    source: 'QR_CHECK',
    timestamp: '2026-09-03T18:20:00.000Z',
    dateFormatted: 'Sep 03, 2026',
    timeFormatted: '06:20 PM',
    riskScore: 86,
    riskLevel: 'HIGH_RISK',
    statusMessage:
      'Multiple high-threat risk signals detected on payee virtual address prior to payment.',
    recipientName: 'Fast Customer Refund Desk',
    recipientUpi: 'customercare-refund-support@ybl',
    amount: 48000,
    category: 'Transfer',
    recommendation: {
      title: '⚠️ Verify the recipient before proceeding.',
      supportingText:
        'Payee VPA matches known crowd-reported scam patterns. Do not authorize with UPI PIN.',
      action: 'BLOCK',
    },
    confidence: {
      level: 'High',
      description:
        'Multiple threat database hits and baseline deviations contributed to this assessment.',
      scorePercent: 96,
    },
    signals: [
      {
        id: 'sig-recip',
        name: 'Recipient Novelty',
        status: 'HIGH',
        value: 'Unverified Flagged VPA',
        description: 'Address has multiple community fraud reports.',
        contributionPercent: 95,
      },
      {
        id: 'sig-amt',
        name: 'Amount Deviation',
        status: 'HIGH',
        value: 'Exceeds Historical Max',
        description: 'Amount ₹48,000 exceeds single transaction ceiling.',
        contributionPercent: 85,
      },
      {
        id: 'sig-freq',
        name: 'Transaction Frequency',
        status: 'HIGH',
        value: 'Burst transfer attempt',
        description: '3rd large attempt within 15 minutes.',
        contributionPercent: 75,
      },
      {
        id: 'sig-time',
        name: 'Time Deviation',
        status: 'LOW',
        value: 'Normal operating hours',
        description: 'Occurred during regular evening window.',
        contributionPercent: 20,
      },
      {
        id: 'sig-cat',
        name: 'Category Deviation',
        status: 'MEDIUM',
        value: 'Unusual Outflow Transfer',
        description: 'Category shift from retail to direct P2P transfer.',
        contributionPercent: 50,
      },
    ],
    flaggedReasons: [
      {
        id: 'qr-1',
        title: 'Flagged payee address',
        description: 'UPI ID has been reported for refund phishing.',
        severity: 'HIGH',
      },
      {
        id: 'qr-2',
        title: 'Historical ceiling breach',
        description: 'Amount ₹48,000 exceeds maximum recorded transfer.',
        severity: 'HIGH',
      },
    ],
    comparisonRows: [
      {
        signal: 'Amount',
        currentValue: '₹48,000',
        normalBehavior: '₹1,250 avg',
        difference: '38× higher',
        status: 'HIGH',
      },
      {
        signal: 'Recipient',
        currentValue: 'Support Refund Desk',
        normalBehavior: 'Verified Merchants',
        difference: 'Flagged VPA',
        status: 'HIGH',
      },
      {
        signal: 'Time',
        currentValue: '06:20 PM',
        normalBehavior: '9 AM – 10 PM',
        difference: 'Normal',
        status: 'LOW',
      },
      {
        signal: 'Category',
        currentValue: 'Transfer',
        normalBehavior: 'Shopping',
        difference: 'Category Shift',
        status: 'MEDIUM',
      },
    ],
  },

  // 3. Example 3: History Scan (HIGH RISK — 93)
  'TX004': {
    id: 'TX004',
    transactionId: 'TX004',
    source: 'HISTORY_SCAN',
    timestamp: '2026-09-01T23:15:00.000Z',
    dateFormatted: 'Sep 01, 2026',
    timeFormatted: '11:15 PM',
    riskScore: 93,
    riskLevel: 'HIGH_RISK',
    statusMessage:
      'Severe anomaly discovered in statement history with extreme amount spike and off-hours timing.',
    recipientName: 'Unknown UPI',
    recipientUpi: 'customercare-refund-support@ybl',
    amount: 25000,
    category: 'Transfer',
    recommendation: {
      title: '⚠️ Verify the recipient before proceeding.',
      supportingText:
        'Review the transaction and recipient details to confirm legitimacy.',
      action: 'WARN_USER',
    },
    confidence: {
      level: 'High',
      description:
        'Multiple transaction and behavioral signals contributed to this assessment.',
      scorePercent: 98,
    },
    signals: [
      {
        id: 'sig-amt',
        name: 'Amount Deviation',
        status: 'HIGH',
        value: '20× above average',
        description: '₹25,000 significantly exceeds standard spending.',
        contributionPercent: 92,
      },
      {
        id: 'sig-recip',
        name: 'Recipient Novelty',
        status: 'HIGH',
        value: 'New recipient',
        description: 'First appearance in historical dataset.',
        contributionPercent: 90,
      },
      {
        id: 'sig-time',
        name: 'Time Deviation',
        status: 'MEDIUM',
        value: '11:15 PM off-peak',
        description: 'Occurred outside standard active hours.',
        contributionPercent: 65,
      },
      {
        id: 'sig-freq',
        name: 'Transaction Frequency',
        status: 'HIGH',
        value: 'Rapid sequence',
        description: 'Multiple burst transactions in history.',
        contributionPercent: 80,
      },
      {
        id: 'sig-cat',
        name: 'Category Deviation',
        status: 'LOW',
        value: 'Transfer',
        description: 'Outflow category recorded.',
        contributionPercent: 25,
      },
    ],
    flaggedReasons: [
      {
        id: 'tx-1',
        title: 'Amount deviation',
        description: '₹25,000 is significantly higher than the user\'s normal transaction range.',
        severity: 'HIGH',
      },
      {
        id: 'tx-2',
        title: 'New recipient',
        description: 'The recipient has not appeared in previous transaction history.',
        severity: 'HIGH',
      },
      {
        id: 'tx-3',
        title: 'Unusual transaction time',
        description: 'The transaction occurred outside the user\'s typical activity period.',
        severity: 'MEDIUM',
      },
      {
        id: 'tx-4',
        title: 'Transaction velocity',
        description: 'Multiple transactions occurred within a short period.',
        severity: 'HIGH',
      },
    ],
    comparisonRows: [
      {
        signal: 'Amount',
        currentValue: '₹25,000',
        normalBehavior: '₹1,250 avg',
        difference: '20× higher',
        status: 'HIGH',
      },
      {
        signal: 'Recipient',
        currentValue: 'Unknown UPI',
        normalBehavior: 'Known contacts',
        difference: 'New',
        status: 'HIGH',
      },
      {
        signal: 'Time',
        currentValue: '11:15 PM',
        normalBehavior: '9 AM – 10 PM',
        difference: 'Unusual',
        status: 'MEDIUM',
      },
      {
        signal: 'Category',
        currentValue: 'Transfer',
        normalBehavior: 'Shopping',
        difference: 'Category Shift',
        status: 'MEDIUM',
      },
    ],
  },

  // 4. SAFE Example (SAFE — 18)
  'safe-demo-001': {
    id: 'safe-demo-001',
    transactionId: 'TX001',
    source: 'NEW_TRANSACTION',
    timestamp: '2026-09-02T19:45:00.000Z',
    dateFormatted: 'Sep 02, 2026',
    timeFormatted: '07:45 PM',
    riskScore: 18,
    riskLevel: 'SAFE',
    statusMessage:
      'This transaction appears consistent with the available transaction and behavioral signals.',
    recipientName: 'Swiggy',
    recipientUpi: 'swiggy@icici',
    amount: 540,
    category: 'Food',
    recommendation: {
      title: 'You can proceed, while continuing to verify payment details.',
      supportingText:
        'Transaction aligns with your regular dining expenditure and verified merchant history.',
      action: 'PROCEED',
    },
    confidence: {
      level: 'High',
      description:
        'Strong alignment with 28-month behavioral baseline profile.',
      scorePercent: 96,
    },
    signals: [
      {
        id: 'sig-amt',
        name: 'Amount Deviation',
        status: 'LOW',
        value: 'Within normal range',
        description: '₹540 conforms to regular median food expenses.',
        contributionPercent: 12,
      },
      {
        id: 'sig-recip',
        name: 'Recipient Novelty',
        status: 'LOW',
        value: 'Known frequent merchant',
        description: '32 prior successful orders recorded.',
        contributionPercent: 8,
      },
      {
        id: 'sig-time',
        name: 'Time Deviation',
        status: 'LOW',
        value: 'Peak evening hours',
        description: 'Regular dinner ordering window.',
        contributionPercent: 10,
      },
      {
        id: 'sig-freq',
        name: 'Transaction Frequency',
        status: 'LOW',
        value: 'Normal velocity',
        description: 'Single isolated daily order.',
        contributionPercent: 5,
      },
      {
        id: 'sig-cat',
        name: 'Category Deviation',
        status: 'LOW',
        value: 'Frequent Category (Food)',
        description: 'Frequent category in user spending profile.',
        contributionPercent: 10,
      },
    ],
    flaggedReasons: [
      {
        id: 'safe-1',
        title: 'Established merchant history',
        description: 'Payee has consistent historical trust score.',
        severity: 'LOW',
      },
    ],
    comparisonRows: [
      {
        signal: 'Amount',
        currentValue: '₹540',
        normalBehavior: '₹1,250 avg',
        difference: 'Within baseline',
        status: 'LOW',
      },
      {
        signal: 'Recipient',
        currentValue: 'Swiggy',
        normalBehavior: 'Known merchants',
        difference: 'Verified',
        status: 'LOW',
      },
      {
        signal: 'Time',
        currentValue: '07:45 PM',
        normalBehavior: '9 AM – 10 PM',
        difference: 'Normal',
        status: 'LOW',
      },
      {
        signal: 'Category',
        currentValue: 'Food',
        normalBehavior: 'Food (38%)',
        difference: 'Normal',
        status: 'LOW',
      },
    ],
  },

  // 5. REVIEW Example (REVIEW — 58)
  'review-demo-001': {
    id: 'review-demo-001',
    transactionId: 'TX005',
    source: 'NEW_TRANSACTION',
    timestamp: '2026-08-31T16:20:00.000Z',
    dateFormatted: 'Aug 31, 2026',
    timeFormatted: '04:20 PM',
    riskScore: 58,
    riskLevel: 'REVIEW',
    statusMessage: 'Some transaction characteristics differ from normal behavior.',
    recipientName: 'New Merchant',
    recipientUpi: 'electronics-direct@okaxis',
    amount: 7800,
    category: 'Shopping',
    recommendation: {
      title: 'Review the transaction details before proceeding.',
      supportingText:
        'Verify the payee identity and invoice before entering your authorization code.',
      action: 'REQUIRE_2FA',
    },
    confidence: {
      level: 'Medium',
      description:
        'Novel payee and elevated volume warrant user confirmation.',
      scorePercent: 82,
    },
    signals: [
      {
        id: 'sig-amt',
        name: 'Amount Deviation',
        status: 'MEDIUM',
        value: '6.2× above shopping avg',
        description: 'Amount ₹7,800 is higher than median retail purchases.',
        contributionPercent: 55,
      },
      {
        id: 'sig-recip',
        name: 'Recipient Novelty',
        status: 'HIGH',
        value: 'First interaction',
        description: 'Unseen merchant in transaction history.',
        contributionPercent: 70,
      },
      {
        id: 'sig-time',
        name: 'Time Deviation',
        status: 'LOW',
        value: 'Normal afternoon window',
        description: 'Initiated at 04:20 PM.',
        contributionPercent: 15,
      },
      {
        id: 'sig-freq',
        name: 'Transaction Frequency',
        status: 'LOW',
        value: 'Standard pace',
        description: 'No velocity anomalies detected.',
        contributionPercent: 20,
      },
      {
        id: 'sig-cat',
        name: 'Category Deviation',
        status: 'LOW',
        value: 'Shopping',
        description: 'Recognized category.',
        contributionPercent: 15,
      },
    ],
    flaggedReasons: [
      {
        id: 'rev-1',
        title: 'Elevated amount variance',
        description: 'Amount is 6.2× higher than average shopping transaction.',
        severity: 'MEDIUM',
      },
      {
        id: 'rev-2',
        title: 'Novel payee account',
        description: 'First-time interaction with this merchant address.',
        severity: 'HIGH',
      },
    ],
    comparisonRows: [
      {
        signal: 'Amount',
        currentValue: '₹7,800',
        normalBehavior: '₹1,250 avg',
        difference: '6.2× higher',
        status: 'MEDIUM',
      },
      {
        signal: 'Recipient',
        currentValue: 'New Merchant',
        normalBehavior: 'Known contacts',
        difference: 'New',
        status: 'HIGH',
      },
      {
        signal: 'Time',
        currentValue: '04:20 PM',
        normalBehavior: '9 AM – 10 PM',
        difference: 'Normal',
        status: 'LOW',
      },
      {
        signal: 'Category',
        currentValue: 'Shopping',
        normalBehavior: 'Shopping',
        difference: 'Normal',
        status: 'LOW',
      },
    ],
  },
};

// Aliases and fallbacks for common routes
unifiedMockResults['TX-DEMO-001'] = unifiedMockResults['new-demo-001'];
unifiedMockResults['TX001'] = unifiedMockResults['safe-demo-001'];
unifiedMockResults['TX002'] = unifiedMockResults['safe-demo-001'];
unifiedMockResults['TX003'] = unifiedMockResults['safe-demo-001'];
unifiedMockResults['TX005'] = unifiedMockResults['review-demo-001'];
unifiedMockResults['TXN-HIGH-03'] = unifiedMockResults['qr-demo-001'];
unifiedMockResults['TXN-SAFE-01'] = unifiedMockResults['safe-demo-001'];
unifiedMockResults['TXN-REVIEW-02'] = unifiedMockResults['review-demo-001'];

export function getUnifiedResultById(id: string): UnifiedRiskResult {
  if (unifiedMockResults[id]) {
    return unifiedMockResults[id];
  }

  // If query contains 'safe', return safe result
  if (id.toLowerCase().includes('safe')) {
    return { ...unifiedMockResults['safe-demo-001'], id, transactionId: id };
  }

  // If query contains 'review', return review result
  if (id.toLowerCase().includes('review') || id.toLowerCase().includes('005')) {
    return { ...unifiedMockResults['review-demo-001'], id, transactionId: id };
  }

  // Default fallback to 89 High Risk spec
  return {
    ...unifiedMockResults['new-demo-001'],
    id,
    transactionId: id.startsWith('TX') ? id : `TX-${id}`,
  };
}
