import React from 'react';
import { LegalSeal } from '../LegalSeal';
import { useLanguage } from '../../context/LanguageContext';

export const LitigationHoldsView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>Matter 24-CV-8821</span>
          <span className="text-slate-300">/</span>
          <span>{t.navLitigationHolds}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-extrabold tracking-tight">{t.courtInjunctionsBreadcrumb}</span>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold text-amber-900 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>{t.permanentSealBadge}</span>
        </div>
      </div>

      {/* Court Protective Order Card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {/* Top Decorative Judicial Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-amber-500 to-indigo-600" />

        <div className="p-7 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E3A8A] shadow-sm">
              <span className="material-symbols-outlined text-[26px]">gavel</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                {t.courtOrderHeadline}
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                {t.courtOrderJurisdiction}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 font-mono">
            <p className="font-extrabold text-[#1E3A8A] font-sans text-sm">
              {t.mandatoryInjunctionTitle}
            </p>
            <p>{t.injunctionP1}</p>
            <p>{t.injunctionP2}</p>
            <p>{t.injunctionP3}</p>
          </div>
        </div>
      </div>

      {/* Forensic Medical Findings Card (Stitch-5) */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden relative">
        {/* Subtle Watermark */}
        <div className="absolute right-2 top-2 opacity-5 pointer-events-none">
          <LegalSeal className="w-72 h-72" />
        </div>

        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-blue-700" />

        <div className="p-7 sm:p-8 flex flex-col gap-5 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300 w-fit">
              {t.exhibitBBadge}
            </span>
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              {t.exhibitBHeadline}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {t.exhibitBDoctor}
            </p>
          </div>

          {/* 3 Clinical Finding Cards with High Color Accents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between gap-3 shadow-2xs">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-[10px] uppercase font-extrabold">
                  {t.physicalFindings}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed mt-2 font-medium">
                  {t.physicalFindingsDesc}
                </p>
              </div>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">{t.severityLabel}</span>
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  {t.category3Acute}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between gap-3 shadow-2xs">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-extrabold">
                  {t.toxicologyAnalysis}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed mt-2 font-medium">
                  {t.toxicologyDesc}
                </p>
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">{t.assayResultLabel}</span>
                <span className="text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                  {t.positiveConfirmative}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between gap-3 shadow-2xs">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] uppercase font-extrabold">
                  {t.psychologicalAssessment}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed mt-2 font-medium">
                  {t.psychologicalDesc}
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">{t.diagnosticScaleLabel}</span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {t.dsm5Confirmed}
                </span>
              </div>
            </div>
          </div>

          {/* Certification Box with Green Seal */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-emerald-700">policy</span>
              <div>
                <p className="text-xs font-extrabold text-emerald-950">{t.fedEvidStandard}</p>
                <p className="text-[11px] text-emerald-800 font-medium">{t.fedEvidSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white shadow-xs border border-emerald-300 shrink-0">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
              <div className="text-right">
                <span className="block text-[10px] font-extrabold text-slate-900">{t.digitalSeal}</span>
                <span className="block font-mono text-[9px] text-emerald-800 font-bold">Dr. Miriam Vance, M.D.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
