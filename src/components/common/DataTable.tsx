'use client';

import React from 'react';
import { Download, Loader2, Inbox, ChevronDown, X, ListChecks, Trash2 } from 'lucide-react';
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

export interface DataTableBatchAction {
  label?: string;
  onAction: () => void | Promise<void>;
  isLoading?: boolean;
  unit?: string;
  icon?: React.ReactNode;
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
  selectable?: boolean;
  onSelectableChange?: (selectable: boolean) => void;
  selectedRowKeys?: (string | number)[];
  onSelectChange?: (keys: (string | number)[], items: T[]) => void;
  batchAction?: DataTableBatchAction;
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
  selectable = false,
  onSelectableChange,
  selectedRowKeys = [],
  onSelectChange,
  batchAction,
}: DataTableProps<T>) {
  const effectiveTotalCount = totalCount !== undefined ? totalCount : data.length;
  const totalPages = Math.ceil(effectiveTotalCount / pageSize);
  const startIndex = (page - 1) * pageSize;

  const getItemKey = (item: T, idx: number): string | number => (
    rowKey ? rowKey(item, idx) : (item as any)?.id || (item as any)?.siteId || (item as any)?.reportId || idx
  );

  const currentPageKeys = data.map((item, idx) => getItemKey(item, idx));
  const isAllSelected = data.length > 0 && currentPageKeys.every(k => selectedRowKeys.includes(k));
  const isSomeSelected = !isAllSelected && currentPageKeys.some(k => selectedRowKeys.includes(k));

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectChange) return;
    const checked = e.target.checked;
    const currentSelected = new Set(selectedRowKeys);
    if (checked) {
      currentPageKeys.forEach(k => currentSelected.add(k));
    } else {
      currentPageKeys.forEach(k => currentSelected.delete(k));
    }
    const newKeys = Array.from(currentSelected);
    onSelectChange(newKeys, data.filter((item, idx) => newKeys.includes(getItemKey(item, idx))));
  };

  const handleToggleSelectRow = (key: string | number, item: T, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    if (!onSelectChange) return;
    const currentSelected = new Set(selectedRowKeys);
    if (currentSelected.has(key)) {
      currentSelected.delete(key);
    } else {
      currentSelected.add(key);
    }
    const newKeys = Array.from(currentSelected);
    onSelectChange(newKeys, data.filter((d, idx) => newKeys.includes(getItemKey(d, idx))));
  };

  const totalColSpan = columns.length + (selectable ? 1 : 0);
  const hasLeftToolbar = Boolean(toolbarTitle || toolbarBadge || toolbarLeftAction || onSelectableChange);
  const hasRightToolbar = Boolean((showPageSizeOnTop && onPageSizeChange) || excelAction || toolbarRightAction);
  const hasToolbar = hasLeftToolbar || hasRightToolbar;

  return (
    <div className={`data-table-container ${className}`.trim()}>
      {hasToolbar && (
        <div className="data-table-toolbar">
          <div className="toolbar-left">
            {toolbarTitle && <span className="toolbar-title">{toolbarTitle}</span>}
            {toolbarBadge && <span className="toolbar-badge">{toolbarBadge}</span>}
            {onSelectableChange && (
              <div className="selection-toolbar-group">
                {selectable && batchAction && (
                  <div className="table-batch-actions">
                    <button
                      type="button"
                      className={`btn-batch-delete ${selectedRowKeys.length > 0 ? 'has-selection' : ''}`}
                      onClick={batchAction.onAction}
                      disabled={batchAction.isLoading || selectedRowKeys.length === 0}
                      title={
                        selectedRowKeys.length === 0
                          ? '삭제할 항목을 선택해주세요'
                          : `${selectedRowKeys.length}${batchAction.unit || '건'} ${batchAction.label || '선택 삭제'}`
                      }
                    >
                      {batchAction.isLoading ? (
                        <Loader2 size={13} className="spin-icon" />
                      ) : (
                        batchAction.icon || <Trash2 size={13} />
                      )}
                      <span>{batchAction.label || '선택 삭제'}</span>
                      {selectedRowKeys.length > 0 && (
                        <span className="batch-count-badge">
                          {selectedRowKeys.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className={`btn-selection-toggle ${selectable ? 'active' : ''}`}
                  onClick={() => {
                    const next = !selectable;
                    onSelectableChange(next);
                    if (!next && onSelectChange) {
                      onSelectChange([], []);
                    }
                  }}
                  title={selectable ? '선택 모드 닫기' : '항목 일괄 선택'}
                >
                  {selectable ? <X size={14} /> : <ListChecks size={15} />}
                  <span>{selectable ? '취소' : '일괄선택'}</span>
                </button>
              </div>
            )}
            {toolbarLeftAction}
          </div>

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
                {selectable && (
                  <th className="col-selection align-center" style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={isAllSelected}
                      ref={el => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={handleToggleSelectAll}
                      aria-label="현재 페이지 전체 선택"
                    />
                  </th>
                )}
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
                <TableLoadingRow colSpan={totalColSpan} message={loadingMessage} />
              ) : data.length > 0 ? (
                data.map((item, idx) => {
                  const key = getItemKey(item, idx);
                  const isClickable = selectable || !!onRowClick;
                  const isSelected = selectable && selectedRowKeys.includes(key);

                  const handleRowClick = (e: React.MouseEvent) => {
                    if (selectable) {
                      handleToggleSelectRow(key, item, e);
                    } else if (onRowClick) {
                      onRowClick(item, idx);
                    }
                  };

                  return (
                    <tr
                      key={key}
                      className={`data-table-row ${isClickable ? 'clickable' : ''} ${isSelected ? 'selected' : ''}`.trim()}
                      onClick={handleRowClick}
                    >
                      {selectable && (
                        <td
                          className="col-selection align-center"
                          style={{ width: '40px' }}
                        >
                          <input
                            type="checkbox"
                            className="table-checkbox"
                            checked={isSelected}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleToggleSelectRow(key, item, e)}
                            aria-label={`행 선택`}
                          />
                        </td>
                      )}
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
                  <td colSpan={totalColSpan}>
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
