import React, { useState } from 'react';
import { tidecloak } from '../lib/tidecloakSdk';
import { ForsetiEngine } from '../lib/forsetiEngine';
import manifest from '../../contracts/forseti/policy_manifest.json';
import mcpConfig from '../../mcp.json';
import { LegalBadge } from './common/LegalBadge';
import { LegalCard } from './common/LegalCard';

interface EnclaveInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnclaveInspectorModal: React.FC<EnclaveInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'oidc' | 'forseti' | 'mcp'>('oidc');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const token = tidecloak.getToken();
  const config = tidecloak.getConfig();
  const activeMode = tidecloak.getActiveMode();
  const integrity = ForsetiEngine.verifyContractIntegrity();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full shadow-xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header: Pure Light Style */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-[#E2E8F0] bg-white text-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">terminal</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg tracking-tight text-[#0F172A]">
                  TideCloak Architecture & Security Enclave Inspector
                </h3>
                <LegalBadge variant={activeMode === 'LIVE_DOCKER_OIDC' ? 'teal' : 'navy'} dot size="sm">
                  {activeMode === 'LIVE_DOCKER_OIDC' ? 'LIVE DOCKER OIDC' : 'SECURE WEB ENCLAVE'}
                </LegalBadge>
              </div>
              <p className="text-xs text-[#475569] mt-0.5 font-mono">
                Attested AMD-SEV-SNP Node • Realm: {config.realm} • Client: {config.clientId}
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

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('oidc')}
            type="button"
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'oidc'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white shadow-2xs'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            <span>Trụ cột 1: TideCloak OIDC Token</span>
          </button>

          <button
            onClick={() => setActiveTab('forseti')}
            type="button"
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'forseti'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white shadow-2xs'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>Trụ cột 4: Forseti C# Policy Contract</span>
          </button>

          <button
            onClick={() => setActiveTab('mcp')}
            type="button"
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'mcp'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white shadow-2xs'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Tide MCP Server (Raziel)</span>
          </button>
        </div>

        {/* Tab Content Body: 100% Pure Light Theme */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white text-[#0F172A]">

          {/* TAB 1: OIDC TOKEN & SDK DETAILS */}
          {activeTab === 'oidc' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LegalCard variant="muted" className="p-3.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Auth Server URL</span>
                  <p className="font-mono text-xs font-semibold text-[#0F172A] mt-1 truncate">{config.authServerUrl}</p>
                </LegalCard>
                <LegalCard variant="muted" className="p-3.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Active Role</span>
                  <p className="font-mono text-xs font-semibold text-[#1E3A8A] mt-1">{tidecloak.getRole()}</p>
                </LegalCard>
                <LegalCard variant="muted" className="p-3.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Data Authority</span>
                  <div className="mt-1">
                    {tidecloak.getRole() === 'IT_ADMIN' ? (
                      <LegalBadge variant="rose" size="sm">0% ZERO DATA AUTHORITY</LegalBadge>
                    ) : (
                      <LegalBadge variant="teal" size="sm">100% SOVEREIGN QUORUM</LegalBadge>
                    )}
                  </div>
                </LegalCard>
              </div>

              {/* JWT Claims Inspection Box: Pure Light style with #F8FAFC paper background */}
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[#475569] pb-2 border-b border-[#E2E8F0] text-[11px]">
                  <span className="font-semibold text-[#0F172A]">DECODED OIDC JWT CLAIMS (Tide Ineffable Identity)</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(token?.claims, null, 2), 'claims')}
                    type="button"
                    className="text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
                  >
                    {copiedText === 'claims' ? '✓ Đã sao chép' : 'Sao chép Claims JSON'}
                  </button>
                </div>
                <pre className="text-[#0F172A] text-[11px] leading-relaxed overflow-x-auto bg-white p-3.5 rounded-lg border border-[#E2E8F0]">
                  {JSON.stringify(token?.claims, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 font-mono text-xs space-y-1">
                <span className="text-[#475569] text-[11px] font-bold">RAW SESSION JWT TOKEN:</span>
                <p className="break-all text-[#475569] text-[10px] bg-white p-2.5 rounded border border-[#E2E8F0]">
                  {token?.accessToken}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FORSETI C# POLICY CONTRACT */}
          {activeTab === 'forseti' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LegalCard variant="muted" className="p-3.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Policy Contract ID</span>
                  <p className="font-mono text-xs font-semibold text-[#0F172A] mt-1 line-clamp-1">{manifest.policyContractId}</p>
                </LegalCard>
                <LegalCard variant="muted" className="p-3.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">ORK Node Consensus</span>
                  <p className="font-mono text-xs font-semibold text-[#1E3A8A] mt-1">{manifest.orkConsensusThreshold}</p>
                </LegalCard>
                <LegalCard variant="muted" className="p-3.5 shadow-2xs">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Attestation Status</span>
                  <div className="mt-1">
                    <LegalBadge variant="teal" size="sm">{manifest.status}</LegalBadge>
                  </div>
                </LegalCard>
              </div>

              {/* SHA-512 Bytecode Hash */}
              <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] text-[#B45309] font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase">Bytecode SHA-512 Attestation Hash:</span>
                  <button
                    onClick={() => handleCopy(integrity.sha512, 'sha512')}
                    type="button"
                    className="text-[#B45309] hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    {copiedText === 'sha512' ? '✓ Đã sao chép' : 'Sao chép Hash'}
                  </button>
                </div>
                <p className="break-all font-semibold text-[10px] text-[#78350F] bg-white p-2 rounded border border-[#FEF3C7]">
                  {integrity.sha512}
                </p>
              </div>

              {/* 4 Invariant Rules Summary */}
              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase text-[#475569] text-[11px]">4 Invariant Rules Executed in AMD-SEV Enclave:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <LegalCard variant="surface" className="p-3 shadow-2xs border-[#FECACA] bg-[#FEF2F2]/30">
                    <span className="font-bold text-[#991B1B]">Invariant 1: Zero Data Authority</span>
                    <p className="text-[#475569] mt-1 text-[11px]">IT_ADMIN có 0% quyền truy cập. Fabric từ chối dẫn xuất khóa trong RAM.</p>
                  </LegalCard>
                  <LegalCard variant="surface" className="p-3 shadow-2xs border-[#CCFBF1] bg-[#F0FDFA]/30">
                    <span className="font-bold text-[#0F766E]">Invariant 2: Public Discovery</span>
                    <p className="text-[#475569] mt-1 text-[11px]">Lệnh niêm phong và hồ sơ Discovery mở cho tất cả các bên tham gia.</p>
                  </LegalCard>
                  <LegalCard variant="surface" className="p-3 shadow-2xs border-[#BFDBFE] bg-[#EFF6FF]/30">
                    <span className="font-bold text-[#1E3A8A]">Invariant 3: Sovereign Privilege</span>
                    <p className="text-[#475569] mt-1 text-[11px]">Lời khai riêng tư và nhật ký chỉ mở cho Nạn nhân Jane Doe & Lead Counsel.</p>
                  </LegalCard>
                  <LegalCard variant="surface" className="p-3 shadow-2xs border-[#FEF3C7] bg-[#FFFBEB]/30">
                    <span className="font-bold text-[#B45309]">Invariant 4: Multi-Party Quorum</span>
                    <p className="text-[#475569] mt-1 text-[11px]">Hồ sơ y tế Exhibit B yêu cầu đồng thuận 2-of-2 trước khi mở cho Bác sĩ Vance.</p>
                  </LegalCard>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIDE MCP SERVER RAZIEL */}
          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <LegalCard variant="muted" className="p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E] animate-pulse" />
                  <span className="font-bold text-sm text-[#0F172A]">{mcpConfig.mcpServers['tide-raziel'].name}</span>
                </div>
                <p className="text-xs text-[#475569]">
                  {mcpConfig.mcpServers['tide-raziel'].description}
                </p>
                <div className="font-mono text-xs text-[#1E3A8A] font-semibold bg-white p-2 rounded border border-[#E2E8F0] inline-block">
                  URL: {mcpConfig.mcpServers['tide-raziel'].url}
                </div>
              </LegalCard>

              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase text-[#475569] text-[11px]">Tide Emergent Authority MCP Tools:</span>
                <div className="space-y-2">
                  {mcpConfig.mcpServers['tide-raziel'].tools.map(tool => (
                    <div key={tool} className="p-3 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between font-mono shadow-2xs">
                      <span className="font-semibold text-[#0F172A]">{tool}()</span>
                      <LegalBadge variant="teal" size="sm">Active & Attested</LegalBadge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs text-[#475569] font-mono">
          <span>Fork Hash: {manifest.sha512.substring(0, 18)}...</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white font-semibold text-xs hover:bg-[#172554] transition shadow-xs font-sans cursor-pointer"
          >
            Đóng Enclave Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
