'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AlertTriangle, 
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

import AdminService from '@/api/service/AdminService';
import RegionSelector from '@/components/common/RegionSelector';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import StatusBadge from '@/components/common/StatusBadge';
import UserAvatar from '@/components/common/UserAvatar';
import AccountDetailDialog from '@/components/dialog/AccountDetailDialog';
import WorkReportDetailDialog from '@/components/dialog/WorkReportDetailDialog';
import SiteDetailDialog from '@/components/dialog/SiteDetailDialog';
import { INQUIRY_TYPE_MAP } from '@/constants/inquiry';
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

  const [summary, setSummary] = useState<AdminDashboardSummaryRes>({
    totalSites: 0,
    totalTarget: 0,
    completedTarget: 0,
    progressRate: 0,
    totalReports: 0,
    todayReports: 0,
    pendingReports: 0,
    rejectedReports: 0,
    completedReports: 0,
    issueReportsCount: 0,
    totalWorkers: 0,
  });
  const [sites, setSites] = useState<SiteDetail[]>([]);
  const [totalSiteCount, setTotalSiteCount] = useState<number>(0);
  const [workerRanking, setWorkerRanking] = useState<AdminWorkerStatRes[]>([]);
  const [totalWorkerCount, setTotalWorkerCount] = useState<number>(0);
  const [issueReports, setIssueReports] = useState<WorkReport[]>([]);
  const [totalIssueCount, setTotalIssueCount] = useState<number>(0);
  const [recentReports, setRecentReports] = useState<WorkReport[]>([]);
  const [totalReportCount, setTotalReportCount] = useState<number>(0);
  const [workerReports, setWorkerReports] = useState<WorkReport[]>([]);

  const [pendingInquirySummary, setPendingInquirySummary] = useState<{
    pendingCount: number;
    latestPendingInquiry?: Inquiry;
  }>({ pendingCount: 0 });
  const [selectedReport, setSelectedReport] = useState<WorkReport>();

  // 계정 상세 정보 다이얼로그 상태 (담당 작업자 클릭 시 작업이력 탭 열람)
  const [selectedWorkerUser, setSelectedWorkerUser] = useState<User>();
  const previousWorkerUserRef = React.useRef<User | undefined>(undefined);

  // 현장 상세 정보 다이얼로그 상태 (아파트 클릭 시 현장 세대/지역담당자 관리 열람)
  const [selectedDetailSite, setSelectedDetailSite] = useState<SiteDetail>();
  const [fireRegions, setFireRegions] = useState<FireRegion[]>([]);

  // 소방관할(FireRegion) 목록 로드 (지역 필터 정합성 보장)
  useEffect(() => {
    AdminService.getFireRegions()
      .then(list => setFireRegions(list || []))
      .catch(err => console.error('[Dashboard] getFireRegions error:', err));
  }, []);

  // 1. 백엔드 API에서 답변 대기 문의 요약 경량 조회 (건수 + 최신 1건 미리보기)
  const loadPendingInquirySummary = useCallback(async () => {
    try {
      const inquirySummary = await AdminService.getPendingInquirySummary();
      setPendingInquirySummary(inquirySummary);
    } catch (error) {
      console.error('[Dashboard] loadPendingInquirySummary error:', error);
      setPendingInquirySummary({ pendingCount: 0 });
    }
  }, []);

  useEffect(() => {
    loadPendingInquirySummary();
  }, [loadPendingInquirySummary]);

  // 2. Initial Load from Backend API (API 단에서 10건 한도 적용 및 전체 집계 취득)
  const loadDashboardData = useCallback(async () => {
    try {
      const matchedFireRegion = fireRegions.find(fr => 
        (region.sido === 'ALL' || fr.sidoName === region.sido) &&
        (region.sigungu !== 'ALL' && (fr.name === region.sigungu || fr.name.replace(/(소방서|센터)$/, '').trim() === region.sigungu))
      );
      const selectedRegionId = region.regionId || matchedFireRegion?.regionId;

      const regionParam: { regionId?: string } = {};
      if (selectedRegionId) {
        regionParam.regionId = selectedRegionId;
      }

      const [summaryRes, siteRes, workerRes, issueRes, recentRes] = await Promise.all([
        AdminService.getDashboardSummary(regionParam).catch(err => {
          console.error('[Dashboard] getDashboardSummary error', err);
          return null;
        }),
        AdminService.getSiteList({
          ...regionParam,
          limit: 10,
          orderBy: 'RATE_DESC',
        }).catch(err => {
          console.error('[Dashboard] getSiteList error', err);
          return { list: [], totalCount: 0 };
        }),
        AdminService.getWorkerRanking({
          ...regionParam,
          limit: 10,
        }).catch(err => {
          console.error('[Dashboard] getWorkerRanking error', err);
          return Object.assign([], { totalCount: 0 });
        }),
        AdminService.getReportList({
          ...regionParam,
          status: 'PENDING',
          hasRemarks: true,
          limit: 10,
        }).catch(err => {
          console.error('[Dashboard] getReportList (issues) error', err);
          return Object.assign([], { totalCount: 0 });
        }),
        AdminService.getReportList({
          ...regionParam,
          orderBy: 'REPORT_TIME_DESC',
          limit: 10,
        }).catch(err => {
          console.error('[Dashboard] getReportList (recent) error', err);
          return Object.assign([], { totalCount: 0 });
        }),
      ]);

      if (summaryRes) {
        setSummary(summaryRes);
      }
      setSites(siteRes?.list || []);
      setTotalSiteCount(siteRes?.totalCount || summaryRes?.totalSites || 0);

      setWorkerRanking(workerRes || []);
      setTotalWorkerCount(workerRes?.totalCount || summaryRes?.totalWorkers || 0);

      setIssueReports(issueRes || []);
      setTotalIssueCount(issueRes?.totalCount || summaryRes?.issueReportsCount || 0);

      setRecentReports(recentRes || []);
      setTotalReportCount(recentRes?.totalCount || summaryRes?.totalReports || 0);
    } catch (e) {
      console.error('[Dashboard] loadDashboardData error', e);
    }
  }, [region.sido, region.sigungu, region.eupmyeondong, region.regionId, fireRegions]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 현장 상세 다이얼로그 오픈 (세대 목록 및 배정 작업자 정보 온전하게 로드)
  const handleOpenSiteDetail = async (site: SiteDetail) => {
    try {
      const detail = await AdminService.getSiteDetail(site.siteId);
      if (!detail.assignedWorkers || detail.assignedWorkers.length === 0) {
        if (site.regionId) {
          const workers = await AdminService.getRegionWorkers({ regionId: site.regionId }).catch(() => []);
          detail.assignedWorkers = workers;
        }
      }
      setSelectedDetailSite(detail);
    } catch (e) {
      console.error('[Dashboard] handleOpenSiteDetail error', e);
      setSelectedDetailSite(site);
    }
  };

  // Region Label Display
  const regionLabel = useMemo(() => {
    if (region.sido === 'ALL') return '전체 지역';
    if (region.sigungu === 'ALL') return region.sido;
    if (region.eupmyeondong === 'ALL') return `${region.sido} ${region.sigungu}`;
    return `${region.sido} ${region.sigungu} ${region.eupmyeondong}`;
  }, [region]);

  // 선택된 작업자의 전체 보고서 및 필터링된 보고서 (계정 상세 다이얼로그용)
  const handleOpenWorkerHistory = async (workerId?: string, workerName?: string, workerPhone?: string) => {
    try {
      const userList = await AdminService.getUserList().catch(() => []);
      const user = userList.find(u => (workerId && u.userId === workerId) || u.userName === workerName || (workerPhone && u.phoneNum === workerPhone));
      if (!user) {
        enqueueSnackbar(`[${workerName || '선택된'}] 사용자의 계정 정보를 찾을 수 없습니다.`, { variant: 'warning' });
        return;
      }
      if (user.userId) {
        const reps = await AdminService.getReportList({ userId: user.userId }).catch(() => []);
        setWorkerReports(reps);
      }
      setSelectedWorkerUser(user);
    } catch (e) {
      console.error('[Dashboard] handleOpenWorkerHistory error', e);
    }
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
      {pendingInquirySummary.pendingCount > 0 && (
        <div className="dash-inquiry-alert-banner">
          <div className="banner-left-cluster">
            <div className="alert-icon-wrap">
              <MessageSquare size={16} />
            </div>
            <div className="banner-text-group">
              <span className="banner-title">
                답변 대기 중인 1:1 문의가 <strong>{pendingInquirySummary.pendingCount}건</strong> 있습니다.
              </span>
              {pendingInquirySummary.latestPendingInquiry && (
                <span className="banner-sub-preview">
                  최근: [{INQUIRY_TYPE_MAP[pendingInquirySummary.latestPendingInquiry.inquiryType]?.label || '문의'}] &ldquo;{pendingInquirySummary.latestPendingInquiry.inquiryContents.slice(0, 44)}...&rdquo;
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
            <h3 className="kpi-value">{summary.progressRate}<span>%</span></h3>
            <span className="kpi-sub-text">
              <strong>{summary.completedTarget.toLocaleString()}</strong> / {summary.totalTarget.toLocaleString()} 세대
            </span>
          </div>
          <div className="kpi-progress-bar-bg">
            <div 
              className="kpi-progress-bar-fill" 
              style={{ width: `${Math.min(summary.progressRate, 100)}%` }} 
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
            <h3 className="kpi-value">{summary.totalReports.toLocaleString()}<span>건</span></h3>
            <span className="kpi-sub-text badge-tag">
              오늘 +{summary.todayReports}건 접수
            </span>
          </div>
          <div className="kpi-card-footer">
            <span>승인 완료: <strong>{summary.completedReports.toLocaleString()}건</strong></span>
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
            <h3 className="kpi-value">{summary.pendingReports}<span>건</span></h3>
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
            <h3 className="kpi-value">{summary.issueReportsCount}<span>건</span></h3>
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
                <span className="count-pill">{totalSiteCount.toLocaleString()}곳</span>
              </div>
              <Link href="/manage/sites" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="site-progress-list">
              {sites.length === 0 ? (
                <div key="empty-sites" className="dash-empty-state">
                  <p>선택된 지역에 등록된 사업지가 없습니다.</p>
                </div>
              ) : (
                sites.map((site, idx) => {
                  const total = site.totalHouseholds ?? site.households?.length ?? 0;
                  const completed = site.completedHouseholds || 0;
                  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
                  const isDone = rate >= 100;

                  return (
                    <div 
                      key={site.siteId || `site_${idx}`} 
                      className="site-progress-item clickable"
                      onClick={() => handleOpenSiteDetail(site)}
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
                <span className="count-pill">{totalWorkerCount.toLocaleString()}명</span>
              </div>
              <Link href="/manage/users" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="worker-stats-list">
              {workerRanking.length === 0 ? (
                <div key="empty-workers" className="dash-empty-state">
                  <p>해당 지역에 배정된 작업자 또는 등록된 실적이 없습니다.</p>
                </div>
              ) : (
                workerRanking.map((w, idx) => (
                  <div 
                    key={w.userId || w.name || `worker_${idx}`} 
                    className="worker-stat-item"
                    onClick={() => handleOpenWorkerHistory(w.userId, w.name, w.phone)}
                    role="button"
                    tabIndex={0}
                    title={`${w.name} 작업자의 작업 실적 및 이력 확인`}
                  >
                    <UserAvatar 
                      src={w.profileImg} 
                      name={w.name} 
                      size="md" 
                    />

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
                <span className="count-pill">{totalIssueCount.toLocaleString()}건</span>
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
                    <div key="empty-issues" className="dash-empty-state">
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
                <span className="count-pill">{totalReportCount.toLocaleString()}건</span>
              </div>
              <Link href="/manage/work" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="report-feed-list recent-feed-list">
              {recentReports.length === 0 ? (
                <div key="empty-recent" className="dash-empty-state">
                  <p>최근 등록된 작업 보고서가 없습니다.</p>
                </div>
              ) : (
                recentReports.map((rep, idx) => {
                  const isCompleted = rep.status === 'COMPLETED';
                  const isRejected = rep.status === 'REJECTED';
                  const isPending = rep.status === 'PENDING';
                  const hasRemarks = Boolean(rep.remarks && rep.remarks.trim() !== '' && !rep.remarks.includes('특이사항 없음'));

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
          setSelectedReport(undefined);
          if (previousWorkerUserRef.current) {
            setSelectedWorkerUser(previousWorkerUserRef.current);
            previousWorkerUserRef.current = undefined;
          }
        }}
        onReportUpdated={(updated) => {
          setSelectedReport(updated);
          loadDashboardData();
        }}
      />

      {/* ── 5. WORKER ACCOUNT DETAIL POPUP MODAL (통합 컴포넌트) ── */}
      <AccountDetailDialog
        isOpen={!!selectedWorkerUser}
        onClose={() => {
          setSelectedWorkerUser(undefined);
          previousWorkerUserRef.current = undefined;
        }}
        user={selectedWorkerUser}
        reports={workerReports}
        sites={sites}
        initialTab="performance"
        showDeleteButton={false}
        onUserUpdated={(updated) => {
          setSelectedWorkerUser(updated);
        }}
        onReportClick={(rep) => {
          previousWorkerUserRef.current = selectedWorkerUser;
          setSelectedWorkerUser(undefined);
          setSelectedReport(rep);
        }}
      />

      {/* ── 6. SITE DETAIL POPUP MODAL (공통 컴포넌트) ── */}
      <SiteDetailDialog
        isOpen={!!selectedDetailSite}
        onClose={() => setSelectedDetailSite(undefined)}
        site={selectedDetailSite}
        showDeleteButton={false}
        onSiteUpdated={(updated) => {
          setSelectedDetailSite(updated);
          setSites(prev => prev.map(s => s.siteId === updated.siteId ? updated : s));
        }}
      />
    </div>
  );
}
