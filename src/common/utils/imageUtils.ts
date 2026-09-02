const S3_PREFIX = process.env.NEXT_PUBLIC_S3_PREFIX;

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  
  // 이미 전체 URL인 경우 (http:// 또는 https:// 로 시작하거나 data: 로 시작하는 경우)
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  // S3 프리픽스가 설정되어 있고, 경로가 / 로 시작하지 않으면 / 를 붙여줌
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (S3_PREFIX) {
    return `https://${S3_PREFIX}${cleanPath}`;
  }

  return cleanPath;
};
