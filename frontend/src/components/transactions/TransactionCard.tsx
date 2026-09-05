import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Shield } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { formatCurrency, formatDateRelative, maskUPI } from '../../utils/formatters';
import { RiskBadge } from '../risk/RiskBadge';
import { Card } from '../common/Card';
import { cn } from '../../utils/cn';

export interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  className?: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onClick,
  className,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/result/${transaction.id}`);
    }
  };

  const getBorderGlow = () => {
    switch (transaction.riskLevel) {
      case 'SAFE':
        return 'none';
      case 'REVIEW':
        return 'review';
      case 'HIGH_RISK':
        return 'high';
      default:
        return 'none';
    }
  };

  return (
    <Card
      onClick={handleClick}
      borderGlow={getBorderGlow()}
      hoverEffect
      className={cn(
        'p-4 cursor-pointer group transition-all duration-200 relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Avatar / Category Icon + Recipient Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-colors shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                {transaction.recipientName}
              </h4>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {transaction.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {transaction.recipientUpi ? maskUPI(transaction.recipientUpi) : transaction.referenceNo}
              <span className="mx-1.5">•</span>
              {formatDateRelative(transaction.timestamp)}
            </p>
          </div>
        </div>

        {/* Right Side: Amount & Risk Assessment Badge */}
        <div className="flex items-center gap-4 shrink-0 text-right">
          <div>
            <p className="text-sm font-bold font-mono text-slate-100">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <div className="mt-1 flex justify-end">
              <RiskBadge level={transaction.riskLevel} size="sm" />
            </div>
          </div>

          <div className="p-1 rounded-lg text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
};
