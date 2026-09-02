import { Metadata } from 'next';

export type MetadataType =
  | 'home'
  | 'login'
  | 'contact'
  | 'portal'
  | 'portal/profile'
  | 'manage'
  | 'manage/dashboard'
  | 'manage/work'
  | 'manage/sites'
  | 'manage/assignments'
  | 'manage/inquiries'
  | 'manage/users'
  | 'manage/settings'
  | 'docs/privacy'
  | 'docs/terms';

const APP_NAME = 'GNEWorks';
const APP_DESCRIPTION = 'GNE 현장 작업 및 온라인 포탈 관리 시스템';
const APP_URL = process.env.NEXT_PUBLIC_APP_ADDRESS || 'http://localhost:3000';

const OG_IMAGE_URL = `${APP_URL}/assets/img/og-image-1200x630.png`;
const TWITTER_IMAGE_URL = `${APP_URL}/assets/img/twitter-card-1200x600.png`;

export function generatePageMetadata(type: MetadataType, name?: string, description?: string): Metadata {
  const baseMetadata: Metadata = {
    metadataBase: new URL(APP_URL),
    title: {
      template: `%s | ${APP_NAME}`,
      default: APP_NAME,
    },
    description: APP_DESCRIPTION,
    keywords: ['GNE', 'GNEWorks', '용역관리', '포탈관리', '현장관리', '사내시스템', '스마트워크'],
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    publisher: APP_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title: {
        template: `%s | ${APP_NAME}`,
        default: APP_NAME,
      },
      description: APP_DESCRIPTION,
      locale: 'ko_KR',
      url: APP_URL,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: APP_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        template: `%s | ${APP_NAME}`,
        default: APP_NAME,
      },
      description: APP_DESCRIPTION,
      images: [TWITTER_IMAGE_URL],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/assets/app/favicon.ico' },
        { url: '/assets/app/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/assets/app/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/assets/app/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/assets/app/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { url: '/assets/app/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    manifest: '/manifest.json',
  };

  function createMetadata(pageTitle: string, pageDescription: string): Metadata {
    const formattedTitle = pageTitle === APP_NAME ? APP_NAME : pageTitle;

    return {
      ...baseMetadata,
      title: formattedTitle,
      description: pageDescription,
      openGraph: {
        ...baseMetadata.openGraph,
        title: `${formattedTitle} | ${APP_NAME}`,
        description: pageDescription,
        images: [
          {
            url: OG_IMAGE_URL,
            width: 1200,
            height: 630,
            alt: `${formattedTitle} | ${APP_NAME}`,
          },
        ],
      },
      twitter: {
        ...baseMetadata.twitter,
        title: `${formattedTitle} | ${APP_NAME}`,
        description: pageDescription,
        images: [TWITTER_IMAGE_URL],
      },
    };
  }

  const pageMetadata: Record<MetadataType, Metadata> = {
    home: createMetadata(
      APP_NAME,
      'GNE 현장 작업 및 온라인 포탈 관리 시스템 - 스마트한 현장 관리와 실시간 작업 통합 관리 플랫폼입니다.'
    ),
    login: createMetadata(
      '로그인',
      `${APP_NAME} 계정으로 로그인하여 현장 작업 및 포탈 관리 서비스를 이용하세요.`
    ),
    contact: createMetadata(
      '문의하기',
      '서비스에 대한 문의사항이나 제안을 남겨주시면 신속하게 답변해드리겠습니다.'
    ),
    portal: createMetadata(
      '작업 포탈',
      `${APP_NAME} 현장 작업자 및 임직원을 위한 업무 통합 포탈입니다.`
    ),
    'portal/profile': createMetadata(
      '내 프로필',
      '사용자 정보 확인 및 서명, 프로필 설정을 관리할 수 있습니다.'
    ),
    manage: createMetadata(
      '관리 시스템',
      `${APP_NAME} 종합 현장 운영 및 관리자 포탈입니다.`
    ),
    'manage/dashboard': createMetadata(
      '대시보드',
      '전체 현황 및 주요 작업 지표를 한눈에 확인할 수 있는 대시보드입니다.'
    ),
    'manage/work': createMetadata(
      '작업 관리',
      '현장별 작업 일정, 진행 상황 및 보고서를 체계적으로 관리합니다.'
    ),
    'manage/sites': createMetadata(
      '현장 관리',
      '작업 현장 및 사업소 정보를 등록하고 현장별 상태를 관리합니다.'
    ),
    'manage/assignments': createMetadata(
      '배정 관리',
      '현장별 인력 및 작업 배정을 효율적으로 계획하고 관리합니다.'
    ),
    'manage/inquiries': createMetadata(
      '문의 관리',
      '접수된 고객 문의 및 요청 사항을 확인하고 처리합니다.'
    ),
    'manage/users': createMetadata(
      '사용자 관리',
      '작업자 및 관리자 계정 권한과 소속 정보를 관리합니다.'
    ),
    'manage/settings': createMetadata(
      '시스템 설정',
      `${APP_NAME} 시스템 환경 설정 및 옵션을 관리합니다.`
    ),
    'docs/privacy': createMetadata(
      '개인정보처리방침',
      `${APP_NAME}의 개인정보 보호 및 처리 방침 안내 페이지입니다.`
    ),
    'docs/terms': createMetadata(
      '이용약관',
      `${APP_NAME} 서비스 이용약관 안내 페이지입니다.`
    ),
  };

  if (name || description) {
    const basePage = pageMetadata[type];
    const defaultTitle = typeof basePage.title === 'string' ? basePage.title : APP_NAME;
    const defaultDesc = basePage.description || APP_DESCRIPTION;

    return createMetadata(name || defaultTitle, description || defaultDesc);
  }

  return pageMetadata[type];
}
