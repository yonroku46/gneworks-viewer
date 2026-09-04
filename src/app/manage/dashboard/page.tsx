'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  ClipboardCheck,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Link from 'next/link';

import RegionSelector, { RegionValue } from '@/components/common/RegionSelector';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import StatusBadge from '@/components/common/StatusBadge';
import AccountDetailDialog from '@/components/dialog/AccountDetailDialog';
import WorkReportDetailDialog from '@/components/dialog/WorkReportDetailDialog';
import SiteDetailDialog from '@/components/dialog/SiteDetailDialog';
import { getStoredReports, subscribeToReportsUpdate } from '@/data/reportStorage';
import { getStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
import { getStoredInquiries, subscribeToInquiriesUpdate } from '@/data/inquiryStorage';
import { getStoredUsers, subscribeToUsersUpdate } from '@/data/userStorage';
import { INQUIRY_TYPE_MAP } from '@/data/inquiryData';
import { getSiteWorkers } from '@/data/siteData';
import { INITIAL_USERS_DATA } from '@/data/userData';
import '../ManageLayout.scss';

dayjs.locale('ko');

function formatTimeAgo(timeStr?: string): string {
  if (!timeStr) return '';
  const cleanStr = timeStr.trim();
  const normalized = cleanStr.replace(/\./g, '-');
  const d = dayjs(normalized);
  if (!d.isValid()) {
    return cleanStr;
  }

  const now = dayjs();
  const diffSec = now.diff(d, 'second');
  if (diffSec < 60) {
    return '방금 전';
  }

  const diffMins = now.diff(d, 'minute');
  if (diffMins < 60) {
    return `${diffMins}분 전`;
  }

  const diffHours = now.diff(d, 'hour');
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = now.diff(d, 'day');
  if (diffDays < 30) {
    return `${diffDays}일 전`;
  }

  const diffMonths = now.diff(d, 'month');
  if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  }

  const diffYears = now.diff(d, 'year');
  return `${diffYears}년 전`;
}

