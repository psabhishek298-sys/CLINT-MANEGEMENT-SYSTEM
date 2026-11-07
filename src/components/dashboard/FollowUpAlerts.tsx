import { useNavigate } from 'react-router-dom';
import { CalendarClock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Client } from '../../types';
import { formatDate, isOverdue, isToday } from '../../utils/helpers';
import StatusBadge from '../ui/StatusBadge';

interface FollowUpAlertsProps {
  clients: Client[];
}

export default function FollowUpAlerts({ clients }: FollowUpAlertsProps) {
  const navigate = useNavigate();

  const dueFollowUps = clients
    .filter(c => c.nextFollowUpDate && (isToday(c.nextFollowUpDate) || isOverdue(c.nextFollowUpDate)))
    .sort((a, b) => new Date(a.nextFollowUpDate).getTime() - new Date(b.nextFollowUpDate).getTime())
    .slice(0, 5);

  if (dueFollowUps.length === 0) {
    return (
      <div className="card p-5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-emerald-950 dark:text-emerald-200">
              All Follow-ups Complete
            </h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              There are no pending or overdue follow-up calls scheduled for today.
            </p>
          </div>
          <button
            onClick={() => navigate('/follow-ups')}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
          >
            <span>View Calendar</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 dark:from-amber-950/20 dark:via-gray-900 dark:to-amber-950/10 border-amber-200/70 dark:border-amber-900/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white">
            <CalendarClock size={16} />
          </div>
          <h4 className="text-sm font-bold text-gray-950 dark:text-gray-100">
            Action Required: Follow-up Reminders ({dueFollowUps.length})
          </h4>
        </div>
        <button
          onClick={() => navigate('/follow-ups')}
          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>Manage All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {dueFollowUps.map(client => {
          const overdue = isOverdue(client.nextFollowUpDate);
          return (
            <div
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              className="p-3 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/70 hover:border-amber-400 dark:hover:border-amber-600 cursor-pointer transition-all shadow-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {client.companyName}
                </span>
                {overdue ? (
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                    <AlertCircle size={10} /> Overdue
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                    Due Today
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {client.contactPerson} · {client.mobileNumber}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                <StatusBadge status={client.projectStatus} />
                <span className="text-[11px] text-gray-400 font-medium">
                  {formatDate(client.nextFollowUpDate)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
