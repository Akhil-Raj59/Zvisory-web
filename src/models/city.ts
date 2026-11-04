export interface CitySEO {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface City {
  _id?: string;
  id: string; // slug identifier
  name: string;
  slug: string;
  state?: string;
  country?: string;
  image?: string;
  coverImage?: string;
  startingPrice?: string;
  priceRange?: string;
  shortDescription?: string;
  description?: string;
  highlights?: string[];
  localities?: string[];
  gallery?: string[];
  seo?: CitySEO;
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  projectCount?: number;
  publishedProjectsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

