import { LeadTrackingData, TouchAttribution } from '@/lib/tracking';

export type LeadStatus = 'new' | 'contacted' | 'closed';
export type EmailSyncStatus = 'pending' | 'sent' | 'failed' | 'disabled';
export type CrmSyncStatus = 'pending' | 'synced' | 'failed' | 'configuration_required' | 'disabled';

export interface StatusHistoryItem {
  _id?: string;
  status: LeadStatus;
  changedAt: string;
  changedBy?: {
    _id: string;
    fullName: string;
    email: string;
    role?: string;
  } | null;
  notes?: string;
}

export interface LeadJob {
  _id: string;
  leadId: string;
  type: 'EMAIL_NOTIFICATION' | 'LEADSQUARED_SYNC';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'configuration_required';
  attempts: number;
  maxAttempts: number;
  nextRunAt: string;
  lastAttemptAt?: string;
  lastError?: string;
  idempotencyKey: string;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  message?: string;

  formType: string;
  formLocation: string;
  projectId?: string | null;
  projectName?: string;
  projectSlug?: string;
  city?: string;
  developer?: string;
  projectUrl?: string;

  firstTouch?: TouchAttribution;
  latestTouch?: TouchAttribution;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  submissionPage?: string;
  sessionId?: string;

  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet' | 'unknown';

  status: LeadStatus;
  statusHistory?: StatusHistoryItem[];
  emailStatus: EmailSyncStatus;
  crmStatus: CrmSyncStatus;
  leadSquaredId?: string;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput extends Partial<LeadTrackingData> {
  fullName: string;
  email?: string;
  countryCode?: string;
  phone: string;
  message?: string;

  formType?: string;
  formLocation?: string;
  projectId?: string | null;
  projectName?: string;
  projectSlug?: string;
  city?: string;
  developer?: string;
  projectUrl?: string;

  turnstileToken?: string;
}

export interface LeadFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  city?: string;
  developer?: string;
  projectName?: string;
  utmSource?: string;
  utmCampaign?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  closed: number;
  today: number;
  topSources: Array<{ source: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;
}

export interface PaginatedLeads {
  leads: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

