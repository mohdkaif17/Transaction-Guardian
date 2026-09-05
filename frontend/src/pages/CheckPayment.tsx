import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  AtSign,
  Lock,
  Activity,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Info,
  Shield,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { PaymentMethodSelector, PaymentInputMode } from '../components/payment/PaymentMethodSelector';
import { UPIForm } from '../components/payment/UPIForm';
import { QRUpload } from '../components/payment/QRUpload';
import { RiskAnalysisCard } from '../components/payment/RiskAnalysisCard';
import {
  analyzePaymentRisk,
  PaymentCheckInput,
  PrePaymentRiskResult,
} from '../services/mockRiskService';
import { getProfileApi, analyzePaymentRiskApi, BehavioralProfileData } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const CheckPayment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMode, setSelectedMode] = useState<PaymentInputMode>('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PrePaymentRiskResult | null>(null);
  const [profile, setProfile] = useState<BehavioralProfileData | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'qr' || mode === 'upi') {
      setSelectedMode(mode);
    }
  }, [searchParams]);

  useEffect(() => {
    getProfileApi()
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile for CheckPayment:', err));
  }, []);

  const [formValues, setFormValues] = useState<Partial<PaymentCheckInput>>({
    upiId: 'abc123@upi',
    recipientName: 'ABC Store',
    amount: 10000,
    category: 'Shopping',
  });

  const minAmt = profile?.normal_amount_range ? profile.normal_amount_range[0] : 30.1;
  const maxAmt = profile?.normal_amount_range ? profile.normal_amount_range[1] : 3750;
  const peakHoursStr = profile?.common_hours ? profile.common_hours.map(h => `${String(h).padStart(2, '0')}:00`).join(', ') : '10:00, 14:00, 02:00';

  const handleFormSubmit = async (data: PaymentCheckInput) => {
    setIsLoading(true);
    setFormValues(data);

    try {
      const result = await analyzePaymentRiskApi(data);
      setAnalysisResult(result);
    } catch (err) {
      console.error('API analysis failed, using fallback risk evaluation:', err);
      const result = await analyzePaymentRisk(data);
      setAnalysisResult(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrParsed = (extractedData: Partial<PaymentCheckInput>, qrRiskResult?: PrePaymentRiskResult) => {
    setFormValues((prev: Partial<PaymentCheckInput>) => ({ ...prev, ...extractedData }));
    if (qrRiskResult) {
      setAnalysisResult(qrRiskResult);
    } else {
      setSelectedMode('upi');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFormValues({
      upiId: '',
      recipientName: '',
      amount: undefined,
      category: 'Shopping',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-10">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>
              Dashboard
            </span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-800 dark:text-slate-300 font-semibold">Check Before You Pay</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Check Before You Pay
            </h1>
            <Badge variant="safe" size="md" dot>
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              Personal UPI Payment Firewall
            </Badge>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Scan a UPI QR or enter a UPI ID to see whether this payment matches your normal behavior.
          </p>
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <Card className="p-12 border-cyan-500/30 bg-slate-900/90 shadow-glow-shield animate-in fade-in duration-200">
          <LoadingState
            message="Analyzing payment risk..."
            subtext="Evaluating recipient reputation, behavioral baselines, amount deviation, and threat signals"
          />
        </Card>
      )}

      {/* 3. RESULT STATE */}
      {!isLoading && analysisResult && (
        <RiskAnalysisCard result={analysisResult} onReset={handleReset} />
      )}

      {/* 4. INITIAL INPUT STATE */}
      {!isLoading && !analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Method Selector + Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-6 border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80">
              <div className="space-y-1">
                <CardTitle>Payment Verification Method</CardTitle>
                <CardDescription>
                  Select how you would like to input the payee details.
                </CardDescription>
              </div>

              {/* Method Selector */}
              <PaymentMethodSelector
                selectedMode={selectedMode}
                onSelectMode={(mode) => setSelectedMode(mode)}
              />

              {/* Form Views */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {selectedMode === 'upi' ? (
                  <UPIForm
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    initialValues={formValues}
                  />
                ) : (
                  <QRUpload
                    onQrParsed={handleQrParsed}
                    onSwitchToManual={() => setSelectedMode('upi')}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Right Column (1 Col): Security Context & Preset Testing */}
          <div className="space-y-4">
            {/* Active Protection Card */}
            <Card className="p-5 space-y-3.5 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                  Active Defense Baseline
                </h4>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Payments are evaluated against metrics learned from historical transaction data alongside configured policy rules:
              </p>

              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60 pt-1">
                <div className="flex justify-between items-center py-1.5">
                  <div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Learned Normal Range:</span>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">10th–90th percentile of dataset</p>
                  </div>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                    {formatCurrency(minAmt)} – {formatCurrency(maxAmt)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Ceiling Threshold:</span>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">(Configured Policy Setting)</p>
                  </div>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                    {formatCurrency(35000)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Dataset Peak Hours:</span>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Top activity hours</p>
                  </div>
                  <span className="font-mono text-slate-900 dark:text-slate-200">
                    {peakHoursStr}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Operating Window:</span>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">(Configured Business Rule)</p>
                  </div>
                  <span className="font-mono text-slate-900 dark:text-slate-200">
                    09:00 – 22:00 IST
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Demo Test Presets */}
            <Card className="p-5 space-y-3 border-slate-800 bg-slate-900/80">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Sample Test Presets
              </h4>
              <p className="text-xs text-slate-400">
                Quickly test different pre-payment risk outcomes:
              </p>

              <div className="space-y-2 pt-1">
                {/* Preset 1: High Risk Spec Example */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode('upi');
                    setFormValues({
                      upiId: 'abc123@upi',
                      recipientName: 'ABC Store',
                      amount: 10000,
                      category: 'Shopping',
                      transactionTime: '23:45',
                    });
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-rose-400 truncate">
                      ABC Store (86 Score)
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">₹10,000 • New Payee</p>
                  </div>
                  <Badge variant="high" size="sm">HIGH RISK</Badge>
                </button>

                {/* Preset 2: Safe Merchant */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode('upi');
                    setFormValues({
                      upiId: 'naturesbasket@okhdfcbank',
                      recipientName: "Nature's Basket",
                      amount: 640,
                      category: 'Shopping',
                      transactionTime: '17:30',
                    });
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 truncate">
                      Known Merchant
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">₹640 • 18 Prior Txns</p>
                  </div>
                  <Badge variant="safe" size="sm">SAFE</Badge>
                </button>

                {/* Preset 3: Review Needed */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode('upi');
                    setFormValues({
                      upiId: 'rohit.kumar772@okaxis',
                      recipientName: 'Rohit Kumar',
                      amount: 4500,
                      category: 'Transfer',
                      transactionTime: '19:15',
                    });
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 truncate">
                      Peer Transfer Spike
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">₹4,500 • Novel VPA</p>
                  </div>
                  <Badge variant="review" size="sm">REVIEW</Badge>
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
