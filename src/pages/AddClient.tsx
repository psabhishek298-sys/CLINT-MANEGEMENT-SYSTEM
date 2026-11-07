import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, ShieldAlert } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Client } from '../types';
import ClientForm from '../components/clients/ClientForm';

export default function AddClient() {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'activities'>
  ) => {
    setIsSubmitting(true);
    // addClient returns false if duplicate detected (and triggers the global DuplicateWarningModal)
    try {
      const success = await addClient(clientData);
      if (success) navigate('/clients');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button & Page header */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to previous</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Add New Client Lead
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Store prospective business details collected via Google Maps, Search, or outbound campaigns
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/60 dark:border-emerald-900/40">
            <ShieldAlert size={14} />
            <span>Duplicate Mobile Check Active</span>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/clients')}
        isSubmitting={isSubmitting}
        submitLabel="Register & Save Client"
      />
    </div>
  );
}
