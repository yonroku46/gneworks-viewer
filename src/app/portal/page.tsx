'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useAuth } from '@/providers/AuthProvider';
import {
  ClipboardCheck,
  Hourglass,
  AlertCircle,
  Clock,
  ArrowRight,
  Headphones,
  Sparkles,
  Search,
  Check,
  MessageCircle,
} from 'lucide-react';
import { SiteInfo } from '@/data/siteData';
import { getStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
import {
  AssignedRegion,
  getStoredAssignedRegions,
  subscribeToAssignedRegionsUpdate,
} from '@/data/regionStorage';
import {
  getStoredReports,
  subscribeToReportsUpdate,
} from '@/data/reportStorage';

import WorkReportDialog, { TargetHousehold } from '@/components/dialog/WorkReportDialog';
import WorkHistoryDialog from '@/components/dialog/WorkHistoryDialog';
import InquiryHistoryDialog from '@/components/dialog/InquiryHistoryDialog';
import WorkHistoryCard from '@/components/common/WorkHistoryCard';
import './Portal.scss';

export default function PortalPage() {
  const { user } = useAuth();
  const displayName = user?.userName || '현장 작업자';

  // Storage states
  const [allSites, setAllSites] = useState<SiteInfo[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<AssignedRegion[]>([]);
  const [reports, setReports] = useState<WorkReport[]>([]);

  // Dialog state for viewing report & history
  const [reportTarget, setReportTarget] = useState<TargetHousehold | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isInquiryHistoryOpen, setIsInquiryHistoryOpen] = useState(false);

  useEffect(() => {
    setAllSites(getStoredSites());
    setAssignedRegions(getStoredAssignedRegions());
    setReports(getStoredReports());

    const unsubSites = subscribeToSitesUpdate(sites => setAllSites(sites));
    const unsubRegions = subscribeToAssignedRegionsUpdate(regions => setAssignedRegions(regions));
    const unsubReports = subscribeToReportsUpdate(reps => setReports(reps));

    return () => {
      unsubSites();
      unsubRegions();
      unsubReports();
    };
  }, []);

  // 담당 지역의 현장들
  const assignedSites = useMemo(() => {
    if (assignedRegions.length === 0) return [];
    return allSites.filter(site =>
      assignedRegions.some(reg => reg.sido === site.sido && reg.sigungu === site.sigungu)
    );
  }, [allSites, assignedRegions]);

  // 담당 지역의 전체 세대 수
  const totalAssignedHouseholds = useMemo(() => {
    return assignedSites.reduce((acc, site) => acc + (site.households?.length || 0), 0);
  }, [assignedSites]);

  // 실시간 통계 계산
  const stats = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let revise = 0;
    let todayCount = 0;

    const todayStr = dayjs().format('YYYY-MM-DD');

    reports.forEach(r => {
      if (r.status === 'COMPLETED') completed += 1;
      else if (r.status === 'PENDING') pending += 1;
      else if (r.status === 'REJECTED') revise += 1;

      if (r.installDate === todayStr || (r.reportTime && r.reportTime.startsWith(todayStr))) {
        todayCount += 1;
      }
    });

    const completionRate =
      totalAssignedHouseholds > 0
        ? Math.round((completed / totalAssignedHouseholds) * 100)
        : 0;

    return {
      completed,
      pending,
      revise,
      todayCount,
      completionRate,
      totalAssignedHouseholds,
    };
  }, [reports, totalAssignedHouseholds]);

  // 최근 작업 이력 (최신순 5건)
  const recentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => {
        const timeA = a.reportTime || a.installDate || '';
        const timeB = b.reportTime || b.installDate || '';
        return timeB.localeCompare(timeA);
      })
      .slice(0, 5);
  }, [reports]);

  // 이력 항목 클릭 시 보고서 다이얼로그 열기
  const handleOpenReportFromHistory = (report: WorkReport) => {
    setReportTarget({
      siteId: report.siteId,
      siteName: report.siteName,
      sido: report.sido,
      sigungu: report.sigungu,
      eupmyeondong: report.eupmyeondong,
      address: report.address,
      dong: report.dong,
      ho: report.ho,
      headName: report.headName,
      existingReport: report,
    });
    setIsReportDialogOpen(true);
  };

  return (
    <div className="portal-page">
      {/* ── HEADER SUMMARY ── */}
      <section className="portal-header-section">
        <div className="portal-title-group">
          <h1 className="portal-page-title">반갑습니다, {displayName}님!</h1>
          <p className="portal-page-sub">
            현장의 작업 현황과 최근 제출 이력을 한눈에 확인하세요.
          </p>
        </div>
      </section>

      {/* ── STATS SUMMARY (REALTIME 4-GRID) ── */}
      <section className="portal-stats-grid">
        <div className="stat-card completed">
          <div className="stat-header">
            <span className="stat-label">확인완료</span>
            <div className="stat-icon-wrapper green">
              <Check size={17} strokeWidth={2.5} />
            </div>
          </div>
          <div className="stat-main">
            <h3 className="stat-value">{stats.completed}<span>건</span></h3>
          </div>
          <div className="stat-footer">
            <span className="sub-note">승인 완료된 보고서</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-header">
            <span className="stat-label">검토대기</span>
            <div className="stat-icon-wrapper amber">
              <Hourglass size={17} />
            </div>
          </div>
          <div className="stat-main">
            <h3 className="stat-value">{stats.pending}<span>건</span></h3>
          </div>
          <div className="stat-footer">
            <span className="sub-note">관리자 심사 대기</span>
          </div>
        </div>

        <div className={`stat-card revise ${stats.revise > 0 ? 'highlight-alert' : ''}`}>
          <div className="stat-header">
            <span className="stat-label">반려됨</span>
            <div className="stat-icon-wrapper red">
              <AlertCircle size={17} />
            </div>
          </div>
          <div className="stat-main">
            <h3 className="stat-value">{stats.revise}<span>건</span></h3>
          </div>
          <div className="stat-footer">
            <span className={`sub-note ${stats.revise > 0 ? 'danger-note' : ''}`}>
              {stats.revise > 0 ? '재작성 및 보완 필요' : '보완 요청 없음'}
            </span>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-header">
            <span className="stat-label">오늘 작업</span>
            <div className="stat-icon-wrapper blue">
              <Clock size={17} />
            </div>
          </div>
          <div className="stat-main">
            <h3 className="stat-value">{stats.todayCount}<span>건</span></h3>
          </div>
          <div className="stat-footer">
            <span className="sub-note">금일 신규 등록</span>
          </div>
        </div>
      </section>

      {/* ── RECENT WORK HISTORY SECTION ── */}
      <section className="recent-works-section">
        <div className="section-header-row">
          <h2 className="portal-section-title">최근 작업 이력</h2>
          <button
            type="button"
            className="btn-history-search"
            onClick={() => setIsHistoryDialogOpen(true)}
          >
            <Search size={13} />
            <span>전체 이력 조회</span>
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="recent-works-empty">
            <ClipboardCheck size={36} className="empty-icon" />
            <p className="empty-title">아직 등록된 작업 이력이 없습니다.</p>
            <p className="empty-desc">
              [작업 목록]에서 배정된 세대를 선택하고 시공 사진과 보고서를 등록해 보세요.
            </p>
            <Link href="/portal/work" className="btn-start-work">
              작업 시작하기
            </Link>
          </div>
        ) : (
          <div className="recent-works-list">
            {recentReports.map(report => (
              <WorkHistoryCard
                key={report.reportId}
                report={report}
                onClick={() => handleOpenReportFromHistory(report)}
                showSiteName={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── QUICK ACTIONS & SUPPORT ── */}
      <section className="support-section">
        <div className="section-header-row">
          <h2 className="portal-section-title">현장 지원 및 안내</h2>
        </div>
        {/* ── NOTICE FEED ── */}
        <section className="portal-notice-card">
          <div className="notice-header">
            <span className="notice-badge"> 
              <Sparkles size={12} /> 현장 안내사항
            </span>
            <span className="notice-date">2026.09.02</span>
          </div>
          <h4 className="notice-title">현장 사진 촬영 및 보고서 작성 지침 안내</h4>
          <p className="notice-content">
            작업 전/후 사진은 가이드라인 안내선에 맞추어 선명하게 촬영해 주시기 바라며, 작업 확인 완료된 세대는 임의 수정이 불가하오니 제출 전 확인자 서명 및 기재사항을 꼼꼼히 확인 바랍니다.
          </p>
        </section>
        <div className="portal-action-grid">
          <Link href="/contact?type=inquiry" className="action-card">
            <div className="action-header">
              <div className="action-icon-box">
                <Headphones size={20} />
              </div>
              <ArrowRight size={18} className="action-arrow" />
            </div>
            <h3 className="action-title">현장 지원 및 업무 문의</h3>
            <p className="action-desc">작업 중 발생한 특이사항이나 지원 요청을 접수합니다.</p>
          </Link>

          <button
            type="button"
            className="action-card"
            onClick={() => setIsInquiryHistoryOpen(true)}
          >
            <div className="action-header">
              <div className="action-icon-box">
                <MessageCircle size={20} />
              </div>
              <ArrowRight size={18} className="action-arrow" />
            </div>
            <h3 className="action-title">문의 및 답변 내역</h3>
            <p className="action-desc">접수한 업무 문의의 처리 상태와 관리자 답변을 확인합니다.</p>
          </button>
        </div>
      </section>

      {/* ── WORK REPORT DETAIL DIALOG ── */}
      <WorkReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        target={reportTarget}
      />

      {/* ── WORK HISTORY SEARCH & FILTER DIALOG ── */}
      <WorkHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        onSelectReport={report => {
          handleOpenReportFromHistory(report);
        }}
      />

      {/* ── INQUIRY & ANSWER HISTORY DIALOG ── */}
      <InquiryHistoryDialog
        isOpen={isInquiryHistoryOpen}
        onClose={() => setIsInquiryHistoryOpen(false)}
      />
    </div>
  );
}
