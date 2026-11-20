import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-[#124446] text-white pt-16 pb-12 overflow-hidden border-t border-white/10">
      {/* Giant Designer Watermark: Z V I S O R Y */}
      <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-white/[0.04] text-[80px] sm:text-[140px] lg:text-[200px] font-black tracking-[0.25em] select-none pointer-events-none whitespace-nowrap">
        ZVISORY
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#D3A479] flex items-center justify-center text-[#124446] font-black text-xl shadow-inner">
                Z
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">
                  ZVISORY
                </span>
                <span className="text-[10px] tracking-widest text-[#D3A479] uppercase font-bold mt-0.5">
                  Real Estate Advisors
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#E6FFF1]/80 leading-relaxed max-w-md">
              Zvisory is an elite real estate advisory platform delivering high-precision property comparative analytics, transparent pricing insights, and end-to-end home loan assistance across India&apos;s prime metro hubs.
            </p>

            <div className="text-xs text-[#E6FFF1]/60 space-y-1 pt-1">
              <div>Legal Entity: Zvisory Advisory Services Pvt. Ltd.</div>
              <div>
                RERA Registration:{" "}
                <span className="text-[#D3A479] font-medium">HARERA/GGM/2024/RERA-0912</span>
              </div>
              <div>
                MahaRERA Reference:{" "}
                <span className="text-[#D3A479] font-medium">A51900034821</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3A479] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#E6FFF1]/80">
              <li>
                <Link href="/cities" className="hover:text-white transition-colors">
                  Explore Cities
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  New Projects
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-white transition-colors">
                  Top Developers
                </Link>
              </li>
              <li>
                <Link href="/home-loan" className="hover:text-white transition-colors">
                  Home Loan Calculator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Market Insights &amp; Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
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
              Headquarters
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#E6FFF1]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#D3A479]">📍</span>
                <span>DLF Cyber City, Tower B, Sector 24, Gurugram, HR 122002</span>
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
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D3A479] hover:text-[#124446] flex items-center justify-center font-bold text-xs transition-colors"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D3A479] hover:text-[#124446] flex items-center justify-center font-bold text-xs transition-colors"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D3A479] hover:text-[#124446] flex items-center justify-center font-bold text-xs transition-colors"
                aria-label="Instagram"
              >
                ig
              </a>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3A479] mb-2">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-1.5 text-xs text-[#E6FFF1]/60">
              <li><Link href="/about" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-white">Terms &amp; Conditions</Link></li>
              <li><Link href="/about" className="hover:text-white">RERA Compliance Statement</Link></li>
              <li><Link href="/about" className="hover:text-white">Disclaimers &amp; Fair Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E6FFF1]/60 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Zvisory Advisory Services Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>ISO 9001:2015 Certified Advisory</span>
            <span>•</span>
            <span>RERA Registered Channel Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
