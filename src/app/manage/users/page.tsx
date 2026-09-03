'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SlideDialog from '@/components/dialog/SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import { getStoredReports } from '@/data/reportStorage';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { 
  Plus, 
  Search, 
  User as UserIcon, 
  KeyRound, 
  Trash2, 
  Edit3, 
  Info,
  Calendar,
  MapPin,
  Phone,
  FileText,
  RotateCcw,
  ArrowUpDown,
  X
} from 'lucide-react';
import '../ManageLayout.scss';

export default function AccountManagementPage() {
  const { enqueueSnackbar } = useSnackbar();

  // Mock initial users (Strictly based on User interface)
  const [users, setUsers] = useState<User[]>([
    {
      userId: 'admin_gneworks',
      userName: '김관리',
      phoneNum: '010-1234-5678',
      gender: 'M',
      birthday: '1985-03-15',
      postalCode: '06544',
      detailAddress: '서울시 서초구 신반포로 100 관리동 2층',
      lastUpdated: '2026-08-25T14:30:00+09:00',
      createTime: '2026-01-10T09:00:00+09:00',
    },
    {
      userId: 'worker_lee',
      userName: '이현장',
      phoneNum: '010-9876-5432',
      gender: 'M',
      birthday: '1990-07-22',
      postalCode: '13529',
      detailAddress: '경기도 성남시 분당구 판교역로 146',
      lastUpdated: '2026-08-27T10:15:00+09:00',
      createTime: '2026-02-01T11:00:00+09:00',
    },
    {
      userId: 'worker_park',
      userName: '박시공',
      phoneNum: '010-5555-7777',
      gender: 'M',
      birthday: '1988-11-05',
      postalCode: '04322',
      detailAddress: '서울시 용산구 한강대로 405',
      lastUpdated: '2026-08-26T16:40:00+09:00',
      createTime: '2026-03-15T13:30:00+09:00',
    },
    {
      userId: 'worker_choi',
      userName: '최검수',
      phoneNum: '010-3333-8888',
      gender: 'F',
      birthday: '1993-09-18',
      postalCode: '05505',
      detailAddress: '서울시 송파구 올림픽로 300',
      lastUpdated: '2026-08-20T09:20:00+09:00',
      createTime: '2026-04-10T15:00:00+09:00',
    },
    {
      userId: 'worker_jung',
      userName: '정담당',
      phoneNum: '010-4444-1212',
      gender: 'M',
      birthday: '1991-04-02',
      postalCode: '06241',
      detailAddress: '서울시 강남구 테헤란로 152',
      lastUpdated: '2026-08-28T09:00:00+09:00',
      createTime: '2026-05-12T10:20:00+09:00',
    },
  ]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Master Reports Data for Work Performance Tab
  const [allReports, setAllReports] = useState<WorkReport[]>(() => {
    if (typeof window !== 'undefined') return getStoredReports();
    return [];
  });

  // User Detail Tab State ('profile' | 'performance')
  const [detailTab, setDetailTab] = useState<'profile' | 'performance'>('profile');

  // Performance Tab Filter States (포탈 작업 이력 조회 스타일)
  const [perfSearchQuery, setPerfSearchQuery] = useState('');
  const [perfSortOrder, setPerfSortOrder] = useState<'desc' | 'asc'>('desc');
  const [perfPreset, setPerfPreset] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [perfStartDate, setPerfStartDate] = useState('');
  const [perfEndDate, setPerfEndDate] = useState('');
  const [perfStatusFilter, setPerfStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'REJECTED'>('ALL');

  // Filter Reset Handler
  const handleResetPerfFilter = () => {
    setPerfSearchQuery('');
    setPerfSortOrder('desc');
    setPerfPreset('all');
    setPerfStartDate('');
    setPerfEndDate('');
    setPerfStatusFilter('ALL');
  };

  // Preset Date Filter Handler
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

  // Open User Detail Dialog Handler
  const handleOpenDetail = (user: User, initialTab: 'profile' | 'performance' = 'performance') => {
    setSelectedUser(user);
    setDetailTab(initialTab);
    handleResetPerfFilter();
    setAllReports(getStoredReports());
    setIsDetailOpen(true);
  };

  // Helper to count reports for any user
  const getUserReportCount = (userId: string, userName: string) => {
    return allReports.filter(r => 
      r.installerId === userId || 
      r.reporterName === userName ||
      r.visitorName === userName
    ).length;
  };

  // Filtered Reports for Selected User
  const userReports = useMemo(() => {
    if (!selectedUser) return [];
    return allReports.filter(r => 
      r.installerId === selectedUser.userId || 
      r.reporterName === selectedUser.userName ||
      r.visitorName === selectedUser.userName
    );
  }, [selectedUser, allReports]);

  // Is Filter Active Check
  const isPerfFiltered = perfPreset !== 'all' || perfStatusFilter !== 'ALL' || !!perfSearchQuery.trim() || perfSortOrder !== 'desc';

  // Base filtered reports by Date and Search Query (for status counts)
  const baseUserReports = useMemo(() => {
    return userReports.filter(r => {
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
  }, [userReports, perfStartDate, perfEndDate, perfSearchQuery]);

  // Counts by status within current date/search scope
  const statusCounts = useMemo(() => {
    return {
      all: baseUserReports.length,
      completed: baseUserReports.filter(r => r.status === 'COMPLETED').length,
      pending: baseUserReports.filter(r => r.status === 'PENDING').length,
      rejected: baseUserReports.filter(r => r.status === 'REJECTED').length,
    };
  }, [baseUserReports]);

  // Final Filtered Reports for Table
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

  // Form State (strictly based on User)
  const [formData, setFormData] = useState<{
    userId: string;
    userName: string;
    phoneNum: string;
    birthday: string;
    gender: string;
    postalCode: string;
    detailAddress: string;
  }>({
    userId: '',
    userName: '',
    phoneNum: '',
    birthday: '',
    gender: 'M',
    postalCode: '',
    detailAddress: '',
  });

  // Open Create Dialog
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      userId: '',
      userName: '',
      phoneNum: '',
      birthday: '',
      gender: 'M',
      postalCode: '',
      detailAddress: '',
    });
    setIsFormOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      userId: user.userId,
      userName: user.userName,
      phoneNum: user.phoneNum,
      birthday: user.birthday || '',
      gender: user.gender || 'M',
      postalCode: user.postalCode || '',
      detailAddress: user.detailAddress || '',
    });
    setIsFormOpen(true);
  };


  // Submit Handler (Create or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId.trim()) {
      enqueueSnackbar('아이디를 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!formData.userName.trim()) {
      enqueueSnackbar('사용자 이름을 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!formData.phoneNum.trim()) {
      enqueueSnackbar('전화번호를 입력해 주세요.', { variant: 'error' });
      return;
    }

    const now = new Date().toISOString();

    if (editingUser) {
      // Update
      setUsers(prev =>
        prev.map(u =>
          u.userId === editingUser.userId
            ? {
                ...u,
                ...formData,
                lastUpdated: now,
              }
            : u
        )
      );
      if (selectedUser && selectedUser.userId === editingUser.userId) {
        setSelectedUser(prev => (prev ? { ...prev, ...formData, lastUpdated: now } : null));
      }
      enqueueSnackbar(`[${formData.userName}] 계정 정보가 수정되었습니다.`, { variant: 'success' });
    } else {
      // Check duplicate ID
      if (users.some(u => u.userId === formData.userId.trim())) {
        enqueueSnackbar('이미 등록된 아이디입니다.', { variant: 'error' });
        return;
      }

      // Create
      const newUser: User = {
        userId: formData.userId.trim(),
        userName: formData.userName.trim(),
        phoneNum: formData.phoneNum.trim(),
        birthday: formData.birthday || undefined,
        gender: formData.gender || undefined,
        postalCode: formData.postalCode || undefined,
        detailAddress: formData.detailAddress || undefined,
        lastUpdated: now,
        createTime: now,
      };

      setUsers(prev => [newUser, ...prev]);
      enqueueSnackbar(
        `[${newUser.userName}] 계정이 발급되었습니다. 초기 비밀번호는 전화번호(${newUser.phoneNum})입니다.`,
        { variant: 'success', autoHideDuration: 4000 }
      );
    }

    setIsFormOpen(false);
  };

  // Reset Password Handler
  const handleResetPassword = (user: User) => {
    if (
      confirm(
        `[${user.userName}] 님의 비밀번호를 초기화하시겠습니까?\n\n초기화 시 비밀번호는 등록된 전화번호(${user.phoneNum})로 변경됩니다.`
      )
    ) {
      enqueueSnackbar(
        `[${user.userName}] 님의 비밀번호가 전화번호(${user.phoneNum})로 초기화되었습니다.`,
        { variant: 'success', autoHideDuration: 5000 }
      );
    }
  };

  // Delete User Handler
  const handleDeleteUser = (user: User) => {
    if (confirm(`[${user.userName} (${user.userId})] 계정을 완전히 삭제하시겠습니까?`)) {
      setUsers(prev => prev.filter(u => u.userId !== user.userId));
      setIsDetailOpen(false);
      setIsFormOpen(false);
      enqueueSnackbar(`[${user.userName}] 계정이 삭제되었습니다.`, { variant: 'success' });
    }
  };

  // Filtered List
  const filteredUsers = users.filter(user => {
    return (
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNum.includes(searchQuery)
    );
  });

  return (
    <div className="manage-account-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>계정 리스트</h2>
          <p>사용자 계정을 신규 발급하고 관리합니다.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>신규 계정 발급</span>
        </button>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="account-search-filter-bar">
        <SearchInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="이름, 아이디, 전화번호 검색..."
          fullWidth
        />
      </div>

      {/* ── LIST VIEW (ROW BY ROW) ── */}
      <div className="account-table-wrapper">
        <table className="account-table">
          <thead>
            <tr>
              <th className="col-num">순번</th>
              <th className="col-user">사용자명</th>
              <th className="col-id">아이디</th>
              <th className="col-phone">전화번호</th>
              <th className="col-perf">작업 실적</th>
              <th className="col-gender">성별</th>
              <th className="col-birthday">생년월일</th>
              <th className="col-address">상세 주소</th>
              <th className="col-created">등록일</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr 
                  key={user.userId} 
                  className="account-table-row"
                  onClick={() => handleOpenDetail(user, 'profile')}
                >
                  <td className="col-num">
                    <span className="row-index">{idx + 1}</span>
                  </td>
                  <td className="col-user">
                    <div className="user-cell">
                      <div className="user-avatar-mini">
                        {user.userName.charAt(0)}
                      </div>
                      <span className="user-name-text">{user.userName}</span>
                    </div>
                  </td>
                  <td className="col-id">
                    <span className="user-id-code">{user.userId}</span>
                  </td>
                  <td className="col-phone">
                    <span className="user-phone-cell">{user.phoneNum}</span>
                  </td>
                  <td className="col-perf">
                    {(() => {
                      const count = getUserReportCount(user.userId, user.userName);
                      return (
                        <button
                          type="button"
                          className={`btn-user-perf-pill ${count === 0 ? 'empty' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(user, 'performance');
                          }}
                          title="클릭 시 기간별 작업 실적 및 이력 확인"
                        >
                          <FileText size={12} />
                          <span>{count > 0 ? `${count}건` : '0건'}</span>
                        </button>
                      );
                    })()}
                  </td>
                  <td className="col-gender">
                    <span className={`gender-tag ${user.gender || 'M'}`}>
                      {user.gender === 'M' ? '남성' : user.gender === 'F' ? '여성' : '기타'}
                    </span>
                  </td>
                  <td className="col-birthday">
                    <span>{user.birthday || '—'}</span>
                  </td>
                  <td className="col-address">
                    <span className="address-cell-text" title={user.detailAddress || ''}>
                      {user.detailAddress || '—'}
                    </span>
                  </td>
                  <td className="col-created">
                    <span className="date-text">{dayjs(user.createTime).format('YYYY.MM.DD')}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="empty-table-cell">
                  <UserIcon size={36} className="empty-icon" />
                  <p>일치하는 계정 정보가 존재하지 않습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── SLIDE DIALOG: CREATE / EDIT USER ── */}
      <SlideDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? '계정 정보 수정' : '신규 계정 발급'}
        className="manage-page"
        footer={
          <div className="dialog-btn-group">
            {editingUser ? (
              <button
                type="button"
                className="btn-delete"
                onClick={() => handleDeleteUser(editingUser)}
              >
                <span>계정 삭제</span>
              </button>
            ) : (
              <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>
                <span>취소</span>
              </button>
            )}
            <button type="submit" form="account-dialog-form" className="btn-save">
              <span>{editingUser ? '수정 완료' : '계정 발급하기'}</span>
            </button>
          </div>
        }
      >
        <form id="account-dialog-form" className="account-dialog-form" onSubmit={handleSubmit}>
          {!editingUser && (
            <div className="account-policy-alert">
              <Info size={18} className="alert-icon" />
              <div className="alert-content">
                <strong>초기 비밀번호 안내</strong>
                <p>계정 생성 시 입력한 <strong>전화번호</strong>가 초기 비밀번호로 자동 설정됩니다.</p>
              </div>
            </div>
          )}

          <div className="form-field">
            <label>아이디 <span className="req">*</span></label>
            <input
              type="text"
              placeholder="예: worker_kim01"
              required
              disabled={!!editingUser}
              value={formData.userId}
              onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label>사용자 이름 <span className="req">*</span></label>
            <input
              type="text"
              placeholder="예: 홍길동"
              required
              value={formData.userName}
              onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label>전화번호 <span className="req">*</span></label>
            <input
              type="text"
              placeholder="예: 010-1234-5678"
              required
              value={formData.phoneNum}
              onChange={e => setFormData(prev => ({ ...prev, phoneNum: e.target.value }))}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label>성별</label>
              <CustomSelect
                fullWidth
                sizeVariant="lg"
                value={formData.gender}
                onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
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
                value={formData.birthday}
                onChange={e => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-field">
            <label>우편번호</label>
            <input
              type="text"
              placeholder="예: 06544"
              value={formData.postalCode}
              onChange={e => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label>상세 주소</label>
            <input
              type="text"
              placeholder="예: 서울시 서초구 신반포로 100 관리동 2층"
              value={formData.detailAddress}
              onChange={e => setFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
            />
          </div>
        </form>
      </SlideDialog>

      {/* ── SLIDE DIALOG: USER DETAIL ── */}
      <SlideDialog
        isOpen={isDetailOpen && !!selectedUser}
        onClose={() => setIsDetailOpen(false)}
        title="계정 상세 정보"
        className="manage-page user-detail-dialog"
        footer={
          selectedUser ? (
            <div className="detail-btn-row">
              <button
                type="button"
                className="btn-edit-modal"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEdit(selectedUser);
                }}
              >
                <span>계정 정보 수정</span>
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedUser && (
          <div className="account-detail-modal">
            <div className="account-profile-header">
              <div className="avatar-huge">
                {selectedUser.userName.charAt(0)}
              </div>
              <div className="profile-texts">
                <h3>{selectedUser.userName}</h3>
                <span className="id-tag">아이디: {selectedUser.userId}</span>
              </div>
            </div>

            {/* ── Tabs Bar: 기본 정보 / 작업 실적 및 이력 ── */}
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
                className={`detail-tab-btn ${detailTab === 'performance' ? 'active' : ''}`}
                onClick={() => setDetailTab('performance')}
              >
                <span>작업 실적 및 이력</span>
                <span className="tab-count-badge">{userReports.length}건</span>
              </button>
            </div>

            {detailTab === 'profile' ? (
              <>
                <div className="info-card-section">
                  <h5 className="section-head">기본 정보</h5>
                  <div className="info-grid-list">
                    <div className="info-row">
                      <span className="row-key">전화번호</span>
                      <span className="row-val font-semibold">{selectedUser.phoneNum}</span>
                    </div>
                    <div className="info-row">
                      <span className="row-key">성별</span>
                      <span className="row-val">
                        {selectedUser.gender === 'M' ? '남성' : selectedUser.gender === 'F' ? '여성' : '미지정'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="row-key">생년월일</span>
                      <span className="row-val">{selectedUser.birthday || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="row-key">우편번호</span>
                      <span className="row-val">{selectedUser.postalCode || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="row-key">상세 주소</span>
                      <span className="row-val">{selectedUser.detailAddress || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="row-key">계정 생성일</span>
                      <span className="row-val">
                        {dayjs(selectedUser.createTime).format('YYYY년 MM월 DD일 HH:mm')}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="row-key">최근 정보 수정일</span>
                      <span className="row-val">
                        {dayjs(selectedUser.lastUpdated).format('YYYY년 MM월 DD일 HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Reset Action Box */}
                <div className="pw-reset-alert-box">
                  <div className="pw-reset-desc">
                    <strong>비밀번호 초기화</strong>
                    <p>비밀번호 분실 시 해당 유저의 <strong>전화번호({selectedUser.phoneNum})</strong>로 즉시 초기화됩니다.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-pw-action"
                    onClick={() => handleResetPassword(selectedUser)}
                  >
                    <KeyRound size={15} />
                    <span>초기화</span>
                  </button>
                </div>
              </>
            ) : (
              /* ── TAB 2: PERFORMANCE & HISTORY ── */
              <div className="performance-tab-content">
                {/* ── 1. SEARCH BAR & SORT / RESET ── */}
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
                    title="정렬 순서 변경"
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

                {/* ── 2. FILTER CONTROLS (포탈 작업 이력 조회 스타일) ── */}
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

                {/* 작업 내역 테이블 */}
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
                          <tr key={report.reportId}>
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
                              ? `[${selectedUser.userName}] 작업자의 등록된 작업 보고서가 없습니다.`
                              : '선택하신 기간 내의 작업 보고서가 없습니다.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </SlideDialog>
    </div>
  );
}
