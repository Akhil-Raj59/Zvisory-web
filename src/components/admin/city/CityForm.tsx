"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export interface CityFormData {
  _id?: string;
  name?: string;
  slug?: string;
  state?: string;
  country?: string;
  image?: string;
  coverImage?: string;
  startingPrice?: string;
  shortDescription?: string;
  description?: string;
  highlights?: string[];
  localities?: string[];
  gallery?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;
}

interface CityFormProps {
  initialData?: CityFormData;
  isEdit?: boolean;
}

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export function CityForm({ initialData, isEdit = false }: CityFormProps) {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "media" | "seo" | "status">("basic");

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [stateName, setStateName] = useState(initialData?.state || "");
  const [country, setCountry] = useState(initialData?.country || "India");
  const [startingPrice, setStartingPrice] = useState(initialData?.startingPrice || "₹1.5 Cr*");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");

  // Highlights & Localities (chips)
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights || []);
  const [highlightInput, setHighlightInput] = useState("");

  const [localities, setLocalities] = useState<string[]>(initialData?.localities || []);
  const [localityInput, setLocalityInput] = useState("");

  // Media
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || initialData?.image || "");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [galleryInput, setGalleryInput] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || "");
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seo?.keywords || "");
  const [seoOgImage, setSeoOgImage] = useState(initialData?.seo?.ogImage || "");

  // Status & Settings
  const [status, setStatus] = useState<"draft" | "published" | "archived">(initialData?.status || "published");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);

  // UI state
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-slug generation when typing name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
    if (!seoTitle) {
      setSeoTitle(`Luxury Properties & Real Estate in ${val} | Zvisory`);
    }
  };

  // Highlights chip add/remove
  const addHighlight = () => {
    const val = highlightInput.trim();
    if (val && !highlights.includes(val)) {
      setHighlights([...highlights, val]);
      setHighlightInput("");
    }
  };
  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Localities chip add/remove
  const addLocality = () => {
    const val = localityInput.trim();
    if (val && !localities.includes(val)) {
      setLocalities([...localities, val]);
      setLocalityInput("");
    }
  };
  const removeLocality = (index: number) => {
    setLocalities(localities.filter((_, i) => i !== index));
  };

  // Gallery add/remove
  const addGalleryUrl = () => {
    const val = galleryInput.trim();
    if (val && !gallery.includes(val)) {
      setGallery([...gallery, val]);
      setGalleryInput("");
    }
  };
  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  // Cloudinary File Upload Handler
  const handleFileUpload = async (file: File, isGallery = false) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      alert("Invalid file format. Allowed: JPG, PNG, WEBP, SVG");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (isGallery) setUploadingGallery(true);
    else setUploadingCover(true);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Upload failed");
      }

      if (isGallery) {
        setGallery((prev) => [...prev, json.data.url]);
      } else {
        setCoverImage(json.data.url);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (isGallery) setUploadingGallery(false);
      else setUploadingCover(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (!name.trim()) throw new Error("City Name is required.");
      const cleanSlug = (slug || slugify(name)).trim().toLowerCase();
      if (!cleanSlug) throw new Error("City Slug is required.");

      const payload = {
        name: name.trim(),
        slug: cleanSlug,
        state: stateName.trim(),
        country: country.trim(),
        image: coverImage.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        startingPrice: startingPrice.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        highlights,
        localities,
        gallery,
        seo: {
          title: seoTitle.trim() || `Luxury Properties in ${name.trim()} | Zvisory`,
          description: seoDescription.trim() || shortDescription.trim() || `Explore luxury real estate projects in ${name.trim()}`,
          keywords: seoKeywords.trim(),
          ogTitle: seoTitle.trim() || `Luxury Properties in ${name.trim()} | Zvisory`,
          ogDescription: seoDescription.trim() || shortDescription.trim(),
          ogImage: seoOgImage.trim() || coverImage.trim() || undefined,
        },
        status,
        isFeatured,
      };

      const url = isEdit && initialData?._id
        ? `/api/admin/cities/${initialData._id}`
        : "/api/admin/cities";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save city");
      }

      setSuccessMsg(isEdit ? "City updated successfully!" : "City created successfully!");

      setTimeout(() => {
        router.push("/admin/cities");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/cities"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            >
              ← Back to Cities
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {isEdit ? "Edit City" : "New City"}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
            {isEdit ? `Edit "${name || "City"}"` : "Create New City"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cities"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create City"
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-sm text-rose-700 dark:text-rose-300 flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-sm text-emerald-700 dark:text-emerald-300">
          ✅ {successMsg}
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: "basic", label: "1. Basic Details" },
          { id: "content", label: "2. Content & Localities" },
          { id: "media", label: "3. Cover & Gallery" },
          { id: "seo", label: "4. SEO & Social" },
          { id: "status", label: "5. Status & Visibility" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC DETAILS */}
      {activeTab === "basic" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            City Identification & Region
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                City Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Gurugram, Bengaluru, Mumbai"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-zinc-400">Canonical name matching projects in the database.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setIsSlugManuallyEdited(true);
                }}
                placeholder="e.g. gurugram"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-zinc-400">
                Used in public URL: <span className="font-mono text-zinc-600 dark:text-zinc-300">/cities/{slug || "slug"}</span>
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                State / Province
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Haryana, Karnataka, Maharashtra"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Indicative Starting Price
              </label>
              <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. ₹1.5 Cr*, ₹85 Lacs*"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-zinc-400">Displayed on city cards on the homepage.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT & LOCALITIES */}
      {activeTab === "content" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Descriptions, Highlights & Localities
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Short Description
                </label>
                <span className="text-[10px] text-zinc-400">{shortDescription.length}/250 chars</span>
              </div>
              <textarea
                rows={2}
                maxLength={250}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary shown on homepage cards and search results..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Detailed City Overview
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="In-depth profile covering real estate investment prospects, infrastructure, key corridors, and luxury lifestyle..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Highlights Chips */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                City Highlights & Corridors
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                  placeholder="e.g. Golf Course Extension Road, Rapid Metro Connectivity"
                  className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                >
                  Add +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeHighlight(i)}
                      className="text-emerald-600 hover:text-emerald-900 text-sm font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Localities Chips */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Key Localities / Sectors
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localityInput}
                  onChange={(e) => setLocalityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocality();
                    }
                  }}
                  placeholder="e.g. Sector 54, Cyber City, Whitefield, Indiranagar"
                  className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={addLocality}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                >
                  Add +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {localities.map((loc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => removeLocality(i)}
                      className="text-sky-600 hover:text-sky-900 text-sm font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA (COVER & GALLERY) */}
      {activeTab === "media" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Media & City Imagery
          </h2>

          {/* Cover Image Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              City Cover Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {coverImage && (
                <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-lg text-xs"
                    title="Remove Cover Image"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Paste image URL directly (e.g. https://...)"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                    <span>📁 Upload to Cloudinary</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, false);
                      }}
                      disabled={uploadingCover}
                    />
                  </label>
                  {uploadingCover && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      Uploading cover image...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Supported formats: JPG, PNG, WEBP, SVG. Maximum file size: 10MB.
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Images Section */}
          <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              City Gallery Images
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGalleryUrl();
                  }
                }}
                placeholder="Paste additional gallery image URL..."
                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                Add URL +
              </button>
              <label className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700">
                <span>📁 Upload Image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, true);
                  }}
                  disabled={uploadingGallery}
                />
              </label>
            </div>

            {uploadingGallery && (
              <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                Uploading gallery asset...
              </p>
            )}

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {gallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative h-28 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 group"
                  >
                    <Image src={imgUrl} alt={`Gallery ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-md text-xs transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SEO & SOCIAL METADATA */}
      {activeTab === "seo" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            SEO & Open Graph Metadata
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`Luxury Real Estate & Properties in ${name || "City"} | Zvisory`}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description for search engine indexing..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="luxury apartments, villas, penthouses, real estate investments"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Open Graph Social Share Image URL
              </label>
              <input
                type="text"
                value={seoOgImage}
                onChange={(e) => setSeoOgImage(e.target.value)}
                placeholder={coverImage || "https://..."}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STATUS & VISIBILITY */}
      {activeTab === "status" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800">
            Publishing Status & Homepage Visibility
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                City Publication State <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "published", label: "Published", desc: "Visible on public website and city pages" },
                  { id: "draft", label: "Draft", desc: "Internal only, hidden from public pages" },
                  { id: "archived", label: "Archived", desc: "Hidden and marked inactive" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id as any)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      status === s.id
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    <div className="font-bold text-xs capitalize text-zinc-900 dark:text-zinc-100">
                      {s.label}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Feature on Homepage
                  </span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    When enabled, this city will appear in the &quot;Properties by Prime Cities&quot; carousel on the homepage.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Ensure all required fields are filled before submitting.
        </span>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create City"}
        </button>
      </div>
    </form>
  );
}
