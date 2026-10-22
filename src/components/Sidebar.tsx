import React from 'react';
import { NavTab, UserProfile, UserRole } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: string;
  badge?: number;
}

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingQuorumCount: number;
  currentUser: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  allUsers?: Record<string, UserProfile>;
  onSelectRole?: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingQuorumCount,
  currentUser,
  isCollapsed,
  onToggleCollapse,
  allUsers,
  onSelectRole,
}) => {
  const { t, lang } = useLanguage();
  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  // Specific navigation items for Admin vs Legal / VDR Actors
  const adminNavItems: NavItem[] = [
    { id: 'admin-console', label: lang === 'vi' ? 'Hạ Tầng & Tường Lửa' : 'Server Infrastructure', icon: 'terminal' },
    { id: 'evidence-matrix', label: lang === 'vi' ? 'Kho Hồ Sơ Niêm Phong' : 'Encrypted Storage', icon: 'folder_supervised' },
  ];

  const legalNavItems: NavItem[] = [
    { id: 'evidence-matrix', label: t.navEvidenceMatrix, icon: 'folder_supervised' },
    { id: 'quorum-approvals', label: t.navQuorumApprovals, icon: 'how_to_reg', badge: pendingQuorumCount },
  ];

  const activeNavItems = isAdmin ? adminNavItems : legalNavItems;

  const usersList = allUsers ? Object.values(allUsers) : [];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white z-40 flex flex-col justify-between py-4 border-r border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 ease-in-out`}
    >
      {/* Top Section: Navigation Links */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {/* Category Header with Collapse / Expand Icon */}
        <div className={`px-2 pb-3 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#475569] truncate">
              {isAdmin ? (lang === 'vi' ? 'HẠ TẦNG MÁY CHỦ' : 'SERVER INFRASTRUCTURE') : t.vdrTitle}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            {!isCollapsed && (
              <span
                className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#DC2626] animate-pulse' : 'bg-[#0D9488]'}`}
                title={isAdmin ? 'Admin Mode (0% Authority)' : 'Protected Sovereign Mode'}
              />
            )}
            <button
              onClick={onToggleCollapse}
              type="button"
              className="w-7 h-7 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition cursor-pointer"
              title={
                isCollapsed
                  ? lang === 'vi'
                    ? 'Mở rộng thanh menu'
                    : 'Expand sidebar'
                  : lang === 'vi'
                  ? 'Thu gọn thanh menu'
                  : 'Collapse sidebar'
              }
            >
              <span className="material-symbols-outlined text-[19px]">
                {isCollapsed ? 'last_page' : 'first_page'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
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
                      ? 'bg-[#991B1B] text-white font-semibold shadow-xs'
                      : 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-medium'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full`}>
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-[#475569]'
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
                        ? 'bg-white text-[#1E3A8A] shadow-xs'
                        : 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]'
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

      {/* Bottom Section: Demo Personas Switcher & Cryptographic Security Status */}
      <div className={`shrink-0 ${isCollapsed ? 'px-2 pt-3 border-t border-[#E2E8F0]' : 'px-4 pt-3 border-t border-[#E2E8F0]'}`}>
        {isCollapsed ? (
          /* Collapsed View: Compact Vertical Icon Stack for 1-Click Role Switch */
          <div className="flex flex-col items-center gap-1.5">
            {usersList.map((u) => {
              const isActive = u.role === currentUser.role;
              const isItAdmin = u.role === 'ADMIN' || (u.role as string) === 'IT_ADMIN';

              const roleIcon =
                u.role === 'LEAD_COUNSEL' ? 'gavel' :
                u.role === 'SURVIVOR_CLIENT' ? 'shield_person' :
                u.role === 'GUARDIAN' ? 'handshake' :
                isItAdmin ? 'admin_panel_settings' : 'biotech';

              return (
                <button
                  key={u.id}
                  onClick={() => onSelectRole?.(u.role)}
                  type="button"
                  title={`${u.name} (${u.roleDescription})`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    isActive
                      ? isItAdmin
                        ? 'bg-[#991B1B] text-white shadow-xs'
                        : 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {roleIcon}
                  </span>
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0F766E] ring-2 ring-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Expanded View: Dedicated Demo Persona Panel & Zero-Authority Seal */
          <div className="flex flex-col gap-2.5">
            {/* Header of the Persona Panel */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10.5px] uppercase tracking-wider font-bold text-[#475569] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#1E3A8A]">switch_account</span>
                <span>{lang === 'vi' ? 'CHUYỂN VAI TRÒ DEMO' : 'DEMO PERSONAS'}</span>
              </span>
              <span className="text-[10px] font-bold text-[#0D9488] bg-[#F0FDFA] px-1.5 py-0.5 rounded border border-[#CCFBF1]">
                {usersList.length} Roles
              </span>
            </div>

            {/* List of Roles with 1-Click Switching */}
            <div className="flex flex-col gap-1 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0]">
              {usersList.map((u) => {
                const isActive = u.role === currentUser.role;
                const isItAdmin = u.role === 'ADMIN' || (u.role as string) === 'IT_ADMIN';

                const shortLabel =
                  u.role === 'LEAD_COUNSEL' ? t.roleCounsel :
                  u.role === 'SURVIVOR_CLIENT' ? t.roleSurvivor :
                  u.role === 'GUARDIAN' ? (lang === 'vi' ? 'Người Giám Hộ' : 'Legal Guardian') :
                  isItAdmin ? t.roleAdmin : t.roleCounsel;

                const roleIcon =
                  u.role === 'LEAD_COUNSEL' ? 'gavel' :
                  u.role === 'SURVIVOR_CLIENT' ? 'shield_person' :
                  u.role === 'GUARDIAN' ? 'handshake' :
                  isItAdmin ? 'admin_panel_settings' : 'badge';

                return (
                  <button
                    key={u.id}
                    onClick={() => onSelectRole?.(u.role)}
                    type="button"
                    title={u.roleDescription}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? isItAdmin
                          ? 'bg-[#991B1B] text-white shadow-2xs font-semibold'
                          : 'bg-[#1E3A8A] text-white shadow-2xs font-semibold'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`material-symbols-outlined text-[16px] shrink-0 ${isActive ? 'text-white' : 'text-[#64748B]'}`}>
                        {roleIcon}
                      </span>
                      <span className="truncate">{shortLabel}</span>
                    </div>

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
