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
  const cleanRegion = (regionLabel || '')
    .replace(/\s*\(?관리자용\)?/g, '')
    .trim();
  const fireStationName = cleanRegion
    ? (cleanRegion.endsWith('소방서') ? cleanRegion : `${cleanRegion}소방서`)
    : '—';

  const totalHouseholdCount = reports.length;
  const totalDetectorCount = totalHouseholdCount * 2;

  // Helper to find household info from sites
  const getHouseholdInfo = (report: WorkReport) => {
    const site = sites.find(s => s.siteId === report.siteId || s.name === report.siteName);
    if (!site) return null;
    return site.households?.find(h => h.dong === report.dong && h.ho === report.ho);
  };

  // 주소 길이를 반영한 가중치 기반 동적 페이지 분할
  // 1페이지: 타이틀 + 설치현황 + 세부내역 헤더 감안하여 최대 24줄 분량
  // 2페이지 이후: 순수 테이블 전체 채움으로 최대 34줄 분량
  const PAGE1_LINE_CAPACITY = 24;
  const OTHER_LINE_CAPACITY = 34;

  const pages = useMemo(() => {
    if (reports.length === 0) return [[] as { report: WorkReport; rowNum: number }[]];

    const result: { report: WorkReport; rowNum: number }[][] = [];
    let currentPage: { report: WorkReport; rowNum: number }[] = [];
    let currentCapacity = PAGE1_LINE_CAPACITY;
    let currentWeight = 0;

    reports.forEach((rep, idx) => {
      const fullAddr = rep.address
        ? `${rep.address} ${rep.dong}동 ${rep.ho}호`
        : `${rep.siteName} ${rep.dong}동 ${rep.ho}호`;

      const addrLen = fullAddr.length;
      let lineWeight = 1.0;
      if (addrLen > 64) {
        lineWeight = 2.6;
      } else if (addrLen > 32) {
        lineWeight = 1.8;
      }

      if (currentWeight + lineWeight > currentCapacity && currentPage.length > 0) {
        result.push(currentPage);
        currentPage = [];
        currentCapacity = OTHER_LINE_CAPACITY;
        currentWeight = 0;
      }

      currentPage.push({
        report: rep,
        rowNum: idx + 1,
      });
      currentWeight += lineWeight;
    });

    if (currentPage.length > 0) {
      result.push(currentPage);
    }

    return result;
  }, [reports]);

  return (
    <>
      {pages.map((pageItems, pageIdx) => {
        const isFirstPage = pageIdx === 0;
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
                      <th style={{ width: '34px' }}>연번</th>
                      <th style={{ width: '82px' }}>구분</th>
                      <th style={{ width: '55px' }}>성명</th>
                      <th>주소</th>
                      <th style={{ width: '92px' }}>설치일자</th>
                      <th style={{ width: '55px' }}>연락처</th>
                      <th style={{ width: '45px' }} className="th-qty">감지기<br />설치수량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length > 0 ? (
                      pageItems.map(({ report: rep, rowNum }) => {
                        const hh = getHouseholdInfo(rep);
                        const targetType = (rep.targetType || hh?.targetType || 'GENERAL') as HouseholdTargetType;
                        const targetLabel = TARGET_TYPE_LABEL_MAP[targetType] || targetType;
                        const fullAddr = rep.address 
                          ? `${rep.address} ${rep.dong}동 ${rep.ho}호`
                          : `${rep.siteName} ${rep.dong}동 ${rep.ho}호`;
                        const installDate = rep.installDateFormatted || rep.installDate || '—';

                        return (
                          <tr key={rep.reportId || rowNum}>
                            <td className="center">{rowNum}</td>
                            <td className="center target-type-cell">{targetLabel}</td>
                            <td className="center">{rep.headName || '—'}</td>
                            <td className="addr" title={fullAddr}>{fullAddr}</td>
                            <td className="center date-cell">{installDate}</td>
                            <td className="center"></td>
                            <td className="center">2</td>
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
