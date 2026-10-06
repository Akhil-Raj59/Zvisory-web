export interface City {
  id: string;
  name: string;
  priceRange: string;
  projectCount: number;
  image: string;
  description: string;
}

export const MOCK_CITIES: City[] = [
  {
    id: "gurugram",
    name: "Gurugram",
    priceRange: "₹ 1.20 Cr – 15.00 Cr",
    projectCount: 148,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    description: "India's premier financial and technology hub featuring world-class high-rise skyscrapers, golf course residences, and ultra-luxury gated communities."
  },
  {
    id: "delhi",
    name: "Central & South Delhi",
    priceRange: "₹ 2.50 Cr – 35.00 Cr",
    projectCount: 62,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
    description: "Iconic capital city living with heritage bungalows, high-end redevelopment floors, and green surrounding enclaves."
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    priceRange: "₹ 85 Lacs – 8.50 Cr",
    projectCount: 195,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80",
    description: "Silicon Valley of India with tech corridor developments, lush foliage, lakeside villas, and vibrant lifestyle townships."
  },
  {
    id: "noida",
    name: "Noida & Greater Noida",
    priceRange: "₹ 65 Lacs – 6.00 Cr",
    projectCount: 110,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    description: "Rapidly expanding expressway region with futuristic infrastructure, Jewar Airport proximity, and affordable luxury high-rises."
  },
  {
    id: "mumbai",
    name: "Mumbai Metropolitan Region",
    priceRange: "₹ 1.80 Cr – 45.00 Cr",
    projectCount: 220,
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80",
    description: "The financial epicenter of India offering sea-facing penthouses, iconic towers, and luxury urban townships."
  }
];
