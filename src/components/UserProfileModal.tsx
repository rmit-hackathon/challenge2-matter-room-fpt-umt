import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';
import { LegalBadge } from './common/LegalBadge';
import { LegalCard } from './common/LegalCard';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: Record<string, UserProfile>;
  onSelectRole: (role: UserRole) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectRole,
}) => {
  const { lang, t, setLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [quorumAlerts, setQuorumAlerts] = useState(true);
  const [sessionTtl, setSessionTtl] = useState('30m');

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  const userDid =
    currentUser.role === 'LEAD_COUNSEL' ? 'did:tide:0x4f8e9a02ce893b1277a01d5e6f3' :
    currentUser.role === 'SURVIVOR_CLIENT' ? 'did:tide:0x71a2ce8954d01b8a923ecf410a' :
    isAdmin ? 'did:tide:0x00000000000000000000000000 (Blinded)' :
    'did:tide:0x9c3d4a12eb789f2105a3b2e718';

  const handleCopyDid = () => {
    navigator.clipboard.writeText(userDid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleAvatarIcon =
    currentUser.role === 'LEAD_COUNSEL' ? 'gavel' :
    currentUser.role === 'SURVIVOR_CLIENT' ? 'shield_person' :
    isAdmin ? 'admin_panel_settings' : 'biotech';

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-[#E2E8F0] bg-white text-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${
              isAdmin ? 'bg-[#991B1B]' : 'bg-[#1E3A8A]'
            }`}>
              <span className="material-symbols-outlined text-[22px]">{roleAvatarIcon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg tracking-tight text-[#0F172A]">
                  {lang === 'vi' ? 'Hồ Sơ & Cài Đặt Bảo Mật' : 'User Profile & Security Settings'}
                </h3>
                {isAdmin ? (
                  <LegalBadge variant="rose" dot pulse size="sm">
                    {lang === 'vi' ? '0% Quyền hạn Dữ liệu' : 'Zero Data Authority'}
                  </LegalBadge>
                ) : (
                  <LegalBadge variant="teal" dot pulse size="sm">
                    {lang === 'vi' ? 'Quyền Hợp Lệ' : 'Enclave Active'}
                  </LegalBadge>
                )}
              </div>
              <p className="text-xs text-[#475569] font-mono">
                TideCloak DID: {userDid.substring(0, 22)}...
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Identity Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-2xl">
                {currentUser.avatar}
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-base leading-tight">
                  {currentUser.name}
                </h4>
                <p className="text-xs font-medium text-[#1E3A8A] mt-0.5">
                  {currentUser.title}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {currentUser.organization}
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyDid}
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0F172A] flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[15px] text-[#1E3A8A]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? (lang === 'vi' ? 'Đã sao chép DID' : 'Copied DID') : (lang === 'vi' ? 'Sao chép DID' : 'Copy DID')}</span>
            </button>
          </div>

          {/* Cryptographic Authority Details */}
          <LegalCard variant="surface" className="p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#1E3A8A]">verified_user</span>
              <span>{lang === 'vi' ? 'Thẩm Quyền Mật Mã & Quyền Hạn Dữ Liệu' : 'Cryptographic Authority & Enclave Attestation'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block mb-1">
                  {lang === 'vi' ? 'Cấp độ phân quyền truy cập' : 'Data Classification Scope'}
                </span>
                <span className="font-bold text-[#0F172A]">
                  {currentUser.role === 'LEAD_COUNSEL' ? 'Level 1 & Level 2 (F.R.C.P. 26c)' :
                   currentUser.role === 'SURVIVOR_CLIENT' ? 'Level 1, 2, 3, 4 (Full Sovereign Vault)' :
                   isAdmin ? '0% Data Authority (Mathematically Blinded)' :
                   'Level 3 (Medical Forensic Scope Only)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block mb-1">
                  {lang === 'vi' ? 'Thẩm quyền ký duyệt Quorum' : 'Quorum Signing Role'}
                </span>
                <span className="font-bold text-[#0F172A]">
                  {currentUser.role === 'LEAD_COUNSEL' ? 'Co-Signer (2/2 Dual Authorization)' :
                   currentUser.role === 'SURVIVOR_CLIENT' ? 'Sovereign Approver (Consent Mandatory)' :
                   isAdmin ? 'Bị loại trừ hoàn toàn khỏi Quorum' :
                   'Requestor (Cần Quorum phê duyệt)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block mb-1">
                  {lang === 'vi' ? 'Trạng thái khóa giải mã trong RAM' : 'Plaintext Memory Keys'}
                </span>
                <span className={`font-mono font-bold ${isAdmin ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isAdmin ? '0 Keys (Hardware Zero Knowledge)' : 'Attested Device Enclave (Ephemeral)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block mb-1">
                  {lang === 'vi' ? 'Thuật toán mã hóa' : 'Cipher Algorithm'}
                </span>
                <span className="font-mono font-bold text-[#1E3A8A]">
                  AES-256-GCM (W3C WebCrypto API)
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] flex items-start gap-2">
              <span className="material-symbols-outlined text-[17px] text-[#1E3A8A] shrink-0 mt-0.5">info</span>
              <p className="leading-relaxed">
                {currentUser.roleDescription}
              </p>
            </div>
          </LegalCard>

          {/* Preferences & Settings */}
          <LegalCard variant="surface" className="p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#1E3A8A]">tune</span>
              <span>{lang === 'vi' ? 'Tùy Chọn Cá Nhân & Phiên Làm Việc' : 'User Preferences & Session Security'}</span>
            </h4>
            <div className="space-y-3 pt-1 text-xs">
              
              {/* Language Preference */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-[#0F172A] block">
                    {lang === 'vi' ? 'Ngôn ngữ giao diện' : 'Display Language'}
                  </span>
                  <span className="text-[#64748B] text-[11px]">
                    {lang === 'vi' ? 'Chọn Tiếng Việt hoặc English cho toàn bộ Virtual Data Room' : 'Choose Vietnamese or English for Matter Room'}
                  </span>
                </div>
                <div className="flex items-center p-0.5 rounded-lg bg-white border border-[#E2E8F0]">
                  <button
                    onClick={() => setLanguage('en')}
                    type="button"
                    className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer ${
                      lang === 'en' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-[#475569] hover:bg-slate-100'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    onClick={() => setLanguage('vi')}
                    type="button"
                    className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer ${
                      lang === 'vi' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-[#475569] hover:bg-slate-100'
                    }`}
                  >
                    🇻🇳 VI
                  </button>
                </div>
              </div>

              {/* Quorum Push Alert Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-[#0F172A] block">
                    {lang === 'vi' ? 'Thông báo phê duyệt Quorum thời gian thực' : 'Real-time Quorum Push Notification'}
                  </span>
                  <span className="text-[#64748B] text-[11px]">
                    {lang === 'vi' ? 'Nhận tín hiệu chuông cảnh báo khi có yêu cầu ký duyệt tài liệu Cấp 3' : 'Alert sound & badge on pending cryptographic consensus requests'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuorumAlerts(!quorumAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    quorumAlerts ? 'bg-[#0D9488]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      quorumAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Session TTL Dropdown */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-[#0F172A] block">
                    {lang === 'vi' ? 'Thời gian tự động khóa phiên (Session Inactivity TTL)' : 'Session Inactivity Auto-Lock'}
                  </span>
                  <span className="text-[#64748B] text-[11px]">
                    {lang === 'vi' ? 'Tự động hủy khóa phân vùng RAM khi không tương tác' : 'Purge ephemeral cryptographic memory keys on idle'}
                  </span>
                </div>
                <select
                  value={sessionTtl}
                  onChange={(e) => setSessionTtl(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] cursor-pointer"
                >
                  <option value="15m">15 phút</option>
                  <option value="30m">30 phút (Mặc định)</option>
                  <option value="1h">1 giờ</option>
                  <option value="4h">4 giờ</option>
                </select>
              </div>

            </div>
          </LegalCard>

          {/* Quick Persona Switcher in Modal */}
          <LegalCard variant="surface" className="p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#1E3A8A]">switch_account</span>
              <span>{lang === 'vi' ? 'Chuyển Đổi Nhanh Sang Vai Trò Khác' : 'Quick Switch Persona'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {Object.values(allUsers).map((u) => {
                const isActive = u.role === currentUser.role;
                const isItAdmin = u.role === 'ADMIN' || (u.role as string) === 'IT_ADMIN';

                const shortLabel =
                  u.role === 'LEAD_COUNSEL' ? t.roleCounsel :
                  u.role === 'SURVIVOR_CLIENT' ? t.roleSurvivor :
                  isItAdmin ? t.roleAdmin :
                  u.role === 'FORENSIC_EXPERT' ? t.roleExpert : t.roleDefense;

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectRole(u.role);
                      onClose();
                    }}
                    type="button"
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isActive
                        ? isItAdmin
                          ? 'bg-[#991B1B] text-white border-[#991B1B] shadow-xs'
                          : 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-lg">{u.avatar}</span>
                      <div className="truncate">
                        <p className="font-bold text-xs truncate leading-tight">{shortLabel}</p>
                        <p className={`text-[10.5px] truncate ${isActive ? 'text-white/80' : 'text-[#64748B]'}`}>
                          {u.name.split(' (')[0]}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </LegalCard>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              alert(lang === 'vi' ? 'Đã khóa phiên bảo mật khẩn cấp. Toàn bộ khóa tạm thời trong RAM đã được giải phóng.' : 'Emergency Session Locked. Ephemeral keys purged from memory.');
              onClose();
            }}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">lock_reset</span>
            <span>{lang === 'vi' ? 'Khóa Phiên Khẩn Cấp' : 'Emergency Lock'}</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white shadow-xs transition cursor-pointer"
          >
            {lang === 'vi' ? 'Đóng Cửa Sổ' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
