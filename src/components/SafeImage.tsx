"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc: string;
}

export function SafeImage({ src, alt, className, fallbackSrc }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}