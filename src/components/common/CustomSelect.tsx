import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.scss';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  icon?: React.ReactNode;
  sizeVariant?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  (
    {
      options,
      children,
      icon,
      sizeVariant = 'md',
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`custom-select-wrap size-${sizeVariant} ${fullWidth ? 'full-width' : ''} ${icon ? 'has-icon' : ''} ${className}`}
      >
        {icon && <span className="select-lead-icon">{icon}</span>}
        <select ref={ref} className="custom-select-native" {...props}>
          {options
            ? options.map(opt => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="select-chevron-icon">
          <ChevronDown size={sizeVariant === 'sm' ? 12 : 14} />
        </span>
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';
export default CustomSelect;
