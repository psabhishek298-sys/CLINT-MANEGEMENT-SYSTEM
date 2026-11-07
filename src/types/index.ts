export type ContactStatus = 'Not Contacted' | 'Contacted' | 'Follow-up Required';

export type WebsiteInterest = 'Pending' | 'Interested' | 'Not Interested';

export type WebsiteQuality = 'Good' | 'Average' | 'Poor' | 'Broken' | 'Not Responsive' | 'No Website' | 'Unassessed';

export type DemoStatus = 'Not Started' | 'In Progress' | 'Sent to Client' | 'Approved' | 'Rejected';

export type ProjectStatus = 
  | 'New Lead'
  | 'Contacted'
  | 'Follow-up'
  | 'Demo Requested'
  | 'Demo Approved'
  | 'Completed'
  | 'Not Interested';

export type BusinessCategory = string;

export interface Activity {
  id: string;
  clientId: string;
  type: 'created' | 'updated' | 'status_change' | 'call' | 'demo_request' | 'demo_sent' | 'demo_approved' | 'demo_rejected' | 'proposal_sent' | 'converted' | 'completed' | 'note' | 'follow_up';
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface Client {
  id: string;
  // Business Information
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  businessCategory: BusinessCategory;
  location: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;

  // Website Information
  hasWebsite: boolean;
  existingWebsiteUrl: string;
  websiteQuality: WebsiteQuality;

  // Communication
  contactStatus: ContactStatus;
  websiteInterest: WebsiteInterest;
  demoRequired: boolean;
  demoStatus: DemoStatus;
  demoUrl: string;

  // Project
  projectStatus: ProjectStatus;
  notes: string;
  nextFollowUpDate: string;

  // Converted client info
  websiteProjectUrl: string;
  conversionDate: string;
  completionDate?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // Activity timeline
  activities: Activity[];
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface DashboardStats {
  totalClients: number;
  newLeads: number;
  contacted: number;
  interested: number;
  demoRequested: number;
  demoApproved: number;
  completedProjects: number;
  notInterested: number;
}

export interface FilterState {
  search: string;
  businessCategory: string;
  hasWebsite: string;
  contactStatus: string;
  demoStatus: string;
  projectStatus: string;
}

export type SortField = 'companyName' | 'createdAt' | 'contactPerson' | 'location' | 'projectStatus';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
