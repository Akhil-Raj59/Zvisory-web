import {
  Project,
  ProjectDetailSpec,
  ProjectOverview,
  ProjectAmenitiesSection,
  ProjectAmenity,
  ProjectFloorPlansSection,
  FloorPlanItem,
  ProjectGallerySection,
  ProjectLocationAdvantageSection,
  LocationAdvantageCategory,
  ProjectInfoSection,
  ProjectFAQ,
  ProjectDocument,
  ProjectSEO,
  ProjectContact
} from "@/models/project";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
];

function isInvalidText(val: string | null | undefined): boolean {
  if (!val) return true;
  const clean = val.trim().toUpperCase();
  return (
    clean === "" ||
    clean === "NULL" ||
    clean === "NONE" ||
    clean === "NO DATA" ||
    clean === "NA" ||
    clean === "N/A" ||
    clean === "URL"
  );
}

function sanitizeText(val: string | null | undefined, defaultVal = ""): string {
  if (isInvalidText(val)) return defaultVal;
  return val!.trim();
}

function getValidImageUrl(val: string | null | undefined, fallbackIndex = 0): string {
  if (isInvalidText(val)) {
    return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  }
  const clean = val!.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) {
    return clean;
  }
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
}

function splitDelimited(val: string | null | undefined, delimiter = ";"): string[] {
  if (isInvalidText(val)) return [];
  return val!
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => !isInvalidText(s));
}

