import React from 'react';
import { UserProfile, UserRole } from '../types/matter';
import { LegalSeal } from './LegalSeal';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentUser: UserProfile;
  allUsers: Record<string, UserProfile>;
  onSelectRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, allUsers, onSelectRole }) => {
  const { lang, t, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white z-50 shadow-[0_2px_8px_rgba(15,23,42,0.06)] border-b border-slate-200">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-3">
        
        {/* Left: Brand & TideCloak Secured Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LegalSeal className="w-9 h-9 rounded-full object-contain shrink-0 drop-shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base uppercase tracking-tight text-[#0F172A]">
              {t.matterRoom}
            </span>
            <span className="hidden sm:flex px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-bold border border-blue-200 shadow-sm items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>{t.tidecloakSecured}</span>
            </span>
          </div>
        </div>

        {/* Center: Clean Segmented Persona Switcher with Vibrant Accents */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-slate-100 border border-slate-200 gap-1 shadow-inner">
          {Object.values(allUsers).map((u) => {
            const isActive = u.role === currentUser.role;
            const isItAdmin = u.role === 'IT_ADMIN';

            const shortLabel = 
              u.role === 'LEAD_COUNSEL' ? t.roleCounsel :
              u.role === 'SURVIVOR_CLIENT' ? t.roleSurvivor :
              u.role === 'IT_ADMIN' ? t.roleAdmin :
              u.role === 'FORENSIC_EXPERT' ? t.roleExpert : t.roleDefense;

            return (
              <button
                key={u.id}
                onClick={() => onSelectRole(u.role)}
                type="button"
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? isItAdmin
                      ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30 ring-2 ring-rose-300'
                      : 'bg-[#1E3A8A] text-white font-bold shadow-md shadow-blue-900/30 ring-2 ring-blue-300'
                    : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/60'
                }`}
                title={u.roleDescription}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: 2 Language Switcher Icons + Authority Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Dual Language Switcher Icons (🇬🇧 EN / 🇻🇳 VI) */}
          <div className="flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                lang === 'en'
                  ? 'bg-[#1E3A8A] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-white/60'
              }`}
              title="English"
            >
              <span className="text-[13px]">🇬🇧</span>
              <span className="font-bold text-[11px]">EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('vi')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                lang === 'vi'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-white/60'
              }`}
              title="Tiếng Việt"
            >
              <span className="text-[13px]">🇻🇳</span>
              <span className="font-bold text-[11px]">VI</span>
            </button>
          </div>

          {currentUser.role === 'IT_ADMIN' ? (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>{t.dataAuthorityRevoked}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.authorityActive}</span>
            </div>
          )}

          <div className="hidden xl:flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name.split(' (')[0]}
              </p>
              <p className="text-[11px] text-blue-700 font-medium leading-tight">
                {currentUser.role === 'LEAD_COUNSEL' ? t.roleCounsel :
                 currentUser.role === 'SURVIVOR_CLIENT' ? t.roleSurvivor :
                 currentUser.role === 'IT_ADMIN' ? t.roleAdmin : t.roleExpert}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white shadow-md border-2 border-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
