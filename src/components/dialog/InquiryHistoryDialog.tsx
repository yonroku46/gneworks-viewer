'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SlideDialog from './SlideDialog';
import StatusBadge from '@/components/common/StatusBadge';
import { getStoredInquiries, subscribeToInquiriesUpdate } from '@/data/inquiryStorage';
import { INQUIRY_TYPE_MAP } from '@/data/inquiryData';
import {
  Search,
  X,
  ArrowUpDown,
  MessageSquareText,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import './InquiryHistoryDialog.scss';

export type InquiryStatusFilter = 'all' | 'RESOLVED' | 'WAITING';

interface InquiryHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate?: () => void;
}

export default function InquiryHistoryDialog({
  isOpen,
  onClose,
  onOpenCreate,
}: InquiryHistoryDialogProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    setInquiries(getStoredInquiries());
    const unsub = subscribeToInquiriesUpdate(items => setInquiries(items));
    return () => unsub();
  }, []);

  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];

    // Status filter
    if (statusFilter === 'RESOLVED') {
      result = result.filter(i => i.processedFlg);
    } else if (statusFilter === 'WAITING') {
      result = result.filter(i => !i.processedFlg);
    }

    // Keyword search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(i => {
        const typeLabel = INQUIRY_TYPE_MAP[i.inquiryType]?.label || '';
        const content = (i.inquiryContents || '').toLowerCase();
        const answer = (i.answerContents || '').toLowerCase();
        return content.includes(q) || answer.includes(q) || typeLabel.toLowerCase().includes(q);
      });
    }

    // Sort order
    result.sort((a, b) => {
      const timeA = new Date(a.createTime).getTime() || 0;
      const timeB = new Date(b.createTime).getTime() || 0;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [inquiries, statusFilter, searchQuery, sortOrder]);

  const counts = useMemo(() => {
    const total = inquiries.length;
    const resolved = inquiries.filter(i => i.processedFlg).length;
    const waiting = inquiries.filter(i => !i.processedFlg).length;
    return { total, resolved, waiting };
  }, [inquiries]);

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="문의 및 답변 내역"
      className="inquiry-history-slide-dialog"
      subHeader={
        <div className="inquiry-history-sub-header">
          <div className="inquiry-search-row">
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="문의 내용 또는 답변 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                  title="검색어 지우기"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn-sort-order"
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              title="정렬 순서 변경"
            >
              <ArrowUpDown size={13} />
              <span>{sortOrder === 'desc' ? '최신순' : '오래된순'}</span>
            </button>
          </div>

          <div className="inquiry-filter-pills">
            <button
              type="button"
              className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span>전체 ({counts.total})</span>
            </button>
            <button
              type="button"
              className={`pill-btn status-completed ${statusFilter === 'RESOLVED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('RESOLVED')}
            >
              <span>답변완료 ({counts.resolved})</span>
            </button>
            <button
              type="button"
              className={`pill-btn status-pending ${statusFilter === 'WAITING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('WAITING')}
            >
              <span>답변대기 ({counts.waiting})</span>
            </button>
          </div>
        </div>
      }
      footer={
        <div className="inquiry-dialog-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            닫기
          </button>
          <Link
            href="/contact?type=inquiry"
            className="btn-submit"
            onClick={() => {
              onClose();
              if (onOpenCreate) onOpenCreate();
            }}
          >
            <span>새 문의 접수</span>
          </Link>
        </div>
      }
    >
      <div className="inquiry-list-body">
        {filteredInquiries.length === 0 ? (
          <div className="inquiry-empty-state">
            <MessageSquareText size={36} />
            <p className="empty-title">
              {searchQuery ? '검색된 문의 내역이 없습니다.' : '등록된 문의 내역이 없습니다.'}
            </p>
            <p className="empty-desc">
              현장 작업 중 요청사항이나 특이사항이 있다면 [새 문의 접수하기]를 이용해 보세요.
            </p>
          </div>
        ) : (
          filteredInquiries.map(inq => {
            const typeInfo = INQUIRY_TYPE_MAP[inq.inquiryType] || {
              label: '일반 문의',
              badgeClass: 'type-general',
            };
            const statusType: InquiryStatus = inq.processedFlg ? 'RESOLVED' : 'WAITING';

            return (
              <div key={inq.inquiryId} className="inquiry-item-card">
                <div className="item-header">
                  <div className="header-meta-left">
                    <span className="type-tag">{typeInfo.label}</span>
                    <span className="create-date">{inq.createTime}</span>
                  </div>
                  <StatusBadge status={statusType} size="sm" />
                </div>

                <div className="item-question-box">
                  <p className="q-text">{inq.inquiryContents}</p>
                </div>

                {inq.processedFlg && (
                  <div className="item-answer-box">
                    <div className="answer-meta">
                      <div className="answerer-info">
                        <MessageSquare size={14} />
                        <span>관리자 답변 ({inq.answerUserName || '관리자'})</span>
                      </div>
                      {inq.answerTime && <span className="answer-time">{inq.answerTime}</span>}
                    </div>
                    <p className="answer-content">{inq.answerContents}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </SlideDialog>
  );
}
