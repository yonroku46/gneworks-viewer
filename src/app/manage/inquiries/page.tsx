'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  MessageCircle,
  Calendar,
  Phone,
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import SlideDialog from '@/components/dialog/SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import StatusBadge from '@/components/common/StatusBadge';
import { useAuth } from '@/providers/AuthProvider';
import { INQUIRY_TYPE_MAP } from '@/data/inquiryData';
import { getStoredInquiries, saveStoredInquiries, subscribeToInquiriesUpdate } from '@/data/inquiryStorage';
import '../ManageLayout.scss';

dayjs.locale('ko');

// 날짜 표시 및 1개월 미만일 때 괄호로 몇분전/몇시간전/몇일전 병기, 1개월 이상은 YYYY-MM-DD로 통일
function formatInquiryDateWithRelative(dateStr?: string): string {
  if (!dateStr) return '';
  const now = dayjs();
  const target = dayjs(dateStr);
  if (!target.isValid()) return dateStr;

  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  let relative = '';
  if (diffMinutes < 1) relative = '방금 전';
  else if (diffMinutes < 60) relative = `${diffMinutes}분 전`;
  else if (diffHours < 24) relative = `${diffHours}시간 전`;
  else if (diffDays < 30) relative = `${diffDays}일 전`;

  if (!relative) {
    return target.format('YYYY-MM-DD');
  }
  return `${target.format('YYYY-MM-DD HH:mm')} (${relative})`;
}

