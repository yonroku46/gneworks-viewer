import { Shield, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import "./Privacy.scss";

export default function PrivacyPolicyPage() {
  const lastUpdated = "2026년 9월 16일";

  return (
    <div className="public-docs-container">
      <nav className="docs-header-nav">
        <Link href="/" className="back-link">
          <ChevronLeft size={18} />
          <span>홈으로 돌아가기</span>
        </Link>
        <div className="docs-logo">
          <Image src="/assets/icons/logo-wide.svg" alt="Logo" width={34} height={34} />
        </div>
      </nav>

      <div className="docs-card-wrapper">
        <header className="docs-hero">
          <div className="icon-box">
            <Shield size={28} />
          </div>
          <h1>개인정보처리방침</h1>
          <p>GNEWorks는 사용자의 개인정보권을 존중하며 최고의 보안 수준을 지향합니다.</p>
        </header>

        <div className="docs-body">
          <div className="legal-content-body">
            <div className="last-updated">최종 수정일: {lastUpdated}</div>

            <section>
              <h3>1. 개인정보 및 업무 데이터 수집 항목</h3>
              <p>본 서비스는 원활한 작업자 관리 및 현장 업무 보고 문서화를 위해 다음과 같은 정보를 수집 및 처리합니다.</p>
              <ul>
                <li><strong>계정 및 사용자 식별 정보</strong>: 이메일 주소, 이름, 연락처, 소속/직책, 사용자 식별자(UID), 로그인 세션 정보 (필수)</li>
                <li><strong>작업 지시 및 현장 보고 데이터</strong>: 작업 지시 및 배정 내역, 현장 작업 사진, 작업 완료 보고서, 업무 메모 및 처리 이력 (업무 수행 시)</li>
                <li><strong>서비스 이용 및 기기 로그</strong>: 접속 일시, 접속 IP 주소, 브라우저 및 OS 기기 정보, 시스템 감사 로그 (보안 및 서비스 안정성 유지용)</li>
              </ul>
            </section>

            <section>
              <h3>2. 개인정보 및 데이터의 이용 목적</h3>
              <p>수집된 정보는 사내 작업자 관리 및 작업 문서화 목적 범위 내에서만 안전하게 사용됩니다.</p>
              <ul>
                <li><strong>작업자 및 인력 관리</strong>: 사용자 계정 식별 및 본인 인증, 권한 관리(관리자/작업자), 작업 배정 및 이력 관리</li>
                <li><strong>현장 작업 보고 및 문서화</strong>: 작업 지시 전달, 현장 사진 및 보고서 등록/조회, 업무 완료 승인 및 이력 보존</li>
                <li><strong>시스템 안정성 및 보안 유지</strong>: 비인가자 접근 차단, 사내 보안 규정 준수 감사, 시스템 오류 대응 및 개선</li>
              </ul>
            </section>

            <section>
              <h3>3. 데이터의 활용 및 제3자 제공 제한</h3>
              <p>GNEWorks는 수집된 개인정보 및 현장 작업 데이터를 허가되지 않은 용도로 절대 사용하거나 외부에 무단 제공하지 않습니다.</p>
              <ul>
                <li><strong>사내 업무 외 활용 금지</strong>: 수집된 모든 정보는 회사의 작업 지시, 현장 보고 및 문서화 목적에 한해 활용됩니다.</li>
                <li><strong>제3자 제공 및 판매 금지</strong>: 등록된 개인정보 및 현장 데이터는 외부에 판매, 임대되거나 제3자에게 임의 제공되지 않습니다. (단, 법령에 따른 요구가 있는 경우는 예외로 함)</li>
                <li><strong>상업적 광고 및 외부 AI 학습 배제</strong>: 사용자의 데이터는 상업적 마케팅 목적으로 활용되거나 외부 AI 모델의 학습 데이터로 사용되지 않습니다.</li>
              </ul>
            </section>

            <section>
              <h3>4. 개인정보의 보유 및 파기</h3>
              <p>사용자의 퇴사, 계약 종료 또는 계정 삭제 요청 시, 관련 법령 및 사내 관리 규정에 따른 보존 의무 기간을 거친 후 지체 없이 안전하게 파기됩니다.</p>
              <p><strong>데이터 삭제 및 정정 요청</strong>: 사내 시스템 관리자 또는 담당자(<a href="mailto:minkyu0026@nate.com" style={{ color: '#4f46e5', textDecoration: 'underline' }}>minkyu0026@nate.com</a>)를 통해 언제든지 데이터 정정 및 삭제를 요청할 수 있습니다.</p>
            </section>

            <section>
              <h3>5. 보안 조치</h3>
              <p>GNEWorks는 사내 데이터 및 현장 사진, 보고서의 보호를 위해 전송 시 암호화(HTTPS/SSL)를 기본 적용하며, 접근 권한 관리(RBAC) 및 보안 클라우드 스토리지를 통해 데이터 접근 통제를 수행하고 있습니다.</p>
            </section>

            <section>
              <h3>6. 문의처</h3>
              <p>개인정보 및 시스템 이용과 관련한 문의사항은 아래의 담당자에게 문의해 주십시오.</p>
              <div className="contact-footer" style={{ marginTop: '1rem', textAlign: 'left', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                <strong>시스템 운영 및 문의</strong>: {lastUpdated && "minkyu0026@nate.com"}
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="docs-footer">
        &copy; 2026 GNEWorks. All rights reserved.
      </footer>
    </div>
  );
}
