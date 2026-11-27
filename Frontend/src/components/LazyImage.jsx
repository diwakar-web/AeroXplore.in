import React, { useState, useEffect } from 'react';
import '../CSS/LazyImage.css';

const DEFAULT_FALLBACK = '/images/Background.webp';

/**
 * LazyImage component
 * - Employs native lazy loading (loading="lazy", decoding="async")
 * - Shimmer radar skeleton placeholder while fetching
 * - Buttery smooth fade-in once loaded
 * - Graceful fallback to WebP background if image fails to load
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  fallbackSrc = DEFAULT_FALLBACK,
  priority = false,
  style = {},
  wrapperStyle = {},
  onLoad,
  onError,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Sync if src prop changes
  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setIsLoaded(false);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    if (onError) onError(e);
  };

  return (
    <div
      className={`lazy-img-wrapper ${wrapperClassName} ${isLoaded ? 'loaded' : 'loading'}`}
      style={wrapperStyle}
    >
      {/* High-tech shimmer skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="lazy-img-skeleton" aria-hidden="true">
          <div className="lazy-img-radar-ping" />
        </div>
      )}

      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-img-element ${isLoaded ? 'is-visible' : 'is-hidden'} ${className}`}
        style={style}
        {...props}
      />
    </div>
  );
}
