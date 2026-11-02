"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DeveloperFormData {
  name: string;
  slug: string;
  logo: string;
  shortDescription: string;
  description: string;
  website: string;
  headquarters: string;
  status: "draft" | "published" | "archived";
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
}

interface DeveloperFormProps {
  mode: "create" | "edit";
  initialData?: Partial<DeveloperFormData> & { _id?: string };
}

const EMPTY_FORM: DeveloperFormData = {
  name: "",
  slug: "",
  logo: "",
  shortDescription: "",
  description: "",
  website: "",
  headquarters: "",
  status: "published",
  seo: {
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  },
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function DeveloperForm({ mode, initialData }: DeveloperFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<DeveloperFormData>(() => ({
    ...EMPTY_FORM,
    ...initialData,
    seo: { ...EMPTY_FORM.seo, ...(initialData?.seo || {}) },
  }));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [activeTab, setActiveTab] = useState<"basic" | "seo">("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugTouched && form.name) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }));
    }
  }, [form.name, slugTouched]);

  const set = (key: keyof DeveloperFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const setSeo = (key: keyof DeveloperFormData["seo"], value: string) => {
    setForm((f) => ({ ...f, seo: { ...f.seo, [key]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { ...form };

    try {
      const url = mode === "create" ? "/api/admin/developers" : `/api/admin/developers/${initialData?._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save developer");
      }

      setSuccessMsg(
        mode === "create"
          ? `Developer "${json.data?.name}" created successfully!`
          : `Developer "${json.data?.name}" updated successfully!`
      );

      if (mode === "create") {
        setTimeout(() => {
          router.push(`/admin/developers/${json.data?._id}`);
        }, 1200);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
          ⚠️ {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
        {(["basic", "seo"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab === "seo" ? "SEO" : "Basic Info"}
          </button>
        ))}
      </div>

      {activeTab === "basic" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Fields */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Developer Profile
              </h2>

              {/* Name */}
              <div>
                <label className={labelClass}>Developer Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. DLF Limited"
                  required
                  className={inputClass}
                />
              </div>

              {/* Slug */}
              <div>
                <label className={labelClass}>Slug (URL) <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }}
                  placeholder="e.g. dlf-limited"
                  required
                  className={`${inputClass} font-mono`}
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Auto-generated from name. Lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              {/* Short Description */}
              <div>
                <label className={labelClass}>Short Description</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  placeholder="Brief one-liner about the developer (max 300 chars)"
                  maxLength={300}
                  className={inputClass}
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  {form.shortDescription.length}/300 characters
                </p>
              </div>

              {/* Full Description */}
              <div>
                <label className={labelClass}>Full Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Detailed developer profile, history, and specializations..."
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            {/* Contact & Web */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Contact & Web
              </h2>

              <div>
                <label className={labelClass}>Website URL</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://www.dlf.in"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Headquarters / Location</label>
                <input
                  type="text"
                  value={form.headquarters}
                  onChange={(e) => set("headquarters", e.target.value)}
                  placeholder="e.g. Gurugram, Haryana"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Status */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Publish Settings
              </h2>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as "draft" | "published" | "archived")}
                  className={inputClass}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Logo / Image
              </h2>

              <div>
                <label className={labelClass}>Logo URL</label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={(e) => set("logo", e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {form.logo && (
                <div className="relative w-full h-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logo}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading
                ? mode === "create" ? "Creating..." : "Saving..."
                : mode === "create" ? "Create Developer" : "Save Changes"}
            </button>

            {mode === "edit" && (
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            SEO & Open Graph
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SEO Title</label>
              <input type="text" value={form.seo.title} onChange={(e) => setSeo("title", e.target.value)} className={inputClass} placeholder="SEO page title" />
            </div>
            <div>
              <label className={labelClass}>SEO Keywords</label>
              <input type="text" value={form.seo.keywords} onChange={(e) => setSeo("keywords", e.target.value)} className={inputClass} placeholder="keyword1, keyword2" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>SEO Description</label>
              <textarea value={form.seo.description} onChange={(e) => setSeo("description", e.target.value)} rows={3} className={`${inputClass} resize-y`} placeholder="Meta description (150-160 chars)" />
            </div>
            <div>
              <label className={labelClass}>OG Title</label>
              <input type="text" value={form.seo.ogTitle} onChange={(e) => setSeo("ogTitle", e.target.value)} className={inputClass} placeholder="Open Graph title" />
            </div>
            <div>
              <label className={labelClass}>OG Image URL</label>
              <input type="url" value={form.seo.ogImage} onChange={(e) => setSeo("ogImage", e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>OG Description</label>
              <textarea value={form.seo.ogDescription} onChange={(e) => setSeo("ogDescription", e.target.value)} rows={3} className={`${inputClass} resize-y`} placeholder="Open Graph description" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
