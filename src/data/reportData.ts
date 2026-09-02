// Work Report Master Data (단독경보형감지기 보급지원확인서 및 작업 보고서)

export interface ReportPhoto {
  title: string;
  url: string;
  type: 'door' | 'before1' | 'after1' | 'before2' | 'after2';
}

export interface WorkReport {
  id: string;
  siteId: string;
  siteName: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  address: string;
  dong: string;
  ho: string;
  headName: string;
  installDate: string;          // YYYY-MM-DD (설치일자)
  installDateFormatted: string; // YYYY년 M월 D일
  reportTime: string;           // YYYY-MM-DD HH:mm (보고일시)
  reporterName: string;        // 보고자
  installerName?: string;       // (하위 호환) 설치자
  installerId: string;
  visitorName: string;          // 방문자 (서명 대상)
  confirmerName: string;        // 확인자 (세대주 또는 관리자)
  confirmerSignature?: string;  // 확인자(세대주) 전자서명 Base64 데이터
  photos: ReportPhoto[];
  status: '확인완료' | '검토대기' | '수정필요';
  fixReason?: string;           // 수정 필요(보완) 사유
  submittedAt?: string;         // YYYY-MM-DD HH:mm
  remarks?: string;
}

export const INITIAL_REPORTS_DATA: WorkReport[] = [
  {
    id: 'rep_001',
    siteId: 'site_ansan_09',
    siteName: '주공아파트 9단지',
    sido: '경기도',
    sigungu: '안산시',
    eupmyeondong: '단원구',
    address: '경기도 안산시 단원구 당곡2로 30(주공아파트 9단지)',
    dong: '911',
    ho: '106',
    headName: '이은희',
    installDate: '2026-08-04',
    installDateFormatted: '2026년 8월 4일',
    reportTime: '2026-08-04 14:32',
    reporterName: '최정민',
    installerId: 'worker_choi',
    visitorName: '강인호',
    confirmerName: '권순형',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
      { title: '설치 전 ②', url: '/assets/img/report_sheet_sample.png', type: 'before2' },
      { title: '설치 후 ②', url: '/assets/img/report_sheet_sample.png', type: 'after2' },
    ],
    status: '확인완료',
    submittedAt: '2026-08-04 14:32',
    remarks: '특이사항 없음, 정상 작동 시험 완료',
  },
  {
    id: 'rep_002',
    siteId: 'site_1',
    siteName: '조흥아파트',
    sido: '경기도',
    sigungu: '연천군',
    eupmyeondong: '연천읍',
    address: '경기도 연천군 연천읍 차옥로 81',
    dong: '101',
    ho: '101',
    headName: '박태병',
    installDate: '2026-08-28',
    installDateFormatted: '2026년 8월 28일',
    reportTime: '2026-08-28 11:20',
    reporterName: '김연태',
    installerId: 'worker_1',
    visitorName: '김연태',
    confirmerName: '박태병',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
      { title: '설치 후 ②', url: '/assets/img/report_sheet_sample.png', type: 'after2' },
    ],
    status: '확인완료',
    submittedAt: '2026-08-28 11:20',
    remarks: '거실 및 주방 2개소 부착 완료',
  },
  {
    id: 'rep_003',
    siteId: 'site_1',
    siteName: '조흥아파트',
    sido: '경기도',
    sigungu: '연천군',
    eupmyeondong: '연천읍',
    address: '경기도 연천군 연천읍 차옥로 81',
    dong: '101',
    ho: '102',
    headName: '이지수',
    installDate: '2026-08-28',
    installDateFormatted: '2026년 8월 28일',
    reportTime: '2026-08-28 15:45',
    reporterName: '김연태',
    installerId: 'worker_1',
    visitorName: '김연태',
    confirmerName: '이지수',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
    ],
    status: '수정필요',
    fixReason: '설치 전① 사진이 다소 어둡고 흔들려 감지기 부착 위치 식별이 어렵습니다. 밝은 조명에서 재촬영해 주시기 바랍니다.',
    submittedAt: '2026-08-28 15:45',
    remarks: '안방 천장 보강 후 감지기 설치',
  },
  {
    id: 'rep_004',
    siteId: 'site_1',
    siteName: '조흥아파트',
    sido: '경기도',
    sigungu: '연천군',
    eupmyeondong: '연천읍',
    address: '경기도 연천군 연천읍 차옥로 81',
    dong: '102',
    ho: '201',
    headName: '최현우',
    installDate: '2026-08-28',
    installDateFormatted: '2026년 8월 28일',
    reportTime: '2026-08-29 09:15',
    reporterName: '이성민',
    installerId: 'worker_2',
    visitorName: '이성민',
    confirmerName: '최현우',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
      { title: '설치 후 ②', url: '/assets/img/report_sheet_sample.png', type: 'after2' },
    ],
    status: '검토대기',
    submittedAt: '2026-08-29 09:15',
    remarks: '금일 오전 설치 완료 보고',
  },
  {
    id: 'rep_005',
    siteId: 'site_2',
    siteName: '전곡 한일아파트',
    sido: '경기도',
    sigungu: '연천군',
    eupmyeondong: '전곡읍',
    address: '경기도 연천군 전곡읍 평화로 625',
    dong: '201',
    ho: '304',
    headName: '정다빈',
    installDate: '2026-08-29',
    installDateFormatted: '2026년 8월 29일',
    reportTime: '2026-08-29 10:40',
    reporterName: '이성민',
    installerId: 'worker_2',
    visitorName: '이성민',
    confirmerName: '정다빈',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
    ],
    status: '확인완료',
    submittedAt: '2026-08-29 10:40',
    remarks: '노인 세대 음성형 감지기 설치 안내 완료',
  },
  {
    id: 'rep_006',
    siteId: 'site_ansan_09',
    siteName: '주공아파트 9단지',
    sido: '경기도',
    sigungu: '안산시',
    eupmyeondong: '단원구',
    address: '경기도 안산시 단원구 당곡2로 30(주공아파트 9단지)',
    dong: '911',
    ho: '107',
    headName: '김민수',
    installDate: '2026-08-04',
    installDateFormatted: '2026년 8월 4일',
    reportTime: '2026-08-04 15:10',
    reporterName: '최정민',
    installerId: 'worker_choi',
    visitorName: '강인호',
    confirmerName: '김민수',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
    ],
    status: '확인완료',
    submittedAt: '2026-08-04 15:10',
    remarks: '정상 설치 완료',
  },
  {
    id: 'rep_007',
    siteId: 'site_suwon_1',
    siteName: '우만주공 1단지',
    sido: '경기도',
    sigungu: '수원시',
    eupmyeondong: '팔달구 (우만동)',
    address: '경기도 수원시 팔달구 권광로 364',
    dong: '103',
    ho: '502',
    headName: '강호동',
    installDate: '2026-08-24',
    installDateFormatted: '2026년 8월 24일',
    reportTime: '2026-08-25 16:30',
    reporterName: '박영호',
    installerId: 'worker_3',
    visitorName: '박영호',
    confirmerName: '강호동',
    photos: [
      { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
      { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
      { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
      { title: '설치 후 ②', url: '/assets/img/report_sheet_sample.png', type: 'after2' },
    ],
    status: '확인완료',
    submittedAt: '2026-08-25 16:30',
    remarks: '침실 및 거실 설치 완료',
  }
];
