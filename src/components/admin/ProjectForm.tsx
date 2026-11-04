"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  initialData?: any;
  isEdit?: boolean;
  projectId?: string;
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

export function ProjectForm({ initialData, isEdit = false, projectId }: Props) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "basic" | "location" | "pricing" | "status" | "media" | "details" | "seo"
  >("basic");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // -------------------------------------------------------------
  // TAB 1: BASIC INFO
  // -------------------------------------------------------------
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(isEdit || initialData?.slug));
  const [keywords, setKeywords] = useState<string>(initialData?.keywords?.join(", ") || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string>(
    initialData?.secondaryKeywords?.join(", ") || ""
  );
  const [categories, setCategories] = useState<string>(
    initialData?.categories?.join(", ") || "Luxury"
  );
  const [propertyType, setPropertyType] = useState(initialData?.propertyType || "Apartments");

  // -------------------------------------------------------------
  // TAB 2: LOCATION & DEVELOPER
  // -------------------------------------------------------------
  const [developer, setDeveloper] = useState(initialData?.developer || "");
  const [developerList, setDeveloperList] = useState<Array<{ name: string; slug: string; headquarters?: string; logo?: string }>>([]);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);
  const [developerError, setDeveloperError] = useState<string | null>(null);
  const [developerSearchQuery, setDeveloperSearchQuery] = useState("");
  const [isDeveloperDropdownOpen, setIsDeveloperDropdownOpen] = useState(false);

  const [city, setCity] = useState(initialData?.city || "Gurugram");
  const [cityList, setCityList] = useState<Array<{ name: string; slug: string; state?: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [microMarket, setMicroMarket] = useState(initialData?.microMarket || "");
  const [location, setLocation] = useState(initialData?.location || "");

  // Load Reference Data (Cities & Developers)
  useEffect(() => {
    async function loadReferenceData() {
      setLoadingCities(true);
      setLoadingDevelopers(true);
      setCityError(null);
      setDeveloperError(null);

      try {
        const res = await fetch("/api/admin/reference-data");
        const json = await res.json();
        if (json.success && json.data) {
          // Process Cities
          if (json.data.registeredCities && Array.isArray(json.data.registeredCities)) {
            setCityList(json.data.registeredCities);
          } else if (json.data.cities && Array.isArray(json.data.cities)) {
            setCityList(
              json.data.cities.map((cName: string) => ({
                name: cName,
                slug: slugify(cName),
              }))
            );
          }

          // Process Developers
          if (json.data.registeredDevelopers && Array.isArray(json.data.registeredDevelopers)) {
            setDeveloperList(json.data.registeredDevelopers);
          } else if (json.data.developers && Array.isArray(json.data.developers)) {
            setDeveloperList(
              json.data.developers.map((dName: string) => ({
                name: dName,
                slug: slugify(dName),
              }))
            );
          }
        }
      } catch {
        setCityError("Failed to load reference cities.");
        setDeveloperError("Failed to load reference developers.");
      } finally {
        setLoadingCities(false);
        setLoadingDevelopers(false);
      }
    }
    loadReferenceData();
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

  const isDeveloperMismatch =
    Boolean(developer.trim()) &&
    developerList.length > 0 &&
    !developerList.some((d) => d.name.toLowerCase() === developer.trim().toLowerCase());

  const filteredDevelopers = developerList.filter(
    (d) =>
      d.name.toLowerCase().includes(developerSearchQuery.toLowerCase()) ||
      (d.headquarters && d.headquarters.toLowerCase().includes(developerSearchQuery.toLowerCase()))
  );

  // -------------------------------------------------------------
  // TAB 3: PRICING & UNITS
  // -------------------------------------------------------------
  const [startingPrice, setStartingPrice] = useState(initialData?.startingPrice || "Price On Request");
  const [priceNumeric, setPriceNumeric] = useState<string>(
    initialData?.priceNumeric ? String(initialData.priceNumeric) : ""
  );
  const [priceMaxNumeric, setPriceMaxNumeric] = useState<string>(
    initialData?.priceMaxNumeric ? String(initialData.priceMaxNumeric) : ""
  );
  const [paymentPlan, setPaymentPlan] = useState(
    initialData?.paymentPlan || "Construction Linked Plan"
  );
  const [unitConfigurations, setUnitConfigurations] = useState<string>(
    initialData?.unitConfigurations?.join(", ") || "3 BHK, 4 BHK"
  );
  const [unitSizes, setUnitSizes] = useState(initialData?.unitSizes || "");
  const [landArea, setLandArea] = useState(initialData?.landArea || "");
  const [totalUnits, setTotalUnits] = useState(initialData?.totalUnits || "");
  const [elevation, setElevation] = useState(initialData?.elevation || "");

  // -------------------------------------------------------------
  // TAB 4: STATUS & PUBLICATION
  // -------------------------------------------------------------
  const [launchStatus, setLaunchStatus] = useState(initialData?.launchStatus || "Under Construction");
  const [possessionText, setPossessionText] = useState(initialData?.possessionText || "");
  const [possessionDate, setPossessionDate] = useState<string>(
    initialData?.possessionDate ? new Date(initialData.possessionDate).toISOString().split("T")[0] : ""
  );
  const [reraNumber, setReraNumber] = useState(initialData?.reraNumber || "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    initialData?.status || "published"
  );
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);
  const [isOnHomeCarousel, setIsOnHomeCarousel] = useState<boolean>(
    initialData?.isOnHomeCarousel || false
  );
  const [isFlagshipProject, setIsFlagshipProject] = useState<boolean>(
    initialData?.isFlagshipProject || false
  );

  // -------------------------------------------------------------
  // TAB 5: MEDIA & GALLERY
  // -------------------------------------------------------------
  const [cardBanner, setCardBanner] = useState(initialData?.cardBanner || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");

  // -------------------------------------------------------------
  // TAB 6: PROJECT DETAILS (ProjectDetails schema)
  // -------------------------------------------------------------
  const d = initialData?.details || {};

  // Detail Specifications (repeatable label + value)
  const [detailSpecs, setDetailSpecs] = useState<Array<{ label: string; value: string }>>(
    d.detailSpecs || [
      { label: "Towers", value: "6 Towers" },
      { label: "Floors", value: "G + 32 Floors" },
      { label: "Open Area", value: "80% Greenery" },
      { label: "Structure", value: "RCC Shear Wall" },
    ]
  );
  const [detailSpecsImage, setDetailSpecsImage] = useState<string>(d.detailSpecsImage || "");
  const [bannerStatLabels, setBannerStatLabels] = useState<string>(
    d.bannerStatLabels?.join(", ") || "Unit Typology, Starting Price, Unit Size, Location"
  );

  // Overview
  const [overviewHeading, setOverviewHeading] = useState(d.overview?.heading || "Project Overview");
  const [overviewTitle, setOverviewTitle] = useState(d.overview?.title || initialData?.title || "");
  const [overviewDescription, setOverviewDescription] = useState(d.overview?.description || "");
  const [overviewImages, setOverviewImages] = useState<string>(d.overview?.images?.join("\n") || "");

  // Gallery
  const [galleryTitle, setGalleryTitle] = useState(d.gallery?.title || "Photos & Media");
  const [galleryDesc, setGalleryDesc] = useState(d.gallery?.description || "");
  const [galleryImages, setGalleryImages] = useState<string>(d.gallery?.images?.join("\n") || "");

  // Amenities
  const [amenities, setAmenities] = useState<Array<{ name: string; image?: string; description?: string }>>(
    d.amenities?.items || [
      { name: "Swimming Pool" },
      { name: "Gymnasium" },
      { name: "Clubhouse" },
      { name: "24x7 Security" },
    ]
  );

  // Floor Plans
  const [floorPlans, setFloorPlans] = useState<
    Array<{ name: string; value: string; basePrice?: string; image?: string }>
  >(
    d.floorPlans?.plans || [
      { name: "3 BHK Luxury", value: "2150 Sq. Ft.", basePrice: "₹4.85 Cr*" },
      { name: "4 BHK Ultra", value: "3250 Sq. Ft.", basePrice: "₹7.20 Cr*" },
    ]
  );

  // Location Advantages (categories with items)
  const [locationAdvantages, setLocationAdvantages] = useState<Array<{ category: string; items: string }>>(
    d.locationAdvantages?.categories?.map((c: any) => ({
      category: c.category,
      items: Array.isArray(c.items) ? c.items.join(", ") : "",
    })) || [
      { category: "Schools & Universities", items: "Heritage Experiential, Pathways School, GD Goenka" },
      { category: "Hospitals & Healthcare", items: "Medanta Medicity, Fortis Memorial, Artemis Hospital" },
      { category: "Transit & Connectivity", items: "Golf Course Road (5 mins), Cyber City (15 mins), IGI Airport (30 mins)" },
      { category: "Business Hubs", items: "Horizon Center, DLF Cyber Park, One Horizon" },
    ]
  );

  // Info Sections
  const [infoSections, setInfoSections] = useState<
    Array<{ heading: string; title: string; description: string; image: string; variant: string }>
  >(
    d.infoSections || [
      {
        heading: "Architecture & Design",
        title: "Crafted by World-Renowned Architects",
        description: "Modern architectural lines blend effortlessly with lush green expanses for timeless luxury.",
        image: "",
        variant: "para",
      },
    ]
  );

  // Offers
  const [offers, setOffers] = useState<string>(d.offers?.join("\n") || "");

  // Documents
  const [documents, setDocuments] = useState<Array<{ name: string; type: string; url: string }>>(
    d.documents || [
      {
        name: "Project Brochure",
        type: "PDF",
        url: "https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf",
      },
    ]
  );

  // FAQs
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    d.faqs || [
      {
        question: "What is the location of this project?",
        answer: "Located in prime sector with seamless expressway connectivity.",
      },
      {
        question: "What is the possession date?",
        answer: "Possession is scheduled as per RERA guidelines.",
      },
    ]
  );

  // Contact
  const [contactHeading, setContactHeading] = useState(d.contact?.heading || "Contact Us");
  const [contactTitle, setContactTitle] = useState(d.contact?.title || "Schedule a Visit");
  const [contactMapUrl, setContactMapUrl] = useState(d.contact?.locationMapUrl || "");
  const [contactPhone, setContactPhone] = useState(d.contact?.phone || "+91 99999 99999");
  const [contactEmail, setContactEmail] = useState(d.contact?.email || "contactus@zvisory.com");

  // -------------------------------------------------------------
  // TAB 7: SEO & TRACKING
  // -------------------------------------------------------------
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || "");
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seo?.keywords || "");
  const [seoOgTitle, setSeoOgTitle] = useState(initialData?.seo?.ogTitle || "");
  const [seoOgDescription, setSeoOgDescription] = useState(initialData?.seo?.ogDescription || "");
  const [seoOgImage, setSeoOgImage] = useState(initialData?.seo?.ogImage || "");
  const [gtagId, setGtagId] = useState(initialData?.gtag?.gtagId || "");
  const [gtagSendTo, setGtagSendTo] = useState(initialData?.gtag?.gtagSendTo || "");

  // -------------------------------------------------------------
  // SLUG & TITLE HELPERS
  // -------------------------------------------------------------
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited && !isEdit) {
      setSlug(slugify(val));
    }
  };

  const handleManualSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(val.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleRegenerateSlug = () => {
    if (!title.trim()) return;
    setSlug(slugify(title));
    setIsSlugManuallyEdited(false);
  };

  const isValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim());

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
      setSuccessMsg("File uploaded successfully!");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Upload error");
    } finally {
      setUploadingField(null);
    }
  };

  // -------------------------------------------------------------
  // SUBMIT HANDLER
  // -------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Validate essentials
      if (!title.trim()) throw new Error("Project Title is required.");
      if (!slug.trim()) throw new Error("Project Slug is required.");
      if (!isValidSlug) {
        throw new Error("Project Slug must be valid kebab-case (e.g. dlf-the-camellias). No spaces or special characters.");
      }
      if (!developer.trim()) throw new Error("Developer is required.");
      if (!city.trim()) throw new Error("City is required.");

      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        keywords: keywords.split(",").map((s) => s.trim()).filter(Boolean),
        secondaryKeywords: secondaryKeywords.split(",").map((s) => s.trim()).filter(Boolean),
        developer: developer.trim(),
        city: city.trim(),
        microMarket: microMarket.trim(),
        location: location.trim() || (microMarket.trim() ? `${microMarket.trim()}, ${city.trim()}` : city.trim()),
        categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
        propertyType: propertyType.trim(),
        startingPrice: startingPrice.trim(),
        priceNumeric: priceNumeric ? Number(priceNumeric) : null,
        priceMaxNumeric: priceMaxNumeric ? Number(priceMaxNumeric) : null,
        unitConfigurations: unitConfigurations.split(",").map((s) => s.trim()).filter(Boolean),
        unitSizes: unitSizes.trim(),
        landArea: landArea.trim(),
        totalUnits: totalUnits.trim(),
        elevation: elevation.trim(),
        launchStatus: launchStatus.trim(),
        possessionText: possessionText.trim(),
        possessionDate: possessionDate ? new Date(possessionDate).toISOString() : null,
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
          keywords: seoKeywords.trim(),
          ogTitle: seoOgTitle.trim() || seoTitle.trim() || `${title.trim()} | Zvisory`,
          ogDescription: seoOgDescription.trim() || seoDescription.trim() || shortDescription.trim(),
          ogImage: seoOgImage.trim() || cardBanner.trim() || bannerUrl.trim(),
        },
        gtag: {
          gtagId: gtagId.trim(),
          gtagSendTo: gtagSendTo.trim(),
        },
        projectDetails: {
          detailSpecs: detailSpecs.filter((s) => s.label.trim() && s.value.trim()),
          detailSpecsImage: detailSpecsImage.trim(),
          bannerStatLabels: bannerStatLabels.split(",").map((s) => s.trim()).filter(Boolean),
          overview: {
            heading: overviewHeading.trim() || "Project Overview",
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
            title: galleryTitle.trim() || "Photos & Media",
            description: galleryDesc.trim(),
            images: galleryImages.split("\n").map((s) => s.trim()).filter(Boolean),
          },
          locationAdvantages: {
            heading: "Location Advantage",
            title: "Prime Connectivity",
            categories: locationAdvantages
              .filter((la) => la.category.trim())
              .map((la) => ({
                category: la.category.trim(),
                items: la.items.split(",").map((i) => i.trim()).filter(Boolean),
              })),
          },
          infoSections: infoSections.filter((sec) => sec.title.trim() || sec.heading.trim()),
          offers: offers.split("\n").map((o) => o.trim()).filter(Boolean),
          documents: documents.filter((doc) => doc.url.trim()),
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
          contact: {
            heading: contactHeading.trim() || "Contact Us",
            title: contactTitle.trim() || "Schedule a Visit",
            locationMapUrl: contactMapUrl.trim(),
            phone: contactPhone.trim(),
            email: contactEmail.trim(),
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isEdit ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {isEdit
              ? `Editing: ${initialData?.title || "Project"} • Real-time backend sync`
              : "Register a verified luxury development into Zvisory database"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && slug && (
            <Link
              href={`/properties/${slug}`}
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5"
            >
              <span>View Live</span>
              <span className="text-[10px]">↗</span>
            </Link>
          )}
          <Link
            href="/admin/projects"
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
          >
            {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-start justify-between">
          <span>⚠️ {errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-start justify-between">
          <span>✓ {successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-zinc-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-[#124446] text-white shadow-sm"
                : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BASIC INFO */}
      {/* ========================================================= */}
      {activeTab === "basic" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Basic Project Identity
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

            {/* Slug with Auto-generate & Safety */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  SEO Slug <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  ⚡ Regenerate from Title
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">/properties/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => handleManualSlugChange(e.target.value)}
                  placeholder="e.g. conscient-hines-elevate"
                  className={`flex-1 px-4 py-2.5 rounded-xl border font-mono text-sm focus:ring-2 focus:ring-emerald-500 ${
                    !isValidSlug && slug.trim()
                      ? "border-rose-400 ring-1 ring-rose-400 bg-rose-50/30"
                      : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                />
              </div>

              {!isValidSlug && slug.trim() && (
                <p className="text-[11px] text-rose-500">
                  Slug must be valid kebab-case: lowercase letters, numbers, and hyphens only (e.g. conscient-hines-elevate).
                </p>
              )}

              {isEdit && initialData?.slug && slug !== initialData.slug && (
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-[11px] text-amber-800 dark:text-amber-300">
                  ⚠️ Note: Changing the slug will update this project&apos;s public URL from <strong>/properties/{initialData.slug}</strong> to <strong>/properties/{slug}</strong>.
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Canonical URL: https://zvisory.com/properties/{slug || "..."}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Primary Categories (Comma Separated)
              </label>
              <input
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="e.g. Luxury, Ultra Luxury, High Rise"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
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
                <option value="Villas">Villas</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Search Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. conscient elevate, elevate sector 59, 3 bhk golf course extension"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Secondary Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="e.g. hines gurugram apartments, luxury flats sector 59"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LOCATION & DEVELOPER */}
      {/* ========================================================= */}
      {activeTab === "location" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Location & Developer Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Developer Searchable Dropdown */}
            <div className="space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Developer / Builder <span className="text-rose-500">*</span>
                </label>
                <Link
                  href="/admin/developers/new"
                  target="_blank"
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  + Add New Developer
                </Link>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDeveloperDropdownOpen((prev) => !prev)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-left text-sm flex items-center justify-between bg-white dark:bg-zinc-900 ${
                    isDeveloperMismatch
                      ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-300"
                      : "border-slate-200 dark:border-zinc-800"
                  } focus:ring-2 focus:ring-emerald-500 cursor-pointer`}
                >
                  <span className={developer ? "text-slate-900 dark:text-zinc-100 font-medium" : "text-slate-400"}>
                    {developer || "-- Select Registered Developer --"}
                  </span>
                  <span className="text-xs text-slate-400">▼</span>
                </button>

                {isDeveloperDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 space-y-2 max-h-64 overflow-hidden flex flex-col">
                    <input
                      type="text"
                      value={developerSearchQuery}
                      onChange={(e) => setDeveloperSearchQuery(e.target.value)}
                      placeholder="Type to filter developers..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                      autoFocus
                    />

                    {loadingDevelopers ? (
                      <div className="p-3 text-center text-xs text-slate-500">Loading developers...</div>
                    ) : developerError ? (
                      <div className="p-3 text-center text-xs text-rose-500">{developerError}</div>
                    ) : (
                      <div className="overflow-y-auto max-h-44 space-y-0.5">
                        {filteredDevelopers.map((d) => (
                          <button
                            key={d.name}
                            type="button"
                            onClick={() => {
                              setDeveloper(d.name);
                              setIsDeveloperDropdownOpen(false);
                              setDeveloperSearchQuery("");
                            }}
                            className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors ${
                              d.name.toLowerCase() === developer.toLowerCase()
                                ? "bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-800 dark:text-emerald-300"
                                : "text-slate-700 dark:text-zinc-300"
                            }`}
                          >
                            <span>{d.name}</span>
                            {d.headquarters && <span className="text-[10px] text-slate-400">{d.headquarters}</span>}
                          </button>
                        ))}

                        {filteredDevelopers.length === 0 && (
                          <div className="p-3 text-center text-xs text-slate-500 space-y-1">
                            <p>No matching developer found.</p>
                            <Link
                              href="/admin/developers/new"
                              target="_blank"
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline block"
                            >
                              + Register new developer in Developer Management →
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-1 border-t border-slate-100 dark:border-zinc-800 text-center">
                      <Link
                        href="/admin/developers"
                        target="_blank"
                        className="text-[11px] text-slate-500 hover:text-emerald-600 underline"
                      >
                        Open Developer Management ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {isDeveloperMismatch && (
                <div className="mt-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span>⚠️</span> Unmatched Developer Value: &quot;{developer}&quot;
                  </div>
                  <p>
                    This project&apos;s developer does not match any registered Developer. Select a registered developer above, or register this developer.
                  </p>
                </div>
              )}
            </div>

            {/* City Searchable Dropdown */}
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
                placeholder="e.g. Golf Course Extension Road, Sector 59"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Full Address / Location String
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector 59, Golf Course Ext Road, Gurugram, Haryana"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PRICING & UNITS */}
      {/* ========================================================= */}
      {activeTab === "pricing" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Pricing, Configurations &amp; Land Area
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Display Starting Price
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
                Min Price (Numeric INR)
              </label>
              <input
                type="number"
                value={priceNumeric}
                onChange={(e) => setPriceNumeric(e.target.value)}
                placeholder="e.g. 48500000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-400">Used for search budget filtering &amp; EMI calculation</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Max Price (Numeric INR, Optional)
              </label>
              <input
                type="number"
                value={priceMaxNumeric}
                onChange={(e) => setPriceMaxNumeric(e.target.value)}
                placeholder="e.g. 72000000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Payment Plan
              </label>
              <input
                type="text"
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value)}
                placeholder="e.g. 30:40:30 Possession Linked or 20:80 Subvention"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Unit Configurations (Comma Separated)
              </label>
              <input
                type="text"
                value={unitConfigurations}
                onChange={(e) => setUnitConfigurations(e.target.value)}
                placeholder="e.g. 3 BHK, 4 BHK, Penthouse"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Unit Sizes Range
              </label>
              <input
                type="text"
                value={unitSizes}
                onChange={(e) => setUnitSizes(e.target.value)}
                placeholder="e.g. 2150 - 3250 Sq. Ft."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Land Area / Parcel
              </label>
              <input
                type="text"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="e.g. 15.68 Acres"
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
                Elevation / Architecture
              </label>
              <input
                type="text"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                placeholder="e.g. 3 Basement + G + 32 Floors"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: STATUS & PUBLICATION */}
      {/* ========================================================= */}
      {activeTab === "status" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Status, RERA &amp; Publication Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Launch Status
              </label>
              <select
                value={launchStatus}
                onChange={(e) => setLaunchStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pre Launch">Pre Launch</option>
                <option value="New Launch">New Launch</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Ready to Move-In (New)">Ready to Move-In (New)</option>
                <option value="Ready to Move-In (Resale)">Ready to Move-In (Resale)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Possession Timeline Text
              </label>
              <input
                type="text"
                value={possessionText}
                onChange={(e) => setPossessionText(e.target.value)}
                placeholder="e.g. December 2026 or Immediate"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Possession Date (Estimated)
              </label>
              <input
                type="date"
                value={possessionDate}
                onChange={(e) => setPossessionDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                RERA Registration Number
              </label>
              <input
                type="text"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                placeholder="e.g. RC/REP/HARERA/GGM/388/120/2020/04"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Publication Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="published">Published (Visible on Public Website)</option>
                <option value="draft">Draft (Hidden from Public)</option>
                <option value="archived">Archived (Delisted from Search)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 block">
              Homepage &amp; Priority Flags
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Featured Project (Featured badge &amp; Top Ranking)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                <input
                  type="checkbox"
                  checked={isOnHomeCarousel}
                  onChange={(e) => setIsOnHomeCarousel(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Show on Homepage Hero Carousel
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                <input
                  type="checkbox"
                  checked={isFlagshipProject}
                  onChange={(e) => setIsFlagshipProject(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Flagship Development
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: MEDIA & GALLERY */}
      {/* ========================================================= */}
      {activeTab === "media" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Media, Banners &amp; Photo Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Card Banner (Listing Thumbnail)
                </label>
                <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                  {uploadingField === "cardBanner" ? "Uploading..." : "+ Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "cardBanner", (url) => setCardBanner(url))}
                  />
                </label>
              </div>
              <input
                type="text"
                value={cardBanner}
                onChange={(e) => setCardBanner(e.target.value)}
                placeholder="https://... card banner URL"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Hero Banner URL
                </label>
                <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                  {uploadingField === "bannerUrl" ? "Uploading..." : "+ Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "bannerUrl", (url) => setBannerUrl(url))}
                  />
                </label>
              </div>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://... hero header image URL"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Short Description / Teaser Summary
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Short teaser shown on project search card (max 200 chars)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Gallery Photos (One image URL per line)
              </label>
              <textarea
                rows={4}
                value={galleryImages}
                onChange={(e) => setGalleryImages(e.target.value)}
                placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: DETAILS & SECTIONS */}
      {/* ========================================================= */}
      {activeTab === "details" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-2">
            Rich Project Details &amp; Sections (ProjectDetails Model)
          </h2>

          {/* 1. Detail Specifications */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Key Specifications ({detailSpecs.length})
                </h3>
                <p className="text-[11px] text-slate-400">Repeatable specs displayed in the project overview grid</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailSpecs([...detailSpecs, { label: "", value: "" }])}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + Add Spec
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {detailSpecs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => {
                      const updated = [...detailSpecs];
                      updated[idx].label = e.target.value;
                      setDetailSpecs(updated);
                    }}
                    placeholder="Label (e.g. Total Towers)"
                    className="w-1/2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const updated = [...detailSpecs];
                      updated[idx].value = e.target.value;
                      setDetailSpecs(updated);
                    }}
                    placeholder="Value (e.g. 5 Towers)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setDetailSpecs(detailSpecs.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Specifications Master Plan Image URL
              </label>
              <input
                type="text"
                value={detailSpecsImage}
                onChange={(e) => setDetailSpecsImage(e.target.value)}
                placeholder="https://... master plan layout or elevation illustration"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs mt-1"
              />
            </div>
          </div>

          {/* 2. Overview Section */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Overview Content
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

          {/* 3. Amenities */}
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

          {/* 4. Floor Plans */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Floor Plans ({floorPlans.length})
              </h3>
              <button
                type="button"
                onClick={() =>
                  setFloorPlans([...floorPlans, { name: "", value: "", basePrice: "", image: "" }])
                }
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + Add Floor Plan
              </button>
            </div>
            <div className="space-y-2">
              {floorPlans.map((fp, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                  <input
                    type="text"
                    value={fp.name}
                    onChange={(e) => {
                      const updated = [...floorPlans];
                      updated[idx].name = e.target.value;
                      setFloorPlans(updated);
                    }}
                    placeholder="Plan Name (e.g. 3 BHK Luxury)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
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
                    className="w-full sm:w-36 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
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
                    className="w-full sm:w-32 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <input
                    type="text"
                    value={fp.image || ""}
                    onChange={(e) => {
                      const updated = [...floorPlans];
                      updated[idx].image = e.target.value;
                      setFloorPlans(updated);
                    }}
                    placeholder="Plan Image URL"
                    className="w-full sm:w-44 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setFloorPlans(floorPlans.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs px-2 self-end sm:self-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Location Advantages */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Location Advantages ({locationAdvantages.length})
                </h3>
                <p className="text-[11px] text-slate-400">Categorized proximity points (Schools, Transit, Hospitals, etc.)</p>
              </div>
              <button
                type="button"
                onClick={() => setLocationAdvantages([...locationAdvantages, { category: "", items: "" }])}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + Add Advantage Category
              </button>
            </div>
            <div className="space-y-2">
              {locationAdvantages.map((la, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                  <input
                    type="text"
                    value={la.category}
                    onChange={(e) => {
                      const updated = [...locationAdvantages];
                      updated[idx].category = e.target.value;
                      setLocationAdvantages(updated);
                    }}
                    placeholder="Category (e.g. Transit & Expressways)"
                    className="w-full sm:w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={la.items}
                    onChange={(e) => {
                      const updated = [...locationAdvantages];
                      updated[idx].items = e.target.value;
                      setLocationAdvantages(updated);
                    }}
                    placeholder="Items comma separated (e.g. Metro 5 mins, NH-8 10 mins)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setLocationAdvantages(locationAdvantages.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs px-2 self-end sm:self-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Special Offers */}
          <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Special Offers &amp; Inaugural Incentives
            </h3>
            <textarea
              rows={3}
              value={offers}
              onChange={(e) => setOffers(e.target.value)}
              placeholder="One offer per line, e.g.&#10;Zero pre-EMI until possession&#10;Complimentary modular kitchen &amp; VRV air conditioning"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
            />
          </div>

          {/* 7. FAQs */}
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

          {/* 8. Documents & PDF Brochures */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Documents &amp; PDF Brochures
              </h3>
              <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                {uploadingField === "doc" ? "Uploading PDF..." : "+ Upload PDF Document"}
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

          {/* 9. Contact Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Site Visit &amp; Advisory Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Phone (e.g. +91 99999 99999)"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
              />
              <input
                type="email"
                placeholder="Email (e.g. contactus@zvisory.com)"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Interactive Google Maps Embed URL
              </label>
              <input
                type="text"
                value={contactMapUrl}
                onChange={(e) => setContactMapUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-xs mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: SEO & TRACKING */}
      {/* ========================================================= */}
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
                SEO Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="e.g. luxury apartments gurugram, conscient elevate floor plan, buy flats sector 59"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  OpenGraph (Social) Title
                </label>
                <input
                  type="text"
                  value={seoOgTitle}
                  onChange={(e) => setSeoOgTitle(e.target.value)}
                  placeholder="Defaults to SEO Title"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  OpenGraph (Social) Image URL
                </label>
                <input
                  type="text"
                  value={seoOgImage}
                  onChange={(e) => setSeoOgImage(e.target.value)}
                  placeholder="https://... social share preview card"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                OpenGraph (Social) Description
              </label>
              <textarea
                rows={2}
                value={seoOgDescription}
                onChange={(e) => setSeoOgDescription(e.target.value)}
                placeholder="Defaults to Meta Description"
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
