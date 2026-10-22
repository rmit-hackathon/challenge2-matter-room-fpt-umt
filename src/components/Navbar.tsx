import React from 'react';
import { UserProfile, UserRole } from '../types/matter';
import { LegalSeal } from './LegalSeal';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentUser: UserProfile;
  allUsers?: Record<string, UserProfile>;
  onSelectRole?: (role: UserRole) => void;
  onOpenEnclaveInspector?: () => void;
  onOpenProfileSettings?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenProfileSettings,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const { lang, t, setLanguage } = useLanguage();

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  const userRoleLabel =
    currentUser.role === 'LEAD_COUNSEL' ? t.roleCounsel :
    currentUser.role === 'SURVIVOR_CLIENT' ? t.roleSurvivor :
    isAdmin ? t.roleAdmin : t.roleExpert;

  const roleAvatarIcon =
    currentUser.role === 'LEAD_COUNSEL' ? 'gavel' :
    currentUser.role === 'SURVIVOR_CLIENT' ? 'shield_person' :
    isAdmin ? 'admin_panel_settings' : 'biotech';

  // Format clean name: eliminate prefixes like "Luật sư: ", "Admin: " to prevent duplicate labels
  const cleanName = currentUser.name
    .replace(/^(Luật sư|Nạn nhân|Admin|Bác sĩ pháp y):\s*/i, '')
    .split(' (')[0];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white z-50 shadow-[0_1px_3px_rgba(15,23,42,0.06)] border-b border-[#E2E8F0] overflow-hidden">
      <div className="h-16 w-full px-3 sm:px-6 flex items-center justify-between gap-3">
        
        {/* 1. Left: Brand Logo & Title (with mobile toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              type="button"
              className="md:hidden w-8 h-8 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition cursor-pointer border border-[#E2E8F0] shadow-2xs"
              title={isSidebarCollapsed ? (lang === 'vi' ? 'Mở menu' : 'Expand menu') : (lang === 'vi' ? 'Thu gọn menu' : 'Collapse menu')}
            >
              <span className="material-symbols-outlined text-[19px]">
                {isSidebarCollapsed ? 'menu' : 'menu_open'}
              </span>
            </button>
          )}
          <LegalSeal className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-contain shrink-0 drop-shadow-2xs" />
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0F172A]">
            {t.matterRoom}
          </span>
        </div>

        {/* Center: Open breathing room for authentic high-end executive aesthetic */}
        <div className="flex-1" />

        {/* 2. Right Section: Language Switcher & Interactive User Profile Card */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Dual Language Switcher (EN / VI) */}
          <div className="flex items-center p-0.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] font-medium hover:bg-white/60'
              }`}
              title="English"
            >
              <span className="text-[12px]">🇬🇧</span>
              <span className="font-semibold text-[11px]">EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('vi')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                lang === 'vi'
                  ? 'bg-[#1E3A8A] text-white font-semibold shadow-2xs'
                  : 'text-[#475569] hover:text-[#0F172A] font-medium hover:bg-white/60'
              }`}
              title="Tiếng Việt"
            >
              <span className="text-[12px]">🇻🇳</span>
              <span className="font-semibold text-[11px]">VI</span>
            </button>
          </div>

          {/* Interactive User Profile & Settings Trigger Button */}
          <button
            onClick={onOpenProfileSettings}
            type="button"
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#E2E8F0] hover:bg-[#F8FAFC] py-1 px-1.5 sm:px-2 rounded-xl transition cursor-pointer group"
            title={lang === 'vi' ? 'Nhấn để mở Hồ Sơ & Cài Đặt Người Dùng' : 'Click to open User Profile & Settings'}
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-[#0F172A] leading-tight truncate max-w-[110px] lg:max-w-[140px] group-hover:text-[#1E3A8A] transition-colors">
                {cleanName}
              </p>
              <p className={`text-[11px] font-medium leading-tight ${isAdmin ? 'text-[#991B1B]' : 'text-[#1E3A8A]'}`}>
                {userRoleLabel}
              </p>
            </div>

            <div className="relative shrink-0">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-2xs transition-transform group-hover:scale-105 ${
                  isAdmin ? 'bg-[#991B1B]' : 'bg-[#1E3A8A]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[19px]">
                  {roleAvatarIcon}
                </span>
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  isAdmin ? 'bg-[#DC2626] animate-pulse' : 'bg-[#0D9488]'
                }`}
              />
            </div>

            <span className="material-symbols-outlined text-[18px] text-[#94A3B8] group-hover:text-[#0F172A] transition-colors shrink-0">
              expand_more
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
