import React, { useState } from 'react';
import { MatterDocument, UserProfile, DataClass, QuorumRequest } from '../../types/matter';
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
  onOpenExceptionModal?: () => void;
  isGuardianConflicted?: boolean;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  documents,
  currentUser,
  quorumRequests,
  onOpenDocument,
  onOpenQuorumView,
  onOpenUploadModal,
  onOpenExceptionModal,
  isGuardianConflicted,
}) => {
  const { t, lang } = useLanguage();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [crudToast, setCrudToast] = useState<{ message: string; type: 'success' | 'denied' } | null>(null);

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  // 3 Cấp Độ Dữ Liệu Cốt Lõi Theo Chuẩn Brainstorm 2.0
  const classConfigs: Record<DataClass, {
    label: string;
    subLabel: string;
    badge: string;
    variant: LegalBadgeVariant;
    icon: string;
    ruleText: string;
  }> = {
    C0: {
      label: 'C0 — Operational',
      subLabel: lang === 'vi' ? 'Vận hành phi nhạy cảm' : 'Routine Workflow',
      badge: lang === 'vi' ? 'Xem trực tiếp • Sửa/Xóa/Xuất Mở' : 'Full CRUD Open',
      variant: 'slate',
      icon: 'description',
      ruleText: lang === 'vi'
        ? 'Quy tắc C0: Có thể sửa, xóa, xuất bởi tất cả người dùng; không cần phê duyệt.'
        : 'Rule C0: Editable, deletable, exportable by all users without approval.',
    },
    C1: {
      label: 'C1 — Confidential',
      subLabel: lang === 'vi' ? 'Hồ sơ mật nhóm luật sư' : 'Legal Counsel Restricted',
      badge: lang === 'vi' ? 'Cấm sửa/xóa • Chỉ Luật sư Xuất' : 'Export by Counsel Only',
      variant: 'navy',
      icon: 'folder_open',
      ruleText: lang === 'vi'
        ? 'Quy tắc C1: Cấm sửa, cấm xóa. Chỉ duy nhất Luật sư phụ trách có quyền xuất file.'
        : 'Rule C1: Cannot edit, cannot delete. Exportable by the assigned lawyer only.',
    },
    C2: {
      label: 'C2 — Sensitive',
      subLabel: lang === 'vi' ? 'Dữ liệu cá nhân nhạy cảm & Niêm phong' : 'Sensitive & Sealed Evidence',
      badge: lang === 'vi' ? 'Cấm sửa/xóa/xuất • Quorum All Keyholders' : 'All Keyholders Quorum',
      variant: 'rose',
      icon: 'shield_lock',
      ruleText: lang === 'vi'
        ? 'Quy tắc C2: Cấm sửa, cấm xóa, cấm xuất file. Mọi quyền giải mã bắt buộc phải được TẤT CẢ các bên giữ khóa phê duyệt (Quorum).'
        : 'Rule C2: Cannot edit, cannot delete, cannot export. Requires approval from ALL keyholders.',
    }
  };

  const handleCopy = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const showToast = (message: string, type: 'success' | 'denied') => {
    setCrudToast({ message, type });
    setTimeout(() => setCrudToast(null), 3500);
  };

  // Trình xử lý thao tác Sửa theo Luật Brainstorm 2.0
  const handleEdit = (doc: MatterDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.dataClass === 'C0') {
      showToast(
        lang === 'vi'
          ? `✅ [QUY TẮC C0]: Cho phép mở trình chỉnh sửa nội dung '${doc.title}'.`
          : `✅ [RULE C0]: Edit permission granted for '${doc.title}'.`,
        'success'
      );
    } else {
      showToast(
        lang === 'vi'
          ? `❌ [QUY TẮC ${doc.dataClass} - CẤM SỬA]: Tài liệu chứng cứ tố tụng đã niêm phong, tuyệt đối không được phép chỉnh sửa!`
          : `❌ [RULE ${doc.dataClass} - CANNOT EDIT]: Sealed litigation evidence cannot be edited. Integrity lock enforced.`,
        'denied'
      );
    }
  };

  // Trình xử lý thao tác Xóa theo Luật Brainstorm 2.0
  const handleDelete = (doc: MatterDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.dataClass === 'C0') {
      showToast(
        lang === 'vi'
          ? `✅ [QUY TẮC C0]: Cho phép xóa tài liệu quy trình '${doc.title}'.`
          : `✅ [RULE C0]: Delete permission granted for '${doc.title}'.`,
        'success'
      );
    } else {
      showToast(
        lang === 'vi'
          ? `❌ [QUY TẮC ${doc.dataClass} - CẤM XÓA]: Hồ sơ vụ án đã được bảo toàn theo Luật Tố tụng, nghiêm cấm tiêu hủy chứng cứ!`
          : `❌ [RULE ${doc.dataClass} - CANNOT DELETE]: Evidence destruction prohibited under legal preservation rules.`,
        'denied'
      );
    }
  };

  // Trình xử lý thao tác Xuất theo Luật Brainstorm 2.0
  const handleExport = (doc: MatterDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.dataClass === 'C0') {
      showToast(
        lang === 'vi'
          ? `✅ [QUY TẮC C0]: Đang xuất bản sao công khai cho '${doc.title}'.`
          : `✅ [RULE C0]: Public copy exported for '${doc.title}'.`,
        'success'
      );
    } else if (doc.dataClass === 'C1') {
      if (currentUser.role === 'LEAD_COUNSEL') {
        showToast(
          lang === 'vi'
            ? `⚖️ [QUY TẮC C1]: Thẩm quyền Luật sư trưởng xác thực — Cho phép xuất hồ sơ phục vụ phiên xét xử.`
            : `⚖️ [RULE C1]: Lead Counsel authority verified — Export authorized for court proceeding.`,
          'success'
        );
      } else {
        showToast(
          lang === 'vi'
            ? `❌ [QUY TẮC C1 - GIỚI HẠN LUẬT SƯ]: Chỉ duy nhất Luật sư phụ trách vụ án (Lead Counsel) mới có quyền xuất file C1!`
            : `❌ [RULE C1 - LAWYER ONLY]: Exporting C1 confidential case records is restricted strictly to Lead Counsel.`,
          'denied'
        );
      }
    } else {
      showToast(
        lang === 'vi'
          ? `🛑 [QUY TẮC C2 - CẤM XUẤT]: Bằng chứng cực kỳ nhạy cảm và tọa độ an toàn sinh mạng tuyệt đối KHÔNG ĐƯỢC XUẤT ra khỏi Enclave!`
          : `🛑 [RULE C2 - CANNOT EXPORT]: High-sensitivity evidence and safehouse records cannot be exported.`,
        'denied'
      );
    }
  };

  const getQuorumStatusForDoc = (docId: string) => {
    const matchingReq = quorumRequests.find(q => q.targetDocumentId === docId);
    if (!matchingReq) return null;
    const isApproved = matchingReq.status === 'APPROVED' || matchingReq.approvals.length >= matchingReq.threshold;
    return isApproved
      ? { 
          isApproved: true,
          text: lang === 'vi' ? `Đã duyệt (${matchingReq.approvals.length}/${matchingReq.threshold} Khóa)` : `Approved (${matchingReq.approvals.length}/${matchingReq.threshold} Keys)`, 
          variant: 'teal' as LegalBadgeVariant
        }
      : { 
          isApproved: false,
          text: lang === 'vi' ? `Chờ Quorum (${matchingReq.approvals.length}/${matchingReq.threshold})` : `Awaiting Quorum (${matchingReq.approvals.length}/${matchingReq.threshold})`, 
          variant: 'amber' as LegalBadgeVariant
        };
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 min-w-0">
      
      {/* Toast Thông Báo Thực Thi Luật CRUD Brainstorm 2.0 */}
      {crudToast && (
        <div className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-top-4 duration-200 ${
          crudToast.type === 'success'
            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
            : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
        }`}>
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            {crudToast.type === 'success' ? 'check_circle' : 'gpp_bad'}
          </span>
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {crudToast.message}
          </div>
          <button
            type="button"
            onClick={() => setCrudToast(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

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
            {lang === 'vi' ? 'Kho Chứng Cứ Niêm Phong & Phân Tầng Bảo Mật (C0 — C1 — C2)' : 'Sealed Evidence Vault & Security Tiers (C0 — C1 — C2)'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onOpenExceptionModal && (
            <button
              onClick={onOpenExceptionModal}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] font-bold text-xs border border-[#FDE68A] shadow-2xs transition active:scale-[0.98] cursor-pointer"
              title="Mở Bảng Điều Khiển Xử Lý Ngoại Lệ (Table 5)"
            >
              <span className="material-symbols-outlined text-[17px]">crisis_alert</span>
              <span>{lang === 'vi' ? '⚡ Xử lý Ngoại lệ (Table 5)' : '⚡ Exception Engine'}</span>
              {isGuardianConflicted && (
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse ml-0.5" />
              )}
            </button>
          )}

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

      {/* 3 Core Security Tiers Summary Strip (C0, C1, C2 - Brainstorm 2.0) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(['C0', 'C1', 'C2'] as DataClass[]).map((clsKey) => {
          const cfg = classConfigs[clsKey];
          const count = documents.filter(d => (d.dataClass || 'C2') === clsKey).length;

          return (
            <LegalCard
              key={clsKey}
              variant="surface"
              className={`p-4 flex flex-col justify-between gap-3 shadow-2xs border transition hover:border-[#94A3B8] ${
                clsKey === 'C2' ? 'border-[#FECACA] bg-[#FEF2F2]/30' :
                clsKey === 'C1' ? 'border-[#BFDBFE] bg-[#EFF6FF]/30' :
                'border-[#E2E8F0] bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    clsKey === 'C2' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' :
                    clsKey === 'C1' ? 'bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]' :
                    'bg-[#E2E8F0] text-[#334155] border-[#CBD5E1]'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{cfg.icon}</span>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#0F172A] block leading-tight">{cfg.label}</span>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">{cfg.subLabel}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-[#0F172A] border border-[#CBD5E1] shadow-2xs shrink-0">
                  {count} {lang === 'vi' ? 'tài liệu' : 'docs'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-[#475569] font-medium leading-snug">{cfg.badge}</span>
                <span className="material-symbols-outlined text-[15px] text-slate-400">info</span>
              </div>
            </LegalCard>
          );
        })}
      </div>

      {/* Unified Evidence Repository Table */}
      <LegalCard variant="surface" className="overflow-hidden shadow-xs min-w-0">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-5">
                  {t.colEvidenceName}
                </th>
                <th className="py-3 px-3 sm:px-4 w-[140px] whitespace-nowrap">
                  {lang === 'vi' ? 'Phân loại (C0-C2)' : 'Data Class'}
                </th>
                <th className="py-3 px-3 sm:px-4 w-[160px] whitespace-nowrap text-center">
                  {lang === 'vi' ? 'Quy tắc Thao tác (CRUD)' : 'CRUD Rules'}
                </th>
                <th className="py-3 px-3 sm:px-4 w-[150px] whitespace-nowrap">
                  {t.colEnclaveStatus}
                </th>
                <th className="py-3 px-4 sm:px-5 w-[145px] text-right whitespace-nowrap">
                  {t.colAction}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              {documents.map((doc) => {
                const dataClass = doc.dataClass || 'C2';
                const cfg = classConfigs[dataClass];
                const quorumStatus = getQuorumStatusForDoc(doc.id);
                const isC2 = dataClass === 'C2';
                const isC1 = dataClass === 'C1';
                const isC0 = dataClass === 'C0';

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {/* Document Info */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isC2 ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]' :
                          isC1 ? 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]' :
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
                            <button
                              type="button"
                              onClick={(e) => handleCopy(doc.encryptedHash, e)}
                              title={lang === 'vi' ? 'Nhấn để sao chép mã băm SHA-256' : 'Click to copy SHA-256 hash'}
                              className="font-mono text-[10px] text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>{doc.encryptedHash.split(' ')[0]}</span>
                              <span className="material-symbols-outlined text-[11px]">
                                {copiedHash === doc.encryptedHash ? 'check' : 'content_copy'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Classification Badge (C0, C1, C2) */}
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      <LegalBadge variant={cfg.variant} dot size="sm">
                        {cfg.label.split(' — ')[0]}
                      </LegalBadge>
                      <span className="text-[10.5px] text-[#64748B] block mt-1">
                        {cfg.subLabel.split(' ')[0]} {cfg.subLabel.split(' ')[1] || ''}
                      </span>
                    </td>

                    {/* Interactive CRUD Action Buttons (Sửa - Xóa - Xuất) */}
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] w-fit mx-auto">
                        {/* Nút Sửa (Edit) */}
                        <button
                          type="button"
                          onClick={(e) => handleEdit(doc, e)}
                          title={isC0 ? 'C0: Sửa thông tin vận hành' : `CẤM SỬA: Quy tắc ${dataClass}`}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                            isC0
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                              : 'text-slate-400 bg-slate-100/60 hover:bg-slate-200/60 border border-slate-200 opacity-60'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isC0 ? 'edit' : 'edit_off'}
                          </span>
                        </button>

                        {/* Nút Xóa (Delete) */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(doc, e)}
                          title={isC0 ? 'C0: Xóa dữ liệu vận hành' : `CẤM XÓA: Quy tắc ${dataClass}`}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                            isC0
                              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                              : 'text-slate-400 bg-slate-100/60 hover:bg-slate-200/60 border border-slate-200 opacity-60'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isC0 ? 'delete' : 'delete_forever'}
                          </span>
                        </button>

                        {/* Nút Xuất file (Export) */}
                        <button
                          type="button"
                          onClick={(e) => handleExport(doc, e)}
                          title={
                            isC0 ? 'C0: Xuất file công khai' :
                            isC1 ? (currentUser.role === 'LEAD_COUNSEL' ? 'C1: Thẩm quyền Luật sư cho phép xuất' : 'C1: Chỉ Luật sư được xuất') :
                            'CẤM XUẤT: Quy tắc C2'
                          }
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                            isC0
                              ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                              : isC1 && currentUser.role === 'LEAD_COUNSEL'
                              ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                              : 'text-slate-400 bg-slate-100/60 hover:bg-slate-200/60 border border-slate-200 opacity-60'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isC0 || (isC1 && currentUser.role === 'LEAD_COUNSEL') ? 'file_download' : 'file_download_off'}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Enclave Status */}
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      {isC0 && (
                        <LegalBadge variant="slate" size="sm" icon="check_circle">
                          {lang === 'vi' ? 'Công khai vụ án' : 'Public Discovery'}
                        </LegalBadge>
                      )}

                      {isC1 && (
                        <LegalBadge variant="navy" size="sm" icon="verified_user">
                          {lang === 'vi' ? 'Giới hạn Luật sư' : 'Counsel Only'}
                        </LegalBadge>
                      )}

                      {isC2 && (
                        <LegalBadge variant={quorumStatus?.variant || 'amber'} size="sm" icon="group_work">
                          {quorumStatus?.text || (lang === 'vi' ? 'Quorum All-Keyholders' : 'All-Keyholders Quorum')}
                        </LegalBadge>
                      )}
                    </td>

                    {/* Decryption Action Button */}
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
                      ) : currentUser.role === 'FORENSIC_EXPERT' && isC2 ? (
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
                            title="Quorum đang chờ Keyholders ký duyệt. Bấm để chuyển sang màn hình Quorum"
                          >
                            <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                            <span>{lang === 'vi' ? 'Chờ Quorum ký duyệt' : 'Quorum Pending'}</span>
                          </button>
                        )
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

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-[#F1F5F9]">
          {documents.map((doc) => {
            const dataClass = doc.dataClass || 'C2';
            const cfg = classConfigs[dataClass];
            const quorumStatus = getQuorumStatusForDoc(doc.id);
            const isC2 = dataClass === 'C2';
            const isC1 = dataClass === 'C1';
            const isC0 = dataClass === 'C0';

            return (
              <div key={doc.id} className="p-4 flex flex-col gap-3 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isC2 ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]' :
                    isC1 ? 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]' :
                    'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'
                  }`}>
                    <span className="material-symbols-outlined text-[19px]">{cfg.icon}</span>
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
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <LegalBadge variant={cfg.variant} dot size="sm">
                      {cfg.label.split(' — ')[0]}
                    </LegalBadge>
                    {isC2 && quorumStatus && (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {quorumStatus.text}
                      </span>
                    )}
                  </div>

                  {/* CRUD Buttons (Mobile) */}
                  <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={(e) => handleEdit(doc, e)}
                      className={`p-1 rounded ${isC0 ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 opacity-60'}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{isC0 ? 'edit' : 'edit_off'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(doc, e)}
                      className={`p-1 rounded ${isC0 ? 'text-rose-700 bg-rose-50' : 'text-slate-400 opacity-60'}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{isC0 ? 'delete' : 'delete_forever'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleExport(doc, e)}
                      className={`p-1 rounded ${isC0 || (isC1 && currentUser.role === 'LEAD_COUNSEL') ? 'text-blue-700 bg-blue-50' : 'text-slate-400 opacity-60'}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">file_download</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenDocument(doc)}
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'Xem' : 'Open'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table Footnote */}
        <div className="p-3.5 px-4 sm:px-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-[#475569]">
            <span className="material-symbols-outlined text-[16px] text-[#0F766E]">verified</span>
            <span className="leading-tight">
              {lang === 'vi' 
                ? 'Tuân thủ triệt để Quy tắc Brainstorm 2.0: C0 (Sửa/Xóa/Xuất mở) • C1 (Chỉ Luật sư Xuất) • C2 (Quorum All-Keyholders)' 
                : 'Brainstorm 2.0 Compliant: C0 (Open CRUD) • C1 (Counsel Export) • C2 (All-Keyholders Quorum)'}
            </span>
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
