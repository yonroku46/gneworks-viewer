"use client";

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import {
  ClipboardList,
  Camera,
  CheckCircle2,
  FileText,
  Users,
  ShieldCheck,
  ArrowRight,
  Headphones,
  Layers
} from 'lucide-react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import "./Landing.scss";

const FEATURES = [
  {
    icon: <ClipboardList size={24} />,
    title: '스마트 작업 지시 & 배정',
    desc: '현장 위치와 작업 일정에 맞춰 담당 작업자를 지정하고 상세 지시 사항을 즉시 배정합니다.',
  },
  {
    icon: <Camera size={24} />,
    title: '현장 사진 간편 업로드',
    desc: '모바일과 PC 어디서나 작업 전·후 사진을 등록하여 생생하고 신뢰도 높은 현장 보고를 수행합니다.',
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: '실시간 진행 & 완료 보고',
    desc: '작업 진행 현황과 현장 특이사항을 실시간으로 확인하여 지연 없는 신속한 소통이 가능합니다.',
  },
  {
    icon: <FileText size={24} />,
    title: '보고서 자동 문서화',
    desc: '등록된 현장 사진과 작업 데이터를 규격화된 업무 문서로 자동 변환하여 영구 보존합니다.',
  },
  {
    icon: <Users size={24} />,
    title: '작업자 및 권한 관리',
    desc: '계정을 발급하고 관리자와 작업자 역할별 접근 권한을 체계적으로 통제합니다.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: '사내 업무 데이터 보안',
    desc: '현장 사진 및 도면, 작업 이력을 암호화된 안전한 사내 스토리지에 안전하게 보관합니다.',
  },
];

const STEPS = [
  { num: '01', title: '작업 지시 및 배정', desc: '관리자가 현장 정보와 작업 내용을 등록하고 담당 작업자를 배정합니다.' },
  { num: '02', title: '현장 수행 및 사진 보고', desc: '작업자가 배정 내역을 확인하고 현장에서 작업 사진과 보고 내용을 등록합니다.' },
  { num: '03', title: '검수 및 자동 문서화', desc: '관리자 승인 후 작업 이력과 보고서가 시스템에 안전하게 문서화됩니다.' },
];

const STATS = [
  { label: '오늘 배정 작업', value: '24건', fill: '80%' },
  { label: '현장 진행 중', value: '18건', fill: '60%' },
  { label: '보고 완료율', value: '92%', fill: '92%' },
];

const NAV_ITEMS = ['작업 배정 현황', '현장 보고 목록', '작업자 관리', '문서 보관함'];

export default function LandingPage() {
  const { user } = useAuth();

  const ctaHref = user ? (user.mngFlg ? '/manage/dashboard' : '/portal') : '/login';
  const ctaLabel = user ? (user.mngFlg ? '관리자 대시보드' : '작업 포탈 바로가기') : '시스템 로그인';

  return (
    <div className="landing-page">
      <LandingNav />

      {/* ── HERO ── */}
      <section className="landing-hero">
        <h1 className="landing-hero-title">
          현장 작업 지시부터<br />
          사진 보고 및 문서화까지<br />
          <em className="landing-hero-title-em">GNEWorks</em>
        </h1>
        <p className="landing-hero-sub">
          현장과 관리 업무를 하나의 통합 웹 포탈로 연결합니다
        </p>
        <div className="landing-hero-actions">
          <Link href={ctaHref} className="landing-hero-btn-primary">
            {ctaLabel} <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="landing-hero-btn-secondary">
            <Headphones size={16} /> 시스템 지원 문의
          </Link>
        </div>
      </section>

      {/* ── APP MOCKUP ── */}
      <div className="landing-mockup">
        <div className="landing-mockup-window">
          <div className="landing-mockup-bar">
            <div className="landing-mockup-dot" />
            <div className="landing-mockup-dot" />
            <div className="landing-mockup-dot" />
            <div className="landing-mockup-url">gneworks.com/portal</div>
          </div>
          <div className="landing-mockup-body">
            <div className="landing-mock-sidebar">
              <div className="landing-mock-logo">
                <div className="landing-mock-logo-icon" />
                GNEWorks
              </div>
              {NAV_ITEMS.map((item, i) => (
                <div key={i} className={`landing-mock-nav-item${i === 0 ? ' active' : ''}`}>
                  <div className="landing-mock-nav-icon" />
                  {item}
                </div>
              ))}
            </div>
            <div className="landing-mock-content">
              <div className="landing-mock-header">
                <div>
                  <div className="landing-mock-title">현장 운영 대시보드</div>
                  <div className="landing-mock-subtitle">오늘의 작업 배정 및 현장 보고 현황</div>
                </div>
                <div className="landing-mock-action-btn" />
              </div>
              <div className="landing-mock-stats">
                {STATS.map((s, i) => (
                  <div key={i} className="landing-stat-card">
                    <div className="landing-stat-label">{s.label}</div>
                    <div className="landing-stat-value">{s.value}</div>
                    <div className="landing-stat-bar">
                      <div className="landing-stat-bar-fill" style={{ width: s.fill }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="landing-mock-table">
                {[
                  { color: '#6366f1' },
                  { color: '#8b5cf6' },
                  { color: '#06b6d4' },
                ].map((row, i) => (
                  <div key={i} className="landing-mock-row">
                    <div className="landing-mock-row-avatar" style={{ background: row.color }} />
                    <div className="landing-mock-row-info">
                      <div className="landing-mock-row-name" />
                      <div className="landing-mock-row-sub" />
                    </div>
                    <div className="landing-mock-row-badge" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="landing-features">
        <div className="landing-features-header">
          <p className="landing-features-eyebrow">핵심 기능</p>
          <h2 className="landing-features-title">현장과 관리 업무의 일원화</h2>
          <p className="landing-features-subtitle">수작업 서류 작성을 없애고 체계적인 디지털 문서화를 지원합니다.</p>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-how">
        <div className="landing-how-inner">
          <p className="landing-how-eyebrow">업무 프로세스</p>
          <h2 className="landing-how-title">3단계로 완성되는 현장 문서화</h2>
          <div className="landing-how-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="landing-how-step">
                <div className="landing-step-num">{s.num}</div>
                <h4 className="landing-step-title">{s.title}</h4>
                <p className="landing-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="landing-cta">
        <div className="landing-cta-box">
          <h2 className="landing-cta-title">현장과 사무실을 스마트하게 연결하세요</h2>
          <p className="landing-cta-sub">발급받은 사내 계정으로 로그인하여 업무를 시작할 수 있습니다.</p>
          <Link href={ctaHref} className="landing-cta-btn">
            {ctaLabel} <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
