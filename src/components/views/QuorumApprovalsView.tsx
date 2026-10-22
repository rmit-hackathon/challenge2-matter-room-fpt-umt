import React, { useState } from 'react';
import { QuorumRequest, UserProfile, MatterDocument } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';
import { LegalBadge } from '../common/LegalBadge';
import { LegalCard } from '../common/LegalCard';
import { SegmentedRing, RingSlot } from '../common/Charts';

interface QuorumApprovalsViewProps {
  quorumRequests: QuorumRequest[];
  currentUser: UserProfile;
  onApproveQuorum: (requestId: string) => void;
  isGuardianConflicted?: boolean;
  documents?: MatterDocument[];
  onOpenDocument?: (doc: MatterDocument) => void;
  selectedRequestId?: string;
  onSelectRequestId?: (id: string) => void;
}

export const QuorumApprovalsView: React.FC<QuorumApprovalsViewProps> = ({
  quorumRequests,
  currentUser,
  onApproveQuorum,
  isGuardianConflicted = false,
  documents = [],
  onOpenDocument,
  selectedRequestId,
  onSelectRequestId,
}) => {
  const { t, lang } = useLanguage();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<string>(selectedRequestId || quorumRequests[0]?.id || 'qr_001');

  const currentReqId = selectedRequestId || internalSelectedId;
  const activeReq = quorumRequests.find(q => q.id === currentReqId) || quorumRequests[0] || {
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

  const hasSurvivorSigned = activeReq.approvals.some(a => a.signerRole === 'SURVIVOR_CLIENT');
  const hasCounselSigned = activeReq.approvals.some(a => a.signerRole === 'LEAD_COUNSEL');
  const hasGuardianSigned = activeReq.approvals.some(a => a.signerRole === 'GUARDIAN');

  const ringSlots: RingSlot[] = [
    { key: 'SURVIVOR_CLIENT', label: lang === 'vi' ? 'Nạn nhân' : 'Survivor', state: hasSurvivorSigned ? 'signed' : 'pending' },
    { key: 'LEAD_COUNSEL', label: lang === 'vi' ? 'Luật sư' : 'Counsel', state: hasCounselSigned ? 'signed' : 'pending' },
    {
      key: 'GUARDIAN',
      label: lang === 'vi' ? 'Giám hộ' : 'Guardian',
      state: isGuardianConflicted ? 'excluded' : hasGuardianSigned ? 'signed' : 'pending',
    },
  ];
  const signedCount = ringSlots.filter(sl => sl.state === 'signed').length;
  const remainingCount = Math.max(effectiveThreshold - signedCount, 0);

  const targetDoc = documents.find(d => d.id === activeReq.targetDocumentId);

  const handleSelectReq = (id: string) => {
    setInternalSelectedId(id);
    onSelectRequestId?.(id);
  };

  const handleSign = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      onApproveQuorum(activeReq.id);
      setIsBroadcasting(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 sm:gap-6 font-sans min-w-0">
      
      {/* Top Action Breadcrumb & Request Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[#475569] text-xs sm:text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>{lang === 'vi' ? 'Hồ sơ 2026-CV-04421' : 'Matter 2026-CV-04421'}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#1E3A8A] font-semibold">{t.navQuorumApprovals}</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0F172A] font-medium truncate max-w-xs">{activeReq.targetDocumentTitle}</span>
        </div>

        <LegalBadge variant={isApproved ? 'teal' : 'amber'} dot pulse={!isApproved} size="sm">
          {isApproved ? (lang === 'vi' ? 'Đã đạt đồng thuận' : 'Consensus Approved') : t.lockExpires}
        </LegalBadge>
      </div>

      {/* Multiple Requests Switcher */}
      {quorumRequests.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 p-2 bg-slate-100/70 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0 px-2">
            {lang === 'vi' ? 'Chọn hồ sơ Quorum:' : 'Select Escrow:'}
          </span>
          {quorumRequests.map((req) => (
            <button
              key={req.id}
              onClick={() => handleSelectReq(req.id)}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                activeReq.id === req.id
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="truncate max-w-[160px] sm:max-w-[220px]">{req.targetDocumentTitle}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                req.status === 'APPROVED' ? 'bg-teal-500 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {req.approvals.length}/{isGuardianConflicted ? 2 : req.threshold}
              </span>
            </button>
          ))}
        </div>
      )}

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
                    {lang === 'vi' ? 'Quorum ký duyệt dữ liệu C2' : 'C2 Quorum Approval'}
                  </h1>
                </div>
                <p className="text-sm text-[#475569] mt-1">
                  {lang === 'vi' ? 'Cần đồng thuận của tất cả các bên giữ khóa.' : 'Unanimous consent of all keyholders required.'}
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
                  {lang === 'vi' ? 'Ngoại lệ 4 đang hiệu lực' : 'Exception 4 active'}
                </span>
                <p className="leading-relaxed">
                  {lang === 'vi'
                    ? 'Người giám hộ bị loại khỏi luồng duyệt. Ngưỡng Quorum hạ xuống 2/2 (Nạn nhân + Luật sư).'
                    : 'Guardian removed from approval chain. Threshold is now 2-of-2 (Survivor + Counsel).'}
                </p>
              </div>
            </div>
          )}

          {/* 2. Target evidence: one compact strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E2E8F0] rounded-xl overflow-hidden border border-[#E2E8F0]">
            <div className="bg-[#F8FAFC] p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">{t.targetEvidence}</span>
              <p className="font-semibold text-sm text-[#0F172A] mt-1 leading-snug">Exhibit B</p>
              <span className="text-xs text-[#475569] mt-0.5 block">24.5 MB &middot; PDF</span>
            </div>
            <div className="bg-[#F8FAFC] p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">{t.beneficiary}</span>
              <p className="font-semibold text-sm text-[#0F172A] mt-1 leading-snug">Elena Howard, Esq.</p>
              <span className="text-xs text-[#475569] mt-0.5 block">{lang === 'vi' ? 'Luật sư trưởng' : 'Lead Counsel'}</span>
            </div>
            <div className="bg-[#F8FAFC] p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">{lang === 'vi' ? 'Mục đích' : 'Purpose'}</span>
              <p className="font-semibold text-sm text-[#0F172A] mt-1 leading-snug">{lang === 'vi' ? 'Làm chứng trước Tòa' : 'Court verification'}</p>
              <span className="text-xs text-[#475569] mt-0.5 block">{lang === 'vi' ? 'Khóa tự hủy sau 60s' : '60s auto-burn key'}</span>
            </div>
          </div>

          {/* 3. Signature pipeline: ring first, rows below */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-5 sm:gap-10 p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <SegmentedRing
                size={132}
                slots={ringSlots}
                centerValue={`${signedCount}/${effectiveThreshold}`}
                centerLabel={lang === 'vi' ? 'chữ ký' : 'signed'}
                ariaLabel={lang === 'vi' ? `Đã có ${signedCount} trên ${effectiveThreshold} chữ ký` : `${signedCount} of ${effectiveThreshold} signatures`}
              />
              <div className="flex flex-col gap-1 min-w-0">
                {isApproved ? (
                  <>
                    <span className="text-2xl font-bold text-[#0F766E] leading-none">{lang === 'vi' ? 'Đủ Quorum' : 'Quorum met'}</span>
                    <span className="text-xs text-[#475569]">{lang === 'vi' ? 'Có thể giải mã' : 'Ready to decrypt'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-[#B45309] leading-none tabular-nums">{remainingCount}</span>
                    <span className="text-xs text-[#475569]">{lang === 'vi' ? 'chữ ký còn thiếu' : 'signatures missing'}</span>
                  </>
                )}
                {isGuardianConflicted && (
                  <span className="mt-1 text-[11px] font-semibold text-[#991B1B]">{lang === 'vi' ? 'Ngưỡng 2/2 (ngoại lệ)' : '2-of-2 (exception)'}</span>
                )}
              </div>
            </div>

            {/* Keyholder 1: Jane Doe (Survivor / Primary Data Owner) */}
            <div
              className={`rounded-xl p-4 shadow-2xs border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                hasSurvivorSigned
                  ? 'bg-[#F0FDFA] border-[#CCFBF1]'
                  : 'bg-[#FFFBEB] border-[#FEF3C7]'
              }`}
            >
              <div className="flex items-start gap-3.5 max-w-xl">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    hasSurvivorSigned ? 'bg-[#0F766E] text-white' : 'bg-[#B45309] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {hasSurvivorSigned ? 'check' : 'shield_person'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">Jane Doe</span>
                    <span className="text-xs text-[#475569]">— {lang === 'vi' ? 'Nạn nhân (Chủ thể dữ liệu tối thượng)' : 'Survivor (Primary Sovereign)'}</span>
                    {hasSurvivorSigned ? (
                      <LegalBadge variant="teal" size="sm">
                        {lang === 'vi' ? 'Đã ký & Ủy quyền' : 'Signed & Consented'}
                      </LegalBadge>
                    ) : (
                      <LegalBadge variant="amber" pulse size="sm">
                        {lang === 'vi' ? 'Cần ký duyệt' : 'Action Required'}
                      </LegalBadge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!hasSurvivorSigned ? (
                  currentUser.role === 'SURVIVOR_CLIENT' ? (
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
                          : (lang === 'vi' ? 'Ký duyệt Quorum (Nạn nhân)' : 'Sign as Survivor')}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[#B45309] border border-[#FEF3C7] text-xs font-medium">
                      <span className="material-symbols-outlined text-[15px] text-[#B45309]">info</span>
                      <span>{lang === 'vi' ? 'Đổi sang Persona Nạn nhân để ký' : 'Switch to Survivor persona to sign'}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 bg-white border border-[#CCFBF1] px-3 py-1 rounded-lg self-start md:self-auto text-[#0F766E] font-mono text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-[#0F766E]">fingerprint</span>
                    <span>SIG: 0x71...ce89</span>
                  </div>
                )}
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

          {/* Unlocked Decrypt Action Banner when Approved */}
          {isApproved && onOpenDocument && targetDoc && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[24px]">lock_open</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm sm:text-base text-[#0F172A]">
                      {lang === 'vi' ? 'Đã đủ chữ ký của các bên giữ khóa' : 'All keyholders signed'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenDocument(targetDoc)}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>{lang === 'vi' ? 'Giải mã tài liệu ngay (12ms)' : 'Decrypt Document (12ms)'}</span>
              </button>
            </div>
          )}

        </div>
      </LegalCard>
    </div>
  );
};
