"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactModal } from "./ContactModal";

export function Header({ user }: { user?: { fullName?: string; email?: string; role?: string } | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user || !user.role) return "/login";
    const role = user.role.toUpperCase();
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "EMPLOYEE") return "/dashboard/employee";
    return "/dashboard/customer";
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#124446] text-white shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left Section - Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#D3A479] flex items-center justify-center text-[#124446] font-black text-xl shadow-inner group-hover:scale-105 transition-transform">
              Z
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-white leading-none">
                Zvisory
              </span>
              <span className="text-[10px] tracking-widest text-[#D3A479] uppercase font-semibold">
                Real Estate Advisory
              </span>
            </div>
          </Link>

          {/* Center/Right Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {/* Property Type Dropdown */}
            <div className="relative" onMouseLeave={() => setPropertyTypeOpen(false)}>
              <button
                onMouseEnter={() => setPropertyTypeOpen(true)}
                onClick={() => setPropertyTypeOpen(!propertyTypeOpen)}
                className="flex items-center gap-1.5 py-2 hover:text-[#D3A479] transition-colors cursor-pointer"
              >
                <span>Property Type</span>
                <svg className={`w-4 h-4 transition-transform ${propertyTypeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {propertyTypeOpen && (
                <div className="absolute top-full left-0 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link href="/search?type=High+Rise" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] text-sm">
                    High Rise Apartments
                  </Link>
                  <Link href="/search?type=Low+Rise" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] text-sm">
                    Low Rise Floors
                  </Link>
                  <Link href="/search?type=Plots" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] text-sm">
                    Residential Plots
                  </Link>
                  <Link href="/search?type=Commercial" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] text-sm">
                    Commercial Spaces
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
              <button
                onMouseEnter={() => setServicesOpen(true)}
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1.5 py-2 hover:text-[#D3A479] transition-colors cursor-pointer"
              >
                <span>Services</span>
                <svg className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link href="/search" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] text-sm">
                    Buying Assistance
                  </Link>
                  <Link href="/about" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] text-sm">
                    Property Advisory
                  </Link>
                  <Link href="/home-loan" className="block px-4 py-2 hover:bg-[#BDD4E7]/30 hover:text-[#124446] font-semibold text-[#124446] text-sm">
                    Home Loan &amp; EMI Calculator
                  </Link>
                </div>
              )}
            </div>

            <Link href="/blog" className="hover:text-[#D3A479] transition-colors">
              Blogs
            </Link>

            <Link href="/careers" className="hover:text-[#D3A479] transition-colors">
              Careers
            </Link>

            <Link href="/about" className="hover:text-[#D3A479] transition-colors">
              About Us
            </Link>

            {/* Contact Modal Trigger Button */}
            <button
              onClick={() => setContactModalOpen(true)}
              className="hover:text-[#D3A479] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Contact</span>
              <span className="w-2 h-2 rounded-full bg-[#D3A479]"></span>
            </button>

            {/* User Account / Dashboard Link */}
            {user ? (
              <Link
                href={getDashboardLink()}
                className="ml-2 px-4 py-2 rounded-lg bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Dashboard ({user.fullName?.split(" ")[0] || "User"})
              </Link>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg border border-[#D3A479] text-[#D3A479] hover:bg-[#D3A479] hover:text-[#124446] text-xs font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-[#D3A479] text-[#124446] hover:bg-[#b88c63] text-xs font-bold transition-colors shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-[#124446]/80 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#124446] border-t border-[#8693AB]/30 px-4 pt-4 pb-6 space-y-3">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium"
            >
              Explore Properties
            </Link>
            <Link
              href="/home-loan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium text-[#D3A479]"
            >
              Home Loan &amp; EMI Calculator
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium"
            >
              Blogs
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium"
            >
              Careers
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium"
            >
              About Us
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setContactModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium text-[#D3A479]"
            >
              Contact Us (Callback)
            </button>

            <div className="pt-4 border-t border-[#8693AB]/20 flex flex-col gap-2">
              {user ? (
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-lg bg-[#D3A479] text-[#124446] font-bold text-sm"
                >
                  Go to Dashboard ({user.fullName?.split(" ")[0]})
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-lg border border-[#D3A479] text-[#D3A479] font-medium text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-lg bg-[#D3A479] text-[#124446] font-bold text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Contact Pop-up Modal */}
      {contactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}
    </>
  );
}
