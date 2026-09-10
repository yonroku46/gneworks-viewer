'use client';

import React, { useMemo } from 'react';
import { TARGET_TYPE_LABEL_MAP } from '@/components/common/StatusBadge';
import './CompletionReportCoverPaper.scss';

export interface CompletionReportCoverPaperProps {
  id?: string;
  className?: string;
  regionLabel?: string;
  reports: WorkReport[];
  sites?: SiteDetail[];
}

export default function CompletionReportCoverPaper({
  id,
  className = '',
  regionLabel = '',
  reports,
  sites = [],
}: CompletionReportCoverPaperProps) {
  const fireStationName = regionLabel
    ? (regionLabel.endsWith('소방서') ? regionLabel : `${regionLabel}소방서`)
    : '—';

  const totalHouseholdCount = reports.length;
  const totalDetectorCount = totalHouseholdCount * 2;

  // Helper to find household info from sites
  const getHouseholdInfo = (report: WorkReport) => {
    const site = sites.find(s => s.siteId === report.siteId || s.name === report.siteName);
    if (!site) return null;
    return site.households?.find(h => h.dong === report.dong && h.ho === report.ho);
  };

  // 1페이지: 타이틀 + 설치현황 + 세부내역 헤더 감안하여 30개 수용
  // 2페이지 이후: 타이틀 및 헤더 영역 없이 순수 테이블만 전체 채움으로 40개 수용
  const PAGE1_MAX_ROWS = 30;
  const OTHER_MAX_ROWS = 40;

  const pages = useMemo(() => {
    if (reports.length === 0) return [[]];
    const result: WorkReport[][] = [];
    result.push(reports.slice(0, PAGE1_MAX_ROWS));

    let cursor = PAGE1_MAX_ROWS;
    while (cursor < reports.length) {
      result.push(reports.slice(cursor, cursor + OTHER_MAX_ROWS));
      cursor += OTHER_MAX_ROWS;
    }
    return result;
  }, [reports]);

  return (
    <>
      {pages.map((pageReports, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const pageStartIdx = isFirstPage ? 0 : PAGE1_MAX_ROWS + (pageIdx - 1) * OTHER_MAX_ROWS;
        const pageId = pageIdx === 0 && id ? id : (id ? `${id}-page-${pageIdx + 1}` : undefined);

        return (
          <div
            key={pageIdx}
            id={pageId}
            className={`completion-report-cover-paper ${className}`.trim()}
          >
            {/* ── 1페이지에만 문서 헤더 타이틀 표시 ── */}
            {isFirstPage && (
              <div className="cover-title-wrap">
                <h1 className="cover-main-title">단독경보형감지기 보급완료 보고서</h1>
              </div>
            )}

            {/* ── 1. 단독경보형감지기 설치 현황 (1페이지에만 표시) ── */}
            {isFirstPage && (
              <div className="cover-doc-section status-section">
                <h2 className="section-head">1. 단독경보형감지기 설치 현황</h2>
                <div className="status-box">
                  <ul className="overview-list">
                    <li>
                      <span className="bullet">가.</span>
                      <span className="label">소&nbsp;&nbsp;방&nbsp;&nbsp;서 :</span>
                      <strong className="value">{fireStationName}</strong>
                    </li>
                    <li>
                      <span className="bullet">나.</span>
                      <span className="label">설치세대 :</span>
                      <strong className="value">{totalHouseholdCount.toLocaleString()}세대</strong>
                    </li>
                    <li>
                      <span className="bullet">다.</span>
                      <span className="label">설치수량 :</span>
                      <strong className="value">감지기 {totalDetectorCount.toLocaleString()}개</strong>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ── 2. 단독경보형감지기 설치 세부내역 ── */}
            <div className="cover-doc-section detail-section">
              {/* 1페이지에만 섹션 헤더 표시 (2페이지부터는 테이블만 바로 표시) */}
              {isFirstPage && (
                <div className="section-head-row">
                  <h2 className="section-head">2. 단독경보형감지기 설치 세부내역</h2>
                </div>
              )}
              <div className="cover-table-wrap">
                <table className="cover-official-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>연번</th>
                      <th style={{ width: '65px' }}>구분</th>
                      <th style={{ width: '65px' }}>성명</th>
                      <th>주소</th>
                      <th style={{ width: '80px' }}>설치일자</th>
                      <th style={{ width: '85px' }}>연락처</th>
                      <th style={{ width: '80px' }}>감지기 설치수량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageReports.length > 0 ? (
                      pageReports.map((rep, idx) => {
                        const hh = getHouseholdInfo(rep);
                        const targetType = (rep.targetType || hh?.targetType || 'GENERAL') as HouseholdTargetType;
                        const targetLabel = TARGET_TYPE_LABEL_MAP[targetType] || targetType;
                        const fullAddr = rep.address 
                          ? `${rep.address} ${rep.dong}동 ${rep.ho}호`
                          : `${rep.siteName} ${rep.dong}동 ${rep.ho}호`;
                        const installDate = rep.installDateFormatted || rep.installDate || '—';
                        const rowNum = pageStartIdx + idx + 1;

                        return (
                          <tr key={rep.reportId || rowNum}>
                            <td className="center">{rowNum}</td>
                            <td className="center">{targetLabel}</td>
                            <td className="center">{rep.headName || '—'}</td>
                            <td className="addr" title={fullAddr}>{fullAddr}</td>
                            <td className="center">{installDate}</td>
                            <td className="center"></td>
                            <td className="center bold">2</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="center empty-cell">
                          출력할 확인완료 세부내역이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
