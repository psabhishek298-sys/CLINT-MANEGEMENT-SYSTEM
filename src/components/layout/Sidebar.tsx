import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Monitor,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Tags,
  BadgeCheck,
  FileSpreadsheet,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';

interface NavItemConfig {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { clients } = useClients();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeDemosCount = clients.filter(c => c.projectStatus === 'Demo Requested').length;
  const completedCount = clients.filter(c => c.projectStatus === 'Completed').length;

  const navItems: NavItemConfig[] = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'All Clients', icon: Users, badge: clients.length },
    { path: '/clients/new', label: 'Add New Client', icon: UserPlus },
    { path: '/demos', label: 'Demo Projects', icon: Monitor, badge: activeDemosCount > 0 ? activeDemosCount : undefined },
    { path: '/completed', label: 'Completed Projects', icon: BadgeCheck, badge: clients.filter(c => c.projectStatus === 'Completed').length || undefined },
    { path: '/cash-fund', label: 'Cash Fund', icon: Wallet },
    { path: '/categories', label: 'Categories', icon: Tags },
    { path: '/import', label: 'Import Excel', icon: FileSpreadsheet },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 text-white font-extrabold text-base tracking-wider">
            TQ
          </div>
          {
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-950 dark:text-white tracking-tight text-lg">Client Manager</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                  CRM
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Client Management</p>
            </div>
          }
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-gray-100'
                }` 
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={19}
                      className={`flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Status Pill */}
      {
        <div className="mx-3 my-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50/60 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
              Pipeline Overview
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{clients.length} leads</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            {completedCount} completed · {activeDemosCount} demo requests
          </p>
        </div>
      }

      {/* User & Controls Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800/80 p-3 space-y-2">
        {/* Workspace footer */}
        <div className="flex items-center justify-between px-1">
        </div>

        {/* User profile card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
          </div>
          {
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          }
          {
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          }
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger & Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              TQ
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Client Manager</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/clients/new"
            className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            title="Add New Client"
          >
            <UserPlus size={18} />
          </NavLink>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col bg-white dark:bg-gray-900 animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 z-20 flex-shrink-0 w-64">
        {sidebarContent}
      </aside>
    </>
  );
}
