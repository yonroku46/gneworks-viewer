'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SlideDialog from './SlideDialog';
import RegionAssignDialog from './RegionAssignDialog';
import StatusBadge from '@/components/common/StatusBadge';
import CustomSelect from '@/components/common/CustomSelect';
import UserAvatar from '@/components/common/UserAvatar';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import {
  Search,
  KeyRound,
  Trash2,
  MapPin,
  RotateCcw,
  ArrowUpDown,
  Settings,
  Plus,
  X,
} from 'lucide-react';
import AdminService from '@/api/service/AdminService';
import { isRegionMatch } from '@/common/utils/regionUtils';
import './AccountDetailDialog.scss';

export interface AccountDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  reports?: WorkReport[];
  sites?: SiteDetail[];
  initialTab?: 'profile' | 'regions' | 'performance';
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onEditUser?: (user: User) => void;
  onUserUpdated?: (user: User) => void;
  onRegionsUpdated?: () => void;
  onDeleteUser?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onReportClick?: (report: WorkReport) => void;
}

export default function AccountDetailDialog({
  isOpen,
  onClose,
  user: initialUser,
  reports = [],
  sites = [],
  initialTab = 'profile',
  showEditButton = true,
  showDeleteButton = true,
  onEditUser,
  onUserUpdated,
  onRegionsUpdated,
  onDeleteUser,
  onResetPassword,
  onReportClick,
}: AccountDetailDialogProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Current user state (실시간 수정 반영)
  const [currentUser, setCurrentUser] = useState<User | undefined>(initialUser);
  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  const user = currentUser || initialUser;

  // 자체 내장 기본정보 수정 모달 상태
  const [isInternalEditOpen, setIsInternalEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    userName: string;
    phoneNum: string;
    birthday: string;
    gender: 'M' | 'F' | 'O';
    postalCode: string;
    detailAddress: string;
  }>({
    userName: '',
    phoneNum: '',
    birthday: '',
    gender: 'M',
    postalCode: '',
    detailAddress: '',
  });

  const handleOpenInternalEdit = () => {
    if (!user) return;
    setEditFormData({
      userName: user.userName,
      phoneNum: user.phoneNum,
      birthday: user.birthday || '',
      gender: (user.gender as 'M' | 'F' | 'O') || 'M',
      postalCode: user.postalCode || '',
      detailAddress: user.detailAddress || '',
    });
    setIsInternalEditOpen(true);
  };

  const handleCloseInternalEdit = () => {
    setIsInternalEditOpen(false);
  };

  const handleSubmitInternalEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!editFormData.userName.trim()) {
      enqueueSnackbar('사용자 이름을 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!editFormData.phoneNum.trim()) {
      enqueueSnackbar('전화번호를 입력해 주세요.', { variant: 'error' });
      return;
    }

    const updatedUser: User = {
      ...user,
      userName: editFormData.userName.trim(),
      phoneNum: editFormData.phoneNum.trim(),
      birthday: editFormData.birthday || undefined,
      gender: editFormData.gender,
      postalCode: editFormData.postalCode || undefined,
      detailAddress: editFormData.detailAddress || undefined,
      lastUpdated: dayjs().toISOString(),
    };

    try {
      await AdminService.updateUser({
        userId: updatedUser.userId,
        userName: updatedUser.userName,
        phoneNum: updatedUser.phoneNum,
        birthday: updatedUser.birthday,
        gender: updatedUser.gender,
        postalCode: updatedUser.postalCode,
        detailAddress: updatedUser.detailAddress,
      });
    } catch (err: any) {
      enqueueSnackbar('계정 정보 수정에 실패했습니다. 다시 시도해 주세요.', { variant: 'error' });
      return;
    }

    setCurrentUser(updatedUser);
    if (onUserUpdated) {
      onUserUpdated(updatedUser);
    }
    setIsInternalEditOpen(false);
    enqueueSnackbar(`[${updatedUser.userName}] 계정 정보가 수정되었습니다.`, { variant: 'success' });
  };

  // Tab State
  const [detailTab, setDetailTab] = useState<'profile' | 'regions' | 'performance'>(initialTab);

  // Region State (API 연동 – 서버에서 담당 관할 목록 조회)
  const [userAssignedRegions, setUserAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);
  const [isRegionAssignOpen, setIsRegionAssignOpen] = useState(false);
  const [isRegionLoading, setIsRegionLoading] = useState(false);

  const fetchAssignedRegions = async (userId: string) => {
    setIsRegionLoading(true);
    try {
      const regions = await AdminService.getUserAssignedRegions(userId);
      setUserAssignedRegions(regions || []);
    } catch (err) {
      console.error('[AccountDetailDialog] fetchAssignedRegions', err);
      setUserAssignedRegions([]);
    } finally {
      setIsRegionLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.userId) {
      fetchAssignedRegions(user.userId);
    } else if (!isOpen) {
      setUserAssignedRegions([]);
    }
  }, [user?.userId, isOpen]);

  // Performance Tab Filters
  const [userPerfRegionFilter, setUserPerfRegionFilter] = useState<string>('all');
  const [perfSearchQuery, setPerfSearchQuery] = useState('');
  const [perfSortOrder, setPerfSortOrder] = useState<'desc' | 'asc'>('desc');
  const [perfPreset, setPerfPreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [perfStartDate, setPerfStartDate] = useState('');
  const [perfEndDate, setPerfEndDate] = useState('');
  const [perfStatusFilter, setPerfStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'REJECTED'>('ALL');

  // Reset states when user or open changes
  useEffect(() => {
    if (isOpen) {
      setDetailTab(initialTab);
      setUserPerfRegionFilter('all');
      setPerfSearchQuery('');
      setPerfSortOrder('desc');
      setPerfPreset('all');
      setPerfStartDate('');
      setPerfEndDate('');
      setPerfStatusFilter('ALL');
    }
  }, [isOpen, user?.userId, initialTab]);

  // Performance Filter Reset Handler
  const handleResetPerfFilter = () => {
    setPerfSearchQuery('');
    setPerfSortOrder('desc');
    setPerfPreset('all');
    setPerfStartDate('');
    setPerfEndDate('');
    setPerfStatusFilter('ALL');
    setUserPerfRegionFilter('all');
  };

  // Performance Date Preset Handler
  const handleSetPerfPreset = (preset: 'all' | 'today' | 'week' | 'month' | 'custom') => {
    setPerfPreset(preset);
    const today = dayjs().format('YYYY-MM-DD');
    if (preset === 'all') {
      setPerfStartDate('');
      setPerfEndDate('');
    } else if (preset === 'today') {
      setPerfStartDate(today);
      setPerfEndDate(today);
    } else if (preset === 'week') {
      setPerfStartDate(dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
      setPerfEndDate(today);
    } else if (preset === 'month') {
      setPerfStartDate(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
      setPerfEndDate(today);
    } else if (preset === 'custom') {
      if (!perfStartDate) {
        setPerfStartDate(dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
      }
      if (!perfEndDate) {
        setPerfEndDate(today);
      }
    }
  };

  // Reports matching the current user
  const userReports = useMemo(() => {
    if (!user) return [];
    // If reports passed are already filtered for this user, check matching
    const matchesAnyOtherUser = reports.some(
      r => (r.installerId && r.installerId !== user.userId) || 
           (r.reporterName && r.reporterName !== user.userName && r.visitorName !== user.userName)
    );
    if (!matchesAnyOtherUser && reports.length > 0) {
      return reports;
    }
    return reports.filter(r =>
      r.installerId === user.userId ||
      r.reporterName === user.userName ||
      r.visitorName === user.userName
    );
  }, [user, reports]);

  // Unique region list: 담당 지역(userAssignedRegions) + 작업 보고서 지역(userReports) 통합 연동
  const userAvailableRegions = useMemo(() => {
    const regionMap = new Map<string, { label: string; count: number; sido: string; sigungu: string }>();

    // 1. 담당 지역(userAssignedRegions) 등록 (작업 보고서가 없어도 필터 탭에 0건으로 정상 노출)
    userAssignedRegions.forEach(reg => {
      const key = `${reg.sido}_${reg.sigungu}`;
      const label = `${reg.sido} ${reg.sigungu}`;
      regionMap.set(key, { label, count: 0, sido: reg.sido, sigungu: reg.sigungu });
    });

    // 2. 작업자의 전체 보고서(userReports)를 순회하며 해당 지역 카운트 집계 및 추가
    userReports.forEach(r => {
      const sido = r.sido || '';
      const sigungu = r.sigungu || '';
      if (!sido && !sigungu) return;
      const key = `${sido}_${sigungu}`;
      const label = `${sido} ${sigungu}`.trim();
      if (!regionMap.has(key)) {
        regionMap.set(key, { label, count: 0, sido, sigungu });
      }
      regionMap.get(key)!.count += 1;
    });

    return Array.from(regionMap.entries()).map(([key, data]) => ({
      key,
      label: data.label,
      count: data.count,
      sido: data.sido,
      sigungu: data.sigungu,
    }));
  }, [userAssignedRegions, userReports]);

  // Region Assign & Unassign handlers (API 연동)
  const handleAssignRegion = async (sido: string, sigungu: string) => {
    if (!user?.userId) {
      enqueueSnackbar('작업자 정보를 찾을 수 없습니다.', { variant: 'error' });
      return;
    }
    if (userAssignedRegions.some(r => isRegionMatch(r.sido, r.sigungu, sido, sigungu))) {
      enqueueSnackbar('이미 배정된 지역입니다.', { variant: 'warning' });
      return;
    }
    try {
      await AdminService.assignRegion(user.userId, sido, sigungu);
      await fetchAssignedRegions(user.userId);
      onRegionsUpdated?.();
      const targetName = user.userName ? `${user.userName}님` : '해당 작업자';
      enqueueSnackbar(`${targetName}에게 [${sido} ${sigungu}] 담당 지역이 배정되었습니다.`, { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || '담당 지역 배정에 실패했습니다.', { variant: 'error' });
    }
  };

  const handleUnassignRegion = async (region: UserAssignedRegionDetail) => {
    const targetName = user?.userName ? `${user.userName}님` : '해당 작업자';
    if (!confirm(`[${region.sido} ${region.sigungu}] 지역을 ${targetName}의 담당 목록에서 정말 해제하시겠습니까?`)) {
      return;
    }
    if (!region.regionId) {
      enqueueSnackbar('지역 정보가 올바르지 않습니다.', { variant: 'error' });
      return;
    }
    try {
      await AdminService.unassignRegion(user!.userId, region.regionId);
      await fetchAssignedRegions(user!.userId);
      onRegionsUpdated?.();
      enqueueSnackbar(`${targetName}의 [${region.sido} ${region.sigungu}] 담당 지역이 해제되었습니다.`, { variant: 'info' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || '담당 지역 해제에 실패했습니다.', { variant: 'error' });
    }
  };

  const isPerfFiltered = perfPreset !== 'all' || perfStatusFilter !== 'ALL' || !!perfSearchQuery.trim() || perfSortOrder !== 'desc' || userPerfRegionFilter !== 'all';

  // Base filtered reports
  const baseUserReports = useMemo(() => {
    return userReports.filter(r => {
      if (userPerfRegionFilter !== 'all') {
        const rKey = `${r.sido}_${r.sigungu}`;
        if (rKey !== userPerfRegionFilter) return false;
      }
      const date = r.installDate || (r.reportTime ? r.reportTime.split(' ')[0] : '');
      if (perfStartDate && date < perfStartDate) return false;
      if (perfEndDate && date > perfEndDate) return false;
      if (perfSearchQuery.trim()) {
        const q = perfSearchQuery.trim().toLowerCase();
        const matchSite = r.siteName?.toLowerCase().includes(q);
        const matchDong = r.dong?.toLowerCase().includes(q);
        const matchHo = r.ho?.toLowerCase().includes(q);
        const matchHead = r.headName?.toLowerCase().includes(q);
        if (!matchSite && !matchDong && !matchHo && !matchHead) return false;
      }
      return true;
    });
  }, [userReports, userPerfRegionFilter, perfStartDate, perfEndDate, perfSearchQuery]);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: baseUserReports.length,
      completed: baseUserReports.filter(r => r.status === 'COMPLETED').length,
      pending: baseUserReports.filter(r => r.status === 'PENDING').length,
      rejected: baseUserReports.filter(r => r.status === 'REJECTED').length,
    };
  }, [baseUserReports]);

  // Final reports for table
  const filteredUserReports = useMemo(() => {
    const list = baseUserReports.filter(r => {
      if (perfStatusFilter !== 'ALL' && r.status !== perfStatusFilter) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      const dateA = a.installDate || a.reportTime || '';
      const dateB = b.installDate || b.reportTime || '';
      return perfSortOrder === 'desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
    });
  }, [baseUserReports, perfStatusFilter, perfSortOrder]);

  if (!user) return null;

  return (
    <>
      <SlideDialog
        isOpen={isOpen && !isRegionAssignOpen && !isInternalEditOpen}
        onClose={onClose}
        title="계정 상세 정보"
        className="manage-page user-detail-dialog"
        footer={
          <div className="detail-btn-row">
            {showDeleteButton && (
              <button
                type="button"
                className="btn-delete-modal"
                onClick={() => {
                  if (confirm(`[${user.userName} (${user.userId})] 계정을 정말 삭제하시겠습니까?`)) {
                    onClose();
                    if (onDeleteUser) {
                      onDeleteUser(user);
                    }
                  }
                }}
              >
                <span>계정 삭제</span>
              </button>
            )}
            {showEditButton && (
              <button
                type="button"
                className="btn-edit-modal"
                onClick={() => {
                  if (onEditUser) {
                    onEditUser(user);
                  } else {
                    handleOpenInternalEdit();
                  }
                }}
              >
                <span>기본정보 수정</span>
              </button>
            )}
          </div>
        }
      >
        <div className="account-detail-modal">
          {/* Header Profile */}
          <div className="account-profile-header">
            <UserAvatar 
              src={user.profileImg} 
              name={user.userName} 
              size="huge" 
            />
            <div className="profile-texts">
              <h3>{user.userName}</h3>
              <span className="id-tag">아이디: {user.userId}</span>
            </div>
          </div>

          {/* Tabs Bar */}
          <div className="account-detail-tabs-bar">
            <button
              type="button"
              className={`detail-tab-btn ${detailTab === 'profile' ? 'active' : ''}`}
              onClick={() => setDetailTab('profile')}
            >
              <span>기본 정보</span>
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${detailTab === 'regions' ? 'active' : ''}`}
              onClick={() => setDetailTab('regions')}
            >
              <span>담당 지역 관리</span>
              <span className="tab-count-badge">{userAssignedRegions.length}곳</span>
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${detailTab === 'performance' ? 'active' : ''}`}
              onClick={() => setDetailTab('performance')}
            >
              <span>작업 실적 및 이력</span>
              <span className="tab-count-badge">{userReports.length}건</span>
            </button>
          </div>

          {/* ── TAB 1: PROFILE INFO ── */}
          {detailTab === 'profile' && (
            <>
              <div className="info-card-section">
                <h5 className="section-head">기본 정보</h5>
                <div className="info-grid-list">
                  <div className="info-row">
                    <span className="row-key">전화번호</span>
                    <span className="row-val font-semibold">{user.phoneNum}</span>
                  </div>
                  <div className="info-row">
                    <span className="row-key">성별</span>
                    <span className="row-val">
                      {user.gender === 'M' ? '남성' : user.gender === 'F' ? '여성' : '미지정'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="row-key">생년월일</span>
                    <span className="row-val">{user.birthday || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="row-key">우편번호</span>
                    <span className="row-val">{user.postalCode || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="row-key">상세 주소</span>
                    <span className="row-val">{user.detailAddress || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="row-key">계정 생성일</span>
                    <span className="row-val">
                      {dayjs(user.createTime).format('YYYY년 MM월 DD일 HH:mm')}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="row-key">최근 정보 수정일</span>
                    <span className="row-val">
                      {dayjs(user.lastUpdated).format('YYYY년 MM월 DD일 HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Reset Action Box */}
              {onResetPassword && (
                <div className="pw-reset-alert-box">
                  <div className="pw-reset-desc">
                    <strong>비밀번호 초기화</strong>
                    <p>비밀번호 분실 시 해당 유저의 <strong>하이픈 없는 전화번호({user.phoneNum.replace(/[^0-9]/g, '')})</strong>로 즉시 초기화됩니다.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-pw-action"
                    onClick={() => onResetPassword(user)}
                  >
                    <KeyRound size={15} />
                    <span>초기화</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── TAB 2: ASSIGNED REGIONS (포탈의 card-header-row 및 assigned-empty-box 반영) ── */}
          {detailTab === 'regions' && (
            <div className="assigned-regions-tab-content">
              {/* 포탈 스타일의 card-header-row */}
              <div className="card-header-row">
                <div className="header-title-group">
                  <span>담당 지역 관리</span>
                  <span className="badge-count">{userAssignedRegions.length}개 지역</span>
                </div>
                <button
                  type="button"
                  className="btn-add-site"
                  onClick={() => setIsRegionAssignOpen(true)}
                >
                  <Settings size={14} />
                  <span>지역 편집</span>
                </button>
              </div>

              {/* 배정된 지역 목록 or empty-box */}
              <div className="card-content-body">
                {userAssignedRegions.length > 0 ? (
                  <div className="assigned-sites-list">
                    {userAssignedRegions.map((region, rIdx) => {
                      const sitesInRegion = sites.filter(
                        s => isRegionMatch(s.sido, s.sigungu, region.sido, region.sigungu)
                      );
                      const totalHouseholds = sitesInRegion.reduce(
                        (sum, s) => sum + (s.totalHouseholds ?? s.households?.length ?? 0),
                        0
                      );
                      return (
                        <div key={region.assignedRegionId || `reg_${region.sido}_${region.sigungu}_${rIdx}`} className="assigned-site-card">
                          <div className="site-info-col">
                            <div className="site-name-row">
                              <span className="site-title">{region.sido} {region.sigungu}</span>
                              {region.assignedDate && (
                                <span className="site-region-tag">{region.assignedDate} 등록</span>
                              )}
                            </div>
                            <div className="site-meta-row">
                              <span className="meta-item">총 {sitesInRegion.length}개 현장</span>
                              <span className="dot">•</span>
                              <span className="meta-item">총 {totalHouseholds}세대</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-unassign-action"
                            onClick={() => handleUnassignRegion(region)}
                            title="담당 지역 배정 해제"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="assigned-empty-box">
                    <MapPin size={32} className="empty-icon" />
                    <p className="empty-title">현재 배정된 담당 지역이 없습니다.</p>
                    <p className="empty-desc">
                      [담당 지역 설정] 버튼을 눌러 작업하실 지역을 등록하세요.
                    </p>
                    <button
                      type="button"
                      className="btn-empty-add"
                      onClick={() => setIsRegionAssignOpen(true)}
                    >
                      <Plus size={14} />
                      <span>담당 지역 설정하기</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: PERFORMANCE & HISTORY ── */}
          {detailTab === 'performance' && (
            <div className="performance-tab-content">
              {/* 1. REGION FILTER TABS */}
              <div className="perf-region-filter-section">
                <div className="region-tabs-track">
                  <button
                    type="button"
                    className={`region-tab-btn ${userPerfRegionFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setUserPerfRegionFilter('all')}
                  >
                    <span>전체 지역</span>
                    <span className="count-pill">{userReports.length}</span>
                  </button>
                  {userAvailableRegions.map(reg => (
                    <button
                      key={reg.key}
                      type="button"
                      className={`region-tab-btn ${userPerfRegionFilter === reg.key ? 'active' : ''}`}
                      onClick={() => setUserPerfRegionFilter(reg.key)}
                    >
                      <span>{reg.label}</span>
                      <span className="count-pill">{reg.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. SEARCH BAR & SORT / RESET */}
              <div className="perf-search-row">
                <div className="search-input-box">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    placeholder="현장명, 동/호수, 세대주 검색"
                    value={perfSearchQuery}
                    onChange={e => setPerfSearchQuery(e.target.value)}
                  />
                  {perfSearchQuery && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setPerfSearchQuery('')}
                      title="검색어 지우기"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-sort-order"
                  onClick={() => setPerfSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
                  title="설치 일자 정렬"
                >
                  <ArrowUpDown size={13} />
                  <span>{perfSortOrder === 'desc' ? '최신순' : '과거순'}</span>
                </button>

                {isPerfFiltered && (
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={handleResetPerfFilter}
                    title="필터 초기화"
                  >
                    <RotateCcw size={13} />
                    <span>초기화</span>
                  </button>
                )}
              </div>

              {/* 3. FILTER CONTROLS (포탈 작업 이력 조회 스타일) */}
              <div className="perf-filter-controls-box">
                {/* 기간 선택 라인 */}
                <div className="filter-line">
                  <span className="line-label">기간</span>
                  <div className="pill-group">
                    <button
                      type="button"
                      className={`pill-btn ${perfPreset === 'all' ? 'active' : ''}`}
                      onClick={() => handleSetPerfPreset('all')}
                    >
                      전체
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${perfPreset === 'today' ? 'active' : ''}`}
                      onClick={() => handleSetPerfPreset('today')}
                    >
                      오늘
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${perfPreset === 'week' ? 'active' : ''}`}
                      onClick={() => handleSetPerfPreset('week')}
                    >
                      최근 7일
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${perfPreset === 'month' ? 'active' : ''}`}
                      onClick={() => handleSetPerfPreset('month')}
                    >
                      최근 30일
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${perfPreset === 'custom' ? 'active' : ''}`}
                      onClick={() => handleSetPerfPreset('custom')}
                    >
                      <span>직접 설정</span>
                    </button>
                  </div>
                </div>

                {/* 직접 설정 날짜 입력 폼 */}
                {perfPreset === 'custom' && (
                  <div className="custom-date-row">
                    <input
                      type="date"
                      className="date-input"
                      value={perfStartDate}
                      onChange={e => setPerfStartDate(e.target.value)}
                    />
                    <span className="date-sep">~</span>
                    <input
                      type="date"
                      className="date-input"
                      value={perfEndDate}
                      onChange={e => setPerfEndDate(e.target.value)}
                    />
                  </div>
                )}

                {/* 상태 필터 라인 */}
                <div className="filter-line">
                  <span className="line-label">상태</span>
                  <div className="pill-group">
                    <button
                      type="button"
                      className={`pill-btn ${perfStatusFilter === 'ALL' ? 'active' : ''}`}
                      onClick={() => setPerfStatusFilter('ALL')}
                    >
                      <span>전체 ({statusCounts.all})</span>
                    </button>
                    <button
                      type="button"
                      className={`pill-btn status-completed ${perfStatusFilter === 'COMPLETED' ? 'active' : ''}`}
                      onClick={() => setPerfStatusFilter('COMPLETED')}
                    >
                      <span className="status-dot green" />
                      <span>확인완료 ({statusCounts.completed})</span>
                    </button>
                    <button
                      type="button"
                      className={`pill-btn status-pending ${perfStatusFilter === 'PENDING' ? 'active' : ''}`}
                      onClick={() => setPerfStatusFilter('PENDING')}
                    >
                      <span className="status-dot amber" />
                      <span>검토대기 ({statusCounts.pending})</span>
                    </button>
                    <button
                      type="button"
                      className={`pill-btn status-revise ${perfStatusFilter === 'REJECTED' ? 'active' : ''}`}
                      onClick={() => setPerfStatusFilter('REJECTED')}
                    >
                      <span className="status-dot red" />
                      <span>수정필요 ({statusCounts.rejected})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. PERFORMANCE TABLE */}
              <div className="perf-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th className="col-num">순번</th>
                      <th>설치 일자</th>
                      <th>현장 (아파트명)</th>
                      <th>동 / 호수</th>
                      <th>세대주</th>
                      <th style={{ textAlign: 'center' }}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUserReports.length > 0 ? (
                      filteredUserReports.map((report, idx) => (
                        <tr
                          key={report.reportId ? `${report.reportId}_${idx}` : `report_${idx}_${report.siteName || ''}_${report.dong || ''}_${report.ho || ''}`}
                          onClick={() => onReportClick?.(report)}
                          style={{ cursor: onReportClick ? 'pointer' : 'default' }}
                        >
                          <td className="col-num">
                            <span className="row-index">{idx + 1}</span>
                          </td>
                          <td>{report.installDate || report.installDateFormatted || '—'}</td>
                          <td><strong>{report.siteName}</strong></td>
                          <td>{report.dong}동 {report.ho}호</td>
                          <td>{report.headName}</td>
                          <td style={{ textAlign: 'center' }}>
                            <StatusBadge status={report.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="perf-empty-state">
                          {userReports.length === 0
                            ? `[${user.userName}] 작업자의 등록된 작업 보고서가 없습니다.`
                            : '선택하신 조건에 해당하는 작업 보고서가 없습니다.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </SlideDialog>

      {/* 담당 지역 관리 다이얼로그 (RegionAssignDialog) */}
      <RegionAssignDialog
        isOpen={isRegionAssignOpen}
        onClose={() => setIsRegionAssignOpen(false)}
        assignedRegions={userAssignedRegions}
        sites={sites}
        onAssignRegion={handleAssignRegion}
        onUnassignRegion={handleUnassignRegion}
      />

      {/* ── 계정 기본정보 수정 모달 (내장 지원) ── */}
      {user && (
        <SlideDialog
          isOpen={isInternalEditOpen}
          onClose={handleCloseInternalEdit}
          title="계정 정보 수정"
          className="manage-page"
          footer={
            <div className="dialog-btn-group">
              <button type="button" className="btn-cancel" onClick={handleCloseInternalEdit}>
                <span>취소</span>
              </button>
              <button type="submit" form="internal-account-edit-form" className="btn-save">
                <span>수정 완료</span>
              </button>
            </div>
          }
        >
          <form id="internal-account-edit-form" className="account-dialog-form" onSubmit={handleSubmitInternalEdit}>
            <div className="form-field">
              <label>아이디</label>
              <input
                type="text"
                disabled
                value={user.userId}
              />
            </div>

            <div className="form-field">
              <label>사용자 이름 <span className="req">*</span></label>
              <input
                type="text"
                placeholder="예: 홍길동"
                required
                value={editFormData.userName}
                onChange={e => setEditFormData(prev => ({ ...prev, userName: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label>전화번호 <span className="req">*</span></label>
              <input
                type="text"
                placeholder="예: 010-1234-5678"
                required
                value={editFormData.phoneNum}
                onChange={e => setEditFormData(prev => ({ ...prev, phoneNum: e.target.value }))}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>성별</label>
                <CustomSelect
                  fullWidth
                  sizeVariant="lg"
                  value={editFormData.gender}
                  onChange={e => setEditFormData(prev => ({ ...prev, gender: e.target.value as 'M' | 'F' | 'O' }))}
                >
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                  <option value="O">기타</option>
                </CustomSelect>
              </div>
              <div className="form-field">
                <label>생년월일</label>
                <input
                  type="date"
                  value={editFormData.birthday}
                  onChange={e => setEditFormData(prev => ({ ...prev, birthday: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-field">
              <label>우편번호</label>
              <input
                type="text"
                placeholder="예: 06544"
                value={editFormData.postalCode}
                onChange={e => setEditFormData(prev => ({ ...prev, postalCode: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label>상세 주소</label>
              <input
                type="text"
                placeholder="예: 서울시 서초구 신반포로 100 관리동 2층"
                value={editFormData.detailAddress}
                onChange={e => setEditFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
              />
            </div>
          </form>
        </SlideDialog>
      )}
    </>
  );
}
