import { useState } from 'react';
import { AlertTriangle, FileSpreadsheet, Upload } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { parseClientWorkbook, RejectedWorkbookRow, WorkbookClientRow } from '../utils/excelImport';

export default function ImportClients() {
  const { importClients } = useClients();
  const [rows, setRows] = useState<WorkbookClientRow[]>([]);
  const [rejected, setRejected] = useState<RejectedWorkbookRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: string[] } | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setResult(null);
    setBusy(true);
    try {
      const preview = await parseClientWorkbook(file);
      setRows(preview.rows);
      setRejected(preview.rejected);
      setFileName(file.name);
    } catch (err) {
      setRows([]);
      setRejected([]);
      setError(err instanceof Error ? err.message : 'Could not read this Excel workbook.');
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    setBusy(true);
    setError('');
    try {
      setResult(await importClients(rows));
      setRows([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><FileSpreadsheet size={16} /> Client data</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-3xl">Import clients from Excel</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review the workbook rows, then import valid unique phone numbers into your Supabase CRM.</p>
      </div>

      <label className="card flex cursor-pointer flex-col items-center gap-3 border-dashed p-8 text-center transition hover:border-emerald-400">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Upload size={22} /></span>
        <span className="font-semibold text-gray-900 dark:text-white">{busy ? 'Reading workbook…' : fileName || 'Choose an Excel workbook'}</span>
        <span className="text-xs text-gray-500">.xlsx files with category headings and NAME / NUMBER columns</span>
        <input type="file" accept=".xlsx" className="sr-only" disabled={busy} onChange={event => void handleFile(event.target.files?.[0])} />
      </label>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {result && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        Imported {result.inserted} clients.{result.skipped.length > 0 && ` Skipped ${result.skipped.length} row(s) with duplicate phone numbers.`}
      </div>}

      {rows.length > 0 && <>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-bold text-gray-900 dark:text-white">Preview: {rows.length} valid rows</h2><p className="text-xs text-gray-500">Only the previewed rows will be written to Supabase.</p></div>
          <button className="btn-primary" type="button" disabled={busy} onClick={() => void handleImport()}>{busy ? 'Importing…' : `Import ${rows.length} clients`}</button>
        </div>
        <div className="card overflow-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60"><tr><th className="px-4 py-3">Excel row</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Mobile</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Website</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{rows.map(row => <tr key={`${row.rowNumber}-${row.mobileNumber}`}>
              <td className="px-4 py-3 text-gray-500">{row.rowNumber}</td><td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.companyName}</td><td className="px-4 py-3 font-mono">{row.mobileNumber}</td><td className="px-4 py-3">{row.businessCategory}</td><td className="px-4 py-3">{row.websiteUrl || '—'}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </>}

      {rejected.length > 0 && <div className="card space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300"><AlertTriangle size={17} /> Rows needing correction ({rejected.length})</h2>
        <ul className="space-y-2 text-sm">{rejected.map(row => <li key={row.rowNumber} className="flex flex-wrap gap-x-2 text-gray-700 dark:text-gray-300"><span className="font-semibold">Row {row.rowNumber}: {row.companyName}</span><span className="text-amber-700 dark:text-amber-300">{row.reason}{row.mobileNumber ? ` (${row.mobileNumber})` : ''}</span></li>)}</ul>
        <p className="text-xs text-gray-500">Correct these values in Excel and upload again. They are excluded from the import preview.</p>
      </div>}
    </div>
  );
}
