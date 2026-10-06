import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
            About Zvisory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#124446] tracking-tight">
            Redefining Real Estate Advisory in India
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Zvisory was founded to eliminate opacity in Indian real estate transactions. We bring empirical data, verified developer listings, and dedicated mortgage guidance to every homebuyer.
          </p>
        </div>

        {/* Mission / Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#124446] text-white flex items-center justify-center text-xl font-bold">
              🎯
            </div>
            <h2 className="text-xl font-black text-slate-900">Our Mission</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To empower luxury property buyers and investors with unbiased comparative analytics, complete RERA documentation clarity, and seamless financing.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D3A479] text-[#124446] flex items-center justify-center text-xl font-bold">
              👁️
            </div>
            <h2 className="text-xl font-black text-slate-900">Our Vision</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To become India&apos;s most trusted, technology-driven real estate advisory firm across Tier-1 metropolitan markets.
            </p>
          </div>
        </div>

        {/* Office Locations */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
          <h2 className="text-2xl font-black text-[#124446]">Our Corporate Headquarters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Gurugram (Corporate HQ)</h3>
              <p className="text-slate-600">Tower B, DLF Cyber City, Sector 24, HR 122002</p>
              <p className="text-[#124446] font-bold">Phone: +91 98765 43210</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Bengaluru Office</h3>
              <p className="text-slate-600">Outer Ring Road, Marathahalli, KA 560103</p>
              <p className="text-[#124446] font-bold">Phone: +91 80 4567 8900</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Central Delhi Regional</h3>
              <p className="text-slate-600">Barakhamba Road, Connaught Place, DL 110001</p>
              <p className="text-[#124446] font-bold">Phone: +91 11 2345 6789</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
