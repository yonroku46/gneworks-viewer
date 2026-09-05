'use client';

import React, { useState, useEffect } from 'react';
import SlideDialog from '@/components/dialog/SlideDialog';
import AccountDetailDialog from '@/components/dialog/AccountDetailDialog';
import UserAvatar from '@/components/common/UserAvatar';
import CustomSelect from '@/components/common/CustomSelect';
import SearchInput from '@/components/common/SearchInput';
import { getStoredReports } from '@/data/reportStorage';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import {
  Plus,
  User as UserIcon,
  Info,
  MapPin,
  FileText,
} from 'lucide-react';
import TableLoadingRow from '@/components/common/TableLoadingRow';
import AdminService from '@/api/service/AdminService';
import '../ManageLayout.scss';

export default function AccountManagementPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sites, setSites] = useState<SiteDetail[]>([]);
  const [userRegionCounts, setUserRegionCounts] = useState<Record<string, number>>({});

  // 백엔드 API에서 현장 목록 불러오기
  const loadSites = async () => {
    try {
      const siteList = await AdminService.getSiteList();
      setSites(siteList || []);
    } catch (err) {
      console.error('[Admin] loadSites error:', err);
    }
  };

  // 백엔드 API에서 유저 목록 및 담당 지역 개수 불러오기
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const serverUsers = await AdminService.getUserList();
      setUsers(serverUsers || []);
      // 각 유저의 실제 배정 관할도 서버 API로부터 비동기 로드하여 즉각 상태 반영
      if (serverUsers && serverUsers.length > 0) {
        const counts: Record<string, number> = {};
        await Promise.all(
          serverUsers.map(async (u) => {
            try {
              const uRegions = await AdminService.getUserAssignedRegions(u.userId);
              counts[u.userId] = uRegions ? uRegions.length : 0;
            } catch {
              counts[u.userId] = 0;
            }
          })
        );
        setUserRegionCounts(counts);
      }
    } catch (error: any) {
      console.error('[Admin] loadUsers error:', error);
      enqueueSnackbar('계정 목록을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 특정 작업자의 담당 지역 변경 시 즉시 카운트 갱신 및 전체 목록 리프레시
  const handleRegionsUpdated = async () => {
    if (selectedUser?.userId) {
      try {
        const uRegions = await AdminService.getUserAssignedRegions(selectedUser.userId);
        setUserRegionCounts(prev => ({
          ...prev,
          [selectedUser.userId]: uRegions ? uRegions.length : 0,
        }));
      } catch (err) {
        console.error('[Admin] handleRegionsUpdated error:', err);
      }
    }
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
    loadSites();
  }, []);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User>();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

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

  // Helper to count assigned regions for any user (API 기반 실시간 state)
  const getUserRegionCount = (userId: string) => {
    return userRegionCounts[userId] ?? 0;
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
    setEditingUser(undefined);
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
    setEditingUser(undefined);
    if (selectedUser) {
      setIsDetailOpen(true);
    }
  };


  // Submit Handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
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
        enqueueSnackbar('계정 수정에 실패했습니다. 다시 시도해 주세요.', { variant: 'error' });
        return;
      }

      const nextUsers = users.map(u => (u.userId === editingUser.userId ? updatedUser : u));
      setUsers(nextUsers);
      setSelectedUser(updatedUser);
      setIsDetailOpen(true);
      enqueueSnackbar(`[${formData.userName}] 계정 정보가 수정되었습니다.`, { variant: 'success' });
      loadUsers();
    } else {
      // Check duplicate ID
      if (users.some(u => u.userId === formData.userId.trim())) {
        enqueueSnackbar('이미 등록된 아이디입니다.', { variant: 'error' });
        return;
      }

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

      try {
        await AdminService.createUser({
          userId: newUser.userId,
          userName: newUser.userName,
          phoneNum: newUser.phoneNum,
          birthday: newUser.birthday,
          gender: newUser.gender,
          postalCode: newUser.postalCode,
          detailAddress: newUser.detailAddress,
        });
      } catch (err: any) {
        enqueueSnackbar('계정 발급에 실패했습니다. 입력값을 확인해 주세요.', { variant: 'error' });
        return;
      }

      const cleanPhone = newUser.phoneNum.replace(/[^0-9]/g, '');
      setUsers(prev => [newUser, ...prev]);
      enqueueSnackbar(
        `[${newUser.userName}] 계정이 발급되었습니다. 초기 비밀번호는 하이픈 없는 전화번호(${cleanPhone})입니다.`,
        { variant: 'success', autoHideDuration: 4000 }
      );
      loadUsers();
    }

    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  // Reset Password Handler
  const handleResetPassword = async (user: User) => {
    const cleanPhone = user.phoneNum.replace(/[^0-9]/g, '');
    if (
      confirm(
        `[${user.userName}] 님의 비밀번호를 초기화하시겠습니까?\n\n초기화 시 비밀번호는 하이픈을 뺀 전화번호(${cleanPhone})로 변경됩니다.`
      )
    ) {
      try {
        await AdminService.resetPassword(user.userId);
        enqueueSnackbar(
          `[${user.userName}] 님의 비밀번호가 하이픈 없는 전화번호(${cleanPhone})로 초기화되었습니다.`,
          { variant: 'success', autoHideDuration: 5000 }
        );
      } catch (err: any) {
        enqueueSnackbar('비밀번호 초기화에 실패했습니다. 다시 시도해 주세요.', { variant: 'error' });
      }
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (user: User) => {
    try {
      await AdminService.deleteUser(user.userId);
    } catch (err: any) {
      enqueueSnackbar('계정 삭제에 실패했습니다. 다시 시도해 주세요.', { variant: 'error' });
      return;
    }

    setUsers(prev => prev.filter(u => u.userId !== user.userId));
    setIsDetailOpen(false);
    setIsFormOpen(false);
    enqueueSnackbar(`[${user.userName}] 계정이 삭제되었습니다.`, { variant: 'success' });
    loadUsers();
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
            {isLoading ? (
              <TableLoadingRow colSpan={8} message="계정 목록을 불러오는 중입니다..." />
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr 
                  key={user.userId || `user_${idx}`} 
                  className="account-table-row"
                  onClick={() => handleOpenDetail(user, 'profile')}
                >
                  <td className="col-num">
                    <span className="row-index">{idx + 1}</span>
                  </td>
                  <td className="col-user">
                    <div className="user-cell">
                      <UserAvatar 
                        src={user.profileImg} 
                        name={user.userName} 
                        size="md" 
                      />
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
              <tr key="empty-users">
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
                <p>계정 생성 시 입력한 전화번호에서 <strong>하이픈(-)을 뺀 숫자</strong>가 초기 비밀번호로 자동 설정됩니다.</p>
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
          setSelectedUser(undefined);
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
        onRegionsUpdated={handleRegionsUpdated}
      />
    </div>
  );
}
