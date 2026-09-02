'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import './Login.scss';

export default function LoginPage() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      enqueueSnackbar('아이디와 비밀번호를 입력해주세요.', { variant: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      await login(userId, password, stayLoggedIn);
      enqueueSnackbar('로그인되었습니다.', { variant: 'success' });
    } catch (err: any) {
      if (err.message && err.message.includes('401')) {
        enqueueSnackbar('아이디 또는 비밀번호가 일치하지 않습니다.', { variant: 'error' });
      } else {
        enqueueSnackbar('로그인에 실패했습니다.', { variant: 'error' });
      }
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link href="/" className="login-brand" title="홈으로 이동">
            <Image 
              src="/assets/icons/logo-wide.svg" 
              alt="GNEWorks" 
              width={44} 
              height={44} 
              className="brand-logo-img"
              priority 
            />
            <span className="brand-name">
              <strong>GNE</strong><span className="brand-sub">Works</span>
            </span>
          </Link>
          <p className="login-sub">온라인 포탈관리시스템</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userId">아이디</label>
            <input
              id="userId"
              type="text"
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="userId"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={stayLoggedIn} 
                onChange={(e) => setStayLoggedIn(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span>로그인 상태 유지</span>
            </label>
            <Link href="/contact?type=password_reset" title="비밀번호를 분실하셨나요?" className="forgot-link">
              비밀번호 분실 문의
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
