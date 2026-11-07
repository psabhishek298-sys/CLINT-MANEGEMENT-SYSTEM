import { useState } from 'react';
import { AlertCircle, Briefcase, Building2, Calendar, Check, Globe, MessageSquare, Save } from 'lucide-react';
import { BusinessCategory, Client, ContactStatus, DemoStatus, ProjectStatus, WebsiteInterest, WebsiteQuality } from '../../types';
import { useClients } from '../../context/ClientContext';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'activities'>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const contactOptions: ContactStatus[] = ['Not Contacted', 'Contacted', 'Follow-up Required'];
const projectOptions: ProjectStatus[] = ['New Lead', 'Contacted', 'Follow-up', 'Demo Requested', 'Demo Approved', 'Completed', 'Not Interested'];

export default function ClientForm({ initialData, onSubmit, onCancel, isSubmitting = false, submitLabel = 'Save Client Record' }: ClientFormProps) {
  const { categories } = useClients();
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>(initialData?.businessCategory || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [hasWebsite, setHasWebsite] = useState(initialData?.hasWebsite ?? false);
  const [existingWebsiteUrl, setExistingWebsiteUrl] = useState(initialData?.existingWebsiteUrl || '');
  const [contactStatus, setContactStatus] = useState<ContactStatus>(initialData?.contactStatus || 'Not Contacted');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(initialData?.projectStatus || 'New Lead');
  const [websiteProjectUrl, setWebsiteProjectUrl] = useState(initialData?.websiteProjectUrl || '');
  const [completionDate, setCompletionDate] = useState(initialData?.completionDate || '');
  const [revenueReceived, setRevenueReceived] = useState(
    initialData?.revenueReceived != null ? String(initialData.revenueReceived) : '',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!companyName.trim()) nextErrors.companyName = 'Company name is required';
    const digits = mobileNumber.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) nextErrors.mobileNumber = 'Enter a valid phone number (7–15 digits)';
    if (!businessCategory) nextErrors.businessCategory = 'Choose a business category';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const nowDate = new Date().toISOString().slice(0, 10);
    onSubmit({
      companyName: companyName.trim(),
      contactPerson: initialData?.contactPerson || '',
      mobileNumber: mobileNumber.trim(),
      businessCategory,
      location: location.trim(),
      googleMapsUrl: initialData?.googleMapsUrl || '',
      instagramUrl: initialData?.instagramUrl || '',
      facebookUrl: initialData?.facebookUrl || '',
      hasWebsite,
      existingWebsiteUrl: hasWebsite ? existingWebsiteUrl.trim() : '',
      websiteQuality: hasWebsite ? (initialData?.websiteQuality || 'Unassessed') as WebsiteQuality : 'No Website',
      contactStatus,
      websiteInterest: (initialData?.websiteInterest || 'Pending') as WebsiteInterest,
      demoRequired: projectStatus === 'Demo Requested' || projectStatus === 'Demo Approved',
      demoStatus: (projectStatus === 'Demo Approved' ? 'Approved' : projectStatus === 'Demo Requested' ? 'In Progress' : initialData?.demoStatus || 'Not Started') as DemoStatus,
      demoUrl: initialData?.demoUrl || '',
      projectStatus,
      notes: initialData?.notes || '',
      nextFollowUpDate: initialData?.nextFollowUpDate || '',
      websiteProjectUrl: websiteProjectUrl.trim(),
      conversionDate: initialData?.conversionDate || '',
      completionDate: projectStatus === 'Completed' ? (completionDate || nowDate) : (initialData?.completionDate || ''),
      revenueReceived: projectStatus === 'Completed' && revenueReceived.trim() !== ''
        ? Number(revenueReceived)
        : initialData?.revenueReceived,
    });
  };

  return <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
    <section className="card p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
        <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"><Building2 size={20} /></span>
        <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Client details</h2><p className="text-xs text-gray-500">Company, phone, category and district</p></div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div><label className="label">Company name <span className="text-red-500">*</span></label><input className="input-field" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company name" required />{errors.companyName && <p className="mt-1 text-xs text-red-600"><AlertCircle size={12} className="mr-1 inline" />{errors.companyName}</p>}</div>
        <div><label className="label">Mobile number <span className="text-red-500">*</span></label><input className="input-field font-mono" type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="Phone number" required />{errors.mobileNumber && <p className="mt-1 text-xs text-red-600"><AlertCircle size={12} className="mr-1 inline" />{errors.mobileNumber}</p>}</div>
        <div><label className="label">Business category <span className="text-red-500">*</span></label><select className="select-field" value={businessCategory} onChange={e => setBusinessCategory(e.target.value)} required><option value="" disabled>Select a category</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select>{errors.businessCategory && <p className="mt-1 text-xs text-red-600">{errors.businessCategory}</p>}</div>
        <div><label className="label">District / location <span className="text-xs font-normal text-gray-400">Optional</span></label><input className="input-field" value={location} onChange={e => setLocation(e.target.value)} placeholder="District or town" /></div>
      </div>
    </section>

    <section className="card p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
        <span className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"><Globe size={20} /></span>
        <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Section B: Website information</h2><p className="text-xs text-gray-500">Record whether a website exists and its URL</p></div>
      </div>
      <div className="space-y-4">
        <fieldset><legend className="label">Does this business have a website?</legend><div className="flex gap-5"><label className="flex items-center gap-2 text-sm"><input type="radio" name="hasWebsite" checked={hasWebsite} onChange={() => setHasWebsite(true)} />Yes</label><label className="flex items-center gap-2 text-sm"><input type="radio" name="hasWebsite" checked={!hasWebsite} onChange={() => setHasWebsite(false)} />No</label></div></fieldset>
        {hasWebsite && <div><label className="label">Website URL</label><input className="input-field" type="url" value={existingWebsiteUrl} onChange={e => setExistingWebsiteUrl(e.target.value)} placeholder="https://example.com" /></div>}
      </div>
    </section>

    <section className="card p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
        <span className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"><MessageSquare size={20} /></span>
        <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Section C: Contact status</h2><p className="text-xs text-gray-500">Track outreach progress</p></div>
      </div>
      <div><label className="label">Contact status</label><select className="select-field max-w-md" value={contactStatus} onChange={e => setContactStatus(e.target.value as ContactStatus)}>{contactOptions.map(option => <option key={option} value={option}>{option}</option>)}</select></div>
    </section>

    <section className="card p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
        <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"><Briefcase size={20} /></span>
        <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Project progress</h2><p className="text-xs text-gray-500">Mark a project completed to include it in completed-project totals</p></div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div><label className="label">Project status</label><select className="select-field" value={projectStatus} onChange={e => setProjectStatus(e.target.value as ProjectStatus)}>{projectOptions.map(option => <option key={option} value={option}>{option}</option>)}</select></div>
        {projectStatus === 'Completed' && <>
          <div><label className="label">Project website URL <span className="text-xs font-normal text-gray-400">Optional</span></label><input className="input-field" type="url" value={websiteProjectUrl} onChange={e => setWebsiteProjectUrl(e.target.value)} placeholder="https://client-site.com" /></div>
          {projectStatus === 'Completed' && <div><label className="label"><Calendar size={14} className="mr-1 inline" />Project completed date</label><input className="input-field" type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} /></div>}
          <div><label className="label">Revenue received (₹) <span className="text-xs font-normal text-gray-400">Optional</span></label><input className="input-field" type="number" min="0" step="0.01" inputMode="decimal" value={revenueReceived} onChange={e => setRevenueReceived(e.target.value)} placeholder="0.00" /></div>
        </>}
      </div>
    </section>

    <div className="flex justify-end gap-3 pt-2">{onCancel && <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</button>}<button type="submit" className="btn-primary min-w-44" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : <><Save size={16} /><span>{submitLabel}</span><Check size={14} /></>}</button></div>
  </form>;
}
