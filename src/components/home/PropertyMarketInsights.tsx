'use client';

import { useState } from 'react';
import Image from 'next/image';

const BLOGS = [
  {
    title: "What to look for when buying your new home",
    excerpt: "Discover the key factors to consider before buying your dream home, from location and budget to amenities and future value.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Why High-Rise Living is Dominating India's Metro Corridors",
    excerpt: "Analyzing the surging demand for integrated townships, private clubhouses, and sustainable vertical communities.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Understanding RERA Protections & Milestone Payment Schedules",
    excerpt: "A comprehensive checklist: verified title deeds, escrow bank accounts, builder delay penalties, and legal recourse.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
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
        height: '152px',
        color: '#124446',
        flex: 'none',
      }}
    >
      {/* Left image */}
      <div style={{ position: 'relative', width: '227px', height: '152px', flexShrink: 0 }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ borderRadius: '8px', objectFit: 'cover' }}
          sizes="227px"
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
        }}
      >
        <p
          style={{
            font: '600 20px/normal "Hanken Grotesk", sans-serif',
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            font: '400 16px/normal "Hanken Grotesk", sans-serif',
            margin: 0,
          }}
        >
          {excerpt}
        </p>
        <span
          style={{
            font: '500 16px/normal "Hanken Grotesk", sans-serif',
            cursor: 'pointer',
          }}
        >
          Read More →
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
      }}
    >
      {/* Heading */}
      <h2
        style={{
          font: '600 32px/normal "Plus Jakarta Sans", sans-serif',
          color: '#124446',
          width: 'clamp(90%, 880px, 90%)',
          maxWidth: '880px',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Learn more about India&apos;s property market
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
