import React from 'react';
import { QuorumRequest, UserProfile } from '../types/matter';

interface QuorumManagementModalProps {
  requests: QuorumRequest[];
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string) => void;
}

export const QuorumManagementModal: React.FC<QuorumManagementModalProps> = ({
  requests,
  currentUser,
  isOpen,
  onClose,
  onApprove
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <span className="material-symbols-outlined text-[26px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg sm:text-xl text-primary tracking-tight">
                  Tide Emergent Quorum Escrow
                </h2>
                {requests.some(r => r.status === 'APPROVED') ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                    <span>QUORUM COMPLETED (2/2)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-container text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>PENDING SIGNOFF (1/2 COMPLETED)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Dual consensus required to release Exhibit B to Medical Examiner Dr. Miriam Vance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded text-on-surface-variant font-mono text-xs">
              <span className="material-symbols-outlined text-[15px]">history_toggle_off</span>
              <span>Lock Expires: 21h 44m</span>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {requests.map((req) => {
            const hasCounselSigned = req.approvals.some(
              a => a.signerRole === 'LEAD_COUNSEL'
            );
            const canCounselSign = currentUser.role === 'LEAD_COUNSEL' && !hasCounselSigned;
            const isApproved = req.status === 'APPROVED' || req.approvals.length >= req.threshold;

            return (
              <div key={req.id} className="space-y-4">
                
                {/* 1. Target Summary Manifest Box */}
                <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 flex flex-col gap-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>Target Evidence Escrow Manifest</span>
                    </span>
                    <span className="font-mono text-xs text-primary bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm border border-outline-variant/20">
                      SHA-256: 3c7e...44d9
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                          Target Evidence
                        </span>
                        <p className="font-semibold text-xs text-on-surface mt-1">
                          Exhibit B: Forensic Medical Trauma Evaluation
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-secondary text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px]">attachment</span>
                        <span>Payload Size: 24.5 MB</span>
                      </div>
                    </div>

                    <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                          Beneficiary
                        </span>
                        <p className="font-semibold text-xs text-on-surface mt-1">
                          Dr. Miriam Vance, M.D.
                        </p>
                        <span className="text-[11px] text-on-surface-variant">
                          Forensic Medical Examiner
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-tertiary-container text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                        <span>Identity Enclave Verified</span>
                      </div>
                    </div>

                    <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant">
                          Enclave Policy
                        </span>
                        <p className="font-semibold text-xs text-on-surface mt-1">
                          2-of-2 Dual Signature
                        </p>
                        <span className="text-[11px] text-on-surface-variant">
                          Survivor + Lead Counsel
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-primary text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                        <span>Strict M-of-N Quorum</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-on-surface-variant italic pt-1">
                    Reason: "{req.reason}"
                  </div>
                </div>

                {/* 2. Required Signatures Pipeline (Cards 1 & 2) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface">
                      Required Signatures Pipeline
                    </h3>
                    <span className="text-xs text-on-surface-variant font-medium">
                      Strict 2-of-2 Cryptographic Consensus
                    </span>
                  </div>

                  {/* Card 1: Signed by Survivor (Jane Doe) */}
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-tertiary-fixed/15 via-surface-container-lowest to-surface-container-lowest">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-[22px]">check_circle</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-on-surface">Jane Doe</span>
                          <span className="text-xs text-on-surface-variant">— Survivor / Primary Data Owner</span>
                          <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                            Signed &amp; Consented
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-mono text-xs flex-wrap">
                          <span>Signed: 2026-10-22 10:15:32 UTC</span>
                          <span>•</span>
                          <span>Key Enclave: NE-01 (Verified Token)</span>
                          <span>•</span>
                          <span className="text-tertiary-container font-semibold">Consent Slot 1 Committed</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg self-start sm:self-auto text-primary font-mono text-xs border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                      <span>SIG: 0x71a2...ce89</span>
                    </div>
                  </div>

                  {/* Card 2: Lead Counsel (Elena Howard, Esq.) */}
                  <div
                    className={`bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                      isApproved
                        ? 'bg-gradient-to-r from-tertiary-fixed/15 via-surface-container-lowest to-surface-container-lowest'
                        : 'bg-gradient-to-r from-secondary-fixed/25 via-surface-container-lowest to-surface-container-lowest'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                          isApproved
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-secondary-fixed text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {isApproved ? 'check_circle' : 'key'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-on-surface">Elena Howard, Esq.</span>
                          <span className="text-xs text-on-surface-variant">— Lead Trial Counsel</span>
                          {isApproved ? (
                            <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                              Signed &amp; Consented
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold animate-pulse">
                              Action Required
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-on-surface-variant mt-1">
                          {isApproved
                            ? 'Counsel authorization committed to Tide Fabric. Dual quorum threshold satisfied (2/2).'
                            : 'Awaiting your legal counsel signoff to establish quorum and finalize medical examiner release.'}
                        </p>

                        {isApproved && (
                          <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-mono text-xs flex-wrap">
                            <span>Signed: 2026-10-22 13:00:00 UTC</span>
                            <span>•</span>
                            <span>Key Enclave: NE-02 (Verified Token)</span>
                            <span>•</span>
                            <span className="text-tertiary-container font-semibold">Consent Slot 2 Committed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action button if pending */}
                    {!isApproved && (
                      <div className="self-start lg:self-auto shrink-0">
                        {canCounselSign ? (
                          <button
                            onClick={() => onApprove(req.id)}
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition shadow-md"
                          >
                            <span className="material-symbols-outlined text-[18px]">key</span>
                            <span>Sign &amp; Authorize via TideCloak Fabric (as Elena Howard, Esq.)</span>
                          </button>
                        ) : (
                          <span className="text-xs text-secondary font-semibold bg-secondary-fixed/40 px-3 py-1.5 rounded-lg border border-secondary/30">
                            Switch to Lead Counsel Persona to Sign
                          </span>
                        )}
                      </div>
                    )}

                    {isApproved && (
                      <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg self-start lg:self-auto text-primary font-mono text-xs border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                        <span>SIG: 0x4f8e...9a02</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* TSS Cryptographic Key Synthesis Terminal */}
                <div className={`p-3.5 rounded-xl border text-xs font-mono transition-all ${
                  isApproved 
                    ? 'bg-emerald-50/70 border-emerald-200 text-tertiary-container' 
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <span className="material-symbols-outlined text-[16px]">
                        {isApproved ? 'key_vertical' : 'lock_clock'}
                      </span>
                      <span>Threshold Signature Scheme (TSS) Synthesis</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest font-semibold border border-outline-variant/20">
                      {isApproved ? 'KEY SLOT SYNTHESIZED' : 'MATHEMATICALLY LOCKED (1/2)'}
                    </span>
                  </div>
                  {isApproved ? (
                    <div className="space-y-0.5 text-[11px]">
                      <p className="text-on-surface">Derived Enclave Key Seed: <span className="font-semibold text-tertiary-container">TIDE_EMERGENT_QUORUM_SEED:0x71a2ce89:0x4f8e9a02:SDNY_CASE_2026_CV_4421</span></p>
                      <p className="text-on-surface-variant">Ephemeral AES-256-GCM decryption key assembled into volatile memory. Zero plaintext held on database servers.</p>
                    </div>
                  ) : (
                    <p className="text-[11px]">
                      2-of-2 dual signatures required to compute PBKDF2 seed. Currently, only Jane Doe (Survivor) signature committed. Dr. Miriam Vance cannot decrypt Exhibit B.
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-low/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-on-surface-variant gap-2">
          <p>
            Cryptographic Multi-Party Proof: Neither party alone can decrypt or delegate access. Keys materialize only when both threshold signatures converge.
          </p>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors shrink-0"
          >
            Close Escrow Manager
          </button>
        </div>

      </div>
    </div>
  );
};
