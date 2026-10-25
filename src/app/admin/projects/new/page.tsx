import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Project | Zvisory Admin",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div className="py-2">
      <ProjectForm isEdit={false} />
    </div>
  );
}
