import { MetadataRoute } from "next";
import { backendApi } from "@/lib/api";
import { siteConfig } from "@/config/site.config";

export const revalidate = 3600; // revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Base static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cities`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/home-loan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  let cityRoutes: MetadataRoute.Sitemap = [];
  let developerRoutes: MetadataRoute.Sitemap = [];

  try {
    // 1. Fetch published projects from backend
    const projRes = await backendApi.getProjects({ limit: 500 });
    if (projRes?.success && Array.isArray(projRes.data)) {
      projectRoutes = projRes.data
        .filter((p: any) => p.status === "published" && p.slug)
        .map((p: any) => ({
          url: `${baseUrl}/properties/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.85,
        }));
    }
  } catch (err) {
    console.error("Sitemap: Failed to load published projects", err);
  }

  try {
    // 2. Fetch published cities from backend
    const cityRes = await backendApi.getPublicCities();
    if (cityRes?.success && Array.isArray(cityRes.data)) {
      cityRoutes = cityRes.data
        .filter((c: any) => c.status === "published" && c.slug)
        .map((c: any) => ({
          url: `${baseUrl}/cities/${c.slug}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.error("Sitemap: Failed to load published cities", err);
  }

  try {
    // 3. Fetch published developers from backend
    const devRes = await backendApi.getPublicDevelopers();
    if (devRes?.success && Array.isArray(devRes.data)) {
      developerRoutes = devRes.data
        .filter((d: any) => d.status === "published" && d.slug)
        .map((d: any) => ({
          url: `${baseUrl}/developers/${d.slug}`,
          lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.error("Sitemap: Failed to load published developers", err);
  }

  return [...staticRoutes, ...cityRoutes, ...developerRoutes, ...projectRoutes];
}
