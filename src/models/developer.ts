export interface DeveloperSEO {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface Developer {
  _id?: string;
  id: string; // slug identifier
  name: string;
  slug: string;
  logo?: string;
  shortDescription?: string;
  description?: string;
  website?: string;
  headquarters?: string;
  seo?: DeveloperSEO;
  status?: 'draft' | 'published' | 'archived';
  projectCount?: number;
  publishedProjectsCount?: number;
  minPrice?: string;
  citiesActive?: string[];
  createdAt?: string;
  updatedAt?: string;
}

