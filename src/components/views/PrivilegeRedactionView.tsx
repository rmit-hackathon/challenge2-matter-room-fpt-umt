import React, { useState } from 'react';
import { UserProfile } from '../../types/matter';
import { TideCloakMatterService } from '../../lib/tidecloak';
import { useLanguage } from '../../context/LanguageContext';

interface PrivilegeRedactionViewProps {
  currentUser: UserProfile;
  onLogAudit: (action: string, status: 'BLOCKED_BY_TIDE', details: string) => void;
}

export const PrivilegeRedactionView: React.FC<PrivilegeRedactionViewProps> = ({
  currentUser,
  onLogAudit,
}) => {
  const { t } = useLanguage();
  const [showSim, setShowSim] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [logCount, setLogCount] = useState(4481);
  const [copied, setCopied] = useState(false);

  const handleIntercept = () => {
    setIsShaking(true);
    setShowSim(true);
    const nextCount = logCount + 1;
    setLogCount(nextCount);

    const result = TideCloakMatterService.attemptAdminOverride(currentUser);
    onLogAudit(
      'UNILATERAL_ACL_OVERRIDE_INTERCEPTED',
      'BLOCKED_BY_TIDE',
      `[SIMULATION LOG #${nextCount}]: ${result.logAudit}`
    );

    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      '7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f... [SEALED BY TIDE NODE FABRIC]'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>Matter 24-CV-8821</span>
          <span className="text-slate-300">/</span>
          <span>{t.navPrivilegeRedaction}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-extrabold tracking-tight">{t.firewallBreadcrumb}</span>
        </div>

        <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 px-3.5 py-1 rounded-full text-xs font-bold text-rose-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>{t.zeroDataAuthorityEnforced}</span>
        </div>
      </div>

      {/* Main Firewall & Intercept Card */}
      <div
        className={`bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all ${
          isShaking ? 'animate-shake ring-4 ring-rose-300' : ''
        }`}
      >
        {/* Top Decorative Judicial Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-amber-500 to-[#1E3A8A]" />

        <div className="p-8 sm:p-10 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">gpp_maybe</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    {t.firewallHeadline}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold uppercase">
                    {t.zeroDataAuthorityBadge}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  {t.firewallSubheadline}
                </p>
              </div>
            </div>

            <button
              onClick={handleIntercept}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/30 self-start sm:self-auto shrink-0 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">block</span>
              <span>{t.btnSimulateIntercept}</span>
            </button>
          </div>

          {/* High-Contrast Alert Box */}
          <div className="p-5 rounded-xl bg-rose-50 border-2 border-rose-300 text-slate-900 space-y-2 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-extrabold text-sm text-rose-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-rose-600">verified_user</span>
                <span>{t.tideZeroAuthorityEnforced}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-rose-800 text-xs font-bold shadow-xs border border-rose-300">
                {t.rootSysadminLevel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {t.firewallDesc}
            </p>
          </div>

          {/* Raw Encrypted Blob Container with Terminal Colors */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">terminal</span>
                <span>{t.rawEncryptedBlob}</span>
              </span>
              <button
                onClick={handleCopy}
                type="button"
                className="text-xs text-sky-400 flex items-center gap-1 font-bold hover:text-sky-300 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? t.copied : t.copyPayload}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 break-all select-all border border-slate-800 leading-relaxed">
              7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f...{' '}
              <span className="text-rose-400 font-extrabold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-600">
                [SEALED BY TIDE NODE FABRIC]
              </span>
            </div>
          </div>

          {/* Real-Time Simulation Log Box with High Visibility */}
          {showSim && (
            <div className="p-4 rounded-xl bg-rose-950/20 border-2 border-rose-400 font-mono text-xs text-rose-900 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-rose-700">
                <span className="material-symbols-outlined text-[16px]">gpp_bad</span>
                <span>SIMULATION LOG #{logCount}:</span>
              </div>
              <p className="font-extrabold text-rose-900">
                {t.simLogSysadminIntercepted}
              </p>
              <p className="text-slate-600 text-[11px] font-sans font-medium">
                {t.simResultDenied}
              </p>
            </div>
          )}

          {/* Security Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-blue-900">
                {t.attestationBoundary}
              </span>
              <span className="text-xs font-extrabold text-slate-900 mt-1">AMD SEV-SNP Enclave</span>
              <span className="text-[11px] text-blue-700 font-bold mt-0.5">{t.hardwareMemoryEncryption}</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-rose-900">
                {t.consensusRejection}
              </span>
              <span className="text-xs font-extrabold text-rose-800 mt-1">{t.zeroDelegatedAuthority}</span>
              <span className="text-[11px] text-rose-700 font-bold mt-0.5">{t.subpoenaBlindInvariant}</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-900">
                {t.keySynthesisTitle}
              </span>
              <span className="text-xs font-extrabold text-slate-900 mt-1">{t.survivorSovereignty}</span>
              <span className="text-[11px] text-emerald-700 font-bold mt-0.5">{t.ephemeralVolatileKeys}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
