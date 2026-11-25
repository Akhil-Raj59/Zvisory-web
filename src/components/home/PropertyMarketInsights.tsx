'use client';

import { useState } from 'react';

const BLOGS = [
  {
    title: "What to look for when buying your new home",
    excerpt: "Discover the key factors to consider before buying your dream home, from location and budget to amenities and future value.",
    image: "/figma-assets/Blogs/Project image.png",
  },
  {
    title: "Why High-Rise Living is Dominating India's Metro Corridors",
    excerpt: "Analyzing the surging demand for integrated townships, private clubhouses, and sustainable vertical communities.",
    image: "/figma-assets/Browse City/Project image (4).jpg",
  },
  {
    title: "Understanding RERA Protections & Milestone Payment Schedules",
    excerpt: "A comprehensive checklist: verified title deeds, escrow bank accounts, builder delay penalties, and legal recourse.",
    image: "/figma-assets/Browse City/Project image (2).jpg",
  },
];

function BlogCard({ title, excerpt, image }: { title: string; excerpt: string; image: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: '20px',
        width: '560px',
        minWidth: '530px',
        height: '152px',
        color: '#124446',
        flex: 'none',
        boxSizing: 'border-box',
      }}
      className="blog-card"
    >
      {/* Left image */}
      <div style={{ position: 'relative', width: '227px', height: '152px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px' }} className="blog-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
        />
      </div>

      {/* Right text column */}
      <div
        style={{
          paddingLeft: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '317px',
          boxSizing: 'border-box',
        }}
        className="blog-text-col"
      >
        <p
          style={{
            font: '600 20px/26px "Hanken Grotesk", sans-serif',
            color: '#124446',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </p>
        <p
          style={{
            font: '400 16px/21px "Hanken Grotesk", sans-serif',
            color: '#124446',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {excerpt}
        </p>
        <span
          style={{
            font: '500 16px/21px "Hanken Grotesk", sans-serif',
            color: '#124446',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Read More
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma-assets/Blogs/arrow_right_alt_24dp_124446_FILL0_wght400_GRAD0_opsz24.svg"
            alt="arrow"
            width={20}
            height={20}
            style={{ display: 'inline-block' }}
          />
        </span>
      </div>
    </div>
  );
}

function TrackSet({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      style={{
        display: 'flex',
        gap: '40px',
        alignItems: 'center',
      }}
    >
      {BLOGS.map((blog, i) => (
        <BlogCard key={i} {...blog} />
      ))}
    </div>
  );
}

export function PropertyMarketInsights() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      style={{
        background: '#F8FFFB',
        padding: '60px 0 72px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '56px',
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
      className="blogs-section"
    >
      <style>{`
        @media (max-width: 767px) {
          .blogs-section {
            padding: 40px 0 48px !important;
            gap: 24px !important;
          }
          .blog-card {
            width: 290px !important;
            min-width: 290px !important;
            height: auto !important;
            flex-direction: column !important;
          }
          .blog-img-wrap {
            width: 100% !important;
            height: 160px !important;
          }
          .blog-text-col {
            width: 100% !important;
            padding-left: 0 !important;
            padding-top: 12px !important;
          }
        }
      `}</style>

      {/* Heading */}
      <h2
        style={{
          font: '600 32px/40px "Plus Jakarta Sans", sans-serif',
          color: '#124446',
          width: '100%',
          maxWidth: '1581px',
          textAlign: 'center',
          margin: 0,
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        Learn more about the India’s property market
      </h2>

      {/* Marquee scroller */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div
          className="animate-marquee"
          style={{
            display: 'flex',
            gap: '56px',
            width: 'max-content',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Track A */}
          <TrackSet />
          {/* Track B — aria-hidden for seamless loop */}
          <TrackSet ariaHidden />
        </div>
      </div>
    </section>
  );
}
