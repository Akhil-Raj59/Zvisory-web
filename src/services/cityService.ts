import { backendApi } from '@/lib/api';
import { City } from '@/models/city';
import { Project } from '@/models/project';
import { mapDbProjectToClientProject } from './projectService';

const FALLBACK_CITY_IMG = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80';

export function mapDbCityToClientCity(doc: any): City {
  const slug = doc.slug || (doc.name || '').toLowerCase().replace(/\s+/g, '-');
  const img = doc.image || doc.coverImage || FALLBACK_CITY_IMG;

  return {
    _id: doc._id,
    id: slug,
    slug,
    name: doc.name || '',
    state: doc.state || '',
    country: doc.country || 'India',
    image: img,
    coverImage: doc.coverImage || img,
    startingPrice: doc.startingPrice || '₹1.5 Cr*',
    priceRange: doc.startingPrice || '₹1.5 Cr*',
    shortDescription: doc.shortDescription || '',
    description: doc.description || doc.shortDescription || `Explore verified luxury developments in ${doc.name}`,
    highlights: Array.isArray(doc.highlights) ? doc.highlights : [],
    localities: Array.isArray(doc.localities) ? doc.localities : [],
    gallery: Array.isArray(doc.gallery) ? doc.gallery : [],
    seo: doc.seo || {},
    status: doc.status || 'published',
    isFeatured: Boolean(doc.isFeatured),
    projectCount: doc.publishedProjectsCount ?? doc.projectCount ?? doc.count ?? 0,
    publishedProjectsCount: doc.publishedProjectsCount ?? doc.projectCount ?? doc.count ?? 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const cityService = {
  /**
   * Fetch all published cities with live project counts
   */
  async getAllCities(params: { search?: string; sort?: string; limit?: number } = {}): Promise<City[]> {
    try {
      const res = await backendApi.getPublicCities(params);
      if (res?.success && Array.isArray(res.data)) {
        return res.data.map(mapDbCityToClientCity);
      }
    } catch (err) {
      console.error('cityService.getAllCities error:', err instanceof Error ? err.message : err);
    }
    return [];
  },

  /**
   * Fetch a published city by slug
   */
  async getCityBySlug(slug: string): Promise<City | null> {
    try {
      const res = await backendApi.getCityBySlug(slug);
      if (res?.success && res.data) {
        return mapDbCityToClientCity(res.data);
      }
    } catch (err) {
      console.error(`cityService.getCityBySlug("${slug}") error:`, err instanceof Error ? err.message : err);
    }
    return null;
  },

  /**
   * Fetch published projects for a city
   */
  async getCityProjects(
    slug: string,
    params: { page?: number; limit?: number; sort?: string; propertyType?: string; category?: string } = {}
  ): Promise<{ city: { id: string; name: string; slug: string } | null; projects: Project[]; total: number; totalPages: number }> {
    try {
      const res = await backendApi.getCityProjects(slug, params);
      if (res?.success && Array.isArray(res.data)) {
        return {
          city: res.city || null,
          projects: res.data.map(mapDbProjectToClientProject),
          total: res.total || res.data.length,
          totalPages: res.totalPages || 1,
        };
      }
    } catch (err) {
      console.error(`cityService.getCityProjects("${slug}") error:`, err instanceof Error ? err.message : err);
    }
    return { city: null, projects: [], total: 0, totalPages: 1 };
  },
};

