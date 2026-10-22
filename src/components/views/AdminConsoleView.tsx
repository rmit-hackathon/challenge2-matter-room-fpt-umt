import React, { useState } from 'react';
import { UserProfile, MatterDocument } from '../../types/matter';
import { TideCloakMatterService } from '../../lib/tidecloak';

interface AdminConsoleViewProps {
  currentUser: UserProfile;
  documents: MatterDocument[];
  onLogAudit: (action: string, status: 'BLOCKED_BY_TIDE', details: string) => void;
  onAttemptDecrypt: (doc: MatterDocument) => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  currentUser,
  documents,
  onLogAudit,
  onAttemptDecrypt,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Hypervisor boot verified via AMD SEV-SNP secure hardware attestation.',
    '[TIDE_FABRIC] Enclave bridge established with 7 distributed witness nodes.',
    '[ZERO_KNOWLEDGE] Storage daemon initialized with 0 cryptographic root keys in memory.'
  ]);

  const handleSimulateExploit = () => {
    setIsShaking(true);
    const result = TideCloakMatterService.attemptAdminOverride(currentUser);
    const logTime = new Date().toISOString().substring(11, 19);
    
    setTerminalLogs(prev => [
      `[${logTime}] [403 FORBIDDEN] Admin privilege escalation REJECTED by Tide Fabric.`,
      `[${logTime}] [TAMPER_PREVENTION] Root user [IAM:root/admin] attempted memory dump. 0 plaintext keys extracted.`,
      ...prev
    ]);

    onLogAudit(
      'UNILATERAL_ADMIN_OVERRIDE_ATTEMPT',
      'BLOCKED_BY_TIDE',
      result.logAudit || `Admin attempted direct server memory key extraction. Action blocked by TideCloak hardware enclave.`
    );

    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-slate-100 font-sans">
      
      {/* Top Banner: Zero Data Authority Guard */}
      <div className="p-4 sm:p-5 rounded-xl bg-rose-950/40 border-2 border-rose-500/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
            <span className="material-symbols-outlined text-[26px]">gpp_bad</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-extrabold text-base text-rose-200 uppercase tracking-wide">
                Cloud Infrastructure &amp; Enclave Console
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold font-mono">
                ZERO DATA AUTHORITY ENFORCED
              </span>
            </div>
            <p className="text-xs text-rose-300/80 mt-0.5">
              Role: <strong>Admin (Alex Mercer)</strong> • Hosting Provider: LegalCloud Infrastructure. You hold hypervisor root credentials, but TideCloak blinds you from user data.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateExploit}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition active:scale-[0.98] shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">security_update_warning</span>
          <span>Attempt Root Key Dump</span>
        </button>
      </div>

      {/* 4 Server Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Hypervisor CPU</span>
          <p className="text-xl font-mono font-extrabold text-sky-400 mt-2">14.2% Load</p>
          <span className="text-[10px] text-slate-500 mt-1">AMD EPYC 7763 64-Core</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Encrypted RAM</span>
          <p className="text-xl font-mono font-extrabold text-emerald-400 mt-2">6.4 GB / 64 GB</p>
          <span className="text-[10px] text-slate-500 mt-1">SEV-SNP Hardware Memory Isolated</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Plaintext Keys</span>
          <p className="text-xl font-mono font-extrabold text-rose-400 mt-2">0 Keys Present</p>
          <span className="text-[10px] text-slate-500 mt-1">Tide Blind Cryptographic Invariant</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Consensus Nodes</span>
          <p className="text-xl font-mono font-extrabold text-amber-400 mt-2">7 / 7 Online</p>
          <span className="text-[10px] text-slate-500 mt-1">Fabric Latency: 14ms</span>
        </div>
      </div>

      {/* Database Storage: Raw Ciphertext Blobs */}
      <div className={`bg-slate-900/90 rounded-xl border border-slate-800 shadow-md overflow-hidden transition-all ${isShaking ? 'animate-shake border-rose-500' : ''}`}>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-sky-400">database</span>
              <span>Raw Database Payload Storage (Admin Perspective)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice: Storage blocks contain solely AES-256 ciphertext blobs. Admin has no decryption capability.
            </p>
          </div>

          <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
            Storage Engine: Enclave Air-Gap
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">BLOB ID</th>
                <th className="py-3 px-4">ENCRYPTED CIPHERTEXT BLOCK</th>
                <th className="py-3 px-4">SIZE</th>
                <th className="py-3 px-4">HARDWARE ATTESTATION</th>
                <th className="py-3 px-5 text-right">ROOT ADMIN ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {documents.map((doc, idx) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-sky-400">
                    payload_blob_00{idx + 1}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 break-all select-all">
                    7a9f02b1c8e4d3a2f1b0c9d8e7...{' '}
                    <span className="text-rose-400 font-bold">[SEALED BY TIDE]</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-400">
                    {doc.size}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      AMD SEV #0{idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onAttemptDecrypt(doc)}
                      type="button"
                      className="px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1 font-sans"
                    >
                      <span className="material-symbols-outlined text-[14px]">lock_open</span>
                      <span>Attempt Exploit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Server Terminal Log */}
      <div className="bg-black/80 rounded-xl border border-slate-800 p-5 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-400">
          <span className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>Live Enclave Security Journal</span>
          </span>
          <span className="text-[11px]">Node Cluster: tide-fabric-asia-se01</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
          {terminalLogs.map((log, i) => (
            <p
              key={i}
              className={`leading-relaxed ${
                log.includes('403') || log.includes('TAMPER') ? 'text-rose-400 font-bold' : 'text-slate-400'
              }`}
            >
              {log}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
};
