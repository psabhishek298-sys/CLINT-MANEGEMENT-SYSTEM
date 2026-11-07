import { FormEvent, useState } from 'react';
import { Check, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { useClients } from '../context/ClientContext';

export default function Categories() {
  const { categories, clients, addCategory, renameCategory, deleteCategory } = useClients();
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await addCategory(newName);
      setNewName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add category.');
    } finally {
      setBusy(false);
    }
  };

  const handleRename = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    setError('');
    setBusy(true);
    try {
      await renameCategory(editing, editName);
      setEditing(null);
      setEditName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not rename category.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (name: string) => {
    setError('');
    if (!window.confirm(`Delete the category “${name}”?`)) return;
    try {
      await deleteCategory(name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete category.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><Tags size={16} /> CRM setup</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-3xl">Business categories</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage the categories available when adding or filtering clients.</p>
      </div>

      <form onSubmit={handleAdd} className="card flex flex-col gap-3 p-5 sm:flex-row">
        <input className="input-field flex-1" value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category name" maxLength={80} required />
        <button type="submit" disabled={busy} className="btn-primary"><Plus size={16} /> Add category</button>
      </form>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="card overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Your categories <span className="ml-1 text-sm font-medium text-gray-400">{categories.length}</span></h2>
        </div>
        {categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No categories found. Run the latest <code>supabase/schema.sql</code> to add the spreadsheet categories.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map(category => {
              const count = clients.filter(client => client.businessCategory === category).length;
              return <li key={category} className="flex items-center gap-3 px-5 py-3.5">
                {editing === category ? (
                  <form onSubmit={handleRename} className="flex min-w-0 flex-1 items-center gap-2">
                    <input autoFocus className="input-field py-2" value={editName} onChange={e => setEditName(e.target.value)} maxLength={80} required />
                    <button className="btn-primary px-3 py-2" disabled={busy} aria-label="Save category"><Check size={16} /></button>
                    <button type="button" className="btn-secondary px-3 py-2" onClick={() => setEditing(null)} aria-label="Cancel"><X size={16} /></button>
                  </form>
                ) : <>
                  <span className="min-w-0 flex-1 truncate font-medium text-gray-800 dark:text-gray-200">{category}</span>
                  <span className="text-xs text-gray-400">{count} {count === 1 ? 'client' : 'clients'}</span>
                  <button type="button" className="btn-ghost px-2 py-2" onClick={() => { setEditing(category); setEditName(category); }} aria-label={`Edit ${category}`}><Pencil size={15} /></button>
                  <button type="button" className="btn-ghost px-2 py-2 text-red-600" onClick={() => void handleDelete(category)} aria-label={`Delete ${category}`}><Trash2 size={15} /></button>
                </>}
              </li>;
            })}
          </ul>
        )}
      </div>
      <p className="text-xs text-gray-500">Categories in use cannot be deleted. Rename a category to update the clients assigned to it.</p>
    </div>
  );
}
