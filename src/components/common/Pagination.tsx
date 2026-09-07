'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.scss';

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showInfo?: boolean;
  showSizeSelector?: boolean;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  pageSizeOptions = [30, 50, 100],
  onPageChange,
  onPageSizeChange,
  showInfo = false,
  showSizeSelector = false,
  className = '',
}: PaginationProps) {
  if (totalCount === 0) return null;

  // 표시할 페이지 번호 계산 (슬라이딩 윈도우)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let start = Math.max(2, page - 1);
    let end = Math.min(totalPages - 1, page + 1);

    if (page <= 3) {
      start = 2;
      end = 4;
    } else if (page >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    pages.push(1);
    if (start > 2) {
      pages.push('ellipsis-start');
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startRow = Math.min((page - 1) * pageSize + 1, totalCount);
  const endRow = Math.min(page * pageSize, totalCount);

  return (
    <div className={`pagination-wrapper ${className}`.trim()}>
      {showInfo && (
        <div className="pagination-info">
          <span className="pagination-count-chip">
            총 <strong>{totalCount.toLocaleString()}</strong>건
          </span>
          <span className="pagination-range-text">
            {startRow.toLocaleString()}–{endRow.toLocaleString()} 표시
          </span>
        </div>
      )}

      <nav className="pagination-nav" aria-label="페이징 네비게이션">
        <button
          type="button"
          className="btn-page-arrow"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="이전 페이지"
          title="이전 페이지"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="page-number-group">
          {pageNumbers.map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span key={`ellipsis_${idx}`} className="page-ellipsis">
                  ···
                </span>
              );
            }
            const isActive = p === page;
            return (
              <button
                key={`page_${p}`}
                type="button"
                className={`btn-page-num ${isActive ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="btn-page-arrow"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="다음 페이지"
          title="다음 페이지"
        >
          <ChevronRight size={16} />
        </button>
      </nav>

      {showSizeSelector && onPageSizeChange && (
        <div className="pagination-addon">
          <div className="pagination-size-select-wrap">
            <select
              className="pagination-size-select"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              aria-label="페이지당 항목 수 선택"
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}개씩 보기
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
