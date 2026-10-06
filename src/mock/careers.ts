export interface JobListing {
  id: string;
  title: string;
  location: string;
  type: "Full-Time" | "Part-Time" | "Hybrid" | "Remote";
  department: string;
  experience: string;
  description: string;
  responsibilities: string[];
}

export const MOCK_JOBS: JobListing[] = [
  {
    id: "job-1",
    title: "Senior Real Estate Advisory Consultant",
    location: "Gurugram, Haryana",
    type: "Full-Time",
    department: "Sales & Advisory",
    experience: "4 - 8 Years",
    description: "Provide high-touch advisory services to luxury homebuyers and NRI investors, managing client relationships from initial consultation to final deed signing.",
    responsibilities: [
      "Conduct in-depth market comparative analyses for high-net-worth clients",
      "Manage site walkthroughs and developer negotiations",
      "Maintain active communication across legal, financial, and client teams"
    ]
  },
  {
    id: "job-2",
    title: "Home Loan & Mortgage Specialist",
    location: "Central Delhi / Remote",
    type: "Full-Time",
    department: "Financial Services",
    experience: "3 - 6 Years",
    description: "Guide clients through loan eligibility, interest rate negotiation across partner banks, documentation compliance, and fast-track disbursal.",
    responsibilities: [
      "Analyze client credit profiles and income documentation",
      "Coordinate directly with banking partners for preferred rate approvals",
      "Ensure seamless mortgage processing without delays"
    ]
  },
  {
    id: "job-3",
    title: "Full-Stack Web Developer (Next.js / Node.js)",
    location: "Bengaluru / Hybrid",
    type: "Full-Time",
    department: "Technology",
    experience: "2 - 5 Years",
    description: "Build and scale high-performance web applications, interactive property comparison tools, and real-time CRM dashboards.",
    responsibilities: [
      "Develop responsive Next.js frontend components following UI wireframes",
      "Implement secure Express RESTful API endpoints and database integrations",
      "Optimize web application performance, SEO, and accessibility"
    ]
  }
];
