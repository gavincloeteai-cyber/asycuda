import React, { useState, useRef } from 'react';
import { Upload, FileUp, Sparkles, AlertCircle, FileCheck, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { generateSampleInvoiceImage } from '../utils/invoiceImageGenerator';
import { MOLENAAR_SAMPLE } from '../data/sampleInvoices';

interface FileUploadZoneProps {
  onParseInvoice: (fileBase64: string, mimeType: string, fileName: string) => Promise<void>;
  isLoading: boolean;
  onLoadMolenaar: () => void;
  onLoadAgriTech: () => void;
  currentFileName?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onParseInvoice,
  isLoading,
  onLoadMolenaar,
  onLoadAgriTech,
  currentFileName,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localFile, setLocalFile] = useState<{ name: string; size: number; type: string; previewUrl?: string } | null>(null);
  const [lastPayload, setLastPayload] = useState<{ base64: string; mimeType: string; fileName: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [is503Error, setIs503Error] = useState(false);
  const [parseStage, setParseStage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanErrorMessage = (raw: any): { text: string; is503: boolean } => {
    let msg = typeof raw === 'string' ? raw : raw?.message || String(raw);
    let is503 = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand');

    try {
      if (msg.trim().startsWith('{')) {
        const parsed = JSON.parse(msg);
        if (parsed.error?.message) {
          msg = parsed.error.message;
        }
      }
    } catch {
      // not json
    }

    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      is503 = true;
      msg = 'Gemini AI is currently experiencing temporary high demand spikes (503 Service Unavailable). Please click "Retry Analysis" or proceed immediately with the pre-verified Reference XML.';
    }

    return { text: msg, is503 };
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIs503Error(false);

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Unsupported file format. Please upload a PDF or Image (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds 20MB limit. Please upload a smaller document.');
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    setLocalFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
      previewUrl,
    });

    try {
      setParseStage('Reading document binary...');
      const reader = new FileReader();
      reader.onload = async () => {
        const resultStr = reader.result as string;
        const base64Data = resultStr.split(',')[1];
        const mimeType = file.type || 'application/pdf';

        setLastPayload({ base64: base64Data, mimeType, fileName: file.name });
        setParseStage('Calling Gemini Vision & Customs Parser...');

        try {
          await onParseInvoice(base64Data, mimeType, file.name);
          setErrorMessage(null);
          setIs503Error(false);
        } catch (err: any) {
          const { text, is503 } = cleanErrorMessage(err.message || err);
          setErrorMessage(text);
          setIs503Error(is503);
        } finally {
          setParseStage('');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      const { text, is503 } = cleanErrorMessage(err.message || err);
      setErrorMessage(text);
      setIs503Error(is503);
      setParseStage('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Generate an authentic invoice image on the fly and trigger real Gemini parsing for the Molenaar invoice
  const handleTestWithGeminiMolenaarImage = async () => {
    setErrorMessage(null);
    setIs503Error(false);
    try {
      setParseStage('Generating authentic Molenaar invoice document...');
      const { base64, dataUrl } = await generateSampleInvoiceImage(
        MOLENAAR_SAMPLE.header.invoiceNumber,
        MOLENAAR_SAMPLE.header.exporterName,
        MOLENAAR_SAMPLE.header.consigneeName,
        MOLENAAR_SAMPLE.lineItems,
        MOLENAAR_SAMPLE.header.currencyCode,
        MOLENAAR_SAMPLE.header.totalInvoiceAmount,
        MOLENAAR_SAMPLE.header.freightCost
      );

      const fileName = 'Molenaar_Invoice_622967.png';
      setLocalFile({
        name: fileName,
        size: Math.round((base64.length * 3) / 4),
        type: 'image/png',
        previewUrl: dataUrl,
      });

      setLastPayload({ base64, mimeType: 'image/png', fileName });
      setParseStage('Sending invoice image to Gemini AI for OCR & ASYCUDA extraction...');

      try {
        await onParseInvoice(base64, 'image/png', fileName);
        setErrorMessage(null);
        setIs503Error(false);
      } catch (err: any) {
        console.warn('AI Test error caught:', err);
        const { text, is503 } = cleanErrorMessage(err.message || err);
        setErrorMessage(text);
        setIs503Error(is503);
      } finally {
        setParseStage('');
      }
    } catch (err: any) {
      const { text, is503 } = cleanErrorMessage(err.message || err);
      setErrorMessage(text);
      setIs503Error(is503);
      setParseStage('');
    }
  };

  const handleRetryLast = async () => {
    if (!lastPayload) return;
    setErrorMessage(null);
    setIs503Error(false);
    setParseStage('Retrying Gemini parsing...');
    try {
      await onParseInvoice(lastPayload.base64, lastPayload.mimeType, lastPayload.fileName);
      setErrorMessage(null);
      setIs503Error(false);
    } catch (err: any) {
      const { text, is503 } = cleanErrorMessage(err.message || err);
      setErrorMessage(text);
      setIs503Error(is503);
    } finally {
      setParseStage('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            Upload Commercial Invoice (PDF or Image)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gemini parses header details, extracts invoice line items, detects tariff classifications, and aggregates by 8-digit HS Code into ASYCUDA XML.
          </p>
        </div>

        {/* Quick test buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestWithGeminiMolenaarImage}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Generate & send Molenaar Commercial Invoice image to Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Parse Molenaar Invoice (AI Test)</span>
          </button>
          <button
            type="button"
            onClick={onLoadMolenaar}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Instant reference XML without network latency"
          >
            <FileCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Instant Reference XML</span>
          </button>
        </div>
      </div>

      {/* Drop area */}
      <div className="mt-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
          />

          {isLoading ? (
            <div className="py-4 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-800">
                {parseStage || 'Processing Invoice with Gemini AI...'}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span>Extracting line items</span>
                <span>•</span>
                <span>Resolving 8-digit HS Codes</span>
                <span>•</span>
                <span>Aggregating Tariff Groups</span>
              </div>
            </div>
          ) : localFile ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                {localFile.previewUrl ? (
                  <img
                    src={localFile.previewUrl}
                    alt="Invoice thumbnail"
                    className="w-14 h-18 object-cover rounded border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-14 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{localFile.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(localFile.size / 1024).toFixed(1)} KB • Click or drop another invoice to re-parse
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                <FileUp className="w-4 h-4" />
                <span>Replace Document</span>
              </div>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
                <FileUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Drag and drop your Commercial Invoice PDF or Image here
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Supports PDF invoices, scans, and photos (PNG, JPEG, WEBP up to 20MB). Automatically extracts tables, line items, and HS tariff codes.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-700 hover:bg-slate-50">
                Browse Files
              </div>
            </div>
          )}
        </div>

        {/* Clean, user-friendly error notice with recovery buttons */}
        {errorMessage && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">
                  {is503Error ? 'Gemini AI High Demand Alert: ' : 'Parsing Notice: '}
                </span>
                <span>{errorMessage}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {lastPayload && (
                <button
                  type="button"
                  onClick={handleRetryLast}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Analysis</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onLoadMolenaar();
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Use Reference Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

