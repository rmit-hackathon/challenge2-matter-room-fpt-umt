import React, { useState } from 'react';
import { MatterDocument, UserProfile, SecurityLevel, QuorumRequest } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';
import { LegalBadge, LegalBadgeVariant } from '../common/LegalBadge';
import { LegalCard } from '../common/LegalCard';

interface EvidenceMatrixViewProps {
  documents: MatterDocument[];
  currentUser: UserProfile;
  quorumRequests: QuorumRequest[];
  onOpenDocument: (doc: MatterDocument) => void;
  onOpenQuorumView: () => void;
  onOpenUploadModal?: () => void;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  documents,
  currentUser,
  quorumRequests,
  onOpenDocument,
  onOpenQuorumView,
  onOpenUploadModal,
}) => {
  const { t, lang } = useLanguage();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  const levelConfigs: Record<SecurityLevel, {
    label: string;
    badge: string;
    variant: LegalBadgeVariant;
    icon: string;
  }> = {
    LEVEL_1_ROUTINE: {
      label: lang === 'vi' ? 'Cấp 1: Thông thường' : 'Level 1: Routine',
      badge: lang === 'vi' ? 'Xem trực tiếp' : 'Direct Access',
      variant: 'slate',
      icon: 'description',
    },
    LEVEL_2_SENSITIVE: {
      label: lang === 'vi' ? 'Cấp 2: Nhạy cảm' : 'Level 2: Sensitive',
      badge: lang === 'vi' ? 'Giới hạn vai trò' : 'Role-Restricted',
      variant: 'navy',
      icon: 'folder_open',
    },
    LEVEL_3_HIGHLY_SENSITIVE: {
      label: lang === 'vi' ? 'Cấp 3: Cần Quorum 2/2' : 'Level 3: Quorum Required',
      badge: lang === 'vi' ? 'Đồng thuận 2 bên' : 'Dual Approval',
      variant: 'amber',
      icon: 'medical_services',
    },
    LEVEL_4_CRITICAL: {
      label: lang === 'vi' ? 'Cấp 4: Tuyệt mật' : 'Level 4: Critical Seal',
      badge: lang === 'vi' ? 'Niêm phong tối mật' : 'Sovereign Seal',
      variant: 'teal',
      icon: 'security',
    }
  };

  const handleCopy = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getQuorumStatusForDoc = (docId: string) => {
    const matchingReq = quorumRequests.find(q => q.targetDocumentId === docId);
    if (!matchingReq) return null;
    const isApproved = matchingReq.status === 'APPROVED' || matchingReq.approvals.length >= matchingReq.threshold;
    return isApproved
      ? { 
          isApproved: true,
          text: lang === 'vi' ? 'Đã duyệt (2/2 Chữ ký)' : 'Approved (2/2 Signatures)', 
          variant: 'teal' as LegalBadgeVariant
        }
      : { 
          isApproved: false,
          text: lang === 'vi' ? `Chờ duyệt (${matchingReq.approvals.length}/${matchingReq.threshold})` : `Awaiting Approval (${matchingReq.approvals.length}/${matchingReq.threshold})`, 
          variant: 'amber' as LegalBadgeVariant
        };
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 min-w-0">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[#475569] text-xs sm:text-sm">
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
            <span>{lang === 'vi' ? 'Vụ án 2026-CV-04421' : 'Matter 2026-CV-04421'}</span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-[#1E3A8A] font-semibold">{t.navEvidenceMatrix}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mt-1 truncate">
            {lang === 'vi' ? 'Kho Chứng Cứ Niêm Phong & Phân Tầng Bảo Mật' : 'Sealed Evidence Vault & Security Tiers'}
          </h1>
        </div>

        <div className="shrink-0">
          {currentUser.role === 'SURVIVOR_CLIENT' ? (
            <button
              onClick={onOpenUploadModal}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>{lang === 'vi' ? 'Tải lên & Niêm phong Tài liệu' : 'Upload & Seal Evidence'}</span>
            </button>
          ) : (
            <LegalBadge variant="navy" dot pulse size="md">
              <span>{lang === 'vi' ? 'TideCloak Zero-Trust Enclave' : 'TideCloak Zero-Trust Enclave'}</span>
            </LegalBadge>
          )}
        </div>
      </div>

      {/* 4 Security Tiers Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {(Object.keys(levelConfigs) as SecurityLevel[]).map((levelKey) => {
          const cfg = levelConfigs[levelKey];
          const count = documents.filter(d => (d.securityLevel || 'LEVEL_1_ROUTINE') === levelKey).length;

          return (
            <LegalCard
              key={levelKey}
              variant="surface"
              className="p-3 sm:p-3.5 flex items-center justify-between gap-2 shadow-2xs hover:border-[#CBD5E1] transition min-w-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <LegalBadge variant={cfg.variant} dot size="sm" className="shrink-0">
                  {cfg.label.split(':')[0]}
                </LegalBadge>
                <span className="text-xs font-semibold text-[#0F172A] truncate" title={cfg.label.split(': ')[1] || cfg.label}>
                  {cfg.label.split(': ')[1] || cfg.label}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] shrink-0">
                {count} {lang === 'vi' ? 'tệp' : 'files'}
              </span>
            </LegalCard>
          );
        })}
      </div>

      {/* Unified Evidence Repository Table */}
      <LegalCard variant="surface" className="overflow-hidden shadow-xs min-w-0">
        {/* Desktop / Tablet Table View (shown on md: and above) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-5">
                  {t.colEvidenceName}
                </th>
                <th className="py-3 px-3 sm:px-4 w-[150px] whitespace-nowrap">
                  {t.colClassification}
                </th>
                <th className="py-3 px-3 sm:px-4 w-[130px] whitespace-nowrap">
                  {t.colHash}
                </th>
                <th className="py-3 px-3 sm:px-4 w-[145px] whitespace-nowrap">
                  {t.colEnclaveStatus}
                </th>
                <th className="py-3 px-4 sm:px-5 w-[135px] text-right whitespace-nowrap">
                  {t.colAction}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              {documents.map((doc) => {
                const secLevel = doc.securityLevel || 'LEVEL_1_ROUTINE';
                const cfg = levelConfigs[secLevel];
                const quorumStatus = getQuorumStatusForDoc(doc.id);
                const isLevel3 = secLevel === 'LEVEL_3_HIGHLY_SENSITIVE';
                const isLevel4 = secLevel === 'LEVEL_4_CRITICAL';

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {/* Document Info */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isLevel4 ? 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1]' :
                          isLevel3 ? 'bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]' :
                          secLevel === 'LEVEL_2_SENSITIVE' ? 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]' :
                          'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'
                        }`}>
                          <span className="material-symbols-outlined text-[19px]">
                            {cfg.icon}
                          </span>
                        </div>
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug text-xs sm:text-sm">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 text-[11px] text-[#475569] flex-wrap">
                            <span className="font-medium text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                              {doc.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {(doc.isPdf || doc.encryptedPayload?.isPdf) && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-extrabold tracking-wider">
                                  PDF
                                </span>
                              )}
                              <span>{doc.size}</span>
                            </span>
                            <span>•</span>
                            <span className="text-[#475569] line-clamp-1">{doc.summary}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Classification Badge */}
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      <LegalBadge variant={cfg.variant} dot size="sm">
                        {cfg.label}
                      </LegalBadge>
                    </td>

                    {/* Cryptographic Hash */}
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] font-semibold">
                          {doc.encryptedHash.split(' ')[0]}
                        </span>
                        <button
                          onClick={(e) => handleCopy(doc.encryptedHash, e)}
                          type="button"
                          className="p-1 rounded text-[#94A3B8] hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title={lang === 'vi' ? 'Sao chép mã băm' : 'Copy hash'}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedHash === doc.encryptedHash ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Enclave Status */}
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      {secLevel === 'LEVEL_1_ROUTINE' && (
                        <LegalBadge variant="slate" size="sm" icon="check_circle">
                          {lang === 'vi' ? 'Công khai vụ án' : 'Public Discovery'}
                        </LegalBadge>
                      )}

                      {secLevel === 'LEVEL_2_SENSITIVE' && (
                        <LegalBadge variant="navy" size="sm" icon="verified_user">
                          {lang === 'vi' ? 'Theo vai trò' : 'Role Authorized'}
                        </LegalBadge>
                      )}

                      {secLevel === 'LEVEL_3_HIGHLY_SENSITIVE' && (
                        <LegalBadge variant={quorumStatus?.variant || 'amber'} size="sm" icon="group_work">
                          {quorumStatus?.text || (lang === 'vi' ? 'Chờ Quorum 2/2' : 'Pending Quorum')}
                        </LegalBadge>
                      )}

                      {secLevel === 'LEVEL_4_CRITICAL' && (
                        <LegalBadge variant="teal" size="sm" icon="lock">
                          {lang === 'vi' ? 'Niêm phong tối mật' : 'Sealed Escrow'}
                        </LegalBadge>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                      {isAdmin ? (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs text-white bg-[#991B1B] hover:bg-[#7F1D1D] cursor-pointer active:scale-[0.98]"
                          title="Thử giải mã với tư cách Quản trị viên máy chủ"
                        >
                          <span className="material-symbols-outlined text-[15px]">lock_open</span>
                          <span>{lang === 'vi' ? 'Thử giải mã (Admin)' : 'Attempt Decrypt'}</span>
                        </button>
                      ) : currentUser.role === 'FORENSIC_EXPERT' && isLevel3 ? (
                        quorumStatus?.isApproved ? (
                          <button
                            onClick={() => onOpenDocument(doc)}
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs text-white bg-[#0F766E] hover:bg-[#0D9488] cursor-pointer active:scale-[0.98]"
                          >
                            <span className="material-symbols-outlined text-[15px]">key</span>
                            <span>{lang === 'vi' ? 'Giải mã y khoa (WebCrypto)' : 'Decrypt Exhibit B'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={onOpenQuorumView}
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs text-white bg-[#B45309] hover:bg-[#92400E] cursor-pointer active:scale-[0.98]"
                            title="Quorum đang chờ Luật sư ký duyệt. Bấm để chuyển sang màn hình Quorum"
                          >
                            <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                            <span>{lang === 'vi' ? 'Chờ Quorum ký duyệt' : 'Quorum Pending'}</span>
                          </button>
                        )
                      ) : isLevel4 ? (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs text-white bg-[#0F172A] hover:bg-slate-800 cursor-pointer active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                          <span>{lang === 'vi' ? 'Xem niêm phong' : 'Inspect Sealed'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs text-white bg-[#1E3A8A] hover:bg-[#172554] cursor-pointer active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-[15px]">lock_open</span>
                          <span>{lang === 'vi' ? 'Xem tài liệu' : 'Open Document'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile / Narrow Screen Card View (shown below md:) */}
        <div className="md:hidden divide-y divide-[#F1F5F9]">
          {documents.map((doc) => {
            const secLevel = doc.securityLevel || 'LEVEL_1_ROUTINE';
            const cfg = levelConfigs[secLevel];
            const quorumStatus = getQuorumStatusForDoc(doc.id);
            const isLevel3 = secLevel === 'LEVEL_3_HIGHLY_SENSITIVE';
            const isLevel4 = secLevel === 'LEVEL_4_CRITICAL';

            return (
              <div key={doc.id} className="p-4 flex flex-col gap-3 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLevel4 ? 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1]' :
                    isLevel3 ? 'bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]' :
                    secLevel === 'LEVEL_2_SENSITIVE' ? 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]' :
                    'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'
                  }`}>
                    <span className="material-symbols-outlined text-[19px]">
                      {cfg.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs sm:text-sm text-[#0F172A] leading-snug">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#475569] flex-wrap">
                      <span className="font-medium bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                        {doc.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {(doc.isPdf || doc.encryptedPayload?.isPdf) && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-extrabold tracking-wider">
                            PDF
                          </span>
                        )}
                        <span>{doc.size}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <LegalBadge variant={cfg.variant} dot size="sm">
                    {cfg.label}
                  </LegalBadge>

                  {secLevel === 'LEVEL_1_ROUTINE' && (
                    <LegalBadge variant="slate" size="sm" icon="check_circle">
                      {lang === 'vi' ? 'Công khai vụ án' : 'Public Discovery'}
                    </LegalBadge>
                  )}
                  {secLevel === 'LEVEL_2_SENSITIVE' && (
                    <LegalBadge variant="navy" size="sm" icon="verified_user">
                      {lang === 'vi' ? 'Theo vai trò' : 'Role Authorized'}
                    </LegalBadge>
                  )}
                  {secLevel === 'LEVEL_3_HIGHLY_SENSITIVE' && (
                    <LegalBadge variant={quorumStatus?.variant || 'amber'} size="sm" icon="group_work">
                      {quorumStatus?.text || (lang === 'vi' ? 'Chờ Quorum 2/2' : 'Pending Quorum')}
                    </LegalBadge>
                  )}
                  {secLevel === 'LEVEL_4_CRITICAL' && (
                    <LegalBadge variant="teal" size="sm" icon="lock">
                      {lang === 'vi' ? 'Niêm phong tối mật' : 'Sealed Escrow'}
                    </LegalBadge>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] font-semibold">
                      {doc.encryptedHash.split(' ')[0]}
                    </span>
                    <button
                      onClick={(e) => handleCopy(doc.encryptedHash, e)}
                      type="button"
                      className="p-1 rounded text-[#94A3B8] hover:text-[#1E3A8A] transition-colors cursor-pointer"
                      title={lang === 'vi' ? 'Sao chép mã băm' : 'Copy hash'}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedHash === doc.encryptedHash ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>

                  {isAdmin ? (
                    <button
                      onClick={() => onOpenDocument(doc)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#991B1B] hover:bg-[#7F1D1D] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">lock_open</span>
                      <span>{lang === 'vi' ? 'Thử giải mã' : 'Attempt Decrypt'}</span>
                    </button>
                  ) : currentUser.role === 'FORENSIC_EXPERT' && isLevel3 ? (
                    quorumStatus?.isApproved ? (
                      <button
                        onClick={() => onOpenDocument(doc)}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#0D9488] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">key</span>
                        <span>{lang === 'vi' ? 'Giải mã' : 'Decrypt'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={onOpenQuorumView}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#B45309] hover:bg-[#92400E] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                        <span>{lang === 'vi' ? 'Chờ Quorum' : 'Pending'}</span>
                      </button>
                    )
                  ) : isLevel4 ? (
                    <button
                      onClick={() => onOpenDocument(doc)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0F172A] hover:bg-slate-800 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>{lang === 'vi' ? 'Xem niêm phong' : 'Inspect'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenDocument(doc)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">lock_open</span>
                      <span>{lang === 'vi' ? 'Xem tài liệu' : 'Open'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table Footnote */}
        <div className="p-3.5 px-4 sm:px-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-[#475569]">
            <span className="material-symbols-outlined text-[16px] text-[#0F766E]">verified</span>
            <span className="leading-tight">{lang === 'vi' ? 'Tất cả tài liệu được niêm phong bởi phân vùng mã hóa W3C WebCrypto AES-256-GCM' : 'All records sealed under W3C WebCrypto AES-256-GCM hardware-attested enclaves'}</span>
          </div>

          <button
            onClick={onOpenQuorumView}
            type="button"
            className="text-[#1E3A8A] font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer shrink-0"
          >
            <span>{t.navQuorumApprovals}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

      </LegalCard>

    </div>
  );
};
