import React from 'react';
import { UserProfile } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface MatterHeaderProps {
  currentUser: UserProfile;
  pendingQuorumCount: number;
  onOpenQuorumModal: () => void;
  onOpenMerkleModal: () => void;
}

export const MatterHeader: React.FC<MatterHeaderProps> = ({
  currentUser,
  pendingQuorumCount,
  onOpenQuorumModal,
  onOpenMerkleModal
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 mb-6">
      
      {/* Top Breadcrumb & Status Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-semibold text-xs tracking-wide border border-outline-variant/30">
            <span className="material-symbols-outlined text-[15px] text-primary">gavel</span>
            <span>{t.sealedLitigationTag}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-tertiary-container text-xs font-semibold border border-tertiary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse" />
            <span>{t.enclaveSecured}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs">
          <span className="material-symbols-outlined text-[16px] text-tertiary-container">
            enhanced_encryption
          </span>
          <span>{t.rootKey}: 0x91F4...B62A</span>
          <span className="text-outline-variant">•</span>
          <span>{t.epoch}: 04</span>
          <span className="text-outline-variant">•</span>
          <span>{t.fabricLatency}: 18ms</span>
        </div>
      </div>

      {/* Section 1: Matter Summary Header Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] border border-outline-variant/30 relative overflow-hidden flex flex-col gap-6">
        
        {/* Watermark Graphic */}
        <div className="absolute -right-8 -bottom-10 opacity-[0.035] pointer-events-none text-primary select-none">
          <span className="material-symbols-outlined text-[240px]">balance</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase tracking-wider font-bold text-secondary">
                {t.litigationMatterRoom}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant font-medium">{t.confidentialDocketEscrow}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              {t.caseTitle}
            </h1>

            <p className="text-sm text-on-surface-variant leading-relaxed max-w-4xl">
              {t.caseSubtitle}
            </p>

            {/* Sysadmin Warning alert when active */}
            {currentUser.role === 'IT_ADMIN' && (
              <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
                <span>
                  {t.adminWarning}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={onOpenQuorumModal}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container text-primary font-semibold text-xs hover:bg-surface-container-high transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">group_work</span>
              <span>{t.manageQuorumEscrow}</span>
              {pendingQuorumCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
                  {pendingQuorumCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenMerkleModal}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-primary text-on-primary font-semibold text-xs hover:bg-primary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{t.inspectMerkleProof}</span>
            </button>
          </div>
        </div>

        {/* 3 Clean Airy Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          
          {/* Card 1: Protection Status */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                {t.protectionStatusTitle}
              </span>
              <div className="w-7 h-7 rounded flex items-center justify-center bg-surface-container-lowest text-secondary shadow-sm">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary tracking-tight">
                {t.courtGagOrder}
              </div>
              <p className="text-xs font-semibold text-secondary mt-0.5">
                {t.mandatoryInjunction}
              </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[14px] text-tertiary-container">verified</span>
              <span>{t.enforcedEnclave}</span>
            </div>
          </div>

          {/* Card 2: Multi-Sig Quorum */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                {t.multiSigQuorumTitle}
              </span>
              <div className="w-7 h-7 rounded flex items-center justify-center bg-tertiary text-tertiary-fixed shadow-sm">
                <span className="material-symbols-outlined text-[18px]">group_work</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-on-surface">{t.twoOfTwoQuorum}</span>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase">
                  {t.survivorSovereign}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {t.dualConsent}
              </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[14px] text-secondary">key</span>
              <span>{t.expertProtocol}</span>
            </div>
          </div>

          {/* Card 3: Enclave Sealed Files */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                {t.sealedFilesTitle}
              </span>
              <div className="w-7 h-7 rounded flex items-center justify-center bg-primary text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[18px]">shield</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-on-surface">{t.filesProtectedCount}</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[10px] font-bold uppercase">
                  {t.hundredPercentBlinded}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {t.zeroPlaintext}
              </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[14px] text-primary">memory</span>
              <span>{t.sessionBoundKeys}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
