import rawProjectsData from "@/data/excel_projects_raw.json";
import { Project } from "@/models/project";
import { normalizeExcelRecord } from "./projectNormalizer";

// Normalize all 81 project records once at module load
const ALL_PROJECTS: Project[] = (rawProjectsData as Record<string, string | null>[]).map(
  (record, idx) => normalizeExcelRecord(record, idx)
);

export interface ProjectFilterOptions {
  searchQuery?: string;
  city?: string;
  propertyType?: string;
  developer?: string;
  status?: string;
  category?: string;
  unitConfig?: string;
  budget?: string;
}

export const projectService = {
  /**
   * Fetch all 81 normalized projects with optional filters and sorting
   */
  async getAllProjects(filters?: ProjectFilterOptions, sortBy?: string): Promise<Project[]> {
    let result = [...ALL_PROJECTS];

    if (filters) {
      if (filters.searchQuery && filters.searchQuery.trim() !== "") {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.developer.toLowerCase().includes(q) ||
            p.microMarket.toLowerCase().includes(q) ||
            p.keywords.some((k) => k.toLowerCase().includes(q)) ||
            p.secondaryKeywords.some((k) => k.toLowerCase().includes(q)) ||
            p.categories.some((c) => c.toLowerCase().includes(q))
        );
      }

      if (filters.city && filters.city !== "All") {
        const cityFilter = filters.city.toLowerCase();
        result = result.filter((p) => p.city.toLowerCase() === cityFilter || p.location.toLowerCase().includes(cityFilter));
      }

      if (filters.propertyType && filters.propertyType !== "All") {
        const typeFilter = filters.propertyType.toLowerCase();
        result = result.filter(
          (p) => p.propertyType.toLowerCase().includes(typeFilter) || p.categories.some((c) => c.toLowerCase().includes(typeFilter))
        );
      }

      if (filters.developer && filters.developer !== "All") {
        const devFilter = filters.developer.toLowerCase();
        result = result.filter((p) => p.developer.toLowerCase().includes(devFilter));
      }

      if (filters.status && filters.status !== "All") {
        const statusFilter = filters.status.toLowerCase();
        result = result.filter((p) => p.status.toLowerCase().includes(statusFilter));
      }

      if (filters.category && filters.category !== "All") {
        const catFilter = filters.category.toLowerCase();
        result = result.filter((p) => p.categories.some((c) => c.toLowerCase().includes(catFilter)));
      }

      if (filters.unitConfig && filters.unitConfig !== "All") {
        const configFilter = filters.unitConfig.toLowerCase();
        result = result.filter((p) => p.unitType.some((u) => u.toLowerCase().includes(configFilter)));
      }

      if (filters.budget && filters.budget !== "All") {
        switch (filters.budget) {
          case "Under 1 Cr":
            result = result.filter((p) => p.priceRaw > 0 && p.priceRaw < 10000000);
            break;
          case "1 – 2 Cr":
          case "1 - 2 Cr":
            result = result.filter((p) => p.priceRaw >= 10000000 && p.priceRaw <= 20000000);
            break;
          case "2 – 3 Cr":
          case "2 - 3 Cr":
            result = result.filter((p) => p.priceRaw >= 20000000 && p.priceRaw <= 30000000);
            break;
          case "3 – 5 Cr":
          case "3 - 5 Cr":
            result = result.filter((p) => p.priceRaw >= 30000000 && p.priceRaw <= 50000000);
            break;
          case "5 Cr +":
            result = result.filter((p) => p.priceRaw >= 50000000);
            break;
        }
      }
    }

    if (sortBy) {
      switch (sortBy) {
        case "price_asc":
          result.sort((a, b) => (a.priceRaw || 999999999) - (b.priceRaw || 999999999));
          break;
        case "price_desc":
          result.sort((a, b) => (b.priceRaw || 0) - (a.priceRaw || 0));
          break;
        case "name_asc":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "location_asc":
          result.sort((a, b) => a.location.localeCompare(b.location));
          break;
      }
    }

    return result;
  },

  /**
   * Get project by stable slug identifier
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    const cleanSlug = slug.toLowerCase().trim();
    const found = ALL_PROJECTS.find(
      (p) => p.slug === cleanSlug || p.id === cleanSlug || p.keywords.includes(cleanSlug)
    );
    return found || null;
  },

  /**
   * Featured projects for Homepage
   */
  async getFeaturedProjects(limit = 6): Promise<Project[]> {
    return ALL_PROJECTS.slice(0, limit);
  },

  /**
   * Projects by city
   */
  async getProjectsByCity(city: string): Promise<Project[]> {
    const cleanCity = city.toLowerCase().trim();
    return ALL_PROJECTS.filter(
      (p) => p.city.toLowerCase().includes(cleanCity) || p.location.toLowerCase().includes(cleanCity)
    );
  },

  /**
   * Similar projects
   */
  async getSimilarProjects(currentSlug: string, limit = 3): Promise<Project[]> {
    const current = await this.getProjectBySlug(currentSlug);
    if (!current) return ALL_PROJECTS.slice(0, limit);

    return ALL_PROJECTS.filter((p) => p.slug !== current.slug && p.city === current.city).slice(0, limit);
  },

  /**
   * Dynamic filter options derived from dataset
   */
  async getFilterOptions() {
    const citiesSet = new Set<string>();
    const developersSet = new Set<string>();
    const propertyTypesSet = new Set<string>();
    const categoriesSet = new Set<string>();
    const unitConfigsSet = new Set<string>();

    ALL_PROJECTS.forEach((p) => {
      if (p.city) citiesSet.add(p.city);
      if (p.developer) developersSet.add(p.developer);
      if (p.propertyType) propertyTypesSet.add(p.propertyType);
      p.categories.forEach((c) => categoriesSet.add(c));
      p.unitType.forEach((u) => unitConfigsSet.add(u));
    });

    return {
      cities: Array.from(citiesSet).sort(),
      developers: Array.from(developersSet).sort(),
      propertyTypes: Array.from(propertyTypesSet).sort(),
      categories: Array.from(categoriesSet).sort(),
      unitConfigs: Array.from(unitConfigsSet).sort()
    };
  },

  /**
   * Fetch projects for comparison
   */
  async getComparison(slugs: string[]): Promise<Project[]> {
    return ALL_PROJECTS.filter((p) => slugs.includes(p.slug) || slugs.includes(p.id));
  }
};
