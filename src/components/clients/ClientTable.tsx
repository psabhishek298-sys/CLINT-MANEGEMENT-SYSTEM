import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  Phone,
  Building,
  CheckSquare,
  Square,
  Download,
} from 'lucide-react';
import { Client, SortState, SortField } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../utils/helpers';
import ConfirmDialog from '../ui/ConfirmDialog';

interface ClientTableProps {
  clients: Client[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  onDeleteClient: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onExportSelected?: (selectedClients: Client[]) => void;
}

export default function ClientTable({
  clients,
  sort,
  onSortChange,
  onDeleteClient,
  onBulkDelete,
  onExportSelected,
}: ClientTableProps) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({
        field,
        direction: 'asc',
      });
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return <ArrowUpDown size={13} className="text-gray-400 opacity-60" />;
    return sort.direction === 'asc' ? (
      <ArrowUp size={13} className="text-emerald-600 dark:text-emerald-400" />
    ) : (
      <ArrowDown size={13} className="text-emerald-600 dark:text-emerald-400" />
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === clients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(clients.map(c => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const isAllSelected = clients.length > 0 && selectedIds.length === clients.length;

  return (
    <div className="card overflow-hidden">
      {/* Bulk actions banner if rows selected */}
      {selectedIds.length > 0 && (
        <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-900 dark:text-emerald-200">
              {selectedIds.length} {selectedIds.length === 1 ? 'client' : 'clients'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onExportSelected && (
              <button
                type="button"
                onClick={() => {
                  const selectedClients = clients.filter(c => selectedIds.includes(c.id));
                  onExportSelected(selectedClients);
                }}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                <Download size={13} />
                <span>Export Selected</span>
              </button>
            )}
            {onBulkDelete && (
              <button
                type="button"
                onClick={() => setBulkDeleteConfirmOpen(true)}
                className="btn-danger py-1.5 px-3 text-xs"
              >
                <Trash2 size={13} />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wider">
            <tr>
              <th className="py-3 px-4 w-10 text-center">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {isAllSelected ? (
                    <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
              <th
                onClick={() => handleSort('companyName')}
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company Name</span>
                  {getSortIcon('companyName')}
                </div>
              </th>
              <th
                onClick={() => handleSort('contactPerson')}
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Contact Person</span>
                  {getSortIcon('contactPerson')}
                </div>
              </th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">Category</th>
              <th
                onClick={() => handleSort('location')}
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Location</span>
                  {getSortIcon('location')}
                </div>
              </th>
              <th className="py-3 px-4">Website</th>
              <th className="py-3 px-4">Contact Status</th>
              <th className="py-3 px-4">Demo Status</th>
              <th
                onClick={() => handleSort('projectStatus')}
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Project Status</span>
                  {getSortIcon('projectStatus')}
                </div>
              </th>
              <th
                onClick={() => handleSort('createdAt')}
                className="py-3 px-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Created Date</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {clients.map(client => {
              const isSelected = selectedIds.includes(client.id);
              return (
                <tr
                  key={client.id}
                  className={`transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40 ${
                    isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSelectRow(client.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </td>

                  {/* Company Name */}
                  <td className="py-3.5 px-4 font-semibold text-gray-950 dark:text-gray-100 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left transition-colors font-semibold"
                    >
                      {client.companyName}
                    </button>
                  </td>

                  {/* Contact Person */}
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {client.contactPerson || '—'}
                  </td>

                  {/* Mobile Number */}
                  <td className="py-3.5 px-4 font-mono text-gray-900 dark:text-gray-200 whitespace-nowrap">
                    <a
                      href={`tel:${client.mobileNumber}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1"
                    >
                      <Phone size={11} className="text-gray-400" />
                      <span>{client.mobileNumber}</span>
                    </a>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      {client.businessCategory}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 max-w-[140px] truncate" title={client.location}>
                    {client.location || '—'}
                  </td>

                  {/* Website */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {client.hasWebsite ? (
                      client.existingWebsiteUrl ? (
                        <a
                          href={client.existingWebsiteUrl.startsWith('http') ? client.existingWebsiteUrl : `https://${client.existingWebsiteUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <Globe size={12} />
                          <span>Visit</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">Yes</span>
                      )
                    ) : (
                      <span className="text-gray-400 text-[11px]">No Website</span>
                    )}
                  </td>

                  {/* Contact Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={client.contactStatus} />
                  </td>

                  {/* Demo Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={client.demoStatus} />
                  </td>

                  {/* Project Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={client.projectStatus} />
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(client.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors"
                        title="View Profile"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/clients/${client.id}?edit=true`)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(client.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <ConfirmDialog
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            if (deleteTargetId) {
              onDeleteClient(deleteTargetId);
              setDeleteTargetId(null);
            }
          }}
          title="Delete Client Record"
          message="Are you sure you want to permanently delete this client record? This action cannot be undone."
          confirmLabel="Delete Record"
          variant="danger"
        />
      )}

      {/* Bulk Delete Modal */}
      {bulkDeleteConfirmOpen && (
        <ConfirmDialog
          isOpen={bulkDeleteConfirmOpen}
          onClose={() => setBulkDeleteConfirmOpen(false)}
          onConfirm={handleBulkDelete}
          title={`Delete ${selectedIds.length} Clients`}
          message={`Are you sure you want to delete these ${selectedIds.length} selected client records? All associated activity logs and notes will also be removed.`}
          confirmLabel={`Delete ${selectedIds.length} Records`}
          variant="danger"
        />
      )}
    </div>
  );
}