export default function ManageDashboard() {
  const { region, setRegion } = useManageRegion();
  const { enqueueSnackbar } = useSnackbar();

  const [reports, setReports] = useState<WorkReport[]>([]);
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  // 계정 상세 정보 다이얼로그 상태 (담당 작업자 클릭 시 작업이력 탭 열람)
  const [selectedWorkerUser, setSelectedWorkerUser] = useState<User | null>(null);
  const previousWorkerUserRef = React.useRef<User | null>(null);

  // 현장 상세 정보 다이얼로그 상태 (아파트 클릭 시 현장 세대/지역담당자 관리 열람)
  const [selectedDetailSite, setSelectedDetailSite] = useState<SiteInfo | null>(null);

  // 1. Initial Load & Real-time Subscription
  useEffect(() => {
    setReports(getStoredReports());
    setSites(getStoredSites());
    setInquiries(getStoredInquiries());

    const unsubReports = subscribeToReportsUpdate(newReports => {
      setReports(newReports);
    });
    const unsubSites = subscribeToSitesUpdate(newSites => {
      setSites(newSites);
    });
    const unsubInquiries = subscribeToInquiriesUpdate(newInquiries => {
      setInquiries(newInquiries);
    });
    const unsubUsers = subscribeToUsersUpdate(() => {
      // 사용자 정보 변경 시 필요 시 갱신
    });

    return () => {
      unsubReports();
      unsubSites();
      unsubInquiries();
      unsubUsers();
    };
  }, []);

  // 답변 대기 중인 문의 필터링 (최신순 정렬)
  const pendingInquiries = useMemo(() => {
    return inquiries
      .filter(i => !i.processedFlg && !i.deleteFlg)
      .sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));
  }, [inquiries]);

  // 2. Filter Sites by Region
  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchSido = region.sido === 'ALL' || site.sido === region.sido;
      const matchSigungu = region.sigungu === 'ALL' || site.sigungu === region.sigungu;
      const matchEup = region.eupmyeondong === 'ALL' || (site.eupmyeondong && site.eupmyeondong.includes(region.eupmyeondong));
      return matchSido && matchSigungu && matchEup;
    });
  }, [sites, region]);

  // 3. Filter Reports by Region
  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      const matchSido = region.sido === 'ALL' || rep.sido === region.sido;
      const matchSigungu = region.sigungu === 'ALL' || rep.sigungu === region.sigungu;
      const matchEup = region.eupmyeondong === 'ALL' || (rep.eupmyeondong && rep.eupmyeondong.includes(region.eupmyeondong));
      return matchSido && matchSigungu && matchEup;
    });
  }, [reports, region]);

  // 4. Overall Regional Progress & Metrics
  const regionalMetrics = useMemo(() => {
    let totalTarget = 0;
    let completedTarget = 0;

    filteredSites.forEach(s => {
      totalTarget += s.totalHouseholds || s.households.length;
      completedTarget += s.completedHouseholds || s.households.filter(h => h.installStatus === '설치완료').length;
    });

    const progressRate = totalTarget > 0 ? Math.round((completedTarget / totalTarget) * 100) : 0;
    const pendingReports = filteredReports.filter(r => r.status === 'PENDING').length;
    const rejectedReports = filteredReports.filter(r => r.status === 'REJECTED').length;
    
    // Reports with notable remarks or issues (관리자 확인이 필요한 검토대기 중 특이사항 건만 집계)
    const issueReports = filteredReports.filter(
      r => r.status === 'PENDING' && r.remarks && r.remarks.trim() !== '' && !r.remarks.includes('특이사항 없음')
    );

    // Today's submissions
    const todayStr = dayjs().format('YYYY-MM-DD');
    const todayReports = filteredReports.filter(
      r => (r.submittedAt && r.submittedAt.startsWith(todayStr)) || (r.installDate === todayStr)
    ).length;

    return {
      totalTarget,
      completedTarget,
      progressRate,
      totalReports: filteredReports.length,
      todayReports,
      pendingReports,
      rejectedReports,
      issueCount: issueReports.length,
    };
  }, [filteredSites, filteredReports]);

  // 5. Regional Assigned Workers Performance (지역 귀속 담당 작업자별 실적 집계)
  const workerStats = useMemo(() => {
    // 실제 유저 프로필 사진 맵 구성
    const userProfileMap = new Map<string, string>();
    INITIAL_USERS_DATA.forEach(u => {
      if (u.profileImg) {
        userProfileMap.set(u.userName, u.profileImg);
        userProfileMap.set(u.userId, u.profileImg);
      }
    });

    const map = new Map<string, { 
      name: string; 
      phone?: string; 
      profileImg?: string;
      total: number; 
      completed: number; 
      pending: number; 
      rejected: number; 
    }>();

    // 1) 현재 선택된 권역의 사이트에 배정된 작업자 우선 등록
    filteredSites.forEach(site => {
      const workers = getSiteWorkers(site);
      workers.forEach(w => {
        const key = w.userName || w.userId || '미지정';
        const existing = map.get(key) || {
          name: w.userName || '미지정',
          phone: w.userPhone,
          profileImg: (w.userName && userProfileMap.get(w.userName)) || (w.userId && userProfileMap.get(w.userId)),
          total: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
        };
        if (!existing.phone && w.userPhone) existing.phone = w.userPhone;
        if (!existing.profileImg) {
          existing.profileImg = (w.userName && userProfileMap.get(w.userName)) || (w.userId && userProfileMap.get(w.userId));
        }
        map.set(key, existing);
      });
    });

    // 2) 현재 선택된 권역의 보고서 작업 실적 매핑 및 누적
    filteredReports.forEach(rep => {
      const workerName = rep.reporterName || '미지정';
      const existing = map.get(workerName) || {
        name: workerName,
        phone: undefined,
        profileImg: userProfileMap.get(workerName),
        total: 0,
        completed: 0,
        pending: 0,
        rejected: 0,
      };

      existing.total += 1;
      if (rep.status === 'COMPLETED') existing.completed += 1;
      else if (rep.status === 'PENDING') existing.pending += 1;
      else if (rep.status === 'REJECTED') existing.rejected += 1;

      map.set(workerName, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }, [filteredSites, filteredReports]);

  // 6. Recent Reports Feed (Sorted by submission time descending)
  const recentReports = useMemo(() => {
    return [...filteredReports]
      .sort((a, b) => {
        const timeA = a.submittedAt || a.reportTime || a.installDate || '';
        const timeB = b.submittedAt || b.reportTime || b.installDate || '';
        return timeB.localeCompare(timeA);
      })
      .slice(0, 7);
  }, [filteredReports]);

  // 7. Notable Issue Reports (관리자 확인이 필요한 검토 대기 중 특이사항 확인서만 표시)
  const issueReports = useMemo(() => {
    return [...filteredReports]
      .filter(r => r.status === 'PENDING' && r.remarks && r.remarks.trim() !== '' && !r.remarks.includes('특이사항 없음'))
      .sort((a, b) => {
        const timeA = a.submittedAt || a.reportTime || '';
        const timeB = b.submittedAt || b.reportTime || '';
        return timeB.localeCompare(timeA);
      });
  }, [filteredReports]);

  // Region Label Display
  const regionLabel = useMemo(() => {
    if (region.sido === 'ALL') return '전체 지역';
    if (region.sigungu === 'ALL') return region.sido;
    if (region.eupmyeondong === 'ALL') return `${region.sido} ${region.sigungu}`;
    return `${region.sido} ${region.sigungu} ${region.eupmyeondong}`;
  }, [region]);

  // 8. 선택된 작업자의 전체 보고서 및 필터링된 보고서 (계정 상세 다이얼로그용)
  const handleOpenWorkerHistory = (workerName: string, workerPhone?: string) => {
    const allUsers = getStoredUsers();
    let user = allUsers.find(u => u.userName === workerName || (workerPhone && u.phoneNum === workerPhone));
    if (!user) {
      user = {
        userId: `worker_${workerName}`,
        userName: workerName,
        phoneNum: workerPhone || '연락처 미등록',
        profileImg: undefined,
        lastUpdated: dayjs().toISOString(),
        createTime: dayjs().toISOString(),
      };
    }
    setSelectedWorkerUser(user);
  };

  return (
    <div className="manage-dashboard-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>현장 작업 통합 대시보드</h2>
          <p>설치 현황, 진행률 및 작업자 실적을 모니터링합니다.</p>
        </div>
      </div>

      {/* ── 1-1. ACTION BANNER FOR PENDING INQUIRIES (답변 대기 문의 스마트 알림 배너) ── */}
      {pendingInquiries.length > 0 && (
        <div className="dash-inquiry-alert-banner">
          <div className="banner-left-cluster">
            <div className="alert-icon-wrap">
              <MessageSquare size={16} />
            </div>
            <div className="banner-text-group">
              <span className="banner-title">
                답변 대기 중인 1:1 문의가 <strong>{pendingInquiries.length}건</strong> 있습니다.
              </span>
              {pendingInquiries[0] && (
                <span className="banner-sub-preview">
                  최근: [{INQUIRY_TYPE_MAP[pendingInquiries[0].inquiryType]?.label || '문의'}] &ldquo;{pendingInquiries[0].inquiryContents.slice(0, 44)}...&rdquo;
                </span>
              )}
            </div>
          </div>
          <Link href="/manage/inquiries" className="banner-action-link">
            <span>문의 답변하기</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ── COMMON REGION SELECTOR BAR ── */}
      <RegionSelector
        value={region}
        onChange={setRegion}
        showActiveBadge={true}
      />

      {/* ── 2. KEY METRICS KPI GRID ── */}
      <div className="dashboard-kpi-grid">
        {/* Metric 1: 전체 설치 진행률 */}
        <div className="kpi-card progress-kpi">
          <div className="kpi-header">
            <span className="kpi-label">권역 설치 진행률</span>
            <div className="kpi-icon progress">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <h3 className="kpi-value">{regionalMetrics.progressRate}<span>%</span></h3>
            <span className="kpi-sub-text">
              <strong>{regionalMetrics.completedTarget.toLocaleString()}</strong> / {regionalMetrics.totalTarget.toLocaleString()} 세대
            </span>
          </div>
          <div className="kpi-progress-bar-bg">
            <div 
              className="kpi-progress-bar-fill" 
              style={{ width: `${Math.min(regionalMetrics.progressRate, 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: 누적 제출 보고서 */}
        <div className="kpi-card reports-kpi">
          <div className="kpi-header">
            <span className="kpi-label">누적 제출 확인서</span>
            <div className="kpi-icon reports">
              <ClipboardCheck size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <h3 className="kpi-value">{regionalMetrics.totalReports.toLocaleString()}<span>건</span></h3>
            <span className="kpi-sub-text badge-tag">
              오늘 +{regionalMetrics.todayReports}건 접수
            </span>
          </div>
          <div className="kpi-card-footer">
            <span>승인 완료: <strong>{filteredReports.filter(r => r.status === 'COMPLETED').length}건</strong></span>
          </div>
        </div>

        {/* Metric 3: 관리자 검토 대기 */}
        <div className="kpi-card pending-kpi">
          <div className="kpi-header">
            <span className="kpi-label">검토 대기 확인서</span>
            <div className="kpi-icon pending">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <h3 className="kpi-value">{regionalMetrics.pendingReports}<span>건</span></h3>
          </div>
          <div className="kpi-card-footer">
            <span className="sub-note">승인 심사 대기 대상</span>
          </div>
        </div>

        {/* Metric 4: 특이사항 확인서 */}
        <div className="kpi-card issues-kpi">
          <div className="kpi-header">
            <span className="kpi-label">특이사항 확인서</span>
            <div className="kpi-icon issues">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <h3 className="kpi-value">{regionalMetrics.issueCount}<span>건</span></h3>
          </div>
          <div className="kpi-card-footer">
            <span className="sub-note">현장 특이 소견 접수 대상</span>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN DASHBOARD CONTENT (2-COLUMN LAYOUT) ── */}
      <div className="dashboard-sections-grid">
        {/* ── [LEFT COLUMN]: 지역별 진행 현황 & 작업자 실적 ── */}
        <div className="dashboard-column left-column">
          {/* 현장별 진행 현황 */}
          <div className="dash-card site-progress-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <h4>현장별 보급 진행 현황</h4>
                <span className="count-pill">{filteredSites.length}곳</span>
              </div>
              <Link href="/manage/sites" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="site-progress-list">
              {filteredSites.length === 0 ? (
                <div className="dash-empty-state">
                  <p>선택된 지역에 등록된 사업지가 없습니다.</p>
                </div>
              ) : (
                filteredSites.slice(0, 6).map(site => {
                  const total = site.totalHouseholds || site.households.length;
                  const completed = site.completedHouseholds || site.households.filter(h => h.installStatus === '설치완료').length;
                  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
                  const isDone = rate >= 100;

                  return (
                    <div 
                      key={site.id} 
                      className="site-progress-item clickable"
                      onClick={() => setSelectedDetailSite(site)}
                      role="button"
                      tabIndex={0}
                      title={`${site.name} 현장 상세 관리 열람`}
                    >
                      <div 
                        className={`site-rate-ring ${isDone ? 'done' : ''}`} 
                        style={{ '--rate-deg': `${rate * 3.6}deg` } as React.CSSProperties}
                        title={`진행률 ${rate}% (${completed}/${total}세대)`}
                      >
                        <div className="rate-ring-inner">
                          <span className="rate-num">{rate}</span>
                          <span className="rate-unit">%</span>
                        </div>
                      </div>

                      <div className="site-info-col">
                        <div className="site-info-main">
                          <span className="site-name">{site.name}</span>
                          <span className="ratio-text">
                            <strong>{completed}</strong> / {total}세대
                          </span>
                        </div>
                        <span className="site-addr">{site.address}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 지역 담당 작업자별 실적 */}
          <div className="dash-card worker-ranking-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <h4>지역 담당 작업자별 실적</h4>
                <span className="count-pill">{workerStats.length}명</span>
              </div>
              <Link href="/manage/users" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="worker-stats-list">
              {workerStats.length === 0 ? (
                <div className="dash-empty-state">
                  <p>해당 지역에 배정된 작업자 또는 등록된 실적이 없습니다.</p>
                </div>
              ) : (
                workerStats.map(w => (
                  <div 
                    key={w.name} 
                    className="worker-stat-item"
                    onClick={() => handleOpenWorkerHistory(w.name, w.phone)}
                    role="button"
                    tabIndex={0}
                    title={`${w.name} 작업자의 작업 실적 및 이력 확인`}
                  >
                    <div className="worker-avatar-badge">
                      {w.profileImg ? (
                        <img src={w.profileImg} alt={w.name} className="worker-avatar-img" />
                      ) : (
                        <span className="avatar-initial">{w.name.slice(0, 1)}</span>
                      )}
                    </div>

                    <div className="worker-info-col">
                      <span className="worker-name">{w.name}</span>
                      {w.phone && (
                        <span className="worker-contact">{w.phone}</span>
                      )}
                    </div>

                    <div className="worker-stats-col">
                      <span className="total-val"><strong>{w.total}</strong>건</span>
                      <div className="sub-status-tags">
                        <span>완료 {w.completed}</span>
                        {w.pending > 0 && <span>· 대기 {w.pending}</span>}
                        {w.rejected > 0 && <span>· 반려 {w.rejected}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── [RIGHT COLUMN]: 특이사항 모니터링 & 최근 보고서 ── */}
        <div className="dashboard-column right-column">
          {/* 특이사항 확인서 */}
          <div className="dash-card issue-reports-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <h4>특이사항 확인서</h4>
                <span className="count-pill danger">{issueReports.length}건</span>
              </div>
              <Link href="/manage/work" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {(() => {
              const renderFeedItem = (rep: WorkReport, itemKey: string) => {
                const isCompleted = rep.status === 'COMPLETED';
                const isRejected = rep.status === 'REJECTED';
                const isPending = rep.status === 'PENDING';
                const hasRemarks = Boolean(rep.remarks && rep.remarks.trim() !== '' && !rep.remarks.includes('특이사항 없음'));
                const photoCount = rep.photos?.filter(p => p.url).length || 0;

                let itemThemeClass = 'is-completed';
                if (isRejected) {
                  itemThemeClass = 'is-rejected';
                } else if (isPending) {
                  itemThemeClass = hasRemarks ? 'is-warning' : 'is-pending';
                }

                return (
                  <div 
                    key={itemKey} 
                    className={`report-feed-item ${itemThemeClass}`}
                    onClick={() => setSelectedReport(rep)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="feed-item-top">
                      <div className="location-group">
                        <span className="site-name">{rep.siteName}</span>
                        <span className="unit-text">{rep.dong}동 {rep.ho}호</span>
                        <span className="head-text">({rep.headName} 세대)</span>
                      </div>
                      <div className="status-badge-wrap">
                        <span className="feed-time-ago">{formatTimeAgo(rep.submittedAt || rep.reportTime || rep.installDate)}</span>
                        <StatusBadge status={rep.status} />
                      </div>
                    </div>

                    {(isRejected || hasRemarks) && (
                      <div className={`feed-reason-bubble ${isRejected ? 'rejected' : isCompleted ? 'completed-note' : 'remarks'}`}>
                        <span className="reason-badge">
                          {isRejected ? '보완요청' : isCompleted ? '현장비고' : '특이사항'}
                        </span>
                        <p>
                          {isRejected ? (rep.fixReason || '보완 요청 사유가 기재되지 않았습니다.') : rep.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <div className="report-feed-list issue-feed-list">
                  {issueReports.length === 0 ? (
                    <div className="dash-empty-state clean">
                      <CheckCircle2 size={32} className="clean-icon" />
                      <p>현재 접수된 특이사항 확인서가 없습니다.</p>
                    </div>
                  ) : (
                    issueReports.map((rep, idx) => renderFeedItem(rep, `issue_${rep.reportId || idx}`))
                  )}
                </div>
              );
            })()}
          </div>

          {/* 최근 제출된 보고서 타임라인 */}
          <div className="dash-card recent-reports-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <h4>최근 제출 보고서 피드</h4>
              </div>
              <Link href="/manage/work" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="report-feed-list recent-feed-list">
              {recentReports.length === 0 ? (
                <div className="dash-empty-state">
                  <p>최근 등록된 작업 보고서가 없습니다.</p>
                </div>
              ) : (
                recentReports.map((rep, idx) => {
                  const isCompleted = rep.status === 'COMPLETED';
                  const isRejected = rep.status === 'REJECTED';
                  const isPending = rep.status === 'PENDING';
                  const hasRemarks = Boolean(rep.remarks && rep.remarks.trim() !== '' && !rep.remarks.includes('특이사항 없음'));
                  const photoCount = rep.photos?.filter(p => p.url).length || 0;

                  let itemThemeClass = 'is-completed';
                  if (isRejected) {
                    itemThemeClass = 'is-rejected';
                  } else if (isPending) {
                    itemThemeClass = hasRemarks ? 'is-warning' : 'is-pending';
                  }

                  return (
                    <div 
                      key={`recent_${rep.reportId || idx}`} 
                      className={`report-feed-item ${itemThemeClass}`}
                      onClick={() => setSelectedReport(rep)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="feed-item-top">
                        <div className="location-group">
                          <span className="site-name">{rep.siteName}</span>
                          <span className="unit-text">{rep.dong}동 {rep.ho}호</span>
                          <span className="head-text">({rep.headName} 세대)</span>
                        </div>
                        <div className="status-badge-wrap">
                          <span className="feed-time-ago">{formatTimeAgo(rep.submittedAt || rep.reportTime || rep.installDate)}</span>
                          <StatusBadge status={rep.status} />
                        </div>
                      </div>

                      {(isRejected || hasRemarks) && (
                        <div className={`feed-reason-bubble ${isRejected ? 'rejected' : isCompleted ? 'completed-note' : 'remarks'}`}>
                          <span className="reason-badge">
                            {isRejected ? '보완요청' : isCompleted ? '현장비고' : '특이사항'}
                          </span>
                          <p>
                            {isRejected ? (rep.fixReason || '보완 요청 사유가 기재되지 않았습니다.') : rep.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. REPORT DETAIL POPUP MODAL (검토용 / 제출용 통합 서식 뷰어) ── */}
      <WorkReportDetailDialog
        isOpen={!!selectedReport}
        report={selectedReport}
        onClose={() => {
          setSelectedReport(null);
          if (previousWorkerUserRef.current) {
            setSelectedWorkerUser(previousWorkerUserRef.current);
            previousWorkerUserRef.current = null;
          }
        }}
        onReportUpdated={(updated) => {
          setSelectedReport(updated);
          setReports(prev => prev.map(r => r.reportId === updated.reportId ? updated : r));
        }}
      />

      {/* ── 5. WORKER ACCOUNT DETAIL POPUP MODAL (통합 컴포넌트) ── */}
      <AccountDetailDialog
        isOpen={!!selectedWorkerUser}
        onClose={() => {
          setSelectedWorkerUser(null);
          previousWorkerUserRef.current = null;
        }}
        user={selectedWorkerUser}
        reports={reports}
        sites={sites}
        initialTab="performance"
        showDeleteButton={false}
        onUserUpdated={(updated) => {
          setSelectedWorkerUser(updated);
        }}
        onReportClick={(rep) => {
          previousWorkerUserRef.current = selectedWorkerUser;
          setSelectedWorkerUser(null);
          setSelectedReport(rep);
        }}
      />

      {/* ── 6. SITE DETAIL POPUP MODAL (공통 컴포넌트) ── */}
      <SiteDetailDialog
        isOpen={!!selectedDetailSite}
        onClose={() => setSelectedDetailSite(null)}
        site={selectedDetailSite}
        showDeleteButton={false}
        onSiteUpdated={(updated) => {
          setSelectedDetailSite(updated);
          setSites(prev => prev.map(s => s.id === updated.id ? updated : s));
        }}
      />
    </div>
  );
}
