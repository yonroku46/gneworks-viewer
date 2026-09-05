'use client';

import React, { useState, useMemo } from 'react';
import SlideDialog from './SlideDialog';
import dayjs from 'dayjs';
import { TARGET_TYPE_LABEL_MAP } from '@/components/common/StatusBadge';
import { 
  Printer, 
  MapPin, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import './RegionalBatchPrintDialog.scss';

export interface RegionalBatchPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  region: SelectedRegion;
  reports: WorkReport[];
  sites?: SiteDetail[];
}

export default function RegionalBatchPrintDialog({
  isOpen,
  onClose,
  region,
  reports,
  sites = [],
}: RegionalBatchPrintDialogProps) {
  // ── Mode: 'filter' (보고서 관리/필터) vs 'preview' (제출용 PDF 미리보기) ──
  const [activeTab, setActiveTab] = useState<'filter' | 'preview'>('filter');

  // ── Filter States ──
  const [datePreset, setDatePreset] = useState<'all' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // ── Fire Station Name (소방서명) ──
  const [fireStationName, setFireStationName] = useState<string>(() => {
    if (region.sigungu && region.sigungu !== 'ALL') {
      return `${region.sigungu}소방서`;
    }
    if (region.sido && region.sido !== 'ALL') {
      return `${region.sido}소방서`;
    }
    return '';
  });

  // Update default station name if region changes
  React.useEffect(() => {
    if (region.sigungu && region.sigungu !== 'ALL') {
      setFireStationName(`${region.sigungu}소방서`);
    } else if (region.sido && region.sido !== 'ALL') {
      setFireStationName(`${region.sido}소방서`);
    } else {
      setFireStationName('');
    }
  }, [region]);

  // ── Number of Preview Items to Show (화면 렉 방지용 페이지네이션/토글) ──
  const [showAllInPreview, setShowAllInPreview] = useState(false);

  // ── Region Label ──
  const regionLabel = useMemo(() => {
    const parts = [];
    if (region.sido && region.sido !== 'ALL') parts.push(region.sido);
    if (region.sigungu && region.sigungu !== 'ALL') parts.push(region.sigungu);
    if (region.eupmyeondong && region.eupmyeondong !== 'ALL') parts.push(region.eupmyeondong);
    return parts.length > 0 ? parts.join(' ') : '전체 지역';
  }, [region]);

  // ── Target Reports: 오직 '확인완료(COMPLETED)' 보고서만 엄격 필터링 ──
  const completedReportsInRegion = useMemo(() => {
    return reports.filter(r => {
      // 1. 확인완료 상태만 대상
      if (r.status !== 'COMPLETED') {
        return false;
      }

      // 2. 지역 매칭
      if (region.sido && region.sido !== 'ALL' && r.sido !== region.sido) {
        return false;
      }
      if (region.sigungu && region.sigungu !== 'ALL' && r.sigungu !== region.sigungu) {
        return false;
      }
      if (region.eupmyeondong && region.eupmyeondong !== 'ALL' && r.eupmyeondong !== region.eupmyeondong) {
        return false;
      }

      return true;
    });
  }, [reports, region]);

  // ── Date Filtered Reports ──
  const filteredReports = useMemo(() => {
    return completedReportsInRegion.filter(r => {
      const rDate = r.installDate || (r.reportTime ? r.reportTime.split(' ')[0] : '');
      if (startDate && rDate && rDate < startDate) return false;
      if (endDate && rDate && rDate > endDate) return false;
      return true;
    });
  }, [completedReportsInRegion, startDate, endDate]);

  // ── Selected Report IDs for Export ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Automatically select all filtered reports on filter change
  React.useEffect(() => {
    setSelectedIds(new Set(filteredReports.map(r => r.reportId)));
  }, [filteredReports]);

  const isAllSelected = filteredReports.length > 0 && selectedIds.size === filteredReports.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReports.map(r => r.reportId)));
    }
  };

  const handleToggleRow = (reportId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(reportId)) {
        next.delete(reportId);
      } else {
        next.add(reportId);
      }
      return next;
    });
  };

  // ── Final Reports for Export (Checked items from filtered list) ──
  const exportReports = useMemo(() => {
    return filteredReports.filter(r => selectedIds.has(r.reportId));
  }, [filteredReports, selectedIds]);

  // Total detector count for export reports
  const totalDetectorCount = useMemo(() => {
    return exportReports.length * 2; // Default standard: 2 per household
  }, [exportReports]);

  // Helper to find household info from sites
  const getHouseholdInfo = (report: WorkReport) => {
    const site = sites.find(s => s.siteId === report.siteId || s.name === report.siteName);
    if (!site) return null;
    return site.households?.find(h => h.dong === report.dong && h.ho === report.ho);
  };

  // Quick Date Preset Handler (전체, 1개월, 기간선택)
  const handleDatePreset = (preset: 'all' | 'month' | 'custom') => {
    setDatePreset(preset);
    const today = dayjs();
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'month') {
      setStartDate(today.subtract(1, 'month').format('YYYY-MM-DD'));
      setEndDate(today.format('YYYY-MM-DD'));
    } else if (preset === 'custom') {
      if (!startDate) {
        setStartDate(today.startOf('month').format('YYYY-MM-DD'));
      }
      if (!endDate) {
        setEndDate(today.format('YYYY-MM-DD'));
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="지역별 일괄 보고서 PDF 출력"
      className="regional-batch-modal confirmation-dialog"
      footer={
        <div className="batch-dialog-footer-actions confirmation-modal-footer-actions">
          {activeTab === 'filter' ? (
            <>
              <button
                type="button"
                className="btn-flex-secondary btn-close-action"
                onClick={onClose}
              >
                <span>닫기</span>
              </button>
              <button
                type="button"
                className="btn-flex-primary btn-status-action"
                onClick={() => setActiveTab('preview')}
                disabled={exportReports.length === 0}
              >
                <span>제출용 A4 서식 미리보기 ({exportReports.length}건)</span>
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-flex-secondary btn-edit-trigger"
                onClick={() => setActiveTab('filter')}
              >
                <span>필터 및 목록으로 돌아가기</span>
              </button>
              <button
                type="button"
                className="btn-flex-primary btn-print-action"
                onClick={handlePrint}
                disabled={exportReports.length === 0}
              >
                <Printer size={16} />
                <span>PDF 출력 / 인쇄하기 ({exportReports.length}건)</span>
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="regional-batch-dialog">
        {/* ── TOP HEADER CARD ── */}
        <div className="batch-dialog-header-card">
          <div className="header-left">
            <div className="header-title-row">
              <h3>{regionLabel} 단독경보형감지기 보급완료 보고서</h3>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-label">확인완료 보고서</span>
              <span className="stat-val">{completedReportsInRegion.length}건</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">출력 대상 세대</span>
              <span className="stat-val">{exportReports.length}세대</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">총 감지기 수량</span>
              <span className="stat-val">{totalDetectorCount}개</span>
            </div>
          </div>
        </div>

        {/* ── TABS BAR (SiteDetailDialog / AccountDetailDialog 와 100% 동일한 탭 디자인, 아이콘 없음) ── */}
        <div className="site-detail-tabs-bar batch-tabs-bar">
          <button
            type="button"
            className={`detail-tab-btn ${activeTab === 'filter' ? 'active' : ''}`}
            onClick={() => setActiveTab('filter')}
          >
            <span>보고서 일람</span>
            <span className="tab-count-badge">{filteredReports.length}</span>
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span>제출용 A4 미리보기</span>
            <span className="tab-count-badge">{exportReports.length}</span>
          </button>
        </div>

        {/* ── TAB 1: FILTER & MANAGEMENT ── */}
        {activeTab === 'filter' && (
          <div className="batch-filter-content">
            {/* Filter Section: 줄바꿈 없이 깔끔한 2열 플렉스 레이아웃 */}
            <div className="batch-controls-unified-bar">
              <div className="control-field-inline">
                <label className="field-inline-label">관할 소방서</label>
                <input
                  type="text"
                  className="station-inline-input"
                  value={fireStationName}
                  onChange={e => setFireStationName(e.target.value)}
                  placeholder="예: 연천소방서, 안산단원소방서"
                />
              </div>

              <div className="control-date-inline">
                <div className="date-presets-wrap">
                  <button
                    type="button"
                    className={`btn-preset ${datePreset === 'all' ? 'active' : ''}`}
                    onClick={() => handleDatePreset('all')}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    className={`btn-preset ${datePreset === 'month' ? 'active' : ''}`}
                    onClick={() => handleDatePreset('month')}
                  >
                    1개월
                  </button>
                  <button
                    type="button"
                    className={`btn-preset ${datePreset === 'custom' ? 'active' : ''}`}
                    onClick={() => handleDatePreset('custom')}
                  >
                    기간선택
                  </button>
                </div>
                <div className="date-range-pickers">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => {
                      setStartDate(e.target.value);
                      setDatePreset('custom');
                    }}
                  />
                  <span className="date-sep">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => {
                      setEndDate(e.target.value);
                      setDatePreset('custom');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Selection Toolbar */}
            <div className="batch-selection-toolbar">
              <div className="toolbar-left">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                  />
                  <span>전체 선택</span>
                </label>
                <div className="summary-stats">
                  <span>선택된 보고서: <strong>{selectedIds.size}</strong>건</span>
                  <span className="dot">•</span>
                  <span>설치 세대: <strong>{exportReports.length}</strong>세대</span>
                  <span className="dot">•</span>
                  <span>총 감지기: <strong>{totalDetectorCount}</strong>개</span>
                </div>
              </div>
            </div>

            {/* Reports Table List */}
            <div className="batch-reports-table-container">
              {filteredReports.length > 0 ? (
                <table className="batch-table">
                  <thead>
                    <tr>
                      <th className="col-chk">선택</th>
                      <th className="col-num">순번</th>
                      <th>현장(아파트명)</th>
                      <th>동 / 호수</th>
                      <th>세대주</th>
                      <th>보급 대상 구분</th>
                      <th>설치 일자</th>
                      <th>작업자</th>
                      <th style={{ textAlign: 'center' }}>감지기 수량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((rep, idx) => {
                      const isChecked = selectedIds.has(rep.reportId);
                      const hh = getHouseholdInfo(rep);
                      const targetType = hh?.targetType || 'GENERAL';
                      const targetLabel = TARGET_TYPE_LABEL_MAP[targetType] || targetType;

                      return (
                        <tr
                          key={rep.reportId || idx}
                          className={isChecked ? 'selected' : ''}
                          onClick={() => handleToggleRow(rep.reportId)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="col-chk" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRow(rep.reportId)}
                            />
                          </td>
                          <td className="col-num">
                            <span className="row-index">{idx + 1}</span>
                          </td>
                          <td><strong>{rep.siteName}</strong></td>
                          <td>{rep.dong}동 {rep.ho}호</td>
                          <td>{rep.headName}</td>
                          <td>
                            <span className={`type-tag ${
                              targetType === 'ELDERLY' ? 'elder' : 
                              targetType === 'CHILD' ? 'child' : 
                              targetType === 'DISABLED' ? 'disabled' : ''
                            }`}>
                              {targetLabel}
                            </span>
                          </td>
                          <td>{rep.installDate || rep.installDateFormatted || '—'}</td>
                          <td>{rep.reporterName}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--slate-800)' }}>
                            2개
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-table-state">
                  <p>선택된 필터 조건에 부합하는 확인완료 보고서가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: OFFICIAL A4 PDF PREVIEW & PRINT ── */}
        {activeTab === 'preview' && (
          <div className="batch-preview-content">
            {/* Preview Control Bar */}
            <div className="preview-control-bar">
              <div className="bar-left">
                <span className="preview-info-text">
                  총 <strong>{exportReports.length}</strong>건의 확인완료 보고서가 PDF 인쇄 대상으로 준비되었습니다.
                </span>
                {!showAllInPreview && exportReports.length > 3 && (
                  <button
                    type="button"
                    className="btn-toggle-limit"
                    onClick={() => setShowAllInPreview(true)}
                  >
                    확인서 전체 {exportReports.length}건 화면에 모두 펼치기
                  </button>
                )}
                {showAllInPreview && exportReports.length > 3 && (
                  <button
                    type="button"
                    className="btn-toggle-limit"
                    onClick={() => setShowAllInPreview(false)}
                  >
                    화면 최적화 (상위 3건만 표시)
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Viewport with A4 Papers */}
            <div className="preview-scroll-viewport">
              {/* ───────────────────────────────────────────────────────────── */}
              {/* PAGE 1: 단독경보형감지기 보급완료 보고서 대지 */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="official-attachment-paper">
                <div className="attachment-title-wrap">
                  <h1 className="attachment-main-title">단독경보형감지기 보급완료 보고서</h1>
                </div>

                {/* 1. 설치 현황 */}
                <div className="doc-section">
                  <h2 className="section-head">1. 단독경보형감지기 설치 현황</h2>
                  <ul className="overview-list">
                    <li>
                      가. 소&nbsp;&nbsp;방&nbsp;&nbsp;서 : <strong>{fireStationName}</strong>
                    </li>
                    <li>
                      나. 설치세대 : <strong>{exportReports.length}</strong>세대
                    </li>
                    <li>
                      다. 설치수량 : 감지기 <strong>{totalDetectorCount}</strong>개
                    </li>
                  </ul>
                </div>

                {/* 2. 설치 세부내역 표 */}
                <div className="doc-section">
                  <h2 className="section-head">2. 단독경보형감지기 설치 세부내역</h2>
                  <div className="detail-table-wrap">
                    <table className="detail-official-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>연번</th>
                          <th style={{ width: '80px' }}>구분</th>
                          <th style={{ width: '75px' }}>성명</th>
                          <th>주소</th>
                          <th style={{ width: '100px' }}>연락처</th>
                          <th style={{ width: '90px' }}>감지기 설치수량</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exportReports.length > 0 ? (
                          exportReports.map((rep, idx) => {
                            const hh = getHouseholdInfo(rep);
                            const targetType = hh?.targetType || 'GENERAL';
                            const targetLabel = TARGET_TYPE_LABEL_MAP[targetType] || targetType;
                            const fullAddr = rep.address 
                              ? `${rep.address} ${rep.dong}동 ${rep.ho}호`
                              : `${rep.siteName} ${rep.dong}동 ${rep.ho}호`;

                            return (
                              <tr key={rep.reportId || idx}>
                                <td className="center">{idx + 1}</td>
                                <td className="center">{targetLabel}</td>
                                <td className="center">{rep.headName}</td>
                                <td className="addr" title={fullAddr}>{fullAddr}</td>
                                <td className="center">010-****-****</td>
                                <td className="center">2</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="center" style={{ padding: '2rem 1rem', color: 'var(--slate-400)' }}>
                              출력할 세부내역이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* PAGE 2 ~ N+1: 선택된 세대별 단독경보형감지기 보급지원확인서 */}
              {/* ───────────────────────────────────────────────────────────── */}
              {exportReports.map((rep, idx) => {
                const isHiddenInScreen = !showAllInPreview && idx >= 3;
                const doorPhoto = rep.photos?.find(p => p.type === 'DOOR')?.url || '';
                const before1Photo = rep.photos?.find(p => p.type === 'BEFORE1')?.url || '';
                const after1Photo = rep.photos?.find(p => p.type === 'AFTER1')?.url || '';
                const before2Photo = rep.photos?.find(p => p.type === 'BEFORE2')?.url || '';
                const after2Photo = rep.photos?.find(p => p.type === 'AFTER2')?.url || '';

                return (
                  <div 
                    key={rep.reportId || idx} 
                    className={`official-report-page-sheet ${isHiddenInScreen ? 'hidden-in-preview-only' : ''}`}
                    style={isHiddenInScreen ? { display: 'none' } : undefined}
                  >
                    <div className="confirmation-document-paper">
                      {/* 1. 상단 타이틀 및 확인자 직인 테이블 */}
                      <div className="doc-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4mm' }}>
                        <div className="doc-title-box">
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>단독경보형감지기 보급지원확인서</h2>
                        </div>
                        <table style={{ borderCollapse: 'collapse', border: '1px solid #111', fontSize: '0.6875rem' }}>
                          <thead>
                            <tr style={{ background: '#f1f5f9' }}>
                              <th style={{ border: '1px solid #111', padding: '0.125rem 0.5rem', fontWeight: 700 }}>확인자</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ border: '1px solid #111', padding: '0.25rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>
                                {rep.confirmerName || rep.headName}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ border: '1px solid #111', padding: '0.25rem', textAlign: 'center', height: '28px' }}>
                                {rep.confirmerSignature ? (
                                  <img src={rep.confirmerSignature} alt="서명" style={{ height: '24px', objectFit: 'contain' }} />
                                ) : (
                                  <span style={{ fontSize: '0.625rem', color: '#64748b' }}>(서명완료)</span>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* 2. 개인정보 수집 및 이용 동의 */}
                      <div style={{ border: '1px solid #cbd5e1', padding: '0.375rem 0.5rem', fontSize: '0.625rem', color: '#475569', marginBottom: '3mm', lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.125rem' }}>■ 개인정보의 수집 및 이용에 대한 동의</div>
                        <div>1. 수집목적: 경기도 소방재난본부 화재안전취약자 안전 생활환경 조성 지원 | 2. 수집항목: 세대 동, 호수, 이름</div>
                        <div>3. 보유기간: 무상교체(10년)까지 보유 및 이용 | 4. 동의 거부 시 무상보급 대상에서 제한될 수 있습니다.</div>
                      </div>

                      {/* 3. 주소 배너 */}
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.375rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4mm', display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: '#64748b', minWidth: '35px' }}>주소 :</span>
                        <span>{rep.address ? `${rep.address} (${rep.siteName})` : rep.siteName}</span>
                      </div>

                      {/* 4. 본문 6칸 그리드 (사진 및 세대 정보) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4mm' }}>
                        {/* [1행-1] 세대 정보 카드 */}
                        <div style={{ border: '1px solid #94a3b8', padding: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div style={{ fontWeight: 800, borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.25rem', color: '#0f172a' }}>
                            보급 지원 세대 정보
                          </div>
                          <div><strong>1. 성 명 :</strong> {rep.headName}</div>
                          <div><strong>2. 동/호수 :</strong> {rep.dong}동 {rep.ho}호</div>
                          <div><strong>3. 설치일 :</strong> {rep.installDateFormatted || rep.installDate || '—'}</div>
                          <div><strong>4. 설치자 :</strong> {rep.reporterName || rep.visitorName || '현장기사'}</div>
                        </div>

                        {/* [1행-2] 신주소 대문 사진 */}
                        <div style={{ border: '1px solid #94a3b8', padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textAlign: 'center', background: '#f1f5f9', padding: '0.125rem', marginBottom: '0.25rem' }}>
                            신주소 보이는 대문 등
                          </div>
                          <div style={{ flex: 1, minHeight: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                            {doorPhoto ? (
                              <img src={doorPhoto} alt="대문" style={{ width: '100%', height: '85px', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>사진 부착</span>
                            )}
                          </div>
                        </div>

                        {/* [2행-1] 설치 전 1 */}
                        <div style={{ border: '1px solid #94a3b8', padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textAlign: 'center', background: '#f1f5f9', padding: '0.125rem', marginBottom: '0.25rem' }}>
                            설치 전 ①
                          </div>
                          <div style={{ flex: 1, minHeight: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                            {before1Photo ? (
                              <img src={before1Photo} alt="설치전1" style={{ width: '100%', height: '85px', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>사진 부착</span>
                            )}
                          </div>
                        </div>

                        {/* [2행-2] 설치 후 1 */}
                        <div style={{ border: '1px solid #94a3b8', padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textAlign: 'center', background: '#f1f5f9', padding: '0.125rem', marginBottom: '0.25rem' }}>
                            설치 후 ①
                          </div>
                          <div style={{ flex: 1, minHeight: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                            {after1Photo ? (
                              <img src={after1Photo} alt="설치후1" style={{ width: '100%', height: '85px', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>사진 부착</span>
                            )}
                          </div>
                        </div>

                        {/* [3행-1] 설치 전 2 */}
                        <div style={{ border: '1px solid #94a3b8', padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textAlign: 'center', background: '#f1f5f9', padding: '0.125rem', marginBottom: '0.25rem' }}>
                            설치 전 ②
                          </div>
                          <div style={{ flex: 1, minHeight: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                            {before2Photo ? (
                              <img src={before2Photo} alt="설치전2" style={{ width: '100%', height: '85px', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>사진 부착</span>
                            )}
                          </div>
                        </div>

                        {/* [3행-2] 설치 후 2 */}
                        <div style={{ border: '1px solid #94a3b8', padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textAlign: 'center', background: '#f1f5f9', padding: '0.125rem', marginBottom: '0.25rem' }}>
                            설치 후 ②
                          </div>
                          <div style={{ flex: 1, minHeight: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                            {after2Photo ? (
                              <img src={after2Photo} alt="설치후2" style={{ width: '100%', height: '85px', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>사진 부착</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SlideDialog>
  );
}
