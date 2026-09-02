"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Clock, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import ContactService from '@/api/service/ContactService';
import { addStoredInquiry } from '@/data/inquiryStorage';
import './Contact.scss';

const INQUIRY_TYPES = [
  { value: '', label: '문의 유형을 선택해 주세요' },
  { value: 'password_reset', label: '비밀번호 분실 / 재발급 요청' },
  { value: 'account', label: '계정 신규 발급 / 권한 변경' },
  { value: 'task_report', label: '작업 배정 및 현장 보고 문의' },
  { value: 'bug', label: '시스템 오류 / 버그 신고' },
  { value: 'feature', label: '기능 개선 및 추가 제안' },
  { value: 'general', label: '기타 업무 및 시스템 문의' },
];

interface FormState {
  userName: string;
  userId: string;
  phoneNum: string;
  inquiryType: string;
  inquiryContents: string;
}

const INITIAL: FormState = { userName: '', userId: '', phoneNum: '', inquiryType: '', inquiryContents: '' };

function ContactFormContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || '';
  const [form, setForm] = useState<FormState>({ ...INITIAL, inquiryType: defaultType });

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        userName: f.userName || user.userName || '',
        userId: f.userId || user.userId || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const queryType = searchParams.get('type');
    if (queryType && INQUIRY_TYPES.some(t => t.value === queryType)) {
      setForm(f => ({ ...f, inquiryType: queryType }));
    }
  }, [searchParams]);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      try {
        await ContactService.submitInquiry({
          userName: form.userName,
          userId: form.userId.trim() || undefined,
          phoneNum: form.phoneNum,
          inquiryType: form.inquiryType,
          inquiryContents: form.inquiryContents,
        });
      } catch (err) {
        // Mock fallback allowed
      }

      addStoredInquiry({
        userName: form.userName,
        userId: form.userId.trim() || undefined,
        phoneNum: form.phoneNum,
        inquiryType: form.inquiryType,
        inquiryContents: form.inquiryContents,
      });

      setSent(true);
    } catch (error) {
      console.error('[ContactPage] submit error', error);
      alert('문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSending(false);
    }
  };

  const isValid = form.userName.trim() && form.phoneNum.trim() && form.inquiryType && form.inquiryContents.trim();

  return (
    <div className="contact-page">
      <LandingNav />

      {/* MAIN LAYOUT */}
      <div className="contact-layout">

        {/* ── LEFT ── */}
        <div className="contact-left">
          <div className="contact-left-inner">
            <p className="contact-left-eyebrow">Support & Help</p>
            <h1 className="contact-left-title">
              현장 업무와 시스템을<br />위한 기술 지원
            </h1>
            <p className="contact-left-sub">
              GNEWorks 시스템 사용 중 발생하는 계정 문제, 작업 배정/현장 사진 보고 오류, 
              기능 개선 사항을 남겨주시면 시스템 관리자가 신속히 확인하여 지원해 드립니다.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="contact-info-label">운영 및 지원 시간</p>
                  <p className="contact-info-value">평일 09:00 - 18:00 (사내 전산팀 운영)</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="contact-info-label">계정 및 발급 안내</p>
                  <p className="contact-info-value">계정은 관리자가 직접 발급 및 관리합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT (FORM) ── */}
        <div className="contact-right">
          <div className="contact-form-inner">
            {sent ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <CheckCircle size={28} />
                </div>
                <h2 className="contact-success-title">문의가 접수되었습니다</h2>
                <p className="contact-success-sub">
                  문의해주신 내용이 정상적으로 접수되었습니다.<br />
                  관리자/운영팀에서 확인 후 남겨주신 연락처로 신속히 안내 및 조치해 드리겠습니다.
                </p>
                <button
                  className="contact-submit-btn"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setSent(false);
                    setForm({
                      ...INITIAL,
                      userName: user?.userName ?? '',
                      userId: user?.userId ?? '',
                    });
                  }}
                >
                  새로 문의하기
                </button>
              </div>
            ) : (
              <>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-field-row">
                    <div className="contact-field">
                      <label className="contact-label">이름 *</label>
                      <input
                        className="contact-input"
                        type="text"
                        placeholder="성함을 입력해 주세요"
                        value={form.userName}
                        onChange={update('userName')}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label className="contact-label">
                        아이디
                      </label>
                      <input
                        className="contact-input"
                        type="text"
                        placeholder="아이디가 있으신 경우 입력해 주세요"
                        value={form.userId}
                        onChange={update('userId')}
                      />
                    </div>
                  </div>

                  <div className="contact-field-row">
                    <div className="contact-field">
                      <label className="contact-label">받으실 연락처 *</label>
                      <input
                        className="contact-input"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={form.phoneNum}
                        onChange={update('phoneNum')}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label className="contact-label">문의 유형 *</label>
                      <select
                        className={`contact-input contact-select ${!form.inquiryType ? 'is-placeholder' : ''}`}
                        value={form.inquiryType}
                        onChange={update('inquiryType')}
                        required
                      >
                        {INQUIRY_TYPES.map(t => (
                          <option key={t.value} value={t.value} disabled={!t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="contact-field">
                    <label className="contact-label">문의 내용 *</label>
                    <textarea
                      className="contact-input contact-textarea"
                      placeholder="상세 내용을 입력해 주세요. (예: 배정된 작업 번호, 사진 업로드 시 발생한 오류 증상, 계정 권한 변경 요청 등)"
                      value={form.inquiryContents}
                      onChange={update('inquiryContents')}
                      required
                    />
                  </div>

                  <div className="contact-submit-row">
                    <p className="contact-privacy-note">
                      제출 시{' '}
                      <Link href="/docs/privacy" target="_blank" rel="noopener noreferrer">개인정보처리방침</Link>에 동의한 것으로 간주됩니다.
                    </p>
                    <button
                      type="submit"
                      className="contact-submit-btn"
                      disabled={!isValid || sending}
                    >
                      {sending ? (
                        <>전송중... <Loader2 size={16} className="animate-spin" /></>
                      ) : (
                        <>문의 접수하기</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="contact-page"><LandingNav /><LandingFooter /></div>}>
      <ContactFormContent />
    </Suspense>
  );
}