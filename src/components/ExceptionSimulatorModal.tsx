import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LegalBadge } from './common/LegalBadge';
import { LegalCard } from './common/LegalCard';

interface ExceptionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGuardianConflicted: boolean;
  onToggleGuardianConflict: () => void;
  isVictimUnreachable: boolean;
  onToggleVictimUnreachable: () => void;
  isSystemOutage: boolean;
  onToggleSystemOutage: () => void;
}

export const ExceptionSimulatorModal: React.FC<ExceptionSimulatorModalProps> = ({
  isOpen,
  onClose,
  isGuardianConflicted,
  onToggleGuardianConflict,
  isVictimUnreachable,
  onToggleVictimUnreachable,
  isSystemOutage,
  onToggleSystemOutage,
}) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Legal Amber Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#B45309]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 border border-[#FDE68A]">
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">
                  {lang === 'vi' ? 'Mô Phỏng Xử Lý Ngoại Lệ & Bảo Vệ Khẩn Cấp' : 'Exception Handling & Safeguards Engine'}
                </h3>
                <LegalBadge variant="amber" size="sm">
                  {lang === 'vi' ? 'BẢNG 5 BRAINSTORM-2' : 'TABLE 5 SAFEGUARDS'}
                </LegalBadge>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {lang === 'vi'
                  ? 'Quy tắc vàng: Khi có ngoại lệ, hệ thống vẫn bắt buộc phải thông báo và lưu vết kiểm toán (Fail-Safe)'
                  : 'Core Principle: Exception rule requires active notifications and immutable audit trails.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto bg-white text-xs sm:text-sm">
          
          {/* Banner Thông Điệp Nghiệp Vụ */}
          <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[17px]">policy</span>
              <span>{lang === 'vi' ? 'TRIẾT LÝ QUẢN TRỊ NGOẠI LỆ TIDECLOAK' : 'TIDECLOAK EXCEPTION PHILOSOPHY'}</span>
            </div>
            <p className="text-xs leading-relaxed text-[#78350F]">
              {lang === 'vi'
                ? 'Hệ thống bắt buộc phải có chính sách ngoại lệ được mã hóa bằng hợp đồng toán học. Nếu không, nhân viên sẽ tự ý vượt rào khi khẩn cấp. Mọi ngoại lệ đều phải giữ vững tính toàn vẹn của bằng chứng và bảo vệ nạn nhân.'
                : 'A system without mathematical exception policies forces staff to bypass controls informally during emergencies. TideCloak handles edge-cases with cryptographic safeguards.'}
            </p>
          </div>

          {/* 3 Kịch Bản Tương Tác Thử Nghiệm Trực Tiếp (Live Demos) */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">tune</span>
              <span>{lang === 'vi' ? '3 KỊCH BẢN NGOẠI LỆ THỰC THI THỬ NGHIỆM' : '3 INTERACTIVE EXCEPTION SCENARIOS'}</span>
            </h4>

            {/* Kịch Bản 1: Người giám hộ dính nghi vấn bạo hành (Rule 4) */}
            <LegalCard variant="surface" className={`p-4 border transition-all ${isGuardianConflicted ? 'border-[#FECACA] bg-[#FEF2F2]/40' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isGuardianConflicted ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {isGuardianConflicted ? 'no_accounts' : 'supervised_user_circle'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#0F172A]">
                        {lang === 'vi' ? 'Ngoại lệ 4: Người giám hộ bị tình nghi bạo hành' : 'Exception 4: Guardian Implicated in Abuse'}
                      </span>
                      {isGuardianConflicted ? (
                        <LegalBadge variant="rose" size="sm">
                          {lang === 'vi' ? 'ĐÃ LOẠI TRỪ KHỎI QUORUM' : 'EXCLUDED FROM QUORUM'}
                        </LegalBadge>
                      ) : (
                        <LegalBadge variant="slate" size="sm">
                          {lang === 'vi' ? 'Bình thường (3/3 Chữ ký)' : 'Standard (3/3 Required)'}
                        </LegalBadge>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {lang === 'vi'
                        ? 'Khi có báo cáo người giám hộ có hành vi bạo hành hoặc xung đột lợi ích: Hệ thống tự động loại trừ Người giám hộ khỏi luồng duyệt Quorum, giảm ngưỡng từ 3/3 xuống 2/2 (Chỉ cần Nạn nhân + Luật sư).'
                        : 'If guardian is implicated: Automatically exclude the conflicted guardian from approval route and reduce threshold to 2-of-2 (Survivor + Counsel).'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleGuardianConflict}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 shadow-2xs ${
                    isGuardianConflicted
                      ? 'bg-[#991B1B] text-white hover:bg-[#7F1D1D]'
                      : 'bg-[#1E3A8A] text-white hover:bg-[#172554]'
                  }`}
                >
                  {isGuardianConflicted
                    ? (lang === 'vi' ? 'Hủy báo động' : 'Deactivate Alert')
                    : (lang === 'vi' ? 'Kích hoạt xung đột' : 'Simulate Conflict')}
                </button>
              </div>
            </LegalCard>

            {/* Kịch Bản 2: Nạn nhân tạm thời mất liên lạc (Silence != Consent - Rule 3) */}
            <LegalCard variant="surface" className={`p-4 border transition-all ${isVictimUnreachable ? 'border-[#FDE68A] bg-[#FFFBEB]/50' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isVictimUnreachable ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {isVictimUnreachable ? 'person_off' : 'person_check'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#0F172A]">
                        {lang === 'vi' ? 'Ngoại lệ 3: Nạn nhân mất liên lạc (Silence != Consent)' : 'Exception 3: Victim Unreachable'}
                      </span>
                      {isVictimUnreachable ? (
                        <LegalBadge variant="amber" size="sm">
                          {lang === 'vi' ? 'KHÓA BẢO VỆ IM LẶNG' : 'SILENCE != CONSENT'}
                        </LegalBadge>
                      ) : (
                        <LegalBadge variant="slate" size="sm">
                          {lang === 'vi' ? 'Đang trực tuyến' : 'Online / Available'}
                        </LegalBadge>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {lang === 'vi'
                        ? 'Tuyệt đối không coi sự im lặng là đồng thuận. Mọi yêu cầu xin mở tài liệu nhạy cảm C2 trong lúc nạn nhân ngoại tuyến đều bị tạm khóa, bảo đảm dữ liệu không bị rò rỉ trái ý muốn.'
                        : 'Do not treat silence as consent. Requests remain strictly pending/denied without valid statutory basis.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleVictimUnreachable}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 shadow-2xs ${
                    isVictimUnreachable
                      ? 'bg-[#B45309] text-white hover:bg-[#92400E]'
                      : 'bg-[#1E3A8A] text-white hover:bg-[#172554]'
                  }`}
                >
                  {isVictimUnreachable
                    ? (lang === 'vi' ? 'Nạn nhân online' : 'Set Available')
                    : (lang === 'vi' ? 'Mô phỏng mất liên lạc' : 'Simulate Offline')}
                </button>
              </div>
            </LegalCard>

            {/* Kịch Bản 3: Sự cố hệ thống ngừng hoạt động (System Outage Fail-Closed - Rule 8) */}
            <LegalCard variant="surface" className={`p-4 border transition-all ${isSystemOutage ? 'border-[#CBD5E1] bg-[#F1F5F9]' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isSystemOutage ? 'bg-[#334155] text-white border-[#1E293B]' : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {isSystemOutage ? 'cloud_off' : 'cloud_done'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#0F172A]">
                        {lang === 'vi' ? 'Ngoại lệ 8: Sự cố máy chủ (System Outage Fail-Closed)' : 'Exception 8: System Outage Fail-Closed'}
                      </span>
                      {isSystemOutage ? (
                        <LegalBadge variant="slate" size="sm">
                          {lang === 'vi' ? 'FAIL-CLOSED (KHÓA TOÀN BỘ)' : 'FAIL-CLOSED ENFORCED'}
                        </LegalBadge>
                      ) : (
                        <LegalBadge variant="teal" size="sm">
                          {lang === 'vi' ? 'Hạ tầng bình thường' : 'Normal Operation'}
                        </LegalBadge>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {lang === 'vi'
                        ? 'Khi mạng sập hoặc máy chủ gặp sự cố: Hệ thống mặc định từ chối giải mã mọi dữ liệu nhạy cảm C2 (Fail-Closed), ngăn chặn hacker lợi dụng sự cố để trích xuất dữ liệu.'
                        : 'Deny sensitive access by default during system outages to prevent opportunistic exploitation.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleSystemOutage}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 shadow-2xs ${
                    isSystemOutage
                      ? 'bg-[#334155] text-white hover:bg-[#1E293B]'
                      : 'bg-[#1E3A8A] text-white hover:bg-[#172554]'
                  }`}
                >
                  {isSystemOutage
                    ? (lang === 'vi' ? 'Khôi phục mạng' : 'Restore Online')
                    : (lang === 'vi' ? 'Mô phỏng sập mạng' : 'Simulate Outage')}
                </button>
              </div>
            </LegalCard>
          </div>

          {/* Bảng Tham Chiếu 10 Ngoại Lệ (Table 5) */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="bg-[#F8FAFC] px-4 py-2.5 border-b border-[#E2E8F0] font-bold text-xs text-[#475569] uppercase tracking-wider flex items-center justify-between">
              <span>{lang === 'vi' ? 'DANH MỤC 10 CHÍNH SÁCH NGOẠI LỆ (TABLE 5)' : '10 EXCEPTION POLICIES SPECIFICATION'}</span>
              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                ISO/IEC 29148 Compliant
              </span>
            </div>
            <div className="divide-y divide-[#F1F5F9] max-h-48 overflow-y-auto text-xs">
              <div className="p-3 flex justify-between items-center gap-2">
                <span className="font-semibold text-[#0F172A]">1. Đe dọa tính mạng tức thì</span>
                <span className="text-[#475569] text-right">Chỉ mở khi có căn cứ luật định & ghi danh người chịu trách nhiệm</span>
              </div>
              <div className="p-3 flex justify-between items-center gap-2 bg-[#F8FAFC]/50">
                <span className="font-semibold text-[#0F172A]">2. Lệnh tòa án hợp pháp</span>
                <span className="text-[#475569] text-right">Chuyển luật sư thẩm định phạm vi và người nhận</span>
              </div>
              <div className="p-3 flex justify-between items-center gap-2">
                <span className="font-semibold text-[#0F172A]">5. Luật sư rút lui khỏi vụ án</span>
                <span className="text-[#475569] text-right">Thu hồi ngay lập tức mọi quyền truy cập vụ án</span>
              </div>
              <div className="p-3 flex justify-between items-center gap-2 bg-[#F8FAFC]/50">
                <span className="font-semibold text-[#0F172A]">6. Nghi ngờ tài khoản bị chiếm đoạt (ATO)</span>
                <span className="text-[#475569] text-right">Tạm đình chỉ phiên hoạt động và hủy phê duyệt đang chờ</span>
              </div>
              <div className="p-3 flex justify-between items-center gap-2">
                <span className="font-semibold text-[#0F172A]">7. Nghi ngờ rò rỉ dữ liệu</span>
                <span className="text-[#475569] text-right">Cô lập quyền truy cập và bảo toàn chứng cứ kỹ thuật số</span>
              </div>
              <div className="p-3 flex justify-between items-center gap-2 bg-[#F8FAFC]/50">
                <span className="font-semibold text-[#0F172A]">9. Nạn nhân rút lại đồng thuận</span>
                <span className="text-[#475569] text-right">Dừng xử lý dữ liệu ngay lập tức theo luật</span>
              </div>
              <div className="p-3 flex justify-between items-center gap-2">
                <span className="font-semibold text-[#0F172A]">10. Lưu giữ hồ sơ tố tụng</span>
                <span className="text-[#475569] text-right">Lưu trữ không đồng nghĩa với quyền tự do xem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            {lang === 'vi' ? 'Đóng & Áp Dụng Chính Sách' : 'Close & Apply Safeguards'}
          </button>
        </div>
      </div>
    </div>
  );
};
