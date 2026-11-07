import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import DuplicateWarningModal from '../ui/DuplicateWarningModal';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const { duplicateWarning, dismissDuplicateWarning } = useClients();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Checking your session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global duplicate warning modal */}
      {duplicateWarning && (
        <DuplicateWarningModal
          isOpen={!!duplicateWarning}
          onClose={dismissDuplicateWarning}
          existingClient={duplicateWarning.existingClient}
          duplicateNumber={duplicateWarning.newNumber}
        />
      )}
    </div>
  );
}
