import { notFound } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { backendApi } from "@/lib/api";
import { CityForm } from "@/components/admin/city/CityForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit City | Zvisory Admin",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCityPage({ params }: Props) {
  const { id } = await params;
  const token = await getAuthToken();

  if (!token) {
    notFound();
  }

  let cityData: any = null;
  try {
    const res = await backendApi.adminGetCityById(token, id);
    if (res?.success && res?.data) {
      cityData = res.data;
    }
  } catch (err) {
    console.error("Failed to load city for edit:", err);
    notFound();
  }

  if (!cityData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CityForm initialData={cityData} isEdit={true} />
    </div>
  );
}
