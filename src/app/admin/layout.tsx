import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser, isAdminRole } from "@/lib/auth";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard | Zvisory",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Only ADMIN role may access the admin area
  if (!user) {
    redirect("/login?from=admin");
  }

  if (!isAdminRole(user.role)) {
    // Authenticated but wrong role — show unauthorized page
    redirect("/unauthorized");
  }

  return (
    <AuthProvider initialUser={user}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="font-bold text-lg tracking-tight">
                Zvisory Admin
              </Link>
              <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <Link
                  href="/admin/dashboard"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/health-check"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  API Health
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium leading-none">{user.fullName}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {user.role}
                  </span>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
