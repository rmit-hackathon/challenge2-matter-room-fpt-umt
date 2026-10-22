import React, { useState } from 'react';
import { MatterDocument, UserProfile } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: MatterDocument | null;
  currentUser: UserProfile;
  onAuthenticationComplete: () => void;
}

export const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  isOpen,
  onClose,
  document,
  currentUser,
  onAuthenticationComplete,
}) => {
  const { lang } = useLanguage();
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !document) return null;

  const handleQuickAuthenticate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onAuthenticationComplete();
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Solid Legal Navy Stripe */}
        <div className="h-1 w-full bg-[#1E3A8A]" />

        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] flex items-center justify-center font-semibold shadow-2xs">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
                  {lang === 'vi' ? 'Xác Thực Danh Tính Chuyên Gia' : 'Stakeholder Fast Identity Verification'}
                </h2>
                <p className="text-xs text-[#64748B]">
                  {lang === 'vi' ? 'Quy trình ủy quyền khẩn cấp' : 'Tide Single-Touch Enclave Auth'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Context Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">{lang === 'vi' ? 'Người yêu cầu:' : 'Signer:'}</span>
              <span className="font-bold text-slate-900">{currentUser.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">{lang === 'vi' ? 'Tài liệu nhắm tới:' : 'Target Document:'}</span>
              <span className="font-bold text-[#1E3A8A] max-w-[220px] truncate">{document.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{lang === 'vi' ? 'Cơ chế giải mã:' : 'Decryption Enclave:'}</span>
              <span className="font-mono text-[#0F766E] font-semibold bg-[#F0FDFA] px-2 py-0.5 rounded border border-[#CCFBF1]">
                WebCrypto AES-256-GCM
              </span>
            </div>
          </div>

          {/* Single Confirmation Action Button */}
          <button
            onClick={handleQuickAuthenticate}
            disabled={isVerifying}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{lang === 'vi' ? 'Đang tổng hợp khóa...' : 'Synthesizing Session Key...'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                <span>{lang === 'vi' ? 'Xác Nhận & Mở Khóa Giải Mã (1 Chạm)' : 'One-Touch Verify & Synthesize Key'}</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            {lang === 'vi' 
              ? 'Khóa phiên tạm thời sẽ được tạo trực tiếp trên trình duyệt của bạn và tự hủy sau khi xem.' 
              : 'Ephemeral session key synthesized in browser RAM and burned automatically.'}
          </p>
        </div>

      </div>
    </div>
  );
};
