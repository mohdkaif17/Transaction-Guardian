import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'outline' | 'safe' | 'review' | 'high' | 'cyan' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80',
    neutral: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    safe: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    review: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30',
    high: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  };

  const dotColors = {
    default: 'bg-slate-400',
    neutral: 'bg-sky-400',
    outline: 'bg-slate-400',
    safe: 'bg-emerald-400 animate-pulse',
    review: 'bg-amber-400 animate-pulse',
    high: 'bg-rose-400 animate-pulse',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] font-medium px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs font-medium px-2.5 py-1 rounded-md gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border tracking-wide select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
