'use client';

import React from 'react';
import { Download, Loader2, Inbox, ChevronDown } from 'lucide-react';
import TableLoadingRow from './TableLoadingRow';
import Pagination from './Pagination';
import './DataTable.scss';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (item: T, index: number, startIndex: number) => React.ReactNode;
}

export interface DataTableExcelAction {
  onExport: () => void | Promise<void>;
  isExporting?: boolean;
  label?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey?: (item: T, index: number) => string | number;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  toolbarTitle?: React.ReactNode;
  toolbarBadge?: React.ReactNode;
  toolbarLeftAction?: React.ReactNode;
  toolbarRightAction?: React.ReactNode;
  excelAction?: DataTableExcelAction;
  className?: string;
  showPagination?: boolean;
  showPageSizeOnTop?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  totalCount,
  page = 1,
  pageSize = 30,
  pageSizeOptions = [30, 50, 100],
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  loadingMessage = '데이터를 불러오는 중입니다...',
  emptyMessage = '조회된 데이터가 없습니다.',
  onRowClick,
  toolbarTitle,
  toolbarBadge,
  toolbarLeftAction,
  toolbarRightAction,
  excelAction,
  className = '',
  showPagination = true,
  showPageSizeOnTop = true,
}: DataTableProps<T>) {
  const effectiveTotalCount = totalCount !== undefined ? totalCount : data.length;
  const totalPages = Math.ceil(effectiveTotalCount / pageSize);
  const startIndex = (page - 1) * pageSize;

  const hasLeftToolbar = Boolean(toolbarTitle || toolbarBadge || toolbarLeftAction);
  const hasRightToolbar = Boolean((showPageSizeOnTop && onPageSizeChange) || excelAction || toolbarRightAction);
  const hasToolbar = hasLeftToolbar || hasRightToolbar;

  return (
    <div className={`data-table-container ${className}`.trim()}>
      {hasToolbar && (
        <div className="data-table-toolbar">
          {hasLeftToolbar ? (
            <div className="toolbar-left">
              {toolbarTitle && <span className="toolbar-title">{toolbarTitle}</span>}
              {toolbarBadge && <span className="toolbar-badge">{toolbarBadge}</span>}
              {toolbarLeftAction}
            </div>
          ) : (
            <div className="toolbar-left" />
          )}

          <div className="toolbar-right">
            {showPageSizeOnTop && onPageSizeChange && (
              <div className="toolbar-size-select-wrap">
                <select
                  className="toolbar-size-select"
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
                <ChevronDown size={16} className="select-arrow-icon" />
              </div>
            )}

            {excelAction && (
              <button
                type="button"
                className="btn-excel-export"
                onClick={excelAction.onExport}
                disabled={excelAction.isExporting || effectiveTotalCount === 0}
                title="현재 필터 조건으로 엑셀 파일 다운로드"
              >
                {excelAction.isExporting ? (
                  <>
                    <span>다운로드 중...</span>
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>{excelAction.label || '내보내기'}</span>
                  </>
                )}
              </button> 
            )}

            {toolbarRightAction}
          </div>
        </div>
      )}

      <div className="data-table-card">
        <div className="data-table-scroll-area">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className={`col-${col.key} ${col.align ? `align-${col.align}` : 'align-left'} ${col.className || ''}`.trim()}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableLoadingRow colSpan={columns.length} message={loadingMessage} />
              ) : data.length > 0 ? (
                data.map((item, idx) => {
                  const key = rowKey ? rowKey(item, idx) : (item as any)?.id || idx;
                  const isClickable = !!onRowClick;

                  return (
                    <tr
                      key={key}
                      className={`data-table-row ${isClickable ? 'clickable' : ''}`}
                      onClick={() => onRowClick && onRowClick(item, idx)}
                    >
                      {columns.map(col => {
                        const value = (item as any)?.[col.key];
                        const content = col.render
                          ? col.render(item, idx, startIndex)
                          : value !== undefined && value !== null
                          ? String(value)
                          : '-';

                        return (
                          <td
                            key={col.key}
                            className={`col-${col.key} ${col.align ? `align-${col.align}` : 'align-left'} ${col.className || ''}`.trim()}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr className="empty-row">
                  <td colSpan={columns.length}>
                    <div className="empty-state-box">
                      <Inbox size={36} />
                      <p>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && onPageChange && effectiveTotalCount > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={effectiveTotalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          showInfo={false}
          showSizeSelector={false}
        />
      )}
    </div>
  );
}
