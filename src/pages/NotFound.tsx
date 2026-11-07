import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
        The page you are looking for doesn't exist or has been moved to another URL.
      </p>

      <div className="flex gap-3 mt-6">
        <button onClick={() => navigate(-1)} className="btn-secondary text-xs">
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </button>
        <button onClick={() => navigate('/')} className="btn-primary text-xs">
          <Home size={14} />
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
}
