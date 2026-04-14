'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Search, Users, FileText, Phone, MapPin, Calendar, ArrowUpDown, Filter, X, Trash2, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Lead } from '@/app/(marketing)/_actions/leadActions';
import { deleteLeadAction } from '@/app/(marketing)/_actions/leadActions';

interface LeadsTableProps {
  leads: Lead[];
}

type SortField = 'created_at' | 'full_name' | 'city';
type SortOrder = 'asc' | 'desc';

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the enquiry from "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteLeadAction(id);
      setDeletingId(null);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  };

  // Quick date presets
  const setPreset = (days: number) => {
    const now = new Date();
    const from = new Date();
    from.setDate(now.getDate() - days);
    setDateFrom(from.toISOString().split('T')[0]);
    setDateTo(now.toISOString().split('T')[0]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setDateFrom('');
    setDateTo('');
    setSortField('created_at');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchQuery || filterType !== 'all' || dateFrom || dateTo;

  // Filter + Sort leads
  const filteredLeads = useMemo(() => {
    const result = leads.filter((lead) => {
      const matchesSearch =
        !searchQuery ||
        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchesType = filterType === 'all' || lead.form_type === filterType;

      const leadDate = new Date(lead.created_at);
      const matchesDateFrom = !dateFrom || leadDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || leadDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'full_name') {
        comparison = a.full_name.localeCompare(b.full_name);
      } else if (sortField === 'city') {
        comparison = a.city.localeCompare(b.city);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [leads, searchQuery, filterType, dateFrom, dateTo, sortField, sortOrder]);

  // Export to Excel
  const handleExport = () => {
    if (filteredLeads.length === 0) return;

    const exportData = filteredLeads.map((lead) => ({
      'Full Name': lead.full_name,
      'Phone': lead.phone,
      'Email': lead.email,
      'City': lead.city,
      'Message': lead.message || '-',
      'Form Type': lead.form_type === 'general_enquiry' ? 'Franchise Enquiry' : lead.form_type,
      'Date': new Date(lead.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((row) => String(row[key as keyof typeof row]).length)
      ),
    }));
    worksheet['!cols'] = colWidths;

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `T_Vanamm_Enquiries_${today}.xlsx`);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };


  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 hover:text-green-700 transition-colors"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-green-600' : 'text-gray-300'}`} />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Top Row: Search + Toggle Filters + Export */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </button>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredLeads.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-800 text-white rounded-lg text-sm font-semibold hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Export ({filteredLeads.length})</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Filter Enquiries</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                <X className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Lead Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="general_enquiry">Franchise Enquiry</option>
                <option value="franchise_application">Franchise Application</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Quick Select</label>
              <div className="flex gap-2">
                <button onClick={() => setPreset(7)} className="flex-1 py-2 rounded-lg bg-gray-50 text-xs font-medium hover:bg-green-50 hover:text-green-700 transition-colors">7D</button>
                <button onClick={() => setPreset(30)} className="flex-1 py-2 rounded-lg bg-gray-50 text-xs font-medium hover:bg-green-50 hover:text-green-700 transition-colors">30D</button>
                <button onClick={() => setPreset(90)} className="flex-1 py-2 rounded-lg bg-gray-50 text-xs font-medium hover:bg-green-50 hover:text-green-700 transition-colors">90D</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center gap-4 text-sm text-gray-500 px-1">
        <span className="font-semibold text-gray-700">{filteredLeads.length} leads</span>
        {filteredLeads.length !== leads.length && <span className="text-gray-400">filtered from {leads.length}</span>}
      </div>

      {/* Table / Results */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-20 md:mb-0">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm table-auto border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-5 py-4 text-left"><SortButton field="full_name" label="Name" /></th>
                <th className="px-5 py-4 text-left">Phone</th>
                <th className="px-5 py-4 text-left"><SortButton field="city" label="City" /></th>
                <th className="px-5 py-4 text-left"><SortButton field="created_at" label="Date" /></th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-20 text-center text-gray-400">No leads found matching your search.</td></tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4 font-medium text-gray-900 truncate" title={lead.full_name}>{lead.full_name}</td>
                    <td className="px-5 py-4 text-gray-600 truncate">
                      <a href={`tel:${lead.phone}`} className="hover:text-green-700">{lead.phone}</a>
                    </td>
                    <td className="px-5 py-4 text-gray-600 truncate">{lead.city}</td>
                    <td className="px-5 py-4 text-gray-500 text-[10px] font-medium leading-relaxed uppercase tracking-wider">
                      <span suppressHydrationWarning>
                        {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="text-gray-400 text-[9px] lowercase italic" suppressHydrationWarning>
                        {new Date(lead.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lead.id, lead.full_name)}
                        disabled={deletingId === lead.id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Lead"
                      >
                        {deletingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredLeads.length === 0 ? (
            <div className="px-5 py-20 text-center text-gray-400">No leads found.</div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 space-y-3 bg-white">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{lead.full_name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{lead.city}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(lead.id, lead.full_name)}
                    disabled={deletingId === lead.id}
                    className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"
                  >
                    {deletingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="pt-1">
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-xs font-semibold text-gray-700 active:bg-green-50 transition-colors w-full justify-center border border-gray-100">
                    <Phone className="w-3 h-3 text-green-600" /> {lead.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-widest pt-1 border-t border-gray-50">
                  <span>ID: {lead.id.split('-')[0]}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-300" />
                    <span suppressHydrationWarning>
                      {new Date(lead.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
