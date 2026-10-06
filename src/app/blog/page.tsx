import Link from "next/link";
import { MOCK_BLOGS } from "@/mock/blogs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
            Market Research &amp; Insights
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#124446] tracking-tight">
            Zvisory Property Journal
          </h1>
          <p className="text-sm text-slate-600">
            In-depth analysis of Indian real estate market trends, home loan tips, and investment strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_BLOGS.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <img src={blog.image} alt={blog.title} className="h-48 w-full object-cover" />
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8693AB]">
                    <span>{blog.category}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h2 className="font-bold text-slate-900 text-lg leading-snug hover:text-[#124446] transition-colors cursor-pointer">
                    {blog.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{blog.excerpt}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>By {blog.author}</span>
                  <span className="font-bold text-[#124446]">Read Article →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
