import React, { useState } from 'react';
import { GroupedHsItem, InvoiceHeader } from '../types/asycuda';
import { Layers, Tag, Package, DollarSign, Globe, Edit2, Check, X, Plus, Trash2, Scale } from 'lucide-react';

interface HsGroupingOverviewProps {
  hsGroups: GroupedHsItem[];
  header: InvoiceHeader;
  onUpdateHsGroup: (index: number, updated: GroupedHsItem) => void;
  onDeleteHsGroup: (index: number) => void;
  onAddHsGroup: () => void;
}

export const HsGroupingOverview: React.FC<HsGroupingOverviewProps> = ({
  hsGroups,
  header,
  onUpdateHsGroup,
  onDeleteHsGroup,
  onAddHsGroup,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<GroupedHsItem | null>(null);

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditFormData({ ...hsGroups[idx] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditFormData(null);
  };

  const saveEdit = (idx: number) => {
    if (editFormData) {
      onUpdateHsGroup(idx, editFormData);
    }
    setEditingIndex(null);
    setEditFormData(null);
  };

  const totalHsValue = hsGroups.reduce((acc, curr) => acc + (curr.itemPrice || 0), 0);
  const totalPackages = hsGroups.reduce((acc, curr) => acc + (curr.numberOfPackages || 0), 0);
  const totalNetWeight = hsGroups.reduce((acc, curr) => acc + (curr.netWeight || 0), 0);
  const totalGrossWeight = hsGroups.reduce((acc, curr) => acc + (curr.grossWeight || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>HS Tariff Groups</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {hsGroups.length} <span className="text-xs font-normal text-slate-500">&lt;Item&gt; blocks</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Package className="w-3.5 h-3.5 text-amber-600" />
            <span>Total Packages</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {(totalPackages || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">pkgs</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Scale className="w-3.5 h-3.5 text-cyan-600" />
            <span>Total Weights</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono leading-tight mt-0.5">
            <div>Net: {((header.netWeight !== undefined && header.netWeight !== null) ? header.netWeight : totalNetWeight || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg</div>
            <div className="text-slate-500 text-xs font-normal">Gross: {((header.grossWeight !== undefined && header.grossWeight !== null) ? header.grossWeight : totalGrossWeight || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sum of Item Values</span>
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">
            {header.currencyCode || 'ZAR'} {(totalHsValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Total CIF Valuation</span>
          </div>
          <div className="text-xl font-bold text-indigo-800 font-mono">
            {header.currencyCode || 'ZAR'} {((header.totalCif !== undefined && header.totalCif !== null) ? header.totalCif : ((totalHsValue || 0) + (header.freightCost || 0))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* HS Groups List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Harmonized Tariff (HS) Code Groups (ASYCUDA &lt;Item&gt; Blocks)
            </h3>
            <p className="text-xs text-slate-500">
              Line items with identical 8-digit tariff codes are combined. Each group corresponds to a single &lt;Item&gt; in the ASYCUDA XML.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddHsGroup}
            className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add HS Group</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {hsGroups.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No HS Code groups available. Upload a commercial invoice or click Reference Invoice above.
            </div>
          ) : (
            hsGroups.map((group, idx) => {
              const isEditing = editingIndex === idx;

              if (isEditing && editFormData) {
                return (
                  <div key={idx} className="p-4 bg-blue-50/40 border-l-4 border-blue-600 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                        Editing Item #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(idx)}
                          className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-medium flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 hover:bg-slate-300 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Commodity / HS Code (8-digits)
                        </label>
                        <input
                          type="text"
                          value={editFormData.commodityCode}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, commodityCode: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Packages (Qty & Unit)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editFormData.numberOfPackages}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                numberOfPackages: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 px-2 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="BX"
                            value={editFormData.kindOfPackagesCode}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                kindOfPackagesCode: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-16 px-1.5 py-1.5 text-xs uppercase font-mono border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="BOX"
                            value={editFormData.kindOfPackagesName}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                kindOfPackagesName: e.target.value.toUpperCase(),
                              })
                            }
                            className="flex-1 px-2 py-1.5 text-xs uppercase border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Weights: Net / Gross (kg)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Net kg"
                            value={editFormData.netWeight ?? ''}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                netWeight: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-1/2 px-2 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Gross kg"
                            value={editFormData.grossWeight ?? ''}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                grossWeight: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-1/2 px-2 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Item Total Price ({header.currencyCode || 'ZAR'})
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editFormData.itemPrice}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditFormData({
                              ...editFormData,
                              itemPrice: val,
                              valueItem: val,
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Official Tariff Description (&lt;Description_of_goods&gt;)
                        </label>
                        <input
                          type="text"
                          value={editFormData.descriptionOfGoods}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, descriptionOfGoods: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Commercial Description (&lt;Commercial_Description&gt;)
                        </label>
                        <input
                          type="text"
                          value={editFormData.commercialDescription}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, commercialDescription: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* HS Code Badge & Basic Info */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-blue-900 text-blue-100 tracking-wider">
                            HS {group.commodityCode}
                          </span>
                          <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                            {group.numberOfPackages} {group.kindOfPackagesCode} ({group.kindOfPackagesName})
                          </span>
                          {(group.netWeight !== undefined || group.grossWeight !== undefined) && (
                            <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                              <Scale className="w-3 h-3 text-cyan-600" />
                              <span>{group.netWeight ?? 0} kg net / {group.grossWeight ?? 0} kg gross</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Pref: {group.preferenceCode || 'SCU'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200">
                            Proc: {group.extendedCustomsProcedure || '4000'} / {group.nationalCustomsProcedure || '016'}
                          </span>
                        </div>

                        <div className="mt-1.5">
                          <p className="text-xs font-semibold text-slate-800">
                            {group.descriptionOfGoods || 'Tariff Description'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5 uppercase">
                            Commercial: {group.commercialDescription}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Amount & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-11 md:pl-0">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-slate-900">
                          {header.currencyCode || 'ZAR'}{' '}
                          {(group.itemPrice || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Customs Value Item
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(idx)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="Edit HS Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteHsGroup(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="Delete HS Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
