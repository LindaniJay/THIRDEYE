import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

type ImageFormat = 'webp' | 'jpeg' | 'png';

interface OptimizeImageOptions {
  src: string;
  width: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  outputDir?: string;
}

export async function optimizeImage({
  src,
  width,
  height,
  quality = 80,
  format = 'webp',
  outputDir = 'public/optimized',
}: OptimizeImageOptions): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    const filename = path.basename(src, path.extname(src));
    const outputPath = path.join(
      outputDir,
      `${filename}-${width}w.${format}`
    );

    // Check if optimized image already exists
    try {
      await fs.access(outputPath);
      return `/${outputPath.replace('public', '')}`;
    } catch {
      // File doesn't exist, proceed with optimization
    }

    const image = sharp(src);
    const metadata = await image.metadata();

    await image
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      })
      [format]({ quality, force: true })
      .toFile(outputPath);

    return `/${outputPath.replace('public', '')}`;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return src; // Fallback to original source on error
  }
}

// Responsive image component props
export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  quality?: number;
  format?: ImageFormat;
}

export async function getResponsiveImageProps(
  src: string,
  options: {
    widths: number[];
    quality?: number;
    format?: ImageFormat;
  }
) {
  const { widths, quality = 80, format = 'webp' } = options;
  const srcSet = await Promise.all(
    widths.map(async (width) => {
      const url = await optimizeImage({
        src,
        width,
        quality,
        format,
      });
      return `${url} ${width}w`;
    })
  );

  return {
    srcSet: srcSet.join(',\n'),
    sizes: '(max-width: 768px) 100vw, 50vw',
  };
}
