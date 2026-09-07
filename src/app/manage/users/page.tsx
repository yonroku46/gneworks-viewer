'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SlideDialog from '@/components/dialog/SlideDialog';
import AccountDetailDialog from '@/components/dialog/AccountDetailDialog';
import UserAvatar from '@/components/common/UserAvatar';
import CustomSelect from '@/components/common/CustomSelect';
import SearchInput from '@/components/common/SearchInput';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import {
  Plus,
  User as UserIcon,
  Info,
  MapPin,
  FileText,
  Search,
} from 'lucide-react';
import { useDaumPostcodePopup, Address } from 'react-daum-postcode';
import AdminService from '@/api/service/AdminService';
import { formatPhoneNumber } from '@/utils/formatUtils';
import '../ManageLayout.scss';

export default function AccountManagementPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCustomId, setIsCustomId] = useState(false);
  const [editingUser, setEditingUser] = useState<User>();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  // Master Reports & Sites Data for Work Performance Tab (상세 팝업용)
  const [allReports, setAllReports] = useState<WorkReport[]>([]);
  const [allSites, setAllSites] = useState<SiteDetail[]>([]);

  // 서버 페이징 기반 계정 목록 조회
  const loadUsers = useCallback(async (targetPage = page, targetSize = pageSize, query = searchQuery) => {
    setIsLoading(true);
    try {
      const res = await AdminService.getUserListPaged({
        page: targetPage,
        size: targetSize,
        query: query.trim() || undefined,
      });
      setUsers(res.list || []);
      setTotalCount(res.totalCount || 0);
    } catch (error: any) {
      console.error('[Admin] loadUsers error:', error);
      enqueueSnackbar('계정 목록을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
      setUsers([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, enqueueSnackbar]);

  useEffect(() => {
    loadUsers(page, pageSize, searchQuery);
  }, [page, pageSize]);

  // 검색어 변경 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadUsers(1, pageSize, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 엑셀 다운로드 핸들러
  const handleExportExcel = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await AdminService.exportUsersExcel({
        query: searchQuery.trim() || undefined,
      });
      enqueueSnackbar('계정 목록 엑셀 파일이 다운로드되었습니다.', { variant: 'success' });
    } catch (error: any) {
      console.error('[Admin] exportUsersExcel error:', error);
      enqueueSnackbar('엑셀 다운로드 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const loadReports = async () => {
    try {
      const reportList = await AdminService.getReportList();
      setAllReports(reportList || []);
    } catch (err) {
      console.error('[Admin] loadReports error:', err);
    }
  };

  const loadSites = async () => {
    try {
      const siteRes = await AdminService.getSiteList();
      setAllSites(siteRes.list || []);
    } catch (err) {
      console.error('[Admin] loadSites error:', err);
    }
  };

  // 특정 작업자의 담당 지역 변경 시 즉시 카운트 갱신 및 전체 목록 리프레시
  const handleRegionsUpdated = async () => {
    loadUsers(page, pageSize, searchQuery);
  };

  // User Detail Initial Tab State
  const [detailInitialTab, setDetailInitialTab] = useState<'profile' | 'regions' | 'performance'>('performance');

  // Open User Detail Dialog Handler
  const handleOpenDetail = (user: User, initialTab: 'profile' | 'regions' | 'performance' = 'performance') => {
    setSelectedUser(user);
    setDetailInitialTab(initialTab);
    loadReports();
    loadSites();
    setIsDetailOpen(true);
  };

  // Get regions assigned to selected user
  const selectedUserRegions = useMemo(() => {
    if (!selectedUser) return [];
    return [];
  }, [selectedUser]);

  // Form State for Create/Edit User
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

  // Daum Postcode Popup
  const openPostcode = useDaumPostcodePopup();

  const handleCompletePostcode = (data: Address) => {
    let fullAddress = data.roadAddress || data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFormData(prev => ({
      ...prev,
      postalCode: data.zonecode || '',
      detailAddress: fullAddress,
    }));
  };

  const handleSearchAddress = () => {
    openPostcode({ onComplete: handleCompletePostcode });
  };

  // Open Create Dialog
  const handleOpenAdd = () => {
    setEditingUser(undefined);
    setIsCustomId(false);
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
    setIsCustomId(false);
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
    setIsCustomId(false);
    if (selectedUser) {
      setIsDetailOpen(true);
    }
  };


  // Submit Handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetUserId = editingUser 
      ? editingUser.userId 
      : (isCustomId && formData.userId.trim() ? formData.userId.trim() : formData.phoneNum.replace(/[^0-9]/g, ''));

    if (!targetUserId) {
      enqueueSnackbar('전화번호를 입력하거나 아이디를 직접 입력해 주세요.', { variant: 'error' });
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
    if (!formData.birthday) {
      enqueueSnackbar('생년월일을 입력해 주세요. (초기 비밀번호로 사용됩니다)', { variant: 'error' });
      return;
    }

    const now = dayjs().toISOString();

    if (editingUser) {
      const updatedUser: User = {
        ...editingUser,
        userName: formData.userName.trim(),
        phoneNum: formData.phoneNum.trim(),
        birthday: formData.birthday || undefined,
        gender: formData.gender || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        detailAddress: formData.detailAddress.trim() || undefined,
        userId: editingUser.userId,
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
        enqueueSnackbar('계정 정보 수정에 실패했습니다.', { variant: 'error' });
        return;
      }

      setUsers(prev => prev.map(u => (u.userId === editingUser.userId ? updatedUser : u)));
      enqueueSnackbar(`[${formData.userName}] 계정 정보가 수정되었습니다.`, { variant: 'success' });
      loadUsers();
    } else {
      const formattedPhone = formatPhoneNumber(formData.phoneNum.trim());
      if (!editingUser && users.some(u => u.userId === targetUserId)) {
        enqueueSnackbar('이미 등록된 아이디(또는 전화번호)입니다.', { variant: 'error' });
        return;
      }

      const newUser: User = {
        userId: targetUserId,
        userName: formData.userName.trim(),
        phoneNum: formattedPhone,
        birthday: formData.birthday || undefined,
        gender: formData.gender || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        detailAddress: formData.detailAddress.trim() || undefined,
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

      const birthPw = dayjs(newUser.birthday).format('YYMMDD');
      const pwInfo = `생년월일 6자리(${birthPw})`;

      setUsers(prev => [newUser, ...prev]);
      enqueueSnackbar(
        `[${newUser.userName}] 계정이 발급되었습니다. (아이디: ${newUser.userId} / 초기 비밀번호: ${pwInfo})`,
        { variant: 'success', autoHideDuration: 5000 }
      );
      loadUsers();
    }

    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  // Reset Password Handler
  const handleResetPassword = async (user: User) => {
    if (!user.birthday) {
      enqueueSnackbar('생년월일이 등록되지 않은 계정은 비밀번호를 초기화할 수 없습니다.', { variant: 'error' });
      return;
    }
    const birthPw = dayjs(user.birthday).format('YYMMDD');
    const pwDesc = `생년월일 6자리(${birthPw})`;

    if (
      confirm(
        `[${user.userName}] 님의 비밀번호를 초기화하시겠습니까?\n초기화 비밀번호: ${pwDesc}`
      )
    ) {
      try {
        await AdminService.resetPassword(user.userId);
        enqueueSnackbar(
          `[${user.userName}] 님의 비밀번호가 초기화되었습니다. (초기화 비밀번호: ${pwDesc})`,
          { variant: 'success', autoHideDuration: 5000 }
        );
      } catch (err: any) {
        enqueueSnackbar('비밀번호 초기화에 실패했습니다.', { variant: 'error' });
      }
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (user: User) => {
    try {
      await AdminService.deleteUser(user.userId);
    } catch (err: any) {
      enqueueSnackbar('계정 삭제에 실패했습니다.', { variant: 'error' });
      return;
    }

    setUsers(prev => prev.filter(u => u.userId !== user.userId));
    setIsDetailOpen(false);
    setIsFormOpen(false);
    enqueueSnackbar(`[${user.userName}] 계정이 삭제되었습니다.`, { variant: 'success' });
    loadUsers();
  };

  // Table Columns
  const columns: ColumnDef<User>[] = useMemo(() => [
    {
      key: 'num',
      header: '순번',
      className: 'col-num',
      render: (_, index) => (
        <span className="row-index">{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      key: 'user',
      header: '사용자명',
      className: 'col-user',
      render: (user) => (
        <div className="user-cell">
          <UserAvatar 
            src={user.profileImg} 
            name={user.userName} 
            size="md" 
          />
          <span className="user-name-text">{user.userName}</span>
        </div>
      ),
    },
    {
      key: 'userId',
      header: '아이디',
      className: 'col-id',
      render: (user) => <span className="user-id-code">{user.userId}</span>,
    },
    {
      key: 'phoneNum',
      header: '전화번호',
      className: 'col-phone',
      render: (user) => <span className="user-phone-cell">{user.phoneNum}</span>,
    },
    {
      key: 'regionCount',
      header: '담당 지역',
      className: 'col-region',
      render: (user) => {
        const count = user.regionCount ?? 0;
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
      },
    },
    {
      key: 'reportCount',
      header: '작업 실적',
      className: 'col-perf',
      render: (user) => {
        const count = user.reportCount ?? 0;
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
      },
    },
    {
      key: 'birthday',
      header: '생년월일',
      className: 'col-birthday',
      render: (user) => <span>{user.birthday || '—'}</span>,
    },
    {
      key: 'createTime',
      header: '등록일',
      className: 'col-created',
      render: (user) => (
        <span className="date-text">{user.createTime ? dayjs(user.createTime).format('YYYY.MM.DD') : '—'}</span>
      ),
    },
  ], [page, pageSize]);

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

      {/* ── DATA TABLE ── */}
      <DataTable<User>
        columns={columns}
        data={users}
        rowKey={(user, idx) => user.userId || `user_${idx}`}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[30, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        isLoading={isLoading}
        loadingMessage="계정 목록을 불러오는 중입니다..."
        emptyMessage="일치하는 계정 정보가 존재하지 않습니다."
        onRowClick={(user) => handleOpenDetail(user, 'profile')}
        excelAction={{
          onExport: handleExportExcel,
          isExporting,
        }}
      />

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
                <strong>계정 발급 및 초기 비밀번호 안내</strong>
                <p>
                  아이디는 <strong>하이픈 없는 전화번호</strong>로 자동 생성되며, 초기 비밀번호는 <strong>생년월일 6자리</strong>로 자동 설정됩니다.
                </p>
              </div>
            </div>
          )}

          {editingUser ? (
            <div className="form-field">
              <label>아이디</label>
              <input
                type="text"
                disabled
                value={formData.userId}
              />
            </div>
          ) : (
            <>
              <div className="custom-id-toggle-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isCustomId}
                    onChange={e => {
                      setIsCustomId(e.target.checked);
                      if (!e.target.checked) {
                        setFormData(prev => ({ ...prev, userId: '' }));
                      }
                    }}
                  />
                  <span>아이디 직접 입력</span>
                </label>
              </div>

              {isCustomId && (
                <div className="form-field">
                  <label>아이디 <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="직접 지정할 아이디를 입력하세요"
                    required
                    value={formData.userId}
                    onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                  />
                </div>
              )}
            </>
          )}

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
              onChange={e => setFormData(prev => ({ ...prev, phoneNum: formatPhoneNumber(e.target.value) }))}
            />
            {!editingUser && !isCustomId && (
              <span className="field-hint">
                로그인 아이디: <strong>{formData.phoneNum.replace(/[^0-9]/g, '') || '전화번호 입력 시 자동 지정'}</strong>
              </span>
            )}
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
              <label>생년월일 <span className="req">*</span></label>
              <input
                type="date"
                required
                value={formData.birthday}
                onChange={e => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
              />
            </div>
          </div>

          {/* 주소 검색 필드 (우편번호 검색 상단 + 도로명 주소 하단) */}
          <div className="form-field">
            <label>우편번호</label>
            <div className="address-input-group">
              <input
                type="text"
                placeholder="우편번호"
                readOnly
                value={formData.postalCode}
                onClick={handleSearchAddress}
              />
              <button
                type="button"
                className="btn-search-address"
                onClick={handleSearchAddress}
              >
                <Search size={15} />
                <span>주소 검색</span>
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>주소</label>
            <input
              type="text"
              placeholder="주소 검색 시 자동 입력되며, 상세 정보(동·호수 등)를 추가 입력할 수 있습니다"
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
        sites={allSites}
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
