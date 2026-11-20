import { getCurrentUser } from "@/lib/auth";
import { projectService } from "@/services/projectService";
import { cityService } from "@/services/cityService";
import { developerService } from "@/services/developerService";
import { MOCK_TESTIMONIALS } from "@/mock/testimonials";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { CityBrowseCircles } from "@/components/home/CityBrowseCircles";
import { ProjectShowcaseSection } from "@/components/home/ProjectShowcaseSection";
import { LovedByPeopleSection } from "@/components/home/LovedByPeopleSection";
import { PropertyMarketInsights } from "@/components/home/PropertyMarketInsights";
import { HomeDeveloperShowcase } from "@/components/home/HomeDeveloperShowcase";
import { TopPropertySearches } from "@/components/home/TopPropertySearches";
import { AdvisorCtaBanner } from "@/components/home/AdvisorCtaBanner";
import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zvisory | Luxury Real Estate & Verified Property Advisory",
  description:
    "Explore verified luxury high-rise apartments, low-rise floors, plots, and commercial properties with expert advisory and home loan assistance across India.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zvisory | Luxury Real Estate & Verified Property Advisory",
    description:
      "Explore verified luxury high-rise apartments, low-rise floors, plots, and commercial properties across India.",
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zvisory | Luxury Real Estate & Verified Property Advisory",
    description: "Explore verified luxury properties across India with expert advisory.",
    images: [siteConfig.ogImage],
  },
};

export default async function HomePage() {
  const user = await getCurrentUser();

  // Fetch real data concurrently from backend APIs
  const [featuredProjects, cities, developers] = await Promise.all([
    projectService.getFeaturedProjects(6),
    cityService.getAllCities(),
    developerService.getAllDevelopers({ limit: 8 }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FFFB] text-slate-900 font-sans selection:bg-[#E6FFF1] selection:text-[#124446]">
      {/* 1. Header (Navbar) */}
      <Header user={user} />

      <main className="flex-1">
        {/* 2. Hero Section with Background & Floating Search Card */}
        <HomeHero cities={cities} developers={developers} />

        {/* 3. Browse New Projects in India (Circular City Cards) */}
        <CityBrowseCircles cities={cities} />

        {/* 4. Project Showcase with Tabs & Interactive Project Cards */}
        <ProjectShowcaseSection projects={featuredProjects} />

        {/* 5. Loved By People Testimonial Hero Card & 5 Stat Counters */}
        <LovedByPeopleSection testimonials={MOCK_TESTIMONIALS} />

        {/* 6. Market Insights (Editorial Cards & Buyer Guides) */}
        <PropertyMarketInsights />

        {/* 7. Top Developers Showcase */}
        <HomeDeveloperShowcase developers={developers} />

        {/* 8. Top Property Searches (Structured SEO Keyword Links) */}
        <TopPropertySearches />

        {/* 9. Advisory Callout Banner ("Not sure which project is right for you?") */}
        <AdvisorCtaBanner />
      </main>

      {/* 10. Footer with Giant Watermark, RERA details & Legal Navigation */}
      <Footer />
    </div>
  );
}
