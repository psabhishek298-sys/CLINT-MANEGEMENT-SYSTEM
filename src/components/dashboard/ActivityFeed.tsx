import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  PhoneCall,
  FileText,
  Monitor,
  UserCheck,
  AlertCircle,
  PlusCircle,
  Clock,
} from 'lucide-react';
import { Activity, Client } from '../../types';
import { getRelativeTime } from '../../utils/helpers';

interface ActivityFeedProps {
  clients: Client[];
}

export default function ActivityFeed({ clients }: ActivityFeedProps) {
  const navigate = useNavigate();

  // Flatten all activities from clients and sort by date descending
  const allActivities: (Activity & { companyName: string; clientStatus: string })[] = [];

  clients.forEach(client => {
    (client.activities || []).forEach(act => {
      allActivities.push({
        ...act,
        companyName: client.companyName,
        clientStatus: client.projectStatus,
      });
    });
  });

  allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentActivities = allActivities.slice(0, 7);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return <PlusCircle size={15} className="text-emerald-600 dark:text-emerald-400" />;
      case 'call':
        return <PhoneCall size={15} className="text-amber-600 dark:text-amber-400" />;
      case 'demo_request':
      case 'demo_sent':
        return <Monitor size={15} className="text-purple-600 dark:text-purple-400" />;
      case 'demo_approved':
      case 'converted':
        return <CheckCircle size={15} className="text-emerald-600 dark:text-emerald-400" />;
      case 'demo_rejected':
        return <AlertCircle size={15} className="text-rose-600 dark:text-rose-400" />;
      case 'proposal_sent':
        return <FileText size={15} className="text-green-600 dark:text-green-400" />;
      default:
        return <Clock size={15} className="text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Recent Activity</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Live audit log across team actions</p>
        </div>
      </div>

      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No recent activities recorded</p>
        ) : (
          recentActivities.map(act => (
            <div
              key={act.id}
              onClick={() => navigate(`/clients/${act.clientId}`)}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
            >
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 mt-0.5">
                {getActivityIcon(act.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {act.companyName}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                    {getRelativeTime(act.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-snug line-clamp-2">
                  {act.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
