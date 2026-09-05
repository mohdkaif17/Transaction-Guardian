import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 shadow-glow-high">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight">404 - Route Unrecognized</h1>
      <p className="text-sm text-slate-400 max-w-md">
        The requested URL was not found on the Transaction Guardian risk navigation matrix.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4 text-slate-950" />} onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
