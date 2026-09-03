'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  UserCheck,
  Award, 
  ArrowUpRight,
  ClipboardCheck,
  RotateCcw,
  Check,
  X,
  CameraOff
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Link from 'next/link';

import RegionSelector, { RegionValue } from '@/components/common/RegionSelector';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import StatusBadge from '@/components/common/StatusBadge';
import SlideDialog from '@/components/dialog/SlideDialog';
import { getStoredReports, subscribeToReportsUpdate } from '@/data/reportStorage';
import { getStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
import { getSiteWorkers } from '@/data/siteData';
import '../ManageLayout.scss';

dayjs.locale('ko');

// 필수 5종 사진 슬롯 규격
const REQUIRED_PHOTO_SLOTS = [
  { type: 'DOOR', title: '신주소 보이는 대문 등' },
  { type: 'BEFORE1', title: '단독경보형감지기 보급 전 ①' },
  { type: 'AFTER1', title: '단독경보형감지기 보급 후 ①' },
  { type: 'BEFORE2', title: '단독경보형감지기 보급 전 ②' },
  { type: 'AFTER2', title: '단독경보형감지기 보급 후 ②' },
];

export default function ManageDashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const { region, setRegion } = useManageRegion();

  const [reports, setReports] = useState<WorkReport[]>([]);
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  // 1. Initial Load & Real-time Subscription
  useEffect(() => {
    setReports(getStoredReports());
    setSites(getStoredSites());

    const unsubReports = subscribeToReportsUpdate(newReports => {
      setReports(newReports);
    });
    const unsubSites = subscribeToSitesUpdate(newSites => {
      setSites(newSites);
    });

    return () => {
      unsubReports();
      unsubSites();
    };
  }, []);

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
    
    // Reports with notable remarks or issues (미완료 건 중 특이사항 또는 보완요청/반려 건만 집계)
    const issueReports = filteredReports.filter(
      r => r.status !== 'COMPLETED' && ((r.remarks && r.remarks.trim() !== '' && !r.remarks.includes('특이사항 없음')) || r.status === 'REJECTED')
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
    const map = new Map<string, { 
      name: string; 
      phone?: string; 
      total: number; 
      completed: number; 
      pending: number; 
      rejected: number; 
      siteCount: number;
    }>();

    // 1) 현재 선택된 권역의 사이트에 배정된 작업자 우선 등록
    filteredSites.forEach(site => {
      const workers = getSiteWorkers(site);
      workers.forEach(w => {
        const key = w.userName || w.userId || '미지정';
        const existing = map.get(key) || {
          name: w.userName || '미지정',
          phone: w.userPhone,
          total: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
          siteCount: 0,
        };
        existing.siteCount += 1;
        if (!existing.phone && w.userPhone) existing.phone = w.userPhone;
        map.set(key, existing);
      });
    });

    // 2) 현재 선택된 권역의 보고서 작업 실적 매핑 및 누적
    filteredReports.forEach(rep => {
      const workerName = rep.reporterName || '미지정';
      const existing = map.get(workerName) || {
        name: workerName,
        phone: undefined,
        total: 0,
        completed: 0,
        pending: 0,
        rejected: 0,
        siteCount: 0,
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

  // 7. Notable Issue Reports (미완료 건 중 특이사항 또는 보완요청/반려 건만 표시)
  const issueReports = useMemo(() => {
    return [...filteredReports]
      .filter(r => r.status !== 'COMPLETED' && ((r.remarks && r.remarks.trim() !== '' && !r.remarks.includes('특이사항 없음')) || r.status === 'REJECTED'))
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

  return (
    <div className="manage-dashboard-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>현장 작업 통합 대시보드</h2>
          <p>설치 현황, 진행률 및 작업자 실적을 모니터링합니다.</p>
        </div>
      </div>

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
            <span className="kpi-sub-text warning">
              {regionalMetrics.pendingReports > 0 ? '승인 심사 대기 중' : '모두 확인됨'}
            </span>
          </div>
          <div className="kpi-card-footer">
            <Link href="/manage/work" className="kpi-action-link">
              <span>보고서 관리 바로가기</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Metric 4: 특이사항 & 반려 세대 */}
        <div className="kpi-card issues-kpi">
          <div className="kpi-header">
            <span className="kpi-label">특이사항 및 보완 요청</span>
            <div className="kpi-icon issues">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <h3 className="kpi-value">{regionalMetrics.issueCount}<span>건</span></h3>
            <span className="kpi-sub-text danger">
              {regionalMetrics.rejectedReports > 0 ? `반려 ${regionalMetrics.rejectedReports}건 포함` : '현장 비고 확인 필요'}
            </span>
          </div>
          <div className="kpi-card-footer">
            <span className="sub-note">작업자 특이 소견 및 재확인 대상</span>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN DASHBOARD CONTENT (2-COLUMN LAYOUT) ── */}
      <div className="dashboard-sections-grid">
        {/* ── [LEFT COLUMN]: 지역별 진행 현황 & 작업자 실적 ── */}
        <div className="dashboard-column left-column">
          {/* 사업지/단지별 진행 현황 */}
          <div className="dash-card site-progress-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <Building2 size={18} className="title-icon" />
                <h4>사업지(단지)별 보급 진행 현황</h4>
              </div>
              <span className="count-pill">{filteredSites.length}개 사업지</span>
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
                    <div key={site.id} className="site-progress-item">
                      <div className="item-meta-line">
                        <div className="site-name-wrap">
                          <span className="site-name">{site.name}</span>
                          <span className="site-addr">{site.address}</span>
                        </div>
                        <div className="site-rate-wrap">
                          <span className="ratio-text">
                            <strong>{completed}</strong> / {total}세대
                          </span>
                          <span className={`rate-badge ${isDone ? 'done' : ''}`}>
                            {rate}%
                          </span>
                        </div>
                      </div>
                      <div className="progress-track">
                        <div 
                          className={`progress-fill ${isDone ? 'done' : ''}`}
                          style={{ width: `${Math.min(rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {filteredSites.length > 6 && (
              <div className="dash-card-more">
                <Link href="/manage/sites" className="btn-view-all">
                  <span>전체 {filteredSites.length}개 사업지 확인</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* 지역 담당 작업자별 설치 실적 */}
          <div className="dash-card worker-ranking-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <UserCheck size={18} className="title-icon" />
                <h4>지역 담당 작업자별 설치 실적</h4>
              </div>
              <span className="count-pill">담당 {workerStats.length}명</span>
            </div>

            <div className="worker-stats-list">
              {workerStats.length === 0 ? (
                <div className="dash-empty-state">
                  <p>해당 지역에 배정된 작업자 또는 등록된 실적이 없습니다.</p>
                </div>
              ) : (
                workerStats.map(w => {
                  const compRate = w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0;

                  return (
                    <div key={w.name} className="worker-stat-item">
                      <div className="worker-avatar-badge">
                        <span className="avatar-initial">{w.name.slice(0, 1)}</span>
                      </div>

                      <div className="worker-info-col">
                        <div className="worker-top-row">
                          <span className="worker-name">{w.name}</span>
                          {w.phone && (
                            <span className="worker-contact">{w.phone}</span>
                          )}
                          {w.siteCount > 0 && (
                            <span className="worker-sites-badge">담당 {w.siteCount}개소</span>
                          )}
                        </div>
                        <div className="worker-metric-bar">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${compRate}%` }} 
                            title={`완료율 ${compRate}%`}
                          />
                        </div>
                      </div>

                      <div className="worker-stats-col">
                        <span className="total-val"><strong>{w.total}</strong>건</span>
                        <div className="sub-status-tags">
                          <span className="tag-comp" title="완료">완료 {w.completed}</span>
                          {w.pending > 0 && <span className="tag-pend" title="대기">대기 {w.pending}</span>}
                          {w.rejected > 0 && <span className="tag-rej" title="반려">반려 {w.rejected}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ── [RIGHT COLUMN]: 특이사항 모니터링 & 최근 보고서 ── */}
        <div className="dashboard-column right-column">
          {/* 특이사항 및 보완 요청 보고서 */}
          <div className="dash-card issue-reports-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <AlertTriangle size={18} className="title-icon danger" />
                <h4>특이사항 및 보완 요청 확인서</h4>
              </div>
              <span className="count-pill danger">{issueReports.length}건</span>
            </div>

            <div className="issue-reports-list">
              {issueReports.length === 0 ? (
                <div className="dash-empty-state clean">
                  <CheckCircle2 size={32} className="clean-icon" />
                  <p>현재 접수된 특이사항이나 보완 요청이 없습니다.</p>
                </div>
              ) : (
                issueReports.map(rep => (
                  <div 
                    key={rep.reportId} 
                    className={`issue-item ${rep.status === 'REJECTED' ? 'rejected' : 'notable'}`}
                    onClick={() => setSelectedReport(rep)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="issue-item-header">
                      <div className="unit-info">
                        <strong>{rep.siteName}</strong>
                        <span className="dong-ho">{rep.dong}동 {rep.ho}호</span>
                        <span className="head-name">({rep.headName})</span>
                      </div>
                      <StatusBadge status={rep.status} />
                    </div>

                    <div className="issue-content-bubble">
                      {rep.status === 'REJECTED' ? (
                        <p className="alert-reason">
                          <strong>[반려 사유]</strong> {rep.fixReason || '보완 요청이 기재되지 않았습니다.'}
                        </p>
                      ) : (
                        <p className="remarks-reason">
                          <strong>[현장 비고]</strong> {rep.remarks}
                        </p>
                      )}
                    </div>

                    <div className="issue-meta-footer">
                      <span>작업자: <strong>{rep.reporterName}</strong></span>
                      <span className="time">{rep.submittedAt || rep.reportTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 최근 제출된 보고서 타임라인 */}
          <div className="dash-card recent-reports-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <Clock size={18} className="title-icon" />
                <h4>최근 제출 보고서 피드</h4>
              </div>
              <Link href="/manage/work" className="link-all">
                <span>전체보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="recent-reports-list">
              {recentReports.length === 0 ? (
                <div className="dash-empty-state">
                  <p>최근 등록된 작업 보고서가 없습니다.</p>
                </div>
              ) : (
                recentReports.map(rep => (
                  <div 
                    key={rep.reportId} 
                    className="recent-report-row"
                    onClick={() => setSelectedReport(rep)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="report-main-col">
                      <div className="location-line">
                        <span className="site">{rep.siteName}</span>
                        <span className="unit">{rep.dong}동 {rep.ho}호</span>
                        <span className="head">{rep.headName} 세대</span>
                      </div>
                      <div className="meta-line">
                        <span className="reporter">보고자: {rep.reporterName}</span>
                        <span className="dot">·</span>
                        <span className="date">{rep.submittedAt || rep.reportTime || rep.installDate}</span>
                      </div>
                    </div>
                    <div className="report-status-col">
                      <StatusBadge status={rep.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. REPORT DETAIL POPUP MODAL (CONFIRMATION SHEET VIEW) ── */}
      <SlideDialog
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="현장 확인서 상세 열람"
        className="manage-dashboard-report-dialog"
        footer={
          selectedReport ? (
            <div className="dashboard-dialog-footer">
              <Link href="/manage/work" className="btn-goto-work">
                <FileText size={15} />
                <span>보고서 관리에서 처리하기</span>
              </Link>
              <button 
                type="button" 
                className="btn-dialog-close" 
                onClick={() => setSelectedReport(null)}
              >
                닫기
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedReport && (
          <div className="dashboard-dialog-content">
            <div className="report-target-summary">
              <div className="target-title-line">
                <Building2 size={16} />
                <h3>{selectedReport.siteName} {selectedReport.dong}동 {selectedReport.ho}호</h3>
                <span className="head-badge">{selectedReport.headName} 세대주</span>
              </div>
              <p className="target-address">{selectedReport.address}</p>
            </div>

            <div className="report-quick-meta-grid">
              <div className="meta-cell">
                <span className="label">설치 일자</span>
                <span className="val">{selectedReport.installDate || '-'}</span>
              </div>
              <div className="meta-cell">
                <span className="label">보고자</span>
                <span className="val">{selectedReport.reporterName}</span>
              </div>
              <div className="meta-cell">
                <span className="label">확인 상태</span>
                <div className="val"><StatusBadge status={selectedReport.status} /></div>
              </div>
              <div className="meta-cell">
                <span className="label">제출 시각</span>
                <span className="val">{selectedReport.submittedAt || selectedReport.reportTime}</span>
              </div>
            </div>

            {/* 현장 사진 섹션 (제출 다이얼로그와 100% 동일한 UI 규격 및 상태 피드백) */}
            <div className="dialog-photos-section">
              {(() => {
                const getPhoto = (type: string) => {
                  return selectedReport.photos?.find(
                    p => p.type?.toUpperCase() === type.toUpperCase() ||
                         (type === 'DOOR' && (p.title?.includes('대문') || p.type?.toLowerCase() === 'door')) ||
                         (type === 'BEFORE1' && (p.title?.includes('전 ①') || p.type?.toLowerCase() === 'before1')) ||
                         (type === 'AFTER1' && (p.title?.includes('후 ①') || p.type?.toLowerCase() === 'after1')) ||
                         (type === 'BEFORE2' && (p.title?.includes('전 ②') || p.type?.toLowerCase() === 'before2')) ||
                         (type === 'AFTER2' && (p.title?.includes('후 ②') || p.type?.toLowerCase() === 'after2'))
                  );
                };

                const doorPhoto = getPhoto('DOOR');
                const before1Photo = getPhoto('BEFORE1');
                const after1Photo = getPhoto('AFTER1');
                const before2Photo = getPhoto('BEFORE2');
                const after2Photo = getPhoto('AFTER2');

                const submittedCount = [doorPhoto, before1Photo, after1Photo, before2Photo, after2Photo].filter(p => Boolean(p?.url)).length;

                const renderPhotoUploadBox = (label: string, photo: ReportPhoto | undefined) => {
                  const hasPhoto = Boolean(photo?.url);
                  return (
                    <div className={`photo-upload-box ${hasPhoto ? 'has-photo' : 'empty-slot'}`}>
                      <div className="photo-label-row">
                        <span className="photo-label">{label}</span>
                        {!hasPhoto && <span className="unsubmitted-tag">미제출</span>}
                      </div>
                      {hasPhoto ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photo!.url} alt={label} className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">
                          <CameraOff size={24} className="empty-icon" />
                          <span className="empty-text">사진 미제출</span>
                        </div>
                      )}
                    </div>
                  );
                };

                return (
                  <>
                    <div className="photos-header-row">
                      <label className="form-label">
                        <span>현장 사진 (총 5개)</span>
                      </label>
                      <span className={`photos-count-pill ${submittedCount === 5 ? 'completed' : 'pending'}`}>
                        {submittedCount === 5 ? '✓ 5개 완료' : `${submittedCount} / 5개 등록`}
                      </span>
                    </div>

                    <div className="photos-clean-layout">
                      {/* 1. 신주소 대문 (좌측 50% 너비 단독) */}
                      <div className="door-single-section">
                        {renderPhotoUploadBox('1. 신주소 대문', doorPhoto)}
                      </div>

                      {/* 2~5. 감지기 1, 2 세트 (2열 그리드) */}
                      <div className="sensor-pairs-grid">
                        {renderPhotoUploadBox('2. 보급 전 ①', before1Photo)}
                        {renderPhotoUploadBox('3. 보급 후 ①', after1Photo)}
                        {renderPhotoUploadBox('4. 보급 전 ②', before2Photo)}
                        {renderPhotoUploadBox('5. 보급 후 ②', after2Photo)}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Remarks / Fix Reason */}
            {selectedReport.remarks && (
              <div className="dialog-remarks-box">
                <span className="box-title">특이사항 및 비고</span>
                <p>{selectedReport.remarks}</p>
              </div>
            )}
            {selectedReport.status === 'REJECTED' && (
              <div className="dialog-rejected-box">
                <span className="box-title">수정 및 보완 요청 사유</span>
                <p>{selectedReport.fixReason || '보완 요청 사유가 기재되지 않았습니다.'}</p>
              </div>
            )}
          </div>
        )}
      </SlideDialog>
    </div>
  );
}
