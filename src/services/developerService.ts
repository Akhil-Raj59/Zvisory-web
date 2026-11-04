import { backendApi } from '@/lib/api';
import { Developer } from '@/models/developer';
import { Project } from '@/models/project';
import { mapDbProjectToClientProject } from './projectService';

export function mapDbDeveloperToClientDeveloper(doc: any): Developer {
  const slug = doc.slug || (doc.name || '').toLowerCase().replace(/\s+/g, '-');

  return {
    _id: doc._id,
    id: slug,
    slug,
    name: doc.name || '',
    logo: doc.logo || '',
    shortDescription: doc.shortDescription || '',
    description: doc.description || doc.shortDescription || `Explore verified luxury developments by ${doc.name}`,
    website: doc.website || '',
    headquarters: doc.headquarters || '',
    projectCount: doc.publishedProjectsCount ?? doc.projectCount ?? doc.totalProjects ?? 0,
    publishedProjectsCount: doc.publishedProjectsCount ?? doc.projectCount ?? doc.totalProjects ?? 0,
    minPrice: doc.minPrice || 'Price On Request',
    citiesActive: Array.isArray(doc.citiesActive) ? doc.citiesActive : [],
    seo: doc.seo || {},
    status: doc.status || 'published',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const developerService = {
  /**
   * Fetch all published developers with live project counts
   */
  async getAllDevelopers(params: { search?: string; sort?: string; limit?: number } = {}): Promise<Developer[]> {
    try {
      const res = await backendApi.getPublicDevelopers(params);
      if (res?.success && Array.isArray(res.data)) {
        return res.data.map(mapDbDeveloperToClientDeveloper);
      }
    } catch (err) {
      console.error('developerService.getAllDevelopers error:', err instanceof Error ? err.message : err);
    }
    return [];
  },

  /**
   * Fetch a published developer by slug
   */
  async getDeveloperBySlug(slug: string): Promise<Developer | null> {
    try {
      const res = await backendApi.getDeveloperBySlug(slug);
      if (res?.success && res.data) {
        return mapDbDeveloperToClientDeveloper(res.data);
      }
    } catch (err) {
      console.error(`developerService.getDeveloperBySlug("${slug}") error:`, err instanceof Error ? err.message : err);
    }
    return null;
  },

  /**
   * Fetch published projects for a developer
   */
  async getDeveloperProjects(
    slug: string,
    params: { page?: number; limit?: number; sort?: string; city?: string; propertyType?: string; category?: string } = {}
  ): Promise<{ developer: { id: string; name: string; slug: string; logo?: string; headquarters?: string } | null; projects: Project[]; total: number; totalPages: number }> {
    try {
      const res = await backendApi.getDeveloperProjects(slug, params);
      if (res?.success && Array.isArray(res.data)) {
        return {
          developer: res.developer || null,
          projects: res.data.map(mapDbProjectToClientProject),
          total: res.total || res.data.length,
          totalPages: res.totalPages || 1,
        };
      }
    } catch (err) {
      console.error(`developerService.getDeveloperProjects("${slug}") error:`, err instanceof Error ? err.message : err);
    }
    return { developer: null, projects: [], total: 0, totalPages: 1 };
  },
};

