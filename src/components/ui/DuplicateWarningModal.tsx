import Modal from './Modal';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Client } from '../../types';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingClient: Client;
  duplicateNumber: string;
}

export default function DuplicateWarningModal({
  isOpen,
  onClose,
  existingClient,
  duplicateNumber,
}: DuplicateWarningModalProps) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Duplicate Mobile Number Detected!" size="md">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This mobile number already exists in your database.
        </p>

        <div className="w-full card p-4 mb-6 text-left">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Existing Record</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Company</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{existingClient.companyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Contact</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{existingClient.contactPerson}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Mobile</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{duplicateNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <StatusBadge status={existingClient.projectStatus} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-secondary flex-1">
            Go Back
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/clients/${existingClient.id}`);
            }}
            className="btn-primary flex-1"
          >
            <ExternalLink size={16} />
            View Existing Record
          </button>
        </div>
      </div>
    </Modal>
  );
}
