import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  borderGlow?: 'safe' | 'review' | 'high' | 'neutral' | 'none';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, borderGlow = 'none', children, ...props }, ref) => {
    const glowClasses = {
      none: 'border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 shadow-xs dark:shadow-none',
      safe: 'border-emerald-500/40 dark:border-emerald-500/30 bg-white/95 dark:bg-slate-900/90 shadow-glow-safe',
      review: 'border-amber-500/40 dark:border-amber-500/30 bg-white/95 dark:bg-slate-900/90 shadow-glow-review',
      high: 'border-rose-500/40 dark:border-rose-500/30 bg-white/95 dark:bg-slate-900/90 shadow-glow-high',
      neutral: 'border-cyan-500/40 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900/90 shadow-glow-shield',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border backdrop-blur-md transition-all duration-200',
          glowClasses[borderGlow],
          hoverEffect && 'hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/95 hover:shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-slate-500 dark:text-slate-400 mt-0.5', className)} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 py-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-950/40 rounded-b-xl flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
