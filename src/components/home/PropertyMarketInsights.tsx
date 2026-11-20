import Link from "next/link";

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  readTime: string;
  slug: string;
}

const ARTICLES: Article[] = [
  {
    id: "article-1",
    title: "What to look for when buying ur new home",
    category: "Buyer's Guide",
    excerpt:
      "Discover the key factors to consider before buying your dream home, from location and budget to amenities and future value.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    readTime: "5 min read",
    slug: "what-to-look-for-when-buying-your-new-home",
  },
  {
    id: "article-2",
    title: "Why High-Rise Living is Dominating India's Metro Corridors",
    category: "Market Trends",
    excerpt:
      "Analyzing the surging demand for integrated townships, private clubhouses, and sustainable vertical communities across NCR, Bengaluru and Hyderabad.",
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    readTime: "7 min read",
    slug: "why-high-rise-living-dominates-metro-corridors",
  },
  {
    id: "article-3",
    title: "Understanding RERA Protections & Milestone Payment Schedules",
    category: "Legal & Advisory",
    excerpt:
      "A comprehensive checklist for home buyers: verified title deeds, escrow bank accounts, builder delay penalties, and legal recourse under state RERA.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
    readTime: "6 min read",
    slug: "understanding-rera-protections-and-payment-schedules",
  },
];

export function PropertyMarketInsights() {
  return (
    <section className="py-16 bg-white border-b border-[#E5EDE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Figma */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              Industry Intelligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#124446] tracking-tight mt-1">
              Learn more about the India’s property market
            </h2>
            <p className="text-xs sm:text-sm text-[#557173] mt-1 max-w-xl">
              Stay ahead with curated advisory insights, regulatory updates, and market trends to navigate luxury real estate with confidence.
            </p>
          </div>

          <Link
            href="/blog"
            className="text-xs font-bold text-[#124446] hover:text-[#D3A479] transition-colors shrink-0"
          >
            Explore All Insights →
          </Link>
        </div>

        {/* 3 Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E5EDE9] shadow-sm hover:shadow-xl hover:border-[#124446]/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#124446] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                  {article.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {article.readTime}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-[#124446] text-lg group-hover:text-[#D3A479] transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog`}>{article.title}</Link>
                  </h3>
                  <p className="text-xs text-[#557173] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-3 border-t border-[#E5EDE9] flex items-center justify-between">
                  <Link
                    href={`/blog`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#124446] group-hover:text-[#D3A479] transition-colors"
                  >
                    <span>Read More</span>
                    <span className="text-sm">→</span>
                  </Link>
                  <span className="text-[11px] text-[#557173]">Zvisory Editorial</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

