import React, { useState } from 'react';
import { QuorumRequest, UserProfile } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const req = quorumRequests[0];
  const isApproved = req?.status === 'APPROVED' || (req && req.approvals.length >= req.threshold);

  const handleSign = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      onApproveQuorum(req.id);
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Top Action Breadcrumb & Context Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>Matter 24-CV-8821</span>
          <span className="text-slate-300">/</span>
          <span>Escrow Approvals</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-extrabold tracking-tight">Docket Key 892-D</span>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3.5 py-1 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono text-xs text-amber-900 font-bold">
            TideCloak Escrow Session #TC-9914
          </span>
        </div>
      </div>

      {/* The Quorum Signoff Centerstage Container */}
      <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Top Decorative Judicial Stripe with Full Color Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-amber-500 to-emerald-500" />

        <div className="p-8 sm:p-10 flex flex-col gap-7">
          
          {/* 1. Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    {t.tideQuorumEscrowTitle}
                  </h1>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>{t.quorumCompletedBadge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                      <span>{t.pendingSignoffBadge}</span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  {t.quorumSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-lg text-slate-700 font-mono text-xs self-start sm:self-auto border border-slate-200 font-semibold shadow-2xs">
              <span className="material-symbols-outlined text-[16px] text-amber-600">history_toggle_off</span>
              <span>{t.lockExpires}</span>
            </div>
          </div>

          {/* 2. Target Evidence Escrow Manifest */}
          <div className="bg-slate-50/80 rounded-xl p-5 flex flex-col gap-3.5 border border-slate-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">description</span>
                <span>{t.targetEvidenceManifest}</span>
              </span>
              <span className="font-mono text-xs text-[#1E3A8A] bg-white px-2.5 py-1 rounded-md shadow-xs border border-blue-200 font-bold">
                SHA-256: 4b901a...f89c02
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Card 1: Target Evidence */}
              <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {t.targetEvidence}
                  </span>
                  <p className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                    Exhibit B: Forensic Medical Trauma Evaluation
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold w-fit">
                  <span className="material-symbols-outlined text-[15px]">attachment</span>
                  <span>Payload Size: 24.5 MB</span>
                </div>
              </div>

              {/* Card 2: Beneficiary */}
              <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {t.beneficiary}
                  </span>
                  <p className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                    Dr. Miriam Vance, M.D.
                  </p>
                  <span className="text-xs text-slate-600 mt-0.5 block font-medium">
                    Forensic Medical Examiner
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs font-bold w-fit">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>FIPS 140-2 Level 3 Enclave</span>
                </div>
              </div>

              {/* Card 3: Purpose & Scope */}
              <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    PURPOSE &amp; SCOPE
                  </span>
                  <p className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                    Court-Ordered Independent Trauma Review
                  </p>
                  <span className="text-xs text-slate-600 mt-0.5 block font-medium">
                    Strict limited access under F.R.C.P. 26(c)
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs font-bold w-fit">
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  <span>Watermarked with Ephemeral Token</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Required Signatures Pipeline */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1E3A8A] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
                <span>{t.requiredSignaturesPipeline}</span>
              </h2>
              <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {t.strict2of2Consensus}
              </span>
            </div>

            {/* Card 1: Signed (Jane Doe - Survivor / Primary Data Owner) */}
            <div className="bg-gradient-to-r from-emerald-50/90 via-white to-white rounded-xl p-5 shadow-sm border-2 border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base text-slate-900">Jane Doe</span>
                    <span className="text-xs text-slate-600 font-semibold">— {t.survivorDataOwner}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                      {t.signedAndConsented}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-slate-600 font-mono text-xs flex-wrap font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">schedule</span>
                      Signed: 2026-10-22 10:15:32 UTC
                    </span>
                    <span>•</span>
                    <span>Key Enclave: NE-01 (Verified Token)</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Consent Slot 1 Committed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-blue-100 border border-blue-300 px-3.5 py-1.5 rounded-lg self-start md:self-auto text-blue-900 font-mono text-xs font-bold shadow-2xs">
                <span className="material-symbols-outlined text-[16px] text-blue-700">fingerprint</span>
                <span>SIG: 0x9e...2a11</span>
              </div>
            </div>

            {/* Card 2: Lead Counsel (Elena Howard, Esq.) */}
            <div
              className={`rounded-xl p-5 shadow-sm border-2 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all ${
                isApproved
                  ? 'bg-gradient-to-r from-emerald-50/90 via-white to-white border-emerald-200'
                  : 'bg-gradient-to-r from-amber-50/90 via-white to-white border-amber-300 ring-2 ring-amber-100'
              }`}
            >
              <div className="flex items-start gap-4 max-w-xl">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                    isApproved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isApproved ? 'check' : 'key'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base text-[#0F172A]">Elena Howard, Esq.</span>
                    <span className="text-xs text-slate-600 font-semibold">— {t.leadTrialCounsel}</span>
                    {isApproved ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                        {t.signedAndConsented}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold animate-pulse">
                        {t.actionRequired}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 font-semibold leading-relaxed">
                    {isApproved
                      ? t.counselSignedCommitted
                      : t.counselAwaitingSignoff}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs flex-wrap font-bold">
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="material-symbols-outlined text-[15px]">check</span>
                      Hardware Token Ready
                    </span>
                    <span className="flex items-center gap-1 text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      <span className="material-symbols-outlined text-[15px]">verified_user</span>
                      Privileged Authority Validated
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                {!isApproved ? (
                  currentUser.role === 'LEAD_COUNSEL' ? (
                    <button
                      onClick={handleSign}
                      disabled={isBroadcasting}
                      type="button"
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#172554] transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/40 active:scale-[0.98] font-bold text-sm"
                    >
                      <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                      <span>
                        {isBroadcasting
                          ? 'Broadcasting Signed Escrow Block...'
                          : t.btnSignAuthorize}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">info</span>
                      <span>{t.switchToCounselPrompt}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 bg-blue-100 border border-blue-300 px-3.5 py-1.5 rounded-lg text-blue-900 font-mono text-xs font-bold shadow-2xs">
                    <span className="material-symbols-outlined text-[16px] text-blue-700">fingerprint</span>
                    <span>SIG: 0x4f...9a02</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Security Guarantee Badges with High Color Saturation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">group_work</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-900 uppercase font-extrabold tracking-wider">
                  CONSENSUS MODEL
                </span>
                <span className="text-xs text-slate-900 font-extrabold">2 of 2 Required (100%)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-900 uppercase font-extrabold tracking-wider">
                  KEY LIFESPAN
                </span>
                <span className="text-xs text-slate-900 font-extrabold">24h Ephemeral Window</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 shadow-2xs">
              <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-rose-900 uppercase font-extrabold tracking-wider">
                  REVOCATION POLICY
                </span>
                <span className="text-xs text-slate-900 font-extrabold">Survivor Unilateral Killswitch</span>
              </div>
            </div>
          </div>

          {/* 5. Footer with Cancel, Escrow Charter & Vibrant Progress Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-300"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span>Cancel Escrow Request</span>
              </button>

              <button
                type="button"
                className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-600">help</span>
                <span>Escrow Charter</span>
              </button>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isApproved ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-1/2'
                  }`}
                />
              </div>
              <span className="text-xs font-extrabold text-[#1E3A8A]">
                {isApproved ? '2 / 2 Signatures Recorded' : '1 / 2 Signatures Recorded'}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Verification Hash Strip */}
        <div className="p-4 px-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">account_balance</span>
            <span className="text-slate-500 uppercase font-bold">ESCROW VERIFICATION HASH:</span>
            <span className="text-[#1E3A8A] font-extrabold">TIDE-ESCROW-2026-Q4-00918-BATES-NEXA-002194</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Court-Admissible Timestamp Anchor (RFC 3161)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
