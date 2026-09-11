'use client';

import React from 'react';
import { getImageUrl } from '@/common/utils/imageUtils';
import './ConfirmationDocumentPaper.scss';

export interface ConfirmationDocumentPaperProps {
  id?: string;
  className?: string;
  report: WorkReport;
  docFormData?: {
    headName?: string;
    dong?: string;
    ho?: string;
    address?: string;
    installDateFormatted?: string;
    reporterName?: string;
    confirmerName?: string;
    confirmerSignature?: string;
  };
  isEditing?: boolean;
  onFormChange?: (field: string, value: string) => void;
}

export default function ConfirmationDocumentPaper({
  id,
  className = '',
  report,
  docFormData,
  isEditing = false,
  onFormChange,
}: ConfirmationDocumentPaperProps) {
  const headName = docFormData?.headName ?? report.headName ?? '';
  const dong = docFormData?.dong ?? report.dong ?? '';
  const ho = docFormData?.ho ?? report.ho ?? '';
  const reporterName = docFormData?.reporterName ?? report.reporterName ?? report.visitorName ?? '';
  const installDateFormatted = docFormData?.installDateFormatted ?? report.installDateFormatted ?? report.installDate ?? '';
  const confirmerName = docFormData?.confirmerName ?? report.confirmerName ?? headName ?? '';
  const rawSignature = docFormData?.confirmerSignature || report.confirmerSignature;
  const signatureUrl = rawSignature
    ? (rawSignature.startsWith('/assets') || rawSignature.startsWith('data:') || rawSignature.startsWith('http')
        ? rawSignature
        : getImageUrl(rawSignature))
    : '/assets/img/sample_signature.svg';

  const defaultFormattedAddress = report.address && report.siteName && !report.address.includes(report.siteName)
    ? `${report.address} (${report.siteName})`
    : (report.address || report.siteName || '—');
  const address = docFormData?.address ?? defaultFormattedAddress;

  const doorPhoto = report.photoDoor ? getImageUrl(report.photoDoor) : undefined;
  const before1Photo = report.photoBefore1 ? getImageUrl(report.photoBefore1) : undefined;
  const after1Photo = report.photoAfter1 ? getImageUrl(report.photoAfter1) : undefined;
  const before2Photo = report.photoBefore2 ? getImageUrl(report.photoBefore2) : undefined;
  const after2Photo = report.photoAfter2 ? getImageUrl(report.photoAfter2) : undefined;

  return (
    <div id={id} className={`confirmation-document-paper ${className}`.trim()}>
      {/* 1. 문서 헤더: 타이틀 + 우측 끝 확인자 결재칸 */}
      <div className="doc-header-row">
        <div className="doc-title-box">
          <h1 className="doc-main-title">단독경보형감지기 보급지원확인서</h1>
        </div>
        <table className="confirmer-stamp-table">
          <thead>
            <tr>
              <th>확인자</th>
            </tr>
          </thead>
          <tbody>
            <tr className="name-row">
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    className="doc-stamp-input"
                    value={confirmerName}
                    onChange={e => onFormChange?.('confirmerName', e.target.value)}
                  />
                ) : (
                  confirmerName || '—'
                )}
              </td>
            </tr>
            <tr className="sign-row">
              <td className="stamp-cell stamp-sign-cell">
                <div className="stamp-signature-frame">
                  <img
                    src={signatureUrl}
                    alt="확인자 서명"
                    className="stamp-signature-img"
                    decoding="async"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 개인정보 수집 및 이용 동의 (주소 위에 배치) */}
      <div className="doc-privacy-consent-box">
        <div className="privacy-title-row">
          <h4 className="privacy-title">■ 개인정보의 수집 및 이용에 대한 동의</h4>
        </div>
        <div className="privacy-content-text">
          <ul className="privacy-terms-list">
            <li>
              <strong className="term-num-title">1. 수집 및 이용 목적</strong>
              <p className="term-sub-desc">- 경기도 소방재난본부 화제안전취약자 안전 생활환경 조성 지원</p>
            </li>
            <li>
              <strong className="term-num-title">2. 수집 및 이용 항목</strong>
              <p className="term-sub-desc">- 세대 동, 호수, 이름</p>
            </li>
            <li>
              <strong className="term-num-title">3. 개인정보의 보유 및 이용 기간</strong>
              <p className="term-sub-desc">- 노후아파트 단독경보형 감지기 무상보급 대상자의 개인정보 수집・이용목적이 달성되고 향후 무상교체까지(10년) 위 이용목적을 위하여 보유 및 이용하게 됩니다.</p>
            </li>
            <li>
              <strong className="term-num-title">4. 동의를 거부할 권리 및 동의를 거부할 경우의 불이익</strong>
              <p className="term-sub-desc">- 노후아파트 단독경보형 감지기 무상보급 대상자(정보주체)는 개인정보 수집 이용에 대한 동의를 거부할 권리가 있습니다.</p>
              <p className="term-sub-desc">- 다만 위 개인정보의 수집 이용에 관한 동의는 향후 무상교체를 위해 필수적인 사항으로 동의를 거부하실 경우 단독경보형 감지기 무상교체 대상에서 제한될 수 있습니다.</p>
            </li>
            <li>
              <strong className="term-num-title">5. 경기도 소방재난본부 및 관할 소방서가 위와 같이 개인정보를 수집 이용하는 것에 동의하시면 동, 호수, 성명란에 작성 바랍니다.</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. 주소 배너 */}
      <div className="doc-address-banner">
        <span className="addr-label">주소</span>
        {isEditing ? (
          <input
            type="text"
            className="doc-inline-input"
            value={address}
            onChange={e => onFormChange?.('address', e.target.value)}
          />
        ) : (
          <span className="addr-content">{address}</span>
        )}
      </div>

      {/* 4. 본문 6칸 그리드 (2열 x 3행: 둘 둘 둘, 동일한 4:3 사이즈 및 상단 띠 바) */}
      <div className="doc-six-cards-grid">
        {/* [1행-1] 1. 보급 지원 세대 정보 카드 */}
        <div className="doc-grid-card spec-grid-card">
          <div className="card-top-ribbon">보급 지원 세대 정보</div>
          <table className="doc-official-spec-table">
            <tbody>
              <tr>
                <th className="spec-label-th">1. 성 명</th>
                <td className="spec-value-td">
                  {isEditing ? (
                    <input
                      type="text"
                      className="doc-inline-input"
                      value={headName}
                      onChange={e => onFormChange?.('headName', e.target.value)}
                    />
                  ) : (
                    <span>{headName || '—'}</span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="spec-label-th">2. 동/호수</th>
                <td className="spec-value-td">
                  {isEditing ? (
                    <div className="dong-ho-input-group">
                      <input
                        type="text"
                        className="doc-inline-input short"
                        value={dong}
                        onChange={e => onFormChange?.('dong', e.target.value)}
                      />
                      <span>동</span>
                      <input
                        type="text"
                        className="doc-inline-input short"
                        value={ho}
                        onChange={e => onFormChange?.('ho', e.target.value)}
                      />
                      <span>호</span>
                    </div>
                  ) : (
                    <span>{dong ? `${dong}동 ${ho}호` : '—'}</span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="spec-label-th">3. 설치일</th>
                <td className="spec-value-td">
                  {isEditing ? (
                    <input
                      type="text"
                      className="doc-inline-input"
                      value={installDateFormatted}
                      onChange={e => onFormChange?.('installDateFormatted', e.target.value)}
                    />
                  ) : (
                    <span>{installDateFormatted || '—'}</span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="spec-label-th">4. 설치자</th>
                <td className="spec-value-td">
                  {isEditing ? (
                    <input
                      type="text"
                      className="doc-inline-input"
                      value={reporterName}
                      onChange={e => onFormChange?.('reporterName', e.target.value)}
                    />
                  ) : (
                    <span>{reporterName || '—'}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* [1행-2] 2. 신주소 보이는 대문 등 */}
        <div className="doc-grid-card photo-grid-card">
          <div className="card-top-ribbon">신주소 보이는 대문 등</div>
          <div className="card-photo-content">
            {doorPhoto ? (
              <img 
                src={doorPhoto} 
                alt="신주소 보이는 대문 등" 
                className="doc-preview-img" 
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                }}
              />
            ) : (
              <span className="doc-photo-placeholder"></span>
            )}
          </div>
        </div>

        {/* [2행-1] 3. 감지기 1 설치 전 */}
        <div className="doc-grid-card photo-grid-card">
          <div className="card-top-ribbon">감지기 1 설치 전</div>
          <div className="card-photo-content">
            {before1Photo ? (
              <img 
                src={before1Photo} 
                alt="감지기 1 설치 전" 
                className="doc-preview-img" 
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                }}
              />
            ) : (
              <span className="doc-photo-placeholder"></span>
            )}
          </div>
        </div>

        {/* [2행-2] 4. 감지기 1 설치 후 */}
        <div className="doc-grid-card photo-grid-card">
          <div className="card-top-ribbon">감지기 1 설치 후</div>
          <div className="card-photo-content">
            {after1Photo ? (
              <img 
                src={after1Photo} 
                alt="감지기 1 설치 후" 
                className="doc-preview-img" 
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                }}
              />
            ) : (
              <span className="doc-photo-placeholder"></span>
            )}
          </div>
        </div>

        {/* [3행-1] 5. 감지기 2 설치 전 */}
        <div className="doc-grid-card photo-grid-card">
          <div className="card-top-ribbon">감지기 2 설치 전</div>
          <div className="card-photo-content">
            {before2Photo ? (
              <img 
                src={before2Photo} 
                alt="감지기 2 설치 전" 
                className="doc-preview-img" 
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                }}
              />
            ) : (
              <span className="doc-photo-placeholder"></span>
            )}
          </div>
        </div>

        {/* [3행-2] 6. 감지기 2 설치 후 */}
        <div className="doc-grid-card photo-grid-card">
          <div className="card-top-ribbon">감지기 2 설치 후</div>
          <div className="card-photo-content">
            {after2Photo ? (
              <img 
                src={after2Photo} 
                alt="감지기 2 설치 후" 
                className="doc-preview-img" 
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                }}
              />
            ) : (
              <span className="doc-photo-placeholder"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
