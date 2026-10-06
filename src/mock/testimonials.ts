export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
  videoThumbnail?: string;
  videoUrl?: string;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Vikram & Ananya Sharma",
    role: "Homeowners",
    location: "Gurugram",
    quote: "Zvisory made our home buying process completely seamless. Their transparent market analysis and unbiased property comparisons saved us millions during negotiation!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-2",
    name: "Rajesh Malhotra",
    role: "NRI Real Estate Investor",
    location: "London / Bengaluru",
    quote: "Managing property investments from abroad used to be stressful until I met Zvisory. Their end-to-end guidance from verification to legal paperwork was top-notch.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-3",
    name: "Priya Menon",
    role: "First-time Buyer",
    location: "Central Delhi",
    quote: "The Home Loan assistance team helped me compare 6 major banks and secured an interest rate lower than what I was offered directly. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    videoThumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  }
];
