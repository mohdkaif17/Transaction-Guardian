import React, { useState, useEffect } from 'react';
import { AtSign, ShieldCheck, Clock, Info, User, Tag } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PaymentCheckInput } from '../../services/mockRiskService';

export interface UPIFormProps {
  onSubmit: (data: PaymentCheckInput) => void;
  isLoading: boolean;
  initialValues?: Partial<PaymentCheckInput>;
}

export const UPIForm: React.FC<UPIFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  // Get current local time as default HH:mm
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [upiId, setUpiId] = useState(initialValues?.upiId || 'abc123@upi');
  const [recipientName, setRecipientName] = useState(initialValues?.recipientName || 'ABC Store');
  const [amount, setAmount] = useState(initialValues?.amount ? String(initialValues.amount) : '10000');
  const [category, setCategory] = useState(initialValues?.category || 'Shopping');
  const [transactionTime, setTransactionTime] = useState(initialValues?.transactionTime || getCurrentTime());

  useEffect(() => {
    if (initialValues) {
      if (initialValues.upiId !== undefined) setUpiId(initialValues.upiId);
      if (initialValues.recipientName !== undefined) setRecipientName(initialValues.recipientName);
      if (initialValues.amount !== undefined) setAmount(String(initialValues.amount));
      if (initialValues.category !== undefined) setCategory(initialValues.category);
      if (initialValues.transactionTime !== undefined) setTransactionTime(initialValues.transactionTime);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !amount.trim()) return;

    onSubmit({
      upiId: upiId.trim(),
      recipientName: recipientName.trim() || undefined,
      amount: parseFloat(amount) || 0,
      category,
      transactionTime,
    });
  };

  const isFormValid = upiId.trim().length > 0 && parseFloat(amount) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* UPI ID Field */}
      <Input
        label="UPI ID *"
        placeholder="example@upi"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        required
        leftIcon={<AtSign className="w-4 h-4" />}
        helperText="Recipient Virtual Payment Address to scan against risk signals."
      />

      {/* Recipient Name Field */}
      <Input
        label="Recipient Name"
        placeholder="Optional recipient name"
        value={recipientName}
        onChange={(e) => setRecipientName(e.target.value)}
        leftIcon={<User className="w-4 h-4" />}
      />

      {/* Amount and Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount Field with Prefix */}
        <div className="w-full space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Amount (INR) *</label>
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
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="w-full space-y-1.5">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Category</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
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

      {/* Transaction Time Field */}
      <div className="w-full space-y-1.5">
        <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Transaction Time</span>
        </label>
        <input
          type="time"
          value={transactionTime}
          onChange={(e) => setTransactionTime(e.target.value)}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
        />
      </div>

      {/* Informational Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>These details are analyzed against available transaction-risk signals.</span>
      </div>

      {/* Primary Analyze Risk Button */}
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
          {isLoading ? 'Analyzing payment risk...' : 'Analyze Payment Risk'}
        </Button>
      </div>
    </form>
  );
};
