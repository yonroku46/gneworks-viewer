'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/common/utils/imageUtils';

interface AppImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallback?: React.ReactNode;
}

/**
 * S3 프리픽스 처리 및 에러 핸들링이 포함된 이미지 컴포넌트
 */
export default function AppImage({ src, fallback, ...props }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImgSrc(null);
      setHasError(true);
    } else {
      if (src.startsWith('data:')) {
        setImgSrc(src);
      } else {
        setImgSrc(getImageUrl(src));
      }
      setHasError(false);
    }
  }, [src]);

  if (hasError || !imgSrc) {
    return <>{fallback}</>;
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={props.alt || 'image'}
      onError={() => setHasError(true)}
    />
  );
}
