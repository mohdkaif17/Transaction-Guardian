import React from 'react';
import { Card } from '../common/Card';
import { CategorySpendingData } from '../../types/analytics';
import { formatCurrency } from '../../utils/formatters';
import { Layers } from 'lucide-react';

export interface CategoryChartProps {
  categories: CategorySpendingData[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'shopping':
        return 'bg-cyan-500 text-cyan-400';
      case 'food':
        return 'bg-emerald-500 text-emerald-400';
      case 'travel':
        return 'bg-sky-500 text-sky-400';
      case 'bills':
        return 'bg-indigo-500 text-indigo-400';
      case 'entertainment':
        return 'bg-purple-500 text-purple-400';
      case 'transfer':
        return 'bg-rose-500 text-rose-400';
      default:
        return 'bg-slate-500 text-slate-400';
    }
  };

  return (
    <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Spending by Category</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Distribution across transaction types</p>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
          <Layers className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {categories.map((item) => {
          const colorClass = getCategoryColor(item.category);
          const bgBar = colorClass.split(' ')[0];

          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.category}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    ({item.transactionCount} txns)
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.totalAmount)}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">({item.percentage}%)</span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${bgBar}`}
                  style={{ width: `${Math.max(item.percentage, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
