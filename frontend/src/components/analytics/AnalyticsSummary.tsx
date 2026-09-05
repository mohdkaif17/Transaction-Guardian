import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Sparkles, FileSpreadsheet, ShieldCheck, ArrowRight } from 'lucide-react';

export const AnalyticsSummary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="p-6 md:p-8 border-cyan-300 dark:border-cyan-500/30 bg-gradient-to-r from-cyan-50/90 via-slate-50 to-cyan-100/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-cyan-950/20 shadow-sm dark:shadow-glow-shield space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-400 font-semibold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Behavioral Intelligence Summary</span>
            </div>

            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What does your transaction activity tell you?
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              Most transactions appear consistent with your normal behavior. A small number of transactions show unusual characteristics such as new recipients, unusually large amounts, or activity outside normal hours. These transactions should be reviewed before taking further action.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              size="md"
              variant="primary"
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-slate-950" />}
              rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              onClick={() => navigate('/history')}
              className="w-full sm:w-auto font-semibold shadow-glow-shield"
            >
              View Transaction History
            </Button>
          </div>
        </div>
      </Card>

      {/* Demo Data Disclaimer */}
      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
        Analytics shown are based on demo transaction data. Final risk assessments will be powered by the transaction risk engine when the backend and ML pipeline are connected.
      </p>
    </div>
  );
};
