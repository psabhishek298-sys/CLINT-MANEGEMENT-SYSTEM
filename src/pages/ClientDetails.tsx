import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Phone,
  User,
  MapPin,
  Globe,
  ExternalLink,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  PlusCircle,
  FileText,
  Monitor,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { formatDate, formatDateTime, getRelativeTime, isOverdue } from '../utils/helpers';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ClientForm from '../components/clients/ClientForm';
import Modal from '../components/ui/Modal';
import { Activity } from '../types';

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getClient, updateClient, deleteClient, addActivity } = useClients();

  const isEditingParam = searchParams.get('edit') === 'true';
  const [isEditing, setIsEditing] = useState(isEditingParam);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState<Activity['type']>('call');

  const client = id ? getClient(id) : undefined;

  if (!client) {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto mt-12 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Client Not Found</h3>
        <p className="text-xs text-gray-500">
          The requested client record may have been deleted or the identifier is invalid.
        </p>
        <button onClick={() => navigate('/clients')} className="btn-primary text-xs mx-auto">
          Back to All Clients
        </button>
      </div>
    );
  }

  const handleUpdate = (updatedData: any) => {
    updateClient(client.id, updatedData);
    setIsEditing(false);
    setSearchParams({});
  };

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addActivity(client.id, {
      type: newNoteType,
      description: newNoteText.trim(),
    });

    setNewNoteText('');
    setNewNoteModalOpen(false);
  };

  const handleDelete = () => {
    deleteClient(client.id);
    navigate('/clients');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to All Clients</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              {client.companyName}
            </h1>
            <StatusBadge status={client.projectStatus} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Added on {formatDate(client.createdAt)} · Category: {client.businessCategory}
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setNewNoteModalOpen(true)}
                className="btn-secondary text-xs py-2 px-3"
              >
                <PlusCircle size={14} />
                <span>Log Activity / Note</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary text-xs py-2 px-3.5 shadow-sm shadow-emerald-500/20"
              >
                <Edit2 size={14} />
                <span>Edit Record</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="btn-danger text-xs py-2 px-3"
                title="Delete Record"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSearchParams({});
              }}
              className="btn-secondary text-xs py-2 px-3"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Editing: {client.companyName}
          </h2>
          <ClientForm
            initialData={client}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditing(false);
              setSearchParams({});
            }}
            submitLabel="Update Client Changes"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Business & Project Data (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information Card */}
            <div className="card p-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Building2 size={18} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  Business & Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Contact Person</span>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-gray-100 font-semibold text-sm">
                    <User size={14} className="text-gray-400" />
                    <span>{client.contactPerson || 'Not Provided'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Mobile Number</span>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-gray-100 font-mono font-semibold text-sm">
                    <Phone size={14} className="text-emerald-500" />
                    <a href={`tel:${client.mobileNumber}`} className="hover:underline">
                      {client.mobileNumber}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Industry Category</span>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 font-medium text-gray-800 dark:text-gray-200">
                    {client.businessCategory}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Location</span>
                  <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <MapPin size={13} className="text-rose-500 flex-shrink-0" />
                    <span className="truncate">{client.location || '—'}</span>
                  </div>
                </div>

                {/* Social links */}
                <div className="sm:col-span-2 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap gap-2">
                  {client.googleMapsUrl && (
                    <a
                      href={client.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:underline border border-gray-200 dark:border-gray-700"
                    >
                      <MapPin size={13} />
                      <span>Google Maps Listing</span>
                      <ExternalLink size={11} />
                    </a>
                  )}

                  {client.instagramUrl && (
                    <a
                      href={client.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400 hover:underline border border-gray-200 dark:border-gray-700"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      <span>Instagram</span>
                      <ExternalLink size={11} />
                    </a>
                  )}

                  {client.facebookUrl && (
                    <a
                      href={client.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 hover:underline border border-gray-200 dark:border-gray-700"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      <span>Facebook</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Website & Demo Status Card */}
            <div className="card p-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                  <Globe size={18} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  Website & Demo Progression
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Existing Website</span>
                  {client.hasWebsite && client.existingWebsiteUrl ? (
                    <a
                      href={client.existingWebsiteUrl.startsWith('http') ? client.existingWebsiteUrl : `https://${client.existingWebsiteUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                    >
                      <span>{client.existingWebsiteUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-gray-500">No existing website</span>
                  )}
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Website Quality Assessment</span>
                  <StatusBadge status={client.websiteQuality} />
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Website Interest</span>
                  <StatusBadge status={client.websiteInterest} />
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5 font-medium">Demo Website Required?</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {client.demoRequired ? 'Yes (Required)' : 'No'}
                  </span>
                </div>

                {client.demoRequired && (
                  <>
                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Demo Status</span>
                      <StatusBadge status={client.demoStatus} />
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-0.5 font-medium">Demo Preview URL</span>
                      {client.demoUrl ? (
                        <a
                          href={client.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                        >
                          <Monitor size={12} />
                          <span>{client.demoUrl}</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Demo URL not assigned yet</span>
                      )}
                    </div>
                  </>
                )}

                {client.projectStatus === 'Completed' && (
                  <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300">
                        Completed Project
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                        Completed on {formatDate(client.completionDate || client.updatedAt)}
                      </span>
                    </div>
                    {client.websiteProjectUrl && (
                      <p className="mt-1 text-xs">
                        <span className="text-gray-500">Production URL: </span>
                        <a
                          href={client.websiteProjectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 dark:text-emerald-300 underline font-mono"
                        >
                          {client.websiteProjectUrl}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notes Card */}
            <div className="card p-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                  <FileText size={18} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  Internal Remarks & Notes
                </h3>
              </div>
              <div className="mt-4">
                {client.notes ? (
                  <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {client.notes}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">No notes recorded yet for this client.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Follow-up & Activity Timeline */}
          <div className="space-y-6">
            {/* Follow-up card */}
            <div className="card p-6 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/10">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Next Follow-up
                </span>
                <Calendar size={16} className="text-emerald-500" />
              </div>
              <div className="mt-4">
                {client.nextFollowUpDate ? (
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDate(client.nextFollowUpDate)}
                    </div>
                    {isOverdue(client.nextFollowUpDate) ? (
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
                        ⚠️ Overdue for action
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Scheduled outreach target
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No follow-up date set</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="card p-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  Activity Timeline ({client.activities?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={() => setNewNoteModalOpen(true)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  + Add
                </button>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800 mt-5">
                {(client.activities || []).map(act => (
                  <div key={act.id} className="relative text-xs">
                    <span className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-gray-900" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                        {formatDateTime(act.timestamp)} ({getRelativeTime(act.timestamp)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Quick Activity Modal */}
      <Modal
        isOpen={newNoteModalOpen}
        onClose={() => setNewNoteModalOpen(false)}
        title="Log Activity or Meeting Remark"
        size="md"
      >
        <form onSubmit={handleAddQuickNote} className="space-y-4">
          <div>
            <label className="label">Activity Type</label>
            <select
              value={newNoteType}
              onChange={e => setNewNoteType(e.target.value as Activity['type'])}
              className="select-field text-xs"
            >
              <option value="call">Phone Call with Client</option>
              <option value="note">Internal Discussion Note</option>
              <option value="demo_request">Demo Website Requested</option>
              <option value="demo_sent">Demo Sent to Client</option>
              <option value="demo_approved">Demo Approved by Client</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="converted">Deal Closed / Converted</option>
              <option value="completed">Project Completed</option>
            </select>
          </div>

          <div>
            <label className="label">Description / Remarks</label>
            <textarea
              rows={3}
              required
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              placeholder="e.g. Called client; discussed custom feature requirements for online ordering..."
              className="input-field text-xs resize-y"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setNewNoteModalOpen(false)}
              className="btn-secondary flex-1 text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 text-xs">
              Save Activity
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Record Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Client Record"
        message={`Are you sure you want to permanently delete "${client.companyName}"? All interaction logs will be deleted.`}
        confirmLabel="Permanently Delete"
        variant="danger"
      />
    </div>
  );
}
