import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Shield,
  Search,
  Bell,
  Sparkles,
  QrCode,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useTheme } from '../../context/ThemeContext';

export interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If starts with TXN or numeric, route to result
      navigate(`/result/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Quick Mode Links */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden border border-slate-200 dark:border-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="safe" size="sm" dot>
            Personal Baseline Active
          </Badge>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Lat: 12ms</span>
        </div>
      </div>

      {/* Center: Quick Search for Transaction ID / UPI */}
      <div className="flex-1 max-w-md mx-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search txn ID (e.g. TXN-HIGH-03) or UPI..."
            className="w-full bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
          />
        </form>
      </div>

      {/* Right: Quick Action Buttons & Notifications & Theme Switcher */}
      <div className="flex items-center gap-2.5">
        <Button
          size="sm"
          variant="outline"
          leftIcon={<QrCode className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />}
          onClick={() => navigate('/check-payment')}
          className="hidden md:inline-flex text-xs"
        >
          Check UPI
        </Button>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Zap className="w-3.5 h-3.5 text-slate-950" />}
          onClick={() => navigate('/new-transaction')}
          className="text-xs"
        >
          Verify Txn
        </Button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to White (Light) Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle white and dark theme"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-in fade-in duration-200" />
              <span className="hidden xl:inline text-slate-300 text-xs font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 animate-in fade-in duration-200" />
              <span className="hidden xl:inline text-slate-700 text-xs font-medium">Dark</span>
            </>
          )}
        </button>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Security Alerts</span>
                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-slate-800 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Risk Intercepted
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    UPI refund phishing attempt blocked for ₹48,000.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Baseline Updated
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Behavioral baseline synced with 28-month profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
