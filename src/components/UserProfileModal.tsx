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
  onUpdateUser?: (updated: UserProfile) => void;
}

type ProfileTab = 'overview' | 'basic-info' | 'contact' | 'crypto-authority' | 'preferences' | 'switch-actor';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectRole,
  onUpdateUser,
}) => {
  const { lang, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Settings states
  const [quorumAlerts, setQuorumAlerts] = useState(true);
  const [sessionTtl, setSessionTtl] = useState('30m');
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [purgeOnClose, setPurgeOnClose] = useState(true);

  // Facebook-style Profile Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: currentUser.name,
    title: currentUser.title,
    organization: currentUser.organization,
    bio: currentUser.bio || '',
    secureEmail: currentUser.secureEmail || '',
    securePhone: currentUser.securePhone || '',
    officeAddress: currentUser.officeAddress || '',
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN';

  // Fallback defaults if extended fields are missing
  const userDid = currentUser.did || (
    currentUser.role === 'LEAD_COUNSEL' ? 'did:tide:0x4f8e9a02ce893b1277a01d5e6f3b8901' :
    currentUser.role === 'SURVIVOR_CLIENT' ? 'did:tide:0x71a2ce8954d01b8a923ecf410acb7904' :
    isAdmin ? 'did:tide:0x00000000000000000000000000 (Blinded)' :
    'did:tide:0x9d11fa88ca23b49910d55e81c7e09923'
  );

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenEdit = () => {
    setEditFormData({
      name: currentUser.name,
      title: currentUser.title,
      organization: currentUser.organization,
      bio: currentUser.bio || currentUser.roleDescription || '',
      secureEmail: currentUser.secureEmail || (isAdmin ? 'alex.mercer@legalcloud-hosting.net' : 'user@secure-matter.org'),
      securePhone: currentUser.securePhone || '+1 (212) 555-0100',
      officeAddress: currentUser.officeAddress || 'U.S. District Court SDNY Jurisdiction',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: editFormData.name.trim() || currentUser.name,
      title: editFormData.title.trim() || currentUser.title,
      organization: editFormData.organization.trim() || currentUser.organization,
      bio: editFormData.bio.trim(),
      secureEmail: editFormData.secureEmail.trim(),
      securePhone: editFormData.securePhone.trim(),
      officeAddress: editFormData.officeAddress.trim(),
    };

    onUpdateUser?.(updated);
    setIsEditModalOpen(false);
    setSaveSuccessMsg(lang === 'vi' ? 'Đã lưu thông tin cá nhân thành công!' : 'Profile updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const roleAvatarIcon =
    currentUser.role === 'LEAD_COUNSEL' ? 'gavel' :
    currentUser.role === 'SURVIVOR_CLIENT' ? 'shield_person' :
    isAdmin ? 'admin_panel_settings' : 'handshake';

  const roleThemeGradient = isAdmin
    ? 'from-[#7F1D1D] via-[#991B1B] to-[#450A0A]'
    : currentUser.role === 'SURVIVOR_CLIENT'
    ? 'from-[#064E3B] via-[#0F766E] to-[#134E4A]'
    : currentUser.role === 'GUARDIAN'
    ? 'from-[#1E3A8A] via-[#312E81] to-[#1E1B4B]'
    : 'from-[#0F172A] via-[#1E3A8A] to-[#172554]';

  const roleHeaderBadge =
    currentUser.role === 'LEAD_COUNSEL' ? (lang === 'vi' ? 'Đại diện Pháp lý • NY Bar' : 'Lead Litigator • NY Bar') :
    currentUser.role === 'SURVIVOR_CLIENT' ? (lang === 'vi' ? 'Chủ thể Tối cao • Bảo vệ Tuyệt đối' : 'Sovereign Litigant • Sealed') :
    isAdmin ? (lang === 'vi' ? '0% Quyền hạn Dữ liệu • Zero-Knowledge' : 'Zero Data Authority • Blinded') :
    (lang === 'vi' ? 'Đại diện Hợp pháp • Tòa án Chỉ định' : 'Court-Appointed Legal Guardian');

  // List of sub-tabs like Facebook Profile Settings
  const subTabs: { id: ProfileTab; labelVi: string; labelEn: string; icon: string }[] = [
    { id: 'overview', labelVi: 'Tổng quan', labelEn: 'Overview', icon: 'dashboard' },
    { id: 'basic-info', labelVi: 'Thông tin cơ bản & Pháp lý', labelEn: 'Basic Info & Credentials', icon: 'badge' },
    { id: 'contact', labelVi: 'Liên hệ & Kênh khẩn cấp', labelEn: 'Contact & Secure Relay', icon: 'contact_phone' },
    { id: 'crypto-authority', labelVi: 'Thẩm quyền Mật mã & Enclave', labelEn: 'Crypto Authority & Enclave', icon: 'verified_user' },
    { id: 'preferences', labelVi: 'Tùy chọn & Phiên bảo mật', labelEn: 'Preferences & Session', icon: 'tune' },
    { id: 'switch-actor', labelVi: 'Chuyển đổi Actor', labelEn: 'Switch Persona', icon: 'switch_account' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-[#CBD5E1] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">

        {/* ========================================================
            HEADER: FACEBOOK COVER & PROFILE BANNER STYLE
            ======================================================== */}
        <div className={`relative bg-gradient-to-r ${roleThemeGradient} text-white px-5 sm:px-6 pt-6 pb-5 shadow-inner`}>
          {/* Subtle Security Grid Pattern Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Bar with Status and Close */}
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">lock</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                TideCloak Virtual Data Room • Secure Enclave ID
              </span>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title={lang === 'vi' ? 'Đóng cửa sổ' : 'Close'}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Profile Identity Bar (Facebook style avatar + details) */}
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Large Avatar with glowing ring */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-3xl sm:text-4xl transition-transform">
                  {currentUser.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                    isAdmin ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-white'
                  }`}
                  title={isAdmin ? 'Zero Data Authority' : 'Enclave Verified'}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {roleAvatarIcon}
                  </span>
                </div>
              </div>

              {/* Name, Title, and Organization */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                    {currentUser.name}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20 font-medium">
                    {roleHeaderBadge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
                  {currentUser.title}
                </p>
                <p className="text-[11.5px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">apartment</span>
                  <span>{currentUser.organization}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons (Edit Profile & Copy DID) */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-2 sm:pt-0">
              <button
                onClick={handleOpenEdit}
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-[#0F172A] hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-[#1E3A8A]">edit</span>
                <span>{lang === 'vi' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={() => handleCopyText(userDid, 'did-header')}
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                title={userDid}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedKey === 'did-header' ? 'check' : 'content_copy'}
                </span>
                <span>
                  {copiedKey === 'did-header'
                    ? (lang === 'vi' ? 'Đã sao chép' : 'Copied')
                    : (lang === 'vi' ? 'Sao chép DID' : 'Copy DID')}
                </span>
              </button>
            </div>
          </div>

          {/* Toast Notification when saved */}
          {saveSuccessMsg && (
            <div className="mt-3 p-2 rounded-lg bg-emerald-500/90 text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* ========================================================
            MODAL CONTENT: 2-COLUMN FACEBOOK EDIT PROFILE LAYOUT
            Left Sidebar: Tabs Navigation
            Right Area: Active Tab Content
            ======================================================== */}
        <div className="flex flex-col md:flex-row flex-1 min-h-[460px] max-h-[calc(94vh-180px)] overflow-hidden bg-[#F8FAFC]">

          {/* LEFT SUB-TABS NAVIGATION (Facebook Sidebar Style) */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E2E8F0] bg-white p-2.5 sm:p-3 overflow-x-auto md:overflow-y-auto shrink-0">
            <p className="hidden md:block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 py-2">
              {lang === 'vi' ? 'Danh mục thông tin' : 'Profile Categories'}
            </p>
            <div className="flex md:flex-col gap-1">
              {subTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left whitespace-nowrap shrink-0 md:w-full ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#1E3A8A] font-bold shadow-2xs border border-[#BFDBFE]'
                        : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-[#64748B]'
                    }`}>
                      <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                    </div>
                    <span>{lang === 'vi' ? tab.labelVi : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT MAIN PANEL: CONTENT PER ACTIVE TAB */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#F8FAFC]">

            {/* ===================================================
                TAB 1: TỔNG QUAN (OVERVIEW)
                =================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* 4 Core Quick Metrics Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[11px] font-semibold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-[#1E3A8A]">folder_special</span>
                      <span>{lang === 'vi' ? 'Quyền dữ liệu' : 'Data Tier'}</span>
                    </div>
                    <p className="font-bold text-xs sm:text-sm text-[#0F172A] mt-1">
                      {currentUser.role === 'LEAD_COUNSEL' ? 'C0, C1 & C2' :
                       currentUser.role === 'SURVIVOR_CLIENT' ? 'C0, C1, C2 (Toàn quyền)' :
                       isAdmin ? '0% (Mù toán học)' : 'C0 & C1 (C2 Quorum)'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[11px] font-semibold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-[#0F766E]">how_to_reg</span>
                      <span>{lang === 'vi' ? 'Vai trò Quorum' : 'Quorum Role'}</span>
                    </div>
                    <p className="font-bold text-xs sm:text-sm text-[#0F172A] mt-1">
                      {currentUser.role === 'LEAD_COUNSEL' ? 'Co-Signer (2/2)' :
                       currentUser.role === 'SURVIVOR_CLIENT' ? 'Chủ quyền (Veto)' :
                       isAdmin ? 'Bị loại trừ' : 'Bên thứ 3 (3/3)'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[11px] font-semibold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-indigo-600">memory</span>
                      <span>{lang === 'vi' ? 'Trạng thái RAM' : 'Memory State'}</span>
                    </div>
                    <p className={`font-bold text-xs sm:text-sm mt-1 ${isAdmin ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isAdmin ? '0 Keys (Hardware Zero)' : 'Enclave Ephemeral'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#64748B] text-[11px] font-semibold uppercase">
                      <span className="material-symbols-outlined text-[15px] text-amber-600">verified</span>
                      <span>{lang === 'vi' ? 'Chứng thực' : 'Attestation'}</span>
                    </div>
                    <p className="font-bold text-xs sm:text-sm text-[#0F172A] mt-1">
                      {isAdmin ? 'FedRAMP High' : 'FIPS 140-3 Active'}
                    </p>
                  </div>
                </div>

                {/* Role Mission Statement / Bio (Facebook Style) */}
                <LegalCard variant="surface" className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">format_quote</span>
                      <span>{lang === 'vi' ? 'Tiểu Sử & Tuyên Bố Trách Nhiệm Vai Trò' : 'Bio & Role Mission'}</span>
                    </h3>
                    <button
                      onClick={handleOpenEdit}
                      type="button"
                      className="text-xs text-[#1E3A8A] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>{lang === 'vi' ? 'Chỉnh sửa tiểu sử' : 'Edit Bio'}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    "{currentUser.bio || currentUser.roleDescription}"
                  </p>
                </LegalCard>

                {/* Decentralized Identity (DID) & Cryptographic Address Card */}
                <LegalCard variant="surface" className="p-4 sm:p-5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">fingerprint</span>
                    <span>{lang === 'vi' ? 'Mã Định Danh Phi Tập Trung (TideCloak DID)' : 'Decentralized Identifier (DID)'}</span>
                  </h3>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#64748B] font-semibold">TIDECLOAK SOVEREIGN DID</p>
                      <p className="font-mono text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                        {userDid}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyText(userDid, 'did-overview')}
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-[#0F172A] border border-[#CBD5E1] shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#1E3A8A]">
                        {copiedKey === 'did-overview' ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedKey === 'did-overview' ? (lang === 'vi' ? 'Đã sao chép' : 'Copied') : (lang === 'vi' ? 'Sao chép DID' : 'Copy DID')}</span>
                    </button>
                  </div>

                  {/* Connected Judicial Matter Room Details */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                      <span className="text-[#475569]">{lang === 'vi' ? 'Vụ kiện liên kết:' : 'Connected Case:'}</span>
                      <span className="font-bold text-[#1E3A8A]">#2026-CV-04421 (SDNY)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                      <span className="text-[#475569]">{lang === 'vi' ? 'Cấp độ bảo mật:' : 'Security Classification:'}</span>
                      <span className="font-bold text-rose-700">Strict In-Camera Protective Order</span>
                    </div>
                  </div>
                </LegalCard>

              </div>
            )}

            {/* ===================================================
                TAB 2: THÔNG TIN CƠ BẢN & PHÁP LÝ (BASIC INFO)
                =================================================== */}
            {activeTab === 'basic-info' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                      {lang === 'vi' ? 'Thông Tin Cơ Bản & Pháp Lý' : 'Basic & Legal Information'}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {lang === 'vi' ? 'Hồ sơ nhân thân pháp lý và quyết định chỉ định của Tòa án' : 'Identity credentials and judicial appointment orders'}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenEdit}
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>{lang === 'vi' ? 'Chỉnh sửa' : 'Edit'}</span>
                  </button>
                </div>

                {/* Facebook Profile Fields List */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] shadow-2xs overflow-hidden text-xs sm:text-sm">
                  
                  {/* Row: Họ và tên */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Họ và tên đầy đủ' : 'Full Name'}</p>
                        <p className="font-bold text-[#0F172A]">{currentUser.name}</p>
                      </div>
                    </div>
                    <LegalBadge variant="teal" size="sm">
                      {lang === 'vi' ? 'Đã xác thực' : 'Verified'}
                    </LegalBadge>
                  </div>

                  {/* Row: Chức danh chuyên môn */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#475569] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">work</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Chức danh & Vai trò' : 'Professional Title'}</p>
                        <p className="font-bold text-[#0F172A]">{currentUser.title}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                      {currentUser.role}
                    </span>
                  </div>

                  {/* Row: Cơ quan / Tổ chức */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#475569] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">domain</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Cơ quan / Tổ chức' : 'Organization'}</p>
                        <p className="font-bold text-[#0F172A]">{currentUser.organization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Row: Giấy phép / Thẻ hành nghề / Quyết định Tòa án */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">gavel</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">
                          {currentUser.role === 'LEAD_COUNSEL' ? (lang === 'vi' ? 'Số thẻ Luật sư Đoàn' : 'Bar License ID') :
                           currentUser.role === 'SURVIVOR_CLIENT' ? (lang === 'vi' ? 'Mã Lệnh Bảo Vệ Tòa án' : 'Court Protective Docket') :
                           currentUser.role === 'GUARDIAN' ? (lang === 'vi' ? 'Số Quyết định Giám hộ' : 'Guardianship Order') :
                           (lang === 'vi' ? 'Chứng nhận Quản trị An ninh' : 'Cloud Security Cert')}
                        </p>
                        <p className="font-bold text-[#0F172A]">
                          {currentUser.legalCredential || (
                            currentUser.role === 'LEAD_COUNSEL' ? 'NY Bar #5298144 (Cấp phép 2014)' :
                            currentUser.role === 'SURVIVOR_CLIENT' ? 'SDNY Docket #2026-CV-04421-SEAL' :
                            currentUser.role === 'GUARDIAN' ? 'Court Order #GD-2025-9921' :
                            'AWS GovCloud FedRAMP High #SRE-8812'
                          )}
                        </p>
                      </div>
                    </div>
                    <LegalBadge variant="navy" size="sm">
                      {lang === 'vi' ? '⚖️ Tòa án SDNY' : '⚖️ SDNY Court'}
                    </LegalBadge>
                  </div>

                  {/* Row: Khu vực thẩm quyền tài phán */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#475569] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">account_balance</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Khu vực Tài phán' : 'Jurisdiction'}</p>
                        <p className="font-bold text-[#0F172A]">
                          {currentUser.jurisdiction || 'Tòa án Liên bang Địa hạt Miền Nam New York (U.S. District Court SDNY)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row: Ngày bổ nhiệm / kích hoạt */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#475569] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Ngày chỉ định / Bổ nhiệm' : 'Appointment Date'}</p>
                        <p className="font-bold text-[#0F172A]">
                          {currentUser.appointmentDate || '15/01/2026 (Chỉ định theo Lệnh số #2026-CV-04421)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row: Phạm vi bảo vệ hồ sơ */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">policy</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Phạm vi bảo mật hồ sơ' : 'Privacy Protection Scope'}</p>
                        <p className="font-bold text-[#0F172A]">
                          {currentUser.privacyScope || (
                            isAdmin ? 'Không có thẩm quyền dữ liệu (Blinded Zero-Knowledge)' :
                            'Strict Attorney-Client Privilege & Court Seal'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ===================================================
                TAB 3: LIÊN HỆ & KÊNH BẢO MẬT (CONTACT)
                =================================================== */}
            {activeTab === 'contact' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                      {lang === 'vi' ? 'Thông Tin Liên Hệ & Kênh Khẩn Cấp' : 'Contact & Secure Relay'}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {lang === 'vi' ? 'Kênh liên lạc mã hóa đầu cuối (E2EE) không thông qua máy chủ bên ngoài' : 'End-to-end encrypted communication and witness protection relay'}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenEdit}
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>{lang === 'vi' ? 'Chỉnh sửa' : 'Edit'}</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] shadow-2xs overflow-hidden text-xs sm:text-sm">
                  
                  {/* Email bảo mật */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Email bảo mật (E2EE Enclave Verified)' : 'Secure Enclave Email'}</p>
                        <p className="font-mono font-bold text-[#0F172A]">
                          {currentUser.secureEmail || (
                            currentUser.role === 'LEAD_COUNSEL' ? 'elena.howard@civilrights-law.attorney' :
                            currentUser.role === 'SURVIVOR_CLIENT' ? 'vault-relayed-jane@anon-protect.court.gov' :
                            currentUser.role === 'GUARDIAN' ? 'sarah.jenkins@ny-guardianship.court.gov' :
                            'alex.mercer@legalcloud-hosting.net'
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyText(currentUser.secureEmail || 'user@matter.org', 'email')}
                      type="button"
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
                      title={lang === 'vi' ? 'Sao chép email' : 'Copy Email'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedKey === 'email' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>

                  {/* Kênh liên lạc / Hotline khẩn cấp */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Đường dây bảo mật / Hotline' : 'Encrypted Hotline / Relay'}</p>
                        <p className="font-bold text-[#0F172A]">
                          {currentUser.securePhone || (
                            currentUser.role === 'LEAD_COUNSEL' ? '+1 (212) 555-0188 (Đường dây bảo mật E2EE)' :
                            currentUser.role === 'SURVIVOR_CLIENT' ? 'Kênh liên lạc ẩn danh TideCloak Whisper Relay (Không lưu SĐT thật)' :
                            currentUser.role === 'GUARDIAN' ? '+1 (212) 555-0143 (Đường dây văn phòng giám hộ)' :
                            '+1 (800) 555-0199 (NOC SRE trực 24/7)'
                          )}
                        </p>
                      </div>
                    </div>
                    <LegalBadge variant="teal" size="sm">
                      {currentUser.role === 'SURVIVOR_CLIENT' ? 'Whisper Relay' : 'E2EE'}
                    </LegalBadge>
                  </div>

                  {/* Trụ sở làm việc / Tọa độ an toàn */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#475569] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Địa chỉ công tác / Tọa độ nơi ở' : 'Address / Safehouse'}</p>
                        <p className={`font-bold ${currentUser.role === 'SURVIVOR_CLIENT' ? 'text-rose-600 font-mono text-xs' : 'text-[#0F172A]'}`}>
                          {currentUser.officeAddress || (
                            currentUser.role === 'LEAD_COUNSEL' ? 'Suite 1400, 45 Rockefeller Plaza, Manhattan, New York, NY 10111' :
                            currentUser.role === 'SURVIVOR_CLIENT' ? '[ĐÃ NIÊM PHONG TUYỆT ĐỐI THEO LỆNH TÒA ÁN CẤP 4 - LEVEL 4]' :
                            currentUser.role === 'GUARDIAN' ? 'Phòng 310, Tòa nhà Tư pháp 40 Foley Square, New York, NY 10007' :
                            'LegalCloud Ops Center, 1100 Wilson Blvd, Arlington, VA 22209'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Khóa công khai Enclave Public Key */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#64748B] font-medium">{lang === 'vi' ? 'Khóa công khai Enclave (ECDSA P-256)' : 'Enclave Public Key'}</p>
                        <p className="font-mono text-xs text-[#0F172A] truncate">
                          {currentUser.publicKey || (
                            isAdmin ? '[KHÔNG TỒN TẠI KHÓA GIẢI MÃ NỘI DUNG - ZERO KEY ACCESS]' :
                            '0x04e12fa89b21a007629bc44d01c08fe2331189ac72d0a1b89efc11a8...'
                          )}
                        </p>
                      </div>
                    </div>
                    {!isAdmin && (
                      <button
                        onClick={() => handleCopyText(currentUser.publicKey || '0x04e12fa89b21...', 'pubkey')}
                        type="button"
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer shrink-0"
                        title={lang === 'vi' ? 'Sao chép khóa công khai' : 'Copy Public Key'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copiedKey === 'pubkey' ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ===================================================
                TAB 4: THẨM QUYỀN MẬT MÃ & ENCLAVE
                =================================================== */}
            {activeTab === 'crypto-authority' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="pb-2 border-b border-[#E2E8F0]">
                  <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                    {lang === 'vi' ? 'Thẩm Quyền Mật Mã & Chứng Thực Enclave' : 'Cryptographic Authority & Enclave Attestation'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {lang === 'vi' ? 'Phân quyền dữ liệu theo mô hình Zero-Trust Emergent Authority và TideCloak' : 'Zero-Trust data classification and hardware enclave attestation'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Card 1: Cấp độ phân quyền */}
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1.5">
                    <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block">
                      {lang === 'vi' ? 'Cấp độ phân quyền dữ liệu' : 'Data Classification Scope'}
                    </span>
                    <p className="font-bold text-[#0F172A] text-sm">
                      {currentUser.role === 'LEAD_COUNSEL' ? 'Level 1 & Level 2 (F.R.C.P. 26c)' :
                       currentUser.role === 'SURVIVOR_CLIENT' ? 'Level 1, 2, 3, 4 (Full Sovereign Vault)' :
                       isAdmin ? '0% Data Authority (Blinded)' :
                       'Level 1 & 2 (Medical Scope Only)'}
                    </p>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {currentUser.role === 'LEAD_COUNSEL' ? (lang === 'vi' ? 'Toàn quyền C0, C1 và quyền đề xuất mở C2 cho Tòa án.' : 'Full access to C0, C1 and trial export.') :
                       currentUser.role === 'SURVIVOR_CLIENT' ? (lang === 'vi' ? 'Chủ sở hữu tối cao: Nắm quyền mở hoặc thu hồi toàn bộ chứng cứ C2.' : 'Sovereign master vault owner.') :
                       isAdmin ? (lang === 'vi' ? 'Bị cô lập toán học: Không thể giải mã 1 byte dữ liệu C1 hay C2 nào.' : 'Mathematically blinded from all plaintext.') :
                       (lang === 'vi' ? 'Quyền giám hộ đồng hành cùng thân chủ trong Quorum.' : 'Co-signatory under guardianship.')}
                    </p>
                  </div>

                  {/* Card 2: Thẩm quyền ký Quorum */}
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1.5">
                    <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block">
                      {lang === 'vi' ? 'Thẩm quyền ký duyệt Quorum' : 'Quorum Signing Role'}
                    </span>
                    <p className="font-bold text-[#0F172A] text-sm">
                      {currentUser.role === 'LEAD_COUNSEL' ? 'Co-Signer (2/2 Dual Authorization)' :
                       currentUser.role === 'SURVIVOR_CLIENT' ? 'Sovereign Approver (Consent Bắt buộc)' :
                       isAdmin ? 'Bị loại trừ hoàn toàn khỏi Quorum' :
                       'Bên thứ 3 (Cách ly nếu có Xung đột)'}
                    </p>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {currentUser.role === 'SURVIVOR_CLIENT' ? (lang === 'vi' ? 'Nguyên tắc bất biến: Silence ≠ Consent. Không có chữ ký nạn nhân thì không thể mở C2.' : 'Silence != Consent rule strictly enforced.') :
                       currentUser.role === 'LEAD_COUNSEL' ? (lang === 'vi' ? 'Cần đồng thuận tối thiểu 2/2 hoặc 3/3 All-Keyholders.' : 'Requires 2/2 or 3/3 keyholder threshold.') :
                       isAdmin ? (lang === 'vi' ? 'Mô hình phân tán: Admin không nắm bất kỳ mảnh khóa mật mã nào.' : 'Zero quorum keys held by infrastructure.') :
                       (lang === 'vi' ? 'Tự động giảm xuống 2/2 nếu phát hiện Xung đột lợi ích (Ngoại lệ 4).' : 'Isolated upon guardian conflict trigger.')}
                    </p>
                  </div>

                  {/* Card 3: RAM Ephemeral */}
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1.5">
                    <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block">
                      {lang === 'vi' ? 'Trạng thái khóa giải mã trong RAM' : 'Plaintext Memory Keys'}
                    </span>
                    <p className={`font-mono font-bold text-sm ${isAdmin ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isAdmin ? '0 Keys (Hardware Zero Knowledge)' : 'Attested Device Enclave (Ephemeral)'}
                    </p>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {isAdmin
                        ? (lang === 'vi' ? 'Máy chủ không lưu khóa đối xứng, RAM không chứa bản rõ.' : 'No symmetric key retained in memory.')
                        : (lang === 'vi' ? 'Khóa phiên tự hủy ngay khi đóng cửa sổ hoặc hết thời gian TTL.' : 'Session keys purged on inactivity TTL or tab exit.')}
                    </p>
                  </div>

                  {/* Card 4: Thuật toán mã hóa */}
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1.5">
                    <span className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold block">
                      {lang === 'vi' ? 'Thuật toán mã hóa & Toàn vẹn' : 'Cipher Algorithm'}
                    </span>
                    <p className="font-mono font-bold text-[#1E3A8A] text-sm">
                      AES-256-GCM + SHA-256
                    </p>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {lang === 'vi'
                        ? 'Tuân thủ chuẩn W3C WebCrypto API & Tiêu chuẩn FIPS 140-3 của Chính phủ Hoa Kỳ.'
                        : 'Compliant with W3C WebCrypto API & US FIPS 140-3.'}
                    </p>
                  </div>
                </div>

                {/* Role Specific Security Rule Note Banner */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isAdmin ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-blue-50/70 border-blue-200 text-[#1E3A8A]'
                }`}>
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                    {isAdmin ? 'security' : 'verified'}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide">
                      {isAdmin ? (lang === 'vi' ? 'Nguyên Tắc Zero Data Authority' : 'Zero Data Authority Guarantee') :
                       currentUser.role === 'SURVIVOR_CLIENT' ? (lang === 'vi' ? 'Nguyên Tắc Chủ Quyền Nạn Nhân (Silence ≠ Consent)' : 'Survivor Sovereignty Principle') :
                       (lang === 'vi' ? 'Nguyên Tắc Đồng Thuận Quorum Tất Cả Các Bên' : 'All-Keyholders Consensus Principle')}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed">
                      {currentUser.roleDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 5: CÀI ĐẶT & BẢO MẬT PHIÊN (PREFERENCES)
                =================================================== */}
            {activeTab === 'preferences' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="pb-2 border-b border-[#E2E8F0]">
                  <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                    {lang === 'vi' ? 'Tùy Chọn Cá Nhân & Bảo Mật Phiên' : 'Preferences & Session Security'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {lang === 'vi' ? 'Quản lý cấu hình ngôn ngữ, cảnh báo âm thanh và thời gian khóa phiên' : 'Language selection, real-time alerts and session TTL auto-lock'}
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  {/* Language */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">
                        {lang === 'vi' ? 'Ngôn ngữ giao diện' : 'Display Language'}
                      </span>
                      <span className="text-[#64748B] text-xs">
                        {lang === 'vi' ? 'Chọn Tiếng Việt hoặc English cho toàn bộ hệ thống' : 'Select English or Vietnamese for the Matter Room'}
                      </span>
                    </div>
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-[#CBD5E1]">
                      <button
                        onClick={() => setLanguage('en')}
                        type="button"
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition cursor-pointer ${
                          lang === 'en' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-[#475569] hover:bg-white'
                        }`}
                      >
                        🇬🇧 EN
                      </button>
                      <button
                        onClick={() => setLanguage('vi')}
                        type="button"
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition cursor-pointer ${
                          lang === 'vi' ? 'bg-[#1E3A8A] text-white shadow-2xs' : 'text-[#475569] hover:bg-white'
                        }`}
                      >
                        🇻🇳 VI
                      </button>
                    </div>
                  </div>

                  {/* Quorum Push Alert */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">
                        {lang === 'vi' ? 'Thông báo Quorum thời gian thực' : 'Real-time Quorum Push Notification'}
                      </span>
                      <span className="text-[#64748B] text-xs">
                        {lang === 'vi' ? 'Hiển thị cảnh báo tức thì khi có yêu cầu mở niêm phong tài liệu C2' : 'Instant popups when a C2 document requires your cryptographic signature'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuorumAlerts(!quorumAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        quorumAlerts ? 'bg-[#0F766E]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          quorumAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Audio Alerts */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">
                        {lang === 'vi' ? 'Chuông cảnh báo bảo mật Enclave' : 'Enclave Security Audio Bells'}
                      </span>
                      <span className="text-[#64748B] text-xs">
                        {lang === 'vi' ? 'Phát âm thanh khi hoàn tất ký duyệt hoặc phát hiện ngoại lệ an ninh' : 'Audible tone upon successful consensus signature'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudioAlerts(!audioAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        audioAlerts ? 'bg-[#0F766E]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          audioAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Session Inactivity TTL */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">
                        {lang === 'vi' ? 'Thời gian tự động khóa phiên (Session Inactivity TTL)' : 'Session Inactivity Auto-Lock'}
                      </span>
                      <span className="text-[#64748B] text-xs">
                        {lang === 'vi' ? 'Tự động giải phóng phân vùng RAM khi không có thao tác' : 'Purge RAM cryptographic enclave keys when idle'}
                      </span>
                    </div>
                    <select
                      value={sessionTtl}
                      onChange={(e) => setSessionTtl(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] cursor-pointer"
                    >
                      <option value="15m">{lang === 'vi' ? '15 phút' : '15 minutes'}</option>
                      <option value="30m">{lang === 'vi' ? '30 phút (Mặc định)' : '30 mins (Default)'}</option>
                      <option value="1h">{lang === 'vi' ? '1 giờ' : '1 hour'}</option>
                      <option value="4h">{lang === 'vi' ? '4 giờ' : '4 hours'}</option>
                    </select>
                  </div>

                  {/* Purge RAM on close */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">
                        {lang === 'vi' ? 'Tự động hủy khóa trong RAM khi đóng trình duyệt' : 'Purge Keys on Tab / Browser Exit'}
                      </span>
                      <span className="text-[#64748B] text-xs">
                        {lang === 'vi' ? 'Không lưu giữ bản rõ hay token phiên trên đĩa cứng' : 'Zero persistence on local drive'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPurgeOnClose(!purgeOnClose)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        purgeOnClose ? 'bg-[#0F766E]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          purgeOnClose ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Emergency Lock Session Button */}
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-rose-900 uppercase">
                      {lang === 'vi' ? 'Khóa Phiên Khẩn Cấp (Panic Button)' : 'Emergency Session Lock'}
                    </h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      {lang === 'vi' ? 'Lập tức giải phóng toàn bộ khóa trong RAM và khóa kín dữ liệu.' : 'Immediately purge all decrypted state and memory registers.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert(lang === 'vi' ? 'Đã khóa phiên bảo mật khẩn cấp. Toàn bộ khóa tạm thời trong RAM đã được giải phóng.' : 'Emergency Session Locked. Ephemeral keys purged from memory.');
                      onClose();
                    }}
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    <span>{lang === 'vi' ? 'Khóa Ngay Lập Tức' : 'Lock Session Now'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 6: CHUYỂN ĐỔI ACTOR (SWITCH PERSONA)
                =================================================== */}
            {activeTab === 'switch-actor' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="pb-2 border-b border-[#E2E8F0]">
                  <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                    {lang === 'vi' ? 'Chuyển Đổi Nhanh Giữa Các Actor (Demo)' : 'Quick Switch Persona'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {lang === 'vi' ? 'Trải nghiệm giao diện và thẩm quyền dữ liệu từ góc nhìn của từng bên tham gia' : 'Experience the Matter Room from the perspective of each stakeholder'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(allUsers).map((u) => {
                    const isActive = u.role === currentUser.role;
                    const isItAdmin = u.role === 'ADMIN' || (u.role as string) === 'IT_ADMIN';

                    const roleBadge =
                      u.role === 'LEAD_COUNSEL' ? (lang === 'vi' ? 'Luật sư đại diện' : 'Lead Counsel') :
                      u.role === 'SURVIVOR_CLIENT' ? (lang === 'vi' ? 'Nạn nhân được bảo vệ' : 'Protected Litigant') :
                      u.role === 'GUARDIAN' ? (lang === 'vi' ? 'Người Giám Hộ' : 'Legal Guardian') :
                      (lang === 'vi' ? 'Admin (0% Quyền hạn)' : 'Admin (Zero Authority)');

                    return (
                      <div
                        key={u.id}
                        className={`p-4 rounded-xl border transition text-left flex flex-col justify-between gap-3 ${
                          isActive
                            ? 'bg-blue-50/70 border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                            {u.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                                isItAdmin ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-[#1E3A8A]'
                              }`}>
                                {roleBadge}
                              </span>
                              {isActive && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {lang === 'vi' ? 'Đang kích hoạt' : 'Active'}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] mt-1 truncate">
                              {u.name}
                            </h4>
                            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                              {u.organization}
                            </p>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {u.roleDescription}
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isActive) {
                              onSelectRole(u.role);
                              onClose();
                            }
                          }}
                          disabled={isActive}
                          className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-2xs'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isActive ? 'check' : 'login'}
                          </span>
                          <span>
                            {isActive
                              ? (lang === 'vi' ? 'Vai trò hiện tại' : 'Currently Active')
                              : (lang === 'vi' ? 'Chuyển sang vai trò này' : 'Switch to Persona')}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================
            MODAL FOOTER
            ======================================================== */}
        <div className="p-3.5 sm:p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">
              TideCloak Enclave: {isAdmin ? 'Blinded (Root Isolation)' : 'Session Active'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-sm transition cursor-pointer"
            >
              {lang === 'vi' ? 'Đóng Cửa Sổ' : 'Close'}
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          FACEBOOK-STYLE EDIT PROFILE MODAL (Sub-Modal)
          Allows user to edit name, title, bio, email, phone, etc.
          ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#1E3A8A]">edit_note</span>
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                  {lang === 'vi' ? 'Chỉnh Sửa Thông Tin Cá Nhân' : 'Edit Personal Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Họ và tên:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Chức danh & Tư cách pháp lý:' : 'Professional Title:'}
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Cơ quan / Văn phòng đại diện:' : 'Organization:'}
                </label>
                <input
                  type="text"
                  value={editFormData.organization}
                  onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Tiểu sử & Trích yếu vai trò:' : 'Bio / Mission Statement:'}
                </label>
                <textarea
                  rows={3}
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs resize-none"
                  placeholder={lang === 'vi' ? 'Nhập tóm tắt tiểu sử hoặc tuyên bố vai trò...' : 'Enter bio or role statement...'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'vi' ? 'Email bảo mật:' : 'Secure Email:'}
                  </label>
                  <input
                    type="email"
                    value={editFormData.secureEmail}
                    onChange={(e) => setEditFormData({ ...editFormData, secureEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'vi' ? 'Số điện thoại / Hotline:' : 'Phone / Hotline:'}
                  </label>
                  <input
                    type="text"
                    value={editFormData.securePhone}
                    onChange={(e) => setEditFormData({ ...editFormData, securePhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'vi' ? 'Địa chỉ trụ sở làm việc:' : 'Office Address:'}
                </label>
                <input
                  type="text"
                  value={editFormData.officeAddress}
                  onChange={(e) => setEditFormData({ ...editFormData, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  {lang === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-sm transition cursor-pointer"
                >
                  {lang === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
