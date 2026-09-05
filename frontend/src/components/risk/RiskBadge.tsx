import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { RiskLevel } from '../../types/risk';
import { getRiskColors, getRiskLabel } from '../../utils/riskCalculators';
import { cn } from '../../utils/cn';

export interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const colors = getRiskColors(level);
  const label = getRiskLabel(level);

  const icons = {
    SAFE: ShieldCheck,
    REVIEW: AlertTriangle,
    HIGH_RISK: ShieldAlert,
  };

  const IconComponent = icons[level];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 rounded-md font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-md font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 rounded-lg font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border select-none tracking-wide uppercase',
        colors.badgeBg,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <IconComponent className={cn(iconSizes[size], colors.iconColor, 'shrink-0')} />}
      <span>{label}</span>
    </span>
  );
};
