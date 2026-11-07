import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  const variantColors = {
    danger: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    info: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  };

  const btnColors = {
    danger: 'btn-danger',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors',
    info: 'btn-primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variantColors[variant]}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-secondary flex-1">
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${btnColors[variant]} flex-1`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
