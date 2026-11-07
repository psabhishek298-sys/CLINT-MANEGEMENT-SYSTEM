import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client, Activity } from '../types';
import { generateId, normalizeMobileNumber } from '../utils/helpers';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';
import { WorkbookClientRow } from '../utils/excelImport';

interface DuplicateInfo {
  existingClient: Client;
  newNumber: string;
}

interface ClientContextType {
  clients: Client[];
  categories: string[];
  loading: boolean;
  dataError: string | null;
  duplicateWarning: DuplicateInfo | null;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'activities'>) => Promise<boolean>;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  deleteMultipleClients: (ids: string[]) => void;
  getClient: (id: string) => Client | undefined;
  addActivity: (clientId: string, activity: Omit<Activity, 'id' | 'clientId' | 'timestamp'>) => void;
  importClients: (rows: WorkbookClientRow[]) => Promise<{ inserted: number; skipped: string[] }>;
  addCategory: (name: string) => Promise<void>;
  renameCategory: (currentName: string, nextName: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
  checkDuplicate: (mobileNumber: string, excludeId?: string) => Client | undefined;
  dismissDuplicateWarning: () => void;
  dismissDataError: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateInfo | null>(null);

  useEffect(() => {
    localStorage.removeItem('truqen-clients');
    let cancelled = false;
    async function load() {
      setClients([]);
      setCategories([]);
      if (!supabase || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const [{ data, error }, { data: categoryRows, error: categoryError }] = await Promise.all([
        supabase.from('clients').select('id, data, created_at, updated_at').order('created_at', { ascending: false }),
        supabase.from('business_categories').select('name').order('name'),
      ]);
      if (cancelled) return;
      if (error) setDataError(`Could not load clients: ${error.message}`);
      else {
        const loadedClients = (data || []).map(row => ({
          ...(row.data as Client),
          id: row.id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        const legacyDemoRows = loadedClients.filter(client => (client.projectStatus as string) === 'Demo Building');
        for (const client of legacyDemoRows) {
          const updatedAt = new Date().toISOString();
          const migrated: Client = {
            ...client,
            projectStatus: 'Demo Requested',
            demoRequired: true,
            demoStatus: client.demoStatus === 'Not Started' ? 'In Progress' : client.demoStatus,
            updatedAt,
            activities: [...(client.activities || []), {
              id: crypto.randomUUID(),
              clientId: client.id,
              type: 'status_change',
              description: 'Project status changed from "Demo Building" to "Demo Requested"',
              timestamp: updatedAt,
            }],
          };
          const { error: migrationError } = await supabase.from('clients')
            .update({ data: migrated, updated_at: updatedAt }).eq('id', client.id);
          if (migrationError) setDataError(`Could not update legacy demo status: ${migrationError.message}`);
          Object.assign(client, migrated);
        }
        setClients(loadedClients);
      }
      if (categoryError) setDataError(`Could not load categories: ${categoryError.message}`);
      else setCategories((categoryRows || []).map(row => row.name));
      setLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [user]);

  const checkDuplicate = useCallback((mobileNumber: string, excludeId?: string): Client | undefined => {
    const normalized = normalizeMobileNumber(mobileNumber);
    if (!normalized) return undefined;
    return clients.find(client => client.id !== excludeId && normalizeMobileNumber(client.mobileNumber) === normalized);
  }, [clients]);

  const addClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'activities'>): Promise<boolean> => {
    const duplicate = checkDuplicate(clientData.mobileNumber);
    if (duplicate) {
      setDuplicateWarning({ existingClient: duplicate, newNumber: clientData.mobileNumber });
      return false;
    }
    if (!supabase || !user) throw new Error('Supabase sign-in is required before saving client records.');

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const client: Client = {
      ...clientData,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
      activities: [{ id: crypto.randomUUID(), clientId: id, type: 'created', description: 'Client added to database', timestamp: now }],
    };
    const { error } = await supabase.from('clients').insert({
      id,
      company_name: client.companyName,
      mobile_number: client.mobileNumber,
      data: client,
    });
    if (error) {
      if (error.code === '23505') {
        const existing = clients.find(item => normalizeMobileNumber(item.mobileNumber) === normalizeMobileNumber(client.mobileNumber));
        if (existing) setDuplicateWarning({ existingClient: existing, newNumber: client.mobileNumber });
        else setDataError('This mobile number is already saved in the database. Refresh the client list to see it.');
        return false;
      }
      setDataError(`Could not save client: ${error.message}`);
      return false;
    }
    setClients(previous => [client, ...previous]);
    return true;
  }, [checkDuplicate, clients, user]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    const client = clients.find(item => item.id === id);
    if (!client || !supabase) return;
    if (updates.mobileNumber) {
      const duplicate = checkDuplicate(updates.mobileNumber, id);
      if (duplicate) {
        setDuplicateWarning({ existingClient: duplicate, newNumber: updates.mobileNumber });
        return;
      }
    }

    const updated: Client = { ...client, ...updates, updatedAt: new Date().toISOString() };
    const activities = [...(client.activities || [])];
    if (updates.projectStatus && updates.projectStatus !== client.projectStatus) {
      activities.push({ id: generateId(), clientId: id, type: 'status_change', description: `Project status changed from "${client.projectStatus}" to "${updates.projectStatus}"`, timestamp: updated.updatedAt });
    }
    if (updates.demoStatus && updates.demoStatus !== client.demoStatus) {
      const typeMap: Record<string, Activity['type']> = { 'In Progress': 'demo_request', 'Sent to Client': 'demo_sent', Approved: 'demo_approved', Rejected: 'demo_rejected' };
      activities.push({ id: generateId(), clientId: id, type: typeMap[updates.demoStatus] || 'status_change', description: `Demo status changed to "${updates.demoStatus}"`, timestamp: updated.updatedAt });
    }
    if (updates.projectStatus === 'Completed' && client.projectStatus !== 'Completed') {
      updated.completionDate = updated.updatedAt.split('T')[0];
      activities.push({ id: generateId(), clientId: id, type: 'completed', description: 'Project marked completed.', timestamp: updated.updatedAt });
    }
    updated.activities = activities;
    void supabase.from('clients').update({ company_name: updated.companyName, mobile_number: updated.mobileNumber, data: updated, updated_at: updated.updatedAt }).eq('id', id)
      .then(({ error }) => {
        if (error) setDataError(`Could not update client: ${error.message}`);
        else setClients(previous => previous.map(item => item.id === id ? updated : item));
      });
  }, [checkDuplicate, clients]);

  const deleteClient = useCallback((id: string) => {
    if (!supabase) return;
    void supabase.from('clients').delete().eq('id', id).then(({ error }) => {
      if (error) setDataError(`Could not delete client: ${error.message}`);
      else setClients(previous => previous.filter(client => client.id !== id));
    });
  }, []);

  const deleteMultipleClients = useCallback((ids: string[]) => {
    if (!supabase || ids.length === 0) return;
    void supabase.from('clients').delete().in('id', ids).then(({ error }) => {
      if (error) setDataError(`Could not delete selected clients: ${error.message}`);
      else setClients(previous => previous.filter(client => !ids.includes(client.id)));
    });
  }, []);

  const getClient = useCallback((id: string) => clients.find(client => client.id === id), [clients]);

  const addActivity = useCallback((clientId: string, activity: Omit<Activity, 'id' | 'clientId' | 'timestamp'>) => {
    const client = clients.find(item => item.id === clientId);
    if (!client || !supabase) return;
    const updatedAt = new Date().toISOString();
    const updated: Client = {
      ...client,
      updatedAt,
      activities: [...(client.activities || []), { ...activity, id: generateId(), clientId, timestamp: updatedAt }],
    };
    void supabase.from('clients').update({ data: updated, updated_at: updatedAt }).eq('id', clientId).then(({ error }) => {
      if (error) setDataError(`Could not save activity: ${error.message}`);
      else setClients(previous => previous.map(item => item.id === clientId ? updated : item));
    });
  }, [clients]);

  const importClients = useCallback(async (rows: WorkbookClientRow[]) => {
    if (!supabase || !user) throw new Error('Sign in to Supabase before importing client data.');
    const numbers = new Set(clients.map(client => normalizeMobileNumber(client.mobileNumber)));
    const skipped: string[] = [];
    const imported: Client[] = [];
    for (const row of rows) {
      const normalized = normalizeMobileNumber(row.mobileNumber);
      if (!normalized || normalized.length < 7 || normalized.length > 15) {
        skipped.push(`${row.companyName}: invalid phone number`);
        continue;
      }
      if (numbers.has(normalized)) {
        skipped.push(`${row.companyName}: phone number already exists`);
        continue;
      }
      numbers.add(normalized);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const demoApproved = row.sourceNote.toLowerCase().includes('demo approved');
      imported.push({
        id,
        companyName: row.companyName,
        contactPerson: '',
        mobileNumber: row.mobileNumber,
        businessCategory: row.businessCategory,
        location: '',
        googleMapsUrl: '',
        instagramUrl: '',
        facebookUrl: '',
        hasWebsite: Boolean(row.websiteUrl),
        existingWebsiteUrl: row.websiteUrl,
        websiteQuality: row.websiteUrl ? 'Unassessed' : 'No Website',
        contactStatus: 'Not Contacted',
        websiteInterest: 'Pending',
        demoRequired: demoApproved,
        demoStatus: demoApproved ? 'Approved' : 'Not Started',
        demoUrl: '',
        projectStatus: demoApproved ? 'Demo Approved' : 'New Lead',
        notes: row.sourceNote ? `Spreadsheet note: ${row.sourceNote}` : '',
        nextFollowUpDate: '',
        websiteProjectUrl: '',
        conversionDate: '',
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
        activities: [{ id: crypto.randomUUID(), clientId: id, type: 'created', description: `Imported from spreadsheet row ${row.rowNumber}`, timestamp: now }],
      });
    }
    if (!imported.length) return { inserted: 0, skipped };
    const { error } = await supabase.from('clients').insert(imported.map(client => ({
      id: client.id,
      company_name: client.companyName,
      mobile_number: client.mobileNumber,
      data: client,
    })));
    if (error) throw new Error(`Import failed: ${error.message}`);
    setClients(previous => [...imported, ...previous]);
    return { inserted: imported.length, skipped };
  }, [clients, user]);

  const addCategory = useCallback(async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error('Enter a category name.');
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.from('business_categories').insert({ name: cleanName });
    if (error) throw new Error(error.code === '23505' ? 'That category already exists.' : error.message);
    setCategories(previous => [...previous, cleanName].sort((a, b) => a.localeCompare(b)));
  }, []);

  const renameCategory = useCallback(async (currentName: string, nextName: string) => {
    const cleanName = nextName.trim();
    if (!cleanName) throw new Error('Enter a category name.');
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.from('business_categories').update({ name: cleanName }).eq('name', currentName);
    if (error) throw new Error(error.code === '23505' ? 'That category already exists.' : error.message);
    const clientUpdates = clients.filter(client => client.businessCategory === currentName);
    for (const client of clientUpdates) {
      const updated = { ...client, businessCategory: cleanName, updatedAt: new Date().toISOString() };
      const { error: clientError } = await supabase.from('clients').update({ data: updated, updated_at: updated.updatedAt }).eq('id', client.id);
      if (clientError) throw new Error(`Category renamed, but a client record could not be updated: ${clientError.message}`);
    }
    setClients(previous => previous.map(client => client.businessCategory === currentName ? { ...client, businessCategory: cleanName } : client));
    setCategories(previous => previous.map(category => category === currentName ? cleanName : category).sort((a, b) => a.localeCompare(b)));
  }, [clients]);

  const deleteCategory = useCallback(async (name: string) => {
    if (clients.some(client => client.businessCategory === name)) throw new Error('Move the clients in this category to another category before deleting it.');
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.from('business_categories').delete().eq('name', name);
    if (error) throw new Error(error.message);
    setCategories(previous => previous.filter(category => category !== name));
  }, [clients]);

  return (
    <ClientContext.Provider value={{
      clients, categories, loading, dataError, duplicateWarning, addClient, updateClient, deleteClient, deleteMultipleClients,
      getClient, addActivity, importClients, addCategory, renameCategory, deleteCategory, checkDuplicate, dismissDuplicateWarning: () => setDuplicateWarning(null),
      dismissDataError: () => setDataError(null),
    }}>
      {dataError && <div role="alert" className="fixed bottom-4 right-4 z-50 max-w-lg rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg">
        <div className="flex items-start gap-3"><span className="flex-1">{dataError}</span><button type="button" onClick={() => setDataError(null)} aria-label="Dismiss">×</button></div>
      </div>}
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClients must be used within a ClientProvider');
  return context;
}
