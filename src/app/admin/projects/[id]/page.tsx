import { notFound } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { backendApi } from "@/lib/api";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Project | Zvisory Admin",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const token = await getAuthToken();

  if (!token) {
    notFound();
  }

  let projectData = null;
  try {
    const res = await backendApi.adminGetProjectById(token, id);
    if (res.success && res.data) {
      projectData = res.data;
    }
  } catch (err) {
    console.error("Failed to load project for edit:", err);
    notFound();
  }

  if (!projectData) {
    notFound();
  }

  return (
    <div className="py-2">
      <ProjectForm initialData={projectData} isEdit={true} projectId={id} />
    </div>
  );
}
