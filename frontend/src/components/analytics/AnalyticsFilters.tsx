import React from 'react';
import { Filter, RotateCcw, Calendar, Shield, Tag } from 'lucide-react';
import { AnalyticsFilterState, AnalyticsDateRange } from '../../types/analytics';
import { Button } from '../common/Button';

export interface AnalyticsFiltersProps {
  filters: AnalyticsFilterState;
  onChange: (newFilters: AnalyticsFilterState) => void;
  onReset: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const dateRanges: { id: AnalyticsDateRange; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  const categories = [
    'All Categories',
    'Shopping',
    'Food',
    'Travel',
    'Bills',
    'Entertainment',
    'Transfer',
  ];

  const hasActiveFilters =
    filters.dateRange !== '30d' ||
    filters.riskLevel !== 'ALL' ||
    filters.category !== 'All Categories';

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Left: Date Range Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-1 hidden sm:inline flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" /> Date:
        </span>
        {dateRanges.map((range) => (
          <button
            key={range.id}
            type="button"
            onClick={() => onChange({ ...filters, dateRange: range.id })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filters.dateRange === range.id
                ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold border border-cyan-300 dark:border-cyan-500/40 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Right: Dropdowns & Reset Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Risk Level Dropdown */}
        <div className="relative flex items-center">
          <select
            value={filters.riskLevel}
            onChange={(e) =>
              onChange({
                ...filters,
                riskLevel: e.target.value as AnalyticsFilterState['riskLevel'],
              })
            }
            className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="SAFE">Safe Only</option>
            <option value="REVIEW">Review Only</option>
            <option value="HIGH_RISK">High Risk Only</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="relative flex items-center">
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-medium"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          disabled={!hasActiveFilters}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 h-auto disabled:opacity-40"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
