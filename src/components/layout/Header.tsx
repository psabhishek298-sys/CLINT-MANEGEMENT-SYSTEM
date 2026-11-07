import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Bell, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { isToday, isOverdue } from '../../utils/helpers';
import { isSupabaseConfigured } from '../../services/supabase';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { clients } = useClients();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clients?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/clients');
    }
  };

  const dueFollowUps = clients.filter(c => isToday(c.nextFollowUpDate) || isOverdue(c.nextFollowUpDate));

  return (
    <header className="hidden lg:flex items-center justify-between h-16 px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md sticky top-0 z-10 transition-colors">
      {/* Global Search */}
      <form onSubmit={handleSearch} className="relative w-80">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search company, phone, location..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Database Status */}
        <div
          onClick={() => navigate('/settings')}
          className="cursor-pointer hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 hover:opacity-90 transition-opacity"
          title="View Supabase connection settings."
        >
          <Database size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>{isSupabaseConfigured ? 'Supabase Configured' : 'Supabase Setup Needed'}</span>
        </div>

        {/* Follow-up Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Follow-up Reminders"
          >
            <Bell size={18} />
            {dueFollowUps.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 py-3 z-50 animate-scale-in">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Follow-up Reminders
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold">
                  {dueFollowUps.length} due
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {dueFollowUps.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 flex flex-col items-center gap-1.5">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span>All follow-ups are up to date!</span>
                  </div>
                ) : (
                  dueFollowUps.slice(0, 5).map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(`/clients/${c.id}`);
                      }}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[170px]">
                          {c.companyName}
                        </p>
                        {isOverdue(c.nextFollowUpDate) ? (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                            <AlertCircle size={10} /> Overdue
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                            Due Today
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {c.contactPerson} · {c.mobileNumber}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 px-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/follow-ups');
                  }}
                  className="w-full text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline py-1"
                >
                  View All Follow-ups
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Client CTA */}
        <button
          type="button"
          onClick={() => navigate('/clients/new')}
          className="btn-primary py-2 px-3.5 text-xs font-semibold shadow-sm shadow-emerald-500/20"
        >
          <UserPlus size={15} />
          <span>Add Client</span>
        </button>
      </div>
    </header>
  );
}
