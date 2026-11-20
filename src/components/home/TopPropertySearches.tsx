import Link from "next/link";

interface SearchLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const SEARCH_GROUPS: SearchLinkGroup[] = [
  {
    title: "Delhi NCR Luxury Hubs",
    links: [
      { label: "Luxury Projects in Gurgaon", href: "/search?q=Gurgaon&type=High+Rise" },
      { label: "Apartments in Gurgaon", href: "/search?city=Gurugram" },
      { label: "Golf Course Road Residences", href: "/search?q=Golf+Course+Road" },
      { label: "DLF Phase 5 Independent Floors", href: "/search?q=DLF+Phase+5" },
      { label: "Dwarka Expressway Luxury Corridor", href: "/search?q=Dwarka+Expressway" },
      { label: "New Launch Projects in Noida", href: "/search?city=Noida" },
    ],
  },
  {
    title: "Bengaluru Tech Corridors",
    links: [
      { label: "Luxury Apartments in Hebbal", href: "/search?q=Hebbal" },
      { label: "Flats in Whitefield", href: "/search?q=Whitefield" },
      { label: "Prestige Projects Bengaluru", href: "/search?developer=Prestige+Group" },
      { label: "Gated Villas in Sarjapur Road", href: "/search?q=Sarjapur" },
      { label: "Luxury High Rise North Bangalore", href: "/search?city=Bengaluru" },
      { label: "Ready to Move Apartments Bengaluru", href: "/search?city=Bengaluru&status=Ready+To+Move-In" },
    ],
  },
  {
    title: "Hyderabad Prime Localities",
    links: [
      { label: "Gated Communities in Kokapet", href: "/search?q=Kokapet" },
      { label: "Luxury High Rise Financial District", href: "/search?q=Financial+District" },
      { label: "Villas in Jubilee Hills & Gachibowli", href: "/search?q=Gachibowli" },
      { label: "Sattva Projects Hyderabad", href: "/search?q=Sattva" },
      { label: "Ultra Luxury Flats in Hitec City", href: "/search?q=Hitec+City" },
      { label: "New Residential Projects Hyderabad", href: "/search?city=Hyderabad" },
    ],
  },
  {
    title: "Mumbai & Western Metros",
    links: [
      { label: "Luxury Flats in Worli & Lower Parel", href: "/search?q=Worli" },
      { label: "Sea-Facing Penthouses Bandra", href: "/search?q=Bandra" },
      { label: "Oberoi Realty Projects Mumbai", href: "/search?developer=Oberoi+Realty" },
      { label: "Premium Apartments in Pune", href: "/search?city=Pune" },
      { label: "Koregaon Park & Baner Residences", href: "/search?q=Baner" },
      { label: "Godrej Properties Mumbai", href: "/search?developer=Godrej+Properties" },
    ],
  },
];

export function TopPropertySearches() {
  return (
    <section className="py-14 bg-white border-b border-[#E5EDE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
            Popular Localities
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#124446] tracking-tight mt-1">
            Top Property Searches
          </h2>
          <p className="text-xs sm:text-sm text-[#557173] mt-1">
            Quick links to premier micro-markets, verified builder developments, and popular luxury residential configurations.
          </p>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SEARCH_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#124446] pb-2 border-b border-[#E5EDE9]">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#557173] hover:text-[#124446] hover:underline transition-colors block leading-relaxed"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

