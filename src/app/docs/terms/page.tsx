import { FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import "./Terms.scss";

export default function TermsOfServicePage() {
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
            <FileText size={28} />
          </div>
          <h1>서비스 이용약관</h1>
          <p>GNEWorks 서비스 이용에 따른 이용자와 회사 간의 권리, 의무 및 책임 사항을 규정합니다.</p>
        </header>

        <div className="docs-body">
          <div className="legal-content-body">
            <div className="last-updated">최종 수정일: {lastUpdated}</div>

            <section>
              <h3>1. 약관의 승낙</h3>
              <p>본 서비스를 이용함으로써 귀하는 본 약관에 동의하게 됩니다. 본 약관은 이용자가 서비스를 이용함과 동시에 효력이 발생합니다.</p>
            </section>

            <section>
              <h3>2. 서비스의 목적 및 성격</h3>
              <p>GNEWorks는 사내 현장 작업자 관리, 작업 지시 및 배정, 현장 사진/보고서 등록 및 업무 문서화 이력 관리를 지원하는 사내 업무용 웹 시스템입니다. 관리자는 작업 지시를 등록하고 배정할 수 있으며, 작업자는 배정된 업무를 확인하고 현장 진행 사진과 보고 내용을 등록하여 업무를 완수합니다.</p>
            </section>

            <section>
              <h3>3. 이용 자격 및 계정 관리</h3>
              <ul>
                <li>본 서비스는 회사의 승인을 받은 사내 임직원 및 지정된 작업자/협력 인력에 한하여 이용할 수 있습니다.</li>
                <li>사용자는 부여받은 계정 정보를 안전하게 관리해야 하며, 제3자에게 양도·대여·공유할 수 없습니다.</li>
                <li>사용자의 직책 및 권한(관리자, 작업자 등)에 따라 시스템 내 접근 권한과 기능 이용 범위가 다르게 적용될 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h3>4. 이용자의 의무 및 준수사항</h3>
              <p>이용자는 원활하고 안전한 업무 수행을 위해 다음 사항을 준수해야 합니다.</p>
              <ul>
                <li>작업 지시 확인 및 현장 보고 시 실제 작업 내역과 일치하는 정확한 정보 및 사진을 등록해야 합니다.</li>
                <li>허위 보고, 조작된 현장 사진 등록, 타인 명의 도용 등 업무를 방해하는 행위를 금지합니다.</li>
                <li>시스템 내 등록된 현장 사진, 도면, 작업 문서, 고객 정보 등 사내 업무 기밀을 외부에 무단 유출하거나 사적인 목적으로 사용하지 않습니다.</li>
                <li>시스템에 과도한 부하를 주거나 비정상적인 방법으로 접근하여 시스템 보안을 침해하는 행위를 금지합니다.</li>
              </ul>
            </section>

            <section>
              <h3>5. 지적 재산 및 면책 사항</h3>
              <ul>
                <li>GNEWorks 시스템, 디자인, 소스 코드에 대한 일체의 권리는 원 개발자 및 회사에 귀속됩니다.</li>
                <li>천재지변, 정기 점검, 통신망 장애 등 불가항력적인 사유로 발생한 일시적 서비스 중단에 대해서는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</li>
                <li>이용자가 등록한 현장 작업 내용 및 보고 데이터의 진실성에 대한 1차적 책임은 해당 이용자에게 있으며, 현장 안전사고 및 작업 수행은 사내 안전 규정 및 지침에 따릅니다.</li>
              </ul>
            </section>

            <section>
              <h3>6. 개인정보 보호</h3>
              <p>본 서비스는 이용자의 개인정보 및 업무 데이터를 소중히 다루며, 상세 사항은 별도의 <Link href="/docs/privacy" style={{ color: '#4f46e5', textDecoration: 'underline' }}>개인정보처리방침</Link>에 따릅니다.</p>
            </section>

            <section>
              <h3>7. 기타</h3>
              <p>본 약관에서 정하지 아니한 사항은 대한민국의 관계 법령 및 사내 내규, 상관례에 따릅니다.</p>
            </section>

            <div className="contact-footer" style={{ marginTop: '1rem', textAlign: 'left', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
              <strong>운영 및 문의</strong>: minkyu0026@nate.com
            </div>
          </div>
        </div>
      </div>

      <footer className="docs-footer">
        &copy; 2026 GNEWorks. All rights reserved.
      </footer>
    </div>
  );
}
