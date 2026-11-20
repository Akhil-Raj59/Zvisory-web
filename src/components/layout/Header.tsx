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
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user || !user.role) return "/login";
    const role = user.role.toUpperCase();
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "EMPLOYEE") return "/dashboard/employee";
    return "/dashboard/customer";
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#124446] text-white shadow-md transition-all border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left Section - Logo matching Figma Design */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#D3A479] flex items-center justify-center text-[#124446] font-black text-xl shadow-inner group-hover:scale-105 transition-transform">
              Z
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                ZVISORY
              </span>
              <span className="text-[9px] tracking-widest text-[#D3A479] uppercase font-bold mt-0.5">
                Real Estate Advisors
              </span>
            </div>
          </Link>

          {/* Center Desktop Navigation matching Figma */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-white/90">
            <Link
              href="/cities"
              className="hover:text-[#D3A479] transition-colors py-1"
            >
              City
            </Link>

            <Link
              href="/search"
              className="hover:text-[#D3A479] transition-colors py-1"
            >
              Projects
            </Link>

            <Link
              href="/home-loan"
              className="hover:text-[#D3A479] transition-colors py-1"
            >
              Home Loan
            </Link>

            <Link
              href="/about"
              className="hover:text-[#D3A479] transition-colors py-1"
            >
              About Us
            </Link>

            <Link
              href="/search?compare=true"
              className="flex items-center gap-1.5 hover:text-[#D3A479] transition-colors py-1"
            >
              <span>Compare</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#E6FFF1] text-[#124446]">
                New
              </span>
            </Link>
          </nav>

          {/* Right Desktop Actions matching Figma */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Bookmark / Saved Properties Link */}
            <Link
              href="/search?saved=true"
              className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white hover:text-[#D3A479] transition-all"
              aria-label="Saved Projects"
              title="Saved Projects"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>

            {/* Enquire Now CTA Button */}
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#D3A479] hover:bg-[#c29367] text-[#124446] font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Enquire Now
            </button>

            {/* User Account State Handling */}
            {isLoading ? (
              <div className="w-20 h-9 rounded-lg bg-white/10 animate-pulse ml-1" />
            ) : user ? (
              <div className="relative ml-1" onMouseLeave={() => setAccountMenuOpen(false)}>
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
                    <span className="text-xs font-bold max-w-[100px] truncate">
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
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-[#E6FFF1] hover:text-[#124446] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#124446]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-[#E6FFF1] hover:text-[#124446] transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#124446]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>

                      <Link
                        href="/change-password"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold hover:bg-[#E6FFF1] hover:text-[#124446] transition-colors"
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
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg border border-[#D3A479] text-[#D3A479] hover:bg-[#D3A479] hover:text-[#124446] text-xs font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-[#D3A479] text-[#124446] hover:bg-[#c29367] text-xs font-bold transition-colors shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Bookmark + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/search?saved=true"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
              aria-label="Saved Projects"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
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
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#124446] border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
            <Link
              href="/cities"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-semibold text-white"
            >
              City
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-semibold text-white"
            >
              Projects
            </Link>
            <Link
              href="/home-loan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-semibold text-[#D3A479]"
            >
              Home Loan
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-semibold text-white"
            >
              About Us
            </Link>
            <Link
              href="/search?compare=true"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-semibold text-white"
            >
              Compare Properties
            </Link>
            <Link
              href="/developers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium text-white/80"
            >
              Developers Directory
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-white/10 text-base font-medium text-white/80"
            >
              Market Insights &amp; Blog
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setContactModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-[#D3A479] text-[#124446] font-extrabold text-sm uppercase tracking-wider shadow-md text-center mt-2 cursor-pointer"
            >
              Enquire Now
            </button>
          </div>
        )}
      </header>

      {/* Contact Pop-up Modal */}
      {contactModalOpen && (
        <ContactModal
          onClose={() => setContactModalOpen(false)}
          projectContext={{
            formType: "header_contact_modal",
            formLocation: "header_navigation",
          }}
        />
      )}
    </>
  );
}
