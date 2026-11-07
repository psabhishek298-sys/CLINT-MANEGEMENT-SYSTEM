import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Wallet } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { formatDate } from '../utils/helpers';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
}).format(value);

export default function CashFund() {
  const { clients } = useClients();
  const navigate = useNavigate();
  const completed = clients
    .filter(client => client.projectStatus === 'Completed')
    .sort((a, b) => (b.completionDate || b.updatedAt).localeCompare(a.completionDate || a.updatedAt));
  const receivedCount = completed.filter(client => client.revenueReceived != null).length;
  const cashTotal = useMemo(
    () => completed.reduce((total, client) => total + (client.revenueReceived ?? 0), 0),
    [completed],
  );

  return <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><Wallet size={16} /> Cash tracking</p>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">Cash Fund</h1>
      <p className="mt-1 text-sm text-gray-500">Revenue received from completed projects.</p>
    </div>

    <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="rounded-2xl bg-emerald-50 p-4 text-emerald-700"><Wallet size={26} /></span>
        <div>
          <p className="text-sm font-medium text-gray-500">Total cash received</p>
          <p className="text-3xl font-extrabold tracking-tight text-gray-950">{formatCurrency(cashTotal)}</p>
        </div>
      </div>
      <div className="text-sm text-gray-500">{receivedCount} of {completed.length} completed projects have revenue entered</div>
    </section>

    <section className="card overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-bold text-gray-900">Cash received by project</h2>
        <p className="mt-1 text-xs text-gray-500">Add or update an amount from the client record.</p>
      </div>
      {completed.length === 0 ? <div className="p-10 text-center">
        <Wallet size={34} className="mx-auto mb-3 text-emerald-500" />
        <h3 className="font-bold text-gray-900">No completed projects yet</h3>
        <p className="mt-1 text-sm text-gray-500">Completed project revenue will appear here.</p>
      </div> : <div className="overflow-auto"><table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-5 py-3">Project</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Received date</th><th className="px-5 py-3 text-right">Cash received</th><th className="px-5 py-3">Record</th></tr></thead>
        <tbody className="divide-y divide-gray-100">{completed.map(client => <tr key={client.id}>
          <td className="px-5 py-4 font-semibold text-gray-900">{client.companyName}</td>
          <td className="px-5 py-4 text-gray-600">{client.businessCategory}</td>
          <td className="px-5 py-4 text-gray-600">{client.revenueReceived != null ? formatDate(client.completionDate || client.updatedAt) : '—'}</td>
          <td className="px-5 py-4 text-right font-semibold text-gray-900">{client.revenueReceived != null ? formatCurrency(client.revenueReceived) : <span className="font-normal text-gray-400">Not entered</span>}</td>
          <td className="px-5 py-4"><button type="button" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800" onClick={() => navigate(`/clients/${client.id}`)}>Open <ArrowUpRight size={14} /></button></td>
        </tr>)}</tbody>
        <tfoot className="border-t-2 border-gray-200 bg-gray-50"><tr><th colSpan={3} className="px-5 py-4 text-left text-sm font-bold text-gray-900">Total cash received</th><td className="px-5 py-4 text-right font-extrabold text-emerald-800">{formatCurrency(cashTotal)}</td><td /></tr></tfoot>
      </table></div>}
    </section>
  </div>;
}
