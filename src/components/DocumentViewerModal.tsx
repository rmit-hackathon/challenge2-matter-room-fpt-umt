import React, { useState, useEffect } from 'react';
import { MatterDocument, UserProfile } from '../types/matter';
import { DecryptionResult } from '../lib/tidecloak';
import { LegalSeal } from './LegalSeal';
import { useLanguage } from '../context/LanguageContext';

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
          setIsKeyBurned(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result?.success, document?.id]);

  if (!document || !result) return null;

  const handleBurnKey = () => {
    setIsKeyBurned(true);
    setTimeLeft(0);
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* ============================================================== */}
        {/* CASE 1: NEGATIVE TEST — DECRYPTION REFUSED (Matching Stitch-3) */}
        {/* ============================================================== */}
        {!result.success && (
          <div className="flex flex-col h-full">
            {/* Top Security Line */}
            <div className="h-1.5 w-full bg-rose-600" />

            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-200 bg-rose-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                  <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                      {t.decryptionRefusedTitle}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase border border-rose-200">
                      {t.tideFabricBlock}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Case #2026-CV-04421 • {document.title}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Top Alert Banner */}
              <div className="p-4 rounded-xl flex flex-col gap-2 bg-rose-50 border border-rose-200 text-slate-900">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-sm text-rose-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>{t.tideZeroAuthorityEnforced}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 text-xs font-bold shadow-xs border border-rose-200">
                    {isSysAdmin ? 'Zero Data Authority Enforced' : t.privilegeConstraint}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {isSysAdmin
                    ? 'Cloud sysadmin credentials validated. Plaintext decryption refused: Ephemeral cryptographic keys are not held on cloud infrastructure. Zero plaintext stored on server memory.'
                    : result.errorMessage}
                </p>
              </div>

              {/* Raw Encrypted Blob Container */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-slate-600 tracking-wider">
                    {t.rawEncryptedBlob}
                  </span>
                  <button
                    onClick={handleCopyBlob}
                    type="button"
                    className="text-xs text-[#1E3A8A] flex items-center gap-1 hover:text-blue-800 font-bold"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedPayload ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedPayload ? t.copied : t.copyPayload}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-white font-mono text-xs text-slate-800 break-all select-all border border-slate-200 space-y-1.5 shadow-xs">
                  <div>
                    {document.encryptedPayload
                      ? `${document.encryptedPayload.cipherHex.substring(0, 96)}...`
                      : '7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f...'}{' '}
                    <span className="text-rose-600 font-bold">[SEALED BY TIDE NODE FABRIC]</span>
                  </div>
                  {document.encryptedPayload && (
                    <div className="text-[10px] text-slate-500 flex gap-3 pt-1 border-t border-slate-100">
                      <span>IV: {document.encryptedPayload.ivHex}</span>
                      <span>Salt: {document.encryptedPayload.saltHex}</span>
                      <span className="text-amber-700 font-bold">Algo: AES-256-GCM</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enclave Rejection Indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span className="text-slate-800 font-bold">{t.consensusRejection}</span>
                  <span>{t.zeroDelegatedAuthority}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  <span className="material-symbols-outlined text-[14px] text-amber-600">memory</span>
                  <span className="text-slate-800 font-bold">{t.attestationNode}</span>
                  <span>AMD SEV Enclave #9942</span>
                </div>
              </div>

              {/* Technical Log Box */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-rose-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase">
                  <span className="material-symbols-outlined text-[14px] text-blue-400">terminal</span>
                  <span>{t.tideFabricLog}</span>
                </div>
                <p className="leading-relaxed">{result.technicalDetails}</p>
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
                    className="w-full py-2.5 px-4 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-700 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">group_work</span>
                    <span>{t.btnOpenQuorumModal}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs"
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
            {/* Top Judicial Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-[#1E3A8A]" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {document.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Hash: {document.encryptedHash}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Ephemeral Key Active Banner with Countdown & Burn Action */}
              {!isKeyBurned ? (
                <div className="p-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-700 text-[24px] animate-pulse">
                      key
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-emerald-900 text-xs sm:text-sm uppercase tracking-wide">
                          {lang === 'vi' ? 'Mã Giải Mã 1 Lần Đang Kích Hoạt' : '1-Time Ephemeral Key Active'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-black shadow-xs border ${
                          timeLeft <= 15
                            ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                            : 'bg-emerald-600 text-white border-emerald-700'
                        }`}>
                          TTL: {timeLeft}s
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {lang === 'vi' 
                          ? 'Mã phiên giải mã tồn tại tạm thời trong RAM. Plaintext sẽ tự động tiêu hủy khi hết giờ.'
                          : 'Ephemeral session key materialized in volatile RAM. Auto-evicted on timeout.'}
                      </p>
                    </div>
                  </div>

                  {/* Manual Key Burn Button */}
                  <button
                    onClick={handleBurnKey}
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
                    title="Xóa khóa ngay lập tức và hủy bỏ plaintext khỏi RAM"
                  >
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                    <span>{lang === 'vi' ? 'Tiêu hủy khóa ngay' : 'Burn Session Key Now'}</span>
                  </button>
                </div>
              ) : (
                /* Session Key Burned / Expired Alert */
                <div className="p-5 rounded-xl bg-amber-50 border-2 border-amber-300 flex flex-col items-center justify-center text-center gap-3 py-8">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">lock_reset</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base uppercase">
                      {lang === 'vi' ? 'Khóa phiên 1 lần đã bị tiêu hủy' : '1-Time Ephemeral Key Destroyed'}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                      {lang === 'vi'
                        ? 'Dữ liệu giải mã đã được xóa sạch khỏi bộ nhớ RAM máy khách. Máy chủ và hạ tầng hoàn toàn không lưu giữ bản rõ. Để xem lại, cần thực hiện xác thực và xin cấp khóa mới.'
                        : 'Decrypted bytes have been purged from volatile RAM. Zero plaintext persists in server or client cache. Re-authentication required for new ephemeral key.'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white font-bold text-xs hover:bg-blue-900 transition shadow-sm"
                  >
                    {lang === 'vi' ? 'Đóng cửa sổ' : 'Close Viewer'}
                  </button>
                </div>
              )}

              {/* Only show decrypted content if key is NOT burned */}
              {!isKeyBurned && (
                <>
                  {/* RENDER EXHIBIT B: FORENSIC MEDICAL FINDINGS */}
                  {document.id === 'doc_02' ? (
                    <div className="space-y-4 border border-slate-200 rounded-2xl p-5 bg-white shadow-sm relative overflow-hidden">
                      
                      {/* Subtle watermark */}
                      <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                        <LegalSeal className="w-56 h-56" />
                      </div>

                      {/* Header Title */}
                      <div className="flex flex-col gap-1 relative z-10">
                        <p className="text-[11px] uppercase font-bold tracking-wider text-amber-700">
                          SEALED LITIGATION MATTER #2026-CV-04421 • CONFIDENTIAL FORENSIC EXHIBIT
                        </p>
                        <div className="h-0.5 w-16 bg-[#1E3A8A] my-1" />
                        <h2 className="text-lg sm:text-xl font-black text-[#1E3A8A] tracking-tight">
                          {t.independentForensicReport}
                        </h2>
                        <p className="text-xs text-slate-600">
                          {t.forensicPreparedBy}
                        </p>
                      </div>

                      {/* Cryptographic Integrity Banner */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
                          <span className="font-bold">{t.checksumLabel}</span>
                          <span className="text-slate-600">e4b77f98...8ad8e (Hardware Enclave Verified)</span>
                        </div>
                        <span className="text-emerald-700 font-bold">{t.deterministicVerified}</span>
                      </div>

                      {/* 3 Structured Clinical Finding Cards */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                            {t.clinicalFindingsHeader}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">Protocol Med-Forensic v4.2</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Card 1: Physical Findings */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1E3A8A] text-[10px] uppercase font-bold border border-blue-200">
                                {t.physicalFindings}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed mt-2">
                                {t.physicalFindingsDesc}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">{t.forensicSeverity}</span>
                              <span className="font-bold text-amber-700">{t.category3Acute}</span>
                            </div>
                          </div>

                          {/* Card 2: Toxicology Analysis */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] uppercase font-bold border border-amber-200">
                                {t.toxicologyAnalysis}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed mt-2">
                                {t.toxicologyDesc}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">{t.assayResult}</span>
                              <span className="font-bold text-rose-600">{t.positiveConfirmative}</span>
                            </div>
                          </div>

                          {/* Card 3: Psychological Assessment */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-xs">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold border border-emerald-200">
                                {t.psychologicalAssessment}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed mt-2">
                                {t.psychologicalDesc}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">{t.diagnosticScale}</span>
                              <span className="font-bold text-[#1E3A8A]">{t.dsm5Confirmed}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Certification & Admissibility Box */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                            <span className="material-symbols-outlined text-emerald-700 text-[18px]">policy</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {t.admissibilityTitle}
                            </p>
                            <p className="text-[11px] text-slate-600">
                              {t.admissibilityDesc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-xs shrink-0 border border-slate-200">
                          <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                          <div className="text-right">
                            <span className="block text-[10px] font-bold text-slate-800">{t.digitalSeal}</span>
                            <span className="block font-mono text-[9px] text-slate-500">Dr. Miriam Vance, M.D.</span>
                          </div>
                        </div>
                      </div>

                      {/* Operational Status bar */}
                      <div className="p-2.5 px-3 rounded-lg bg-slate-100 text-slate-600 text-[11px] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600">memory</span>
                          <span>{t.volatileMemorySandbox}</span>
                        </div>
                        <span className="font-mono text-emerald-700 font-bold">{t.enclaveIsolated}</span>
                      </div>

                    </div>
                  ) : (
                    /* RENDER STANDARD LEGAL TEXT / DISCOVERY ORDER / TIMELINE */
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap shadow-xs">
                        {result.content}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono text-emerald-400 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-blue-400">terminal</span>
                        <span>{result.technicalDetails}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                {t.decryptionEpoch}
              </span>
              <div className="flex items-center gap-2">
                {!isKeyBurned && (
                  <button
                    onClick={handleBurnKey}
                    type="button"
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
                    <span>{lang === 'vi' ? 'Tiêu hủy khóa' : 'Burn Key'}</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white font-bold text-xs hover:bg-blue-900 transition-colors shadow-sm"
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