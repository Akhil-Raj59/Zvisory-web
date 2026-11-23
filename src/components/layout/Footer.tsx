import Link from "next/link";

const HK = '"Hanken Grotesk", system-ui, sans-serif';

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
            font-size: clamp(36px, 9vw, 96px) !important;
            letter-spacing: clamp(8px, 3vw, 40px) !important;
            padding-right: clamp(8px, 3vw, 40px) !important;
            width: auto !important;
          }
          .footer-legal {
            padding: 16px 24px !important;
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
          }
        }
      `}</style>

      {/* Main Row: Brand, Quick Links, RERA */}
      <div
        className="footer-main"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "60px 150px 52px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Brand Summary */}
        <div
          className="footer-brand"
          style={{
            width: 568,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            textAlign: "center",
            color: "#FFFFFF",
            font: `600 20px/normal ${HK}`,
          }}
        >
          <span>
            Your trusted partner in finding the right property in 5 major cities of India, wherever you are in the world.
          </span>

          {/* Social Row: 5 tiles */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              marginTop: 6,
            }}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              style={{
                width: 36,
                height: 36,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid #D3A479",
                color: "#D3A479",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ig
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              style={{
                width: 36,
                height: 36,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#124446",
                border: "1px solid #D3A479",
                color: "#D3A479",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              in
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              style={{
                width: 36,
                height: 36,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#D3A479",
                color: "#124446",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              f
            </a>

            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              style={{
                width: 36,
                height: 36,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid #D3A479",
                color: "#D3A479",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              𝕏
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              style={{
                width: 36,
                height: 36,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#D3A479",
                color: "#124446",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              yt
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div
          style={{
            width: 266,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3
            style={{
              margin: 0,
              font: `600 24px/normal ${HK}`,
              color: "#D3A479",
            }}
          >
            Quick Links
          </h3>

          <div
            style={{
              display: "flex",
              gap: 20,
              width: 263,
              font: `400 16px/normal ${HK}`,
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
              <Link href="/home-loan" style={{ color: "#FFFFFF", textDecoration: "none" }} className="hover:text-[#D3A479]">
                HOME LOAN
              </Link>
              <Link href="/contact" style={{ color: "#FFFFFF", textDecoration: "none" }} className="hover:text-[#D3A479]">
                CONTACT US
              </Link>
              <Link href="/blog" style={{ color: "#FFFFFF", textDecoration: "none" }} className="hover:text-[#D3A479]">
                BLOGS
              </Link>
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
              <Link href="/careers" style={{ color: "#FFFFFF", textDecoration: "none" }} className="hover:text-[#D3A479]">
                CAREER
              </Link>
              <Link href="/about" style={{ color: "#FFFFFF", textDecoration: "none" }} className="hover:text-[#D3A479]">
                ABOUT US
              </Link>
              <Link href="/search" style={{ color: "#FFFFFF", textDecoration: "none" }} className="hover:text-[#D3A479]">
                PROPERTY TYPE
              </Link>
            </div>
          </div>
        </div>

        {/* RERA Number */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "clip",
          }}
        >
          <h3
            style={{
              margin: 0,
              font: `600 24px/normal ${HK}`,
              color: "#D3A479",
            }}
          >
            RERA Number
          </h3>

          <div
            style={{
              font: `400 16px/normal ${HK}`,
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
        }}
      >
        <span
          style={{
            width: 1331,
            textAlign: "center",
            font: `600 132px/normal ${HK}`,
            letterSpacing: "113.52px",
            paddingRight: "113.52px",
            background: "linear-gradient(to bottom, #FFFFFF 12.981%, #124446 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            display: "block",
            userSelect: "none",
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
          padding: "22px 60px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          font: `400 12px/normal ${HK}`,
          color: "#D3A479",
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
          <Link href="/about" style={{ color: "#D3A479", textDecoration: "none" }} className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/about" style={{ color: "#D3A479", textDecoration: "none" }} className="hover:underline">
            Terms of Use
          </Link>
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
