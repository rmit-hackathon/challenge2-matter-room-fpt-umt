import React, { useState } from 'react';
import { QuorumRequest, UserProfile } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';
import { LegalBadge } from '../common/LegalBadge';
import { LegalCard } from '../common/LegalCard';

interface QuorumApprovalsViewProps {
  quorumRequests: QuorumRequest[];
  currentUser: UserProfile;
  onApproveQuorum: (requestId: string) => void;
}

export const QuorumApprovalsView: React.FC<QuorumApprovalsViewProps> = ({
  quorumRequests,
  currentUser,
  onApproveQuorum,
}) => {
  const { t, lang } = useLanguage();
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const activeReq = quorumRequests[0] || {
    id: 'req_01',
    targetDocumentId: 'doc_03',
    targetDocumentTitle: 'Exhibit B: Trauma & Medical Evaluation (Sealed)',
    requestedBy: 'Dr. Miriam Vance, M.D.',
    requestedFor: 'Medical Evidence for Court Hearing',
    requestedRole: 'FORENSIC_EXPERT',
    reason: 'Court Protective Order 2026-CV-04421 requires medical verification of bodily injuries.',
    status: 'PENDING',
    approvals: [
      {
        signerId: 'user_02',
        signerName: 'Jane Doe',
        signerRole: 'SURVIVOR_CLIENT',
        timestamp: '2026-10-22 10:15:32',
        signatureHash: '0x71a2ce89'
      }
    ],
    threshold: 2
  };

  const isApproved = activeReq.status === 'APPROVED' || activeReq.approvals.length >= activeReq.threshold;

  const handleSign = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      onApproveQuorum(activeReq.id);
      setIsBroadcasting(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 sm:gap-6 font-sans min-w-0">
      
      {/* Top Action Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[#475569] text-xs sm:text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>{lang === 'vi' ? 'Hồ sơ 24-CV-8821' : 'Matter 24-CV-8821'}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#1E3A8A] font-semibold">{t.navQuorumApprovals}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0F172A] font-medium">Exhibit B</span>
        </div>

        <LegalBadge variant="amber" dot pulse size="sm">
          {t.lockExpires}
        </LegalBadge>
      </div>

      {/* Main Container */}
      <LegalCard variant="surface" className="overflow-hidden shadow-xs">
        
        {/* Solid Legal Navy Top Stripe */}
        <div className="h-1 w-full bg-[#1E3A8A]" />

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          
          {/* 1. Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#F1F5F9] pb-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E3A8A] shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                    {t.tideQuorumEscrowTitle}
                  </h1>
                  {isApproved ? (
                    <LegalBadge variant="teal" dot size="sm">
                      {t.quorumCompletedBadge}
                    </LegalBadge>
                  ) : (
                    <LegalBadge variant="amber" dot pulse size="sm">
                      {t.pendingSignoffBadge}
                    </LegalBadge>
                  )}
                </div>
                <p className="text-sm text-[#475569] mt-1 font-normal max-w-2xl leading-relaxed">
                  {t.quorumSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Target Evidence Manifest */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 sm:p-5 flex flex-col gap-3 border border-[#E2E8F0]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#475569] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">description</span>
                <span>{t.targetEvidenceManifest}</span>
              </span>
              <span className="font-mono text-xs text-[#475569] bg-white px-2.5 py-0.5 rounded border border-[#E2E8F0]">
                SHA-256: 4b901a...f89c02
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1: Target Evidence */}
              <LegalCard variant="surface" className="p-3.5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">
                    {t.targetEvidence}
                  </span>
                  <p className="font-semibold text-xs sm:text-sm text-[#0F172A] mt-1 leading-snug">
                    Exhibit B: {lang === 'vi' ? 'Báo cáo Giám định Y khoa & Sang chấn' : 'Forensic Trauma Evaluation'}
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1 text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] text-xs font-medium w-fit">
                  <span className="material-symbols-outlined text-[14px]">attachment</span>
                  <span>24.5 MB</span>
                </div>
              </LegalCard>

              {/* Card 2: Beneficiary */}
              <LegalCard variant="surface" className="p-3.5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">
                    {t.beneficiary}
                  </span>
                  <p className="font-semibold text-xs sm:text-sm text-[#0F172A] mt-1 leading-snug">
                    Dr. Miriam Vance, M.D.
                  </p>
                  <span className="text-xs text-[#475569] mt-0.5 block">
                    {lang === 'vi' ? 'Bác sĩ Giám định Pháp y' : 'Forensic Medical Examiner'}
                  </span>
                </div>
                <div className="mt-2.5">
                  <LegalBadge variant="teal" size="sm" icon="verified">
                    {lang === 'vi' ? 'Đã xác thực danh tính' : 'Identity Verified'}
                  </LegalBadge>
                </div>
              </LegalCard>

              {/* Card 3: Purpose & Scope */}
              <LegalCard variant="surface" className="p-3.5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">
                    {lang === 'vi' ? 'MỤC ĐÍCH & PHẠM VI' : 'PURPOSE & SCOPE'}
                  </span>
                  <p className="font-semibold text-xs sm:text-sm text-[#0F172A] mt-1 leading-snug">
                    {lang === 'vi' ? 'Cung cấp chứng cứ y khoa cho Tòa án' : 'Court-Ordered Trauma Review'}
                  </p>
                  <span className="text-xs text-[#475569] mt-0.5 block">
                    {lang === 'vi' ? 'Theo lệnh bảo vệ của Tòa án' : 'Under Court Protective Order'}
                  </span>
                </div>
                <div className="mt-2.5">
                  <LegalBadge variant="navy" size="sm" icon="lock">
                    {lang === 'vi' ? 'Khóa tự hủy sau phiên' : 'Ephemeral Session Key'}
                  </LegalBadge>
                </div>
              </LegalCard>
            </div>
          </div>

          {/* 3. Required Signatures Pipeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">how_to_reg</span>
                <span>{t.requiredSignaturesPipeline}</span>
              </h2>
              <span className="text-xs text-[#475569] font-medium bg-[#F1F5F9] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                {t.strict2of2Consensus}
              </span>
            </div>

            {/* Signer 1: Jane Doe (Survivor / Primary Data Owner - Subtle Teal) */}
            <div className="bg-[#F0FDFA] rounded-xl p-4 shadow-2xs border border-[#CCFBF1] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">Jane Doe</span>
                    <span className="text-xs text-[#475569]">— {t.survivorDataOwner}</span>
                    <LegalBadge variant="teal" size="sm">
                      {t.signedAndConsented}
                    </LegalBadge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[#475569] text-xs flex-wrap font-medium">
                    <span>2026-10-22 10:15:32 UTC</span>
                    <span>•</span>
                    <span className="text-[#0F766E] font-semibold">{lang === 'vi' ? 'Chữ ký 1 đã xác nhận' : 'Signature 1 Committed'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-[#CCFBF1] px-3 py-1 rounded-lg self-start md:self-auto text-[#0F766E] font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#0F766E]">fingerprint</span>
                <span>SIG: 0x9e...2a11</span>
              </div>
            </div>

            {/* Signer 2: Elena Howard, Esq. (Lead Counsel) */}
            <div
              className={`rounded-xl p-4 shadow-2xs border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                isApproved
                  ? 'bg-[#F0FDFA] border-[#CCFBF1]'
                  : 'bg-[#FFFBEB] border-[#FEF3C7]'
              }`}
            >
              <div className="flex items-start gap-3.5 max-w-xl">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    isApproved
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-[#B45309] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isApproved ? 'check' : 'edit_document'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">Elena Howard, Esq.</span>
                    <span className="text-xs text-[#475569]">— {t.leadTrialCounsel}</span>
                    {isApproved ? (
                      <LegalBadge variant="teal" size="sm">
                        {t.signedAndConsented}
                      </LegalBadge>
                    ) : (
                      <LegalBadge variant="amber" pulse size="sm">
                        {t.actionRequired}
                      </LegalBadge>
                    )}
                  </div>

                  <p className="text-xs text-[#475569] mt-1 font-normal leading-relaxed">
                    {isApproved ? t.counselSignedCommitted : t.counselAwaitingSignoff}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isApproved ? (
                  currentUser.role === 'LEAD_COUNSEL' ? (
                    <button
                      onClick={handleSign}
                      disabled={isBroadcasting}
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#172554] transition shadow-xs active:scale-[0.98] font-semibold text-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock_open</span>
                      <span>
                        {isBroadcasting
                          ? (lang === 'vi' ? 'Đang gửi chữ ký số...' : 'Signing...')
                          : t.btnSignAuthorize}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[#B45309] border border-[#FEF3C7] text-xs font-medium">
                      <span className="material-symbols-outlined text-[15px] text-[#B45309]">info</span>
                      <span>{t.switchToCounselPrompt}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 bg-white border border-[#CCFBF1] px-3 py-1 rounded-lg text-[#0F766E] font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-[#0F766E]">fingerprint</span>
                    <span>SIG: 0x4f...9a02</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Three Protection Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <LegalCard variant="muted" className="flex items-center gap-3 p-3.5 shadow-2xs">
              <span className="material-symbols-outlined text-[20px] text-[#1E3A8A]">group_work</span>
              <div>
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  {lang === 'vi' ? 'ĐỒNG THUẬN 2 BÊN' : 'DUAL CONSENSUS'}
                </span>
                <span className="text-xs text-[#475569] block mt-0.5">
                  {lang === 'vi' ? 'Bắt buộc đủ 2/2 chữ ký mới tạo khóa' : '2 of 2 Signatures Required'}
                </span>
              </div>
            </LegalCard>

            <LegalCard variant="muted" className="flex items-center gap-3 p-3.5 shadow-2xs">
              <span className="material-symbols-outlined text-[20px] text-[#B45309]">timer</span>
              <div>
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  {lang === 'vi' ? 'KHÓA TỰ HỦY' : 'EPHEMERAL LIFESPAN'}
                </span>
                <span className="text-xs text-[#475569] block mt-0.5">
                  {lang === 'vi' ? 'Khóa tự động xóa sau phiên làm việc' : 'Auto-deleted when session ends'}
                </span>
              </div>
            </LegalCard>

            <LegalCard variant="muted" className="flex items-center gap-3 p-3.5 shadow-2xs">
              <span className="material-symbols-outlined text-[20px] text-[#0F766E]">security</span>
              <div>
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  {lang === 'vi' ? 'QUYỀN THU HỒI' : 'REVOCATION CONTROL'}
                </span>
                <span className="text-xs text-[#475569] block mt-0.5">
                  {lang === 'vi' ? 'Thân chủ có thể thu hồi quyền bất kỳ lúc nào' : 'Client can revoke access at any time'}
                </span>
              </div>
            </LegalCard>
          </div>

          {/* 5. Progress Footer */}
          <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4">
            <span className="text-xs text-[#475569] font-medium">
              {isApproved 
                ? (lang === 'vi' ? 'Đã hoàn thành 2/2 chữ ký cần thiết' : '2 of 2 signatures recorded')
                : (lang === 'vi' ? 'Đang hoàn thành 1/2 chữ ký cần thiết' : '1 of 2 signatures recorded')}
            </span>

            <div className="w-32 bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isApproved ? 'bg-[#0F766E] w-full' : 'bg-[#B45309] w-1/2'
                }`}
              />
            </div>
          </div>

        </div>

      </LegalCard>

    </div>
  );
};
