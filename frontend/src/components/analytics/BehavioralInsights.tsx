import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DollarSign, Tag, Clock, UserCheck, Sparkles } from 'lucide-react';
import { BehavioralInsightItem } from '../../types/analytics';

export interface BehavioralInsightsProps {
  insights: BehavioralInsightItem[];
}

export const BehavioralInsights: React.FC<BehavioralInsightsProps> = ({ insights }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
      case 'Tag':
        return <Tag className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Behavioral Insights</h3>
          <Badge variant="neutral" size="sm" className="text-[10px] font-mono">
            Demo behavioral insights
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item) => (
          <Card
            key={item.id}
            className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.title}</span>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                {getIcon(item.iconName)}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
