import React, { useEffect, useState } from 'react';
import { UserCheck, DollarSign, Clock, Tag, Shield, Activity, BarChart2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { getProfileApi, BehavioralProfileData } from '../../services/api';

export const BehavioralProfile: React.FC = () => {
  const [profile, setProfile] = useState<BehavioralProfileData | null>(null);

  useEffect(() => {
    getProfileApi()
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile for sidebar:', err));
  }, []);

  const normalRangeText = profile?.normal_amount_range
    ? `₹${profile.normal_amount_range[0].toFixed(2)} – ₹${profile.normal_amount_range[1].toFixed(2)}`
    : '₹30.10 – ₹3,750.00';

  const avgAmountText = profile?.average_amount
    ? `₹${profile.average_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '₹1,295.12';

  const knownRecipientsCount = profile?.frequent_recipients
    ? Object.keys(profile.frequent_recipients).length
    : 5;

  const peakHoursText = profile?.common_hours && profile.common_hours.length > 0
    ? profile.common_hours.map(h => `${String(h).padStart(2, '0')}:00`).join(', ')
    : '10:00, 14:00, 02:00';

  const topCategory = profile?.common_categories
    ? Object.keys(profile.common_categories)[0] || 'Food'
    : 'Food';

  const topCatCount = profile?.common_categories && profile.common_categories[topCategory]
    ? profile.common_categories[topCategory]
    : 2;

  return (
    <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">🧬 My Payment Fingerprint</h3>
        </div>
        <Badge variant="safe" size="sm" className="text-[10px] font-mono">
          {profile ? 'Live Profile' : 'Dataset Baseline'}
        </Badge>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Your personal payment baseline learned from historical transaction activity:
      </p>

      <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800/60 pt-1">
        {/* Metric 1 */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Typical Payment
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{profile ? normalRangeText : '₹620 – ₹1,450'}</span>
        </div>

        {/* Metric 2 */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Average Payment
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{profile ? avgAmountText : '₹1,295'}</span>
        </div>

        {/* Metric 3 */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Normal Payment Hours
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{profile ? peakHoursText : '9 AM – 10 PM'}</span>
        </div>

        {/* Metric 4 */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Known Recipients
          </span>
          <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">{knownRecipientsCount} recipients</span>
        </div>

        {/* Metric 5 */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Most Common Category
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
            {topCategory}
          </span>
        </div>

        {/* Metric 6 */}
        <div className="flex justify-between items-center py-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Typical Daily Spending
          </span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">₹1,850</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Personal payment baseline active</span>
      </div>
    </Card>
  );
};
