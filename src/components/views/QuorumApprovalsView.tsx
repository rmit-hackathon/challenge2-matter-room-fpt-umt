import React, { useState } from 'react';
import { QuorumRequest, UserProfile } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';
import { LegalBadge } from '../common/LegalBadge';
import { LegalCard } from '../common/LegalCard';

interface QuorumApprovalsViewProps {
  quorumRequests: QuorumRequest[];
  currentUser: UserProfile;
  onApproveQuorum: (requestId: string) => void;
  isGuardianConflicted?: boolean;
}

export const QuorumApprovalsView: React.FC<QuorumApprovalsViewProps> = ({
  quorumRequests,
  currentUser,
  onApproveQuorum,
  isGuardianConflicted = false,
}) => {
  const { t, lang } = useLanguage();
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const activeReq = quorumRequests[0] || {
    id: 'req_01',
    targetDocumentId: 'doc_03',
    targetDocumentTitle: 'Exhibit B: Confidential Forensic Medical Trauma Evaluation & Physical Examination',
    requestedBy: 'Elena Howard, Esq.',
    requestedFor: 'In-Camera Judicial Inspection & Trial Submission',
    requestedRole: 'LEAD_COUNSEL',
    reason: 'Court Protective Order 2026-CV-04421 requires medical verification of bodily injuries.',
    status: 'PENDING',
    approvals: [
      {
        signerId: 'usr_client_01',
        signerName: 'Jane Doe (Survivor)',
        signerRole: 'SURVIVOR_CLIENT',
        timestamp: '2026-10-22 10:15:32',
        signatureHash: '0x71a2ce89'
      }
    ],
    threshold: isGuardianConflicted ? 2 : 3,
    requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN']
  };

  const effectiveThreshold = isGuardianConflicted ? 2 : (activeReq.threshold || 3);
  const isApproved = activeReq.status === 'APPROVED' || activeReq.approvals.length >= effectiveThreshold;

  const hasCounselSigned = activeReq.approvals.some(a => a.signerRole === 'LEAD_COUNSEL');
  const hasGuardianSigned = activeReq.approvals.some(a => a.signerRole === 'GUARDIAN');

  const handleSign = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      onApproveQuorum(activeReq.id);
      setIsBroadcasting(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 sm:gap-6 font-sans min-w-0">
      
      {/* Top Action Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[#475569] text-xs sm:text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>{lang === 'vi' ? 'Hồ sơ 2026-CV-04421' : 'Matter 2026-CV-04421'}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#1E3A8A] font-semibold">{t.navQuorumApprovals}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0F172A] font-medium">Exhibit B (C2 Sensitive)</span>
        </div>

        <LegalBadge variant="amber" dot pulse size="sm">
          {t.lockExpires}
        </LegalBadge>
      </div>

      {/* Main Container */}
      <LegalCard variant="surface" className="overflow-hidden shadow-xs">
        
        {/* Solid Legal Navy Top Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-[#0F766E] to-[#1E3A8A]" />

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
                    {lang === 'vi' ? 'Hội đồng Quorum Ký duyệt Dữ liệu C2 (All-Keyholders)' : 'All-Keyholders Quorum Escrow (C2)'}
                  </h1>
                  {isApproved ? (
                    <LegalBadge variant="teal" dot size="sm">
                      {lang === 'vi' ? `Quorum Hoàn tất (${activeReq.approvals.length}/${effectiveThreshold})` : `Quorum Complete (${activeReq.approvals.length}/${effectiveThreshold})`}
                    </LegalBadge>
                  ) : (
                    <LegalBadge variant="amber" dot pulse size="sm">
                      {lang === 'vi' ? `Đang chờ ký duyệt (${activeReq.approvals.length}/${effectiveThreshold})` : `Pending Signatures (${activeReq.approvals.length}/${effectiveThreshold})`}
                    </LegalBadge>
                  )}
                </div>
                <p className="text-sm text-[#475569] mt-1 font-normal max-w-2xl leading-relaxed">
                  {lang === 'vi'
                    ? 'Quy tắc Brainstorm 2.0: Mọi hồ sơ C2 bắt buộc phải được đồng thuận từ TẤT CẢ các bên giữ khóa (Nạn nhân, Luật sư, Người giám hộ) trước khi giải mã.'
                    : 'Brainstorm 2.0 Policy: C2 Sensitive records mathematically require unanimous consent from ALL keyholders before key synthesis.'}
                </p>
              </div>
            </div>
          </div>

          {/* Cảnh Báo Ngoại Lệ Nếu Có Xung Đột Người Giám Hộ */}
          {isGuardianConflicted && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] flex items-start gap-3 animate-in fade-in">
              <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">gpp_bad</span>
              <div className="space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider block">
                  {lang === 'vi' ? '🚨 NGOẠI LỆ RULE 4 ĐANG ĐƯỢC THỰC THI (BẢNG 5 - BRAINSTORM 2.0)' : '🚨 EXCEPTION RULE 4 ACTIVE (TABLE 5)'}
                </span>
                <p className="leading-relaxed">
                  {lang === 'vi'
                    ? 'Có báo cáo nghi ngờ Người giám hộ (Sarah Jenkins) có xung đột lợi ích hoặc hành vi bạo hành. Hệ thống đã cách ly tài khoản giám hộ khỏi luồng phê duyệt, ngưỡng Quorum tự động hạ xuống 2/2 giữa Thân chủ và Luật sư.'
                    : 'Guardian Sarah Jenkins is flagged for potential abuse conflict. Safeguarding exception active: Guardian removed from approval chain, threshold adjusted to 2-of-2 (Survivor + Counsel).'}
                </p>
              </div>
            </div>
          )}

          {/* 2. Target Evidence Manifest */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 sm:p-5 flex flex-col gap-3 border border-[#E2E8F0]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#475569] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">description</span>
                <span>{t.targetEvidenceManifest}</span>
              </span>
              <span className="font-mono text-xs text-[#475569] bg-white px-2.5 py-0.5 rounded border border-[#E2E8F0]">
                SHA-256: 4b901a...f89c02 (C2 Sensitive)
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
                    Exhibit B: {lang === 'vi' ? 'Giám định Thương tật Y khoa & Độc chất học' : 'Forensic Trauma Evaluation'}
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1 text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] text-xs font-medium w-fit">
                  <span className="material-symbols-outlined text-[14px]">attachment</span>
                  <span>24.5 MB • PDF</span>
                </div>
              </LegalCard>

              {/* Card 2: Beneficiary */}
              <LegalCard variant="surface" className="p-3.5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">
                    {t.beneficiary}
                  </span>
                  <p className="font-semibold text-xs sm:text-sm text-[#0F172A] mt-1 leading-snug">
                    Elena Howard, Esq.
                  </p>
                  <span className="text-xs text-[#475569] mt-0.5 block">
                    {lang === 'vi' ? 'Luật sư Trưởng Thụ lý Vụ án' : 'Lead Counsel & Litigator'}
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
                    {lang === 'vi' ? 'Thẩm định thương tật làm chứng trước Tòa' : 'Court Evidentiary Verification'}
                  </p>
                  <span className="text-xs text-[#475569] mt-0.5 block">
                    {lang === 'vi' ? 'Theo lệnh bảo vệ vụ án' : 'Under Protective Seal'}
                  </span>
                </div>
                <div className="mt-2.5">
                  <LegalBadge variant="navy" size="sm" icon="lock">
                    {lang === 'vi' ? 'Khóa tự hủy sau 60s' : '60s Auto-Burn Key'}
                  </LegalBadge>
                </div>
              </LegalCard>
            </div>
          </div>

          {/* 3. Required Signatures Pipeline (3 Keyholders) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">how_to_reg</span>
                <span>{lang === 'vi' ? 'TIẾN ĐỘ THU THẬP CHỮ KÝ ALL-KEYHOLDERS' : 'ALL-KEYHOLDERS SIGNATURE PIPELINE'}</span>
              </h2>
              <span className="text-xs text-[#475569] font-medium bg-[#F1F5F9] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                {isGuardianConflicted ? '2/2 Consensus (Exception Active)' : '3/3 Consensus Required'}
              </span>
            </div>

            {/* Keyholder 1: Jane Doe (Survivor / Primary Data Owner) */}
            <div className="bg-[#F0FDFA] rounded-xl p-4 shadow-2xs border border-[#CCFBF1] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">Jane Doe</span>
                    <span className="text-xs text-[#475569]">— {lang === 'vi' ? 'Nạn nhân (Chủ thể dữ liệu tối thượng)' : 'Survivor (Primary Sovereign)'}</span>
                    <LegalBadge variant="teal" size="sm">
                      {lang === 'vi' ? 'Đã ký & Ủy quyền' : 'Signed & Consented'}
                    </LegalBadge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[#475569] text-xs flex-wrap font-medium">
                    <span>2026-10-22 10:15:32 UTC</span>
                    <span>•</span>
                    <span className="text-[#0F766E] font-semibold">{lang === 'vi' ? 'Mảnh khóa 1 đã hợp thức hóa' : 'Key Share 1 Committed'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-[#CCFBF1] px-3 py-1 rounded-lg self-start md:self-auto text-[#0F766E] font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#0F766E]">fingerprint</span>
                <span>SIG: 0x71...ce89</span>
              </div>
            </div>

            {/* Keyholder 2: Elena Howard, Esq. (Lead Counsel) */}
            <div
              className={`rounded-xl p-4 shadow-2xs border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                hasCounselSigned
                  ? 'bg-[#F0FDFA] border-[#CCFBF1]'
                  : 'bg-[#FFFBEB] border-[#FEF3C7]'
              }`}
            >
              <div className="flex items-start gap-3.5 max-w-xl">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    hasCounselSigned
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-[#B45309] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {hasCounselSigned ? 'check' : 'edit_document'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">Elena Howard, Esq.</span>
                    <span className="text-xs text-[#475569]">— {lang === 'vi' ? 'Luật sư Trưởng Thụ lý' : 'Lead Trial Counsel'}</span>
                    {hasCounselSigned ? (
                      <LegalBadge variant="teal" size="sm">
                        {lang === 'vi' ? 'Đã ký & Ủy quyền' : 'Signed & Consented'}
                      </LegalBadge>
                    ) : (
                      <LegalBadge variant="amber" pulse size="sm">
                        {lang === 'vi' ? 'Cần ký duyệt' : 'Action Required'}
                      </LegalBadge>
                    )}
                  </div>

                  <p className="text-xs text-[#475569] mt-1 font-normal leading-relaxed">
                    {hasCounselSigned
                      ? (lang === 'vi' ? 'Luật sư đã ký xác nhận mục đích tố tụng hợp pháp.' : 'Counsel signature verified in Enclave.')
                      : (lang === 'vi' ? 'Đang chờ Luật sư trưởng ký phê duyệt giải mã hồ sơ giám định y khoa.' : 'Awaiting Lead Counsel authorization.')}
                  </p>
                </div>
              </div>

              {/* Action Button for Counsel */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!hasCounselSigned ? (
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
                          ? (lang === 'vi' ? 'Đang phát ký số...' : 'Signing...')
                          : (lang === 'vi' ? 'Ký duyệt Quorum (Luật sư)' : 'Sign & Authorize Quorum')}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[#B45309] border border-[#FEF3C7] text-xs font-medium">
                      <span className="material-symbols-outlined text-[15px] text-[#B45309]">info</span>
                      <span>{lang === 'vi' ? 'Đổi sang Persona Luật sư để ký' : 'Switch to Counsel persona to sign'}</span>
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

            {/* Keyholder 3: Sarah Jenkins (Legal Guardian) */}
            <div
              className={`rounded-xl p-4 shadow-2xs border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                isGuardianConflicted
                  ? 'bg-[#FEF2F2] border-[#FECACA] opacity-75'
                  : hasGuardianSigned
                  ? 'bg-[#F0FDFA] border-[#CCFBF1]'
                  : 'bg-[#FFFBEB] border-[#FEF3C7]'
              }`}
            >
              <div className="flex items-start gap-3.5 max-w-xl">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    isGuardianConflicted
                      ? 'bg-[#991B1B] text-white'
                      : hasGuardianSigned
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-[#B45309] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isGuardianConflicted ? 'block' : hasGuardianSigned ? 'check' : 'handshake'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">Sarah Jenkins</span>
                    <span className="text-xs text-[#475569]">— {lang === 'vi' ? 'Người Giám Hộ Hợp Pháp' : 'Legal Guardian'}</span>
                    {isGuardianConflicted ? (
                      <LegalBadge variant="rose" size="sm">
                        {lang === 'vi' ? 'Đã bị loại trừ (Ngoại lệ 4)' : 'Excluded (Exception 4)'}
                      </LegalBadge>
                    ) : hasGuardianSigned ? (
                      <LegalBadge variant="teal" size="sm">
                        {lang === 'vi' ? 'Đã ký & Ủy quyền' : 'Signed & Consented'}
                      </LegalBadge>
                    ) : (
                      <LegalBadge variant="amber" pulse size="sm">
                        {lang === 'vi' ? 'Cần ký duyệt' : 'Action Required'}
                      </LegalBadge>
                    )}
                  </div>

                  <p className="text-xs text-[#475569] mt-1 font-normal leading-relaxed">
                    {isGuardianConflicted
                      ? (lang === 'vi' ? 'Tài khoản người giám hộ bị cách ly theo quy trình bảo vệ độc lập do nghi vấn bạo hành.' : 'Guardian excluded due to safeguarding conflict of interest.')
                      : hasGuardianSigned
                      ? (lang === 'vi' ? 'Người giám hộ đã ký phê duyệt mảnh khóa bảo hộ thứ ba.' : 'Guardian protective signature verified.')
                      : (lang === 'vi' ? 'Đang chờ Người giám hộ đại diện hợp pháp ký duyệt mảnh khóa thứ 3.' : 'Awaiting Legal Guardian approval.')}
                  </p>
                </div>
              </div>

              {/* Action Button for Guardian */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isGuardianConflicted ? (
                  <div className="flex items-center gap-1.5 bg-white border border-[#FECACA] px-3 py-1.5 rounded-lg text-[#991B1B] text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px]">shield</span>
                    <span>{lang === 'vi' ? 'Quyền ký đã bị phong tỏa' : 'Signing Blocked'}</span>
                  </div>
                ) : !hasGuardianSigned ? (
                  currentUser.role === 'GUARDIAN' ? (
                    <button
                      onClick={handleSign}
                      disabled={isBroadcasting}
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] text-white hover:bg-[#0D9488] transition shadow-xs active:scale-[0.98] font-semibold text-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock_open</span>
                      <span>
                        {isBroadcasting
                          ? (lang === 'vi' ? 'Đang phát ký số...' : 'Signing...')
                          : (lang === 'vi' ? 'Ký duyệt Quorum (Người giám hộ)' : 'Sign & Authorize (Guardian)')}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[#B45309] border border-[#FEF3C7] text-xs font-medium">
                      <span className="material-symbols-outlined text-[15px] text-[#B45309]">info</span>
                      <span>{lang === 'vi' ? 'Đổi sang Persona Người giám hộ để ký' : 'Switch to Guardian persona to sign'}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 bg-white border border-[#CCFBF1] px-3 py-1 rounded-lg text-[#0F766E] font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-[#0F766E]">fingerprint</span>
                    <span>SIG: 0x9d...fa88</span>
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
                  {lang === 'vi' ? 'ALL-KEYHOLDERS QUORUM' : 'ALL-KEYHOLDERS QUORUM'}
                </span>
                <span className="text-xs text-[#475569] block mt-0.5">
                  {lang === 'vi' ? 'Bắt buộc đồng thuận từ tất cả các bên' : 'Unanimous consent across Keyholders'}
                </span>
              </div>
            </LegalCard>

            <LegalCard variant="muted" className="flex items-center gap-3 p-3.5 shadow-2xs">
              <span className="material-symbols-outlined text-[20px] text-[#B45309]">crisis_alert</span>
              <div>
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  {lang === 'vi' ? 'CƠ CHẾ NGOẠI LỆ AN TOÀN' : 'SAFEGUARD EXCEPTIONS'}
                </span>
                <span className="text-xs text-[#475569] block mt-0.5">
                  {lang === 'vi' ? 'Loại trừ bên xung đột & Fail-Closed' : 'Excludes conflicts & Fail-Closed'}
                </span>
              </div>
            </LegalCard>

            <LegalCard variant="muted" className="flex items-center gap-3 p-3.5 shadow-2xs">
              <span className="material-symbols-outlined text-[20px] text-[#0F766E]">security</span>
              <div>
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  {lang === 'vi' ? 'WEBCRYPTO CLIENT ENCLAVE' : 'CLIENT-SIDE WEBCRYPTO'}
                </span>
                <span className="text-xs text-[#475569] block mt-0.5">
                  {lang === 'vi' ? 'Khóa tổng hợp tại RAM máy khách' : 'Ephemeral keys in client RAM'}
                </span>
              </div>
            </LegalCard>
          </div>

        </div>
      </LegalCard>
    </div>
  );
};
