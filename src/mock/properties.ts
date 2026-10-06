export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  price: string;
  priceRaw: number;
  type: "High Rise" | "Low Rise" | "Plots" | "Commercial";
  status: "Pre Launch" | "New Launch" | "Under Construction" | "Ready to Move-in (New)" | "Ready to Move-in (Resale)";
  budgetRange: "Under 1 Cr" | "1 – 2 Cr" | "2 – 3 Cr" | "3 – 5 Cr" | "5 Cr +";
  unitConfigs: string[];
  area: string;
  possessionTime: string;
  image: string;
  description: string;
  usps: string[];
  reraNo?: string;
  towers?: number;
  landParcel?: string;
  featured?: boolean;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    name: "DLF Midtown Luxury Residences",
    location: "Moti Nagar, Central Delhi",
    city: "Delhi",
    price: "₹ 3.25 Cr - 6.50 Cr",
    priceRaw: 32500000,
    type: "High Rise",
    status: "Under Construction",
    budgetRange: "3 – 5 Cr",
    unitConfigs: ["2 BHK", "3 BHK", "4 BHK"],
    area: "1,750 - 3,400 sq.ft.",
    possessionTime: "December 2026",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
    description: "Experience ultra-luxury high-rise living amidst 128 acres of lush green parks in the heart of Delhi. Featuring world-class clubhouse amenities, modern infinity pools, and panoramic skyline views.",
    usps: ["128 Acres Surrounding Greens", "Triple Height Grand Lobby", "Olympic-sized Swimming Pool", "IGBC Gold Certified Green Building"],
    reraNo: "DLRERA2023P0012",
    towers: 4,
    landParcel: "5.5 Acres",
    featured: true
  },
  {
    id: "prop-2",
    name: "Birla Ojasvi Premium Apartments",
    location: "RR Nagar, Bengaluru",
    city: "Bengaluru",
    price: "₹ 1.45 Cr - 2.80 Cr",
    priceRaw: 14500000,
    type: "High Rise",
    status: "New Launch",
    budgetRange: "1 – 2 Cr",
    unitConfigs: ["1 BHK", "2 BHK", "3 BHK", "4 BHK+"],
    area: "650 - 2,200 sq.ft.",
    possessionTime: "March 2028",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
    description: "Thoughtfully crafted modern homes overlooking the serene Reserve Forest. Designed by international architects with sustainable materials and smart home automation.",
    usps: ["Overlooking 250-acre Forest", "Health & Wellness Club", "Electric Vehicle Charging Stations", "80% Open Green Space"],
    reraNo: "PRM/KA/RERA/1251/310/PR/240224",
    towers: 3,
    landParcel: "10 Acres",
    featured: true
  },
  {
    id: "prop-3",
    name: "M3M Crown Luxury Haven",
    location: "Sector 111, Dwarka Expressway, Gurugram",
    city: "Gurugram",
    price: "₹ 2.10 Cr - 4.25 Cr",
    priceRaw: 21000000,
    type: "High Rise",
    status: "Under Construction",
    budgetRange: "2 – 3 Cr",
    unitConfigs: ["3 BHK", "4 BHK"],
    area: "1,605 - 2,670 sq.ft.",
    possessionTime: "June 2027",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    description: "Palatial 3 & 4 BHK residences located right on Dwarka Expressway with Italian marble flooring, VRV air conditioning, and a 75,000 sq.ft. lavish clubhouse.",
    usps: ["Direct Access to IGI Airport", "75,000 sq.ft. Mega Clubhouse", "Private Elevator Foyers", "Central Lagoon Pool"],
    reraNo: "GGM/687/419/2023/31",
    towers: 7,
    landParcel: "16 Acres",
    featured: true
  },
  {
    id: "prop-4",
    name: "Godrej Tropical Isle",
    location: "Sector 146, Noida Expressway",
    city: "Noida",
    price: "₹ 1.85 Cr - 3.75 Cr",
    priceRaw: 18500000,
    type: "High Rise",
    status: "New Launch",
    budgetRange: "1 – 2 Cr",
    unitConfigs: ["3 BHK", "4 BHK"],
    area: "1,800 - 3,250 sq.ft.",
    possessionTime: "August 2028",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    description: "Island-themed resort living in Noida. Features tropical gardens, artificial beach entry pool, and 5-tier security systems for an elite lifestyle.",
    usps: ["Island Resort Theme Architecture", "Beach Entry Swimming Pool", "Air-Purified Towers", "Adjacent to Noida Metro Station"],
    reraNo: "UPRERAPRJ303390",
    towers: 5,
    landParcel: "12 Acres",
    featured: true
  },
  {
    id: "prop-5",
    name: "Sobha Neopolis Roman Enclave",
    location: "Panathur, East Bengaluru",
    city: "Bengaluru",
    price: "₹ 1.60 Cr - 3.40 Cr",
    priceRaw: 16000000,
    type: "High Rise",
    status: "Under Construction",
    budgetRange: "1 – 2 Cr",
    unitConfigs: ["2 BHK", "3 BHK", "4 BHK"],
    area: "1,200 - 2,481 sq.ft.",
    possessionTime: "December 2027",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
    description: "Greek and Roman architectural splendor translated into contemporary high-rise luxury near ITPL and Outer Ring Road tech corridors.",
    usps: ["Greek & Roman Architecture", "3 Grand Clubhouses", "Sensory Gardens & Amphitheatre", "Self-Crafted Sobha Construction Quality"],
    reraNo: "PRM/KA/RERA/1251/446/PR/200923",
    towers: 19,
    landParcel: "26.5 Acres",
    featured: false
  },
  {
    id: "prop-6",
    name: "Emaar Urban Oasis Plots & Low Rise",
    location: "Golf Course Extension Road, Gurugram",
    city: "Gurugram",
    price: "₹ 4.50 Cr - 9.00 Cr",
    priceRaw: 45000000,
    type: "Low Rise",
    status: "Ready to Move-in (New)",
    budgetRange: "5 Cr +",
    unitConfigs: ["3 BHK", "4 BHK+"],
    area: "2,400 - 4,500 sq.ft.",
    possessionTime: "Ready to Move",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    description: "Low-density boutique floors with private terraces and personal basement suites. Located on the coveted Golf Course Extension Road.",
    usps: ["Low Density - 1 Floor 1 Family", "Private Basement & Terrace Rights", "Golf Course Views", "Gated Security Community"],
    reraNo: "GGM/382/114/2020/08",
    towers: 12,
    landParcel: "8 Acres",
    featured: true
  }
];
