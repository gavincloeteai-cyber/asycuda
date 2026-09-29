// Utility to create a realistic Commercial Invoice image blob for testing Gemini vision parsing
export function generateSampleInvoiceImage(
  invoiceNumber: string,
  exporterName: string,
  consigneeName: string,
  items: Array<{
    itemCode?: string;
    description: string;
    hsCode: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalAmount: number;
    netWeight?: number;
    grossWeight?: number;
  }>,
  currency: string,
  totalAmount: number,
  freightAmount: number,
  borderName: string = 'Ariamsvlei (ARIA)',
  grossWeight: number = 19120.0,
  netWeight: number = 18000.0
): Promise<{ base64: string; dataUrl: string }> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d')!;

    // Background: Clean white invoice paper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top border bar: Dark slate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, 24);

    // Company Header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.fillText('COMMERCIAL INVOICE', 70, 90);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('ORIGINAL FOR CUSTOMS PURPOSES / ASYCUDA DECLARATION', 70, 120);

    // Invoice Meta Box (Right aligned)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillRect(800, 50, 330, 110);
    ctx.strokeRect(800, 50, 330, 110);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('INVOICE NUMBER:', 820, 80);
    ctx.fillText('DATE:', 820, 110);
    ctx.fillText('CURRENCY:', 820, 140);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(invoiceNumber, 960, 80);
    ctx.fillText(new Date().toISOString().slice(0, 10), 960, 110);
    ctx.fillText(currency, 960, 140);

    // Two-column address boxes: Exporter vs Consignee (with full multi-line addresses)
    const drawAddressBox = (title: string, content: string, x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(title.toUpperCase(), x + 16, y + 26);

      ctx.fillStyle = '#334155';
      ctx.font = '13px system-ui, sans-serif';
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line.trim(), x + 16, y + 52 + i * 22);
      });
    };

    drawAddressBox('EXPORTER / CONSIGNOR (FULL PHYSICAL ADDRESS)', exporterName, 70, 185, 510, 165);
    drawAddressBox('CONSIGNEE / IMPORTER (DELIVERY ADDRESS)', consigneeName, 620, 185, 510, 165);

    // Transport details bar
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(70, 370, 1060, 60);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(70, 370, 1060, 60);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('TRANSPORT IDENTITY / VEHICLE REGS', 90, 392);
    ctx.fillText('CARRIER', 440, 392);
    ctx.fillText('DELIVERY TERMS', 700, 392);
    ctx.fillText('BORDER PORT OF ENTRY', 900, 392);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('DBZ126NC / CNY564ND / CNY56FS', 90, 415);
    ctx.fillText('FP DU TOIT TRANSPORT', 440, 415);
    ctx.fillText('CIF Aussenkher Farm', 700, 415);
    ctx.fillText(borderName, 900, 415);

    // Line items table header
    const tableTop = 455;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(70, tableTop, 1060, 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('#', 82, tableTop + 24);
    ctx.fillText('ITEM CODE', 110, tableTop + 24);
    ctx.fillText('COMMERCIAL DESCRIPTION', 220, tableTop + 24);
    ctx.fillText('HS CODE', 600, tableTop + 24);
    ctx.fillText('QTY / UNIT', 720, tableTop + 24);
    ctx.fillText('WEIGHT (KG)', 820, tableTop + 24);
    ctx.fillText('UNIT PRICE', 930, tableTop + 24);
    ctx.fillText('TOTAL AMOUNT', 1030, tableTop + 24);

    // Line items rows
    let currentY = tableTop + 38;
    items.forEach((item, index) => {
      const rowHeight = 44;
      ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#f8fafc';
      ctx.fillRect(70, currentY, 1060, rowHeight);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(70, currentY, 1060, rowHeight);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(String(index + 1), 82, currentY + 27);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(item.itemCode || `SKU-${index + 1}`, 110, currentY + 27);

      ctx.fillStyle = '#334155';
      ctx.font = '12px system-ui, sans-serif';
      const desc = item.description.length > 44 ? item.description.slice(0, 41) + '...' : item.description;
      ctx.fillText(desc, 220, currentY + 27);

      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(item.hsCode, 600, currentY + 27);

      ctx.fillStyle = '#0f172a';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(`${item.quantity} ${item.unit}`, 720, currentY + 27);

      // Line item weight
      const lineNet = item.netWeight ?? Math.round(item.quantity * 10);
      const lineGross = item.grossWeight ?? Math.round(lineNet * 1.06);
      ctx.fillText(`${lineNet} kg`, 820, currentY + 27);

      ctx.fillText(item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }), 930, currentY + 27);

      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(item.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }), 1030, currentY + 27);

      currentY += rowHeight;
    });

    // Summary / Totals block
    const summaryTop = currentY + 30;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(680, summaryTop, 450, 180);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(680, summaryTop, 450, 180);

    const drawSummaryRow = (label: string, value: string, yOffset: number, bold = false) => {
      ctx.fillStyle = bold ? '#0f172a' : '#475569';
      ctx.font = bold ? 'bold 14px system-ui, sans-serif' : '13px system-ui, sans-serif';
      ctx.fillText(label, 700, summaryTop + yOffset);
      ctx.fillText(value, 970, summaryTop + yOffset);
    };

    drawSummaryRow('SUBTOTAL (FOB):', `${currency} ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 30);
    drawSummaryRow('INTERNAL FREIGHT:', `${currency} ${freightAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 60);
    drawSummaryRow('TOTAL NET WEIGHT:', `${netWeight.toLocaleString('en-US', { minimumFractionDigits: 1 })} kg`, 90);
    drawSummaryRow('TOTAL GROSS WEIGHT:', `${grossWeight.toLocaleString('en-US', { minimumFractionDigits: 1 })} kg`, 120);

    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(700, summaryTop + 140);
    ctx.lineTo(1110, summaryTop + 140);
    ctx.stroke();

    drawSummaryRow('TOTAL CIF VALUE:', `${currency} ${(totalAmount + freightAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 165, true);

    // Customs compliance declaration statement footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('DECLARATION: We hereby declare that the particulars stated above are true and correct, and the values represent', 70, 1480);
    ctx.fillText('the actual price paid for the goods described above for export to Namibia under SACU trade preferences (SCU).', 70, 1500);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('ASYCUDA AUTOMATED CUSTOMS DECLARATION INTERFACE - ARIAMSVLEI BORDER CONTROL (ARIA)', 70, 1540);

    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    resolve({ base64, dataUrl });
  });
}
