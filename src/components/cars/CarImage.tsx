'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CarImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CarImage({ src, alt, className = '' }: CarImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simple base64 encoded placeholder image
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMWIxZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
      )}
      <Image
        src={error ? fallbackImage : src}
        alt={alt}
        fill
        className={`object-cover rounded-lg transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        priority
        unoptimized
      />
    </div>
  );
} 