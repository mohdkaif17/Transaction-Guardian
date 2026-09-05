import React from 'react';
import { ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
  variant?: 'radar' | 'spinner' | 'skeleton';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing Risk Engine Telemetry...',
  subtext = 'Evaluating behavioral baseline, recipient graph, and fraud heuristics',
  variant = 'radar',
  className,
}) => {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 space-y-3', className)}>
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-300">{message}</p>
        {subtext && <p className="text-xs text-slate-400 text-center max-w-sm">{subtext}</p>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-4 animate-pulse', className)}>
        <div className="h-8 bg-slate-800/80 rounded-lg w-1/3" />
        <div className="h-32 bg-slate-800/50 rounded-xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-slate-800/40 rounded-lg" />
          <div className="h-24 bg-slate-800/40 rounded-lg" />
          <div className="h-24 bg-slate-800/40 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-12 space-y-4', className)}>
      {/* Security Radar Animation */}
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-20" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/40" />
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 shadow-glow-shield text-cyan-400 z-10">
          <ShieldAlert className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <h4 className="text-base font-semibold text-slate-200">{message}</h4>
        </div>
        {subtext && <p className="text-xs text-slate-400 max-w-md mx-auto">{subtext}</p>}
      </div>
    </div>
  );
};
