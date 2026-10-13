export interface ProjectDetailSpec {
  label: string;
  value: string;
}

export interface ProjectOverview {
  heading: string;
  title: string;
  description: string;
  images: string[];
}

export interface ProjectAmenity {
  name: string;
  image?: string;
  description?: string;
}

export interface ProjectAmenitiesSection {
  heading: string;
  title: string;
  items: ProjectAmenity[];
}

export interface FloorPlanItem {
  name: string;
  value: string;
  basePrice?: string;
}

export interface ProjectFloorPlansSection {
  heading: string;
  title: string;
  plans: FloorPlanItem[];
}

export interface ProjectGallerySection {
  heading: string;
  title: string;
  description: string;
  images: string[];
}

export interface LocationAdvantageCategory {
  category: string;
  items: string[];
}

export interface ProjectLocationAdvantageSection {
  heading: string;
  title: string;
  categories: LocationAdvantageCategory[];
}

export interface ProjectInfoSection {
  heading: string;
  title: string;
  description: string;
  image?: string;
  variant?: string;
}

export interface ProjectFAQ {
  question: string;
  answer: string;
}

export interface ProjectDocument {
  name: string;
  type: string;
  url: string;
}

export interface ProjectSEO {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  gtagId?: string;
  gtagSendTo?: string;
}

export interface ProjectContact {
  heading: string;
  title: string;
  locationMapUrl?: string;
}

export interface Project {
  id: string; // slug identifier
  slug: string;
  title: string;
  keywords: string[];
  secondaryKeywords: string[];
  developer: string;
  location: string;
  city: string;
  microMarket: string;
  startingPrice: string;
  priceRaw: number; // numeric value in INR for sorting & filtering
  unitType: string[]; // e.g. ["3 BHK", "4 BHK"]
  unitSizes: string;
  landArea: string;
  totalUnits: string;
  propertyType: string;
  status: string; // "Ready To Move-In", "Under Construction", "New Launch", etc.
  possession: string;
  elevation: string;
  paymentPlan: string;
  reraNumber: string;
  categories: string[];
  bannerUrl: string;
  image: string; // main image with fallback strategy
  
  // Structured Sections
  detailSpecs: ProjectDetailSpec[];
  overview: ProjectOverview;
  amenities: ProjectAmenitiesSection;
  floorPlans: ProjectFloorPlansSection;
  gallery: ProjectGallerySection;
  locationAdvantages: ProjectLocationAdvantageSection;
  infoSections: ProjectInfoSection[];
  offers: string[];
  documents: ProjectDocument[];
  faqs: ProjectFAQ[];
  contact: ProjectContact;
  seo: ProjectSEO;
  
  // Original Raw Data Access
  raw: Record<string, string | null>;
}
