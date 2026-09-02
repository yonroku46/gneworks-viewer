'use client';

import React, { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { KOREA_ADMIN_REGIONS, getSigunguList, getEupmyeondongList } from '@/data/koreaRegions';
import CustomSelect from './CustomSelect';
import './RegionSelector.scss';

export type { RegionValue };

interface RegionSelectorProps {
  value: RegionValue;
  onChange: (newValue: RegionValue) => void;
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

  // Dynamic Eupmyeondong options from Master Data
  const availableEupmyeondongs = useMemo(() => {
    if (sido === 'ALL' || sigungu === 'ALL') return [];
    return getEupmyeondongList(sido, sigungu);
  }, [sido, sigungu]);

  // Format Current Active Region Parts
  const activeRegionParts = useMemo(() => {
    const parts = [sido === 'ALL' ? '전국' : sido];
    if (sigungu !== 'ALL') parts.push(sigungu);
    if (eupmyeondong !== 'ALL') parts.push(eupmyeondong);
    return parts;
  }, [sido, sigungu, eupmyeondong]);

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

        {/* 3단계: 읍/면/동 */}
        <div className="select-col">
          <CustomSelect
            fullWidth
            sizeVariant="md"
            value={eupmyeondong}
            disabled={sigungu === 'ALL'}
            onChange={e => handleEupmyeondongChange(e.target.value)}
          >
            <option value="ALL">
              {sigungu === 'ALL' ? '(시·군·구 선택 필요)' : `전체 읍·면·동 (${availableEupmyeondongs.length}개)`}
            </option>
            {availableEupmyeondongs.map(eup => (
              <option key={eup} value={eup}>
                {eup}
              </option>
            ))}
          </CustomSelect>
        </div>
      </div>
    </div>
  );
}
