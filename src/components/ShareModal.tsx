import React, { useState } from 'react';
import { Copy, Check, ExternalLink, X, Users, Download, AlertTriangle, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { AsycudaDeclaration } from '../types/asycuda';
import { escapeXml } from '../utils/asycudaXmlGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  declaration: AsycudaDeclaration;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  declaration,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sharedUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'https://ais-pre-phmtvej6m7yj4adbolzcr5-445440148142.europe-west2.run.app'
    : window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Generates a fully standalone, zero-login, self-contained HTML app that can be emailed or opened anywhere
  const handleDownloadStandaloneHtml = () => {
    const serializedDeclaration = JSON.stringify(declaration).replace(/</g, '\\u003c');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASYCUDA LOADING LIST GENERATOR & XML BUILDER</title>
  <style>
    :root {
      --primary: #1e40af;
      --primary-hover: #1d4ed8;
      --slate-50: #f8fafc;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-300: #cbd5e1;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --slate-900: #0f172a;
      --emerald: #059669;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f1f5f9;
      color: var(--slate-800);
      line-height: 1.4;
      padding-bottom: 60px;
    }
    header {
      background: var(--slate-900);
      color: white;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .brand { display: flex; items-center; gap: 12px; }
    .badge-icon {
      background: #2563eb;
      color: white;
      font-weight: 900;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 13px;
      letter-spacing: 1px;
    }
    .header-title { font-size: 16px; font-weight: 700; }
    .header-sub { font-size: 11px; color: #94a3b8; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .btn-emerald { background: var(--emerald); color: white; }
    .btn-emerald:hover { background: #047857; }
    .btn-blue { background: var(--primary); color: white; }
    .btn-blue:hover { background: var(--primary-hover); }
    .btn-outline { background: white; border-color: var(--slate-300); color: var(--slate-700); }
    .btn-outline:hover { background: var(--slate-100); }
    .container { max-width: 1200px; margin: 20px auto; padding: 0 16px; }
    .banner {
      background: #dbeafe;
      border: 1px solid #bfdbfe;
      color: #1e3a8a;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--slate-700);
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--slate-100);
      padding-bottom: 6px;
      display: flex;
      justify-content: space-between;
    }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
    .form-group { margin-bottom: 10px; }
    .form-group label { display: block; font-size: 11px; font-weight: 600; color: var(--slate-700); margin-bottom: 4px; }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 7px 10px;
      font-size: 12px;
      border: 1px solid var(--slate-300);
      border-radius: 5px;
      font-family: inherit;
    }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    th { background: var(--slate-800); color: white; text-align: left; padding: 8px 10px; font-weight: 600; }
    td { padding: 8px 10px; border-bottom: 1px solid var(--slate-200); vertical-align: top; }
    tr:nth-child(even) { background: var(--slate-50); }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      background: #e0f2fe;
      color: #0369a1;
    }
    .actions-bar { display: flex; gap: 8px; margin-top: 12px; }
    textarea.xml-box {
      width: 100%;
      height: 320px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      background: #0f172a;
      color: #38bdf8;
      border-radius: 6px;
      padding: 12px;
      border: 1px solid #1e293b;
      margin-top: 10px;
      resize: vertical;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <span class="badge-icon">ASYCUDA</span>
      <div>
        <div class="header-title">ASYCUDA Customs Loading List & XML Generator</div>
        <div class="header-sub">Standalone Offline Edition (Zero-Login / Works Anywhere)</div>
      </div>
    </div>
    <div>
      <button type="button" class="btn btn-emerald" onclick="downloadXmlFile()">
        &#11015; Download ASYCUDA XML
      </button>
    </div>
  </header>

  <div class="container">
    <div class="banner">
      <span>&#128161; <strong>Offline Mode:</strong> This file runs directly on your computer inside Google Chrome or Microsoft Edge. No internet or Google account required.</span>
      <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="window.print()">&#128438; Print / PDF</button>
    </div>

    <!-- Customs Declaration Header -->
    <div class="card">
      <div class="card-title">
        <span>Customs Declaration Header & Transport Information</span>
        <span style="font-size: 11px; color: #2563eb;">SAD 500 Compliance</span>
      </div>
      <div class="grid-4">
        <div class="form-group">
          <label>Exporter / Consignor Name & Address</label>
          <textarea id="h_exporterName" rows="3" oninput="updateHeader()"></textarea>
        </div>
        <div class="form-group">
          <label>Consignee / Importer Name & Address</label>
          <textarea id="h_consigneeName" rows="3" oninput="updateHeader()"></textarea>
        </div>
        <div class="form-group">
          <label>Means of Transport (Identity)</label>
          <input type="text" id="h_transportIdentity" class="font-mono" oninput="updateHeader()">
          <label style="margin-top: 6px;">Carrier / Border Information</label>
          <input type="text" id="h_carrier" oninput="updateHeader()">
        </div>
        <div class="form-group">
          <label>Customs Port of Entry (Border Office)</label>
          <select id="h_borderOffice" onchange="updateBorderOffice()">
            <option value="ARIA|Ariamsvlei">ARIA - Ariamsvlei</option>
            <option value="NOOR|Noordoewer">NOOR - Noordoewer</option>
            <option value="TKL|Transkalahari">TKL - Transkalahari</option>
          </select>
          <label style="margin-top: 6px;">Reference / Invoice Number</label>
          <input type="text" id="h_referenceNumber" class="font-mono" oninput="updateHeader()">
        </div>
      </div>

      <div class="grid-4" style="margin-top: 8px; padding-top: 12px; border-top: 1px dashed var(--slate-200);">
        <div class="form-group">
          <label>15 C.E. Country of Export Code</label>
          <input type="text" id="h_exportCountryCode" class="font-mono" style="font-weight: bold; color: #1e40af;" oninput="updateHeader()">
        </div>
        <div class="form-group">
          <label>17 C.D. Destination Country Code</label>
          <input type="text" id="h_destinationCountryCode" class="font-mono" style="font-weight: bold;" oninput="updateHeader()">
        </div>
        <div class="form-group">
          <label>35 Gross Mass (kg) &nbsp; <a href="#" onclick="calcGross103(); return false;" style="font-size: 10px; color: #7c3aed;">(Auto: Net &times; 1.03)</a></label>
          <input type="number" step="0.1" id="h_grossWeight" class="font-mono" style="font-weight: bold;" oninput="updateHeader()">
        </div>
        <div class="form-group">
          <label>38 Net Mass (kg)</label>
          <input type="number" step="0.1" id="h_netWeight" class="font-mono" style="font-weight: bold;" oninput="updateHeader()">
        </div>
      </div>
    </div>

    <!-- Line Items Table -->
    <div class="card">
      <div class="card-title">
        <span>Commercial Invoice Line Items</span>
        <div>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="addLineItem()">+ Add Line</button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table id="lineItemsTable">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Description</th>
              <th style="width: 120px;">HS Code (8-digit)</th>
              <th style="width: 70px;">Qty</th>
              <th style="width: 80px;">Unit</th>
              <th style="width: 90px;" class="text-right">Unit Price</th>
              <th style="width: 100px;" class="text-right">Total Amount</th>
              <th style="width: 80px;" class="text-right">Net Wt (kg)</th>
              <th style="width: 40px;"></th>
            </tr>
          </thead>
          <tbody id="lineItemsBody"></tbody>
        </table>
      </div>
    </div>

    <!-- HS Tariff Code Grouping Summary -->
    <div class="card">
      <div class="card-title">
        <span>Grouped HS Tariff Code Items (ASYCUDA Items)</span>
        <span id="hsCountBadge" class="badge">0 Groups</span>
      </div>
      <div style="overflow-x: auto;">
        <table id="hsSummaryTable">
          <thead>
            <tr>
              <th style="width: 50px;">Item #</th>
              <th style="width: 130px;">Commodity Code</th>
              <th>Commercial Description</th>
              <th style="width: 90px;" class="text-right">Packages</th>
              <th style="width: 120px;" class="text-right">Total Value (ZAR)</th>
            </tr>
          </thead>
          <tbody id="hsSummaryBody"></tbody>
          <tfoot>
            <tr style="font-weight: bold; background: #e2e8f0;">
              <td colspan="4" class="text-right">Total Invoice Value (ZAR):</td>
              <td id="totalValFooter" class="text-right font-mono">0.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Generated ASYCUDA XML Output -->
    <div class="card">
      <div class="card-title">
        <span>ASYCUDA Customs XML Preview</span>
        <button class="btn btn-emerald" style="padding: 4px 12px; font-size: 11px;" onclick="downloadXmlFile()">Download .XML File</button>
      </div>
      <p style="font-size: 11px; color: #64748b;">This raw XML matches the exact SACU / Namibia ASYCUDA schema for immediate upload.</p>
      <textarea id="xmlOutput" class="xml-box" readonly></textarea>
    </div>
  </div>

  <script>
    let state = ${serializedDeclaration};

    function init() {
      const h = state.header;
      document.getElementById('h_exporterName').value = h.exporterName || '';
      document.getElementById('h_consigneeName').value = h.consigneeName || '';
      document.getElementById('h_transportIdentity').value = h.transportIdentity || '';
      document.getElementById('h_carrier').value = h.carrier || '';
      document.getElementById('h_referenceNumber').value = h.referenceNumber || '';
      document.getElementById('h_exportCountryCode').value = h.exportCountryCode || 'ZA';
      document.getElementById('h_destinationCountryCode').value = h.destinationCountryCode || 'NA';
      document.getElementById('h_grossWeight').value = h.grossWeight || 0;
      document.getElementById('h_netWeight').value = h.netWeight || 0;

      const officeKey = (h.borderOfficeCode || 'ARIA') + '|' + (h.borderOfficeName || 'Ariamsvlei');
      const officeSelect = document.getElementById('h_borderOffice');
      for (let i = 0; i < officeSelect.options.length; i++) {
        if (officeSelect.options[i].value.startsWith(h.borderOfficeCode || 'ARIA')) {
          officeSelect.selectedIndex = i;
          break;
        }
      }

      renderLines();
      recalculateHs();
    }

    function updateBorderOffice() {
      const val = document.getElementById('h_borderOffice').value;
      const parts = val.split('|');
      state.header.borderOfficeCode = parts[0];
      state.header.borderOfficeName = parts[1];
      generateXml();
    }

    function updateHeader() {
      state.header.exporterName = document.getElementById('h_exporterName').value;
      state.header.consigneeName = document.getElementById('h_consigneeName').value;
      state.header.transportIdentity = document.getElementById('h_transportIdentity').value;
      state.header.carrier = document.getElementById('h_carrier').value;
      state.header.referenceNumber = document.getElementById('h_referenceNumber').value;
      state.header.exportCountryCode = document.getElementById('h_exportCountryCode').value;
      state.header.destinationCountryCode = document.getElementById('h_destinationCountryCode').value;
      state.header.grossWeight = parseFloat(document.getElementById('h_grossWeight').value) || 0;
      state.header.netWeight = parseFloat(document.getElementById('h_netWeight').value) || 0;
      generateXml();
    }

    function calcGross103() {
      const net = parseFloat(document.getElementById('h_netWeight').value) || 0;
      const gross = Math.round(net * 1.03 * 10) / 10;
      document.getElementById('h_grossWeight').value = gross;
      state.header.grossWeight = gross;
      generateXml();
    }

    function renderLines() {
      const tbody = document.getElementById('lineItemsBody');
      tbody.innerHTML = '';
      state.lineItems.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td class="font-mono text-center">\${index + 1}</td>
          <td><input type="text" style="width: 100%;" value="\${item.description || ''}" onchange="updateLine(\${index}, 'description', this.value)"></td>
          <td><input type="text" class="font-mono" style="width: 100%; font-weight: bold;" value="\${item.hsCode || ''}" onchange="updateLine(\${index}, 'hsCode', this.value)"></td>
          <td><input type="number" style="width: 100%;" value="\${item.quantity || 1}" onchange="updateLine(\${index}, 'quantity', parseFloat(this.value)||1)"></td>
          <td><input type="text" style="width: 100%;" value="\${item.unit || 'PC'}" onchange="updateLine(\${index}, 'unit', this.value)"></td>
          <td><input type="number" step="0.01" class="text-right" style="width: 100%;" value="\${item.unitPrice || 0}" onchange="updateLine(\${index}, 'unitPrice', parseFloat(this.value)||0)"></td>
          <td class="text-right font-mono font-bold">\${((item.quantity || 1) * (item.unitPrice || 0)).toFixed(2)}</td>
          <td><input type="number" step="0.1" class="text-right" style="width: 100%;" value="\${item.netWeight || 0}" onchange="updateLine(\${index}, 'netWeight', parseFloat(this.value)||0)"></td>
          <td><button class="btn btn-outline" style="padding: 2px 6px; font-size: 10px; color: #ef4444;" onclick="deleteLine(\${index})">&times;</button></td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function updateLine(index, field, val) {
      state.lineItems[index][field] = val;
      if (field === 'quantity' || field === 'unitPrice') {
        state.lineItems[index].totalAmount = (state.lineItems[index].quantity || 1) * (state.lineItems[index].unitPrice || 0);
      }
      renderLines();
      recalculateHs();
    }

    function addLineItem() {
      state.lineItems.push({
        id: 'line_' + Date.now(),
        itemNumber: state.lineItems.length + 1,
        description: 'New Item',
        hsCode: '84223000',
        quantity: 1,
        unit: 'PC',
        unitPrice: 100,
        totalAmount: 100,
        netWeight: 1,
        grossWeight: 1.03
      });
      renderLines();
      recalculateHs();
    }

    function deleteLine(index) {
      state.lineItems.splice(index, 1);
      renderLines();
      recalculateHs();
    }

    function recalculateHs() {
      const groups = {};
      let totalSum = 0;
      let totalNet = 0;

      state.lineItems.forEach(line => {
        const hs = (line.hsCode || '84223000').replace(/\\D/g, '').padEnd(8, '0').slice(0, 8);
        const amount = (line.quantity || 1) * (line.unitPrice || 0);
        totalSum += amount;
        totalNet += (line.netWeight || 0);

        if (!groups[hs]) {
          groups[hs] = {
            hsCode: hs,
            description: line.description,
            packages: line.quantity || 1,
            unit: line.unit || 'PC',
            totalValue: 0
          };
        }
        groups[hs].totalValue += amount;
      });

      state.hsGroups = Object.values(groups).map((g, idx) => ({
        itemNumber: idx + 1,
        commodityCode: g.hsCode,
        descriptionOfGoods: g.description,
        commercialDescription: g.description,
        numberOfPackages: g.packages,
        kindOfPackagesCode: g.unit === 'BX' ? 'BX' : 'PC',
        kindOfPackagesName: g.unit === 'BX' ? 'BOX' : 'PIECES',
        itemPrice: g.totalValue,
        countryOfOriginCode: state.header.exportCountryCode || 'ZA'
      }));

      state.header.totalInvoiceAmount = totalSum;
      state.header.freightCost = Math.round(totalSum * 0.05 * 100) / 100;
      state.header.totalCif = Math.round((totalSum + state.header.freightCost) * 100) / 100;

      if (!state.header.netWeight || state.header.netWeight <= 0) {
        state.header.netWeight = Math.round(totalNet * 10) / 10;
        document.getElementById('h_netWeight').value = state.header.netWeight;
      }
      if (!state.header.grossWeight || state.header.grossWeight <= 0) {
        state.header.grossWeight = Math.round(state.header.netWeight * 1.03 * 10) / 10;
        document.getElementById('h_grossWeight').value = state.header.grossWeight;
      }

      const hsBody = document.getElementById('hsSummaryBody');
      hsBody.innerHTML = '';
      state.hsGroups.forEach((g, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td class="font-mono text-center"><strong>\${idx + 1}</strong></td>
          <td><span class="badge">\${g.commodityCode}</span></td>
          <td>\${g.commercialDescription || g.descriptionOfGoods}</td>
          <td class="text-right">\${g.numberOfPackages} \${g.kindOfPackagesCode}</td>
          <td class="text-right font-mono font-bold">\${g.itemPrice.toFixed(2)}</td>
        \`;
        hsBody.appendChild(tr);
      });

      document.getElementById('hsCountBadge').innerText = state.hsGroups.length + ' Groups';
      document.getElementById('totalValFooter').innerText = totalSum.toFixed(2);

      generateXml();
    }

    function escapeXml(unsafe) {
      if (unsafe === undefined || unsafe === null) return '';
      return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }

    function generateXml() {
      const h = state.header;
      const totalInvStr = (h.totalInvoiceAmount || 0).toFixed(2);
      const freightStr = (h.freightCost || (h.totalInvoiceAmount * 0.05) || 0).toFixed(2);
      const totalCifStr = ((h.totalInvoiceAmount || 0) + parseFloat(freightStr)).toFixed(2);
      const grossStr = (h.grossWeight || 0).toFixed(1);
      const netStr = (h.netWeight || 0).toFixed(1);

      const itemsXml = state.hsGroups.map((item, idx) => \`<!-- ITEM \${idx + 1}: HS \${item.commodityCode} -->
<Item>
<Packages>
<Number_of_packages>\${item.numberOfPackages || 1}</Number_of_packages>
<Kind_of_packages_code>\${escapeXml(item.kindOfPackagesCode || 'PC')}</Kind_of_packages_code>
<Kind_of_packages_name>\${escapeXml(item.kindOfPackagesName || 'PIECES')}</Kind_of_packages_name>
</Packages>
<IncoTerms>
<Code>\${escapeXml(h.deliveryTermsCode || 'CIF')}</Code>
<Place>\${escapeXml(h.deliveryTermsPlace || 'Aussenkher Farm')}</Place>
</IncoTerms>
<Tarification>
<HScode>
<Commodity_code>\${escapeXml(item.commodityCode)}</Commodity_code>
<Precision_1>000</Precision_1>
</HScode>
<Preference_code>SCU</Preference_code>
<Extended_customs_procedure>4000</Extended_customs_procedure>
<National_customs_procedure>016</National_customs_procedure>
<Item_price>\${(item.itemPrice || 0).toFixed(2)}</Item_price>
<Value_item>\${(item.itemPrice || 0).toFixed(2)}</Value_item>
</Tarification>
<Goods_description>
<Country_of_origin_code>\${escapeXml(item.countryOfOriginCode || h.exportCountryCode || 'ZA')}</Country_of_origin_code>
<Description_of_goods>\${escapeXml(item.descriptionOfGoods || '')}</Description_of_goods>
<Commercial_Description>\${escapeXml(item.commercialDescription || item.descriptionOfGoods || '')}</Commercial_Description>
</Goods_description>
<Valuation_item>
<Item_Invoice>
<Amount_national_currency>\${(item.itemPrice || 0).toFixed(2)}</Amount_national_currency>
<Amount_foreign_currency>\${(item.itemPrice || 0).toFixed(2)}</Amount_foreign_currency>
<Currency_code>\${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_rate>1</Currency_rate>
</Item_Invoice>
</Valuation_item>
</Item>\`).join('\\n\\n');

      const xml = \`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<ASYCUDA>
<Export_release>
<Date_of_exit/>
<Time_of_exit/>
<Actual_office_of_exit_code>
<null/>
</Actual_office_of_exit_code>
<Actual_office_of_exit_name>
<null/>
</Actual_office_of_exit_name>
<Exit_reference>
<null/>
</Exit_reference>
<Comments>
<null/>
</Comments>
</Export_release>
<Assessment_notice/>
<Global_taxes/>
<Property>
<Sad_flow>I</Sad_flow>
<Forms>
<Number_of_the_form>1</Number_of_the_form>
<Total_number_of_forms>1</Total_number_of_forms>
</Forms>
<Nbers>
<Number_of_loading_lists/>
<Total_number_of_items>\${state.hsGroups.length}</Total_number_of_items>
</Nbers>
<Place_of_declaration>
<null/>
</Place_of_declaration>
<Date_of_declaration/>
<Selected_page>1</Selected_page>
</Property>
<Identification>
<Office_segment>
<Customs_clearance_office_code>\${escapeXml(h.borderOfficeCode || 'ARIA')}</Customs_clearance_office_code>
<Customs_Clearance_office_name>\${escapeXml(h.borderOfficeName || 'Ariamsvlei')}</Customs_Clearance_office_name>
</Office_segment>
<Type>
<Type_of_declaration>IM</Type_of_declaration>
<Declaration_gen_procedure_code>4</Declaration_gen_procedure_code>
<Type_of_transit_document>
<null/>
</Type_of_transit_document>
</Type>
<Manifest_reference_number>
<null/>
</Manifest_reference_number>
<UCR>\${escapeXml(h.ucr || '6ZA' + (h.exporterCode || '25617343') + 'CINV' + (h.referenceNumber || '622967'))}</UCR>
<Registration>
<Serial_number>
<null/>
</Serial_number>
<Number/>
<Date/>
</Registration>
<Assessment>
<Serial_number>
<null/>
</Serial_number>
<Number/>
<Date/>
</Assessment>
<receipt>
<Serial_number>
<null/>
</Serial_number>
<Number/>
<Date/>
</receipt>
</Identification>
<Traders>
<Exporter>
<Exporter_code>\${escapeXml(h.exporterCode || '')}</Exporter_code>
<Exporter_name>\${escapeXml(h.exporterName || '')}</Exporter_name>
</Exporter>
<Consignee>
<Consignee_code>\${escapeXml(h.consigneeCode || '')}</Consignee_code>
<Consignee_name>\${escapeXml(h.consigneeName || '')}</Consignee_name>
</Consignee>
<Financial>
<Financial_code/>
<Financial_name/>
</Financial>
</Traders>
<Declarant>
<Declarant_code>\${escapeXml(h.declarantCode || '05204044')}</Declarant_code>
<Declarant_name>\${escapeXml(h.declarantName || 'Goreefers Logistics Namibia P.O.Box 20 Noordoewer')}</Declarant_name>
<Reference>
<Number>\${escapeXml(h.referenceNumber || '622967')}</Number>
</Reference>
</Declarant>
<General_information>
<Country>
<Country_first_destination/>
<Trading_country/>
<Export>
<Export_country_code>\${escapeXml(h.exportCountryCode || 'ZA')}</Export_country_code>
<Export_country_name>\${escapeXml(h.exportCountryName || 'South Africa')}</Export_country_name>
<Export_country_region/>
</Export>
<Destination>
<Destination_country_code>\${escapeXml(h.destinationCountryCode || 'NA')}</Destination_country_code>
<Destination_country_name>\${escapeXml(h.destinationCountryName || 'Namibia')}</Destination_country_name>
<Destination_country_region/>
</Destination>
<Country_of_origin_name>\${escapeXml(h.countryOfOriginName || 'South Africa')}</Country_of_origin_name>
</Country>
<Value_details>\${freightStr}</Value_details>
<CAP/>
<Additional_information/>
<Comments_free_text>
<null/>
</Comments_free_text>
</General_information>
<Transport>
<Means_of_transport>
<Departure_arrival_information>
<Identity>\${escapeXml(h.transportIdentity || 'DBZ126NC / CNY564ND / CNY56FS')}</Identity>
<Nationality>ZA</Nationality>
</Departure_arrival_information>
<Border_information>
<Identity>\${escapeXml(h.carrier || 'FP DU TOIT')}</Identity>
<Nationality>ZA</Nationality>
<Mode>3</Mode>
</Border_information>
<Inland_mode_of_transport>
<null/>
</Inland_mode_of_transport>
</Means_of_transport>
<Container_flag>false</Container_flag>
<Delivery_terms>
<Code>\${escapeXml(h.deliveryTermsCode || 'CIF')}</Code>
<Place>\${escapeXml(h.deliveryTermsPlace || 'Aussenkher Farm')}</Place>
<Situation/>
</Delivery_terms>
<Border_office>
<Code>\${escapeXml(h.borderOfficeCode || 'ARIA')}</Code>
<Name>\${escapeXml(h.borderOfficeName || 'Ariamsvlei')}</Name>
</Border_office>
<Place_of_loading>
<Code>
<null/>
</Code>
<Name>
<null/>
</Name>
<Country/>
</Place_of_loading>
<Location_of_goods>\${escapeXml(h.locationOfGoods || 'AUSSENKHER')}</Location_of_goods>
</Transport>
<Financial>
<Financial_transaction>
<code1>
<null/>
</code1>
<code2>
<null/>
</code2>
</Financial_transaction>
<Bank>
<Code>002</Code>
<Name>Bank Windhoek LTD</Name>
<Branch>
<null/>
</Branch>
<Reference>
<null/>
</Reference>
</Bank>
<Terms>
<Code>30</Code>
<Description>30 Days</Description>
</Terms>
<Total_invoice>\${totalInvStr}</Total_invoice>
<Deffered_payment_reference>
<null/>
</Deffered_payment_reference>
<Mode_of_payment>CASH</Mode_of_payment>
<Amounts>
<Total_manual_taxes/>
<Global_taxes/>
<Totals_taxes/>
</Amounts>
<Guarantee>
<Name>
<null/>
</Name>
<Amount/>
<Date/>
<Excluded_country>
<Code>
<null/>
</Code>
<Name>
<null/>
</Name>
</Excluded_country>
</Guarantee>
</Financial>
<Warehouse>
<Identification/>
<Delay/>
</Warehouse>
<Transit>
<Principal>
<Code>
<null/>
</Code>
<Name>
<null/>
</Name>
<Representative>
<null/>
</Representative>
</Principal>
<Signature>
<Place>
<null/>
</Place>
<Date/>
</Signature>
<Destination>
<Office>
<null/>
</Office>
</Destination>
<Seals>
<Number/>
<Identity>
<null/>
</Identity>
</Seals>
<Result_of_control/>
<Time_limit/>
<Officer_name>
<null/>
</Officer_name>
</Transit>
<Valuation>
<Calculation_working_mode/>
<Weight>
<Gross_weight>\${grossStr}</Gross_weight>
</Weight>
<Total_cost>\${freightStr}</Total_cost>
<Total_CIF>\${totalCifStr}</Total_CIF>
<Gs_Invoice>
<Amount_national_currency>\${totalInvStr}</Amount_national_currency>
<Amount_foreign_currency>\${totalInvStr}</Amount_foreign_currency>
<Currency_code>\${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_name>South African Rand</Currency_name>
<Currency_rate>1</Currency_rate>
</Gs_Invoice>
<Gs_external_freight>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>\${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_name>
<null/>
</Currency_name>
<Currency_rate>1</Currency_rate>
</Gs_external_freight>
<Gs_internal_freight>
<Amount_national_currency>\${freightStr}</Amount_national_currency>
<Amount_foreign_currency>\${freightStr}</Amount_foreign_currency>
<Currency_code>\${escapeXml(h.currencyCode || 'ZAR')}</Currency_code>
<Currency_name>South African Rand</Currency_name>
<Currency_rate>1</Currency_rate>
</Gs_internal_freight>
<Gs_insurance>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>
<null/>
</Currency_code>
<Currency_name>No foreign currency</Currency_name>
<Currency_rate>0.0</Currency_rate>
</Gs_insurance>
<Gs_other_cost>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>
<null/>
</Currency_code>
<Currency_name>No foreign currency</Currency_name>
<Currency_rate>0.0</Currency_rate>
</Gs_other_cost>
<Gs_deduction>
<Amount_national_currency>0.00</Amount_national_currency>
<Amount_foreign_currency>0.0</Amount_foreign_currency>
<Currency_code>
<null/>
</Currency_code>
<Currency_name>No foreign currency</Currency_name>
<Currency_rate>0.0</Currency_rate>
</Gs_deduction>
<Total>
<Total_invoice>\${totalInvStr}</Total_invoice>
<Total_weight>\${netStr}</Total_weight>
</Total>
</Valuation>

\${itemsXml}

</ASYCUDA>\`;

      document.getElementById('xmlOutput').value = xml;
    }

    function downloadXmlFile() {
      const xml = document.getElementById('xmlOutput').value;
      const ref = state.header.referenceNumber || '622967';
      const filename = 'ASYCUDA_Declaration_' + ref + '.xml';
      const blob = new Blob([xml], { type: 'application/xml' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    window.onload = init;
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASYCUDA_LOADING_LIST_GENERATOR.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Access & Sharing Options</h3>
              <p className="text-xs text-slate-400">Share with colleagues without login restrictions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Explanation of Google Account restriction */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <p className="font-bold text-blue-950">
                Why does Google Cloud ask for a Google Account?
              </p>
              <p>
                The cloud development server (<code className="font-mono bg-blue-100 px-1 rounded">run.app</code>) is protected by Google AI Studio Cloud Run security to keep development sessions safe.
              </p>
            </div>
          </div>

          {/* Option A: Standalone Zero-Login HTML file (Best Solution) */}
          <div className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Recommended: 100% Bypass (No Google Account Required)
              </span>
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                Zero Login
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Download the <strong>Standalone Offline HTML Application</strong>. You can email this file to your colleagues, send it via WhatsApp/Teams, or save it to a shared company drive:
            </p>
            <ul className="text-xs text-emerald-800 list-disc list-inside space-y-0.5 text-[11px]">
              <li>Colleagues can double-click and open it immediately in Chrome or Edge</li>
              <li><strong>Never asks for any Google login or password</strong></li>
              <li>Includes full loading list editing, weight calculations, and ASYCUDA XML generation</li>
            </ul>
            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download "ASYCUDA_LOADING_LIST_GENERATOR.html" (No Login)</span>
            </button>
          </div>

          {/* Option B: Live Web Link */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Alternative: Live Web Link (Requires signing in with any Google account)
            </label>
            <p className="text-xs text-slate-500">
              If colleagues prefer the web version, they can log in with <em>any</em> standard Google/Gmail account:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-800 select-all"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
