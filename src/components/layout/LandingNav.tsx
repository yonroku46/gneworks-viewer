"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppImage from '@/components/contents/AppImage';
import { useAuth } from '@/providers/AuthProvider';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import './LandingNav.scss';

export default function LandingNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-nav-bar">
        <div className="landing-nav-inner">
          <div className="landing-nav-left">
            <Link href="/" className="landing-nav-logo">
              <Image src="/assets/icons/logo-wide.svg" alt="GNEWorks" width={34} height={34} />
            </Link>
          </div>

          <div className="landing-nav-right">
            <div className="landing-nav-auth-links">
              {!mounted ? (
                <div className="landing-nav-profile-skeleton">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-name" />
                </div>
              ) : user ? (
                <div className="landing-nav-profile-container" ref={dropdownRef}>
                  <button 
                    className="landing-nav-profile-trigger"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="profile-avatar">
                      {user.profileImg ? (
                        <AppImage 
                          src={user.profileImg} 
                          alt={user.userName} 
                          width={32} 
                          height={32} 
                          className="profile-avatar-img"
                        />
                      ) : (
                        <span className="profile-initial">{user.userName.charAt(0)}</span>
                      )}
                    </div>
                    <span className="profile-name">{user.userName}님</span>
                    <ChevronDown size={14} className={`profile-chevron ${isDropdownOpen ? 'open' : ''}`} />
                  </button>

                  <div className={`landing-nav-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                    <div className="dropdown-header">
                      <span className="dropdown-user-name">{user.userName}님</span>
                      <span className="dropdown-user-name-sub">{user.userId}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-menu">
                      <Link 
                        href={user.mngFlg ? "/manage/dashboard" : "/portal"} 
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>{user.mngFlg ? "관리 대시보드" : "작업 포탈"}</span>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }} 
                        className="dropdown-item logout"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="landing-nav-cta">로그인</Link>
              )}
            </div>

            <button 
              className="landing-nav-mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`landing-nav-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="landing-nav-mobile-inner">
          <div className="landing-nav-mobile-links">
            <Link 
              href="/pricing" 
              className={`landing-nav-mobile-link ${isActive('/pricing') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              요금제
            </Link>
            <Link 
              href="/contact" 
              className={`landing-nav-mobile-link ${isActive('/contact') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              문의하기
            </Link>
          </div>
          
          <div className="landing-nav-mobile-auth">
            {!mounted ? (
              <div className="landing-nav-mobile-card-skeleton">
                <div className="mobile-user-info-skeleton">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-meta">
                    <div className="skeleton-name" />
                    <div className="skeleton-email" />
                  </div>
                </div>
                <div className="mobile-user-actions-skeleton">
                  <div className="skeleton-btn" />
                  <div className="skeleton-btn-logout" />
                </div>
              </div>
            ) : user ? (
              <div className="landing-nav-mobile-user-card">
                <div className="mobile-user-info">
                  <div className="profile-avatar">
                    {user.profileImg ? (
                      <AppImage 
                        src={user.profileImg} 
                        alt={user.userName} 
                        width={40} 
                        height={40} 
                        className="profile-avatar-img"
                      />
                    ) : (
                      <span className="profile-initial">{user.userName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="profile-meta">
                    <span className="profile-name">{user.userName}님</span>
                    <span className="profile-name-sub">{user.userId}</span>
                  </div>
                </div>
                
                <div className="mobile-user-actions">
                  <div className="mobile-cta-group">
                    <Link 
                      href={user.mngFlg ? "/manage/dashboard" : "/portal"} 
                      className="landing-nav-mobile-cta primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      <span>{user.mngFlg ? "관리 대시보드" : "작업 포탈"}</span>
                    </Link>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }} 
                    className="mobile-logout-btn"
                  >
                    <LogOut size={16} />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="landing-nav-mobile-cta"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인 / 시작하기
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`landing-nav-mobile-backdrop ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
    </nav>
  );
}
