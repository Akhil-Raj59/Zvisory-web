import type { Metadata } from "next";
import { CityForm } from "@/components/admin/city/CityForm";

export const metadata: Metadata = {
  title: "Create City | Zvisory Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCityPage() {
  return (
    <div className="space-y-6">
      <CityForm isEdit={false} />
    </div>
  );
}
