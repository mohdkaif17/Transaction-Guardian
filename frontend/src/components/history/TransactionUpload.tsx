import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileSpreadsheet, X, Sparkles, AlertCircle, FileText, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface TransactionUploadProps {
  onAnalyze: (file: File | null, isDemo: boolean) => void;
  isLoading: boolean;
}

export const TransactionUpload: React.FC<TransactionUploadProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateAndSelect = (file: File) => {
    setErrorMessage(null);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Unable to read this file. Please upload a valid CSV transaction statement.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDemoClick = () => {
    onAnalyze(null, true);
  };

  return (
    <Card className="p-6 md:p-8 space-y-6 border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-xl">Upload Transaction History</CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1">
            Upload a CSV file containing your transaction history. Transaction Guardian will analyze the transactions for unusual patterns and risk signals.
          </CardDescription>
        </div>
      </div>

      {/* Upload Zone / Selected File Card */}
      {!selectedFile && !errorMessage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 ${
            isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 shadow-glow-shield mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>

          <p className="text-base font-bold text-slate-900 dark:text-slate-200">
            Drag & drop your CSV file here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            or <span className="text-cyan-600 dark:text-cyan-400 font-semibold underline underline-offset-2">Browse Files</span> from your computer
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              Supported format: CSV
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              Maximum file size: 10 MB
            </span>
          </div>
        </div>
      ) : selectedFile ? (
        /* Selected File Card */
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedFile.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ready to analyze</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full font-semibold shadow-glow-shield"
              onClick={() => onAnalyze(selectedFile, false)}
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-4 h-4 text-slate-950" />}
            >
              Analyze Transaction History
            </Button>
          </div>
        </div>
      ) : (
        /* Error State Card */
        <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
          <div className="p-3 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 w-12 h-12 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Unable to read this file</h4>
          <p className="text-xs text-rose-700 dark:text-rose-300 max-w-sm mx-auto">{errorMessage}</p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setErrorMessage(null)}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Demo Data Option */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>No CSV file ready?</span>
          <Badge variant="neutral" size="sm">Demo</Badge>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleDemoClick}
          isLoading={isLoading}
          leftIcon={<Play className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
          className="text-xs"
        >
          Try with Demo Data
        </Button>
      </div>
    </Card>
  );
};
