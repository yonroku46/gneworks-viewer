'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SlideDialog from '@/components/dialog/SlideDialog';
import AccountDetailDialog from '@/components/dialog/AccountDetailDialog';
import CustomSelect from '@/components/common/CustomSelect';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import { getStoredReports } from '@/data/reportStorage';
import { getStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
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
  X,
  Settings,
} from 'lucide-react';
import { INITIAL_USERS_DATA } from '@/data/userData';
import { getStoredUsers, saveStoredUsers, subscribeToUsersUpdate } from '@/data/userStorage';
import { getUserAssignedRegions, subscribeToAssignedRegionsUpdate } from '@/data/regionStorage';
import '../ManageLayout.scss';

export default function AccountManagementPage() {
  const { enqueueSnackbar } = useSnackbar();

  // 실제 등록된 사용자 데이터 (고품질 profileImg 포함, 로컬 스토리지 연동)
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') return getStoredUsers();
    return INITIAL_USERS_DATA;
  });
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [, setRegionsVersion] = useState(0);

  useEffect(() => {
    setUsers(getStoredUsers());
    const unsubUsers = subscribeToUsersUpdate(newUsers => {
      setUsers(newUsers);
    });
    setSites(getStoredSites());
    const unsubSites = subscribeToSitesUpdate(newSites => {
      setSites(newSites);
    });
    const unsubRegions = subscribeToAssignedRegionsUpdate(() => {
      setRegionsVersion(v => v + 1);
    });
    return () => {
      unsubUsers();
      unsubSites();
      unsubRegions();
    };
  }, []);

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

  // User Detail Initial Tab State
  const [detailInitialTab, setDetailInitialTab] = useState<'profile' | 'regions' | 'performance'>('performance');

  // Open User Detail Dialog Handler
  const handleOpenDetail = (user: User, initialTab: 'profile' | 'regions' | 'performance' = 'performance') => {
    setSelectedUser(user);
    setDetailInitialTab(initialTab);
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

  // Helper to count assigned regions for any user
  const getUserRegionCount = (userId: string) => {
    return getUserAssignedRegions(userId).length;
  };

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
    setSelectedUser(user);
    setFormData({
      userId: user.userId,
      userName: user.userName,
      phoneNum: user.phoneNum,
      birthday: user.birthday || '',
      gender: user.gender || 'M',
      postalCode: user.postalCode || '',
      detailAddress: user.detailAddress || '',
    });
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  // Close Form Dialog (상세 다이얼로그에서 진입했으면 복귀)
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    if (selectedUser) {
      setIsDetailOpen(true);
    }
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

    const now = dayjs().toISOString();

    if (editingUser) {
      const updatedUser: User = {
        ...editingUser,
        ...formData,
        lastUpdated: now,
      };
      const nextUsers = users.map(u => (u.userId === editingUser.userId ? updatedUser : u));
      setUsers(nextUsers);
      saveStoredUsers(nextUsers);
      setSelectedUser(updatedUser);
      setIsDetailOpen(true);
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

      const nextUsers = [newUser, ...users];
      setUsers(nextUsers);
      saveStoredUsers(nextUsers);
      enqueueSnackbar(
        `[${newUser.userName}] 계정이 발급되었습니다. 초기 비밀번호는 전화번호(${newUser.phoneNum})입니다.`,
        { variant: 'success', autoHideDuration: 4000 }
      );
    }

    setIsFormOpen(false);
    setEditingUser(null);
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
    const nextUsers = users.filter(u => u.userId !== user.userId);
    setUsers(nextUsers);
    saveStoredUsers(nextUsers);
    setIsDetailOpen(false);
    setIsFormOpen(false);
    enqueueSnackbar(`[${user.userName}] 계정이 삭제되었습니다.`, { variant: 'success' });
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
              <th className="col-region">담당 지역</th>
              <th className="col-perf">작업 실적</th>
              <th className="col-birthday">생년월일</th>
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
                        {user.profileImg ? (
                          <img src={user.profileImg} alt={user.userName} className="user-avatar-mini-img" />
                        ) : (
                          user.userName.charAt(0)
                        )}
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
                  <td className="col-region">
                    {(() => {
                      const count = getUserRegionCount(user.userId);
                      return (
                        <button
                          type="button"
                          className={`btn-user-region-pill ${count === 0 ? 'empty' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(user, 'regions');
                          }}
                          title="클릭 시 담당 지역 관리 확인 및 설정"
                        >
                          <MapPin size={12} />
                          <span>{count > 0 ? `${count}곳` : '0곳'}</span>
                        </button>
                      );
                    })()}
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
                  <td className="col-birthday">
                    <span>{user.birthday || '—'}</span>
                  </td>
                  <td className="col-created">
                    <span className="date-text">{dayjs(user.createTime).format('YYYY.MM.DD')}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="empty-table-cell">
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
        onClose={handleCloseForm}
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
              <button type="button" className="btn-cancel" onClick={handleCloseForm}>
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

      {/* ── ACCOUNT DETAIL DIALOG (통합 컴포넌트) ── */}
      <AccountDetailDialog
        isOpen={isDetailOpen && !!selectedUser}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        reports={allReports}
        sites={sites}
        initialTab={detailInitialTab}
        showEditButton
        showDeleteButton
        onEditUser={(u) => handleOpenEdit(u)}
        onDeleteUser={(u) => handleDeleteUser(u)}
        onResetPassword={(u) => handleResetPassword(u)}
      />
    </div>
  );
}
