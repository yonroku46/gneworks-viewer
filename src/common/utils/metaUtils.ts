import { Metadata } from 'next';

type MetadataType = 'home' | 'contact' | 'manage' | 'manage/dashboard' | 
                    'login' | 'portal';

const APP_NAME = "GNEWorks";
const APP_DESCRIPTION = "GNE 온라인 포탈관리시스템";
const APP_URL = process.env.NEXT_PUBLIC_APP_ADDRESS || "http://localhost:3000";

const PAGE_INFO: Record<MetadataType, { title: string; description?: string }> = {
  home: {
    title: 'GNE Works',
    description: APP_DESCRIPTION
  },
  contact: {
    title: '문의하기',
    description: '서비스에 대한 문의사항이나 제안을 남겨주시면 신속하게 답변해드리겠습니다.'
  },
  login: {
    title: '로그인',
    description: `${APP_NAME} 계정으로 로그인하여 서비스를 이용하세요.`
  },
  portal: {
    title: '작업 포탈',
    description: `${APP_NAME} 현장 작업 및 업무 통합 포탈입니다.`
  },
  manage: {
    title: '관리',
    description: `${APP_NAME}에서 업무를 효율적으로 관리하세요.`
  },
  'manage/dashboard': {
    title: '대시보드',
    description: `업무 현황을 한눈에 확인할 수 있습니다.`
  }
};

export function generatePageMetadata(type: MetadataType): Metadata {
  const info = PAGE_INFO[type];
  const title = info.title;
  const description = info.description || APP_DESCRIPTION;

  return {
    metadataBase: new URL(APP_URL),
    title: type === 'home' ? {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    } : title,
    description,
    keywords: ['GNE', 'GNEWorks', '용역관리', '포탈관리', '사내시스템'],
    authors: [{ name: 'GNEWorks' }],
    creator: 'GNEWorks',
    publisher: 'GNEWorks',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title: `${title} | ${APP_NAME}`,
      description,
      url: APP_URL,
      images: [
        {
          url: '/assets/icons/favicon.svg',
          width: 1200,
          height: 630,
          alt: APP_NAME,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${APP_NAME}`,
      description,
      images: ['/assets/icons/favicon.svg'],
    },
    icons: {
      icon: [
        { url: '/assets/icons/favicon.ico', sizes: 'any' },
        { url: '/assets/icons/favicon.svg', type: 'image/svg+xml' }
      ],
      apple: [
        { url: '/assets/icons/favicon.svg' }
      ],
    },
    manifest: '/manifest.json',
  };
}
