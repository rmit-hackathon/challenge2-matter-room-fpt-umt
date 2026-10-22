import React from 'react';
import { NavTab, UserProfile } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingQuorumCount: number;
  currentUser: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingQuorumCount,
  currentUser,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { t, lang } = useLanguage();
  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  // Specific navigation items for Admin vs Legal / VDR Actors
  const adminNavItems: { id: NavTab; label: string; icon: string; iconColor: string; badge?: number }[] = [
    { id: 'admin-console', label: lang === 'vi' ? 'Bảng Điều Khiển Đám Mây' : 'Cloud Infrastructure Console', icon: 'terminal', iconColor: 'text-rose-600' },
    { id: 'evidence-matrix', label: lang === 'vi' ? 'Kho Lưu Trữ Đã Mã Hóa' : 'Encrypted Storage Matrix', icon: 'folder_supervised', iconColor: 'text-blue-600' },
    { id: 'privilege-and-redaction', label: lang === 'vi' ? 'Tường Lửa Zero-Authority' : 'Zero Authority Firewall', icon: 'lock_reset', iconColor: 'text-amber-600' },
    { id: 'immutable-audit-trail', label: lang === 'vi' ? 'Nhật Ký Merkle Enclave' : 'Immutable Audit Trail', icon: 'receipt_long', iconColor: 'text-emerald-600' },
  ];

  const legalNavItems: { id: NavTab; label: string; icon: string; iconColor: string; badge?: number }[] = [
    { id: 'evidence-matrix', label: t.navEvidenceMatrix, icon: 'folder_supervised', iconColor: 'text-blue-600' },
    { id: 'quorum-approvals', label: t.navQuorumApprovals, icon: 'how_to_reg', iconColor: 'text-amber-600', badge: pendingQuorumCount },
    { id: 'privilege-and-redaction', label: t.navPrivilegeRedaction, icon: 'lock_reset', iconColor: 'text-rose-600' },
    { id: 'immutable-audit-trail', label: t.navImmutableAuditTrail, icon: 'receipt_long', iconColor: 'text-emerald-600' },
    { id: 'litigation-holds', label: t.navLitigationHolds, icon: 'gavel', iconColor: 'text-indigo-600' },
  ];

  const activeNavItems = isAdmin ? adminNavItems : legalNavItems;

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white z-40 flex flex-col justify-between py-6 border-r border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 ease-in-out`}
    >
      <div className={isCollapsed ? 'px-2' : 'px-4'}>
        {/* Category Header with Collapse / Expand Icon */}
        <div className={`px-2 pb-3 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <span className="text-[11px] uppercase tracking-wider font-black text-slate-500 truncate">
              {isAdmin ? (lang === 'vi' ? 'HẠ TẦNG (ADMIN)' : 'HYPERVISOR (ADMIN)') : t.vdrTitle}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            {!isCollapsed && (
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? 'bg-rose-500' : 'bg-emerald-500'}`}
                title={isAdmin ? 'Hypervisor Root Verified' : 'VDR Enclave Live'}
              />
            )}
            <button
              onClick={onToggleCollapse}
              type="button"
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title={
                isCollapsed
                  ? lang === 'vi'
                    ? 'Mở rộng tab'
                    : 'Expand sidebar'
                  : lang === 'vi'
                  ? 'Thu gọn tab'
                  : 'Collapse sidebar'
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {isCollapsed ? 'last_page' : 'first_page'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Items with Rich Color Contrast */}
        <nav className="flex flex-col gap-1.5">
          {activeNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                type="button"
                title={item.label}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-sm transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? isAdmin
                      ? 'bg-rose-700 text-white font-bold shadow-[0_4px_12px_rgba(190,18,60,0.28)]'
                      : 'bg-[#1E3A8A] text-white font-bold shadow-[0_4px_12px_rgba(30,58,138,0.28)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                      isActive ? 'text-white' : item.iconColor
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-left leading-tight truncate flex-1">{item.label}</span>
                  )}
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`${
                      isCollapsed
                        ? 'absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center'
                        : 'px-2 py-0.5 rounded-full text-[11px]'
                    } font-bold ${
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

      {/* Bottom Persona & Authority Status Box */}
      <div className={isCollapsed ? 'px-2' : 'px-5'}>
        {isCollapsed ? (
          <div
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border shadow-xs cursor-pointer ${
              isAdmin ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-blue-50 border-blue-200 text-[#1E3A8A]'
            }`}
            onClick={onToggleCollapse}
            title={
              isAdmin
                ? 'Zero Data Authority Enforced (Click to expand)'
                : `${currentUser.roleDescription} (Click to expand)`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAdmin ? 'gpp_bad' : 'verified_user'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full mt-1 animate-pulse ${
                isAdmin ? 'bg-rose-600' : 'bg-emerald-500'
              }`}
            />
          </div>
        ) : isAdmin ? (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50/50 border border-rose-200 shadow-xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-rose-600">gpp_bad</span>
                <span className="uppercase tracking-wider">Zero Authority</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            </div>

            <p className="font-mono text-[11px] font-bold text-rose-700 bg-white/90 px-2 py-1 rounded border border-rose-200">
              Plaintext Keys: 0 in memory
            </p>

            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
              <span className="material-symbols-outlined text-[14px] text-amber-600">lock</span>
              <span>Hypervisor Root (Blinded)</span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100 shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#1E3A8A] text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-blue-600">verified_user</span>
                <span className="uppercase tracking-wider">
                  {currentUser.role === 'SURVIVOR_CLIENT' ? 'Sovereign Vault' : 'Session Seal'}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="font-mono text-xs font-semibold text-slate-700 bg-white/80 px-2 py-1 rounded border border-slate-200">
              {currentUser.role === 'SURVIVOR_CLIENT' 
                ? 'Consent: 100% Required' 
                : currentUser.role === 'FORENSIC_EXPERT' 
                ? '1-Time Ephemeral TTL' 
                : 'SHA-256: 8f3c...b049'}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>
                {currentUser.role === 'SURVIVOR_CLIENT'
                  ? 'Sovereign Root Authority'
                  : currentUser.role === 'FORENSIC_EXPERT'
                  ? 'Hardware Token Authenticated'
                  : 'F.R.C.P. 26(c) Protected'}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
