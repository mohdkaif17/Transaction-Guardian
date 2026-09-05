import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Info,
  Clock,
  Calendar,
  User,
  AtSign,
  Tag,
  AlertTriangle,
  RefreshCw,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardTitle, CardDescription } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { BehavioralProfile } from '../components/transaction-check/BehavioralProfile';
import { NewTransactionResultCard } from '../components/transaction-check/NewTransactionResultCard';
import { NewTransactionRiskResult } from '../services/mockRiskService';
import { analyzeTransactionApi } from '../services/api';

export const NewTransaction: React.FC = () => {
  const navigate = useNavigate();

  // Get current date formatted YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current time formatted HH:mm
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [upiId, setUpiId] = useState('abc123@upi');
  const [recipientName, setRecipientName] = useState('ABC Store');
  const [amount, setAmount] = useState('10000');
  const [category, setCategory] = useState('Shopping');
  const [transactionTime, setTransactionTime] = useState('23:45');
  const [transactionDate, setTransactionDate] = useState(getTodayDate());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NewTransactionRiskResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !amount.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await analyzeTransactionApi({
        upiId: upiId.trim(),
        recipientName: recipientName.trim() || 'ABC Store',
        amount: parseFloat(amount) || 0,
        category,
        transactionTime,
        transactionDate,
      });
      setAnalysisResult(res);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err?.message || 'Backend service unreachable. Please ensure the Python FastAPI server is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setUpiId('');
    setRecipientName('');
    setAmount('');
    setCategory('Shopping');
    setTransactionTime(getCurrentTime());
    setTransactionDate(getTodayDate());
  };

  const isFormValid = upiId.trim().length > 0 && parseFloat(amount) > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-1">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>
              Dashboard
            </span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-800 dark:text-slate-300 font-semibold">New Transaction Check</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Check New Transaction
            </h1>
            <Badge variant="neutral" size="md" dot>
              <Activity className="w-3.5 h-3.5 inline mr-1 text-cyan-600 dark:text-cyan-400" />
              Real-time risk assessment
            </Badge>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Assess a new payment against your historical transaction behavior using the live Python FastAPI risk engine.
          </p>
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <Card className="p-12 border-cyan-500/30 bg-slate-900/90 shadow-glow-shield animate-in fade-in duration-200">
          <LoadingState
            message="Analyzing transaction with Python FastAPI backend..."
            subtext="Evaluating behavioral profile baselines, amount deviation z-scores, and scikit-learn Isolation Forest ML models"
          />
        </Card>
      )}

      {/* 3. ERROR STATE */}
      {!isLoading && error && (
        <Card className="p-8 border-rose-500/30 bg-rose-950/20 text-center space-y-4">
          <div className="p-3.5 rounded-full bg-rose-900/40 border border-rose-800 text-rose-400 w-12 h-12 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-rose-200">Backend Service Error</h4>
            <p className="text-xs text-rose-300/80 max-w-md mx-auto">{error}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSubmit}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Request
          </Button>
        </Card>
      )}

      {/* 4. RESULT STATE */}
      {!isLoading && !error && analysisResult && (
        <NewTransactionResultCard result={analysisResult} onReset={handleReset} />
      )}

      {/* 5. INITIAL INPUT STATE */}
      {!isLoading && !error && !analysisResult && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2 Cols): Current Transaction Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 space-y-6 border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80">
                <div className="space-y-1">
                  <CardTitle>Current Transaction</CardTitle>
                  <CardDescription>
                    Enter the transaction details to evaluate against your behavioral profile.
                  </CardDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* UPI ID */}
                  <Input
                    label="Recipient UPI ID *"
                    placeholder="recipient@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    leftIcon={<AtSign className="w-4 h-4" />}
                    helperText="Virtual Payment Address of the payee."
                  />

                  {/* Recipient Name */}
                  <Input
                    label="Recipient Name"
                    placeholder="Enter recipient name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                  />

                  {/* Amount and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Amount with ₹ prefix */}
                    <div className="w-full space-y-1.5">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Transaction Amount *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg pl-8 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="w-full space-y-1.5">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Category</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Shopping">Shopping</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Bills">Bills</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Time and Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Time */}
                    <div className="w-full space-y-1.5">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Transaction Time</span>
                      </label>
                      <input
                        type="time"
                        value={transactionTime}
                        onChange={(e) => setTransactionTime(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
                      />
                    </div>

                    {/* Date */}
                    <div className="w-full space-y-1.5">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Transaction Date</span>
                      </label>
                      <input
                        type="date"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Information Message */}
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-cyan-500/5 dark:bg-slate-950/60 border border-cyan-500/20 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Evaluates the payment in real time against your live Python FastAPI risk scoring backend.
                    </p>
                  </div>

                  {/* Analyze Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      variant="primary"
                      className="w-full font-semibold shadow-glow-shield"
                      disabled={!isFormValid || isLoading}
                      isLoading={isLoading}
                      leftIcon={<ShieldCheck className="w-5 h-5 text-slate-950" />}
                    >
                      {isLoading ? 'Connecting to Risk Engine...' : 'Analyze Transaction Risk'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Column (1 Col): Behavioral Profile Card */}
            <div className="space-y-4">
              <BehavioralProfile />

              {/* Sample Preset Shortcut */}
              <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Preset Scenarios
                </h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUpiId('crypto_wallet_99@upi');
                      setRecipientName('Unknown Off-Shore Merchant');
                      setAmount('85000');
                      setCategory('Other');
                      setTransactionTime('03:15');
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Outlier Anomaly (High Score)</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">₹85,000 • 03:15 AM • Unseen</p>
                    </div>
                    <Badge variant="high" size="sm">HIGH RISK</Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUpiId('swiggy@icici');
                      setRecipientName('Swiggy Food Order');
                      setAmount('120');
                      setCategory('Food');
                      setTransactionTime('14:30');
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Baseline Match (Low Score)</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">₹120 • 02:30 PM • Normal</p>
                    </div>
                    <Badge variant="safe" size="sm">SAFE</Badge>
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Initial State Placeholder Panel */}
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 text-center space-y-2">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 w-10 h-10 mx-auto flex items-center justify-center">
              <Inbox className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Risk assessment will appear here</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Enter your transaction details and select <span className="text-cyan-600 dark:text-cyan-400 font-medium">Analyze Transaction Risk</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
