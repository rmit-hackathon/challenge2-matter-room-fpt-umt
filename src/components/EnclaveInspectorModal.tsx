import React, { useState } from 'react';
import { tidecloak } from '../lib/tidecloakSdk';
import { ForsetiEngine } from '../lib/forsetiEngine';
import manifest from '../../contracts/forseti/policy_manifest.json';
import mcpConfig from '../../mcp.json';

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-outline-variant/20 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">terminal</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-lg tracking-tight">
                  TideCloak Architecture & Security Enclave Inspector
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold">
                  {activeMode === 'LIVE_DOCKER_OIDC' ? '● LIVE DOCKER OIDC' : '● SECURE WEB ENCLAVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Attested AMD-SEV-SNP Node • Realm: {config.realm} • Client: {config.clientId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-outline-variant/20 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('oidc')}
            type="button"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'oidc'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            <span>Trụ cột 1: TideCloak OIDC Token</span>
          </button>

          <button
            onClick={() => setActiveTab('forseti')}
            type="button"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'forseti'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>Trụ cột 4: Forseti C# Policy Contract</span>
          </button>

          <button
            onClick={() => setActiveTab('mcp')}
            type="button"
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'mcp'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Tide MCP Server (Raziel)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white text-slate-800">

          {/* TAB 1: OIDC TOKEN & SDK DETAILS */}
          {activeTab === 'oidc' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Auth Server URL</span>
                  <p className="font-mono text-xs font-bold text-slate-900 mt-1">{config.authServerUrl}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Active Role</span>
                  <p className="font-mono text-xs font-bold text-blue-700 mt-1">{tidecloak.getRole()}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Data Authority</span>
                  <p className={`font-mono text-xs font-bold mt-1 ${tidecloak.getRole() === 'IT_ADMIN' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tidecloak.getRole() === 'IT_ADMIN' ? '0% ZERO DATA AUTHORITY' : '100% SOVEREIGN / QUORUM'}
                  </p>
                </div>
              </div>

              {/* JWT Claims Inspection Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-200 p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
                  <span>DECODED OIDC JWT CLAIMS (Tide Ineffable Identity)</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(token?.claims, null, 2), 'claims')}
                    type="button"
                    className="text-blue-400 hover:text-blue-300 font-bold"
                  >
                    {copiedText === 'claims' ? '✓ Copied' : 'Copy Claims JSON'}
                  </button>
                </div>
                <pre className="text-emerald-400 text-[11px] leading-relaxed overflow-x-auto">
                  {JSON.stringify(token?.claims, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs space-y-1">
                <span className="text-slate-500 text-[11px] font-bold">RAW SESSION JWT TOKEN:</span>
                <p className="break-all text-slate-700 text-[10px] bg-white p-2.5 rounded border border-slate-200">
                  {token?.accessToken}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FORSETI C# POLICY CONTRACT */}
          {activeTab === 'forseti' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Policy Contract ID</span>
                  <p className="font-mono text-xs font-bold text-slate-900 mt-1 line-clamp-1">{manifest.policyContractId}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">ORK Node Consensus</span>
                  <p className="font-mono text-xs font-bold text-blue-700 mt-1">{manifest.orkConsensusThreshold}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Attestation Status</span>
                  <p className="font-mono text-xs font-bold text-emerald-600 mt-1">{manifest.status}</p>
                </div>
              </div>

              {/* SHA-512 Bytecode Hash */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase">Bytecode SHA-512 Attestation Hash:</span>
                  <button
                    onClick={() => handleCopy(integrity.sha512, 'sha512')}
                    type="button"
                    className="text-blue-700 hover:text-blue-900 font-bold text-[11px]"
                  >
                    {copiedText === 'sha512' ? '✓ Copied' : 'Copy Hash'}
                  </button>
                </div>
                <p className="break-all font-bold text-[10px] text-amber-950">
                  {integrity.sha512}
                </p>
              </div>

              {/* 4 Invariant Rules Summary */}
              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase text-slate-600 text-[11px]">4 Invariant Rules Executed in AMD-SEV Enclave:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-rose-700">Invariant 1: Zero Data Authority</span>
                    <p className="text-slate-600 mt-1 text-[11px]">IT_ADMIN có 0% quyền truy cập. Fabric từ chối dẫn xuất khóa trong RAM.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-emerald-700">Invariant 2: Public Discovery</span>
                    <p className="text-slate-600 mt-1 text-[11px]">Lệnh niêm phong và hồ sơ Discovery mở cho tất cả các bên tham gia.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-indigo-700">Invariant 3: Sovereign Privilege</span>
                    <p className="text-slate-600 mt-1 text-[11px]">Lời khai riêng tư và nhật ký chỉ mở cho Nạn nhân Jane Doe & Lead Counsel.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="font-bold text-amber-700">Invariant 4: Multi-Party Quorum</span>
                    <p className="text-slate-600 mt-1 text-[11px]">Hồ sơ y tế Exhibit B yêu cầu đồng thuận 2-of-2 trước khi mở cho Bác sĩ Vance.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIDE MCP SERVER RAZIEL */}
          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-sm text-slate-900">{mcpConfig.mcpServers['tide-raziel'].name}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {mcpConfig.mcpServers['tide-raziel'].description}
                </p>
                <div className="font-mono text-xs text-blue-700 font-bold bg-white p-2 rounded border border-slate-200 inline-block">
                  URL: {mcpConfig.mcpServers['tide-raziel'].url}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase text-slate-600 text-[11px]">Tide Emergent Authority MCP Tools:</span>
                <div className="space-y-2">
                  {mcpConfig.mcpServers['tide-raziel'].tools.map(tool => (
                    <div key={tool} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between font-mono">
                      <span className="font-bold text-slate-800">{tool}()</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-bold border border-emerald-200">
                        Active & Attested
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-outline-variant/20 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Fork Hash: {manifest.sha512.substring(0, 18)}...</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm font-sans"
          >
            Đóng Enclave Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
