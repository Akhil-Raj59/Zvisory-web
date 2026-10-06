export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: "Market Trends" | "Home Loan" | "Investment" | "Buying Guide";
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: string;
}

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Dwarka Expressway 2026 Outlook: Why Luxury Real Estate is Booming",
    slug: "dwarka-expressway-2026-outlook",
    category: "Market Trends",
    date: "October 2, 2026",
    readTime: "5 min read",
    excerpt: "With the full operationalization of the Dwarka Expressway and IGI Tunnel connectivity, property values have surged. Here is an in-depth analytical breakdown.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    author: "Zvisory Research Desk"
  },
  {
    id: "blog-2",
    title: "How to Secure the Lowest Home Loan Interest Rate in 2026",
    slug: "secure-lowest-home-loan-interest-rate",
    category: "Home Loan",
    date: "September 24, 2026",
    readTime: "4 min read",
    excerpt: "Understand how credit scores, LTV ratios, repo-linked lending rates, and processing fees impact your monthly EMI, and how to negotiate better terms.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    author: "Financial Advisory Team"
  },
  {
    id: "blog-3",
    title: "High-Rise vs Low-Rise Luxury Floors: Which is Right for You?",
    slug: "high-rise-vs-low-rise-luxury-floors",
    category: "Buying Guide",
    date: "September 15, 2026",
    readTime: "6 min read",
    excerpt: "Comparing maintenance costs, privacy, clubhouse amenities, resale liquidity, and architectural longevity between high-rise complexes and low-rise floors.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    author: "Editorial Team"
  }
];
