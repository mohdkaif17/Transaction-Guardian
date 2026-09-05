import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  Zap,
  FileSpreadsheet,
  BarChart3,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { NavItem } from '../../types/navigation';
import { cn } from '../../utils/cn';

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const mainNavItems: NavItem[] = [
    {
      name: 'Protection Center',
      href: '/',
      icon: Layers,
      description: 'Firewall overview & status',
    },
    {
      name: 'Check Before You Pay',
      href: '/check-payment',
      icon: QrCode,
      badge: 'Primary',
      badgeColor: 'cyan',
      description: 'QR & UPI safety check',
    },
    {
      name: 'Test a Payment',
      href: '/new-transaction',
      icon: Zap,
      badge: 'Check',
      badgeColor: 'neutral',
      description: 'Fingerprint anomaly test',
    },
    {
      name: 'Payment History',
      href: '/history',
      icon: FileSpreadsheet,
      badge: 'Scanner',
      badgeColor: 'review',
      description: 'Statement anomaly scanner',
    },
    {
      name: 'Risk Insights',
      href: '/analytics',
      icon: BarChart3,
      description: 'Fingerprint metrics & trends',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/95 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Logo & Title */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-glow-shield shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">TRANSACTION</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-mono tracking-wide">
              GUARDIAN
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest font-mono">
            Safety Engines
          </div>

          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-semibold border border-cyan-500/40 dark:border-cyan-500/30 shadow-xs shadow-cyan-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300'
                      )}
                    />
                    <div className="min-w-0">
                      <span className="block truncate">{item.name}</span>
                    </div>
                  </div>

                  {item.badge ? (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight',
                        item.badgeColor === 'cyan'
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                          : item.badgeColor === 'review'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={cn(
                        'w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity',
                        isActive && 'opacity-100 text-cyan-600 dark:text-cyan-400'
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Core Firewall Status Widget in Sidebar */}
          <div className="pt-6">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
              Firewall Status
            </div>

            <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Payment Firewall Active</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">ON</span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Personal Baseline:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="text-slate-800 dark:text-slate-300 font-mono">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info / Guard Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xs font-mono">
              AV
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Alex Vance</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">USR-94821 • Protected</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