export function parseNumericPrice(priceStr: string | null | undefined): number {
  if (isInvalidText(priceStr)) return 0;
  const str = priceStr!.toLowerCase().replace(/,/g, "");

  // Match Cr or Lacs / Lakhs
  const crMatch = str.match(/(?:₹|rs\.?)?\s*([\d.]+)\s*(?:cr|crore)/i);
  if (crMatch) {
    return Math.round(parseFloat(crMatch[1]) * 10000000);
  }

  const lacMatch = str.match(/(?:₹|rs\.?)?\s*([\d.]+)\s*(?:lac|lakh|lacs)/i);
  if (lacMatch) {
    return Math.round(parseFloat(lacMatch[1]) * 100000);
  }

  const genericMatch = str.match(/[\d.]+/);
  if (genericMatch) {
    const num = parseFloat(genericMatch[0]);
    if (num > 0 && num < 1000) {
      // assume Cr if small number like 4.85
      return Math.round(num * 10000000);
    }
    return Math.round(num);
  }

  return 0;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

export function normalizeExcelRecord(raw: Record<string, string | null>, index = 0): Project {
  const title = sanitizeText(raw.project_title, `Project ${index + 1}`);

  // Slug derivation
  let slug = "";
  if (!isInvalidText(raw.keywords)) {
    slug = slugify(raw.keywords!);
  } else {
    slug = slugify(title);
  }
  if (!slug) slug = `project-${index + 1}`;

  const keywords = splitDelimited(raw.keywords, ";");
  const secondaryKeywords = splitDelimited(raw.keywords_1, ";");

  // Detail Section Titles & Values
  const detailTitles = splitDelimited(raw.detail_section_title, ";");
  const detailValues = splitDelimited(raw.detail_section_value, ";");
  const detailSpecs: ProjectDetailSpec[] = [];

  let developer = sanitizeText(raw.developer);
  let landArea = sanitizeText(raw.land_area);
  let totalUnits = sanitizeText(raw.total_units);
  let elevation = "";
  let status = "Under Construction";
  let possession = "";

  detailTitles.forEach((t, i) => {
    const v = detailValues[i] || "";
    if (t && v) {
      detailSpecs.push({ label: t, value: v });
      const lowerT = t.toLowerCase();
      if (!developer && lowerT.includes("developer")) developer = v;
      if (!landArea && (lowerT.includes("land") || lowerT.includes("area"))) landArea = v;
      if (!totalUnits && lowerT.includes("units")) totalUnits = v;
      if (!elevation && lowerT.includes("elevation")) elevation = v;
      if (lowerT.includes("status")) status = v;
      if (!possession && lowerT.includes("possession")) possession = v;
    }
  });

  if (!developer) developer = "Zvisory Partner Developer";

  // City & Location
  const locations = splitDelimited(raw.locations, ";");
  const city = locations.length > 0 ? locations[0] : "Gurugram";
  const microMarket = sanitizeText(raw.micro_market, locations.join(", ") || city);
  const locationStr = microMarket ? `${microMarket}, ${city}` : city;

  // Price & Units
  const startingPrice = sanitizeText(
    raw.startingPrice || raw.unnamed_col_10,
    "Price On Request"
  );
  const priceRaw = parseNumericPrice(startingPrice);

  const unitTypeStr = sanitizeText(raw.unitType || raw.banner_info_section_value || raw.unnamed_col_9);
  const unitType = splitDelimited(unitTypeStr, ",");
  if (unitType.length === 0 && unitTypeStr) unitType.push(unitTypeStr);

  const unitSizes = sanitizeText(raw.unit_sizes || raw.unnamed_col_11, "Custom Layouts");
  const propertyType = sanitizeText(raw.propertyType, "Apartments");
  const paymentPlan = sanitizeText(raw.paymentPlan, "Flexible Payment Plan");
  const reraNumber = sanitizeText(raw.rera_number, "RERA Verified");

  const categories = splitDelimited(raw.categories, ";");
  if (categories.length === 0) categories.push("Luxury");

  // Images & Banner
  const bannerUrl = getValidImageUrl(raw.banner_url, index);
  const mainImage = getValidImageUrl(raw.banner_url || raw.metadata_og_image, index);

  // Overview Section
  const overviewImages = splitDelimited(raw.overview_images_section_url, ";").map((url, i) =>
    getValidImageUrl(url, index + i)
  );
  if (overviewImages.length === 0) overviewImages.push(mainImage);

  const overview: ProjectOverview = {
    heading: sanitizeText(raw.overview_section_heading, "Project Overview"),
    title: sanitizeText(raw.overview_section_title, title),
    description: sanitizeText(
      raw.overview_section_description,
      `${title} offers world-class living spaces designed for comfort, luxury, and serenity.`
    ),
    images: overviewImages
  };

  // Amenities Section
  const amenityTitles = splitDelimited(raw.amenities_detail_section_title, ";");
  const amenityImg = getValidImageUrl(raw.amenities_detail_section_image, index + 2);
  const amenityItems: ProjectAmenity[] = amenityTitles.map((t) => ({
    name: t,
    image: amenityImg
  }));

  const amenities: ProjectAmenitiesSection = {
    heading: sanitizeText(raw.amenities_section_heading, "Amenities"),
    title: sanitizeText(raw.amenities_section_title, "Designed to meet the highest criteria"),
    items: amenityItems
  };

  // Floor Plans
  const planNames = splitDelimited(raw.plan_section_details_plan_name, ";");
  const planValues = splitDelimited(raw.plan_section_details_plan_value, ";");
  const planPrices = splitDelimited(raw.plan_section_details_plan_base_price, ";");
  const floorPlansList: FloorPlanItem[] = [];

  planNames.forEach((n, i) => {
    floorPlansList.push({
      name: n,
      value: planValues[i] || "Spacious Layout",
      basePrice: planPrices[i] || undefined
    });
  });

  const floorPlans: ProjectFloorPlansSection = {
    heading: sanitizeText(raw.plan_section_heading, "Floor Plans"),
    title: sanitizeText(raw.plan_section_title, "Sophisticated and Spacious"),
    plans: floorPlansList
  };

  // Gallery
  const galleryImagesRaw = splitDelimited(raw.gallery_section_images_url, ";");
  const galleryImages = galleryImagesRaw.map((url, i) => getValidImageUrl(url, index + i));
  if (galleryImages.length === 0) galleryImages.push(mainImage, overviewImages[0] || mainImage);

  const gallery: ProjectGallerySection = {
    heading: sanitizeText(raw.gallery_section_heading, "Gallery"),
    title: sanitizeText(raw.gallery_section_title, "Photos & Media"),
    description: sanitizeText(raw.gallery_section_description),
    images: galleryImages
  };

  // Location Advantages
  const advListsRaw = sanitizeText(raw.advantage_section_lists);
  const advCategories: LocationAdvantageCategory[] = [];

  if (advListsRaw) {
    const catBlocks = advListsRaw.split("|");
    catBlocks.forEach((block) => {
      const parts = block.split(";").map((s) => s.trim()).filter((s) => !isInvalidText(s));
      if (parts.length > 0) {
        advCategories.push({
          category: parts[0],
          items: parts.slice(1)
        });
      }
    });
  }

  const locationAdvantages: ProjectLocationAdvantageSection = {
    heading: sanitizeText(raw.advantage_section_heading, "Location Advantage"),
    title: sanitizeText(raw.advantage_section_title, "Prime Connectivity & Neighborhood"),
    categories: advCategories
  };

  // Info Sections
  const infoSections: ProjectInfoSection[] = [];
  [
    {
      img: raw.info_section1_image,
      h: raw.info_section1_heading,
      t: raw.info_section1_title,
      v: raw.info_section1_description_varaint,
      d: raw.info_section1_description
    },
    {
      img: raw.info_section2_image,
      h: raw.info_section2_heading,
      t: raw.info_section2_title,
      v: raw.info_section2_description_varaint,
      d: raw.info_section2_description
    },
    {
      img: raw.info_section3_image,
      h: raw.info_section3_heading,
      t: raw.info_section3_title,
      v: raw.info_section3_description_varaint,
      d: raw.info_section3_description
    }
  ].forEach((sec, i) => {
    if (!isInvalidText(sec.d) || !isInvalidText(sec.t)) {
      infoSections.push({
        heading: sanitizeText(sec.h, `Highlight ${i + 1}`),
        title: sanitizeText(sec.t),
        description: sanitizeText(sec.d),
        image: getValidImageUrl(sec.img, index + i),
        variant: sanitizeText(sec.v)
      });
    }
  });

  // Offers
  const offers: string[] = [];
  if (!isInvalidText(raw.offer_section_1)) offers.push(raw.offer_section_1!.trim());
  if (!isInvalidText(raw.offer_section_2)) offers.push(raw.offer_section_2!.trim());

  // Documents
  const docsRaw = sanitizeText(raw.documents);
  const documents: ProjectDocument[] = [];
  if (docsRaw) {
    const docBlocks = docsRaw.split("|");
    docBlocks.forEach((b) => {
      const parts = b.split(";").map((s) => s.trim());
      if (parts.length >= 1 && parts[0]) {
        documents.push({
          url: parts[0],
          name: parts[1] || "Project Brochure",
          type: parts[2] || "PDF"
        });
      }
    });
  }

  // FAQs
  const faqQuestions = splitDelimited(raw.faq_section_questions, ";");
  const faqAnswers = splitDelimited(raw.faq_section_answers, ";");
  const faqs: ProjectFAQ[] = [];
  faqQuestions.forEach((q, i) => {
    if (q && faqAnswers[i]) {
      faqs.push({ question: q, answer: faqAnswers[i] });
    }
  });

  // SEO & Contact
  const seo: ProjectSEO = {
    ogTitle: sanitizeText(raw.metadata_og_title, `${title} - Luxury Properties`),
    ogDescription: sanitizeText(raw.metadata_og_description, overview.description),
    ogImage: getValidImageUrl(raw.metadata_og_image || raw.banner_url, index),
    gtagId: sanitizeText(raw.gtag_id),
    gtagSendTo: sanitizeText(raw.gtag_send_to)
  };

  const contact: ProjectContact = {
    heading: sanitizeText(raw.contact_section_heading, "Contact Us"),
    title: sanitizeText(raw.contact_section_title, "Schedule a Site Visit"),
    locationMapUrl: sanitizeText(raw.contact_section_location)
  };

  return {
    id: slug,
    slug,
    title,
    keywords,
    secondaryKeywords,
    developer,
    location: locationStr,
    city,
    microMarket,
    startingPrice,
    priceRaw,
    unitType,
    unitSizes,
    landArea,
    totalUnits,
    propertyType,
    status,
    possession,
    elevation,
    paymentPlan,
    reraNumber,
    categories,
    bannerUrl,
    image: mainImage,
    detailSpecs,
    overview,
    amenities,
    floorPlans,
    gallery,
    locationAdvantages,
    infoSections,
    offers,
    documents,
    faqs,
    contact,
    seo,
    raw
  };
}
