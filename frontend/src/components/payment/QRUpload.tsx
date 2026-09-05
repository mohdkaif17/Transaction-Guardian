import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { QrCode, UploadCloud, CheckCircle2, ArrowRight, AlertTriangle, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { PaymentCheckInput, PrePaymentRiskResult } from '../../services/mockRiskService';
import { analyzeQrApi, BackendQRDecoded } from '../../services/api';

export interface QRUploadProps {
  onQrParsed: (data: Partial<PaymentCheckInput>, riskResult?: PrePaymentRiskResult) => void;
  onSwitchToManual: () => void;
}

export const QRUpload: React.FC<QRUploadProps> = ({
  onQrParsed,
  onSwitchToManual,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<BackendQRDecoded | null>(null);
  const [detectedData, setDetectedData] = useState<Partial<PaymentCheckInput> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PrePaymentRiskResult | null>(null);
  const [manualAmount, setManualAmount] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setFileName(file.name);
    setUploadedFile(file);
    setIsProcessing(true);
    setErrorMsg(null);
    setDetectedData(null);
    setAnalysisResult(null);

    try {
      const { decoded, riskResult } = await analyzeQrApi(file);
      setDecodedPayload(decoded);
      setAnalysisResult(riskResult);

      const parsed: Partial<PaymentCheckInput> = {
        upiId: decoded.upi_id || 'unknown@upi',
        recipientName: decoded.payee_name || decoded.upi_id || 'Unknown Recipient',
        amount: decoded.amount ?? undefined,
        category: 'Transfer',
      };

      setDetectedData(parsed);
      if (decoded.amount) {
        setManualAmount(decoded.amount.toString());
      }
    } catch (err: any) {
      console.error('QR Decode error:', err);
      setErrorMsg(err.message || 'Failed to decode QR image. Please upload a valid UPI QR code.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleProceedWithDetected = async () => {
    if (!detectedData) return;

    const parsedAmount = parseFloat(manualAmount);
    if ((!detectedData.amount || detectedData.amount <= 0) && parsedAmount > 0 && uploadedFile) {
      try {
        setIsProcessing(true);
        const { riskResult } = await analyzeQrApi(uploadedFile, parsedAmount);
        onQrParsed({ ...detectedData, amount: parsedAmount }, riskResult);
        return;
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to analyze payment.');
        setIsProcessing(false);
        return;
      }
    }

    if (analysisResult) {
      onQrParsed(detectedData, analysisResult);
    } else {
      onQrParsed(detectedData);
    }
  };

  const resetUpload = () => {
    setDetectedData(null);
    setAnalysisResult(null);
    setDecodedPayload(null);
    setUploadedFile(null);
    setFileName(null);
    setErrorMsg(null);
    setManualAmount('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Error notification if QR decode fails */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-3 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">QR Code Decoding Error</p>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">{errorMsg}</p>
            <button
              type="button"
              onClick={resetUpload}
              className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 underline mt-1 block"
            >
              Try Uploading Another File
            </button>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!detectedData ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 ${
            isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Big QrCode Icon */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 shadow-glow-shield mb-4">
            <QrCode className="w-10 h-10" />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Scan a UPI QR Code</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5 leading-relaxed">
            Upload a UPI QR code image to decode recipient details and verify payment safety.
          </p>

          <Button
            type="button"
            size="md"
            variant="secondary"
            leftIcon={<UploadCloud className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
            isLoading={isProcessing}
          >
            {isProcessing ? 'Decoding QR Payload...' : 'Upload QR Image'}
          </Button>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 font-mono">
            Supported format: PNG, JPG, JPEG
          </p>
        </div>
      ) : (
        /* DETECTED QR PAYMENT DETAILS BANNER */
        <div className="space-y-4 p-5 rounded-xl bg-white dark:bg-slate-950/80 border border-amber-500/40 dark:border-amber-500/30 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest font-mono">
                PAYMENT DETAILS DETECTED
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {fileName || 'QR_Payload.png'}
            </span>
          </div>

          {/* WARNING BANNER: OUTGOING MONEY */}
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">⚠️ YOU ARE ABOUT TO SEND MONEY</p>
              <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                Scanning this QR code will initiate an <strong>OUTGOING</strong> payment from your bank account. QR codes are for paying money, not receiving refunds.
              </p>
            </div>
          </div>

          {/* Extracted Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Recipient VPA</span>
              <p className="font-mono font-bold text-cyan-700 dark:text-cyan-400 truncate">{detectedData.upiId}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Amount</span>
              {detectedData.amount !== undefined && detectedData.amount > 0 ? (
                <p className="font-mono font-bold text-slate-900 dark:text-white">₹{detectedData.amount.toLocaleString('en-IN')}</p>
              ) : (
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                />
              )}
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Payment Direction</span>
              <p className="font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> OUTGOING
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={resetUpload}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline"
            >
              Scan Different QR
            </button>
            <Button
              type="button"
              size="md"
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              onClick={handleProceedWithDetected}
              isLoading={isProcessing}
            >
              Check Payment Safety Now
            </Button>
          </div>
        </div>
      )}

      {/* Switch to manual option */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
        <span className="text-xs text-slate-500 dark:text-slate-400">Prefer typing the address?</span>
        <button
          type="button"
          onClick={onSwitchToManual}
          className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
        >
          Enter details manually <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

