import { getStatusColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`badge ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
}
