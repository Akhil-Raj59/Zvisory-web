"use client";

import { useState } from "react";
import { ContactModal } from "@/components/layout/ContactModal";

const HK = '"Hanken Grotesk", system-ui, sans-serif';

export function AdvisorCtaBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        style={{
          background: "#124446",
          borderBottom: "0.3px solid #D3A479",
          display: "flex",
          gap: 60,
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 60px",
          overflow: "clip",
          boxSizing: "border-box",
          width: "100%",
        }}
        className="advisor-callout"
      >
        <style>{`
          @media (max-width: 900px) {
            .advisor-callout {
              flex-direction: column !important;
              gap: 24px !important;
              padding: 40px 24px !important;
              text-align: center !important;
            }
            .advisor-copy {
              align-items: center !important;
              white-space: normal !important;
            }
          }
        `}</style>

        {/* Copy block */}
        <div
          className="advisor-copy"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <b
            style={{
              font: `600 24px/normal ${HK}`,
              color: "#FFFFFF",
            }}
          >
            Not sure which project is right for you?
          </b>
          <span
            style={{
              font: `400 16px/normal ${HK}`,
              color: "#D3A479",
            }}
          >
            Get unbiased advice, price insights and a shortlist tailored to your needs.
          </span>
        </div>

        {/* Speak to an Advisor Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            height: 50,
            padding: "0 20px",
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            background: "#D3A479",
            border: "none",
            borderRadius: 6,
            color: "#124446",
            font: `600 16px/normal ${HK}`,
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "none";
          }}
        >
          <span>Speak to an Advisor</span>
          <span style={{ fontSize: 16 }}>→</span>
        </button>
      </section>

      {modalOpen && (
        <ContactModal
          projectContext={{
            formType: "homepage_advisory_callout",
            formLocation: "homepage_advisor_banner",
            projectName: "General Advisory Consultation",
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
