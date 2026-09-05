import React from 'react';
import { Card } from '../common/Card';
import { Info, HelpCircle } from 'lucide-react';
import { ExplainableRiskSignal } from '../../services/mockRiskService';

export interface RiskExplanationProps {
  signals: ExplainableRiskSignal[];
}

export const RiskExplanation: React.FC<RiskExplanationProps> = ({ signals }) => {
  const getDotIndicator = (status: ExplainableRiskSignal['iconStatus']) => {
    switch (status) {
      case 'RED':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1 shadow-sm shadow-rose-500/50" />;
      case 'YELLOW':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1 shadow-sm shadow-amber-500/50" />;
      case 'GREEN':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-sm shadow-emerald-500/50" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Why is this transaction risky? */}
      <Card className="p-5 space-y-4 border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Why is this transaction risky?
          </h3>
          <span className="text-xs text-slate-400 font-mono">Explainable Factors</span>
        </div>

        <div className="space-y-3">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
            >
              {getDotIndicator(sig.iconStatus)}
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-semibold text-slate-200 block">
                  {sig.title}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {sig.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. How the score works */}
      <Card className="p-4 border-slate-800 bg-slate-950/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h5 className="font-semibold text-slate-200">How the score works</h5>
          <p className="text-slate-400 leading-relaxed">
            The risk score combines transaction-level and behavioral signals such as amount deviation,
            recipient novelty, transaction timing, frequency, and category behavior.
          </p>
        </div>
      </Card>
    </div>
  );
};
