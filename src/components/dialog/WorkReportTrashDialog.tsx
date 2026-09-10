'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  AlertCircle
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import SlideDialog from '@/components/dialog/SlideDialog';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import { STATUS_LABEL_MAP } from '@/components/common/StatusBadge';
import AdminService from '@/api/service/AdminService';
import './WorkReportTrashDialog.scss';

dayjs.locale('ko');

export interface WorkReportTrashDialogProps {
  isOpen: boolean;
  onClose: () => void;
  regionId?: string;
  regionLabel?: string;
}

export default function WorkReportTrashDialog({
  isOpen,
  onClose,
  regionId,
  regionLabel = '',
}: WorkReportTrashDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [logs, setLogs] = useState<WorkReportDeletionLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [totalCount, setTotalCount] = useState(0);

  // 입력 필드 드래프트 상태 (타이핑 시 API 호출 안 됨)
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 실제 조회에 적용되는 검색 조건 (검색 버튼 클릭 시에만 갱신)
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  // 선택된 상세 로그
  const [selectedLog, setSelectedLog] = useState<WorkReportDeletionLog | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const res = await AdminService.getDeletedReports({
        regionId: regionId && regionId !== 'ALL' ? regionId : undefined,
        query: appliedSearchQuery.trim() || undefined,
        startDate: appliedStartDate || undefined,
        endDate: appliedEndDate || undefined,
        page,
        size: pageSize,
      });
      setLogs(res.list || []);
      setTotalCount(res.totalCount || 0);
    } catch (err: any) {
      console.error('[WorkReportTrashDialog] fetchLogs error:', err);
      enqueueSnackbar(err?.message || '삭제 이력을 불러오지 못했습니다.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, regionId, appliedSearchQuery, appliedStartDate, appliedEndDate, page, pageSize, enqueueSnackbar]);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    } else {
      setSelectedLog(null);
    }
  }, [isOpen, fetchLogs]);

  // 검색 버튼 클릭 또는 폼 Submit 시에만 적용
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchQuery(searchQuery);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setPage(1);
  };

  const columns: ColumnDef<WorkReportDeletionLog>[] = [
    {
      key: 'siteName',
      header: '현장명',
      width: '180px',
      render: (log) => (
        <div className="cell-site-info" title={log.address ? `${log.siteName} (${log.address})` : log.siteName}>
          <strong className="site-name">{log.siteName}</strong>
        </div>
      ),
    },
    {
      key: 'unit',
      header: '동 / 호수',
      width: '140px',
      align: 'center',
      render: (log) => (
        <span className="cell-dong-ho">
          {log.dong ? `${log.dong}동` : '-'} {log.ho ? `${log.ho}호` : '-'}
          {log.headName && <span className="head-name">({log.headName})</span>}
        </span>
      ),
    },
    {
      key: 'deleteReason',
      header: '삭제 사유',
      render: (log) => (
        <div className="cell-delete-reason" title={log.deleteReason}>
          <span className="reason-text">{log.deleteReason}</span>
        </div>
      ),
    },
    {
      key: 'reporter',
      header: '원 보고자',
      width: '110px',
      align: 'center',
      render: (log) => (
        <span className="cell-reporter-name">{log.reporterName || '-'}</span>
      ),
    },
    {
      key: 'deletedBy',
      header: '삭제 실행자',
      width: '140px',
      align: 'center',
      render: (log) => (
        <span className="cell-deleted-by">{log.deletedByName || log.deletedBy}</span>
      ),
    },
    {
      key: 'deletedTime',
      header: '삭제 일시',
      width: '150px',
      align: 'center',
      render: (log) => (
        <span className="cell-deleted-at">
          {log.deletedTime ? dayjs(log.deletedTime).format('YYYY-MM-DD HH:mm') : '-'}
        </span>
      ),
    },
  ];

  return (
    <>
      <SlideDialog
        isOpen={isOpen}
        onClose={onClose}
        title={regionLabel ? `${regionLabel} 내 삭제 이력` : '보고서 삭제 이력'}
        className="work-report-trash-slide-dialog manage-page"
        footer={
          <div className="dialog-btn-group">
            <button type="button" className="btn-cancel" onClick={onClose}>
              닫기
            </button>
          </div>
        }
      >
        <div className="trash-dialog-content">
          {/* 검색 및 필터 바 */}
          <form className="trash-filter-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="현장명, 동/호수, 세대주, 작업자, 삭제자, 사유 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="date-filter-group">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="시작일"
                aria-label="삭제 시작일"
              />
              <span className="date-sep">~</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="종료일"
                aria-label="삭제 종료일"
              />
            </div>

            <button type="submit" className="btn-search-submit">
              검색
            </button>
          </form>

          {/* 데이터 테이블 */}
          <div className="trash-table-container">
            <DataTable<WorkReportDeletionLog>
              columns={columns}
              data={logs}
              rowKey={(log, idx) => log.logId || `log_${idx}`}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              pageSizeOptions={[30, 50, 100]}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              isLoading={isLoading}
              loadingMessage="삭제 이력을 조회 중입니다..."
              emptyMessage="삭제된 보고서 이력이 없습니다."
              onRowClick={(log) => setSelectedLog(log)}
            />
          </div>
        </div>
      </SlideDialog>

      {/* ── 단건 스냅샷 상세 모달 ── */}
      {selectedLog && (
        <SlideDialog
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="삭제 보고서 스냅샷 상세"
          className="trash-detail-slide-dialog manage-page"
          footer={
            <div className="dialog-btn-group">
              <button type="button" className="btn-cancel" onClick={() => setSelectedLog(null)}>
                닫기
              </button>
            </div>
          }
        >
          <div className="trash-snapshot-detail-content">
            {/* 상단 통합 삭제 정보 배너 (상태 + 메타 + 인용문 사유) */}
            <div className="snapshot-delete-banner">
              <div className="banner-top">
                <span className="status-tag">영구 삭제됨</span>
                <div className="banner-meta">
                  <span>{selectedLog.deletedTime ? dayjs(selectedLog.deletedTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
                  <span className="divider">·</span>
                  <span>{selectedLog.deletedByName || selectedLog.deletedBy}</span>
                </div>
              </div>
              <div className="banner-quote">
                <p className="quote-text">
                  “{selectedLog.deleteReason || '등록된 삭제 사유가 없습니다.'}”
                </p>
              </div>
            </div>

            <div className="snapshot-section">
              <div className="section-title">현장 및 세대 정보</div>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="lbl">현장명</span>
                  <span className="val">{selectedLog.siteName || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">동 / 호수</span>
                  <span className="val">{selectedLog.dong ? `${selectedLog.dong}동` : '-'} {selectedLog.ho ? `${selectedLog.ho}호` : '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">세대주</span>
                  <span className="val">{selectedLog.headName || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">현장 주소</span>
                  <span className="val">{selectedLog.address || '-'}</span>
                </div>
              </div>
            </div>

            <div className="snapshot-section">
              <div className="section-title">원본 보고서 정보</div>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="lbl">보고자</span>
                  <span className="val">{selectedLog.reporterName || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">확인자</span>
                  <span className="val">{selectedLog.confirmerName || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">시공 설치일</span>
                  <span className="val">{selectedLog.installDate ? dayjs(selectedLog.installDate).format('YYYY-MM-DD') : '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">제출 일시</span>
                  <span className="val">{selectedLog.reportTime ? dayjs(selectedLog.reportTime).format('YYYY-MM-DD HH:mm') : '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="lbl">삭제 당시 상태</span>
                  <span className="val">
                    {selectedLog.status ? (STATUS_LABEL_MAP[selectedLog.status.toUpperCase()] || selectedLog.status) : '-'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="lbl">특이사항</span>
                  <span className="val">{selectedLog.remarks || '-'}</span>
                </div>
                {selectedLog.fixReason && (
                  <div className="detail-row full-width">
                    <span className="lbl">기존 반려 사유</span>
                    <span className="val danger-text">{selectedLog.fixReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SlideDialog>
      )}
    </>
  );
}