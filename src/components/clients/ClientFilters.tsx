import { Search, Filter, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types';
import { useClients } from '../../context/ClientContext';

interface ClientFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalFiltered: number;
}

export default function ClientFilters({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
}: ClientFiltersProps) {
  const { categories } = useClients();
  const updateField = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.businessCategory) ||
    Boolean(filters.hasWebsite) ||
    Boolean(filters.contactStatus) ||
    Boolean(filters.demoStatus) ||
    Boolean(filters.projectStatus);

  return (
    <div className="card p-5 space-y-4">
      {/* Top Search & Active Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => updateField('search', e.target.value)}
            placeholder="Search by company, person, mobile number, or location..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-1">
            Matching: <strong className="text-gray-900 dark:text-gray-100">{totalFiltered}</strong>
          </span>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="btn-secondary py-2 px-3 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
        {/* Business Category */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.businessCategory}
            onChange={e => updateField('businessCategory', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Has Website */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Website
          </label>
          <select
            value={filters.hasWebsite}
            onChange={e => updateField('hasWebsite', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All (Has or No)</option>
            <option value="yes">Has Website</option>
            <option value="no">No Website</option>
          </select>
        </div>

        {/* Contact Status */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Contact Status
          </label>
          <select
            value={filters.contactStatus}
            onChange={e => updateField('contactStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Contact Statuses</option>
            <option value="Not Contacted">Not Contacted</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up Required">Follow-up Required</option>
          </select>
        </div>

        {/* Project Status */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Project Status
          </label>
          <select
            value={filters.projectStatus}
            onChange={e => updateField('projectStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Project Stages</option>
            <option value="New Lead">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Demo Requested">Demo Requested</option>
            <option value="Demo Approved">Demo Approved</option>
            <option value="Completed">Completed</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>
      </div>
    </div>
  );
}
