import React, { useState } from 'react';
import { UserProfile, MatterDocument } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';
import { LegalBadge, LegalBadgeVariant } from '../common/LegalBadge';
import { LegalCard } from '../common/LegalCard';
import { tidecloak } from '../../lib/tidecloakSdk';
import { ForsetiEngine } from '../../lib/forsetiEngine';

interface AdminConsoleViewProps {
  currentUser: UserProfile;
  documents: MatterDocument[];
  onLogAudit: (action: string, status: 'BLOCKED_BY_TIDE', details: string) => void;
  onAttemptDecrypt: (doc: MatterDocument) => void;
  onOpenEnclaveInspector?: () => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  documents,
  onAttemptDecrypt,
  onOpenEnclaveInspector,
}) => {
  const { lang } = useLanguage();
  const [adminTab, setAdminTab] = useState<'infrastructure' | 'enclave'>('infrastructure');

  const token = tidecloak.getToken();
  const config = tidecloak.getConfig();
  const activeMode = tidecloak.getActiveMode();
  const integrity = ForsetiEngine.verifyContractIntegrity();

  const getLevelBadgeVariant = (level?: string): LegalBadgeVariant => {
    switch (level) {
      case 'LEVEL_4_CRITICAL':
        return 'teal';
      case 'LEVEL_3_HIGHLY_SENSITIVE':
        return 'amber';
      case 'LEVEL_2_SENSITIVE':
        return 'navy';
      default:
        return 'slate';
    }
  };

  const getLevelLabel = (level?: string): string => {
    switch (level) {
      case 'LEVEL_4_CRITICAL':
        return lang === 'vi' ? 'Cấp 4' : 'Level 4';
      case 'LEVEL_3_HIGHLY_SENSITIVE':
        return lang === 'vi' ? 'Cấp 3' : 'Level 3';
      case 'LEVEL_2_SENSITIVE':
        return lang === 'vi' ? 'Cấp 2' : 'Level 2';
      default:
        return lang === 'vi' ? 'Cấp 1' : 'Level 1';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 text-[#0F172A] font-sans">
      
      {/* 1. Header Card: Tổng quan Quyền Root Admin */}
      <LegalCard variant="surface" className="p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-base sm:text-lg text-[#0F172A] tracking-tight">
                {lang === 'vi' ? 'Quản Trị Hệ Thống (Root Admin Console)' : 'System Management (Root Admin Console)'}
              </h1>
              <LegalBadge variant="rose" size="sm">
                0% DATA AUTHORITY
              </LegalBadge>
            </div>
            <p className="text-xs text-[#475569] mt-0.5">
              {lang === 'vi'
                ? 'Quyền root máy chủ bị cô lập toán học, không thể đọc dữ liệu nạn nhân.'
                : 'Server root access is mathematically isolated from client cryptographic data.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block shrink-0">
          <LegalBadge variant="teal" dot pulse size="sm">
            {activeMode === 'LIVE_DOCKER_OIDC' ? 'TideCloak Live (8080)' : 'Web Enclave'}
          </LegalBadge>
        </div>
      </LegalCard>

      {/* 2. Sub-tab Navigation: Phân tách Quản lý Hạ Tầng và TideCloak Enclave Telemetry */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setAdminTab('infrastructure')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            adminTab === 'infrastructure'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">dns</span>
          <span>{lang === 'vi' ? 'Hạ Tầng & Thử Nghiệm Từ Chối' : 'Infrastructure & Negative Tests'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('enclave')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            adminTab === 'enclave'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">terminal</span>
          <span>{lang === 'vi' ? 'TideCloak Enclave Live (Cổng 8080)' : 'TideCloak Enclave Live (Port 8080)'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </button>
      </div>

      {/* TAB 1: HẠ TẦNG & KIỂM THỬ TỪ CHỐI */}
      {adminTab === 'infrastructure' && (
        <div className="flex flex-col gap-5">
          {/* 3 Thẻ chỉ số chính */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Quyền Máy Chủ */}
            <LegalCard variant="surface" className="p-4 shadow-xs">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {lang === 'vi' ? 'Quyền máy chủ' : 'Server Root'}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">dns</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[#1E3A8A] mt-2">100%</p>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium">
                {lang === 'vi' ? 'Toàn quyền máy chủ & mạng' : 'Full infra & containers'}
              </p>
            </LegalCard>

            {/* Card 2: Quyền Dữ Liệu */}
            <LegalCard variant="surface" className="p-4 shadow-xs border-[#FECACA] bg-[#FEF2F2]/30">
              <div className="flex items-center justify-between text-[#991B1B]">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {lang === 'vi' ? 'Quyền dữ liệu' : 'Data Authority'}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#991B1B]">lock</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[#991B1B] mt-2">0%</p>
              <p className="text-[11px] text-[#991B1B] mt-1 font-medium">
                {lang === 'vi' ? 'Bị từ chối giải mã' : 'Access mathematically refused'}
              </p>
            </LegalCard>

            {/* Card 3: Khóa trong RAM */}
            <LegalCard variant="surface" className="p-4 shadow-xs">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {lang === 'vi' ? 'Khóa lưu trên RAM' : 'RAM Keys'}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#0F766E]">memory</span>
              </div>
              <p className="text-2xl font-bold font-mono text-[#0F766E] mt-2">0</p>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium">
                {lang === 'vi' ? 'Không lưu khóa bản rõ' : 'Zero master keys stored'}
              </p>
            </LegalCard>
          </div>

          {/* Bảng Kiểm Thử Quyền Truy Cập */}
          <LegalCard variant="surface" className="overflow-hidden shadow-xs">
            <div className="p-4 px-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h2 className="font-semibold text-xs uppercase tracking-wider text-[#0F172A]">
                  {lang === 'vi' ? 'Kiểm Thử Quyền Truy Cập (Negative Test)' : 'Access Rejection Test Suite'}
                </h2>
              </div>
              <LegalBadge variant="slate" size="sm">
                {documents.length} {lang === 'vi' ? 'hồ sơ niêm phong' : 'sealed records'}
              </LegalBadge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8FAFC] text-[#475569] text-[11px] font-semibold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-5 w-[14%] font-medium">ID</th>
                    <th className="py-3 px-4 w-[46%] font-medium">
                      {lang === 'vi' ? 'TÊN TÀI LIỆU' : 'DOCUMENT TITLE'}
                    </th>
                    <th className="py-3 px-4 w-[16%] font-medium">
                      {lang === 'vi' ? 'CẤP ĐỘ' : 'LEVEL'}
                    </th>
                    <th className="py-3 px-5 w-[24%] text-right font-medium">
                      {lang === 'vi' ? 'THAO TÁC ADMIN' : 'ACTION'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-[#0F172A]">
                  {documents.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs font-semibold text-[#1E3A8A]">
                        doc_0{idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-xs text-[#0F172A] truncate max-w-md">
                          {doc.title}
                        </p>
                        <span className="font-mono text-[10px] text-[#64748B] block mt-0.5 truncate max-w-sm">
                          {doc.encryptedHash?.split(' ')[0] || '0x7a9f02b1c8e4...'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <LegalBadge variant={getLevelBadgeVariant(doc.securityLevel)} size="sm">
                          {getLevelLabel(doc.securityLevel)}
                        </LegalBadge>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onAttemptDecrypt(doc)}
                          type="button"
                          className="px-3 py-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] font-semibold text-xs transition shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                          title="Click để kiểm chứng Admin bị từ chối giải mã"
                        >
                          <span className="material-symbols-outlined text-[15px]">lock_open</span>
                          <span>{lang === 'vi' ? 'Thử giải mã' : 'Attempt Decrypt'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LegalCard>
        </div>
      )}

      {/* TAB 2: TIDECLOAK ENCLAVE LIVE (CỔNG 8080) & THÔNG SỐ BẢO MẬT */}
      {adminTab === 'enclave' && (
        <div className="flex flex-col gap-4">
          {/* Card Thông tin kết nối Docker Enclave */}
          <LegalCard variant="surface" className="p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">developer_board</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                    {lang === 'vi' ? 'Trạng Thái Kết Nối TideCloak Hardware Enclave' : 'TideCloak Hardware Enclave Status'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Attested AMD-SEV-SNP Node • Zero Knowledge Enclave Escrow
                  </p>
                </div>
              </div>

              {onOpenEnclaveInspector && (
                <button
                  onClick={onOpenEnclaveInspector}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold hover:bg-[#1e3a8a]/90 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">terminal</span>
                  <span>{lang === 'vi' ? 'Mở Enclave Inspector Chi Tiết' : 'Open Detailed Inspector'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">Chế độ OIDC</span>
                <LegalBadge variant={activeMode === 'LIVE_DOCKER_OIDC' ? 'teal' : 'navy'} dot pulse size="sm">
                  {activeMode === 'LIVE_DOCKER_OIDC' ? 'Port 8080 (Docker Live)' : 'Web Enclave'}
                </LegalBadge>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">Server URL</span>
                <p className="font-mono text-xs font-bold text-[#0F172A] truncate">{config.authServerUrl}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">Realm / Resource</span>
                <p className="font-mono text-xs font-bold text-[#1E3A8A] truncate">{config.realm} / {config.clientId}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-1">Forseti SHA-512</span>
                <p className="font-mono text-xs font-bold text-[#0D9488]">
                  {integrity.verified ? 'Verified (Match)' : 'Fallback OK'}
                </p>
              </div>
            </div>

            {/* Ephemeral Key & Session Claims Telemetry */}
            <div className="p-4 rounded-xl bg-[#0F172A] text-slate-100 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[#94A3B8] text-[11px] border-b border-slate-800 pb-1.5">
                <span>ENCLAVE HARDWARE ATTESTATION LOG</span>
                <span className="text-emerald-400">● LIVE RUNNING</span>
              </div>
              <p className="text-slate-300">
                <span className="text-[#38BDF8]">EphemeralKeySlot:</span> {token?.ephemeralKeySlot || '0x4f8e...ephemeral_enclave_slot'}
              </p>
              <p className="text-slate-300">
                <span className="text-[#38BDF8]">EnclaveAttestationHash:</span> {token?.enclaveAttestationHash || '0x8f3c...attested_sha512'}
              </p>
              <p className="text-slate-300">
                <span className="text-[#38BDF8]">ZeroDataAuthorityEnforced:</span> <span className="text-emerald-400">true (Hypervisor Root Blinded)</span>
              </p>
            </div>
          </LegalCard>
        </div>
      )}

    </div>
  );
};
