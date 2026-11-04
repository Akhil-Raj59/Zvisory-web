export interface NavItem {
  label: string;
  href: string;
  description?: string;
  isExternal?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const headerNavigation = {
  propertyTypes: [
    { label: "High Rise Apartments", href: "/search?propertyType=High+Rise", description: "Iconic high-rise residences with sky amenities" },
    { label: "Low Rise Floors", href: "/search?propertyType=Low+Rise", description: "Independent luxury floors in gated townships" },
    { label: "Residential Plots", href: "/search?propertyType=Plots", description: "Freehold residential plots in prime corridors" },
    { label: "Commercial Spaces", href: "/search?propertyType=Commercial", description: "Grade A office suites and high-street retail" },
    { label: "Luxury Villas", href: "/search?propertyType=Villas", description: "Bespoke standalone and cluster villas" },
  ],
  services: [
    { label: "Buying Assistance", href: "/search", description: "Curated portfolio matching your lifestyle & budget" },
    { label: "Property Advisory", href: "/about", description: "Comparative analytics & market timing insights" },
    { label: "Home Loan & EMI Calculator", href: "/home-loan", description: "Competitive interest rates with pre-approved loans" },
  ],
  mainLinks: [
    { label: "Properties", href: "/search" },
    { label: "Cities", href: "/cities" },
    { label: "Developers", href: "/developers" },
    { label: "Blogs", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "About Us", href: "/about" },
  ],
};

export const footerNavigation = {
  quickLinks: [
    { label: "Explore Properties", href: "/search" },
    { label: "Cities Directory", href: "/cities" },
    { label: "Top Developers", href: "/developers" },
    { label: "Home Loan EMI Calculator", href: "/home-loan" },
    { label: "Market Insights & Blogs", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "About Zvisory", href: "/about" },
  ],
  popularSearches: [
    { label: "Properties in Gurugram", href: "/cities/gurugram" },
    { label: "Luxury Apartments Delhi", href: "/cities/delhi" },
    { label: "High Rise Bengaluru", href: "/cities/bengaluru" },
    { label: "Noida Expressway Projects", href: "/cities/noida" },
    { label: "Mumbai Sea View Homes", href: "/cities/mumbai" },
    { label: "Under 1 Cr Properties", href: "/search?budget=Under+1+Cr" },
    { label: "Independent Low Rise Floors", href: "/search?propertyType=Low+Rise" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/about" },
    { label: "Terms & Conditions", href: "/about" },
    { label: "RERA Compliance Statement", href: "/about" },
  ],
};

