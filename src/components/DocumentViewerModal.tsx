import React, { useState } from 'react';
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
  const { t } = useLanguage();
  const [copiedPayload, setCopiedPayload] = useState(false);

  if (!document || !result) return null;

  const handleCopyBlob = () => {
    const rawPayload = document.encryptedPayload
      ? JSON.stringify(document.encryptedPayload, null, 2)
      : '7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f... [SEALED BY TIDE NODE FABRIC]';
    navigator.clipboard.writeText(rawPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* ============================================================== */}
        {/* CASE 1: NEGATIVE TEST — DECRYPTION REFUSED (Matching Stitch-3) */}
        {/* ============================================================== */}
        {!result.success && (
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-on-surface tracking-tight">
                      {t.decryptionRefusedTitle}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-semibold uppercase">
                      {t.tideFabricBlock}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Case #2026-CV-04421 • {document.title}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Top Alert Banner */}
              <div className="p-4 rounded-xl flex flex-col gap-2 bg-red-50 border border-red-200 text-on-surface">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-sm text-error flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>{t.tideZeroAuthorityEnforced}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-error text-xs font-semibold shadow-sm border border-error/20">
                    {currentUser.role === 'IT_ADMIN'
                      ? t.rootSysadminLevel
                      : t.privilegeConstraint}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  {currentUser.role === 'IT_ADMIN'
                    ? 'Cloud sysadmin credentials validated. Plaintext decryption refused: Ephemeral cryptographic keys are not held on cloud infrastructure. Zero plaintext stored on server memory.'
                    : result.errorMessage}
                </p>
              </div>

              {/* Raw Encrypted Blob Container */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">
                    {t.rawEncryptedBlob}
                  </span>
                  <button
                    onClick={handleCopyBlob}
                    type="button"
                    className="text-xs text-primary flex items-center gap-1 hover:text-primary-container font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedPayload ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedPayload ? t.copied : t.copyPayload}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded bg-surface-container-lowest font-mono text-xs text-on-surface break-all select-all border border-outline-variant/20 space-y-1">
                  <div>
                    {document.encryptedPayload
                      ? `${document.encryptedPayload.cipherHex.substring(0, 96)}...`
                      : '7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f...'}{' '}
                    <span className="text-error font-semibold">[SEALED BY TIDE NODE FABRIC]</span>
                  </div>
                  {document.encryptedPayload && (
                    <div className="text-[10px] text-on-surface-variant flex gap-3 pt-1 border-t border-outline-variant/10">
                      <span>IV: {document.encryptedPayload.ivHex}</span>
                      <span>Salt: {document.encryptedPayload.saltHex}</span>
                      <span className="text-secondary font-semibold">Algo: AES-256-GCM</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enclave Rejection Indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container">
                  <span className="w-1.5 h-1.5 rounded-full bg-error" />
                  <span className="text-on-surface font-semibold">{t.consensusRejection}</span>
                  <span>{t.zeroDelegatedAuthority}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container">
                  <span className="material-symbols-outlined text-[14px] text-tertiary-container">memory</span>
                  <span className="text-on-surface font-semibold">{t.attestationNode}</span>
                  <span>AMD SEV Enclave #9942</span>
                </div>
              </div>

              {/* Technical Log Box */}
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 font-mono text-xs text-error space-y-1">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-bold uppercase">
                  <span className="material-symbols-outlined text-[14px] text-primary">terminal</span>
                  <span>{t.tideFabricLog}</span>
                </div>
                <p>{result.technicalDetails}</p>
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
                    className="w-full py-2.5 px-4 bg-secondary text-on-secondary font-semibold text-xs rounded-lg hover:bg-secondary-container transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">group_work</span>
                    <span>{t.btnOpenQuorumModal}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors"
              >
                {t.btnCloseViewer}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 2: SUCCESSFUL DECRYPTION (Matching Stitch-5 for Med Exam) */}
        {/* ============================================================== */}
        {result.success && (
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">
                    {document.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono">
                    Hash: {document.encryptedHash}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              
              {/* Decryption Success Banner */}
              <div className="p-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary-container text-[24px]">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-tertiary-container text-xs sm:text-sm">
                      {t.decryptedSuccessTitle}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {t.decryptedSuccessSubtitle}
                    </p>
                  </div>
                </div>
                {result.algorithm && (
                  <div className="flex items-center gap-2 font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-emerald-200 text-tertiary-container shadow-xs">
                    <span>{result.algorithm}</span>
                    <span>•</span>
                    <span>{result.latencyMs || 8}ms</span>
                  </div>
                )}
              </div>

              {/* RENDER EXHIBIT B: FORENSIC MEDICAL FINDINGS (Matching Stitch-5) */}
              {document.id === 'doc_02' ? (
                <div className="space-y-4 border border-outline-variant/30 rounded-xl p-5 bg-surface-container-lowest shadow-sm relative overflow-hidden">
                  
                  {/* Subtle watermark */}
                  <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                    <LegalSeal className="w-56 h-56" />
                  </div>

                  {/* Header Title */}
                  <div className="flex flex-col gap-1 relative z-10">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-secondary">
                      SEALED LITIGATION MATTER #2026-CV-04421 • CONFIDENTIAL FORENSIC EXHIBIT
                    </p>
                    <div className="h-0.5 w-16 bg-primary-container/20 my-1" />
                    <h2 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
                      {t.independentForensicReport}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {t.forensicPreparedBy}
                    </p>
                  </div>

                  {/* Cryptographic Integrity Banner */}
                  <div className="flex items-center justify-between p-2.5 px-3 rounded bg-surface-container-low text-xs text-on-surface flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-container">lock</span>
                      <span className="font-semibold">{t.checksumLabel}</span>
                      <span className="text-on-surface-variant">e4b77f98...8ad8e (Hardware Enclave Verified)</span>
                    </div>
                    <span className="text-tertiary-container font-semibold">{t.deterministicVerified}</span>
                  </div>

                  {/* 3 Structured Clinical Finding Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                        {t.clinicalFindingsHeader}
                      </h4>
                      <span className="text-[11px] text-on-surface-variant">Protocol Med-Forensic v4.2</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Card 1: Physical Findings */}
                      <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-surface-container-high text-primary text-[10px] uppercase font-bold">
                            {t.physicalFindings}
                          </span>
                          <p className="text-xs text-on-surface leading-relaxed mt-2">
                            {t.physicalFindingsDesc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">{t.forensicSeverity}</span>
                          <span className="font-bold text-secondary">{t.category3Acute}</span>
                        </div>
                      </div>

                      {/* Card 2: Toxicology Analysis */}
                      <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-surface-container-high text-secondary text-[10px] uppercase font-bold">
                            {t.toxicologyAnalysis}
                          </span>
                          <p className="text-xs text-on-surface leading-relaxed mt-2">
                            {t.toxicologyDesc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">{t.assayResult}</span>
                          <span className="font-bold text-error">{t.positiveConfirmative}</span>
                        </div>
                      </div>

                      {/* Card 3: Psychological Assessment */}
                      <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-surface-container-high text-tertiary-container text-[10px] uppercase font-bold">
                            {t.psychologicalAssessment}
                          </span>
                          <p className="text-xs text-on-surface leading-relaxed mt-2">
                            {t.psychologicalDesc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">{t.diagnosticScale}</span>
                          <span className="font-bold text-primary">{t.dsm5Confirmed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certification & Admissibility Box */}
                  <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">policy</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-on-surface">
                          {t.admissibilityTitle}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {t.admissibilityDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface-container-lowest shadow-sm shrink-0 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-on-surface">{t.digitalSeal}</span>
                        <span className="block font-mono text-[9px] text-on-surface-variant">Dr. Miriam Vance, M.D.</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Status bar */}
                  <div className="p-2.5 px-3 rounded bg-surface-container-high text-on-surface-variant text-[11px] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-tertiary-container">memory</span>
                      <span>{t.volatileMemorySandbox}</span>
                    </div>
                    <span className="font-mono text-tertiary-container font-semibold">{t.enclaveIsolated}</span>
                  </div>

                </div>
              ) : (
                /* RENDER STANDARD LEGAL TEXT / DISCOVERY ORDER / TIMELINE */
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 font-mono text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
                    {result.content}
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-high text-xs font-mono text-tertiary-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">terminal</span>
                    <span>{result.technicalDetails}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-mono">
                {t.decryptionEpoch}
              </span>
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded bg-primary text-on-primary font-semibold text-xs hover:bg-primary-container transition-colors shadow-sm"
              >
                {t.btnCloseViewer}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
