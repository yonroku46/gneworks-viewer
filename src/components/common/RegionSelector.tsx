'use client';

import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { KOREA_ADMIN_REGIONS, getSigunguList } from '@/data/koreaRegions';
import CustomSelect from './CustomSelect';
import './RegionSelector.scss';

interface RegionSelectorProps {
  value: SelectedRegion;
  onChange: (newValue: SelectedRegion) => void;
  className?: string;
  showActiveBadge?: boolean;
}

export default function RegionSelector({
  value,
  onChange,
  className = '',
  showActiveBadge = true,
}: RegionSelectorProps) {
  const { sido, sigungu, eupmyeondong } = value;

  // Handle Sido change -> reset lower levels
  const handleSidoChange = (newSido: string) => {
    onChange({
      sido: newSido,
      sigungu: 'ALL',
      eupmyeondong: 'ALL',
    });
  };

  // Handle Sigungu change -> reset lowest level
  const handleSigunguChange = (newSigungu: string) => {
    onChange({
      sido,
      sigungu: newSigungu,
      eupmyeondong: 'ALL',
    });
  };

  // Handle Eupmyeondong change
  const handleEupmyeondongChange = (newEup: string) => {
    onChange({
      sido,
      sigungu,
      eupmyeondong: newEup,
    });
  };

  // Dynamic Sigungu options from Master Data
  const availableSigungus = useMemo(() => {
    if (sido === 'ALL') return [];
    return getSigunguList(sido);
  }, [sido]);

  // Format Current Active Region Parts (시/도 > 시/군/구 2단계)
  const activeRegionParts = useMemo(() => {
    const parts = [sido === 'ALL' ? '전국' : sido];
    if (sigungu !== 'ALL') parts.push(sigungu);
    return parts;
  }, [sido, sigungu]);

  return (
    <div className={`common-region-selector-bar ${className}`}>
      {showActiveBadge && (
        <div className="selector-title">
          <div className="active-region-breadcrumb">
            {activeRegionParts.map((part, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight size={18} className="breadcrumb-arrow" />}
                <span className="region-part">{part}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="selector-inputs">
        {/* 1단계: 시/도 */}
        <div className="select-col">
          <CustomSelect
            fullWidth
            sizeVariant="md"
            value={sido}
            onChange={e => handleSidoChange(e.target.value)}
          >
            <option value="ALL">전국 (전체 시·도)</option>
            {KOREA_ADMIN_REGIONS.map(item => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </CustomSelect>
        </div>

        {/* 2단계: 시/군/구 */}
        <div className="select-col">
          <CustomSelect
            fullWidth
            sizeVariant="md"
            value={sigungu}
            disabled={sido === 'ALL'}
            onChange={e => handleSigunguChange(e.target.value)}
          >
            <option value="ALL">
              {sido === 'ALL' ? '(시·도 선택 필요)' : `전체 시·군·구 (${availableSigungus.length}개)`}
            </option>
            {availableSigungus.map(sgg => (
              <option key={sgg} value={sgg}>
                {sgg}
              </option>
            ))}
          </CustomSelect>
        </div>
      </div>
    </div>
  );
}
