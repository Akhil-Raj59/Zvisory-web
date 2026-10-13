import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projectService } from "@/services/projectService";
import PropertyDetailClient from "./PropertyDetailClient";

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
  if (!project) return { title: "Property Not Found | Zvisory" };

  return {
    title: project.seo.ogTitle || `${project.title} | Zvisory`,
    description: project.seo.ogDescription || project.overview.description,
    alternates: {
      canonical: `/properties/${project.slug}`,
    },
    openGraph: {
      title: project.seo.ogTitle || project.title,
      description: project.seo.ogDescription || project.overview.description,
      images: project.seo.ogImage ? [{ url: project.seo.ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.ogTitle || project.title,
      description: project.seo.ogDescription,
      images: project.seo.ogImage ? [project.seo.ogImage] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await projectService.getProjectBySlug(id);

  if (!project) notFound();

  const similar = await projectService.getSimilarProjects(id, 3);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.title,
    description: project.overview.description,
    url: `https://zvisory.com/properties/${project.slug}`,
    image: project.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.city,
      addressRegion: project.microMarket,
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
