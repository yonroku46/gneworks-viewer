'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppImage from '@/components/contents/AppImage';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, servicePrefix } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';
import { LayoutDashboard, ClipboardCheck, Building2, MessageSquare, ShieldCheck, Settings, LogOut, Bell, Menu, X } from 'lucide-react';
import { ManageRegionProvider } from '@/providers/ManageRegionProvider';
import './ManageLayout.scss';

function ManageLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user && !user.mngFlg) {
      enqueueSnackbar('관리자 권한이 없습니다. 작업 포탈로 이동합니다.', {
        variant: 'warning',
        preventDuplicate: true,
      });
      router.replace(servicePrefix);
    }
  }, [user, isLoading, router, enqueueSnackbar]);

  if (isLoading || !user || !user.mngFlg) {
    return null;
  }

  const menuGroups: MenuGroup[] = [
    {
      groupTitle: '개요',
      items: [
        { label: '대시보드', href: '/manage/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: '업무관리',
      items: [
        { label: '보고서 관리', href: '/manage/work', icon: ClipboardCheck },
        { label: '문의 관리', href: '/manage/inquiries', icon: MessageSquare },
      ],
    },
    {
      groupTitle: '데이터',
      items: [
        { label: '현장 리스트', href: '/manage/sites', icon: Building2 },
        { label: '계정 발급/관리', href: '/manage/users', icon: ShieldCheck },
      ],
    },
    {
      groupTitle: '시스템',
      items: [
        { label: '설정', href: '/manage/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="manage-layout">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="manage-sidebar">
        <div className="sidebar-brand">
          <Link href="/" className="brand-logo">
            <Image src="/assets/icons/logo-wide.svg" alt="GNEWorks" width={34} height={34} />
          </Link>
        </div>

        {/* Sidebar Nav Menu */}
        <nav className="sidebar-nav">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="nav-group">
              {group.groupTitle && (
                <span className="nav-group-title">{group.groupTitle}</span>
              )}
              <div className="nav-group-items">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        {user && (
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">
                {user.profileImg ? (
                  <AppImage src={user.profileImg} alt={user.userName} width={32} height={32} />
                ) : (
                  <span className="avatar-initial">{user.userName.charAt(0)}</span>
                )}
              </div>
              <div className="user-meta">
                <span className="name">{user.userName}</span>
                <span className="name-sub">{user.userId}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="로그아웃">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="manage-main-wrapper">
        {/* Responsive Top Header */}
        <header className="manage-top-header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="manage-viewport">
          {children}
        </main>
      </div>

      {/* ── MOBILE MENU OVERLAY (Drawer) ── */}
      <div className={`manage-mobile-menu-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="drawer-inner">
          <div className="drawer-header">
            <span className="drawer-title">메뉴</span>
            <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="drawer-nav">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="drawer-group">
                {group.groupTitle && (
                  <span className="drawer-group-title">{group.groupTitle}</span>
                )}
                <div className="drawer-group-items">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`drawer-link ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {user && (
            <div className="drawer-footer">
              <div className="user-info">
                <div className="avatar">
                  {user.profileImg ? (
                    <AppImage src={user.profileImg} alt={user.userName} width={36} height={36} />
                  ) : (
                    <span>{user.userName.charAt(0)}</span>
                  )}
                </div>
                <div className="meta">
                  <div className="name">{user.userName}님</div>
                  <div className="name-sub">{user.userId}</div>
                </div>
              </div>
              <button 
                className="drawer-logout-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div 
        className={`manage-mobile-drawer-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

export default function ManageLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ManageRegionProvider>
      <ManageLayoutInner>{children}</ManageLayoutInner>
    </ManageRegionProvider>
  );
}