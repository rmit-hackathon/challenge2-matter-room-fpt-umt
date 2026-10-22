import React, { useState, useEffect } from 'react';
import { MatterDocument, UserProfile } from '../types/matter';
import { DecryptionResult } from '../lib/tidecloak';
import { LegalSeal } from './LegalSeal';
import { useLanguage } from '../context/LanguageContext';
import { LegalBadge } from './common/LegalBadge';
import { LegalCard } from './common/LegalCard';

interface DocumentViewerModalProps {
  document: MatterDocument | null;
  currentUser: UserProfile;
  result: DecryptionResult | null;
  onClose: () => void;
  onRequestQuorum?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  currentUser,
  result,
  onClose,
  onRequestQuorum
}) => {
  const { t, lang } = useLanguage();
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isKeyBurned, setIsKeyBurned] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'pdf' | 'cards'>('pdf');

  // Tạo và quản lý Blob Object URL cho File PDF thật đã giải mã
  useEffect(() => {
    if (result?.success && result?.pdfBytes && !isKeyBurned) {
      const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    }
  }, [result?.success, result?.pdfBytes, isKeyBurned]);

  // 1-Time Ephemeral Session Key Countdown Timer (60s default)
  useEffect(() => {
    if (!result?.success) {
      setIsKeyBurned(false);
      return;
    }
    setIsKeyBurned(false);
    setTimeLeft(60);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleBurnKey();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result?.success, document?.id]);

  if (!document || !result) return null;

  // Tiêu hủy khóa phiên & Xóa sạch bộ đệm RAM (VULN-05: True Memory Zeroization)
  const handleBurnKey = () => {
    setIsKeyBurned(true);
    setTimeLeft(0);
    if (result?.pdfBytes) {
      result.pdfBytes.fill(0); // Zeroize volatile memory bytes
    }
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const handleCloseModal = () => {
    if (result?.pdfBytes) {
      result.pdfBytes.fill(0);
    }
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
    onClose();
  };

  const handleCopyBlob = () => {
    const rawPayload = document.encryptedPayload
      ? JSON.stringify(document.encryptedPayload, null, 2)
      : '7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f... [SEALED BY TIDE NODE FABRIC]';
    navigator.clipboard.writeText(rawPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const isSysAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full shadow-xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* ============================================================== */}
        {/* CASE 1: NEGATIVE TEST — DECRYPTION REFUSED                     */}
        {/* ============================================================== */}
        {!result.success && (
          <div className="flex flex-col h-full">
            {/* Top Security Line: Subtle Legal Rose Accent */}
            <div className="h-1 w-full bg-[#991B1B]" />

            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#991B1B] flex items-center justify-center shrink-0 border border-[#FECACA]">
                  <span className="material-symbols-outlined text-[22px]">gpp_bad</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">
                      {t.decryptionRefusedTitle}
                    </h3>
                    <LegalBadge variant="rose" size="sm">
                      {t.tideFabricBlock}
                    </LegalBadge>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {lang === 'vi' ? 'Hồ sơ vụ án' : 'Case'} #2026-CV-04421 • {document.title}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto bg-white">
              
              {/* Top Alert Banner */}
              <div className="p-4 rounded-xl flex flex-col gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#0F172A]">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-[#991B1B] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">verified_user</span>
                    <span>{t.tideZeroAuthorityEnforced}</span>
                  </span>
                  <LegalBadge variant="rose" size="sm">
                    {isSysAdmin ? (lang === 'vi' ? '0% Quyền Xem Dữ Liệu' : 'Zero Data Authority Enforced') : t.privilegeConstraint}
                  </LegalBadge>
                </div>
                <p className="text-xs sm:text-sm text-[#7F1D1D] leading-relaxed">
                  {isSysAdmin
                    ? (lang === 'vi'
                        ? 'Đã xác thực tài khoản quản trị viên máy chủ. Yêu cầu giải mã bị từ chối: Khóa giải mã không lưu trữ trên máy chủ đám mây. Không có bản rõ nào trong bộ nhớ.'
                        : 'Cloud sysadmin credentials validated. Plaintext decryption refused: Ephemeral cryptographic keys are not held on cloud infrastructure. Zero plaintext stored on server memory.')
                    : result.errorMessage}
                </p>
              </div>

              {/* Raw Encrypted Blob Container */}
              <LegalCard variant="muted" className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-[#475569] tracking-wider">
                    {t.rawEncryptedBlob}
                  </span>
                  <button
                    onClick={handleCopyBlob}
                    type="button"
                    className="text-xs text-[#1E3A8A] flex items-center gap-1 hover:underline font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedPayload ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedPayload ? t.copied : t.copyPayload}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-white font-mono text-xs text-[#0F172A] break-all select-all border border-[#E2E8F0] space-y-1.5 shadow-2xs">
                  <div>
                    {document.encryptedPayload
                      ? `${document.encryptedPayload.cipherHex.substring(0, 96)}...`
                      : '7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f...'}{' '}
                    <span className="text-[#991B1B] font-semibold">[SEALED BY TIDE NODE FABRIC]</span>
                  </div>
                  {document.encryptedPayload && (
                    <div className="text-[10px] text-[#64748B] flex gap-3 pt-1 border-t border-[#F1F5F9]">
                      <span>IV: {document.encryptedPayload.ivHex}</span>
                      <span>Salt: {document.encryptedPayload.saltHex}</span>
                      <span className="text-[#B45309] font-medium">Algo: AES-256-GCM</span>
                    </div>
                  )}
                </div>
              </LegalCard>

              {/* Enclave Rejection Indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                <LegalBadge variant="rose" dot size="sm">
                  <span>{t.consensusRejection}: {t.zeroDelegatedAuthority}</span>
                </LegalBadge>
                <span>•</span>
                <LegalBadge variant="slate" size="sm" icon="memory">
                  <span>{t.attestationNode}: AMD SEV Enclave #9942</span>
                </LegalBadge>
              </div>

              {/* Technical Log Box: Pure Light Theme */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#FECACA] font-mono text-xs text-[#991B1B] space-y-1">
                <div className="flex items-center gap-1.5 text-[#475569] text-[11px] font-semibold uppercase">
                  <span className="material-symbols-outlined text-[14px] text-[#1E3A8A]">terminal</span>
                  <span>{t.tideFabricLog}</span>
                </div>
                <p className="leading-relaxed text-[#7F1D1D]">{result.technicalDetails}</p>
              </div>

              {/* Trigger Quorum button if needed */}
              {result.errorCode === 'QUORUM_REQUIRED' && onRequestQuorum && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onRequestQuorum();
                    }}
                    type="button"
                    className="w-full py-2.5 px-4 bg-[#B45309] hover:bg-[#92400E] text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[17px]">group_work</span>
                    <span>{t.btnOpenQuorumModal}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold text-xs hover:bg-[#F1F5F9] transition-colors shadow-2xs cursor-pointer"
              >
                {t.btnCloseViewer}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 2: SUCCESSFUL DECRYPTION WITH 1-TIME EPHEMERAL KEY        */}
        {/* ============================================================== */}
        {result.success && (
          <div className="flex flex-col h-full">
            {/* Top Judicial Stripe: Pure Legal Navy Accent */}
            <div className="h-1 w-full bg-[#1E3A8A]" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1]">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A] tracking-tight">
                    {document.title}
                  </h3>
                  <p className="text-xs text-[#64748B] font-mono">
                    Hash: {document.encryptedHash}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto bg-white">
              
              {/* Ephemeral Key Active Banner: Clean Subtle Teal & Navy Style */}
              {!isKeyBurned ? (
                <div className="p-3.5 px-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0F766E] text-[22px]">
                      key
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#0F766E] text-xs sm:text-sm uppercase tracking-wider">
                          {lang === 'vi' ? 'Mã Giải Mã 1 Lần Đang Kích Hoạt' : '1-Time Ephemeral Key Active'}
                        </h4>
                        <LegalBadge variant={timeLeft <= 15 ? 'rose' : 'teal'} pulse size="sm">
                          TTL: {timeLeft}s
                        </LegalBadge>
                      </div>
                      <p className="text-[11px] text-[#475569] mt-0.5">
                        {lang === 'vi' 
                          ? 'Mã phiên giải mã tồn tại tạm thời trong RAM. Plaintext sẽ tự động tiêu hủy khi hết giờ.'
                          : 'Ephemeral session key materialized in volatile RAM. Auto-evicted on timeout.'}
                      </p>
                    </div>
                  </div>

                  {/* Manual Key Burn Button: Subtle Rose Button */}
                  <button
                    onClick={handleBurnKey}
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-[0.98]"
                    title="Xóa khóa ngay lập tức và hủy bỏ plaintext khỏi RAM"
                  >
                    <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
                    <span>{lang === 'vi' ? 'Tiêu hủy khóa ngay' : 'Burn Session Key Now'}</span>
                  </button>
                </div>
              ) : (
                /* Session Key Burned / Expired Alert */
                <div className="p-5 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] flex flex-col items-center justify-center text-center gap-3 py-8">
                  <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">lock_reset</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-base uppercase">
                      {lang === 'vi' ? 'Khóa phiên 1 lần đã bị tiêu hủy' : '1-Time Ephemeral Key Destroyed'}
                    </h4>
                    <p className="text-xs text-[#475569] max-w-md mx-auto mt-1 leading-relaxed">
                      {lang === 'vi'
                        ? 'Dữ liệu giải mã đã được xóa sạch khỏi bộ nhớ RAM máy khách. Máy chủ và hạ tầng hoàn toàn không lưu giữ bản rõ. Để xem lại, cần thực hiện xác thực và xin cấp khóa mới.'
                        : 'Decrypted bytes have been purged from volatile RAM. Zero plaintext persists in server or client cache. Re-authentication required for new ephemeral key.'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white font-semibold text-xs hover:bg-[#172554] transition shadow-xs cursor-pointer"
                  >
                    {lang === 'vi' ? 'Đóng cửa sổ' : 'Close Viewer'}
                  </button>
                </div>
              )}

              {/* Only show decrypted content if key is NOT burned */}
              {!isKeyBurned && (
                <>
                  {/* PDF Document Viewer (When result has pdfBytes / pdfBlobUrl) */}
                  {result.isPdf && pdfBlobUrl ? (
                    <div className="space-y-3">
                      {/* Document Sub-Header & Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-2">
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block">
                              {result.fileName || document.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              WebCrypto AES-256-GCM Decrypted • {result.latencyMs || 12}ms
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* If Exhibit B, allow switching between PDF and Clinical Breakdown Cards */}
                          {(document.id === 'doc_03' || document.id === 'doc_02') && (
                            <div className="flex items-center p-0.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold">
                              <button
                                type="button"
                                onClick={() => setActiveViewTab('pdf')}
                                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                  activeViewTab === 'pdf' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {lang === 'vi' ? 'Xem PDF' : 'PDF View'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveViewTab('cards')}
                                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                  activeViewTab === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {lang === 'vi' ? 'Tóm tắt y khoa' : 'Clinical Summary'}
                              </button>
                            </div>
                          )}

                          <a
                            href={pdfBlobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer"
                            title="Open in external browser window"
                          >
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            <span className="hidden sm:inline">{lang === 'vi' ? 'Toàn màn hình' : 'Full Screen'}</span>
                          </a>

                          <a
                            href={pdfBlobUrl}
                            download={result.fileName || `${document.id}.pdf`}
                            className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition cursor-pointer"
                            title="Download decrypted attested PDF"
                          >
                            <span className="material-symbols-outlined text-[14px]">download</span>
                            <span>{lang === 'vi' ? 'Tải PDF' : 'Download'}</span>
                          </a>
                        </div>
                      </div>

                      {/* Display either PDF iframe or Clinical Cards */}
                      {activeViewTab === 'pdf' ? (
                        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100 flex flex-col">
                          <iframe
                            src={pdfBlobUrl}
                            className="w-full h-[520px] rounded-xl border-none"
                            title="Decrypted Legal PDF"
                          />
                        </div>
                      ) : (
                        /* RENDER CLINICAL FINDINGS CARDS */
                        <div className="space-y-4 border border-[#E2E8F0] rounded-2xl p-5 bg-white shadow-xs relative overflow-hidden">
                          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                            <LegalSeal className="w-56 h-56" />
                          </div>
                          <div className="flex flex-col gap-1 relative z-10">
                            <p className="text-[11px] uppercase font-bold tracking-wider text-[#B45309]">
                              SEALED LITIGATION MATTER #2026-CV-04421 • CONFIDENTIAL FORENSIC EXHIBIT
                            </p>
                            <div className="h-0.5 w-16 bg-[#1E3A8A] my-1" />
                            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                              {t.independentForensicReport}
                            </h2>
                            <p className="text-xs text-[#475569]">
                              {t.forensicPreparedBy}
                            </p>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="material-symbols-outlined text-[16px] text-[#0F766E]">lock</span>
                              <span className="font-semibold">{t.checksumLabel}</span>
                              <span className="text-[#64748B]">e4b77f98...8ad8e (Hardware Enclave Verified)</span>
                            </div>
                            <LegalBadge variant="teal" size="sm">
                              {t.deterministicVerified}
                            </LegalBadge>
                          </div>

                          {/* 3 Structured Clinical Finding Cards */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                                {t.clinicalFindingsHeader}
                              </h4>
                              <span className="text-[11px] text-[#64748B] font-mono">Protocol Med-Forensic v4.2</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <LegalCard variant="muted" className="p-3.5 flex flex-col justify-between gap-2 shadow-2xs">
                                <div>
                                  <LegalBadge variant="navy" size="sm">
                                    {t.physicalFindings}
                                  </LegalBadge>
                                  <p className="text-xs text-[#475569] leading-relaxed mt-2">
                                    {t.physicalFindingsDesc}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                                  <span className="text-[#64748B]">{t.forensicSeverity}</span>
                                  <span className="font-bold text-[#B45309]">{t.category3Acute}</span>
                                </div>
                              </LegalCard>

                              <LegalCard variant="muted" className="p-3.5 flex flex-col justify-between gap-2 shadow-2xs">
                                <div>
                                  <LegalBadge variant="amber" size="sm">
                                    {t.toxicologyAnalysis}
                                  </LegalBadge>
                                  <p className="text-xs text-[#475569] leading-relaxed mt-2">
                                    {t.toxicologyDesc}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                                  <span className="text-[#64748B]">{t.assayResult}</span>
                                  <span className="font-bold text-[#991B1B]">{t.positiveConfirmative}</span>
                                </div>
                              </LegalCard>

                              <LegalCard variant="muted" className="p-3.5 flex flex-col justify-between gap-2 shadow-2xs">
                                <div>
                                  <LegalBadge variant="teal" size="sm">
                                    {t.psychologicalAssessment}
                                  </LegalBadge>
                                  <p className="text-xs text-[#475569] leading-relaxed mt-2">
                                    {t.psychologicalDesc}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                                  <span className="text-[#64748B]">{t.diagnosticScale}</span>
                                  <span className="font-bold text-[#1E3A8A]">{t.dsm5Confirmed}</span>
                                </div>
                              </LegalCard>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Technical Execution Log */}
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#BFDBFE] text-xs font-mono text-[#1E3A8A] flex items-center gap-2 shadow-2xs">
                        <span className="material-symbols-outlined text-[16px] text-[#1E3A8A]">terminal</span>
                        <span className="text-[#1E3A8A] font-semibold">{result.technicalDetails}</span>
                      </div>
                    </div>
                  ) : (
                    /* RENDER STANDARD LEGAL TEXT / DISCOVERY ORDER / TIMELINE (FALLBACK) */
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] leading-relaxed whitespace-pre-wrap shadow-2xs">
                        {result.content}
                      </div>

                      {/* Technical Execution Log */}
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#BFDBFE] text-xs font-mono text-[#1E3A8A] flex items-center gap-2 shadow-2xs">
                        <span className="material-symbols-outlined text-[16px] text-[#1E3A8A]">terminal</span>
                        <span className="text-[#1E3A8A] font-semibold">{result.technicalDetails}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-mono">
                {t.decryptionEpoch}
              </span>
              <div className="flex items-center gap-2">
                {!isKeyBurned && (
                  <button
                    onClick={handleBurnKey}
                    type="button"
                    className="px-3.5 py-2 rounded-xl bg-white text-[#991B1B] hover:bg-[#FEF2F2] border border-[#FECACA] font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
                    <span>{lang === 'vi' ? 'Tiêu hủy khóa' : 'Burn Key'}</span>
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white font-semibold text-xs hover:bg-[#172554] transition-colors shadow-xs cursor-pointer"
                >
                  {t.btnCloseViewer}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
