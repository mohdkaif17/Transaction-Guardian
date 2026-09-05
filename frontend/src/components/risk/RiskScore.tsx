import React from 'react';
import { RiskLevel } from '../../types/risk';
import { getRiskColors, getRiskLevelFromScore } from '../../utils/riskCalculators';
import { cn } from '../../utils/cn';

export interface RiskScoreProps {
  score: number; // 0 - 100
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gauge' | 'bar' | 'compact';
  showLabel?: boolean;
  className?: string;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  level: overrideLevel,
  size = 'md',
  variant = 'gauge',
  showLabel = true,
  className,
}) => {
  const level = overrideLevel || getRiskLevelFromScore(score);
  const colors = getRiskColors(level);

  // For circular gauge
  const radius = size === 'sm' ? 24 : size === 'md' ? 38 : 52;
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  if (variant === 'bar') {
    return (
      <div className={cn('w-full space-y-1.5', className)}>
        {showLabel && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Risk Assessment Score</span>
            <span className={cn('font-mono font-bold', colors.text)}>
              {score} <span className="text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
        )}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={cn('h-full rounded-full transition-all duration-500', colors.barColor)}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 font-mono px-2 py-0.5 rounded border text-xs font-bold',
          colors.badgeBg,
          className
        )}
      >
        <span>{score}</span>
        <span className="text-[10px] opacity-70 font-normal">/100</span>
      </div>
    );
  }

  const svgDim = radius * 2 + strokeWidth * 2;

  return (
    <div className={cn('flex flex-col items-center justify-center relative', className)}>
      <div className="relative flex items-center justify-center">
        <svg
          width={svgDim}
          height={svgDim}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={svgDim / 2}
            cy={svgDim / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Animated risk progress */}
          <circle
            cx={svgDim / 2}
            cy={svgDim / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn('transition-all duration-700 ease-out', colors.text)}
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={cn(
              'font-mono font-extrabold tracking-tight',
              colors.text,
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-xl' : 'text-3xl'
            )}
          >
            {score}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              / 100
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <span
          className={cn(
            'mt-2 text-xs font-semibold tracking-wider uppercase',
            colors.text
          )}
        >
          {level.replace('_', ' ')}
        </span>
      )}
    </div>
  );
};
