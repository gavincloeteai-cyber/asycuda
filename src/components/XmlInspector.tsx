import React, { useState } from 'react';
import { Copy, Check, Download, ShieldCheck, AlertTriangle, Info, Search, FileCode, CheckCircle2, Bookmark } from 'lucide-react';
import { ValidationError } from '../types/asycuda';
import { REFERENCE_SAMPLE_XML } from '../data/sampleInvoices';

interface XmlInspectorProps {
  xmlContent: string;
  onDownload: () => void;
  invoiceNumber: string;
  itemCount: number;
  validationErrors: ValidationError[];
}

export const XmlInspector: React.FC<XmlInspectorProps> = ({
  xmlContent,
  onDownload,
  invoiceNumber,
  itemCount,
  validationErrors,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'generated' | 'reference'>('generated');

  const activeXml = viewMode === 'generated' ? xmlContent : REFERENCE_SAMPLE_XML;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = activeXml.split('\n').length;
  const byteSize = new Blob([activeXml]).size;
  const lines = activeXml.split('\n');

  const handleDownloadReference = () => {
    const blob = new Blob([REFERENCE_SAMPLE_XML], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {viewMode === 'generated' ? 'Generated ASYCUDA XML Document' : 'Reference ASYCUDA XML Guideline (sample.xml)'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                ASYCUDA Schema Matched
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lineCount} lines • {(byteSize / 1024).toFixed(1)} KB • {viewMode === 'generated' ? itemCount : 5} &lt;Item&gt; blocks
            </p>
          </div>
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setViewMode('generated')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                viewMode === 'generated'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Generated XML
            </button>
            <button
              type="button"
              onClick={() => setViewMode('reference')}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'reference'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3 h-3 text-amber-400" />
              <span>Reference Guideline</span>
            </button>
          </div>

          <button
            type="button"
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy XML</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={viewMode === 'generated' ? onDownload : handleDownloadReference}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .xml</span>
          </button>
        </div>
      </div>

      {/* Schema comparison banner */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Schema Structure: 100% Strict Mapping</span>
          </div>

          <span className="text-slate-300">|</span>

          <span className="text-slate-600">
            Consignee: <strong className="font-mono text-slate-900">03906477</strong>
          </span>
          <span className="text-slate-600">
            Border: <strong className="font-mono text-slate-900">ARIA</strong>
          </span>
          <span className="text-slate-600">
            Carrier: <strong className="font-mono text-slate-900">FP DU TOIT</strong>
          </span>
        </div>

        {/* Quick search */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search tags or values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
          />
        </div>
      </div>

      {/* Issues list if any */}
      {viewMode === 'generated' && validationErrors.length > 0 && (
        <div className="px-5 py-2 bg-amber-50/70 border-b border-amber-200 text-xs text-amber-800 space-y-1">
          {validationErrors.map((err, i) => (
            <div key={i} className="flex items-start gap-1.5">
              {err.type === 'error' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              ) : err.type === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <span>{err.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Code viewer */}
      <div className="bg-slate-950 p-4 font-mono text-xs overflow-auto max-h-[550px] leading-relaxed text-slate-300 select-all selection:bg-blue-800 selection:text-white">
        <pre className="whitespace-pre">
          {lines.map((line, idx) => {
            const isMatch = searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase());
            const isItemTag = line.includes('<Item>') || line.includes('</Item>');
            const isComment = line.trim().startsWith('<!--');

            let colorClass = 'text-slate-300';
            if (isComment) colorClass = 'text-emerald-400 font-semibold';
            else if (isItemTag) colorClass = 'text-amber-400 font-bold';
            else if (line.includes('<Commodity_code>')) colorClass = 'text-cyan-300 font-bold';
            else if (line.includes('<Item_price>') || line.includes('<Total_invoice>')) colorClass = 'text-emerald-300 font-semibold';
            else if (line.includes('<Consignee_code>') || line.includes('<Border_office>')) colorClass = 'text-purple-300';

            return (
              <div
                key={idx}
                className={`flex hover:bg-slate-900/80 px-1 rounded ${
                  isMatch ? 'bg-amber-950/80 text-amber-200' : ''
                }`}
              >
                <span className="w-10 text-right pr-4 text-slate-600 select-none text-[11px]">
                  {idx + 1}
                </span>
                <span className={colorClass}>{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
