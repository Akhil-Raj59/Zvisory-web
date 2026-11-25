"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ContactModal } from "./ContactModal";
import { useAuth } from "@/components/auth/AuthProvider";

const hankenFont: React.CSSProperties = {
  fontFamily: 'var(--font-hanken, "Hanken Grotesk"), system-ui, sans-serif',
};

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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "#124446",
          boxSizing: "border-box",
        }}
      >
        {/* ── DESKTOP LAYOUT (lg+) ── */}
        <div
          className="hidden lg:flex items-center justify-center px-6 lg:px-12 xl:px-[120px]"
          style={{
            height: "79px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          {/* Inner row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo — 120×40 Figma original */}
            <Link
              href="/"
              className="flex items-center"
              style={{
                width: 120,
                height: 40,
                textDecoration: "none",
              }}
            >
              <Image
                src="/figma-assets/Header+ banner/Zvisory logo 1.svg"
                alt="Zvisory"
                width={120}
                height={40}
                priority
                style={{ objectFit: "contain", width: 120, height: 40 }}
              />
            </Link>

            {/* Nav links */}
            <nav
              style={{
                display: "flex",
                gap: 32,
                alignItems: "center",
                padding: "4px 4px 6px",
              }}
            >
              {[
                { label: "City", href: "/cities" },
                { label: "Projects", href: "/search" },
                { label: "Home Loan", href: "/home-loan" },
                { label: "About Us", href: "/about" },
                { label: "Compare", href: "/search?compare=true" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    ...hankenFont,
                    fontWeight: 600,
                    fontSize: 20,
                    color: "#F8FFFB",
                    textDecoration: "none",
                  }}
                  className="hover:text-[#D3A479] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right group */}
            <div
              style={{
                display: "flex",
                gap: 32,
                alignItems: "center",
              }}
            >
              {/* Bookmark icon — 40×40 */}
              <Link
                href="/search?saved=true"
                aria-label="Saved Projects"
                title="Saved Projects"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F8FFFB",
                  flexShrink: 0,
                }}
                className="hover:text-[#D3A479] transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </Link>

              {/* Enquire Now button */}
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                style={{
                  ...hankenFont,
                  width: 125,
                  height: 47,
                  padding: "12px 16px",
                  border: "1px solid #F8FFFB",
                  borderRadius: 6,
                  background: "transparent",
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#F8FFFB",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
                className="hover:bg-white/10 transition-colors"
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
          </div>
        </div>

        {/* ── MOBILE LAYOUT (<lg) ── */}
        <div className="flex lg:hidden items-center justify-between px-4 h-[52px]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/figma-assets/Header+ banner/Zvisory logo 1.svg"
              alt="Zvisory"
              width={90}
              height={28}
              priority
              style={{ objectFit: "contain", width: 90, height: 28 }}
            />
          </Link>

          {/* Mobile Right Controls: Bookmark + Hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/search?saved=true"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              aria-label="Saved Projects"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 focus:outline-none"
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
