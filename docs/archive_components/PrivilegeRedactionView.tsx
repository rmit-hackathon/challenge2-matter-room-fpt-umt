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
  const { t, lang } = useLanguage();
  const [isShaking, setIsShaking] = useState(false);
  const [logCount, setLogCount] = useState(4481);
  const [copied, setCopied] = useState(false);

  const handleIntercept = () => {
    setIsShaking(true);
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
      
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>{lang === 'vi' ? 'Hồ sơ 24-CV-8821' : 'Matter 24-CV-8821'}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-semibold">{t.navPrivilegeRedaction}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-bold">{t.firewallBreadcrumb}</span>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.zeroDataAuthorityEnforced}</span>
        </div>
      </div>

      {/* Main Focus Card */}
      <div
        className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 ${
          isShaking ? 'animate-shake ring-4 ring-rose-200' : ''
        }`}
      >
        {/* Subtle Brand Accent Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1E3A8A] via-sky-500 to-emerald-500" />

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Header Block: 1 Focused Headline + 1 Clear Action */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {t.firewallHeadline}
                  </h1>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {t.firewallSubheadline}
                </p>
              </div>
            </div>

            <button
              onClick={handleIntercept}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-[0.98] self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">shield</span>
              <span>{t.btnSimulateIntercept}</span>
            </button>
          </div>

          {/* Central Proof Sandbox: 2 Clear Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Panel 1: What the Server Actually Sees (Raw Encrypted Ciphertext) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[17px] text-slate-500">dns</span>
                  <span>{t.rawEncryptedBlob}</span>
                </div>
                <button
                  onClick={handleCopy}
                  type="button"
                  className="text-xs text-[#1E3A8A] hover:text-blue-900 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? t.copied : t.copyPayload}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs break-all select-all leading-relaxed border border-slate-800">
                7a9f02b1c8e4d3a2f1b0c9d8e7f6a5b4c3d2e1f08b7a6c5d4e3f2a1b0c9d8e7f...{' '}
                <span className="text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded text-[11px]">
                  {lang === 'vi' ? '[ĐÃ MÃ HÓA]' : '[ENCRYPTED]'}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-normal">
                {lang === 'vi' 
                  ? 'Máy chủ chỉ lưu các khối dữ liệu mã hóa AES-256 vô nghĩa. Quản trị viên root không thể đọc được nội dung.' 
                  : 'The hosting server holds only AES-256 encrypted blocks. Cloud sysadmins cannot read the underlying content.'}
              </p>
            </div>

            {/* Panel 2: Live Security Intercept Response */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 sm:p-5 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <span className="material-symbols-outlined text-[17px] text-rose-600">block</span>
                  <span>
                    {lang === 'vi' ? `KẾT QUẢ KIỂM TRA #${logCount}` : `SECURITY LOG #${logCount}`}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 text-[11px] font-bold border border-rose-200 shadow-2xs">
                  {lang === 'vi' ? 'Bị từ chối (403)' : 'Denied (403)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/90 border border-rose-200 space-y-1.5 text-xs">
                <p className="font-semibold text-rose-900 leading-snug">
                  {t.simLogSysadminIntercepted}
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {t.simResultDenied}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  {lang === 'vi' 
                    ? '7/7 máy chủ phân tán đồng thuận xác thực và bảo vệ an toàn.' 
                    : '7/7 distributed nodes verified consensus and protected the data.'}
                </span>
              </div>
            </div>

          </div>

          {/* 3 Core Security Pillars (Clean & Informative, No Jargon Overload) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            
            {/* Pillar 1: Hardware Protection */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#1E3A8A]">
                <span className="material-symbols-outlined text-[18px]">memory</span>
                <span className="text-xs font-bold">{t.attestationBoundary}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {t.hardwareMemoryEncryption}
              </p>
            </div>

            {/* Pillar 2: Dual Party Consent */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-amber-700">
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span className="text-xs font-bold">{t.consensusRejection}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {t.zeroDelegatedAuthority}
              </p>
            </div>

            {/* Pillar 3: Ephemeral Self-Deleting Keys */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-emerald-700">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span className="text-xs font-bold">{t.keySynthesisTitle}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {t.ephemeralVolatileKeys}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
