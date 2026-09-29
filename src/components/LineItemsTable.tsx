import React, { useState } from 'react';
import { RawInvoiceLineItem } from '../types/asycuda';
import { ListOrdered, Edit2, Trash2, Plus, Check, X, RefreshCw, Scale, Sparkles } from 'lucide-react';

interface LineItemsTableProps {
  lineItems: RawInvoiceLineItem[];
  currency: string;
  headerNetWeight?: number;
  headerGrossWeight?: number;
  onUpdateLineItem: (index: number, updated: RawInvoiceLineItem) => void;
  onDeleteLineItem: (index: number) => void;
  onAddLineItem: () => void;
  onRegroupByHsCode: () => void;
  onDistributeWeights?: () => void;
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  lineItems,
  currency,
  headerNetWeight = 0,
  headerGrossWeight = 0,
  onUpdateLineItem,
  onDeleteLineItem,
  onAddLineItem,
  onRegroupByHsCode,
  onDistributeWeights,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<RawInvoiceLineItem | null>(null);

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditFormData({ ...lineItems[idx] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditFormData(null);
  };

  const saveEdit = (idx: number) => {
    if (editFormData) {
      onUpdateLineItem(idx, editFormData);
    }
    setEditingIndex(null);
    setEditFormData(null);
  };

  const totalLinesValue = lineItems.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalNetWeight = lineItems.reduce((acc, curr) => acc + (curr.netWeight || 0), 0);
  const totalGrossWeight = lineItems.reduce((acc, curr) => acc + (curr.grossWeight || 0), 0);

  const weightsNeedDistribution =
    headerNetWeight > 0 &&
    (totalNetWeight === 0 || Math.abs(totalNetWeight - headerNetWeight) > 50);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-blue-600" />
            Raw Commercial Invoice Line Items ({lineItems.length})
          </h3>
          <p className="text-xs text-slate-500">
            Every item extracted directly from the uploaded document including weights and prices before tariff aggregation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {weightsNeedDistribution && onDistributeWeights && (
            <button
              type="button"
              onClick={onDistributeWeights}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Distribute invoice header total weights proportionally across line items"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Distribute Header Weight ({(headerNetWeight || 0).toLocaleString()} kg)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRegroupByHsCode}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Recalculate HS tariff code grouping and weight totals from current line items"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-aggregate by HS Code</span>
          </button>
          <button
            type="button"
            onClick={onAddLineItem}
            className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Line</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3 w-24">Item Code</th>
              <th className="py-2.5 px-3 min-w-[200px]">Commercial Description</th>
              <th className="py-2.5 px-3 w-24">HS Code</th>
              <th className="py-2.5 px-3 w-20 text-right">Qty</th>
              <th className="py-2.5 px-3 w-24 text-right">Net Wt (kg)</th>
              <th className="py-2.5 px-3 w-24 text-right">Gross Wt (kg)</th>
              <th className="py-2.5 px-3 w-24 text-right">Unit Price</th>
              <th className="py-2.5 px-3 w-28 text-right">Total ({currency})</th>
              <th className="py-2.5 px-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {lineItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-400">
                  No line items extracted. Upload an invoice to parse items.
                </td>
              </tr>
            ) : (
              lineItems.map((item, idx) => {
                const isEditing = editingIndex === idx;

                if (isEditing && editFormData) {
                  return (
                    <tr key={idx} className="bg-blue-50/50">
                      <td className="py-2 px-2 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={editFormData.itemCode || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, itemCode: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={editFormData.hsCode}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, hsCode: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono font-bold text-blue-700"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <input
                            type="number"
                            value={editFormData.quantity}
                            onChange={(e) => {
                              const q = parseFloat(e.target.value) || 0;
                              setEditFormData({
                                ...editFormData,
                                quantity: q,
                                totalAmount: q * (editFormData.unitPrice || 0),
                              });
                            }}
                            className="w-12 px-1 py-1 text-xs border border-slate-300 rounded bg-white text-right"
                          />
                          <input
                            type="text"
                            value={editFormData.unit || 'PC'}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, unit: e.target.value.toUpperCase() })
                            }
                            className="w-9 px-1 py-1 text-xs border border-slate-300 rounded bg-white uppercase text-center font-mono"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.1"
                          value={editFormData.netWeight ?? ''}
                          onChange={(e) => {
                            const net = parseFloat(e.target.value) || 0;
                            const currentGross = editFormData.grossWeight;
                            setEditFormData({
                              ...editFormData,
                              netWeight: net,
                              grossWeight: (!currentGross || currentGross === 0) ? Math.round(net * 1.06 * 10) / 10 : currentGross,
                            });
                          }}
                          placeholder="0.0"
                          className="w-full px-1.5 py-1 text-xs border border-slate-300 rounded bg-white text-right font-mono"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.1"
                          value={editFormData.grossWeight ?? ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              grossWeight: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.0"
                          className="w-full px-1.5 py-1 text-xs border border-slate-300 rounded bg-white text-right font-mono"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={editFormData.unitPrice}
                          onChange={(e) => {
                            const p = parseFloat(e.target.value) || 0;
                            setEditFormData({
                              ...editFormData,
                              unitPrice: p,
                              totalAmount: (editFormData.quantity || 0) * p,
                            });
                          }}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-right font-mono"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-800">
                        {(editFormData.totalAmount || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => saveEdit(idx)}
                            className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                      {item.itemCode || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.hsCode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {item.quantity} <span className="text-[10px] text-slate-400">{item.unit || 'PC'}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 font-medium">
                      {item.netWeight !== undefined && item.netWeight !== null
                        ? item.netWeight.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                        : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 font-medium">
                      {item.grossWeight !== undefined && item.grossWeight !== null
                        ? item.grossWeight.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                        : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {(item.unitPrice || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {(item.totalAmount || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(idx)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                          title="Edit Line"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteLineItem(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                          title="Delete Line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
              <td colSpan={5} className="py-3 px-4 text-right">
                Line Totals:
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-900">
                {(totalNetWeight || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-900">
                {(totalGrossWeight || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
              </td>
              <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                Subtotal:
              </td>
              <td className="py-3 px-3 text-right font-mono text-slate-900">
                {currency}{' '}
                {(totalLinesValue || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
