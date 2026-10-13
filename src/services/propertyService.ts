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
    return MOCK_CITIES;
  },

  async getCityById(id: string): Promise<City | null> {
    return MOCK_CITIES.find((c) => c.id.toLowerCase() === id.toLowerCase()) || MOCK_CITIES[0] || null;
  }
};

