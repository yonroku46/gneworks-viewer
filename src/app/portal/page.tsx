'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { ClipboardCheck, Camera, Calendar, Headphones, ArrowRight, Bell, Sparkles } from 'lucide-react';
import './Portal.scss';

export default function PortalPage() {
  const { user } = useAuth();
  const displayName = user?.userName || '현장 작업자';

  return (
    <div className="portal-page">
      {/* ── HERO BANNER ── */}
      <section className="portal-hero-banner">
        <div className="hero-text">
          <h1 className="hero-greeting">반갑습니다, {displayName}님!</h1>
          <p className="hero-sub">GNEWorks 현장 포탈에서 오늘 배정된 작업을 확인하고 관리하세요.</p>
        </div>
        <div className="hero-meta">
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {user?.profileImg ? (
                <img src={user.profileImg} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                displayName.charAt(0)
              )}
            </div>
            <div className="user-text-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">{user?.userId || '작업자'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SUMMARY ── */}
      <section className="portal-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <ClipboardCheck size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">진행 중 현장</span>
            <span className="stat-value">2건</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Camera size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">보고서 제출 대기</span>
            <span className="stat-value">1건</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Bell size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">새 알림</span>
            <span className="stat-value">3건</span>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <h2 className="portal-section-title">주요 업무 및 서비스</h2>
      <section className="portal-action-grid">
        <Link href="/contact?type=work_report" className="action-card">
          <div className="action-header">
            <div className="action-icon-box">
              <Camera size={20} />
            </div>
            <ArrowRight size={18} className="action-arrow" />
          </div>
          <h3 className="action-title">현장 사진 및 보고서 등록</h3>
          <p className="action-desc">시공 완료 사진 및 현장 보고서를 작성하고 전송합니다.</p>
        </Link>

        <Link href="/contact?type=inquiry" className="action-card">
          <div className="action-header">
            <div className="action-icon-box">
              <Headphones size={20} />
            </div>
            <ArrowRight size={18} className="action-arrow" />
          </div>
          <h3 className="action-title">현장 지원 및 업무 문의</h3>
          <p className="action-desc">작업 현장 관련 지원 요청이나 시스템 문의사항을 접수합니다.</p>
        </Link>

        <Link href="/contact?type=schedule" className="action-card">
          <div className="action-header">
            <div className="action-icon-box">
              <Calendar size={20} />
            </div>
            <ArrowRight size={18} className="action-arrow" />
          </div>
          <h3 className="action-title">일정 및 배정 조회</h3>
          <p className="action-desc">이번 주 예정된 배정 일정과 작업지를 확인합니다.</p>
        </Link>

        <Link href="/contact?type=general" className="action-card">
          <div className="action-header">
            <div className="action-icon-box">
              <Sparkles size={20} />
            </div>
            <ArrowRight size={18} className="action-arrow" />
          </div>
          <h3 className="action-title">공지사항 및 안내</h3>
          <p className="action-desc">사내 안전 수칙 및 최신 작업 지침 가이드를 확인합니다.</p>
        </Link>
      </section>

      {/* ── NOTICE FEED ── */}
      <section className="portal-notice-card">
        <div className="notice-header">
          <span className="notice-badge">
            <Sparkles size={12} /> 현장 안내사항
          </span>
          <span className="notice-date">2026.08.31</span>
        </div>
        <h4 className="notice-title">하절기 야외 시공 현장 안전 수칙 및 휴게시간 준수 안내</h4>
        <p className="notice-content">
          폭염 특보 발효 시 정기적인 수분 섭취와 지정 휴게시간을 반드시 준수하여 주시기 바라며, 작업 종료 후 현장 사진 보고를 누락 없이 제출해 주시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
