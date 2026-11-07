import { Client, ProjectStatus } from '../../types';

interface StatusOverviewChartProps {
  clients: Client[];
}

const statusConfig: { status: ProjectStatus; color: string; label: string }[] = [
  { status: 'New Lead', color: 'bg-sky-500', label: 'New Lead' },
  { status: 'Contacted', color: 'bg-emerald-500', label: 'Contacted' },
  { status: 'Follow-up', color: 'bg-amber-500', label: 'Follow-up' },
  { status: 'Demo Requested', color: 'bg-violet-500', label: 'Demo Requested' },
  { status: 'Demo Approved', color: 'bg-emerald-500', label: 'Demo Approved' },
  { status: 'Completed', color: 'bg-teal-500', label: 'Completed' },
  { status: 'Not Interested', color: 'bg-gray-400', label: 'Not Interested' },
];

export default function StatusOverviewChart({ clients }: StatusOverviewChartProps) {
  const total = clients.length || 1;

  const counts = statusConfig.map(c => {
    const count = clients.filter(client => client.projectStatus === c.status).length;
    const percentage = Math.round((count / total) * 100);
    return { ...c, count, percentage };
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Client Status Overview</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pipeline distribution across all project stages</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
          {clients.length} Total Records
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex mb-5 shadow-inner">
        {counts
          .filter(c => c.count > 0)
          .map(c => (
            <div
              key={c.status}
              className={`${c.color} h-full transition-all duration-300 hover:opacity-85`}
              style={{ width: `${(c.count / total) * 100}%` }}
              title={`${c.label}: ${c.count} (${c.percentage}%)`}
            />
          ))}
      </div>

      {/* Grid of statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        {counts.map(c => (
          <div
            key={c.status}
            className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full ${c.color} flex-shrink-0`} />
              <span className="text-gray-600 dark:text-gray-400 truncate">{c.label}</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 ml-2">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
