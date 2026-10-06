import { MOCK_PROPERTIES, Property } from "@/mock/properties";
import { MOCK_CITIES, City } from "@/mock/cities";

export interface PropertyFilterOptions {
  city?: string;
  propertyType?: string;
  launchStatus?: string;
  budget?: string;
  searchQuery?: string;
  unitConfig?: string;
}

export const propertyService = {
  async getFeaturedProperties(): Promise<Property[]> {
    return MOCK_PROPERTIES.filter((p) => p.featured);
  },

  async getAllProperties(filters?: PropertyFilterOptions): Promise<Property[]> {
    let result = [...MOCK_PROPERTIES];

    if (!filters) return result;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    if (filters.city && filters.city !== "All") {
      result = result.filter((p) => p.city.toLowerCase() === filters.city?.toLowerCase());
    }

    if (filters.propertyType && filters.propertyType !== "All") {
      result = result.filter((p) => p.type === filters.propertyType);
    }

    if (filters.launchStatus && filters.launchStatus !== "All") {
      result = result.filter((p) => p.status === filters.launchStatus);
    }

    if (filters.budget && filters.budget !== "All") {
      result = result.filter((p) => p.budgetRange === filters.budget);
    }

    if (filters.unitConfig && filters.unitConfig !== "All") {
      result = result.filter((p) => p.unitConfigs.includes(filters.unitConfig!));
    }

    return result;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    return MOCK_PROPERTIES.find((p) => p.id === id) || MOCK_PROPERTIES[0] || null;
  },

  async getSimilarProperties(id: string): Promise<Property[]> {
    return MOCK_PROPERTIES.filter((p) => p.id !== id).slice(0, 3);
  },

  async getAllCities(): Promise<City[]> {
    return MOCK_CITIES;
  },

  async getCityById(id: string): Promise<City | null> {
    return MOCK_CITIES.find((c) => c.id.toLowerCase() === id.toLowerCase()) || MOCK_CITIES[0] || null;
  }
};
