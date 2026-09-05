import React from 'react';
import { Card } from '../common/Card';
import { ArrowRight, AlertTriangle, CheckCircle2, DollarSign, Clock, User, Tag } from 'lucide-react';
import { BehavioralComparisonData } from '../../services/mockRiskService';
import { formatCurrency } from '../../utils/formatters';

export interface BehaviorComparisonProps {
  comparison: BehavioralComparisonData;
}

export const BehaviorComparison: React.FC<BehaviorComparisonProps> = ({ comparison }) => {
  return (
    <Card className="p-5 space-y-4 border-slate-800 bg-slate-900/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Transaction vs Your Normal Behavior
        </h3>
        <span className="text-xs text-slate-400 font-mono">Baseline Comparison</span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Row 1: Amount */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
              Amount Comparison
            </span>
            <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {comparison.amount.differenceText}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <div>
              <span>Current: </span>
              <span className="font-bold text-white">{formatCurrency(comparison.amount.current)}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <span>Historical Avg: </span>
              <span className="text-slate-300">{formatCurrency(comparison.amount.historicalAvg)}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Recipient */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Recipient Familiarity
            </span>
            <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {comparison.recipient.statusText}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <div>
              <span>Payee: </span>
              <span className="font-semibold text-slate-200">{comparison.recipient.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Not in 25 known contacts</span>
            </div>
          </div>
        </div>

        {/* Row 3: Transaction Time */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Transaction Time
            </span>
            <span className="font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Off-Peak Window
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <div>
              <span>Current Time: </span>
              <span className="font-bold text-white">{comparison.time.current}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <span>Normal Window: </span>
              <span className="text-slate-300">{comparison.time.normalWindow}</span>
            </div>
          </div>
        </div>

        {/* Row 4: Category */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              Category Deviation
            </span>
            <span className="font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Familiar Category
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <div>
              <span>Category: </span>
              <span className="font-semibold text-slate-200">{comparison.category.name}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">Matches frequent baseline</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
