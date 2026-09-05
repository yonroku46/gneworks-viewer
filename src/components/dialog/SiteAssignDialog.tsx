'use client';

import React, { useState, useMemo } from 'react';
import SlideDialog from './SlideDialog';
import RegionSelector from '@/components/common/RegionSelector';
import SearchInput from '@/components/common/SearchInput';
import { getRegionWorkers } from '@/data/regionStorage';
import { Building2, Plus, MapPin, CheckCircle2, Users, Search } from 'lucide-react';
import './SiteAssignDialog.scss';

interface SiteAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sites: SiteDetail[];
  currentUserId?: string;
  onAssign: (site: SiteDetail) => void;
}

export default function SiteAssignDialog({
  isOpen,
  onClose,
  sites,
  currentUserId,
  onAssign,
}: SiteAssignDialogProps) {
  const [region, setRegion] = useState<SelectedRegion>({
    sido: '경기도',
    sigungu: '연천군',
    eupmyeondong: 'ALL',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchSido = region.sido === 'ALL' || site.sido === region.sido;
      const matchSigungu = region.sigungu === 'ALL' || site.sigungu === region.sigungu;
      const matchEup = region.eupmyeondong === 'ALL' || (site.eupmyeondong && site.eupmyeondong.includes(region.eupmyeondong));
      const matchSearch =
        !searchQuery.trim() ||
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSido && matchSigungu && matchEup && matchSearch;
    });
  }, [sites, region, searchQuery]);

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="새 담당 현장 배정 등록"
      className="site-assign-slide-dialog"
      footer={
        <button
          type="button"
          className="btn-cancel"
          style={{ width: '100%', height: '2.75rem', borderRadius: '0.625rem', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--slate-700)', fontWeight: 700, cursor: 'pointer' }}
          onClick={onClose}
        >
          닫기
        </button>
      }
    >
      <div className="site-assign-dialog-body">
        <p className="dialog-desc">
          본인이 담당하여 작업을 수행할 아파트 현장을 검색하고 선택하여 담당 현장으로 배정 등록하세요. (동일 현장에 여러 작업자가 공동 담당으로 함께 등록될 수 있습니다.)
        </p>

        <div className="assign-filter-section">
          <RegionSelector
            value={region}
            onChange={newRegion => setRegion(newRegion)}
          />
          <SearchInput
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="아파트명 또는 도로명 주소로 검색..."
            fullWidth
          />
        </div>

        <div className="assign-site-list-wrapper">
          <div className="assign-list-header">
            <span>검색 결과: <strong>{filteredSites.length}</strong>개 현장</span>
          </div>

          <div className="assign-sites-list">
            {filteredSites.length > 0 ? (
              filteredSites.map((site, idx) => {
                const workers = getRegionWorkers(site.sido, site.sigungu);
                const isAssignedToMe = workers.some(w => w.userId === currentUserId);
                const otherWorkers = workers.filter(w => w.userId !== currentUserId);

                return (
                  <div
                    key={site.siteId || `site_${idx}`}
                    className={`assign-site-card ${isAssignedToMe ? 'is-me' : ''}`}
                  >
                    <div className="card-top-info">
                      <div className="site-title-row">
                        <Building2 size={18} className="site-icon" />
                        <h4 className="site-name">{site.name}</h4>
                        <div className="region-badge">
                          <span>{site.sigungu} {site.eupmyeondong}</span>
                        </div>
                      </div>
                      <div className="site-address">
                        <MapPin size={13} />
                        <span>{site.address}</span>
                      </div>
                      <div className="assigned-workers-info">
                        <Users size={13} className="workers-icon" />
                        {workers.length > 0 ? (
                          <span className="workers-text">
                            현재 담당: <strong>{workers.map(w => w.userName).join(', ')}</strong> ({workers.length}명)
                          </span>
                        ) : (
                          <span className="workers-text empty">현재 배정된 담당자 없음</span>
                        )}
                      </div>
                    </div>

                    <div className="card-bottom-info">
                      <div className="scale-meta">
                        <span>단지: <strong>{site.dongCount}개 동</strong></span>
                        <span>세대수: <strong>{site.totalHouseholds}세대</strong></span>
                      </div>

                      <div className="assign-action">
                        {isAssignedToMe ? (
                          <span className="badge-status current-assigned">
                            <CheckCircle2 size={14} />
                            <span>배정 중</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={`btn-select-assign ${otherWorkers.length > 0 ? 'co-assign' : ''}`}
                            onClick={() => onAssign(site)}
                          >
                            <Plus size={14} />
                            <span>{otherWorkers.length > 0 ? '공동 담당 등록' : '담당 등록'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div key="empty-assign-sites" className="assign-empty-state">
                <Search size={32} />
                <p>선택하신 지역 또는 검색어에 일치하는 현장이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SlideDialog>
  );
}
