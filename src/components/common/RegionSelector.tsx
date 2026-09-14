'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  fetchFireRegions,
  getDbSidoList,
  getFireRegionsBySido,
  getFireRegionById,
} from '@/common/utils/regionUtils';
import { normalizeSidoName } from '@/utils/addressUtils';
import CustomSelect from './CustomSelect';
import './RegionSelector.scss';

interface RegionSelectorProps {
  value: SelectedRegion;
  onChange: (newValue: SelectedRegion) => void;
  className?: string;
  showActiveBadge?: boolean;
  allowNational?: boolean;
}

export default function RegionSelector({
  value,
  onChange,
  className = '',
  showActiveBadge = true,
  allowNational = false,
}: RegionSelectorProps) {
  const { regionId, sido, sigungu } = value;
  const [isLoaded, setIsLoaded] = useState(false);

  // DB 소방관할 마스터 데이터 비동기 로드 (메모리 캐시 활용)
  useEffect(() => {
    let isMounted = true;
    fetchFireRegions().then(() => {
      if (isMounted) setIsLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // DB 기반 시/도 목록 (allowNational이 true이면 맨 위에 'ALL' 추가)
  const sidoList = useMemo(() => {
    const dbList = getDbSidoList();
    return allowNational ? ['ALL', ...dbList] : dbList;
  }, [isLoaded, allowNational]);

  // 현재 유효한 시/도
  const currentSido = useMemo(() => {
    if (allowNational && (sido === 'ALL' || (!regionId && sido === '전국'))) {
      return 'ALL';
    }
    if (regionId) {
      const fr = getFireRegionById(regionId);
      if (fr?.sidoName && sidoList.includes(fr.sidoName)) {
        return fr.sidoName;
      }
    }
    if (sido && sido !== 'ALL') {
      const normalized = normalizeSidoName(sido);
      if (sidoList.includes(normalized)) {
        return normalized;
      }
      if (sidoList.includes(sido)) {
        return sido;
      }
    }
    return sidoList.find(s => s !== 'ALL') || '경기도';
  }, [allowNational, regionId, sido, sidoList]);

  // 선택된 시/도의 DB 소방관할 목록 (전국일 때는 빈 목록)
  const availableFireRegions = useMemo(() => {
    if (!currentSido || currentSido === 'ALL') return [];
    return getFireRegionsBySido(currentSido);
  }, [currentSido, isLoaded]);

  // 현재 유효한 소방서 regionId
  const currentFireRegionId = useMemo(() => {
    if (currentSido === 'ALL') return 'ALL';
    if (regionId) {
      if (availableFireRegions.some(fr => fr.regionId === regionId)) {
        return regionId;
      }
      const fr = getFireRegionById(regionId);
      if (fr) return fr.regionId;
    }
    const matchedByName = availableFireRegions.find(fr => fr.name === sigungu);
    if (matchedByName) return matchedByName.regionId;
    return availableFireRegions[0]?.regionId || '';
  }, [currentSido, regionId, sigungu, availableFireRegions]);

  // 마운트 및 로드 완료 시 자동 동기화
  useEffect(() => {
    if (isLoaded) {
      if (currentSido === 'ALL') {
        if (sido !== 'ALL' || regionId !== undefined) {
          onChange({
            regionId: undefined,
            sido: 'ALL',
            sigungu: '전국',
            eupmyeondong: '',
          });
        }
        return;
      }

      if (availableFireRegions.length > 0) {
        const selectedFr = availableFireRegions.find(fr => fr.regionId === currentFireRegionId) || availableFireRegions[0];
        if (selectedFr && (sido !== currentSido || regionId !== selectedFr.regionId || sigungu !== selectedFr.name)) {
          onChange({
            regionId: selectedFr.regionId,
            sido: currentSido,
            sigungu: selectedFr.name,
            eupmyeondong: '',
          });
        }
      }
    }
  }, [isLoaded, currentSido, currentFireRegionId, availableFireRegions, sido, regionId, sigungu, onChange]);

  // 시/도 변경 핸들러 -> 'ALL' 선택 시 전국 단위로 지정
  const handleSidoChange = (newSido: string) => {
    if (newSido === 'ALL') {
      onChange({
        regionId: undefined,
        sido: 'ALL',
        sigungu: '전국',
        eupmyeondong: '',
      });
      return;
    }

    const regions = getFireRegionsBySido(newSido);
    const firstFr = regions && regions.length > 0 ? regions[0] : undefined;

    onChange({
      regionId: firstFr?.regionId,
      sido: newSido,
      sigungu: firstFr?.name || '',
      eupmyeondong: '',
    });
  };

  // 관할소방서 변경 핸들러 -> DB regionId 즉시 할당
  const handleFireRegionChange = (newRegionId: string) => {
    const selectedFr = availableFireRegions.find(fr => fr.regionId === newRegionId) || getFireRegionById(newRegionId);
    onChange({
      regionId: newRegionId,
      sido: currentSido,
      sigungu: selectedFr?.name || newRegionId,
      eupmyeondong: '',
    });
  };

  // 브레드크럼 표시용 텍스트 (시/도 > 관할구역)
  const activeRegionParts = useMemo(() => {
    if (currentSido === 'ALL') {
      return ['전국'];
    }
    const selectedFr = availableFireRegions.find(fr => fr.regionId === currentFireRegionId);
    const sgName = selectedFr?.name || sigungu;
    const parts = [currentSido];
    if (sgName) {
      parts.push(sgName);
    }
    return parts;
  }, [currentSido, currentFireRegionId, availableFireRegions, sigungu]);

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
            value={currentSido}
            onChange={e => handleSidoChange(e.target.value)}
          >
            {sidoList.map(name => (
              <option key={name} value={name}>
                {name === 'ALL' ? '전국' : name}
              </option>
            ))}
          </CustomSelect>
        </div>

        {/* 2단계: 관할구역 (전국일 때는 '전체'로 고정 및 비활성화) */}
        <div className={`select-col ${currentSido === 'ALL' ? 'disabled' : ''}`}>
          <CustomSelect
            fullWidth
            sizeVariant="md"
            value={currentFireRegionId}
            onChange={e => handleFireRegionChange(e.target.value)}
            disabled={currentSido === 'ALL'}
          >
            {currentSido === 'ALL' ? (
              <option value="ALL">전체</option>
            ) : (
              availableFireRegions.map(fr => (
                <option key={fr.regionId} value={fr.regionId}>
                  {fr.name}
                </option>
              ))
            )}
          </CustomSelect>
        </div>
      </div>
    </div>
  );
}
