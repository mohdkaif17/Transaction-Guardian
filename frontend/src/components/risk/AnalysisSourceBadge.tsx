import React from 'react';
import { QrCode, Zap, FileSpreadsheet } from 'lucide-react';
import { AnalysisSource } from '../../types/risk';

export interface AnalysisSourceBadgeProps {
  source: AnalysisSource;
}

export const AnalysisSourceBadge: React.FC<AnalysisSourceBadgeProps> = ({ source }) => {
  const getSourceMeta = () => {
    switch (source) {
      case 'QR_CHECK':
        return {
          label: 'QR / UPI Check',
          icon: <QrCode className="w-3.5 h-3.5 text-cyan-400" />,
          badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        };
      case 'NEW_TRANSACTION':
        return {
          label: 'New Transaction',
          icon: <Zap className="w-3.5 h-3.5 text-indigo-400" />,
          badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        };
      case 'HISTORY_SCAN':
        return {
          label: 'Transaction History',
          icon: <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />,
          badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
    }
  };

  const meta = getSourceMeta();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold tracking-tight font-mono ${meta.badgeClass}`}
    >
      {meta.icon}
      <span>{meta.label}</span>
    </span>
  );
};
