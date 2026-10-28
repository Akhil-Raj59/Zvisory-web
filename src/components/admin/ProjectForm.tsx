"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  initialData?: any;
  isEdit?: boolean;
  projectId?: string;
}

export function ProjectForm({ initialData, isEdit = false, projectId }: Props) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "basic" | "location" | "pricing" | "status" | "media" | "details" | "seo"
  >("basic");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [keywords, setKeywords] = useState<string>(
    initialData?.keywords?.join(", ") || ""
  );
  const [developer, setDeveloper] = useState(initialData?.developer || "");
  const [city, setCity] = useState(initialData?.city || "Gurugram");
  const [cityList, setCityList] = useState<Array<{ name: string; slug: string; state?: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadCities() {
      setLoadingCities(true);
      setCityError(null);
      try {
        const res = await fetch("/api/admin/reference-data");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.registeredCities && Array.isArray(json.data.registeredCities)) {
            setCityList(json.data.registeredCities);
          } else if (json.data.cities && Array.isArray(json.data.cities)) {
            setCityList(
              json.data.cities.map((cName: string) => ({
                name: cName,
                slug: cName.toLowerCase().replace(/\s+/g, "-"),
              }))
            );
          }
        }
      } catch (err: unknown) {
        setCityError("Failed to load registered cities from server.");
      } finally {
        setLoadingCities(false);
      }
    }
    loadCities();
  }, []);

  const isCityMismatch =
    Boolean(city.trim()) &&
    cityList.length > 0 &&
    !cityList.some((c) => c.name.toLowerCase() === city.trim().toLowerCase());

  const filteredCities = cityList.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      (c.state && c.state.toLowerCase().includes(citySearchQuery.toLowerCase()))
  );
  const [microMarket, setMicroMarket] = useState(initialData?.microMarket || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [categories, setCategories] = useState<string>(
    initialData?.categories?.join(", ") || "Luxury"
  );
  const [propertyType, setPropertyType] = useState(
    initialData?.propertyType || "Apartments"
  );
  const [startingPrice, setStartingPrice] = useState(
    initialData?.startingPrice || "Price On Request"
  );
  const [priceNumeric, setPriceNumeric] = useState<string>(
    initialData?.priceNumeric ? String(initialData.priceNumeric) : ""
  );
  const [unitConfigurations, setUnitConfigurations] = useState<string>(
    initialData?.unitConfigurations?.join(", ") || "3 BHK, 4 BHK"
  );
  const [unitSizes, setUnitSizes] = useState(initialData?.unitSizes || "");
  const [landArea, setLandArea] = useState(initialData?.landArea || "");
  const [totalUnits, setTotalUnits] = useState(initialData?.totalUnits || "");
  const [elevation, setElevation] = useState(initialData?.elevation || "");
  const [launchStatus, setLaunchStatus] = useState(
    initialData?.launchStatus || "Under Construction"
  );
  const [possessionText, setPossessionText] = useState(
    initialData?.possessionText || ""
  );
  const [paymentPlan, setPaymentPlan] = useState(
    initialData?.paymentPlan || "Construction Linked Plan"
  );
  const [reraNumber, setReraNumber] = useState(initialData?.reraNumber || "");
  const [cardBanner, setCardBanner] = useState(initialData?.cardBanner || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    initialData?.status || "published"
  );
  const [featured, setFeatured] = useState<boolean>(
    initialData?.featured || false
  );
  const [isOnHomeCarousel, setIsOnHomeCarousel] = useState<boolean>(
    initialData?.isOnHomeCarousel || false
  );
  const [isFlagshipProject, setIsFlagshipProject] = useState<boolean>(
    initialData?.isFlagshipProject || false
  );

  // SEO & Analytics
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo?.description || ""
  );
  const [seoOgImage, setSeoOgImage] = useState(initialData?.seo?.ogImage || "");
  const [gtagId, setGtagId] = useState(initialData?.gtag?.gtagId || "");
  const [gtagSendTo, setGtagSendTo] = useState(initialData?.gtag?.gtagSendTo || "");

  // Project Details State
  const d = initialData?.details || {};
  const [overviewHeading, setOverviewHeading] = useState(
    d.overview?.heading || "Project Overview"
  );
  const [overviewTitle, setOverviewTitle] = useState(
    d.overview?.title || initialData?.title || ""
  );
  const [overviewDescription, setOverviewDescription] = useState(
    d.overview?.description || ""
  );
  const [overviewImages, setOverviewImages] = useState<string>(
    d.overview?.images?.join("\n") || ""
  );

  const [galleryImages, setGalleryImages] = useState<string>(
    d.gallery?.images?.join("\n") || ""
  );
  const [galleryTitle, setGalleryTitle] = useState(
    d.gallery?.title || "Photos & Media"
  );
  const [galleryDesc, setGalleryDesc] = useState(d.gallery?.description || "");

  // Amenities list
  const [amenities, setAmenities] = useState<Array<{ name: string; image?: string }>>(
    d.amenities?.items || [
      { name: "Swimming Pool" },
      { name: "Gymnasium" },
      { name: "Clubhouse" },
      { name: "24x7 Security" },
    ]
  );

  // Floor plans list
  const [floorPlans, setFloorPlans] = useState<
    Array<{ name: string; value: string; basePrice?: string }>
  >(
    d.floorPlans?.plans || [
      { name: "3 BHK Luxury", value: "2150 Sq. Ft.", basePrice: "₹4.85 Cr*" },
      { name: "4 BHK Ultra", value: "3250 Sq. Ft.", basePrice: "₹7.20 Cr*" },
    ]
  );

  // FAQs list
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    d.faqs || [
      { question: "What is the location of this project?", answer: "Located in prime sector with seamless expressway connectivity." },
      { question: "What is the possession date?", answer: "Possession is scheduled as per RERA guidelines." }
    ]
  );

  // Documents
  const [documents, setDocuments] = useState<
    Array<{ name: string; type: string; url: string }>
  >(
    d.documents || [
      { name: "Project Brochure", type: "PDF", url: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf" }
    ]
  );

  // Contact
  const [contactMapUrl, setContactMapUrl] = useState(
    d.contact?.locationMapUrl || ""
  );

  // Auto slugify helper
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit && (!slug || slug.startsWith("project-"))) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-")
      );
    }
  };

  // Cloudinary direct file uploader
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Upload failed");
      }

      onSuccess(json.data.url);
      setSuccessMsg("File uploaded successfully to Cloudinary!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Validate essentials
      if (!title.trim()) throw new Error("Project Title is required.");
      if (!slug.trim()) throw new Error("Project Slug is required.");
      if (!developer.trim()) throw new Error("Developer is required.");
      if (!city.trim()) throw new Error("City is required.");

      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        keywords: keywords.split(",").map((s) => s.trim()).filter(Boolean),
        developer: developer.trim(),
        city: city.trim(),
        microMarket: microMarket.trim(),
        location: location.trim() || `${microMarket}, ${city}`,
        categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
        propertyType: propertyType.trim(),
        startingPrice: startingPrice.trim(),
        priceNumeric: priceNumeric ? Number(priceNumeric) : null,
        unitConfigurations: unitConfigurations.split(",").map((s) => s.trim()).filter(Boolean),
        unitSizes: unitSizes.trim(),
        landArea: landArea.trim(),
        totalUnits: totalUnits.trim(),
        elevation: elevation.trim(),
        launchStatus: launchStatus.trim(),
        possessionText: possessionText.trim(),
        paymentPlan: paymentPlan.trim(),
        reraNumber: reraNumber.trim(),
        cardBanner: cardBanner.trim(),
        bannerUrl: bannerUrl.trim() || cardBanner.trim(),
        shortDescription: shortDescription.trim() || overviewDescription.slice(0, 190),
        status,
        featured,
        isOnHomeCarousel,
        isFlagshipProject,
        seo: {
          title: seoTitle.trim() || `${title.trim()} | Zvisory`,
          description: seoDescription.trim() || shortDescription.trim(),
          ogTitle: seoTitle.trim() || `${title.trim()} | Zvisory`,
          ogDescription: seoDescription.trim() || shortDescription.trim(),
          ogImage: seoOgImage.trim() || cardBanner.trim(),
        },
        gtag: {
          gtagId: gtagId.trim(),
          gtagSendTo: gtagSendTo.trim(),
        },
        projectDetails: {
          overview: {
            heading: overviewHeading.trim(),
            title: overviewTitle.trim() || title.trim(),
            description: overviewDescription.trim(),
            images: overviewImages.split("\n").map((s) => s.trim()).filter(Boolean),
          },
          amenities: {
            heading: "Amenities",
            title: "Designed to meet the highest criteria",
            items: amenities.filter((a) => a.name.trim()),
          },
          floorPlans: {
            heading: "Floor Plans",
            title: "Sophisticated and Spacious",
            plans: floorPlans.filter((p) => p.name.trim()),
          },
          gallery: {
            heading: "Gallery",
            title: galleryTitle.trim(),
            description: galleryDesc.trim(),
            images: galleryImages.split("\n").map((s) => s.trim()).filter(Boolean),
          },
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
          documents: documents.filter((doc) => doc.url.trim()),
          contact: {
            heading: "Contact Us",
            title: "Schedule a Visit",
            locationMapUrl: contactMapUrl.trim(),
            phone: "+91 99999 99999",
            email: "contactus@zvisory.com",
          },
        },
      };

      const url = isEdit ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save project");
      }

      setSuccessMsg(
        isEdit
          ? "Project updated successfully!"
          : "Project created successfully! Redirecting..."
      );

      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "basic", label: "1. Basic Info" },
    { key: "location", label: "2. Location & Developer" },
    { key: "pricing", label: "3. Pricing & Units" },
    { key: "status", label: "4. Status & Publication" },
    { key: "media", label: "5. Media & Gallery" },
    { key: "details", label: "6. Details & Sections" },
    { key: "seo", label: "7. SEO & Tracking" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-1 inline-block"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEdit ? `Edit: ${initialData?.title || "Project"}` : "Create New Project"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Project" : "Create Project"}</span>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-medium">
          ✕ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
          ✓ {successMsg}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-zinc-800 pb-2 overflow-x-auto text-xs font-semibold">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Basic Information */}
      {activeTab === "basic" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Basic Project Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Conscient Hines Elevate"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                SEO Slug <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">/properties/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                  placeholder="e.g. conscient-hines-elevate"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Apartments">Apartments</option>
                <option value="High Rise">High Rise</option>
                <option value="Low Rise">Low Rise</option>
                <option value="Plots">Plots</option>
                <option value="Commercial">Commercial</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villas">Villas</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Categories (comma separated)
              </label>
              <input
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="e.g. Luxury, Ultra Luxury, Residential"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. luxury-apartment-gurgaon, 3bhk-4bhk-elevate"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Short Description (Listing card snippet)
              </label>
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary displayed on project cards and search listings..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Location & Developer */}
      {activeTab === "location" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Location & Developer Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Developer / Builder <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="e.g. Conscient Hines"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  City <span className="text-rose-500">*</span>
                </label>
                <Link
                  href="/admin/cities/new"
                  target="_blank"
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  + Add New City
                </Link>
              </div>

              {/* City Selection Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-left text-sm flex items-center justify-between bg-white dark:bg-zinc-900 ${
                    isCityMismatch
                      ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-300"
                      : "border-slate-200 dark:border-zinc-800"
                  } focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                >
                  <span className={city ? "text-slate-900 dark:text-zinc-100 font-medium" : "text-slate-400"}>
                    {city || "-- Select Registered City --"}
                  </span>
                  <span className="text-xs text-slate-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isCityDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 space-y-2 max-h-64 overflow-hidden flex flex-col">
                    <input
                      type="text"
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      placeholder="Type to filter cities..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                      autoFocus
                    />

                    {loadingCities ? (
                      <div className="p-3 text-center text-xs text-slate-500">Loading cities...</div>
                    ) : cityError ? (
                      <div className="p-3 text-center text-xs text-rose-500">{cityError}</div>
                    ) : (
                      <div className="overflow-y-auto max-h-44 space-y-0.5">
                        {filteredCities.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setCity(c.name);
                              setIsCityDropdownOpen(false);
                              setCitySearchQuery("");
                            }}
                            className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors ${
                              c.name.toLowerCase() === city.toLowerCase()
                                ? "bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-800 dark:text-emerald-300"
                                : "text-slate-700 dark:text-zinc-300"
                            }`}
                          >
                            <span>{c.name}</span>
                            {c.state && <span className="text-[10px] text-slate-400">{c.state}</span>}
                          </button>
                        ))}

                        {filteredCities.length === 0 && (
                          <div className="p-3 text-center text-xs text-slate-500 space-y-1">
                            <p>No matching city found.</p>
                            <Link
                              href="/admin/cities/new"
                              target="_blank"
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline block"
                            >
                              + Register new city in City Management →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-1 border-t border-slate-100 dark:border-zinc-800 text-center">
                      <Link
                        href="/admin/cities"
                        target="_blank"
                        className="text-[11px] text-slate-500 hover:text-emerald-600 underline"
                      >
                        Open City Management ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mismatch Warning Alert */}
              {isCityMismatch && (
                <div className="mt-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span>⚠️</span> Unmatched Legacy Value: &quot;{city}&quot;
                  </div>
                  <p>
                    This project&apos;s city string does not match any registered City. Select a registered city above, or register this city in City Management.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Micro-Market / Sector
              </label>
              <input
                type="text"
                value={microMarket}
                onChange={(e) => setMicroMarket(e.target.value)}
                placeholder="e.g. Sector 59, Golf Course Road"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Display Location / Full Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector 59, Golf Course Extension Road, Gurugram"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                RERA Registration Number
              </label>
              <input
                type="text"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                placeholder="e.g. RC/REP/HARERA/GGM/914/646/2025/17"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pricing & Inventory */}
      {activeTab === "pricing" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Pricing, Unit Typology &amp; Sizes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Starting Price Display
              </label>
              <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. ₹4.85 Cr* or Price On Request"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Numeric Price in INR (for filters/sorting)
              </label>
              <input
                type="number"
                value={priceNumeric}
                onChange={(e) => setPriceNumeric(e.target.value)}
                placeholder="e.g. 48500000 (leave empty if on request)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Unit Configurations (comma separated)
              </label>
              <input
                type="text"
                value={unitConfigurations}
                onChange={(e) => setUnitConfigurations(e.target.value)}
                placeholder="e.g. 2 BHK, 3 BHK, 4 BHK"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Unit Sizes
              </label>
              <input
                type="text"
                value={unitSizes}
                onChange={(e) => setUnitSizes(e.target.value)}
                placeholder="e.g. 2145 - 5947 sq. ft."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Land Parcel / Area
              </label>
              <input
                type="text"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="e.g. 7.75 Acres"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Total Units
              </label>
              <input
                type="text"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
                placeholder="e.g. 556 Units"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Elevation / Tower Height
              </label>
              <input
                type="text"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                placeholder="e.g. Stilt + 32 Floors"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Payment Plan
              </label>
              <input
                type="text"
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value)}
                placeholder="e.g. Construction Linked Plan / 30:70"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Status & Publication */}
      {activeTab === "status" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Status, Construction &amp; Publication Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Publication Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold"
              >
                <option value="published">Published (Visible on Website)</option>
                <option value="draft">Draft (Hidden from Public)</option>
                <option value="archived">Archived (Delisted)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Construction / Launch Status
              </label>
              <select
                value={launchStatus}
                onChange={(e) => setLaunchStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              >
                <option value="Pre Launch">Pre Launch</option>
                <option value="New Launch">New Launch</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Ready To Move-In">Ready To Move-In (New)</option>
                <option value="Ready To Move-In (Resale)">Ready To Move-In (Resale)</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Possession Description / Date
              </label>
              <input
                type="text"
                value={possessionText}
                onChange={(e) => setPossessionText(e.target.value)}
                placeholder="e.g. Ready To Move-In or December 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            {/* Checkbox Flags */}
            <div className="sm:col-span-2 space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  Featured Project (highlighted on homepage and top of search)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOnHomeCarousel}
                  onChange={(e) => setIsOnHomeCarousel(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  Show on Homepage Hero Carousel
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlagshipProject}
                  onChange={(e) => setIsFlagshipProject(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  Flagship Development of the Month
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Media & Gallery */}
      {activeTab === "media" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Media Management &amp; Gallery
          </h2>

          <div className="space-y-6">
            {/* Card Banner Image */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Card Thumbnail Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cardBanner}
                  onChange={(e) => setCardBanner(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
                />
                <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0">
                  {uploadingField === "cardBanner" ? "Uploading..." : "Upload File"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, "cardBanner", (url) => setCardBanner(url))
                    }
                  />
                </label>
              </div>
              {cardBanner && (
                <div className="relative h-28 w-44 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cardBanner} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Hero Banner URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Detail Page Hero Banner Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
                />
                <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0">
                  {uploadingField === "bannerUrl" ? "Uploading..." : "Upload File"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, "bannerUrl", (url) => setBannerUrl(url))
                    }
                  />
                </label>
              </div>
              {bannerUrl && (
                <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerUrl} alt="Hero Banner Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Gallery Photos (one URL per line)
                </label>
                <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                  + Upload to Gallery
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, "gallery", (url) => {
                        setGalleryImages((prev) => (prev ? `${prev}\n${url}` : url));
                      })
                    }
                  />
                </label>
              </div>
              <textarea
                rows={5}
                value={galleryImages}
                onChange={(e) => setGalleryImages(e.target.value)}
                placeholder="https://res.cloudinary.com/.../img1.jpg&#10;https://res.cloudinary.com/.../img2.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400">
                Enter each image URL on a new line or use the Upload button to upload directly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Details & Sections */}
      {activeTab === "details" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Project Overview, Amenities, Floor Plans &amp; FAQs
          </h2>

          {/* Overview Section */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Overview Section
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Overview Heading (e.g. Project Overview)"
                value={overviewHeading}
                onChange={(e) => setOverviewHeading(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
              <input
                type="text"
                placeholder="Overview Subtitle / Name"
                value={overviewTitle}
                onChange={(e) => setOverviewTitle(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Detailed Overview description text..."
              value={overviewDescription}
              onChange={(e) => setOverviewDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
            />
          </div>

          {/* Amenities Editor */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Amenities ({amenities.length})
              </h3>
              <button
                type="button"
                onClick={() => setAmenities([...amenities, { name: "" }])}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + Add Amenity
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...amenities];
                      updated[idx].name = e.target.value;
                      setAmenities(updated);
                    }}
                    placeholder={`Amenity #${idx + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setAmenities(amenities.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plans Editor */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Floor Plans ({floorPlans.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setFloorPlans([...floorPlans, { name: "", value: "", basePrice: "" }])
                }
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + Add Floor Plan
              </button>
            </div>
            <div className="space-y-2">
              {floorPlans.map((fp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fp.name}
                    onChange={(e) => {
                      const updated = [...floorPlans];
                      updated[idx].name = e.target.value;
                      setFloorPlans(updated);
                    }}
                    placeholder="Plan Name (e.g. 3 BHK Unit)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <input
                    type="text"
                    value={fp.value}
                    onChange={(e) => {
                      const updated = [...floorPlans];
                      updated[idx].value = e.target.value;
                      setFloorPlans(updated);
                    }}
                    placeholder="Area (e.g. 2150 Sq. Ft.)"
                    className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <input
                    type="text"
                    value={fp.basePrice || ""}
                    onChange={(e) => {
                      const updated = [...floorPlans];
                      updated[idx].basePrice = e.target.value;
                      setFloorPlans(updated);
                    }}
                    placeholder="Price (e.g. ₹4.85 Cr)"
                    className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setFloorPlans(floorPlans.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Editor */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Frequently Asked Questions ({faqs.length})
              </h3>
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 text-xs"
                  >
                    ✕ Remove
                  </button>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].question = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Question (e.g. What is the possession date?)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Answer..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Documents & Brochure */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Documents &amp; PDF Brochures
              </h3>
              <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                + Upload PDF Document
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload(e, "doc", (url) => {
                      setDocuments([
                        ...documents,
                        { name: "Project Brochure", type: "PDF", url },
                      ]);
                    })
                  }
                />
              </label>
            </div>
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => {
                      const updated = [...documents];
                      updated[idx].name = e.target.value;
                      setDocuments(updated);
                    }}
                    placeholder="Document Name (e.g. Official Brochure)"
                    className="w-48 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <input
                    type="text"
                    value={doc.url}
                    onChange={(e) => {
                      const updated = [...documents];
                      updated[idx].url = e.target.value;
                      setDocuments(updated);
                    }}
                    placeholder="Document URL (https://...)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Interactive Google Maps Embed URL
            </h3>
            <input
              type="text"
              value={contactMapUrl}
              onChange={(e) => setContactMapUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400">
              Paste the iframe source URL generated from Google Maps Embed.
            </p>
          </div>
        </div>
      )}

      {/* Tab 7: SEO & Tracking */}
      {activeTab === "seo" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Search Engine Optimization &amp; Google Tag Tracking
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g. Conscient Hines Elevate, 3 & 4 BHK apartments in Sector 59, Gurgaon"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Compelling meta description for Google search results snippet..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                OpenGraph Share Image URL
              </label>
              <input
                type="text"
                value={seoOgImage}
                onChange={(e) => setSeoOgImage(e.target.value)}
                placeholder="https://... image shown when shared on WhatsApp, LinkedIn, Twitter"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Google Tag ID (gtag_id)
                </label>
                <input
                  type="text"
                  value={gtagId}
                  onChange={(e) => setGtagId(e.target.value)}
                  placeholder="e.g. AW-123456789 or G-XXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Google Ads Send To (gtag_send_to)
                </label>
                <input
                  type="text"
                  value={gtagSendTo}
                  onChange={(e) => setGtagSendTo(e.target.value)}
                  placeholder="e.g. AW-123456789/conversion_label"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <Link
          href="/admin/projects"
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
        >
          {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
