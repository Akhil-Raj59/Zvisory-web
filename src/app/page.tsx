import { getCurrentUser } from "@/lib/auth";
import { propertyService } from "@/services/propertyService";
import { MOCK_TESTIMONIALS } from "@/mock/testimonials";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CitySelection } from "@/components/home/CitySelection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { LeadCollection } from "@/components/home/LeadCollection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";

export const metadata = {
  title: "Zvisory | Luxury Real Estate & Property Advisory",
  description: "Explore verified luxury high-rise apartments, low-rise floors, plots, and commercial properties with expert advisory and home loan assistance."
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const featuredProperties = await propertyService.getFeaturedProperties();
  const cities = await propertyService.getAllCities();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1.1 Header */}
      <Header user={user} />

      <main className="flex-1">
        {/* 1.2 Banner Section with Search Bar */}
        <HeroBanner />

        {/* 1.3 City Selection Section */}
        <CitySelection cities={cities} />

        {/* Featured Projects Section */}
        <FeaturedProjectsSection properties={featuredProperties} />

        {/* 1.4 Why Choose Us Section */}
        <WhyChooseUs />

        {/* 1.5 Lead Collection Box 1 */}
        <LeadCollection contextText="Connect with a Zvisory senior real estate advisor for instant project details, brochure downloads, and site visit arrangements." />

        {/* 1.6 Testimonials Section */}
        <TestimonialsSection testimonials={MOCK_TESTIMONIALS} />

        {/* 1.7 Lead Collection Box 2 */}
        <LeadCollection contextText="Want custom ROI calculations or tax planning advice for property investments?" />
      </main>

      {/* 1.9 Footer with 1.8 Sitemap Links */}
      <Footer />
    </div>
  );
}
