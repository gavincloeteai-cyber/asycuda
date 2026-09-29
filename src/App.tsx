import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUploadZone } from './components/FileUploadZone';
import { HsGroupingOverview } from './components/HsGroupingOverview';
import { LineItemsTable } from './components/LineItemsTable';
import { CustomsHeaderEditor } from './components/CustomsHeaderEditor';
import { XmlInspector } from './components/XmlInspector';
import { ShareModal } from './components/ShareModal';
import { MOLENAAR_SAMPLE, AGRITECH_SAMPLE } from './data/sampleInvoices';
import { AsycudaDeclaration, GroupedHsItem, RawInvoiceLineItem, InvoiceHeader, STANDARD_BORDER_OFFICES } from './types/asycuda';
import { generateAsycudaXml, validateAsycudaDeclaration, downloadXmlFile } from './utils/asycudaXmlGenerator';
import { Layers, ListOrdered, Building2, Code2, CheckCircle2, ArrowRight, MapPin, Scale } from 'lucide-react';

export default function App() {
  // Start with Molenaar reference sample preloaded so user immediately sees reference ASYCUDA declaration
  const [declaration, setDeclaration] = useState<AsycudaDeclaration>(MOLENAAR_SAMPLE);
  const [activeTab, setActiveTab] = useState<'hs_groups' | 'line_items' | 'header' | 'xml'>('hs_groups');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentFileName, setCurrentFileName] = useState<string>('Molenaar_Invoice_622967.pdf');
  const [notice, setNotice] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Compute live ASYCUDA XML string whenever declaration changes
  const xmlContent = useMemo(() => {
    return generateAsycudaXml(declaration);
  }, [declaration]);

  // Compute validation errors whenever declaration changes
  const validationErrors = useMemo(() => {
    return validateAsycudaDeclaration(declaration);
  }, [declaration]);

  // Handle invoice parsing with Gemini API via backend /api/parse-invoice
  const handleParseInvoice = async (fileBase64: string, mimeType: string, fileName: string) => {
    setIsLoading(true);
    setNotice(null);
    try {
      const response = await fetch('/api/parse-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          mimeType,
          fileName,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server error while parsing commercial invoice.');
      }

      setDeclaration(data.declaration);
      setCurrentFileName(fileName);
      if (data.notice) {
        setNotice(data.notice);
      } else {
        setNotice(`Successfully parsed "${fileName}". Extracted ${data.declaration.lineItems?.length || 0} line items into ${data.declaration.hsGroups?.length || 0} HS tariff groups.`);
      }
      setActiveTab('hs_groups');
    } catch (err: any) {
      console.error('Invoice parse error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMolenaar = () => {
    setDeclaration(MOLENAAR_SAMPLE);
    setCurrentFileName('Molenaar_Invoice_622967.pdf');
    setNotice('Loaded official Molenaar reference commercial invoice matching the reference ASYCUDA XML specification.');
  };

  const handleLoadAgriTech = () => {
    setDeclaration(AGRITECH_SAMPLE);
    setCurrentFileName('AgriTech_Irrigation_Invoice_773914.pdf');
    setNotice('Loaded AgriTech Irrigation multi-item invoice with 4 distinct HS tariff groups.');
  };

  const handleDownloadXml = () => {
    const filename = `ASYCUDA_Declaration_${declaration.header.invoiceNumber || 'CUSTOMS'}.xml`;
    downloadXmlFile(xmlContent, filename);
  };

  // Re-aggregate line items into HS groups whenever lines are added/modified
  const handleRegroupByHsCode = () => {
    const lines = declaration.lineItems;
    const groupsMap = new Map<string, {
      items: RawInvoiceLineItem[];
      totalPrice: number;
      totalPackages: number;
      totalNetWeight: number;
      totalGrossWeight: number;
      pkgCode: string;
      pkgName: string;
    }>();

    lines.forEach((line) => {
      const code = (line.hsCode || '00000000').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
      const existing = groupsMap.get(code) || {
        items: [],
        totalPrice: 0,
        totalPackages: 0,
        totalNetWeight: 0,
        totalGrossWeight: 0,
        pkgCode: line.unit || 'PC',
        pkgName: line.unit === 'BX' ? 'BOX' : line.unit === 'UN' ? 'UNIT' : 'PIECES',
      };
      existing.items.push(line);
      existing.totalPrice += line.totalAmount || 0;
      existing.totalPackages += line.quantity || 1;
      existing.totalNetWeight += line.netWeight || 0;
      existing.totalGrossWeight += line.grossWeight || 0;
      groupsMap.set(code, existing);
    });

    const newHsGroups: GroupedHsItem[] = [];
    groupsMap.forEach((val, commCode) => {
      // Find existing group metadata if already present
      const existingGrp = declaration.hsGroups.find((g) => g.commodityCode === commCode);
      const commercialDesc = val.items.map((it) => it.description).join('; ');

      newHsGroups.push({
        commodityCode: commCode,
        precision1: existingGrp?.precision1 || '000',
        preferenceCode: existingGrp?.preferenceCode || 'SCU',
        extendedCustomsProcedure: existingGrp?.extendedCustomsProcedure || '4000',
        nationalCustomsProcedure: existingGrp?.nationalCustomsProcedure || '016',
        numberOfPackages: val.totalPackages,
        kindOfPackagesCode: val.pkgCode,
        kindOfPackagesName: val.pkgName,
        descriptionOfGoods: existingGrp?.descriptionOfGoods || `Goods of HS ${commCode}`,
        commercialDescription: commercialDesc,
        countryOfOriginCode: declaration.header.exportCountryCode || 'ZA',
        itemPrice: Math.round(val.totalPrice * 100) / 100,
        valueItem: Math.round(val.totalPrice * 100) / 100,
        netWeight: Math.round(val.totalNetWeight * 10) / 10,
        grossWeight: Math.round(val.totalGrossWeight * 10) / 10,
      });
    });

    const sumLines = lines.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const sumNetWeight = lines.reduce((acc, curr) => acc + (curr.netWeight || 0), 0);
    const sumGrossWeight = lines.reduce((acc, curr) => acc + (curr.grossWeight || 0), 0);

    const totalInv = Math.round(sumLines * 100) / 100;
    const freight5Pct = Math.round(totalInv * 0.05 * 100) / 100;

    const updatedHeader: InvoiceHeader = {
      ...declaration.header,
      totalInvoiceAmount: totalInv,
      freightCost: freight5Pct,
      totalCif: Math.round((totalInv + freight5Pct) * 100) / 100,
      netWeight: Math.round(sumNetWeight * 10) / 10,
      grossWeight: Math.round(sumGrossWeight * 10) / 10,
    };

    setDeclaration({
      ...declaration,
      header: updatedHeader,
      hsGroups: newHsGroups,
    });
    setNotice(`Re-aggregated line items into ${newHsGroups.length} HS groups. Transport automatically updated to 5% (${updatedHeader.currencyCode || 'ZAR'} ${(freight5Pct || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`);
  };

  // Updaters for HS Groups
  const handleUpdateHsGroup = (index: number, updated: GroupedHsItem) => {
    const updatedGroups = [...declaration.hsGroups];
    updatedGroups[index] = updated;
    const sumPrices = updatedGroups.reduce((acc, g) => acc + (g.itemPrice || 0), 0);
    const totalInv = Math.round(sumPrices * 100) / 100;
    const freight5Pct = Math.round(totalInv * 0.05 * 100) / 100;

    setDeclaration({
      ...declaration,
      hsGroups: updatedGroups,
      header: {
        ...declaration.header,
        totalInvoiceAmount: totalInv,
        freightCost: freight5Pct,
        totalCif: Math.round((totalInv + freight5Pct) * 100) / 100,
      },
    });
  };

  const handleDeleteHsGroup = (index: number) => {
    const updatedGroups = declaration.hsGroups.filter((_, i) => i !== index);
    setDeclaration({
      ...declaration,
      hsGroups: updatedGroups,
    });
  };

  const handleAddHsGroup = () => {
    const newGroup: GroupedHsItem = {
      commodityCode: '84000000',
      precision1: '000',
      preferenceCode: 'SCU',
      extendedCustomsProcedure: '4000',
      nationalCustomsProcedure: '016',
      numberOfPackages: 1,
      kindOfPackagesCode: 'PC',
      kindOfPackagesName: 'PIECES',
      descriptionOfGoods: 'Customs declared commodities',
      commercialDescription: 'NEW COMMERCIAL ITEM',
      countryOfOriginCode: declaration.header.exportCountryCode || 'ZA',
      itemPrice: 1000.0,
      valueItem: 1000.0,
      netWeight: 10.0,
      grossWeight: 11.0,
    };
    setDeclaration({
      ...declaration,
      hsGroups: [...declaration.hsGroups, newGroup],
    });
  };

  // Updaters for Raw Line Items
  const handleUpdateLineItem = (index: number, updated: RawInvoiceLineItem) => {
    const updatedLines = [...declaration.lineItems];
    updatedLines[index] = updated;
    setDeclaration({
      ...declaration,
      lineItems: updatedLines,
    });
  };

  const handleDeleteLineItem = (index: number) => {
    const updatedLines = declaration.lineItems.filter((_, i) => i !== index);
    setDeclaration({
      ...declaration,
      lineItems: updatedLines,
    });
  };

  const handleAddLineItem = () => {
    const nextNum = declaration.lineItems.length + 1;
    const newLine: RawInvoiceLineItem = {
      lineNumber: nextNum,
      itemCode: `ITEM-${nextNum}`,
      description: 'New invoice product item',
      hsCode: '84000000',
      quantity: 1,
      unit: 'PC',
      unitPrice: 500.0,
      totalAmount: 500.0,
      countryOfOrigin: declaration.header.exportCountryCode || 'ZA',
      netWeight: 10.0,
      grossWeight: 11.0,
    };
    setDeclaration({
      ...declaration,
      lineItems: [...declaration.lineItems, newLine],
    });
  };

  const handleResetToBlank = () => {
    const blankDeclaration: AsycudaDeclaration = {
      header: {
        invoiceNumber: '',
        invoiceDate: '',
        ucr: '',
        exporterCode: '',
        exporterName: '',
        consigneeCode: '',
        consigneeName: '',
        declarantCode: '',
        declarantName: '',
        referenceNumber: '',
        exportCountryCode: '',
        exportCountryName: '',
        destinationCountryCode: 'NA',
        destinationCountryName: 'Namibia',
        countryOfOriginName: '',
        transportIdentity: '',
        transportNationality: '',
        carrier: '',
        transportMode: '3',
        borderOfficeCode: declaration.header.borderOfficeCode || 'ARIA',
        borderOfficeName: declaration.header.borderOfficeName || 'Ariamsvlei',
        deliveryTermsCode: 'CIF',
        deliveryTermsPlace: '',
        locationOfGoods: '',
        bankCode: '',
        bankName: '',
        paymentTermsCode: '',
        paymentTermsDescription: '',
        modeOfPayment: '',
        currencyCode: 'ZAR',
        currencyName: 'South African Rand',
        currencyRate: 1,
        totalInvoiceAmount: 0,
        freightCost: 0,
        totalCif: 0,
        grossWeight: 0,
        netWeight: 0,
      },
      lineItems: [],
      hsGroups: [],
    };
    setDeclaration(blankDeclaration);
    setCurrentFileName('');
    setNotice('All fields have been cleared to blank. Ready for a new commercial invoice file.');
  };

  const handleSelectBorder = (code: string) => {
    const match = STANDARD_BORDER_OFFICES.find((b) => b.code === code);
    if (match) {
      setDeclaration((prev) => ({
        ...prev,
        header: {
          ...prev.header,
          borderOfficeCode: match.code,
          borderOfficeName: match.name,
        },
      }));
      setNotice(`Border clearance post set to ${match.code} - ${match.name}. XML updated.`);
    }
  };

  const handleDistributeHeaderWeight = () => {
    const lines = declaration.lineItems;
    if (lines.length === 0) return;

    const headerNet = declaration.header.netWeight || 18000;
    const headerGross = declaration.header.grossWeight || 19120;
    const totalVal = lines.reduce((acc, l) => acc + (l.totalAmount || 0), 0) || 1;

    const updatedLines = lines.map((line) => {
      const share = (line.totalAmount || 0) / totalVal;
      const net = Math.round(headerNet * share * 10) / 10;
      const gross = Math.round(headerGross * share * 10) / 10;
      return {
        ...line,
        netWeight: net,
        grossWeight: gross,
      };
    });

    // Re-aggregate groups to sync weights
    const groupsMap = new Map<string, {
      items: RawInvoiceLineItem[];
      totalPrice: number;
      totalPackages: number;
      totalNetWeight: number;
      totalGrossWeight: number;
      pkgCode: string;
      pkgName: string;
    }>();

    updatedLines.forEach((line) => {
      const code = (line.hsCode || '00000000').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
      const existing = groupsMap.get(code) || {
        items: [],
        totalPrice: 0,
        totalPackages: 0,
        totalNetWeight: 0,
        totalGrossWeight: 0,
        pkgCode: line.unit || 'PC',
        pkgName: line.unit === 'BX' ? 'BOX' : line.unit === 'UN' ? 'UNIT' : 'PIECES',
      };
      existing.items.push(line);
      existing.totalPrice += line.totalAmount || 0;
      existing.totalPackages += line.quantity || 1;
      existing.totalNetWeight += line.netWeight || 0;
      existing.totalGrossWeight += line.grossWeight || 0;
      groupsMap.set(code, existing);
    });

    const newHsGroups: GroupedHsItem[] = [];
    groupsMap.forEach((val, commCode) => {
      const existingGrp = declaration.hsGroups.find((g) => g.commodityCode === commCode);
      const commercialDesc = val.items.map((it) => it.description).join('; ');

      newHsGroups.push({
        commodityCode: commCode,
        precision1: existingGrp?.precision1 || '000',
        preferenceCode: existingGrp?.preferenceCode || 'SCU',
        extendedCustomsProcedure: existingGrp?.extendedCustomsProcedure || '4000',
        nationalCustomsProcedure: existingGrp?.nationalCustomsProcedure || '016',
        numberOfPackages: val.totalPackages,
        kindOfPackagesCode: val.pkgCode,
        kindOfPackagesName: val.pkgName,
        descriptionOfGoods: existingGrp?.descriptionOfGoods || `Goods of HS ${commCode}`,
        commercialDescription: commercialDesc,
        countryOfOriginCode: declaration.header.exportCountryCode || 'ZA',
        itemPrice: Math.round(val.totalPrice * 100) / 100,
        valueItem: Math.round(val.totalPrice * 100) / 100,
        netWeight: Math.round(val.totalNetWeight * 10) / 10,
        grossWeight: Math.round(val.totalGrossWeight * 10) / 10,
      });
    });

    setDeclaration((prev) => ({
      ...prev,
      lineItems: updatedLines,
      hsGroups: newHsGroups,
    }));

    setNotice(`Distributed ${(headerNet || 0).toLocaleString()} kg Net / ${(headerGross || 0).toLocaleString()} kg Gross proportionally to all line items.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      <Header
        onLoadMolenaar={handleLoadMolenaar}
        onLoadAgriTech={handleLoadAgriTech}
        onDownloadXml={handleDownloadXml}
        hasDeclaration={Boolean(declaration)}
        itemCount={declaration.lineItems.length}
        hsGroupCount={declaration.hsGroups.length}
        borderOfficeCode={declaration.header.borderOfficeCode || 'ARIA'}
        onSelectBorder={handleSelectBorder}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice alert */}
        {notice && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-blue-500 hover:text-blue-800 text-xs font-semibold px-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* File Upload Zone with Gemini Integration */}
        <FileUploadZone
          onParseInvoice={handleParseInvoice}
          isLoading={isLoading}
          onLoadMolenaar={handleLoadMolenaar}
          onLoadAgriTech={handleLoadAgriTech}
          currentFileName={currentFileName}
        />

        {/* Dedicated Border Clearance Post Quick Switcher Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                <span>Border Clearance Office (Port of Entry):</span>
                <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                  {declaration.header.borderOfficeCode || 'ARIA'} - {declaration.header.borderOfficeName || 'Ariamsvlei'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Select your border post to instantly update &lt;Customs_clearance_office_code&gt; and &lt;Border_office&gt; in the ASYCUDA XML.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">Border:</span>
            {STANDARD_BORDER_OFFICES.map((b) => {
              const active = declaration.header.borderOfficeCode === b.code;
              return (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => handleSelectBorder(b.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                  title={b.description}
                >
                  <span className="font-mono font-bold">{b.code}</span>
                  <span>-</span>
                  <span>{b.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('hs_groups')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hs_groups'
                ? 'bg-white text-blue-700 border-t-2 border-x border-slate-200 border-t-blue-600 shadow-2xs -mb-px'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>HS Tariff Groups</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800">
              {declaration.hsGroups.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('line_items')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'line_items'
                ? 'bg-white text-blue-700 border-t-2 border-x border-slate-200 border-t-blue-600 shadow-2xs -mb-px'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-amber-600" />
            <span>Invoice Line Items</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800">
              {declaration.lineItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('header')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'header'
                ? 'bg-white text-blue-700 border-t-2 border-x border-slate-200 border-t-blue-600 shadow-2xs -mb-px'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Customs Header & Transport</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-indigo-100 text-indigo-800">
              {declaration.header.borderOfficeCode || 'ARIA'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('xml')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'xml'
                ? 'bg-white text-emerald-700 border-t-2 border-x border-slate-200 border-t-emerald-600 shadow-2xs -mb-px'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>ASYCUDA XML Output</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800">
              XML
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'hs_groups' && (
            <HsGroupingOverview
              hsGroups={declaration.hsGroups}
              header={declaration.header}
              onUpdateHsGroup={handleUpdateHsGroup}
              onDeleteHsGroup={handleDeleteHsGroup}
              onAddHsGroup={handleAddHsGroup}
            />
          )}

          {activeTab === 'line_items' && (
            <LineItemsTable
              lineItems={declaration.lineItems}
              currency={declaration.header.currencyCode || 'ZAR'}
              headerNetWeight={declaration.header.netWeight}
              headerGrossWeight={declaration.header.grossWeight}
              onUpdateLineItem={handleUpdateLineItem}
              onDeleteLineItem={handleDeleteLineItem}
              onAddLineItem={handleAddLineItem}
              onRegroupByHsCode={handleRegroupByHsCode}
              onDistributeWeights={handleDistributeHeaderWeight}
            />
          )}

          {activeTab === 'header' && (
            <CustomsHeaderEditor
              header={declaration.header}
              onChange={(updated) => setDeclaration({ ...declaration, header: updated })}
              onResetFixedDefaults={handleResetToBlank}
              onResetToBlank={handleResetToBlank}
              lineItemsNetWeight={declaration.lineItems.reduce((acc, l) => acc + (l.netWeight || 0), 0)}
            />
          )}

          {activeTab === 'xml' && (
            <XmlInspector
              xmlContent={xmlContent}
              onDownload={handleDownloadXml}
              invoiceNumber={declaration.header.invoiceNumber}
              itemCount={declaration.hsGroups.length}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">ASYCUDA Engine</span>
            <span>•</span>
            <span>Compliant with SACU & Namibia Customs Clearance Standards</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Border Office: {declaration.header.borderOfficeCode || 'ARIA'} ({declaration.header.borderOfficeName || 'Ariamsvlei'})</span>
            <span>•</span>
            <span>Carrier: {declaration.header.carrier || 'FP DU TOIT'}</span>
            <span>•</span>
            <span>Consignee Code: {declaration.header.consigneeCode || '(Unassigned)'}</span>
          </div>
        </div>
      </footer>

      {/* Share with Colleagues Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        declaration={declaration}
      />
    </div>
  );
}
