import { getLeadTrackingPayload } from '@/lib/tracking';
import type {
  CreateLeadInput,
  Lead,
  LeadFilterParams,
  LeadJob,
  LeadStats,
  PaginatedLeads,
} from '@/models/lead';

class LeadService {
  /**
   * Submit a lead enquiry from public forms.
   */
  async submitLead(input: CreateLeadInput): Promise<{ success: boolean; leadId?: string; message: string }> {
    const tracking = getLeadTrackingPayload();

    const payload: CreateLeadInput = {
      ...tracking,
      ...input,
      countryCode: input.countryCode || '+91',
      formType: input.formType || 'general_enquiry',
      formLocation: input.formLocation || 'website',
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to submit enquiry. Please try again.');
    }

    return {
      success: true,
      leadId: data.data?.leadId,
      message: data.message || 'Your enquiry has been received successfully.',
    };
  }

  /**
   * Admin: Get paginated and filtered leads.
   */
  async adminGetLeads(params: LeadFilterParams = {}, token?: string): Promise<PaginatedLeads> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.city) query.set('city', params.city);
    if (params.developer) query.set('developer', params.developer);
    if (params.projectName) query.set('projectName', params.projectName);
    if (params.utmSource) query.set('utmSource', params.utmSource);
    if (params.utmCampaign) query.set('utmCampaign', params.utmCampaign);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/admin/leads?${query.toString()}`, {
      headers,
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch leads');
    }

    return data.data;
  }

  /**
   * Admin: Get lead overview statistics.
   */
  async adminGetStats(token?: string): Promise<LeadStats> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/admin/leads/stats', {
      headers,
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch lead stats');
    }

    return data.data;
  }

  /**
   * Admin: Get lead details with Outbox sync jobs and timeline.
   */
  async adminGetLeadById(id: string, token?: string): Promise<{ lead: Lead; jobs: LeadJob[] }> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/admin/leads/${id}`, {
      headers,
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Lead not found');
    }

    return data.data;
  }

  /**
   * Admin: Update lead status (New, Contacted, Closed).
   */
  async adminUpdateStatus(
    id: string,
    status: 'new' | 'contacted' | 'closed',
    notes = '',
    token?: string
  ): Promise<Lead> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/admin/leads/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status, notes }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update status');
    }

    return data.data.lead;
  }

  /**
   * Admin: Manually retry failed Outbox sync job.
   */
  async adminRetryJob(id: string, jobId: string, token?: string): Promise<LeadJob> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/admin/leads/${id}/retry-job/${jobId}`, {
      method: 'POST',
      headers,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to retry job');
    }

    return data.data.job;
  }
}

export const leadService = new LeadService();

