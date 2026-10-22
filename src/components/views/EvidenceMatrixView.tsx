import React, { useState } from 'react';
import { MatterDocument, UserProfile, SecurityLevel, QuorumRequest } from '../../types/matter';

interface EvidenceMatrixViewProps {
  documents: MatterDocument[];
  currentUser: UserProfile;
  quorumRequests: QuorumRequest[];
  onOpenDocument: (doc: MatterDocument) => void;
  onOpenQuorumView: () => void;
  onOpenUploadModal?: () => void;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  documents,
  currentUser,
  quorumRequests,
  onOpenDocument,
  onOpenQuorumView,
  onOpenUploadModal,
}) => {
  const [activeLevel, setActiveLevel] = useState<SecurityLevel>('LEVEL_1_ROUTINE');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const levelConfigs: Record<SecurityLevel, {
    title: string;
    badge: string;
    badgeClass: string;
    dotColor: string;
    description: string;
    examples: string;
  }> = {
    LEVEL_1_ROUTINE: {
      title: 'Level 1 — Routine confidential information',
      badge: 'No per-request approval',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      dotColor: 'bg-emerald-500',
      description: 'Information necessary for ordinary case administration. Accessible to specifically assigned, authenticated users whose roles permit access.',
      examples: 'case status, appointment schedules, assigned lawyer\'s verified professional profile, general task deadlines.'
    },
    LEVEL_2_SENSITIVE: {
      title: 'Level 2 — Sensitive case information',
      badge: 'Restricted role-based access',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      dotColor: 'bg-blue-500',
      description: 'Information that should only be available to assigned professionals, but does not necessarily justify asking the victim to approve every view.',
      examples: 'procedural correspondence, legal research, redacted evidence indexes, routine case notes without intimate details.'
    },
    LEVEL_3_HIGHLY_SENSITIVE: {
      title: 'Level 3 — Highly sensitive personal information',
      badge: 'Explicit approval required',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      dotColor: 'bg-amber-500',
      description: 'Disclosure could cause substantial privacy, safety, reputational, or psychological harm. Require the victim\'s explicit, informed approval for discretionary access, subject to applicable law.',
      examples: 'detailed survivor statements, intimate medical records, identifiable images, private communications, precise safe-house locations.'
    },
    LEVEL_4_CRITICAL: {
      title: 'Level 4 — Critical or exceptionally restricted information',
      badge: 'Strongest access controls',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      dotColor: 'bg-rose-500',
      description: 'Information whose exposure could create immediate danger, permanently compromise evidence, or reveal another person\'s protected identity. Require purpose-specific approval plus enhanced authentication, where legally permissible.',
      examples: 'unredacted intimate imagery, protected witness identities, information revealing a survivor\'s undisclosed location, credentials or cryptographic keys.'
    }
  };

  const currentLevelConfig = levelConfigs[activeLevel];
  const filteredDocs = documents.filter(doc => doc.securityLevel === activeLevel);

  const handleCopy = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getQuorumStatusForDoc = (docId: string) => {
    const matchingReq = quorumRequests.find(q => q.targetDocumentId === docId);
    if (!matchingReq) return null;
    return matchingReq.status === 'APPROVED' || matchingReq.approvals.length >= matchingReq.threshold
      ? { text: '2/2 Quorum Satisfied', color: 'text-emerald-700 font-bold' }
      : { text: `Awaiting Quorum (${matchingReq.approvals.length}/${matchingReq.threshold})`, color: 'text-amber-700 font-bold' };
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Top Breadcrumb & Action Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>Matter 24-CV-8821</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-extrabold tracking-tight">Evidence Matrix</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-bold">{currentLevelConfig.title.split(' — ')[0]}</span>
        </div>

        {/* Survivor Upload Action Button */}
        {currentUser.role === 'SURVIVOR_CLIENT' ? (
          <button
            onClick={onOpenUploadModal}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span>Upload &amp; Seal Evidence (Client Enclave)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-mono text-xs text-[#1E3A8A] font-bold">
              4 Enclave Security Tiers
            </span>
          </div>
        )}
      </div>

      {/* 4 Classification Level Tabs (Exact Match to User Image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        {(Object.keys(levelConfigs) as SecurityLevel[]).map((levelKey) => {
          const cfg = levelConfigs[levelKey];
          const isSelected = activeLevel === levelKey;
          const count = documents.filter(d => d.securityLevel === levelKey).length;

          return (
            <button
              key={levelKey}
              onClick={() => setActiveLevel(levelKey)}
              type="button"
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                isSelected
                  ? 'bg-white text-slate-900 font-extrabold shadow-sm ring-2 ring-[#1E3A8A]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dotColor}`} />
                <span className="text-xs truncate">{cfg.title.split(' — ')[0]}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Level Overview Banner (Matching the User's Image Text 100%) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${currentLevelConfig.dotColor}`} />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {currentLevelConfig.title}
            </h2>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border w-fit ${currentLevelConfig.badgeClass}`}>
            {currentLevelConfig.badge}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {currentLevelConfig.description}
        </p>

        <div className="text-xs text-slate-500 pt-1">
          <strong className="text-slate-700">Examples:</strong> {currentLevelConfig.examples}
        </div>
      </div>

      {/* Evidence Repository Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6 w-[44%]">
                  EVIDENCE / DOCUMENT NAME
                </th>
                <th className="py-3.5 px-4 w-[16%]">
                  CLASSIFICATION
                </th>
                <th className="py-3.5 px-4 w-[16%]">
                  CRYPTOGRAPHIC HASH
                </th>
                <th className="py-3.5 px-4 w-[12%]">
                  ENCLAVE STATUS
                </th>
                <th className="py-3.5 px-6 w-[12%] text-right">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No documents currently sealed under {currentLevelConfig.title.split(' — ')[0]}.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const quorumStatus = getQuorumStatusForDoc(doc.id);
                  const isLevel3 = doc.securityLevel === 'LEVEL_3_HIGHLY_SENSITIVE';
                  const isLevel4 = doc.securityLevel === 'LEVEL_4_CRITICAL';

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Document Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                            isLevel4 ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            isLevel3 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            doc.securityLevel === 'LEVEL_2_SENSITIVE' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            <span className="material-symbols-outlined text-[22px]">
                              {isLevel4 ? 'shield_lock' : isLevel3 ? 'medical_services' : 'description'}
                            </span>
                          </div>
                          <div className="min-w-0 pr-4">
                            <p className="font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors leading-snug">
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 flex-wrap">
                              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {doc.category}
                              </span>
                              <span>•</span>
                              <span className="font-semibold text-slate-600">{doc.size}</span>
                              <span>•</span>
                              <span className="italic text-slate-500 line-clamp-1">{doc.summary}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Classification Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${currentLevelConfig.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full ${currentLevelConfig.dotColor}`} />
                          <span>{currentLevelConfig.badge}</span>
                        </span>
                      </td>

                      {/* Cryptographic Hash */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold shadow-2xs">
                            {doc.encryptedHash.split(' ')[0]}
                          </span>
                          <button
                            onClick={(e) => handleCopy(doc.encryptedHash, e)}
                            type="button"
                            className="p-1 rounded text-slate-400 hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors"
                            title="Copy SHA-256 hash"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {copiedHash === doc.encryptedHash ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                      </td>

                      {/* Enclave Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {doc.securityLevel === 'LEVEL_1_ROUTINE' && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600">public</span>
                            <span>Public Granted</span>
                          </span>
                        )}

                        {doc.securityLevel === 'LEVEL_2_SENSITIVE' && (
                          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">verified_user</span>
                            <span>Role Authorized</span>
                          </span>
                        )}

                        {doc.securityLevel === 'LEVEL_3_HIGHLY_SENSITIVE' && (
                          <span className={`text-xs flex items-center gap-1 ${quorumStatus?.color || 'text-amber-700 font-bold'}`}>
                            <span className="material-symbols-outlined text-[16px]">group_work</span>
                            <span>{quorumStatus?.text || 'Awaiting Victim Quorum'}</span>
                          </span>
                        )}

                        {doc.securityLevel === 'LEVEL_4_CRITICAL' && (
                          <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">enhanced_encryption</span>
                            <span>Strongest Dual Escrow</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm text-white ${
                            currentUser.role === 'FORENSIC_EXPERT' && isLevel3
                              ? quorumStatus?.text?.includes('Satisfied')
                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                              : isLevel4
                              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                              : isLevel3
                              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                              : 'bg-[#1E3A8A] hover:bg-[#172554] shadow-blue-900/20'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                          <span>
                            {currentUser.role === 'FORENSIC_EXPERT' && isLevel3
                              ? quorumStatus?.text?.includes('Satisfied')
                                ? 'Decrypt (1-Time Token)'
                                : 'Inspect Quorum Required'
                              : isLevel4
                              ? 'Decrypt (Dual Auth)'
                              : isLevel3
                              ? 'Decrypt & View'
                              : 'Decrypt & View'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footnote */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
            <span className="font-semibold">All payloads cryptographically blinded from Cloud Hypervisors and Admin.</span>
          </div>

          <button
            onClick={onOpenQuorumView}
            type="button"
            className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Quorum Approvals Escrow</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

      </div>

    </div>
  );
};
