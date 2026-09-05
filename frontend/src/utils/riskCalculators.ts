import { RiskLevel } from '../types/risk';

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score < 35) return 'SAFE';
  if (score < 70) return 'REVIEW';
  return 'HIGH_RISK';
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'SAFE':
      return 'SAFE';
    case 'REVIEW':
      return 'REVIEW NEEDED';
    case 'HIGH_RISK':
      return 'HIGH RISK';
    default:
      return 'UNKNOWN';
  }
}

export interface RiskColorTokens {
  text: string;
  bg: string;
  border: string;
  badgeBg: string;
  glow: string;
  barColor: string;
  ringColor: string;
  iconColor: string;
}

export function getRiskColors(level: RiskLevel): RiskColorTokens {
  switch (level) {
    case 'SAFE':
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
        border: 'border-emerald-500/30 dark:border-emerald-500/30',
        badgeBg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-500/30',
        glow: 'shadow-glow-safe',
        barColor: 'bg-emerald-500',
        ringColor: 'stroke-emerald-500',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'REVIEW':
      return {
        text: 'text-amber-700 dark:text-amber-400',
        bg: 'bg-amber-500/10 dark:bg-amber-500/10',
        border: 'border-amber-500/30 dark:border-amber-500/30',
        badgeBg: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30',
        glow: 'shadow-glow-review',
        barColor: 'bg-amber-500',
        ringColor: 'stroke-amber-500',
        iconColor: 'text-amber-600 dark:text-amber-400',
      };
    case 'HIGH_RISK':
      return {
        text: 'text-rose-700 dark:text-rose-400',
        bg: 'bg-rose-500/10 dark:bg-rose-500/10',
        border: 'border-rose-500/30 dark:border-rose-500/30',
        badgeBg: 'bg-rose-500/15 text-rose-800 dark:text-rose-400 border-rose-500/30',
        glow: 'shadow-glow-high',
        barColor: 'bg-rose-500',
        ringColor: 'stroke-rose-500',
        iconColor: 'text-rose-600 dark:text-rose-400',
      };
  }
}

export function getFactorCategoryBadge(category: string): { label: string; color: string } {
  switch (category) {
    case 'RECIPIENT':
      return { label: 'Recipient Trust', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30' };
    case 'AMOUNT':
      return { label: 'Amount Deviation', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' };
    case 'VELOCITY':
      return { label: 'Velocity Anomaly', color: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30' };
    case 'BEHAVIORAL':
      return { label: 'Behavioral Baseline', color: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30' };
    case 'NETWORK':
      return { label: 'Network Threat', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30' };
    case 'TIME':
      return { label: 'Time Window', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
    default:
      return { label: category, color: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' };
  }
}
