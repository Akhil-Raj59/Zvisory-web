import Link from "next/link";

const HK = '"Hanken Grotesk", system-ui, sans-serif';

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "/figma-assets/Footer/instagram-icon.svg",
    bg: "#D3A479",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "/figma-assets/Footer/linkedin-icon.svg",
    bg: "#124446",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "/figma-assets/Footer/facebook.svg",
    bg: "#D3A479",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: "/figma-assets/Footer/x.svg",
    bg: "#D3A479",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: "/figma-assets/Footer/youtube-icon.svg",
    bg: "#D3A479",
  },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "0.5px solid #D3A479",
        background: "#124446",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @media (max-width: 1440px) {
          .footer-main {
            padding: 48px 48px 36px !important;
          }
          .footer-logotype span {
            font-size: clamp(48px, 7.5vw, 110px) !important;
            letter-spacing: 0.5em !important;
            padding-right: 0.5em !important;
          }
        }
        @media (max-width: 1024px) {
          .footer-main {
            padding: 40px 24px 32px !important;
            flex-direction: column !important;
            gap: 36px !important;
          }
          .footer-brand {
            width: 100% !important;
          }
          .footer-logotype span {
            font-size: clamp(36px, 8.5vw, 84px) !important;
            letter-spacing: 0.5em !important;
            padding-right: 0.5em !important;
            width: 100% !important;
          }
          .footer-legal {
            padding: 16px 24px !important;
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
          }
        }
        @media (max-width: 768px) {
          .footer-main {
            padding: 32px 16px 24px !important;
            gap: 28px !important;
          }
          .footer-logotype span {
            font-size: clamp(24px, 7.5vw, 48px) !important;
            letter-spacing: 0.5em !important;
            padding-right: 0.5em !important;
          }
        }
      `}</style>

      {/* Main Row: Brand Summary + Quick Links + RERA */}
      <div
        className="footer-main"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "60px 120px 52px",
          width: "100%",
          boxSizing: "border-box",
          gap: 40,
        }}
      >
        {/* Brand Summary + Social Row */}
        <div
          className="footer-brand"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            textAlign: "center",
          }}
        >
          <span
            style={{
              font: `600 16px/21px ${HK}`,
              color: "#FFFFFF",
            }}
          >
            Your trusted partner in finding the right property in 5 major cities of India, wherever you are in the world.
          </span>

          {/* Social Row: 5 × 36px tiles */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: social.bg,
                  textDecoration: "none",
                  flexShrink: 0,
                  padding: 4,
                  boxSizing: "border-box",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={social.icon}
                  alt={social.label}
                  width={28}
                  height={28}
                  style={{ objectFit: "contain" }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Advisor CTA (right side on desktop) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
          className="footer-advisor"
        >
          <span
            style={{
              font: `600 20px/26px ${HK}`,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Not sure which project is right for you?
          </span>
          <Link
            href="/contact"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "8px 20px",
              background: "#D3A479",
              borderRadius: 6,
              color: "#124446",
              font: `600 16px/21px ${HK}`,
              textDecoration: "none",
            }}
          >
            Speak to an Advisor
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma-assets/Browse City/arrow_right_alt_24dp_124446_FILL0_wght400_GRAD0_opsz24.svg"
              alt="arrow"
              width={20}
              height={20}
            />
          </Link>
        </div>

        {/* Quick Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              font: `600 20px/26px ${HK}`,
              color: "#D3A479",
            }}
          >
            Quick Links
          </h3>

          <div
            style={{
              display: "flex",
              gap: 20,
              font: `400 16px/21px ${HK}`,
              color: "#FFFFFF",
            }}
          >
            {/* Col 1 */}
            <div
              style={{
                width: 120,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Link href="/home-loan" style={{ color: "#FFFFFF", textDecoration: "none" }}>HOME LOAN</Link>
              <Link href="/contact" style={{ color: "#FFFFFF", textDecoration: "none" }}>CONTACT US</Link>
              <Link href="/blog" style={{ color: "#FFFFFF", textDecoration: "none" }}>BLOGS</Link>
            </div>

            {/* Col 2 */}
            <div
              style={{
                width: 127,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Link href="/careers" style={{ color: "#FFFFFF", textDecoration: "none" }}>CAREER</Link>
              <Link href="/about" style={{ color: "#FFFFFF", textDecoration: "none" }}>ABOUT US</Link>
              <Link href="/search" style={{ color: "#FFFFFF", textDecoration: "none" }}>PROPERTY TYPE</Link>
            </div>
          </div>
        </div>

        {/* RERA Numbers */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              font: `600 20px/26px ${HK}`,
              color: "#D3A479",
            }}
          >
            RERA Number
          </h3>

          <div
            style={{
              font: `400 16px/21px ${HK}`,
              color: "#FFFFFF",
              width: 301,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span>DELHI-1251/310/AG/653203/001420</span>
            <span>HARYANA-1251/310/AG/653203/001420</span>
            <span>GOA-1251/310/AG/653203/001420</span>
          </div>
        </div>
      </div>

      {/* Giant Logotype Band */}
      <div
        className="footer-logotype"
        style={{
          width: "100%",
          height: 117,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#124446",
        }}
      >
        <span
          style={{
            textAlign: "center",
            font: `600 132px/172px ${HK}`,
            letterSpacing: "0.5em",
            paddingRight: "0.5em",
            background: "linear-gradient(180deg, #FFFFFF 12.98%, #124446 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            display: "block",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          ZVISORY
        </span>
      </div>

      {/* Bottom Legal Bar */}
      <div
        className="footer-legal"
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderTop: "0.5px solid #D3A479",
          padding: "16px 120px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          font: `400 12px/16px ${HK}`,
          color: "#D3A479",
          minHeight: 50,
        }}
      >
        <span>&copy; 2026 Zvisory. All rights reserved.</span>

        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <Link href="/about" style={{ color: "#D3A479", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/about" style={{ color: "#D3A479", textDecoration: "none" }}>Terms of Use</Link>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#D3A479" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>RERA Registered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
