import { notFound } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { backendApi } from "@/lib/api";
import { CityDetailsClient } from "@/components/admin/city/CityDetailsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "City Overview | Zvisory Admin",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCityDetailsPage({ params }: Props) {
  const { id } = await params;
  const token = await getAuthToken();

  if (!token) {
    notFound();
  }

  let cityData: any = null;
  let projectsData: any[] = [];
  let allCitiesData: any[] = [];

  try {
    const [cityRes, projectsRes, allCitiesRes] = await Promise.all([
      backendApi.adminGetCityById(token, id),
      backendApi.adminGetCityProjects(token, id, { limit: 50 }),
      backendApi.adminGetCities(token, { limit: 100 }),
    ]);

    if (cityRes?.success && cityRes?.data) {
      cityData = cityRes.data;
    }
    if (projectsRes?.success && Array.isArray(projectsRes.data)) {
      projectsData = projectsRes.data;
    }
    if (allCitiesRes?.success && Array.isArray(allCitiesRes.data)) {
      allCitiesData = allCitiesRes.data;
    }
  } catch (err) {
    console.error("Failed to load city details:", err);
    notFound();
  }

  if (!cityData) {
    notFound();
  }

  return (
    <CityDetailsClient
      city={cityData}
      projects={projectsData}
      allCities={allCitiesData}
    />
  );
}
