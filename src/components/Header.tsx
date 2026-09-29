import React from 'react';
import { FileText, ShieldCheck, Download, Sparkles, RefreshCw, MapPin, RotateCcw, Share2 } from 'lucide-react';
import { STANDARD_BORDER_OFFICES } from '../types/asycuda';

interface HeaderProps {
  onLoadMolenaar: () => void;
  onLoadAgriTech: () => void;
  onDownloadXml: () => void;
  hasDeclaration: boolean;
  itemCount: number;
  hsGroupCount: number;
  borderOfficeCode?: string;
  onSelectBorder?: (code: string) => void;
  onResetToBlank?: () => void;
  onOpenShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadMolenaar,
  onLoadAgriTech,
  onDownloadXml,
  hasDeclaration,
  itemCount,
  hsGroupCount,
  borderOfficeCode = 'ARIA',
  onSelectBorder,
  onResetToBlank,
  onOpenShare,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-inner text-white font-black tracking-wider">
              <span className="text-sm font-mono">ASY</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  ASYCUDA Customs XML Generator
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Commercial Invoice PDF/Image parser & HS-code grouped XML builder
              </p>
            </div>
          </div>

          {/* Border Office Dropdown in Header */}
          {onSelectBorder && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-indigo-700/60 rounded-lg px-2.5 py-1.5 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <label htmlFor="header-border-select" className="text-[11px] font-semibold text-indigo-300 hidden md:inline">
                Border Office:
              </label>
              <select
                id="header-border-select"
                value={borderOfficeCode}
                onChange={(e) => onSelectBorder(e.target.value)}
                className="bg-slate-900 text-indigo-100 font-bold font-mono text-xs rounded px-2 py-0.5 border border-indigo-600/50 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                title="Select Customs Port of Entry (NOOR - Noordoewer, TKL - Transkalahari, ARIA - Ariamsvlei)"
              >
                <option value="ARIA">ARIA - Ariamsvlei</option>
                <option value="NOOR">NOOR - Noordoewer</option>
                <option value="TKL">TKL - Transkalahari</option>
              </select>
            </div>
          )}

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            {hasDeclaration && (
              <div className="hidden md:flex items-center gap-4 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-400">Lines:</span>
                  <span className="font-semibold text-white">{itemCount}</span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <div className="flex items-center gap-1.5 text-blue-300">
                  <span className="text-slate-400">HS Groups:</span>
                  <span className="font-semibold text-blue-400">{hsGroupCount} Items</span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <div className="flex items-center gap-1 text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Valid XML</span>
                </div>
              </div>
            )}

            {/* Quick Sample Dropdown / Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {onResetToBlank && (
                <button
                  type="button"
                  onClick={onResetToBlank}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Clear all fields to blank so you can proceed with a fresh new invoice"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear All / New</span>
                </button>
              )}
              <button
                type="button"
                onClick={onLoadMolenaar}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Load Molenaar reference invoice matching reference XML"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Reference Invoice</span>
              </button>
              <button
                type="button"
                onClick={onLoadAgriTech}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Load agricultural irrigation invoice with 4 HS groups"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Agri-Irrigation Sample</span>
              </button>
            </div>

            {/* Share with Colleagues Button */}
            {onOpenShare && (
              <button
                type="button"
                onClick={onOpenShare}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Share this project link with colleagues or download offline HTML"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            {/* Primary Download XML */}
            {hasDeclaration && (
              <button
                type="button"
                onClick={onDownloadXml}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all hover:shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ASYCUDA XML</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
