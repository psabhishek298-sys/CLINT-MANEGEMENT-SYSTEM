import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  AlertCircle,
  Clock,
  CheckCircle2,
  Phone,
  Calendar,
  Edit2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Client } from '../types';
import { formatDate, isOverdue, isToday, isUpcoming } from '../utils/helpers';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

type Tab = 'today' | 'upcoming' | 'overdue' | 'all';

export default function FollowUps() {
  const navigate = useNavigate();
  const { clients, updateClient } = useClients();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [rescheduleClient, setRescheduleClient] = useState<Client | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newNote, setNewNote] = useState('');

  // Clients with follow-up dates
  const clientsWithFollowUp = clients.filter(c => Boolean(c.nextFollowUpDate));

  const todayList = clientsWithFollowUp.filter(c => isToday(c.nextFollowUpDate));
  const overdueList = clientsWithFollowUp.filter(c => isOverdue(c.nextFollowUpDate));
  const upcomingList = clientsWithFollowUp.filter(c => isUpcoming(c.nextFollowUpDate));

  const getListForTab = () => {
    switch (activeTab) {
      case 'today':
        return todayList;
      case 'upcoming':
        return upcomingList;
      case 'overdue':
        return overdueList;
      case 'all':
        return clientsWithFollowUp;
      default:
        return todayList;
    }
  };

  const handleOpenReschedule = (client: Client) => {
    setRescheduleClient(client);
    setNewDate(client.nextFollowUpDate);
    setNewNote('');
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleClient) return;

    const existingNotes = rescheduleClient.notes || '';
    const updatedNotes = newNote.trim()
      ? `${existingNotes}\n[Follow-up Rescheduled to ${newDate}]: ${newNote.trim()}`
      : existingNotes;

    updateClient(rescheduleClient.id, {
      nextFollowUpDate: newDate,
      notes: updatedNotes,
    });

    setRescheduleClient(null);
  };

  const handleMarkDone = (client: Client) => {
    updateClient(client.id, {
      nextFollowUpDate: '',
      contactStatus: 'Contacted',
    });
  };

  const currentList = getListForTab();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Follow-up Schedule
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and prioritize upcoming sales conversations and prospect check-ins
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'today'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <Clock size={16} />
          <span>Today's Calls</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            {todayList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overdue'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <AlertCircle size={16} />
          <span>Overdue</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            {overdueList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'upcoming'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <CalendarClock size={16} />
          <span>Upcoming (Next 7 Days)</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            {upcomingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <span>All Scheduled</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {clientsWithFollowUp.length}
          </span>
        </button>
      </div>

      {/* List Content */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="card p-12 text-center text-xs text-gray-400 space-y-2">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              No follow-ups in this queue
            </p>
            <p>You are all caught up on scheduled prospect follow-ups!</p>
          </div>
        ) : (
          currentList.map(client => {
            const overdue = isOverdue(client.nextFollowUpDate);
            const dueToday = isToday(client.nextFollowUpDate);

            return (
              <div
                key={client.id}
                className="card p-5 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="font-bold text-gray-950 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 text-left"
                    >
                      {client.companyName}
                    </button>
                    <StatusBadge status={client.projectStatus} />
                    {overdue ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                        Overdue
                      </span>
                    ) : dueToday ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                        Due Today
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Contact: <strong className="text-gray-700 dark:text-gray-200">{client.contactPerson || 'N/A'}</strong> ·{' '}
                    <a
                      href={`tel:${client.mobileNumber}`}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                    >
                      {client.mobileNumber}
                    </a>{' '}
                    · {client.location}
                  </p>

                  {client.notes && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg mt-2 italic">
                      "{client.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800">
                  <div className="text-right mr-2 hidden lg:block">
                    <span className="text-[10px] text-gray-400 block uppercase">Scheduled Date</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {formatDate(client.nextFollowUpDate)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReschedule(client)}
                    className="btn-secondary py-1.5 px-3 text-xs"
                    title="Reschedule Follow-up"
                  >
                    <Calendar size={13} />
                    <span>Reschedule</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkDone(client)}
                    className="btn-primary py-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                    title="Mark Completed"
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Done</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleClient && (
        <Modal
          isOpen={!!rescheduleClient}
          onClose={() => setRescheduleClient(null)}
          title={`Reschedule: ${rescheduleClient.companyName}`}
          size="md"
        >
          <form onSubmit={handleSaveReschedule} className="space-y-4 text-xs">
            <div>
              <label className="label">New Follow-up Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Reason / Follow-up Plan</label>
              <textarea
                rows={3}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="e.g. Client requested callback on Tuesday after review with partners..."
                className="input-field resize-y"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleClient(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
