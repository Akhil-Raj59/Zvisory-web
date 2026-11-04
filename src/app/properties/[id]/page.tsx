import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projectService } from "@/services/projectService";
import PropertyDetailClient from "./PropertyDetailClient";
import { siteConfig } from "@/config/site.config";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = await projectService.getAllProjects();
  return projects.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await projectService.getProjectBySlug(id);
  if (!project || (project.statusVisibility && project.statusVisibility !== "published")) {
    return {
      title: "Property Not Found | Zvisory",
      robots: { index: false, follow: false },
    };
  }

  const title =
    project.seo?.title ||
    project.seo?.ogTitle ||
    `${project.title} by ${project.developer} in ${project.city} | Zvisory`;
  const description =
    project.seo?.description ||
    project.seo?.ogDescription ||
    project.overview?.description ||
    `Explore ${project.title} luxury residential development by ${project.developer} in ${project.location || project.city}. Pricing, floor plans, and amenities.`;
  const ogImage =
    project.seo?.ogImage ||
    project.cardBanner ||
    project.bannerUrl ||
    project.image ||
    siteConfig.ogImage;

  return {
    title,
    description,
    keywords: project.seo?.keywords || project.keywords?.join(", "),
    alternates: {
      canonical: `/properties/${project.slug}`,
    },
    openGraph: {
      title: project.seo?.ogTitle || title,
      description: project.seo?.ogDescription || description,
      url: `${siteConfig.url}/properties/${project.slug}`,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo?.ogTitle || title,
      description: project.seo?.ogDescription || description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await projectService.getProjectBySlug(id);

  if (!project) notFound();

  // Respect visibility: only published projects are publicly accessible
  if (project.statusVisibility && project.statusVisibility !== "published") {
    notFound();
  }

  const similar = await projectService.getSimilarProjects(id, 3);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.title,
    description: project.overview?.description || project.title,
    url: `${siteConfig.url}/properties/${project.slug}`,
    image: project.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.city,
      addressRegion: project.microMarket || undefined,
      addressCountry: "IN",
    },
    ...(project.priceRaw > 0 && {
      offers: {
        "@type": "Offer",
        price: project.priceRaw,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient project={project} similar={similar} />
    </>
  );
}