export default function ManageInquiriesPage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Inquiry List State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    setInquiries(getStoredInquiries());
    const unsub = subscribeToInquiriesUpdate(items => setInquiries(items));
    return () => unsub();
  }, []);

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Applied Filter States (실제 테이블에 적용되는 상태)
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<'ALL' | boolean>('ALL');
  const [appliedTypeFilter, setAppliedTypeFilter] = useState<string>('ALL');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  // Dialog Draft Filter States (다이얼로그 내부 임시 상태)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [draftStatusFilter, setDraftStatusFilter] = useState<'ALL' | boolean>('ALL');
  const [draftTypeFilter, setDraftTypeFilter] = useState<string>('ALL');
  const [draftStartDate, setDraftStartDate] = useState('');
  const [draftEndDate, setDraftEndDate] = useState('');

  // Detail & Answer Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [cachedInquiry, setCachedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    if (selectedInquiry) {
      setCachedInquiry(selectedInquiry);
    }
  }, [selectedInquiry]);

  const activeInquiry = selectedInquiry || cachedInquiry;

  const [answerForm, setAnswerForm] = useState<{
    processedFlg: boolean;
    answerText: string;
  }>({
    processedFlg: true,
    answerText: '',
  });

  // Open Filter Dialog: 현재 적용된 필터 값을 draft 상태로 복사
  const handleOpenFilterDialog = () => {
    setDraftStatusFilter(appliedStatusFilter);
    setDraftTypeFilter(appliedTypeFilter);
    setDraftStartDate(appliedStartDate);
    setDraftEndDate(appliedEndDate);
    setIsFilterDialogOpen(true);
  };

  // Draft Date Preset Handlers
  const handleSetDraftDatePreset = (preset: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH') => {
    const today = dayjs().format('YYYY-MM-DD');
    if (preset === 'ALL') {
      setDraftStartDate('');
      setDraftEndDate('');
    } else if (preset === 'TODAY') {
      setDraftStartDate(today);
      setDraftEndDate(today);
    } else if (preset === 'WEEK') {
      setDraftStartDate(dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
      setDraftEndDate(today);
    } else if (preset === 'MONTH') {
      setDraftStartDate(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
      setDraftEndDate(today);
    }
  };

  const todayStr = dayjs().format('YYYY-MM-DD');
  const isDraftToday = draftStartDate === todayStr && draftEndDate === todayStr;
  const isDraftWeek = draftStartDate === dayjs().subtract(6, 'day').format('YYYY-MM-DD') && draftEndDate === todayStr;
  const isDraftMonth = draftStartDate === dayjs().subtract(29, 'day').format('YYYY-MM-DD') && draftEndDate === todayStr;
  const isDraftAllDates = !draftStartDate && !draftEndDate;

  // Dialog Reset (다이얼로그 내부 임시 상태 초기화)
  const handleResetDialogFilters = () => {
    setDraftStatusFilter('ALL');
    setDraftTypeFilter('ALL');
    setDraftStartDate('');
    setDraftEndDate('');
  };

  // Dialog Apply (임시 상태를 실제 필터로 적용)
  const handleApplyFilters = () => {
    setAppliedStatusFilter(draftStatusFilter);
    setAppliedTypeFilter(draftTypeFilter);
    setAppliedStartDate(draftStartDate);
    setAppliedEndDate(draftEndDate);
    setIsFilterDialogOpen(false);
    enqueueSnackbar('필터가 적용되었습니다.', { variant: 'info' });
  };

  // Quick Reset (메인 화면 툴바에서 바로 전체 초기화)
  const handleResetQuick = () => {
    setAppliedStatusFilter('ALL');
    setAppliedTypeFilter('ALL');
    setAppliedStartDate('');
    setAppliedEndDate('');
    setDraftStatusFilter('ALL');
    setDraftTypeFilter('ALL');
    setDraftStartDate('');
    setDraftEndDate('');
    enqueueSnackbar('필터가 초기화되었습니다.', { variant: 'info' });
  };

  // Active Filter Count (실제 적용된 필터 기준 카운트)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedStatusFilter !== 'ALL') count++;
    if (appliedTypeFilter !== 'ALL') count++;
    if (appliedStartDate || appliedEndDate) count++;
    return count;
  }, [appliedStatusFilter, appliedTypeFilter, appliedStartDate, appliedEndDate]);

  // Metrics (답변 대기 미처리 건수만 집중 집계)
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const pending = inquiries.filter(i => !i.processedFlg).length;
    return { total, pending };
  }, [inquiries]);

  // Filtered List (적용 완료된 필터로만 필터링)
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      // Status Match (processedFlg: boolean)
      if (appliedStatusFilter !== 'ALL' && item.processedFlg !== appliedStatusFilter) return false;

      // Type Match
      if (appliedTypeFilter !== 'ALL' && item.inquiryType !== appliedTypeFilter) return false;

      // Date Range Match (createTime: 'YYYY-MM-DD HH:mm')
      const itemDate = item.createTime.slice(0, 10);
      if (appliedStartDate && itemDate < appliedStartDate) return false;
      if (appliedEndDate && itemDate > appliedEndDate) return false;

      // Search Query Match (userName, userId, phoneNum, inquiryContents)
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchName = item.userName ? item.userName.toLowerCase().includes(q) : '비회원'.includes(q);
        const matchId = item.userId ? item.userId.toLowerCase().includes(q) : false;
        const matchPhone = item.phoneNum.includes(q);
        const matchContent = item.inquiryContents.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPhone && !matchContent) return false;
      }

      return true;
    });
  }, [inquiries, appliedStatusFilter, appliedTypeFilter, appliedStartDate, appliedEndDate, searchQuery]);

  // Open Detail / Answer Modal
  const handleOpenDetail = (item: Inquiry) => {
    setSelectedInquiry(item);
    setAnswerForm({
      processedFlg: !item.processedFlg ? true : item.processedFlg,
      answerText: item.answerContents || '',
    });
  };

  // Submit Answer & Status Update
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    if (answerForm.processedFlg && !answerForm.answerText.trim()) {
      enqueueSnackbar('답변 완료 처리를 위해 답변 내용을 작성해 주세요.', { variant: 'warning' });
      return;
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm');
    const responder = user?.userName || '관리자';
    const updated: Inquiry = {
      ...selectedInquiry,
      processedFlg: answerForm.processedFlg,
      answerContents: answerForm.answerText.trim() || undefined,
      answerTime: answerForm.answerText.trim() ? (selectedInquiry.answerTime || now) : undefined,
      answerUserName: answerForm.answerText.trim() ? responder : undefined,
    };

    const nextInquiries = inquiries.map(item => (item.inquiryId === updated.inquiryId ? updated : item));
    setInquiries(nextInquiries);
    saveStoredInquiries(nextInquiries);
    setSelectedInquiry(null);
    enqueueSnackbar(`[${updated.userName || '비회원'}] 님의 문의 처리가 저장되었습니다. (답변자: ${responder})`, { variant: 'success' });
  };

  return (
    <div className="manage-inquiries-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>문의 관리</h2>
          <p>접수된 1:1 문의 및 시스템/현장 요청 사항을 실시간으로 확인하고 답변을 처리합니다.</p>
        </div>
      </div>

      {/* ── SUMMARY BANNER BAR ── */}
      <div className="sites-summary-unified-bar">
        <div className="summary-main-col">
          <div className="summary-icon">
            <MessageSquare size={22} />
          </div>
          <div className="summary-main-info">
            <span className="summary-label">전체 접수 문의</span>
            <strong className="summary-val">{metrics.total}건</strong>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-sub-chips">
          <div className="summary-sub-chip">
            <span className="chip-label">답변 대기</span>
            <strong className="chip-val danger-highlight">{metrics.pending}건</strong>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="reports-search-filter-bar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="문의자 이름, 연락처, 아이디, 문의 내용 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-actions-cluster">
          <button
            type="button"
            className={`btn-filter-trigger ${activeFilterCount > 0 ? 'active' : ''}`}
            onClick={handleOpenFilterDialog}
            title="상세 필터 설정"
          >
            <Filter size={16} />
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              className="btn-filter-reset-quick"
              onClick={handleResetQuick}
              title="필터 초기화"
            >
              <RotateCcw size={14} />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* ── INQUIRIES TABLE LIST ── */}
      <div className="inquiries-table-wrapper">
        <table className="inquiries-table">
          <thead>
            <tr>
              <th className="col-num">순번</th>
              <th className="col-date">접수일시</th>
              <th className="col-type">문의 유형</th>
              <th className="col-user">문의자</th>
              <th className="col-phone">연락처</th>
              <th className="col-content">문의 내용</th>
              <th className="col-status">상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((item, idx) => {
                const typeInfo = INQUIRY_TYPE_MAP[item.inquiryType] || { label: item.inquiryType, badgeClass: 'type-general' };
                return (
                  <tr 
                    key={item.inquiryId} 
                    className="inquiry-table-row"
                    onClick={() => handleOpenDetail(item)}
                  >
                    <td className="col-num">
                      <span className="row-index">{idx + 1}</span>
                    </td>
                    <td className="col-date">
                      <span className="date-text">{item.createTime}</span>
                    </td>
                    <td className="col-type">
                      <span className="inquiry-type-text">
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="col-user">
                      <div className="user-info-cluster">
                        <strong className={`user-name ${!item.userName ? 'non-member' : ''}`}>
                          {item.userName || '비회원'}
                        </strong>
                        {item.userId && <span className="user-id-sub">{item.userId}</span>}
                      </div>
                    </td>
                    <td className="col-phone">
                      <span className="phone-text">{item.phoneNum}</span>
                    </td>
                    <td className="col-content">
                      <p className="content-preview-text" title={item.inquiryContents}>
                        {item.inquiryContents}
                      </p>
                    </td>
                    <td className="col-status">
                      <StatusBadge
                        status={item.processedFlg ? 'RESOLVED' : 'WAITING'}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="empty-table-row">
                <td colSpan={7} className="empty-table-cell">
                  <MessageSquare size={36} className="empty-icon" />
                  <p>선택된 조건에 해당하는 문의 내역이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── FILTER DIALOG ── */}
      <SlideDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        title="문의 내역 상세 필터"
        className="manage-page filter-dialog"
        footer={
          <div className="dialog-btn-group">
            <button type="button" className="btn-cancel" onClick={handleResetDialogFilters}>
              필터 초기화
            </button>
            <button type="button" className="btn-save" onClick={handleApplyFilters}>
              적용 완료
            </button>
          </div>
        }
      >
        <div className="work-filter-dialog-content">
          {/* 1. 접수일자 기간 필터 (언제부터 언제까지) */}
          <div className="filter-field-block">
            <label className="field-block-title">
              <Calendar size={15} />
              <span>접수일자 기간 선택</span>
            </label>
            <div className="filter-tab-buttons-grid preset-grid">
              <button
                type="button"
                className={`filter-choice-btn ${isDraftAllDates ? 'active' : ''}`}
                onClick={() => handleSetDraftDatePreset('ALL')}
              >
                전체 기간
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftToday ? 'active' : ''}`}
                onClick={() => handleSetDraftDatePreset('TODAY')}
              >
                오늘
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftWeek ? 'active' : ''}`}
                onClick={() => handleSetDraftDatePreset('WEEK')}
              >
                최근 7일
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftMonth ? 'active' : ''}`}
                onClick={() => handleSetDraftDatePreset('MONTH')}
              >
                최근 30일
              </button>
            </div>
            <div className="date-range-row">
              <input
                type="date"
                className="date-input-item"
                value={draftStartDate}
                onChange={e => setDraftStartDate(e.target.value)}
                aria-label="시작일"
              />
              <span className="date-range-separator">~</span>
              <input
                type="date"
                className="date-input-item"
                value={draftEndDate}
                onChange={e => setDraftEndDate(e.target.value)}
                aria-label="종료일"
              />
              <button
                type="button"
                className="btn-date-clear-dlg"
                disabled={!draftStartDate && !draftEndDate}
                onClick={() => {
                  setDraftStartDate('');
                  setDraftEndDate('');
                }}
                title={draftStartDate || draftEndDate ? '선택된 날짜 초기화' : '지정된 날짜가 없습니다'}
              >
                지정 해제
              </button>
            </div>
          </div>

          {/* 2. 문의 상태 필터 */}
          <div className="filter-field-block">
            <label className="field-block-title">
              <CheckCircle2 size={15} />
              <span>처리 상태</span>
            </label>
            <div className="filter-tab-buttons-grid status-grid">
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter('ALL')}
              >
                전체 상태
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === false ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter(false)}
              >
                답변대기
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === true ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter(true)}
              >
                답변완료
              </button>
            </div>
          </div>

          {/* 3. 문의 유형 필터 */}
          <div className="filter-field-block">
            <label className="field-block-title">
              <MessageSquare size={15} />
              <span>문의 유형</span>
            </label>
            <div className="filter-tab-buttons-grid">
              <button
                type="button"
                className={`filter-choice-btn ${draftTypeFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setDraftTypeFilter('ALL')}
              >
                전체 유형
              </button>
              {Object.entries(INQUIRY_TYPE_MAP).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  className={`filter-choice-btn ${draftTypeFilter === key ? 'active' : ''}`}
                  onClick={() => setDraftTypeFilter(key)}
                >
                  {info.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SlideDialog>

      {/* ── DETAIL & ANSWER MODAL ── */}
      <SlideDialog
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title={activeInquiry ? `[${activeInquiry.userName || '비회원'}] 님의 문의 상세 및 답변` : '문의 상세'}
        className="manage-page inquiry-detail-dialog"
        footer={
          <div className="dialog-btn-group">
            <button type="button" className="btn-cancel" onClick={() => setSelectedInquiry(null)}>
              닫기
            </button>
            <button type="submit" form="inquiry-answer-form" className="btn-save">
              <span>답변 및 상태 저장</span>
            </button>
          </div>
        }
      >
        {activeInquiry && (
          <form id="inquiry-answer-form" className="inquiry-detail-modal-content" onSubmit={handleSubmitAnswer}>
            {/* ── 1. 상단: 접수된 문의 원문 카드 (메타정보 + 문의내용 통합) ── */}
            <div className="inquiry-source-card">
              <div className="source-card-header">
                <div className="user-primary-info">
                  <strong className={`user-name ${!activeInquiry.userName ? 'non-member' : ''}`}>
                    {activeInquiry.userName || '비회원'}
                  </strong>
                  {activeInquiry.userId && (
                    <span className="user-id-badge">
                      <span className="id-label">ID</span>
                      <span className="id-val">{activeInquiry.userId}</span>
                    </span>
                  )}
                </div>

                <div className="header-meta-right">
                  <a
                    href={`tel:${activeInquiry.phoneNum}`}
                    className="phone-contact-pill"
                    title="클릭 시 전화 연결"
                  >
                    <Phone size={12} className="phone-icon" />
                    <span>{activeInquiry.phoneNum}</span>
                  </a>
                  <span className="date-text">
                    {formatInquiryDateWithRelative(activeInquiry.createTime)}
                  </span>
                </div>
              </div>

              <div className="source-card-body">
                <div className="inquiry-type-heading">
                  <span>{INQUIRY_TYPE_MAP[activeInquiry.inquiryType]?.label || activeInquiry.inquiryType}</span>
                </div>
                <div className="content-text-block">
                  {activeInquiry.inquiryContents}
                </div>
              </div>
            </div>

            {/* ── 2. 하단: 관리자 답변 작성 및 처리 섹션 ── */}
            <div className="inquiry-answer-section">
              <div className="answer-section-header">
                <span className="section-label">답변 작성</span>
                {activeInquiry.answerUserName && (
                  <span className="last-answered-badge" title={activeInquiry.answerTime}>
                    최종 답변: <strong>{activeInquiry.answerUserName}</strong> ({formatInquiryDateWithRelative(activeInquiry.answerTime)})
                  </span>
                )}
              </div>

              <div className="form-fields-grid">
                <div className="form-field">
                  <label>
                    처리 상태 변경 <span className="req">*</span>
                  </label>
                  <CustomSelect
                    fullWidth
                    sizeVariant="md"
                    value={answerForm.processedFlg ? '1' : '0'}
                    onChange={e => setAnswerForm(prev => ({
                      ...prev,
                      processedFlg: e.target.value === '1'
                    }))}
                  >
                    <option value="0">답변대기 (미처리 상태)</option>
                    <option value="1">답변완료 (답변 처리 완료)</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label>
                    답변 담당자
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="answer-author-input readonly"
                    value={user?.userName}
                    title="현재 로그인된 관리자 계정으로 자동 지정됩니다."
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  답변 내용
                  {answerForm.processedFlg && <span className="req"> *</span>}
                </label>
                <textarea
                  rows={5}
                  placeholder="문의자에게 전달할 답변 내용을 작성해 주세요."
                  value={answerForm.answerText}
                  onChange={e => setAnswerForm(prev => ({ ...prev, answerText: e.target.value }))}
                />
              </div>
            </div>
          </form>
        )}
      </SlideDialog>
    </div>
  );
}
