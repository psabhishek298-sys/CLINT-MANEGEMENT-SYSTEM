import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ExternalLink, Phone, Wallet } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { formatDate } from '../utils/helpers';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
}).format(value);

export default function CompletedProjects() {
  const { clients } = useClients();
  const navigate = useNavigate();
  const completed = clients.filter(client => client.projectStatus === 'Completed');
  const revenueTotal = useMemo(
    () => completed.reduce((total, client) => total + (client.revenueReceived ?? 0), 0),
    [completed],
  );

  return <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><BadgeCheck size={16} /> Delivery tracking</p>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-3xl">Completed projects</h1>
      <p className="mt-1 text-sm text-gray-500">{completed.length} projects marked completed and delivered.</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="card flex items-center gap-4 p-5">
        <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><BadgeCheck size={22} /></span>
        <div><p className="text-xs font-medium text-gray-500">Completed projects</p><p className="text-2xl font-extrabold text-gray-950">{completed.length}</p></div>
      </div>
      <div className="card flex items-center gap-4 p-5">
        <span className="rounded-xl bg-green-50 p-3 text-green-700"><Wallet size={22} /></span>
        <div><p className="text-xs font-medium text-gray-500">Revenue received</p><p className="text-2xl font-extrabold text-gray-950">{formatCurrency(revenueTotal)}</p></div>
      </div>
    </div>

    <div className="card overflow-hidden">
      {completed.length === 0 ? <div className="p-10 text-center">
        <BadgeCheck size={34} className="mx-auto mb-3 text-emerald-500" />
        <h2 className="font-bold text-gray-900 dark:text-white">No completed projects yet</h2>
        <p className="mt-1 text-sm text-gray-500">Edit a client and set Project status to Completed to track finished work here.</p>
      </div> : <div className="overflow-auto"><table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60"><tr><th className="px-5 py-3">Company</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Mobile</th><th className="px-5 py-3">Completed</th><th className="px-5 py-3">Revenue received</th><th className="px-5 py-3">Project site</th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{completed.map(client => <tr key={client.id}>
          <td className="px-5 py-4"><button type="button" className="font-semibold text-gray-900 hover:text-emerald-600 dark:text-white" onClick={() => navigate(`/clients/${client.id}`)}>{client.companyName}</button></td>
          <td className="px-5 py-4">{client.businessCategory}</td>
          <td className="px-5 py-4"><a className="inline-flex items-center gap-1.5" href={`tel:${client.mobileNumber}`}><Phone size={13} />{client.mobileNumber}</a></td>
          <td className="px-5 py-4">{formatDate(client.completionDate || client.updatedAt)}</td>
          <td className="px-5 py-4 font-semibold text-gray-900">{client.revenueReceived != null ? formatCurrency(client.revenueReceived) : <span className="font-normal text-gray-400">Not entered</span>}</td>
          <td className="px-5 py-4">{client.websiteProjectUrl ? <a className="inline-flex items-center gap-1 text-emerald-600" href={client.websiteProjectUrl} target="_blank" rel="noreferrer">Open <ExternalLink size={13} /></a> : '—'}</td>
        </tr>)}</tbody>
      </table></div>}
    </div>
  </div>;
}
