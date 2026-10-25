import { redirect } from "next/navigation";

/**
 * Legacy /dashboard/admin route — redirects permanently to the real admin panel.
 * The actual admin UI lives at /admin/dashboard.
 */
export default function OldAdminDashboardRedirect() {
  redirect("/admin/dashboard");
}
