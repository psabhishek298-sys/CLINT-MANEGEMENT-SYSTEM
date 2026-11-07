import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Database,
  ShieldCheck,
  RefreshCw,
  Download,
  Upload,
  Check,
  Lock,
  Building,
  Key,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useClients } from '../context/ClientContext';
import { isSupabaseConfigured } from '../services/supabase';

export default function Settings() {
  const { theme } = useTheme();
  const { clients } = useClients();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'supabase' | 'data'>('general');

  const handleResetData = () => {
    if (window.confirm('Delete all client records stored in this browser? This does not delete remote database records.')) {
      localStorage.setItem('truqen-clients', JSON.stringify([]));
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `client-manager-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
          System Settings & Integrations
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure appearance, manage local storage backup, and review Supabase connection
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-3 text-xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          General & Appearance
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'supabase'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          Supabase Database
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'data'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          Data & Backup
        </button>
      </div>

      {/* TAB 1: General & Appearance */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Appearance Card */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Interface Appearance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Customize the visual mode across sessions.
            </p>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Sun size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Light Theme Active
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    The CRM always uses the light theme.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Organization Info */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Organization Profile
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Workspace information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="label">Company Name</label>
                <input
                  type="text"
                  readOnly
                  value="Client Management Workspace"
                  className="input-field bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="label">CRM Product Edition</label>
                <input
                  type="text"
                  readOnly
                  value="Client Management System"
                  className="input-field bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Supabase Integration */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Supabase {isSupabaseConfigured ? 'configuration found' : 'setup required'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isSupabaseConfigured ? 'Project URL and publishable key are configured.' : 'Add the project URL and publishable key to .env.local to connect.'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                Ready for Keys
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm mb-1">
                Connect Supabase:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <li>
                    Copy <code>.env.example</code> to <code>.env.local</code>
                  </li>
                  <li>
                    Add the Supabase Project URL and publishable (anon) key from Project Settings → API
                  </li>
                  <li>
                    Run <code>supabase/schema.sql</code> in the Supabase SQL Editor
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  Supabase tables:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      public.clients
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Client profiles and normalized phone uniqueness per signed-in owner
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      public.activities
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Chronological audit log, protected by row-level security
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      /users
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Staff accounts, roles, and access permissions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Data & Backup */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Data Management & Backup
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Export your CRM state or clear client records saved in this browser. This does not erase Supabase data.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="btn-secondary text-xs"
              >
                <Download size={14} />
                <span>Export JSON Database Backup</span>
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="btn-danger text-xs"
              >
                <RefreshCw size={14} />
                <span>Clear Browser Client Data</span>
              </button>
            </div>

            {resetSuccess && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                <Check size={14} /> Reset successfully! Refreshing...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
