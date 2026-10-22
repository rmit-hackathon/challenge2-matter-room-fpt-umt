import React, { useState } from 'react';
import { MatterDocument, UserProfile, DataClass, QuorumRequest } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';
import { LegalBadge, LegalBadgeVariant } from '../common/LegalBadge';
import { LegalCard } from '../common/LegalCard';
import { EditDocumentModal } from '../EditDocumentModal';
import { DonutChart, SegmentedRing, ShareBar, RingSlot } from '../common/Charts';

interface EvidenceMatrixViewProps {
  documents: MatterDocument[];
  currentUser: UserProfile;
  quorumRequests: QuorumRequest[];
  onOpenDocument: (doc: MatterDocument) => void;
  onOpenQuorumView: (targetDoc?: MatterDocument) => void;
  onOpenUploadModal?: () => void;
  onOpenExceptionModal?: () => void;
  isGuardianConflicted?: boolean;
  onDeleteDocument?: (docId: string) => void;
  onUpdateDocument?: (doc: MatterDocument) => void;
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
  onDeleteDocument,
  onUpdateDocument,
}) => {
  const { t, lang } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<DataClass | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [crudToast, setCrudToast] = useState<{ message: string; type: 'success' | 'denied' } | null>(null);
  const [editingDoc, setEditingDoc] = useState<MatterDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<MatterDocument | null>(null);
  const [deniedActionModal, setDeniedActionModal] = useState<{
    doc: MatterDocument;
    action: 'edit' | 'delete' | 'export';
    reason: string;
  } | null>(null);

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  const handleTierSelect = (tier: DataClass) => {
    setSelectedTier((prev) => (prev === tier ? null : tier));
  };

  const counts: Record<DataClass, number> = {
    C0: documents.filter(d => (d.dataClass || 'C2') === 'C0').length,
    C1: documents.filter(d => (d.dataClass || 'C2') === 'C1').length,
    C2: documents.filter(d => (d.dataClass || 'C2') === 'C2').length,
  };

  const filteredDocuments = selectedTier
    ? documents.filter(d => (d.dataClass || 'C2') === selectedTier)
    : documents;

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

  // Trình xử lý thao tác Sửa theo Luật Brainstorm 2.0 (SỬA)
  const handleEdit = (doc: MatterDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.dataClass === 'C0') {
      setEditingDoc(doc);
    } else {
      setDeniedActionModal({
        doc,
        action: 'edit',
        reason: lang === 'vi'
          ? `Quy tắc ${doc.dataClass} - CẤM CHỈNH SỬA: Chứng cứ tố tụng đã được niêm phong mật mã học (SHA-256). Mọi can thiệp sửa đổi đều bị nghiêm cấm để bảo đảm tính nguyên vẹn trước Tòa án (Federal Rules of Evidence 901/902).`
          : `Rule ${doc.dataClass} - INTEGRITY LOCK: Sealed litigation evidence cannot be edited. Hash verification enforced.`
      });
    }
  };

  // Trình xử lý thao tác Xóa theo Luật Brainstorm 2.0 (XÓA)
  const handleDelete = (doc: MatterDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.dataClass === 'C0') {
      setDeletingDoc(doc);
    } else {
      setDeniedActionModal({
        doc,
        action: 'delete',
        reason: lang === 'vi'
          ? `Quy tắc ${doc.dataClass} - CẤM TIÊU HỦY: Hồ sơ vụ án đã ghi vào chuỗi Chain-of-Custody theo Lệnh bảo vệ của Tòa án. Nghiêm cấm xóa hoặc tiêu hủy chứng cứ (Federal Rules of Civil Procedure 37(e)).`
          : `Rule ${doc.dataClass} - SPOLIATION BARRED: Evidence destruction is prohibited under court protective orders.`
      });
    }
  };

  // Trình xử lý thao tác Xuất theo Luật Brainstorm 2.0 (XUẤT)
  const handleExport = (doc: MatterDocument, e: React.MouseEvent) => {
    e.stopPropagation();

    const triggerBlobDownload = (filename: string, contentStr: string) => {
      const blob = new Blob([contentStr], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    if (doc.dataClass === 'C0') {
      const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_C0_Export.txt`;
      const content = `MATTER ROOM PUBLIC DISCOVERY EXPORT\nSDNY Civil Action #2026-CV-04421\nTitle: ${doc.title}\nCategory: ${doc.category}\nSecurity Class: C0 (Operational)\nEncrypted Hash: ${doc.encryptedHash}\nExported At: ${new Date().toISOString()}\n\n--- SUMMARY ---\n${doc.summary}\n\n--- PROCEDURAL CONTENT ---\n${doc.decryptedContent || '(Public docket record)'}`;
      triggerBlobDownload(filename, content);
      showToast(
        lang === 'vi'
          ? `✅ [C0 XUẤT THÀNH CÔNG]: Đã tải xuống bản sao hồ sơ công khai '${filename}'.`
          : `✅ [C0 EXPORT SUCCESS]: Downloaded public record '${filename}'.`,
        'success'
      );
    } else if (doc.dataClass === 'C1') {
      if (currentUser.role === 'LEAD_COUNSEL') {
        const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_C1_Privileged.txt`;
        const content = `CONFIDENTIAL LITIGATION WORK PRODUCT — ATTORNEYS' EYES ONLY\nSDNY Civil Action #2026-CV-04421\nLead Counsel: Elena Howard, Esq.\nTitle: ${doc.title}\nSecurity Class: C1 (Confidential Case Material)\nChain-of-Custody: ${doc.encryptedHash}\nExported At: ${new Date().toISOString()}\n\n--- CONFIDENTIAL CASE DATA ---\n${doc.decryptedContent || doc.summary}`;
        triggerBlobDownload(filename, content);
        showToast(
          lang === 'vi'
            ? `⚖️ [C1 XUẤT THÀNH CÔNG]: Thẩm quyền Luật sư trưởng xác thực — Đã tải xuống '${filename}' phục vụ tranh tụng.`
            : `⚖️ [C1 EXPORT SUCCESS]: Lead Counsel export verified — Downloaded '${filename}'.`,
          'success'
        );
      } else {
        setDeniedActionModal({
          doc,
          action: 'export',
          reason: lang === 'vi'
            ? 'Quy tắc C1 - GIỚI HẠN LUẬT SƯ: Chỉ duy nhất Luật sư trưởng được phân công vụ án (Lead Counsel) mới có thẩm quyền xuất hồ sơ C1.'
            : 'Rule C1 - RESTRICTED: Only assigned Lead Counsel is authorized to export C1 confidential files.'
        });
      }
    } else {
      setDeniedActionModal({
        doc,
        action: 'export',
        reason: lang === 'vi'
          ? 'Quy tắc C2 - CẤM XUẤT TUYỆT ĐỐI: Dữ liệu cá nhân nhạy cảm, bệnh án và tọa độ an toàn sinh mạng tuyệt đối KHÔNG ĐƯỢC XUẤT ra khỏi Enclave!'
          : 'Rule C2 - CANNOT EXPORT: High-sensitivity sealed records cannot be exported outside the Enclave.'
      });
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

  const tierColors: Record<DataClass, string> = { C0: '#64748B', C1: '#1E3A8A', C2: '#B91C1C' };
  const tierNames: Record<DataClass, string> = { C0: 'Operational', C1: 'Confidential', C2: 'Sensitive' };
  const totalDocs = documents.length;

  type OpState = 'open' | 'locked' | 'counsel';
  const tierOps: Record<DataClass, [OpState, OpState, OpState]> = {
    C0: ['open', 'open', 'open'],
    C1: ['locked', 'locked', 'counsel'],
    C2: ['locked', 'locked', 'locked'],
  };
  const opIcon: Record<OpState, { icon: string; color: string }> = {
    open: { icon: 'check_circle', color: '#0F766E' },
    locked: { icon: 'lock', color: '#94A3B8' },
    counsel: { icon: 'balance', color: '#1E3A8A' },
  };
  const opNames = lang === 'vi' ? ['Sửa', 'Xóa', 'Xuất'] : ['Edit', 'Delete', 'Export'];

  // Quorum ring: the pending C2 request (first request when none is pending)
  const ringRequest = quorumRequests.find(q => q.status === 'PENDING') || quorumRequests[0];
  const ringRoles: { role: string; label: string }[] = [
    { role: 'SURVIVOR_CLIENT', label: lang === 'vi' ? 'Nạn nhân' : 'Survivor' },
    { role: 'LEAD_COUNSEL', label: lang === 'vi' ? 'Luật sư' : 'Counsel' },
    { role: 'GUARDIAN', label: lang === 'vi' ? 'Giám hộ' : 'Guardian' },
  ];
  const ringSlots: RingSlot[] = ringRoles.map(r => ({
    key: r.role,
    label: r.label,
    state: r.role === 'GUARDIAN' && isGuardianConflicted
      ? 'excluded'
      : ringRequest?.approvals.some(a => a.signerRole === r.role) ? 'signed' : 'pending',
  }));
  const ringSigned = ringSlots.filter(sl => sl.state === 'signed').length;
  const ringRequired = isGuardianConflicted ? 2 : (ringRequest?.threshold || 3);

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
            {lang === 'vi' ? 'Kho chứng cứ niêm phong' : 'Sealed Evidence Vault'}
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
              <span>{lang === 'vi' ? 'Xử lý ngoại lệ' : 'Exception Engine'}</span>
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

      {/* Vault overview: tier distribution, tier rules as icons, quorum progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 grid-flow-dense gap-3">
        {/* Distribution donut */}
        <LegalCard variant="surface" className="md:col-span-1 xl:col-span-3 p-4 flex items-center justify-center">
          <DonutChart
            size={156}
            ariaLabel={lang === 'vi' ? 'Phân bổ tài liệu theo tầng C0, C1, C2' : 'Documents by tier C0, C1, C2'}
            centerValue={totalDocs}
            centerLabel={lang === 'vi' ? 'tài liệu' : 'documents'}
            activeKey={selectedTier}
            onSelect={(key) => handleTierSelect(key as DataClass)}
            segments={(['C0', 'C1', 'C2'] as DataClass[]).map(k => ({
              key: k,
              label: `${k} ${tierNames[k]}`,
              value: counts[k],
              color: tierColors[k],
            }))}
          />
        </LegalCard>

        {/* Tier list: count share + what each tier allows */}
        <LegalCard variant="surface" className="md:col-span-2 xl:col-span-5 p-4 flex flex-col justify-center gap-1">
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_1.75rem_repeat(3,2.5rem)] items-end gap-x-3 px-2 pb-1 text-[10px] font-semibold text-[#64748B]">
            <span />
            <span />
            <span />
            {opNames.map(n => (
              <span key={n} className="text-center">{n}</span>
            ))}
          </div>
          {(['C0', 'C1', 'C2'] as DataClass[]).map(k => {
            const isSelected = selectedTier === k;
            const isDimmed = selectedTier !== null && !isSelected;
            const isCounsel = currentUser.role === 'LEAD_COUNSEL';
            return (
              <button
                key={k}
                type="button"
                onClick={() => handleTierSelect(k)}
                title={classConfigs[k].ruleText}
                aria-pressed={isSelected}
                className={`w-full grid grid-cols-[6.5rem_minmax(0,1fr)_1.75rem_repeat(3,2.5rem)] items-center gap-x-3 px-2 py-2.5 rounded-lg text-left transition cursor-pointer ${
                  isSelected ? 'bg-[#F1F5F9] ring-1 ring-[#CBD5E1]' : 'hover:bg-[#F8FAFC]'
                } ${isDimmed ? 'opacity-50 hover:opacity-100' : ''}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tierColors[k] }} />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#0F172A] leading-none">{k}</span>
                    <span className="block text-[11px] text-[#64748B] mt-1 truncate">{tierNames[k]}</span>
                  </span>
                </span>
                <ShareBar value={counts[k]} total={totalDocs} color={tierColors[k]} />
                <span className="text-sm font-bold text-[#0F172A] tabular-nums text-right">{counts[k]}</span>
                {tierOps[k].map((op, i) => {
                  const resolved: OpState = op === 'counsel' && !isCounsel ? 'locked' : op;
                  return (
                    <span key={i} className="flex justify-center">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ color: opIcon[resolved].color }}
                      >
                        {opIcon[resolved].icon}
                      </span>
                    </span>
                  );
                })}
              </button>
            );
          })}
          <div className="flex items-center gap-4 px-2 pt-2 text-[10px] text-[#64748B]">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" style={{ color: opIcon.open.color }}>check_circle</span>{lang === 'vi' ? 'Cho phép' : 'Allowed'}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" style={{ color: opIcon.counsel.color }}>balance</span>{lang === 'vi' ? 'Chỉ Luật sư' : 'Counsel only'}</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" style={{ color: opIcon.locked.color }}>lock</span>{lang === 'vi' ? 'Cấm' : 'Blocked'}</span>
          </div>
        </LegalCard>

        {/* Quorum progress ring */}
        <LegalCard variant="surface" className="md:col-span-1 xl:col-span-4 p-4 flex items-center justify-center gap-4">
          {ringRequest ? (
            <>
              <SegmentedRing
                size={128}
                slots={ringSlots}
                centerValue={`${ringSigned}/${ringRequired}`}
                centerLabel={lang === 'vi' ? 'chữ ký' : 'signed'}
                ariaLabel={lang === 'vi' ? `Quorum ${ringSigned} trên ${ringRequired} chữ ký` : `Quorum ${ringSigned} of ${ringRequired} signatures`}
              />
              <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                <ul className="flex flex-col gap-1.5">
                  {ringRoles.map((r, i) => {
                    const st = ringSlots[i].state;
                    return (
                      <li key={r.role} className="flex items-center gap-2 text-xs text-[#0F172A]">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: st === 'signed' ? '#0F766E' : st === 'excluded' ? '#B91C1C' : '#CBD5E1',
                          }}
                        />
                        <span className={st === 'excluded' ? 'line-through text-[#64748B]' : ''}>{r.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  onClick={() => onOpenQuorumView()}
                  className="self-start px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold transition cursor-pointer"
                >
                  {lang === 'vi' ? 'Mở Quorum' : 'Open Quorum'}
                </button>
              </div>
            </>
          ) : (
            <span className="text-xs text-[#64748B]">{lang === 'vi' ? 'Chưa có yêu cầu Quorum' : 'No quorum requests'}</span>
          )}
        </LegalCard>
      </div>

      {/* Unified Evidence Repository Table */}
      <LegalCard variant="surface" className="overflow-hidden shadow-xs min-w-0">
        {/* Filter status: the overview above is the filter control */}
        <div className="px-4 py-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-[#0F172A]">
            {lang === 'vi' ? 'Danh sách tài liệu' : 'Documents'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#475569] tabular-nums">
              {selectedTier
                ? `${filteredDocuments.length} / ${documents.length} (${selectedTier})`
                : documents.length}
            </span>
            {selectedTier && (
              <button
                type="button"
                onClick={() => setSelectedTier(null)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
                <span>{lang === 'vi' ? 'Xóa lọc' : 'Clear'}</span>
              </button>
            )}
          </div>
        </div>

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
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <span className="material-symbols-outlined text-[24px]">filter_list_off</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {lang === 'vi' ? 'Không có tài liệu nào thuộc phân tầng này' : 'No documents found in this security tier'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'vi'
                        ? `Chưa có tài liệu nào được phân loại là ${selectedTier}.`
                        : `No records currently classified under ${selectedTier}.`}
                    </p>
                    <button
                      onClick={() => setSelectedTier(null)}
                      type="button"
                      className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    >
                      {lang === 'vi' ? 'Hiển thị tất cả tài liệu' : 'Show all documents'}
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
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
                                {(doc.isDocx || doc.encryptedPayload?.isDocx) && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-extrabold tracking-wider">
                                    DOCX
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

                      {/* Classification Badge (C0, C1, C2) - Clickable to filter */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTierSelect(dataClass)}
                          title={lang === 'vi' ? `Lọc tài liệu ${dataClass}` : `Filter by ${dataClass}`}
                          className="group/badge cursor-pointer text-left focus:outline-none"
                        >
                          <LegalBadge variant={cfg.variant} dot size="sm" className="group-hover/badge:ring-1 group-hover/badge:ring-offset-1 transition">
                            {cfg.label.split(' — ')[0]}
                          </LegalBadge>
                          <span className="text-[10.5px] text-[#64748B] block mt-1 group-hover/badge:text-[#0F172A] transition">
                            {cfg.subLabel.split(' ')[0]} {cfg.subLabel.split(' ')[1] || ''}
                          </span>
                        </button>
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
                        ) : isC2 ? (
                          quorumStatus?.isApproved ? (
                            <button
                              onClick={() => onOpenDocument(doc)}
                              type="button"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs text-white bg-[#0F766E] hover:bg-[#0D9488] cursor-pointer active:scale-[0.98]"
                            >
                              <span className="material-symbols-outlined text-[15px]">key</span>
                              <span>{lang === 'vi' ? 'Giải mã WebCrypto' : 'Decrypt (Quorum Met)'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenQuorumView(doc)}
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-[#F1F5F9]">
          {filteredDocuments.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">filter_list_off</span>
              </div>
              <p className="text-xs font-semibold text-slate-700">
                {lang === 'vi' ? 'Không có tài liệu nào trong phân tầng này' : 'No documents in this tier'}
              </p>
              <button
                onClick={() => setSelectedTier(null)}
                type="button"
                className="mt-2.5 px-3 py-1 text-xs font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
              >
                {lang === 'vi' ? 'Hiển thị tất cả' : 'Show all'}
              </button>
            </div>
          ) : (
            filteredDocuments.map((doc) => {
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
                        {(doc.isDocx || doc.encryptedPayload?.isDocx) && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-extrabold tracking-wider">
                            DOCX
                          </span>
                        )}
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleTierSelect(dataClass)}
                        title={lang === 'vi' ? `Lọc theo ${dataClass}` : `Filter by ${dataClass}`}
                        className="cursor-pointer"
                      >
                        <LegalBadge variant={cfg.variant} dot size="sm">
                          {cfg.label.split(' — ')[0]}
                        </LegalBadge>
                      </button>
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
            })
          )}
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
            onClick={() => onOpenQuorumView()}
            type="button"
            className="text-[#1E3A8A] font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer shrink-0"
          >
            <span>{t.navQuorumApprovals}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

      </LegalCard>

      {/* Edit Document Modal (SỬA - C0) */}
      <EditDocumentModal
        isOpen={!!editingDoc}
        document={editingDoc}
        onClose={() => setEditingDoc(null)}
        onSave={(updatedDoc) => {
          onUpdateDocument?.(updatedDoc);
          showToast(
            lang === 'vi'
              ? `✅ Đã lưu cập nhật thành công cho '${updatedDoc.title}'.`
              : `✅ Successfully saved changes for '${updatedDoc.title}'.`,
            'success'
          );
        }}
      />

      {/* Delete Confirmation Modal (XÓA - C0) */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">delete</span>
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] text-base">
                  {lang === 'vi' ? 'Xác nhận xóa tài liệu (C0)' : 'Confirm Deletion (C0)'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {lang === 'vi' ? 'Dữ liệu quy trình vận hành công khai' : 'Operational routine record'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'vi'
                ? `Bạn có chắc chắn muốn xóa tài liệu '${deletingDoc.title}'? Thao tác này sẽ gỡ bỏ bản ghi khỏi hệ thống.`
                : `Are you sure you want to delete '${deletingDoc.title}'? This action will remove the record from the matter room.`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingDoc(null)}
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
              >
                {lang === 'vi' ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onDeleteDocument?.(deletingDoc.id);
                  showToast(
                    lang === 'vi' ? `✅ Đã xóa thành công '${deletingDoc.title}'.` : `✅ Deleted '${deletingDoc.title}'.`,
                    'success'
                  );
                  setDeletingDoc(null);
                }}
                type="button"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {lang === 'vi' ? 'Xóa vĩnh viễn' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Denied Action Modal (C1/C2 - Pháp lý ngăn chặn) */}
      {deniedActionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">gavel</span>
              </div>
              <div>
                <h3 className="font-bold text-rose-900 text-base uppercase tracking-tight">
                  {lang === 'vi' ? 'Hành vi bị ngăn chặn' : 'Action Strictly Prohibited'}
                </h3>
                <p className="text-xs text-rose-600 font-medium">
                  {lang === 'vi'
                    ? `Quy tắc ${deniedActionModal.doc.dataClass}: Bảo toàn tố tụng`
                    : `Rule ${deniedActionModal.doc.dataClass}: Evidence Preservation`}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-2">
              <p className="font-semibold leading-relaxed">{deniedActionModal.reason}</p>
              <div className="font-mono text-[10px] text-slate-600 bg-white p-2 rounded border border-rose-200 truncate">
                <span className="text-slate-400">File:</span> {deniedActionModal.doc.title}
              </div>
              <p className="text-[11px] text-rose-700 italic">
                {lang === 'vi'
                  ? 'TideCloak Forseti Enclave khóa mật mã học, chặn đứng mọi hành vi chỉnh sửa hoặc tiêu hủy chứng cứ trái phép.'
                  : 'TideCloak Forseti Enclave enforces zero-trust mathematical immutability.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDeniedActionModal(null)}
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                {lang === 'vi' ? 'Đã hiểu' : 'Acknowledge'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
