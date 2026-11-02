import { Metadata } from "next";
import Link from "next/link";
import { DeveloperForm } from "@/components/admin/developer/DeveloperForm";

export const metadata: Metadata = {
  title: "Create Developer | Zvisory Admin",
};

export default function NewDeveloperPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Link href="/admin/developers" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              Developers
            </Link>
            <span>/</span>
            <span>New</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create Developer</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Add a new real estate developer to the platform.
          </p>
        </div>
        <Link
          href="/admin/developers"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          ← Back to Developers
        </Link>
      </div>

      <DeveloperForm mode="create" />
    </div>
  );
}
