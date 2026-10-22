import React, { useState } from 'react';
import { MatterDocument, UserProfile, ClassificationLevel, QuorumRequest } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';

interface EvidenceMatrixViewProps {
  documents: MatterDocument[];
  currentUser: UserProfile;
  quorumRequests: QuorumRequest[];
  onOpenDocument: (doc: MatterDocument) => void;
  onOpenQuorumView: () => void;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  documents,
  currentUser,
  quorumRequests,
  onOpenDocument,
  onOpenQuorumView,
}) => {
  const { t } = useLanguage();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Court Orders', 'Medical Evidence', 'Privileged Testimony', 'Witness Protection'];

  const filteredDocs = selectedCategory === 'ALL'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  const handleCopy = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getClassificationBadge = (level: ClassificationLevel) => {
    switch (level) {
      case 'DISCOVERY':
        return {
          label: t.publicDiscoveryBadge,
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: 'description',
          iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'RESTRICTED_EXPERT':
        return {
          label: t.restrictedExpertBadge,
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: 'medical_services',
          iconBg: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'STRICT_PRIVILEGE':
        return {
          label: t.strictPrivilegeBadge,
          color: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: 'shield_lock',
          iconBg: 'bg-rose-100 text-rose-800 border-rose-200'
        };
    }
  };

  const getQuorumStatusForDoc = (docId: string) => {
    const matchingReq = quorumRequests.find(q => q.targetDocumentId === docId);
    if (!matchingReq) return null;
    return matchingReq.status === 'APPROVED' || matchingReq.approvals.length >= matchingReq.threshold
      ? { text: t.quorumSatisfied, color: 'text-emerald-700 font-bold' }
      : { text: `${t.awaitingQuorum} (${matchingReq.approvals.length}/${matchingReq.threshold})`, color: 'text-amber-700 font-bold' };
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Top Action Breadcrumb & Context Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>Matter 24-CV-8821</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-extrabold tracking-tight">{t.navEvidenceMatrix}</span>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-mono text-xs text-[#1E3A8A] font-bold">
            {t.evidencePayloadsSealed}
          </span>
        </div>
      </div>

      {/* Case Header Brief Card with Judicial Accents */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Top Decorative Judicial Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-amber-500 to-emerald-500" />

        <div className="p-6 sm:p-7 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                  {t.sealedLitigationTag}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">Case #2026-CV-04421</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {t.caseTitle}
              </h1>
            </div>

            <button
              onClick={onOpenQuorumView}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-300 shadow-sm shrink-0 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-700">how_to_reg</span>
              <span>{t.manageQuorumEscrow}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            {t.caseSubtitle}
          </p>

          {/* 3 Status Indicator Chips */}
          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
              <span>{t.courtGagOrder}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
              <span className="material-symbols-outlined text-[15px] text-amber-600">key</span>
              <span>{t.twoOfTwoQuorum}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold">
              <span className="material-symbols-outlined text-[15px] text-rose-600">lock</span>
              <span>{t.hundredPercentBlinded}</span>
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Repository Table with Full Width & Room to Breathe */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6 w-[42%]">
                  {t.colEvidenceName}
                </th>
                <th className="py-3.5 px-4 w-[18%]">
                  {t.colClassification}
                </th>
                <th className="py-3.5 px-4 w-[16%]">
                  {t.colHash}
                </th>
                <th className="py-3.5 px-4 w-[12%]">
                  {t.colEnclaveStatus}
                </th>
                <th className="py-3.5 px-6 w-[12%] text-right">
                  {t.colAction}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDocs.map((doc) => {
                const badge = getClassificationBadge(doc.classification);
                const isAdmin = currentUser.role === 'IT_ADMIN';
                const isPrivileged = doc.classification === 'STRICT_PRIVILEGE';
                const quorumStatus = getQuorumStatusForDoc(doc.id);

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    
                    {/* Document Info with Wide Breathing Room */}
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${badge.iconBg}`}>
                          <span className="material-symbols-outlined text-[22px]">{badge.icon}</span>
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
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${badge.color}`}>
                        <span className="material-symbols-outlined text-[15px]">{badge.icon}</span>
                        <span>{badge.label}</span>
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
                      {doc.classification === 'DISCOVERY' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">public</span>
                          <span>{t.publicAccessGranted}</span>
                        </span>
                      )}

                      {doc.classification === 'RESTRICTED_EXPERT' && (
                        <span className={`text-xs flex items-center gap-1 ${quorumStatus?.color || 'text-amber-700 font-bold'}`}>
                          <span className="material-symbols-outlined text-[16px]">group_work</span>
                          <span>{quorumStatus?.text || t.awaitingQuorum}</span>
                        </span>
                      )}

                      {doc.classification === 'STRICT_PRIVILEGE' && (
                        <span className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
                          <span>{t.sovereignSeal}</span>
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {isAdmin ? (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isPrivileged || doc.classification === 'RESTRICTED_EXPERT'
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                              : 'bg-slate-800 hover:bg-slate-900 text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isPrivileged ? 'block' : 'visibility'}
                          </span>
                          <span>{isPrivileged ? t.btnAttemptDecryptSysadmin : t.btnInspectDiscovery}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm text-white ${
                            currentUser.role === 'FORENSIC_EXPERT' && doc.classification === 'RESTRICTED_EXPERT'
                              ? quorumStatus?.text?.includes('Satisfied') || quorumStatus?.text?.includes('2/2')
                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                              : doc.classification === 'DISCOVERY'
                              ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/20'
                              : 'bg-[#1E3A8A] hover:bg-[#172554] shadow-blue-900/20'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                          <span>
                            {currentUser.role === 'FORENSIC_EXPERT' && doc.classification === 'RESTRICTED_EXPERT'
                              ? quorumStatus?.text?.includes('Satisfied') || quorumStatus?.text?.includes('2/2')
                                ? t.btnDecryptQuorumVerified
                                : t.btnInspectQuorumRequired
                              : doc.classification === 'DISCOVERY'
                              ? t.btnViewDiscoveryOrder
                              : t.btnDecryptCounselPrivileged}
                          </span>
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footnote with Rich Colors */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
            <span className="font-semibold">{t.verifiedNodesFootnote}</span>
          </div>

          <div className="font-mono text-xs text-[#1E3A8A] font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200 self-start sm:self-auto">
            {t.rootKey}: 0x91F4A801...B62A
          </div>
        </div>

      </div>

    </div>
  );
};
