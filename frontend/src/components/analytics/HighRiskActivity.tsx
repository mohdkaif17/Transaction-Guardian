import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RiskBadge } from '../risk/RiskBadge';
import { RiskScore } from '../risk/RiskScore';
import { HistoryTransaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';
import { ShieldAlert, ArrowUpRight, Eye } from 'lucide-react';

export interface HighRiskActivityProps {
  transactions: HistoryTransaction[];
}

export const HighRiskActivity: React.FC<HighRiskActivityProps> = ({ transactions }) => {
  const navigate = useNavigate();

  // Filter for high-risk and review transactions
  const flaggedList = transactions
    .filter((t) => t.riskLevel === 'HIGH_RISK' || t.riskLevel === 'REVIEW')
    .slice(0, 5);

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-0">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Recent High-Risk Activity</h3>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{flaggedList.length} flagged items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Transaction</th>
              <th className="py-3 px-4 font-semibold">Recipient</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold text-center">Risk Score</th>
              <th className="py-3 px-4 font-semibold">Risk Level</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {flaggedList.map((txn) => (
              <tr
                key={txn.id}
                onClick={() => navigate(`/result/${txn.id}`)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                {/* ID */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  {txn.id}
                </td>

                {/* Recipient */}
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate max-w-[140px]">{txn.recipient}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(txn.amount)}
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    {txn.category}
                  </span>
                </td>

                {/* Risk Score */}
                <td className="py-3.5 px-4 text-center">
                  <RiskScore score={txn.riskScore} level={txn.riskLevel} variant="compact" />
                </td>

                {/* Risk Level */}
                <td className="py-3.5 px-4">
                  <RiskBadge level={txn.riskLevel} size="sm" />
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                  {txn.date}
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/result/${txn.id}`);
                    }}
                    className="text-xs text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 px-2 py-1 h-auto"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
