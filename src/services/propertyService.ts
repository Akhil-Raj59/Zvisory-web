import { projectService, ProjectFilterOptions as ServiceFilterOptions } from "./projectService";
import { Project } from "@/models/project";
import { Property } from "@/mock/properties";
import { MOCK_CITIES, City } from "@/mock/cities";

export type PropertyFilterOptions = ServiceFilterOptions;

export function projectToProperty(p: Project): Property {
  return {
    id: p.slug,
    name: p.title,
    location: p.location,
    city: p.city,
    price: p.startingPrice,
    priceRaw: p.priceRaw,
    type: (p.propertyType as Property["type"]) || "High Rise",
    status: (p.status as Property["status"]) || "Under Construction",
    budgetRange: "3 – 5 Cr",
    unitConfigs: p.unitType.length > 0 ? p.unitType : ["3 BHK", "4 BHK"],
    area: p.unitSizes,
    possessionTime: p.possession || "Contact for Details",
    image: p.image,
    description: p.overview.description,
    usps: p.amenities.items.map((a) => a.name).slice(0, 4),
    reraNo: p.reraNumber,
    landParcel: p.landArea,
    featured: true
  };
}

export const propertyService = {
  async getFeaturedProperties(): Promise<Property[]> {
    const projects = await projectService.getFeaturedProjects(6);
    return projects.map(projectToProperty);
  },

  async getAllProperties(filters?: PropertyFilterOptions): Promise<Property[]> {
    const projects = await projectService.getAllProjects(filters);
    return projects.map(projectToProperty);
  },

  async getPropertyById(id: string): Promise<Property | null> {
    const project = await projectService.getProjectBySlug(id);
    if (!project) return null;
    return projectToProperty(project);
  },

  async getSimilarProperties(id: string): Promise<Property[]> {
    const projects = await projectService.getSimilarProjects(id, 3);
    return projects.map(projectToProperty);
  },

  async getAllCities(): Promise<City[]> {
    try {
      const { backendApi } = await import("@/lib/api");
      const res = await backendApi.getPublicCities();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((dbCity: any) => ({
          id: dbCity.slug || dbCity.name.toLowerCase().replace(/\s+/g, "-"),
          slug: dbCity.slug || dbCity.name.toLowerCase().replace(/\s+/g, "-"),
          name: dbCity.name,
          state: dbCity.state || "",
          country: dbCity.country || "India",
          projectCount: dbCity.projectCount ?? dbCity.count ?? 0,
          priceRange: dbCity.startingPrice || "₹1.5 Cr*",
          startingPrice: dbCity.startingPrice || "₹1.5 Cr*",
          image:
            dbCity.image ||
            dbCity.coverImage ||
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
          coverImage: dbCity.coverImage || dbCity.image || "",
          shortDescription: dbCity.shortDescription || "",
          description: dbCity.description || dbCity.shortDescription || `Explore verified luxury developments in ${dbCity.name}`,
          highlights: dbCity.highlights || [],
          localities: dbCity.localities || [],
          gallery: dbCity.gallery || [],
          seo: dbCity.seo,
          status: dbCity.status || "published",
          isFeatured: Boolean(dbCity.isFeatured),
        }));
      }
    } catch {
      // fallback if backend is offline
    }
    return MOCK_CITIES;
  },

  async getCityById(id: string): Promise<City | null> {
    try {
      const { backendApi } = await import("@/lib/api");
      const res = await backendApi.getCityBySlug(id);
      if (res && res.success && res.data) {
        const d = res.data;
        return {
          id: d.slug || d.name.toLowerCase().replace(/\s+/g, "-"),
          slug: d.slug,
          name: d.name,
          state: d.state || "",
          country: d.country || "India",
          projectCount: d.publishedProjectsCount ?? d.projectCount ?? 0,
          priceRange: d.startingPrice || "₹1.5 Cr*",
          startingPrice: d.startingPrice || "₹1.5 Cr*",
          image:
            d.image ||
            d.coverImage ||
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
          coverImage: d.coverImage || d.image || "",
          shortDescription: d.shortDescription || "",
          description: d.description || d.shortDescription || `Explore verified luxury developments in ${d.name}`,
          highlights: d.highlights || [],
          localities: d.localities || [],
          gallery: d.gallery || [],
          seo: d.seo,
          status: d.status || "published",
          isFeatured: Boolean(d.isFeatured),
        };
      }
    } catch {
      // fallback to list search
    }

    const all = await this.getAllCities();
    const cleanId = (id || "").toLowerCase().trim();
    return (
      all.find(
        (c) =>
          c.id.toLowerCase() === cleanId ||
          c.name.toLowerCase() === cleanId ||
          (c.slug && c.slug.toLowerCase() === cleanId)
      ) || null
    );
  }
};

