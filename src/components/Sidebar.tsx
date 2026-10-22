import React from 'react';
import { NavTab } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingQuorumCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, pendingQuorumCount }) => {
  const { t } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: string; iconColor: string; badge?: number }[] = [
    { id: 'evidence-matrix', label: t.navEvidenceMatrix, icon: 'folder_supervised', iconColor: 'text-blue-600' },
    { id: 'quorum-approvals', label: t.navQuorumApprovals, icon: 'how_to_reg', iconColor: 'text-amber-600', badge: pendingQuorumCount },
    { id: 'privilege-and-redaction', label: t.navPrivilegeRedaction, icon: 'lock_reset', iconColor: 'text-rose-600' },
    { id: 'immutable-audit-trail', label: t.navImmutableAuditTrail, icon: 'receipt_long', iconColor: 'text-emerald-600' },
    { id: 'litigation-holds', label: t.navLitigationHolds, icon: 'gavel', iconColor: 'text-indigo-600' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 bg-white z-40 flex flex-col justify-between py-6 border-r border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="px-4">
        {/* Category Header */}
        <div className="px-3 pb-3 mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
            {t.vdrTitle}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="VDR Enclave Live" />
        </div>

        {/* Navigation Items with Rich Color Contrast */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white font-bold shadow-[0_4px_12px_rgba(30,58,138,0.28)] translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors ${
                      isActive ? 'text-white' : item.iconColor
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Session Seal Box with Vibrant Trust Indicators */}
      <div className="px-5">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#1E3A8A] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px] text-blue-600">verified_user</span>
              <span className="uppercase tracking-wider">Session Seal</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <p className="font-mono text-xs font-semibold text-slate-700 bg-white/80 px-2 py-1 rounded border border-slate-200">
            SHA-256: 8f3c...b049
          </p>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Hardware Token Linked (NE-01)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
