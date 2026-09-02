'use client';

import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import './SearchInput.scss';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = '검색어를 입력하세요...',
      fullWidth = false,
      wrapperClassName = '',
      className = '',
      ...rest
    },
    ref
  ) => {
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear) {
        onClear();
      } else {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div
        className={`common-search-input-wrap ${fullWidth ? 'full-width' : ''} ${wrapperClassName}`.trim()}
      >
        <Search size={18} className="search-lead-icon" />
        <input
          ref={ref}
          type="text"
          className={`search-native-input ${className}`.trim()}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {value.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            title="검색어 지우기"
            aria-label="검색어 지우기"
          >
            <X size={12} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;