import { Client, DashboardStats, FilterState, SortState } from '../types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function normalizeMobileNumber(number: string): string {
  return number.replace(/\D/g, '').replace(/^0+/, '');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function calculateDashboardStats(clients: Client[]): DashboardStats {
  return {
    totalClients: clients.length,
    newLeads: clients.filter(c => c.projectStatus === 'New Lead').length,
    contacted: clients.filter(c => c.contactStatus === 'Contacted').length,
    interested: clients.filter(c => c.websiteInterest === 'Interested').length,
    demoRequested: clients.filter(c => c.projectStatus === 'Demo Requested').length,
    demoApproved: clients.filter(c => c.projectStatus === 'Demo Approved').length,
    completedProjects: clients.filter(c => c.projectStatus === 'Completed').length,
    notInterested: clients.filter(c => c.websiteInterest === 'Not Interested' || c.projectStatus === 'Not Interested').length,
  };
}

export function filterClients(clients: Client[], filters: FilterState): Client[] {
  return clients.filter(client => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        client.companyName.toLowerCase().includes(searchLower) ||
        client.contactPerson.toLowerCase().includes(searchLower) ||
        client.mobileNumber.includes(filters.search) ||
        client.location.toLowerCase().includes(searchLower) ||
        client.businessCategory.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.businessCategory && client.businessCategory !== filters.businessCategory) {
      return false;
    }

    // Website filter
    if (filters.hasWebsite !== '') {
      const hasWebsite = filters.hasWebsite === 'yes';
      if (client.hasWebsite !== hasWebsite) return false;
    }

    // Contact status filter
    if (filters.contactStatus && client.contactStatus !== filters.contactStatus) {
      return false;
    }

    // Demo status filter
    if (filters.demoStatus && client.demoStatus !== filters.demoStatus) {
      return false;
    }

    // Project status filter
    if (filters.projectStatus && client.projectStatus !== filters.projectStatus) {
      return false;
    }

    return true;
  });
}

export function sortClients(clients: Client[], sort: SortState): Client[] {
  return [...clients].sort((a, b) => {
    let comparison = 0;
    const fieldA = a[sort.field] || '';
    const fieldB = b[sort.field] || '';

    if (sort.field === 'createdAt') {
      comparison = new Date(fieldA).getTime() - new Date(fieldB).getTime();
    } else {
      comparison = String(fieldA).localeCompare(String(fieldB));
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

export function paginateClients(clients: Client[], page: number, itemsPerPage: number): Client[] {
  const start = (page - 1) * itemsPerPage;
  return clients.slice(start, start + itemsPerPage);
}

export function exportClientsToCSV(clients: Client[]): void {
  const headers = [
    'Company Name',
    'Contact Person',
    'Mobile Number',
    'Business Category',
    'Location',
    'Has Website',
    'Website URL',
    'Website Quality',
    'Contact Status',
    'Website Interest',
    'Demo Required',
    'Demo Status',
    'Demo URL',
    'Project Status',
    'Notes',
    'Next Follow-up',
    'Created Date',
  ];

  const rows = clients.map(client => [
    client.companyName,
    client.contactPerson,
    client.mobileNumber,
    client.businessCategory,
    client.location,
    client.hasWebsite ? 'Yes' : 'No',
    client.existingWebsiteUrl,
    client.websiteQuality,
    client.contactStatus,
    client.websiteInterest,
    client.demoRequired ? 'Yes' : 'No',
    client.demoStatus,
    client.demoUrl,
    client.projectStatus,
    client.notes.replace(/,/g, ';'),
    client.nextFollowUpDate,
    client.createdAt,
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `client-manager-clients-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Contact Status
    'Not Contacted': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'Contacted': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'Follow-up Required': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',

    // Website Interest
    'Pending': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'Interested': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'Not Interested': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',

    // Demo Status
    'Not Started': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'Sent to Client': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'Approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',

    // Project Status
    'New Lead': 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    'Follow-up': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'Demo Requested': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'Demo Approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'Completed': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    'Unassessed': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',

    // Website Quality
    'Good': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    'Average': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    'Poor': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    'Broken': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    'Not Responsive': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'No Website': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

export function isOverdue(dateString: string): boolean {
  if (!dateString) return false;
  const followUpDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return followUpDate < today;
}

export function isToday(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isUpcoming(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return date > today && date <= nextWeek;
}
