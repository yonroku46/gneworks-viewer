'use client';

import React, { useState } from 'react';
import SlideDialog from '@/components/dialog/SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import SearchInput from '@/components/common/SearchInput';
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
  Phone
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

  // Open Detail View
  const handleOpenDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
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
        `[${user.userName}] 님의 비밀번호를 초기화하시겠습니까?\n\n초기화 시 비밀번호는 등록된 전화번호(${user.phoneNum})로 변경되며, 사용자가 로그인 후 재설정해야 합니다.`
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
              <th className="col-user">사용자명</th>
              <th className="col-id">아이디</th>
              <th className="col-phone">전화번호</th>
              <th className="col-gender">성별</th>
              <th className="col-birthday">생년월일</th>
              <th className="col-address">상세 주소</th>
              <th className="col-created">등록일</th>
              <th className="col-actions">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr 
                  key={user.userId} 
                  className="account-table-row"
                >
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
                  <td className="col-actions" onClick={e => e.stopPropagation()}>
                    <div className="row-action-btns">
                      <button
                        type="button"
                        className="btn-row-edit"
                        title="계정 정보 수정"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
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
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? '계정 정보 수정' : '신규 계정 발급'}
        className="manage-page"
        footer={
          <div className="dialog-btn-group">
            <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>
              취소
            </button>
            <button type="submit" form="account-dialog-form" className="btn-save">
              {editingUser ? '수정 완료' : '계정 발급하기'}
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
                <p>계정 생성 시 입력한 <strong>전화번호</strong>가 초기 비밀번호로 자동 설정됩니다. (로그인 후 비밀번호 재설정)</p>
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
                sizeVariant="md"
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
        className="manage-page"
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
                <Edit3 size={16} />
                <span>계정 정보 수정</span>
              </button>

              <button
                type="button"
                className="btn-delete-modal"
                onClick={() => handleDeleteUser(selectedUser)}
              >
                <Trash2 size={16} />
                <span>계정 삭제</span>
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
          </div>
        )}
      </SlideDialog>
    </div>
  );
}
