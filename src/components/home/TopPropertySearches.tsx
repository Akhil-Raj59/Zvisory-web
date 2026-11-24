import Link from "next/link";

const HK = '"Hanken Grotesk", system-ui, sans-serif';
const PJS = '"Plus Jakarta Sans", sans-serif';

interface SearchColumn {
  links: { label: string; href: string }[];
}

const SEARCH_COLUMNS: SearchColumn[] = [
  {
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
    <section
      style={{
        background: "#F8FFFB",
        color: "#124446",
        padding: "56px 150px 72px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 56,
        boxSizing: "border-box",
        width: "100%",
      }}
      className="links-section"
    >
      <style>{`
        @media (max-width: 1440px) {
          .links-section { padding: 48px 48px 56px !important; }
        }
        @media (max-width: 1024px) {
          .links-section { padding: 40px 24px 48px !important; gap: 32px !important; }
          .links-grid { flex-direction: column !important; gap: 24px !important; }
        }
        @media (max-width: 768px) {
          .links-section { padding: 32px 16px 40px !important; }
          .links-grid { white-space: normal !important; gap: 20px !important; }
        }
      `}</style>

      {/* Title */}
      <h2
        style={{
          margin: 0,
          width: "100%",
          textAlign: "center",
          font: `600 32px/normal ${PJS}`,
          color: "#124446",
        }}
      >
        Top Property Searches
      </h2>

      {/* Link Grid: 4 Columns */}
      <div
        className="links-grid"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 8px",
          boxSizing: "border-box",
          font: `400 16px/normal ${HK}`,
          whiteSpace: "nowrap",
        }}
      >
        {SEARCH_COLUMNS.map((col, cIdx) => (
          <div
            key={cIdx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {col.links.map((link, lIdx) => (
              <Link
                key={lIdx}
                href={link.href}
                style={{
                  color: "#124446",
                  textDecoration: "none",
                  display: "block",
                  lineHeight: "21px",
                  height: 21,
                  transition: "color 0.15s ease",
                }}
                className="hover:text-[#D3A479]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
