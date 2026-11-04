import { getCurrentUser } from "@/lib/auth";
import { projectService } from "@/services/projectService";
import { cityService } from "@/services/cityService";
import { developerService } from "@/services/developerService";
import { MOCK_TESTIMONIALS } from "@/mock/testimonials";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CitySelection } from "@/components/home/CitySelection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { LeadCollection } from "@/components/home/LeadCollection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { DeveloperShowcase } from "@/components/home/DeveloperShowcase";
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1.1 Header */}
      <Header user={user} />

      <main className="flex-1 space-y-2">
        {/* 1.2 Banner Section with Search Bar */}
        <HeroBanner />

        {/* 1.3 City Selection Section — Live data from backend /api/v1/cities */}
        <CitySelection cities={cities} />

        {/* 1.4 Featured Projects — Live data from backend /api/v1/projects/featured */}
        <FeaturedProjectsSection projects={featuredProjects} />

        {/* 1.5 Developer Showcase — Live data from backend /api/v1/developers */}
        <DeveloperShowcase developers={developers} />

        {/* 1.6 Why Choose Us Section */}
        <WhyChooseUs />

        {/* 1.7 Lead Collection Box 1 */}
        <LeadCollection contextText="Connect with a Zvisory senior real estate advisor for instant project details, brochure downloads, and site visit arrangements." />

        {/* 1.8 Testimonials Section */}
        <TestimonialsSection testimonials={MOCK_TESTIMONIALS} />

        {/* 1.9 Lead Collection Box 2 */}
        <LeadCollection contextText="Want custom ROI calculations, 54EC capital gains advisory, or rental yield planning for your luxury property investments?" />
      </main>

      {/* 1.10 Footer */}
      <Footer />
    </div>
  );
}
