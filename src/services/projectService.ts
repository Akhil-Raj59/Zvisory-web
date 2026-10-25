import rawProjectsData from "@/data/excel_projects_raw.json";
import { Project } from "@/models/project";
import { normalizeExcelRecord } from "./projectNormalizer";
import { backendApi } from "@/lib/api";

// Local fallback normalization from Excel JSON (for offline build resilience).
// WARNING: This is a DEVELOPMENT FALLBACK only. If backend is running correctly
// this data should never appear in production. Check backend connectivity if you
// see this warning: [DEV_USING_FALLBACK]
const LOCAL_FALLBACK_PROJECTS: Project[] = (
  rawProjectsData as Record<string, string | null>[]
).map((record, idx) => normalizeExcelRecord(record, idx));

export interface ProjectFilterOptions {
  searchQuery?: string;
  city?: string;
  propertyType?: string;
  developer?: string;
  status?: string;
  category?: string;
  unitConfig?: string;
  budget?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProjectsResult {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
  count: number;
}

/**
 * Maps a database project record (and its joined ProjectDetail) to the Project client interface
 */
export function mapDbProjectToClientProject(doc: any): Project {
  const d = doc.details || {};

  return {
    id: doc.slug,
    slug: doc.slug,
    title: doc.title,
    keywords: doc.keywords || [],
    secondaryKeywords: doc.secondaryKeywords || [],
    developer: doc.developer,
    location: doc.location || (doc.microMarket ? `${doc.microMarket}, ${doc.city}` : doc.city),
    city: doc.city,
    microMarket: doc.microMarket || "",
    startingPrice: doc.startingPrice || "Price On Request",
    priceRaw: typeof doc.priceNumeric === "number" ? doc.priceNumeric : 0,
    unitType: doc.unitConfigurations?.length > 0 ? doc.unitConfigurations : ["3 BHK", "4 BHK"],
    unitSizes: doc.unitSizes || "Custom Layouts",
    landArea: doc.landArea || "",
    totalUnits: doc.totalUnits || "",
    propertyType: doc.propertyType || "Apartments",
    status: doc.launchStatus || "Under Construction",
    possession: doc.possessionText || "",
    elevation: doc.elevation || "",
    paymentPlan: doc.paymentPlan || "",
    reraNumber: doc.reraNumber || "",
    categories: doc.categories?.length > 0 ? doc.categories : ["Luxury"],
    bannerUrl: doc.bannerUrl || doc.cardBanner || "",
    image: doc.cardBanner || doc.bannerUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    
    // Structured sections
    detailSpecs: d.detailSpecs || [],
    overview: d.overview || {
      heading: "Project Overview",
      title: doc.title,
      description: doc.shortDescription || "",
      images: [doc.bannerUrl || doc.cardBanner || ""].filter(Boolean),
    },
    amenities: d.amenities || {
      heading: "Amenities",
      title: "Designed to meet the highest criteria",
      items: [],
    },
    floorPlans: d.floorPlans || {
      heading: "Floor Plans",
      title: "Sophisticated and Spacious",
      plans: [],
    },
    gallery: d.gallery || {
      heading: "Gallery",
      title: "Photos & Media",
      description: "",
      images: [doc.bannerUrl || doc.cardBanner || ""].filter(Boolean),
    },
    locationAdvantages: d.locationAdvantages || {
      heading: "Location Advantage",
      title: "Prime Connectivity",
      categories: [],
    },
    infoSections: d.infoSections || [],
    offers: d.offers || [],
    documents: d.documents || [],
    faqs: d.faqs || [],
    contact: d.contact || {
      heading: "Contact Us",
      title: "Schedule a Visit",
      locationMapUrl: "",
    },
    seo: {
      ogTitle: doc.seo?.ogTitle || doc.seo?.title || `${doc.title} | Zvisory`,
      ogDescription: doc.seo?.ogDescription || doc.seo?.description || doc.shortDescription || "",
      ogImage: doc.seo?.ogImage || doc.cardBanner || doc.bannerUrl || "",
      gtagId: doc.gtag?.gtagId,
      gtagSendTo: doc.gtag?.gtagSendTo,
    },
    raw: doc.raw || {},
  };
}

export const projectService = {
  /**
   * Fetch projects from database via backend API with live search, filters, and pagination.
   * Falls back gracefully to local normalized dataset if the backend is unreachable.
   */
  async getAllProjects(filters?: ProjectFilterOptions, sortBy?: string): Promise<Project[]> {
    try {
      const params: Record<string, any> = {
        limit: filters?.limit || 100,
        page: filters?.page || 1,
        ...(filters?.searchQuery ? { search: filters.searchQuery } : {}),
        ...(filters?.city && filters.city !== "All" ? { city: filters.city } : {}),
        ...(filters?.propertyType && filters.propertyType !== "All" ? { propertyType: filters.propertyType } : {}),
        ...(filters?.developer && filters.developer !== "All" ? { developer: filters.developer } : {}),
        ...(filters?.status && filters.status !== "All" ? { status: filters.status } : {}),
        ...(filters?.category && filters.category !== "All" ? { category: filters.category } : {}),
        ...(filters?.unitConfig && filters.unitConfig !== "All" ? { unitConfig: filters.unitConfig } : {}),
        ...(filters?.budget && filters.budget !== "All" ? { budget: filters.budget } : {}),
        ...(sortBy ? { sort: sortBy } : {}),
      };

      const res = await backendApi.getProjects(params);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapDbProjectToClientProject);
      }
    } catch (err) {
      // Log explicit warning — fallback is active, backend may be unreachable
      console.warn(
        '[DEV_USING_FALLBACK] projectService.getAllProjects: backend API unavailable, using local Excel JSON fallback.',
        err instanceof Error ? err.message : err
      );
    }

