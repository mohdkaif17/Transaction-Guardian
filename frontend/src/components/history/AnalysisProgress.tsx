import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Shield, Circle } from 'lucide-react';
import { Card } from '../common/Card';

export const AnalysisProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 500);
    const t2 = setTimeout(() => setCurrentStep(3), 1100);
    const t3 = setTimeout(() => setCurrentStep(4), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const steps = [
    { id: 1, label: 'Reading transaction data' },
    { id: 2, label: 'Building behavioral baseline' },
    { id: 3, label: 'Detecting anomalies' },
    { id: 4, label: 'Generating risk report' },
  ];

  return (
    <Card className="p-8 sm:p-12 border-cyan-500/30 bg-slate-900/90 shadow-glow-shield text-center space-y-6">
      {/* Animated Radar Pulse */}
      <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-20" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/40" />
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 shadow-glow-shield text-cyan-400 z-10">
          <Shield className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Analyzing transaction history...
        </h3>
        <p className="text-xs text-slate-400">
          Cross-referencing batch data with ML anomaly detection models
        </p>
      </div>

      {/* Step Progression List */}
      <div className="max-w-xs mx-auto space-y-2.5 text-xs text-left pt-2">
        {steps.map((s) => {
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                isCurrent
                  ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20'
                  : isDone
                  ? 'text-slate-300 font-medium'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
