import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserPlus, Download, Users, RefreshCw } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { FilterState, SortState } from '../types';
import { filterClients, sortClients, paginateClients, exportClientsToCSV } from '../utils/helpers';
import ClientFilters from '../components/clients/ClientFilters';
import ClientTable from '../components/clients/ClientTable';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/ui/EmptyState';

export default function AllClients() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { clients, deleteClient, deleteMultipleClients } = useClients();

  // Filters State synced with URL query params
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get('search') || '',
    businessCategory: searchParams.get('category') || '',
    hasWebsite: searchParams.get('hasWebsite') || '',
    contactStatus: searchParams.get('contactStatus') || '',
    demoStatus: searchParams.get('demoStatus') || '',
    projectStatus: searchParams.get('projectStatus') || '',
  }));

  // Sorting State
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sync state if URL search params change
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlContactStatus = searchParams.get('contactStatus') || '';
    const urlProjectStatus = searchParams.get('projectStatus') || '';

    setFilters(prev => ({
      ...prev,
      search: urlSearch,
      businessCategory: urlCategory,
      contactStatus: urlContactStatus,
      projectStatus: urlProjectStatus,
    }));
    setCurrentPage(1);
  }, [searchParams]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      businessCategory: '',
      hasWebsite: '',
      contactStatus: '',
      demoStatus: '',
      projectStatus: '',
    };
    setFilters(emptyFilters);
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filtered & Sorted Data
  const filteredClients = useMemo(() => {
    return filterClients(clients, filters);
  }, [clients, filters]);

  const sortedClients = useMemo(() => {
    return sortClients(filteredClients, sort);
  }, [filteredClients, sort]);

  const paginatedClients = useMemo(() => {
    return paginateClients(sortedClients, currentPage, itemsPerPage);
  }, [sortedClients, currentPage, itemsPerPage]);

  const handleExportAll = () => {
    exportClientsToCSV(filteredClients);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Client Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold">
              {clients.length} Total
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Search, filter, track outreach status and manage prospective businesses
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAll}
            className="btn-secondary text-xs py-2 px-3.5"
            title="Export filtered records to CSV spreadsheet"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => navigate('/clients/new')}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm shadow-emerald-500/20"
          >
            <UserPlus size={14} />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <ClientFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={filteredClients.length}
      />

      {/* Clients Table or Empty State */}
      {paginatedClients.length === 0 ? (
        <div className="card p-12">
          <EmptyState
            icon={<Users size={32} className="text-gray-400" />}
            title="No matching client records found"
            description="Try modifying or resetting your filter criteria, or add a new business lead."
            action={
              <button onClick={handleResetFilters} className="btn-secondary text-xs">
                <RefreshCw size={14} />
                <span>Reset All Filters</span>
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          <ClientTable
            clients={paginatedClients}
            sort={sort}
            onSortChange={setSort}
            onDeleteClient={deleteClient}
            onBulkDelete={deleteMultipleClients}
            onExportSelected={exportClientsToCSV}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredClients.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