    // In-memory fallback
    let result = [...LOCAL_FALLBACK_PROJECTS];
    if (filters) {
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.developer.toLowerCase().includes(q) ||
            p.microMarket.toLowerCase().includes(q)
        );
      }
      if (filters.city && filters.city !== "All") {
        const c = filters.city.toLowerCase();
        result = result.filter((p) => p.city.toLowerCase() === c || p.location.toLowerCase().includes(c));
      }
      if (filters.category && filters.category !== "All") {
        const cat = filters.category.toLowerCase();
        result = result.filter((p) => p.categories.some((k) => k.toLowerCase().includes(cat)));
      }
      if (filters.developer && filters.developer !== "All") {
        const d = filters.developer.toLowerCase();
        result = result.filter((p) => p.developer.toLowerCase().includes(d));
      }
    }
    return result;
  },

  /**
   * Paginated search for the search results page
   */
  async getPaginatedProjects(
    filters?: ProjectFilterOptions,
    sortBy?: string
  ): Promise<PaginatedProjectsResult> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;

    try {
      const params: Record<string, any> = {
        limit,
        page,
        ...(filters?.searchQuery ? { search: filters.searchQuery } : {}),
        ...(filters?.city && filters.city !== "All" ? { city: filters.city } : {}),
        ...(filters?.propertyType && filters.propertyType !== "All" ? { propertyType: filters.propertyType } : {}),
        ...(filters?.developer && filters.developer !== "All" ? { developer: filters.developer } : {}),
        ...(filters?.status && filters.status !== "All" ? { status: filters.status } : {}),
        ...(filters?.category && filters.category !== "All" ? { category: filters.category } : {}),
        ...(filters?.unitConfig && filters.unitConfig !== "All" ? { unitConfig: filters.unitConfig } : {}),
        ...(filters?.budget && filters.budget !== "All" ? { budget: filters.budget } : {}),
        ...(sortBy ? { sort: sortBy } : {}),
      };

      const res = await backendApi.getProjects(params);
      if (res && res.success && Array.isArray(res.data)) {
        return {
          projects: res.data.map(mapDbProjectToClientProject),
          total: res.total || res.data.length,
          page: res.page || page,
          totalPages: res.totalPages || Math.ceil((res.total || res.data.length) / limit) || 1,
          count: res.count || res.data.length,
        };
      }
    } catch (err) {
      console.warn(
        '[DEV_USING_FALLBACK] projectService.getPaginatedProjects: backend unavailable, falling back to in-memory dataset.',
        err instanceof Error ? err.message : err
      );
    }

    const all = await this.getAllProjects(filters, sortBy);
    const start = (page - 1) * limit;
    return {
      projects: all.slice(start, start + limit),
      total: all.length,
      page,
      totalPages: Math.ceil(all.length / limit) || 1,
      count: all.slice(start, start + limit).length,
    };
  },

  /**
   * Get project by stable slug identifier joined with full ProjectDetails
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    const cleanSlug = slug.toLowerCase().trim();
    try {
      const res = await backendApi.getProjectBySlug(cleanSlug);
      if (res && res.success && res.data) {
        return mapDbProjectToClientProject(res.data);
      }
    } catch (err) {
      console.warn(
        '[DEV_USING_FALLBACK] projectService.getProjectBySlug: backend unavailable for slug',
        cleanSlug,
        err instanceof Error ? err.message : err
      );
    }

    const fallback = LOCAL_FALLBACK_PROJECTS.find(
      (p) => p.slug === cleanSlug || p.id === cleanSlug || p.keywords.includes(cleanSlug)
    );
    return fallback || null;
  },

  /**
   * Featured projects for Homepage
   */
  async getFeaturedProjects(limit = 6): Promise<Project[]> {
    try {
      const res = await backendApi.getFeaturedProjects(limit);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapDbProjectToClientProject);
      }
    } catch (err) {
      console.warn(
        '[DEV_USING_FALLBACK] projectService.getFeaturedProjects: backend unavailable.',
        err instanceof Error ? err.message : err
      );
    }

    return LOCAL_FALLBACK_PROJECTS.slice(0, limit);
  },

  /**
   * Projects by city
   */
  async getProjectsByCity(city: string): Promise<Project[]> {
    return this.getAllProjects({ city });
  },

  /**
   * Similar projects recommendation
   */
  async getSimilarProjects(slugOrId: string, limit = 3): Promise<Project[]> {
    try {
      const res = await backendApi.getSimilarProjects(slugOrId, limit);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapDbProjectToClientProject);
      }
    } catch {
      // Fallback
    }

    const current = await this.getProjectBySlug(slugOrId);
    if (!current) return LOCAL_FALLBACK_PROJECTS.slice(0, limit);

    return LOCAL_FALLBACK_PROJECTS.filter(
      (p) => p.slug !== current.slug && (p.city === current.city || p.categories.some((c) => current.categories.includes(c)))
    ).slice(0, limit);
  },

  /**
   * Derived filter options from live database
   */
  async getFilterOptions(): Promise<{
    cities: string[];
    developers: string[];
    propertyTypes: string[];
    categories: string[];
    unitConfigs: string[];
    launchStatuses: string[];
  }> {
    try {
      const res = await backendApi.getProjectFilters();
      if (res && res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    const cities = Array.from(new Set(LOCAL_FALLBACK_PROJECTS.map((p) => p.city))).filter(Boolean).sort();
    const developers = Array.from(new Set(LOCAL_FALLBACK_PROJECTS.map((p) => p.developer))).filter(Boolean).sort();
    const propertyTypes = Array.from(new Set(LOCAL_FALLBACK_PROJECTS.map((p) => p.propertyType))).filter(Boolean).sort();
    const categories = Array.from(new Set(LOCAL_FALLBACK_PROJECTS.flatMap((p) => p.categories))).filter(Boolean).sort();
    const unitConfigs = Array.from(new Set(LOCAL_FALLBACK_PROJECTS.flatMap((p) => p.unitType))).filter(Boolean).sort();

    return {
      cities,
      developers,
      propertyTypes,
      categories,
      unitConfigs,
      launchStatuses: ["Pre Launch", "New Launch", "Under Construction", "Ready To Move-In"],
    };
  },
};
