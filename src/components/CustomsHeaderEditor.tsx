import React from 'react';
import { InvoiceHeader, STANDARD_BORDER_OFFICES } from '../types/asycuda';
import { Building2, Truck, Landmark, Scale, RotateCcw, Check, Sparkles, Globe } from 'lucide-react';
import { inferCountryFromAddress } from '../utils/asycudaXmlGenerator';

interface CustomsHeaderEditorProps {
  header: InvoiceHeader;
  onChange: (updated: InvoiceHeader) => void;
  onResetFixedDefaults: () => void;
  onResetToBlank?: () => void;
  lineItemsNetWeight?: number;
}

export const CustomsHeaderEditor: React.FC<CustomsHeaderEditorProps> = ({
  header,
  onChange,
  onResetFixedDefaults,
  onResetToBlank,
  lineItemsNetWeight,
}) => {
  const updateField = (field: keyof InvoiceHeader, value: any) => {
    onChange({
      ...header,
      [field]: value,
    });
  };

  const handleSelectBorder = (code: string) => {
    const match = STANDARD_BORDER_OFFICES.find((b) => b.code === code);
    if (match) {
      onChange({
        ...header,
        borderOfficeCode: match.code,
        borderOfficeName: match.name,
      });
    }
  };

  const handleClearClick = onResetToBlank || onResetFixedDefaults;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            ASYCUDA Customs Header & Transport Configuration
          </h3>
          <p className="text-xs text-slate-500">
            Border control properties, trader credentials, transport identities, and valuation totals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearClick}
          className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs hover:shadow cursor-pointer"
          title="Clear all fields to blank ready for a new file"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Reset All Fields to Blank (New File)</span>
        </button>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Traders: Exporter & Consignee */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-slate-600" />
            1. Traders & Commercial Entities
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Exporter Code (Code / Reg No.)
              </label>
              <input
                type="text"
                placeholder="Exporter registration code"
                value={header.exporterCode || ''}
                onChange={(e) => updateField('exporterCode', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  Exporter Full Name & Complete Physical Address
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const det = inferCountryFromAddress(header.exporterName);
                      onChange({
                        ...header,
                        exportCountryCode: det.code,
                        exportCountryName: det.name,
                        countryOfOriginName: det.name,
                      });
                    }}
                    className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                    title="Infer Country of Export from address text"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    Auto-detect Country
                  </button>
                  <span className="text-[10px] text-blue-600 font-mono">Full Trading Address</span>
                </div>
              </div>
              <textarea
                rows={4}
                value={header.exporterName || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const det = inferCountryFromAddress(val);
                  onChange({
                    ...header,
                    exporterName: val,
                    // If exportCountryCode is empty or default, update it from address
                    exportCountryCode: header.exportCountryCode || det.code,
                    exportCountryName: header.exportCountryName || det.name,
                    countryOfOriginName: header.countryOfOriginName || det.name,
                  });
                }}
                placeholder="Company Name&#10;Street Address & Number, Building&#10;City, Postal Code&#10;Country (e.g. SOUTH AFRICA)"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs leading-relaxed font-sans"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Full multi-line physical / postal address for export clearance.
              </p>
            </div>

            {/* Block 15 C.E. & Block 16: Export Country & Origin */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Block 15 C.E. & Block 16 (Country of Export & Origin)
                </span>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                  {header.exportCountryCode || 'ZA'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    15 C.E. Code a (Export Country)
                  </label>
                  <input
                    type="text"
                    value={header.exportCountryCode || 'ZA'}
                    onChange={(e) => updateField('exportCountryCode', e.target.value.toUpperCase())}
                    placeholder="e.g. ZA"
                    className="w-full px-2 py-1 text-xs border border-blue-300 rounded bg-blue-50/40 font-mono font-bold text-blue-800 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    Export Country Name
                  </label>
                  <input
                    type="text"
                    value={header.exportCountryName || 'South Africa'}
                    onChange={(e) => updateField('exportCountryName', e.target.value)}
                    placeholder="e.g. South Africa"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    16 Country of Origin
                  </label>
                  <input
                    type="text"
                    value={header.countryOfOriginName || 'South Africa'}
                    onChange={(e) => updateField('countryOfOriginName', e.target.value)}
                    placeholder="e.g. South Africa"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    17 C.D. Destination Code
                  </label>
                  <input
                    type="text"
                    value={header.destinationCountryCode || 'NA'}
                    onChange={(e) => updateField('destinationCountryCode', e.target.value.toUpperCase())}
                    placeholder="e.g. NA"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono uppercase font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Quick Country Buttons */}
              <div className="flex items-center gap-1 pt-1 flex-wrap">
                <span className="text-[10px] text-slate-400">Quick set:</span>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...header,
                      exportCountryCode: 'ZA',
                      exportCountryName: 'South Africa',
                      countryOfOriginName: 'South Africa',
                      destinationCountryCode: 'NA',
                      destinationCountryName: 'Namibia',
                    });
                  }}
                  className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 cursor-pointer"
                >
                  ZA (South Africa) &rarr; NA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...header,
                      exportCountryCode: 'NA',
                      exportCountryName: 'Namibia',
                      countryOfOriginName: 'Namibia',
                      destinationCountryCode: 'ZA',
                      destinationCountryName: 'South Africa',
                    });
                  }}
                  className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 cursor-pointer"
                >
                  NA (Namibia) &rarr; ZA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...header,
                      exportCountryCode: 'BW',
                      exportCountryName: 'Botswana',
                      countryOfOriginName: 'Botswana',
                      destinationCountryCode: 'NA',
                      destinationCountryName: 'Namibia',
                    });
                  }}
                  className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 cursor-pointer"
                >
                  BW (Botswana) &rarr; NA
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  Consignee Code (VAT / TIN / Importer No.)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">From Invoice (No Default)</span>
              </div>
              <input
                type="text"
                placeholder="Enter Consignee VAT or Importer Code (optional)"
                value={header.consigneeCode || ''}
                onChange={(e) => updateField('consigneeCode', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  Consignee Full Name & Destination Delivery Address
                </label>
                <span className="text-[10px] text-blue-600 font-mono">Full Delivery Address</span>
              </div>
              <textarea
                rows={4}
                value={header.consigneeName || ''}
                onChange={(e) => updateField('consigneeName', e.target.value)}
                placeholder="Consignee Legal Name&#10;Farm / Plot details&#10;Town / District&#10;NAMIBIA"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs leading-relaxed font-sans"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Full physical destination farm / warehouse address where goods will be imported.
              </p>
            </div>
          </div>
        </div>

        {/* Transport & Border Office */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
            <Truck className="w-4 h-4 text-slate-600" />
            2. Transport & Border Clearance Office
          </div>

          <div className="space-y-3">
            {/* Border Office Selection Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  Customs Border Clearance Office (Port of Entry)
                </label>
                <span className="text-[10px] text-indigo-600 font-mono font-bold">
                  {header.borderOfficeCode || 'ARIA'}
                </span>
              </div>

              {/* Standard Border Selector Dropdown */}
              <select
                value={header.borderOfficeCode || 'ARIA'}
                onChange={(e) => handleSelectBorder(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 bg-white rounded-lg font-semibold text-xs text-indigo-900 shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {STANDARD_BORDER_OFFICES.map((border) => (
                  <option key={border.code} value={border.code}>
                    {border.code} - {border.name} ({border.description})
                  </option>
                ))}
              </select>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-medium">Quick Select:</span>
                {STANDARD_BORDER_OFFICES.map((b) => {
                  const isSelected = header.borderOfficeCode === b.code;
                  return (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => handleSelectBorder(b.code)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {b.code} - {b.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Customs Office Code
                </label>
                <input
                  type="text"
                  value={header.borderOfficeCode || 'ARIA'}
                  onChange={(e) => updateField('borderOfficeCode', e.target.value.toUpperCase())}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold text-indigo-700 uppercase"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Customs Office Name
                </label>
                <input
                  type="text"
                  value={header.borderOfficeName || 'Ariamsvlei'}
                  onChange={(e) => updateField('borderOfficeName', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  Transport Identity (Vehicle Regs)
                </label>
                <span className="text-[10px] text-blue-600 font-mono">Truck / Trailers</span>
              </div>
              <input
                type="text"
                value={header.transportIdentity || 'DBZ126NC / CNY564ND / CNY56FS'}
                onChange={(e) => updateField('transportIdentity', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700">
                  Carrier / Transporter
                </label>
                <span className="text-[10px] text-blue-600 font-mono">Req: FP DU TOIT</span>
              </div>
              <input
                type="text"
                value={header.carrier || 'FP DU TOIT'}
                onChange={(e) => updateField('carrier', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Delivery IncoTerms
                </label>
                <input
                  type="text"
                  value={header.deliveryTermsCode || 'CIF'}
                  onChange={(e) => updateField('deliveryTermsCode', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Terms Place / Farm
                </label>
                <input
                  type="text"
                  value={header.deliveryTermsPlace || 'Aussenkher Farm'}
                  onChange={(e) => updateField('deliveryTermsPlace', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Declarant & Reference Identification */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-slate-600" />
            3. Customs Declarant & Reference (UCR)
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Commercial Invoice Ref
                </label>
                <input
                  type="text"
                  value={header.referenceNumber || header.invoiceNumber || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({
                      ...header,
                      referenceNumber: val,
                      invoiceNumber: val,
                      ucr: `6ZA${header.exporterCode || '25617343'}CINV${val}`,
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={header.invoiceDate || ''}
                  onChange={(e) => updateField('invoiceDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Unique Consignment Reference (UCR)
              </label>
              <input
                type="text"
                value={header.ucr || ''}
                onChange={(e) => updateField('ucr', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-purple-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Declarant Code
                </label>
                <input
                  type="text"
                  value={header.declarantCode || '05204044'}
                  onChange={(e) => updateField('declarantCode', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Declarant Name
                </label>
                <input
                  type="text"
                  value={header.declarantName || 'Goreefers Logistics Namibia P.O.Box 20Noordoewer'}
                  onChange={(e) => updateField('declarantName', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Valuation, Weights & Currency */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4 text-slate-600" />
            4. Valuation & Weights Summary
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-700">
                    Total Commercial Invoice Amount (Customs Value)
                  </label>
                  <span className="text-[10px] text-blue-600 font-mono font-semibold">Customs Value</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={header.totalInvoiceAmount}
                  onChange={(e) => {
                    const amt = parseFloat(e.target.value) || 0;
                    const freight = Math.round(amt * 0.05 * 100) / 100;
                    onChange({
                      ...header,
                      totalInvoiceAmount: amt,
                      freightCost: freight,
                      totalCif: Math.round((amt + freight) * 100) / 100,
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-700">
                    Transport / Internal Freight (Gs_internal)
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold font-mono">
                    5% of Customs Value
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    value={header.freightCost}
                    onChange={(e) => {
                      const f = parseFloat(e.target.value) || 0;
                      onChange({
                        ...header,
                        freightCost: f,
                        totalCif: Math.round(((header.totalInvoiceAmount || 0) + f) * 100) / 100,
                      });
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold text-indigo-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const f = Math.round((header.totalInvoiceAmount || 0) * 0.05 * 100) / 100;
                      onChange({
                        ...header,
                        freightCost: f,
                        totalCif: Math.round(((header.totalInvoiceAmount || 0) + f) * 100) / 100,
                      });
                    }}
                    className="px-2.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono whitespace-nowrap cursor-pointer transition-colors"
                    title="Set Transport to exactly 5% of customs value"
                  >
                    Reset 5%
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Mandatory rule: Transport must always be 5% of the customs value (5% = {header.currencyCode || 'ZAR'} {((header.totalInvoiceAmount || 0) * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={header.currencyCode || 'ZAR'}
                  onChange={(e) => updateField('currencyCode', e.target.value.toUpperCase())}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Exchange Rate
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={header.currencyRate || 1}
                  onChange={(e) => updateField('currencyRate', parseFloat(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Total CIF (Invoice + Freight)
                </label>
                <div className="px-2.5 py-1.5 border border-emerald-300 bg-emerald-50 rounded font-mono font-bold text-emerald-800">
                  {((header.totalInvoiceAmount || 0) + (header.freightCost || 0)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Block 35: Gross Mass (kg)
                  </label>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 font-bold">
                    Box 35
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={header.grossWeight || 0}
                    onChange={(e) => updateField('grossWeight', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-2.5 py-1.5 border border-purple-300 rounded bg-white font-mono font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const net = header.netWeight || lineItemsNetWeight || 0;
                      const estimated = Math.round(net * 1.03 * 10) / 10;
                      updateField('grossWeight', estimated);
                    }}
                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded text-[11px] font-bold cursor-pointer whitespace-nowrap"
                    title="Estimate Gross Weight using fallback rule: Net Weight × 1.03"
                  >
                    Net &times; 1.03
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Maps to &lt;Valuation&gt;&lt;Weight&gt;&lt;Gross_weight&gt;. Fallback rule: Net &times; 1.03 if missing.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Block 38: Net Mass (kg)
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                    Box 38
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={header.netWeight || 0}
                    onChange={(e) => updateField('netWeight', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-2.5 py-1.5 border border-emerald-300 rounded bg-white font-mono font-bold text-slate-900"
                  />
                  {lineItemsNetWeight !== undefined && lineItemsNetWeight > 0 && (
                    <button
                      type="button"
                      onClick={() => updateField('netWeight', Math.round(lineItemsNetWeight * 10) / 10)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold cursor-pointer whitespace-nowrap"
                      title="Set Net Weight to sum of line items weight"
                    >
                      Lines ({lineItemsNetWeight.toFixed(1)} kg)
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  Maps to &lt;Valuation&gt;&lt;Total&gt;&lt;Total_weight&gt;. Extracted or calculated from invoice lines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
