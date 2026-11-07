import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  PhoneCall,
  ThumbsUp,
  Monitor,
  CheckCircle,
  Ban,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { calculateDashboardStats, formatDate } from '../utils/helpers';
import StatCard from '../components/dashboard/StatCard';
import StatusOverviewChart from '../components/dashboard/StatusOverviewChart';
import CategoryDistribution from '../components/dashboard/CategoryDistribution';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import FollowUpAlerts from '../components/dashboard/FollowUpAlerts';
import StatusBadge from '../components/ui/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { clients } = useClients();

  const stats = calculateDashboardStats(clients);

  // Recent clients: 5 latest created
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="dashboard-page space-y-7 animate-fade-in">
      {/* Page Header */}
      <div className="dashboard-heading flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Client Management Dashboard
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              Live Pipeline
            </span>
          </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Client details, outreach activity, and project progress in one place.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/clients')}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <span>View All Records</span>
            <ArrowUpRight size={14} />
          </button>
          <button
            onClick={() => navigate('/clients/new')}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm shadow-emerald-500/20"
          >
            <UserPlus size={14} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Follow-up Alerts Banner */}
      <FollowUpAlerts clients={clients} />

      {/* 9 Requirement Statistic Cards Grid */}
      <div className="dashboard-stats-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          colorScheme="blue"
          subtext="Full Database"
          onClick={() => navigate('/clients')}
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={UserPlus}
          colorScheme="sky"
          subtext="Awaiting First Contact"
          onClick={() => navigate('/clients?projectStatus=New Lead')}
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={PhoneCall}
          colorScheme="indigo"
          subtext="Outreach In Motion"
          onClick={() => navigate('/clients?contactStatus=Contacted')}
        />
        <StatCard
          title="Interested"
          value={stats.interested}
          icon={ThumbsUp}
          colorScheme="emerald"
          subtext="Warm Prospects"
          onClick={() => navigate('/clients?websiteInterest=Interested')}
        />
        <StatCard
          title="Demo Requested"
          value={stats.demoRequested}
          icon={Monitor}
          colorScheme="violet"
          subtext="Pitch In Queue"
          onClick={() => navigate('/demos')}
        />
        <StatCard
          title="Demo Approved"
          value={stats.demoApproved}
          icon={CheckCircle}
          colorScheme="emerald"
          subtext="Demo Approved by Client"
          onClick={() => navigate('/demos')}
        />
        <StatCard
          title="Not Interested"
          value={stats.notInterested}
          icon={Ban}
          colorScheme="gray"
          subtext="Disqualified / Cold"
          onClick={() => navigate('/clients?projectStatus=Not Interested')}
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects}
          icon={CheckCircle}
          colorScheme="emerald"
          subtext="Delivered to Clients"
          onClick={() => navigate('/completed')}
        />
      </div>

      {/* Middle Row: Status Overview Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatusOverviewChart clients={clients} />
        </div>
        <div>
          <CategoryDistribution clients={clients} />
        </div>
      </div>

      {/* Bottom Row: Recent Clients & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Clients Table */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Recent Prospects</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recently added businesses across sources</p>
            </div>
            <button
              onClick={() => navigate('/clients')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {recentClients.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">
                      {client.companyName}
                    </td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px]">
                        {client.businessCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300 font-mono text-[11px]">
                      {client.mobileNumber}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={client.projectStatus} />
                    </td>
                    <td className="py-3 px-3 text-right text-gray-400">
                      {formatDate(client.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed clients={clients} />
        </div>
      </div>
    </div>
  );
}
