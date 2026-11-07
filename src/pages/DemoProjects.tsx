import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Monitor,
  ExternalLink,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Plus,
  Building,
  Phone,
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Client, DemoStatus } from '../types';
import { formatDate } from '../utils/helpers';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

export default function DemoProjects() {
  const navigate = useNavigate();
  const { clients, updateClient } = useClients();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingDemoClient, setEditingDemoClient] = useState<Client | null>(null);
  const [demoStatus, setDemoStatus] = useState<DemoStatus>('Not Started');
  const [demoUrl, setDemoUrl] = useState('');
  const [demoNotes, setDemoNotes] = useState('');

  const demoClients = clients.filter(c => c.demoRequired || c.projectStatus === 'Demo Requested' || c.projectStatus === 'Demo Approved');

  const filteredDemos = demoClients.filter(c => {
    if (statusFilter === 'all') return true;
    return statusFilter === 'Demo Approved'
      ? c.projectStatus === 'Demo Approved' || c.demoStatus === 'Approved'
      : c.projectStatus !== 'Demo Approved' && c.demoStatus !== 'Approved';
  });

  const handleOpenEdit = (client: Client) => {
    setEditingDemoClient(client);
    setDemoStatus(client.projectStatus === 'Demo Approved' || client.demoStatus === 'Approved' ? 'Approved' : 'In Progress');
    setDemoUrl(client.demoUrl || '');
    setDemoNotes(client.notes || '');
  };

  const handleSaveDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDemoClient) return;

    updateClient(editingDemoClient.id, {
      demoStatus,
      demoUrl: demoUrl.trim(),
      notes: demoNotes.trim(),
      demoRequired: true,
      projectStatus: demoStatus === 'Approved' ? 'Demo Approved' : 'Demo Requested',
    });

    setEditingDemoClient(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Demo Project Pipeline
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-semibold">
              {demoClients.length} Pitches
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track custom demo websites engineered to convert prospective clients
          </p>
        </div>

        <button
          onClick={() => navigate('/clients/new')}
          className="btn-primary text-xs py-2 px-3.5 shadow-sm shadow-emerald-500/20"
        >
          <Plus size={14} />
          <span>New Demo Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 sm:gap-4 overflow-x-auto text-xs">
        {['all', 'Demo Requested', 'Demo Approved'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`pb-3 px-3 font-semibold border-b-2 transition-colors capitalize whitespace-nowrap ${
              statusFilter === status
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
            }`}
          >
            {status === 'all' ? 'All Demos' : status} (
            {status === 'all'
              ? demoClients.length
              : status === 'Demo Approved'
                ? demoClients.filter(c => c.projectStatus === 'Demo Approved' || c.demoStatus === 'Approved').length
                : demoClients.filter(c => c.projectStatus !== 'Demo Approved' && c.demoStatus !== 'Approved').length}
            )
          </button>
        ))}
      </div>

      {/* Demos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemos.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-xs text-gray-400 space-y-2">
            <Monitor size={32} className="text-purple-500 mx-auto" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              No demo projects found in this view
            </p>
            <p>Clients marked with "Demo Website Required" will automatically appear in this pipeline.</p>
          </div>
        ) : (
          filteredDemos.map(client => (
            <div
              key={client.id}
              className="card p-5 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="font-bold text-gray-950 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 text-left line-clamp-1"
                  >
                    {client.companyName}
                  </button>
                  <StatusBadge status={client.projectStatus === 'Demo Approved' || client.demoStatus === 'Approved' ? 'Demo Approved' : 'Demo Requested'} />
                </div>

                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="text-emerald-500" />
                    <span className="font-mono text-gray-800 dark:text-gray-200">{client.mobileNumber}</span>
                    <span className="text-gray-400">({client.contactPerson || 'N/A'})</span>
                  </p>
                  <p>
                    Requested: <strong className="text-gray-700 dark:text-gray-300">{formatDate(client.createdAt)}</strong>
                  </p>
                </div>

                {/* Demo URL Preview Box */}
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-semibold uppercase text-gray-400 block mb-1">
                    Demo Showcase URL
                  </span>
                  {client.demoUrl ? (
                    <a
                      href={client.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-mono hover:underline flex items-center gap-1 truncate"
                    >
                      <Monitor size={12} />
                      <span className="truncate">{client.demoUrl}</span>
                      <ExternalLink size={10} className="flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No demo URL deployed yet</span>
                  )}
                </div>

                {client.notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 italic">
                    "{client.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
                <button
                  type="button"
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(client)}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  <Edit2 size={12} />
                  <span>Update Demo</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Demo Modal */}
      {editingDemoClient && (
        <Modal
          isOpen={!!editingDemoClient}
          onClose={() => setEditingDemoClient(null)}
          title={`Update Demo: ${editingDemoClient.companyName}`}
          size="md"
        >
          <form onSubmit={handleSaveDemo} className="space-y-4 text-xs">
            <div>
              <label className="label">Demo Status</label>
              <select
                value={demoStatus}
                onChange={e => setDemoStatus(e.target.value as DemoStatus)}
                className="select-field text-xs"
              >
                <option value="In Progress">Demo Requested</option>
                <option value="Approved">Demo Approved</option>
              </select>
            </div>

            <div>
              <label className="label">Demo Live URL</label>
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://demo.example.com/client-slug"
                className="input-field text-xs font-mono"
              />
            </div>

            <div>
              <label className="label">Notes / Client Feedback</label>
              <textarea
                rows={3}
                value={demoNotes}
                onChange={e => setDemoNotes(e.target.value)}
                placeholder="Client feedback on the demo prototype, requested design tweaks..."
                className="input-field text-xs resize-y"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDemoClient(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save Demo Details
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
