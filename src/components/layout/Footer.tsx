import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#124446] text-white pt-16 pb-12 border-t border-[#8693AB]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#8693AB]/30">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#D3A479] flex items-center justify-center text-[#124446] font-black text-xl shadow-inner">
                Z
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Zvisory
              </span>
            </div>
            <p className="text-sm text-[#BDD4E7] leading-relaxed max-w-md">
              Zvisory is a modern, trusted real estate advisory platform delivering high-precision property comparative analytics, personalized buying advice, and end-to-end home loan assistance.
            </p>
            <div className="text-xs text-[#8693AB] space-y-1">
              <div>Legal Entity: Zvisory Advisory Services Pvt. Ltd.</div>
              <div>RERA Registration No: <span className="text-[#D3A479] font-medium">HARERA/GGM/2024/RERA-0912</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3A479] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#BDD4E7]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Explore Properties
                </Link>
              </li>
              <li>
                <Link href="/home-loan" className="hover:text-white transition-colors">
                  Home Loan EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blogs &amp; Insights
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3A479] mb-4">
              Contact Info
            </h4>
            <ul className="space-y-2.5 text-sm text-[#BDD4E7]">
              <li className="flex items-start gap-2">
                <span className="text-[#D3A479]">📍</span>
                <span>Tower B, DLF Cyber City, Sector 24, Gurugram, HR 122002</span>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-[#D3A479]">📞</span>
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@zvisory.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-[#D3A479]">✉️</span>
                  <span>contact@zvisory.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Legal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3A479] mb-4">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#D3A479] hover:text-[#124446] flex items-center justify-center font-bold transition-colors"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#D3A479] hover:text-[#124446] flex items-center justify-center font-bold transition-colors"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#D3A479] hover:text-[#124446] flex items-center justify-center font-bold transition-colors"
                aria-label="Instagram"
              >
                ig
              </a>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3A479] mb-2">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-1.5 text-xs text-[#8693AB]">
              <li><Link href="/about" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-white">Terms &amp; Conditions</Link></li>
              <li><Link href="/about" className="hover:text-white">RERA Compliance Statement</Link></li>
            </ul>
          </div>
        </div>

        {/* Section 1.8 Link Sitemap for SEO Interlinking */}
        <div className="py-6 border-b border-[#8693AB]/20">
          <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#D3A479] mb-3">
            Popular Searches &amp; Sitemap Links
          </h5>
          <div className="flex flex-wrap gap-[#8693AB] gap-x-4 gap-y-2 text-xs text-[#BDD4E7]">
            <Link href="/cities/gurugram" className="hover:underline">Properties in Gurugram</Link>
            <span>•</span>
            <Link href="/cities/delhi" className="hover:underline">Luxury Apartments Delhi</Link>
            <span>•</span>
            <Link href="/cities/bengaluru" className="hover:underline">High Rise Bengaluru</Link>
            <span>•</span>
            <Link href="/cities/noida" className="hover:underline">Noida Expressway Projects</Link>
            <span>•</span>
            <Link href="/home-loan" className="hover:underline">EMI Calculator</Link>
            <span>•</span>
            <Link href="/search?type=Low+Rise" className="hover:underline">Independent Floors</Link>
            <span>•</span>
            <Link href="/search?budget=Under+1+Cr" className="hover:underline">Under 1 Cr Properties</Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8693AB]">
          <div>
            &copy; {new Date().getFullYear()} Zvisory Advisory Services Pvt. Ltd. All rights reserved.
          </div>
         
        </div>
      </div>
    </footer>
  );
}
