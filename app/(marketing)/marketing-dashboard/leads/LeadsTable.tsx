'use client';

import { useState, useMemo } from 'react';
import { Download, Search, Users, FileText, Phone, Mail, MapPin, Calendar, ArrowUpDown, Filter, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Lead } from '@/app/(marketing)/_actions/leadActions';

interface LeadsTableProps {
  leads: Lead[];
}

type SortField = 'created_at' | 'full_name' | 'city';
type SortOrder = 'asc' | 'desc';

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

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
    let result = leads.filter((lead) => {
      // Text search
      const matchesSearch =
        !searchQuery ||
        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      // Type filter
      const matchesType = filterType === 'all' || lead.form_type === filterType;

      // Date range filter
      const leadDate = new Date(lead.created_at);
      const matchesDateFrom = !dateFrom || leadDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || leadDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
    });

    // Sort
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

    // Auto-size columns
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

  const getTypeBadge = (formType: string) => {
    if (formType === 'general_enquiry') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <Users className="w-3 h-3" />
          Enquiry
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        <FileText className="w-3 h-3" />
        {formType}
      </span>
    );
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
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name, email, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Toggle Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={filteredLeads.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export to Excel ({filteredLeads.length})
        </button>
      </div>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Filter Enquiries</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Lead Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="general_enquiry">Franchise Enquiry</option>
                <option value="franchise_application">Franchise Application</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="created_at">Date</option>
                  <option value="full_name">Name</option>
                  <option value="city">City</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors font-medium text-gray-600"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium py-1">Quick:</span>
            <button onClick={() => setPreset(7)} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors">Last 7 days</button>
            <button onClick={() => setPreset(30)} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors">Last 30 days</button>
            <button onClick={() => setPreset(90)} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors">Last 90 days</button>
            <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors">All time</button>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{filteredLeads.length} enquir{filteredLeads.length !== 1 ? 'ies' : 'y'}</span>
        {filteredLeads.length !== leads.length && (
          <span className="text-gray-400">out of {leads.length} total</span>
        )}
        {dateFrom && dateTo && (
          <span className="flex items-center gap-1 text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(dateFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — {new Date(dateTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Table */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">No enquiries found</h3>
          <p className="text-gray-400 text-sm">
            {hasActiveFilters ? 'Try adjusting your filters.' : 'Enquiries and brochure requests will appear here.'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 text-sm text-green-600 font-medium hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 uppercase text-xs tracking-wider">
                    <SortButton field="full_name" label="Name" />
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Email</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 uppercase text-xs tracking-wider">
                    <SortButton field="city" label="City" />
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 uppercase text-xs tracking-wider">
                    <SortButton field="created_at" label="Date" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{lead.full_name}</td>
                    <td className="px-5 py-4 text-gray-600">
                      <a href={`tel:${lead.phone}`} className="hover:text-green-700 transition-colors">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <a href={`mailto:${lead.email}`} className="hover:text-green-700 transition-colors truncate block max-w-[200px]">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{lead.city}</td>
                    <td className="px-5 py-4">{getTypeBadge(lead.form_type)}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <br />
                      <span className="text-gray-400">
                        {new Date(lead.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{lead.full_name}</span>
                  {getTypeBadge(lead.form_type)}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${lead.phone}`} className="hover:text-green-700">{lead.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${lead.email}`} className="hover:text-green-700">{lead.email}</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {lead.city}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(lead.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
