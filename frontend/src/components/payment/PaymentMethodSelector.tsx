import React from 'react';
import { QrCode, AtSign } from 'lucide-react';
import { cn } from '../../utils/cn';

export type PaymentInputMode = 'upi' | 'qr';

export interface PaymentMethodSelectorProps {
  selectedMode: PaymentInputMode;
  onSelectMode: (mode: PaymentInputMode) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Option 1: Enter UPI ID */}
      <button
        type="button"
        onClick={() => onSelectMode('upi')}
        className={cn(
          'p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 group relative',
          selectedMode === 'upi'
            ? 'bg-cyan-500/5 dark:bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
            : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/90'
        )}
      >
        <div
          className={cn(
            'p-2.5 rounded-lg border shrink-0 transition-colors',
            selectedMode === 'upi'
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
          )}
        >
          <AtSign className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-sm font-bold tracking-tight',
                selectedMode === 'upi' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
              )}
            >
              Enter UPI ID
            </span>
            {selectedMode === 'upi' && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Manually enter the recipient's UPI ID and payment amount.
          </p>
        </div>
      </button>

      {/* Option 2: Scan QR Code */}
      <button
        type="button"
        onClick={() => onSelectMode('qr')}
        className={cn(
          'p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 group relative',
          selectedMode === 'qr'
            ? 'bg-cyan-500/5 dark:bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
            : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/90'
        )}
      >
        <div
          className={cn(
            'p-2.5 rounded-lg border shrink-0 transition-colors',
            selectedMode === 'qr'
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
          )}
        >
          <QrCode className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-sm font-bold tracking-tight',
                selectedMode === 'qr' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
              )}
            >
              Scan QR Code
            </span>
            {selectedMode === 'qr' && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scan a UPI QR code to automatically extract payment details.
          </p>
        </div>
      </button>
    </div>
  );
};
