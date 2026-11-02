"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeveloperForm } from "@/components/admin/developer/DeveloperForm";

export default function EditDeveloperPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeveloper() {
      try {
        const res = await fetch(`/api/admin/developers/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Developer not found");
        setDeveloper(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load developer");
      } finally {
        setLoading(false);
      }
    }
    loadDeveloper();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="p-8 text-center text-sm text-rose-600 space-y-3">
        <p>⚠️ {error || "Developer not found"}</p>
        <button onClick={() => router.push("/admin/developers")} className="px-4 py-2 rounded-xl text-xs bg-zinc-100 hover:bg-zinc-200">
          ← Back to Developers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Link href="/admin/developers" className="hover:text-zinc-700 transition-colors">Developers</Link>
            <span>/</span>
            <Link href={`/admin/developers/${id}`} className="hover:text-zinc-700 transition-colors">{developer.name}</Link>
            <span>/</span>
            <span>Edit</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Developer</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Editing: {developer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/developers/${id}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
          >
            ← Back to Details
          </Link>
        </div>
      </div>

      <DeveloperForm mode="edit" initialData={developer} />
    </div>
  );
}
