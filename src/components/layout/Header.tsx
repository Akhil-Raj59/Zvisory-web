"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactModal } from "./ContactModal";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header({
  user: propUser,
}: {
  user?: {
    fullName?: string;
    email?: string;
    role?: string;
    avatar?: { secure_url?: string };
  } | null;
}) {
  const { user: authUser, logout, isLoading } = useAuth();
  // Prefer explicitly passed prop if present, else fall back to auth context
  const user = propUser !== undefined ? propUser : authUser;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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
                <svg
                  className={`w-4 h-4 transition-transform ${propertyTypeOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <svg
                  className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

            {/* User Account State Handling */}
            {isLoading ? (
              <div className="w-24 h-9 rounded-lg bg-white/10 animate-pulse ml-2" />
            ) : user ? (
              <div className="relative ml-2" onMouseLeave={() => setAccountMenuOpen(false)}>
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  onMouseEnter={() => setAccountMenuOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 cursor-pointer"
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#D3A479] text-[#124446] font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                    {user.avatar?.secure_url &&
                    user.avatar.secure_url !==
                      "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar.secure_url}
                        alt={user.fullName || "Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (user.fullName || "User").slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold max-w-[110px] truncate">
                      {user.fullName?.split(" ")[0] || "User"}
                    </span>
                    <span className="text-[9px] text-[#D3A479] uppercase font-bold tracking-wider">
                      {user.role || "CUSTOMER"}
                    </span>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-[#D3A479] transition-transform ${accountMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Account Dropdown Menu */}
                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email || ""}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#124446]/10 text-[#124446]">
                        Role: {user.role || "CUSTOMER"}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-[#BDD4E7]/30 hover:text-[#124446] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#124446]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-[#BDD4E7]/30 hover:text-[#124446] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#124446]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>

                      <Link
                        href="/change-password"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-[#BDD4E7]/30 hover:text-[#124446] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#124446]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Change Password
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={async () => {
                          setAccountMenuOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              {isLoading ? (
                <div className="w-full h-10 rounded-lg bg-white/10 animate-pulse" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white/10 rounded-xl space-y-0.5">
                    <p className="text-xs font-bold text-white">{user.fullName || "User"}</p>
                    <p className="text-[11px] text-[#BDD4E7]">{user.email || ""}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D3A479] text-[#124446]">
                      Role: {user.role || "CUSTOMER"}
                    </span>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-lg bg-[#D3A479] text-[#124446] font-bold text-sm block"
                  >
                    Go to Dashboard
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-center rounded-lg bg-white/10 text-white font-medium text-xs hover:bg-white/20 block"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/change-password"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 text-center rounded-lg bg-white/10 text-white font-medium text-xs hover:bg-white/20 block"
                    >
                      Change Password
                    </Link>
                  </div>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full py-2.5 text-center rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
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
