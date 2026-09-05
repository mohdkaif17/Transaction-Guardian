import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  search: string;
  riskLevel: 'ALL' | 'SAFE' | 'REVIEW' | 'HIGH_RISK';
  category: string;
  sortBy: 'date' | 'amount' | 'riskScore';
  sortOrder: 'asc' | 'desc';
}

export interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
}) => {
  const categories = [
    'ALL',
    'Shopping',
    'Food',
    'Transport',
    'Bills',
    'Transfer',
    'Education',
    'Healthcare',
    'Entertainment',
    'Other',
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* 1. Search Field */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search recipient or transaction ID"
          className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono transition-colors"
        />
      </div>

      {/* 2. Controls Grid */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Risk Filter */}
        <select
          value={filters.riskLevel}
          onChange={(e) =>
            onChange({ ...filters, riskLevel: e.target.value as FilterState['riskLevel'] })
          }
          className="bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="SAFE">Safe Only</option>
          <option value="REVIEW">Needs Review</option>
          <option value="HIGH_RISK">High Risk Only</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500"
        >
          <option value="ALL">All Categories</option>
          {categories.filter((c) => c !== 'ALL').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort Field Selector */}
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
          }
          className="bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-500 font-mono"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="riskScore">Sort by Risk Score</option>
        </select>

        {/* Sort Order Toggle */}
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
          }
          className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 flex items-center gap-1 text-xs font-mono transition-colors"
          title={`Order: ${filters.sortOrder.toUpperCase()}`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="uppercase text-[11px]">{filters.sortOrder}</span>
        </button>
      </div>
    </div>
  );
};
