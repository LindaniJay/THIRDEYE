import React, { useState, useEffect } from 'react';
import { getResponsiveImageProps } from '../utils/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'eager' | 'lazy';
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  sizes?: string;
  fallbackSrc?: string;
  blurDataURL?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  quality = 80,
  format = 'webp',
  sizes = '(max-width: 768px) 100vw, 50vw',
  fallbackSrc,
  blurDataURL,
}) => {
  const [imageProps, setImageProps] = useState<{
    srcSet?: string;
    src?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        // In development, use the original image
        if (process.env.NODE_ENV === 'development') {
          if (isMounted) {
            setImageProps({ src });
            setIsLoading(false);
          }
          return;
        }

        // In production, generate responsive images
        const responsiveProps = await getResponsiveImageProps(src, {
          widths: [320, 640, 960, 1280, 1920],
          quality,
          format,
        });

        if (isMounted) {
          setImageProps({
            srcSet: responsiveProps.srcSet,
            sizes: responsiveProps.sizes,
            src: src, // Fallback src
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, quality, format]);

  // Show a placeholder while loading
  if (isLoading && blurDataURL) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{
          width: '100%',
          paddingBottom: `${(height / width) * 100}%`,
          backgroundImage: `url(${blurDataURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
        }}
      />
    );
  }

  // Handle error state
  if (error && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
      />
    );
  }

  // Render the optimized image
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        paddingBottom: `${(height / width) * 100}%`,
      }}
    >
      <img
        {...imageProps}
        alt={alt}
        className="absolute top-0 left-0 w-full h-full object-cover"
        loading={loading}
        width={width}
        height={height}
        onError={() => setError(true)}
      />
    </div>
  );
};

export default OptimizedImage;
