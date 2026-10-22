import React, { useState } from 'react';
import { MatterDocument, UserProfile, ClassificationLevel, QuorumRequest } from '../types/matter';

interface DocumentListProps {
  documents: MatterDocument[];
  currentUser: UserProfile;
  quorumRequests: QuorumRequest[];
  onOpenDocument: (doc: MatterDocument) => void;
  onOpenMerkleModal: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  currentUser,
  quorumRequests,
  onOpenDocument,
  onOpenMerkleModal
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getClassificationBadge = (level: ClassificationLevel) => {
    switch (level) {
      case 'DISCOVERY':
        return {
          label: 'Public Discovery',
          color: 'bg-tertiary-fixed/30 text-tertiary-container border-tertiary/20',
          icon: 'description',
          iconBg: 'bg-tertiary-fixed text-tertiary-container'
        };
      case 'RESTRICTED_EXPERT':
        return {
          label: 'Restricted (Quorum 2/2)',
          color: 'bg-secondary-fixed/40 text-secondary border-secondary/30',
          icon: 'medical_services',
          iconBg: 'bg-secondary-fixed text-secondary'
        };
      case 'STRICT_PRIVILEGE':
        return {
          label: 'Strict Privilege',
          color: 'bg-error-container text-on-error-container border-error/20',
          icon: 'shield_lock',
          iconBg: 'bg-error-container text-error'
        };
    }
  };

  const getQuorumStatusForDoc = (docId: string) => {
    const matchingReq = quorumRequests.find(q => q.targetDocumentId === docId);
    if (!matchingReq) return null;
    return matchingReq.status === 'APPROVED'
      ? { text: '2/2 Quorum Satisfied', color: 'text-tertiary-container font-semibold' }
      : { text: `Awaiting Quorum (${matchingReq.approvals.length}/${matchingReq.threshold})`, color: 'text-secondary font-semibold' };
  };

  return (
    <div className="space-y-4 mb-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight flex items-center gap-2">
            <span>Protected Evidence &amp; Case Files</span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-3xl">
            Cryptographically sealed and air-gapped from cloud hypervisors. Decryption policies enforced via decentralized hardware enclaves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold text-xs border border-primary-container/10">
            {documents.length} Evidence Payloads Enclave-Sealed
          </span>
        </div>
      </div>

      {/* Evidence Table Card Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/30">
              <tr>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-on-surface-variant">
                  EVIDENCE / DOCUMENT NAME
                </th>
                <th className="py-3 px-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                  CLASSIFICATION
                </th>
                <th className="py-3 px-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                  CRYPTOGRAPHIC HASH
                </th>
                <th className="py-3 px-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                  ENCLAVE STATUS
                </th>
                <th className="py-3 px-4 text-right font-semibold text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/20">
              {documents.map((doc) => {
                const badge = getClassificationBadge(doc.classification);
                const isAdmin = currentUser.role === 'IT_ADMIN';
                const isPrivileged = doc.classification === 'STRICT_PRIVILEGE';
                const quorumStatus = getQuorumStatusForDoc(doc.id);

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-surface-container-low/50 transition-colors group"
                  >
                    {/* Evidence Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 mt-0.5 ${badge.iconBg}`}>
                          <span className="material-symbols-outlined text-[20px]">{badge.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant flex-wrap">
                            <span>{doc.category}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span className="italic">{doc.summary}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border ${badge.color}`}>
                        <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Cryptographic Hash */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs px-2 py-1 rounded bg-surface-container text-on-surface-variant border border-outline-variant/20">
                          {doc.encryptedHash.split(' ')[0]}
                        </span>
                        <button
                          onClick={(e) => handleCopyHash(doc.encryptedHash, e)}
                          type="button"
                          className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          title="Copy full cryptographic hash"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copiedHash === doc.encryptedHash ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Enclave Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      {doc.classification === 'DISCOVERY' && (
                        <span className="text-xs font-semibold text-tertiary-container flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">public</span>
                          <span>Public Access Granted</span>
                        </span>
                      )}

                      {doc.classification === 'RESTRICTED_EXPERT' && (
                        <span className={`text-xs flex items-center gap-1 ${quorumStatus?.color || 'text-secondary'}`}>
                          <span className="material-symbols-outlined text-[14px]">group_work</span>
                          <span>{quorumStatus?.text || 'Awaiting Quorum'}</span>
                        </span>
                      )}

                      {doc.classification === 'STRICT_PRIVILEGE' && (
                        <span className="text-xs font-semibold text-tertiary-container flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          <span>2/2 Sovereign Seal</span>
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {isAdmin ? (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors ${
                            isPrivileged || doc.classification === 'RESTRICTED_EXPERT'
                              ? 'bg-error text-on-error hover:bg-error/90'
                              : 'bg-surface-container text-primary hover:bg-surface-container-high'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isPrivileged ? 'block' : 'visibility'}
                          </span>
                          <span>{isPrivileged ? 'Attempt Decrypt (Sysadmin)' : 'Inspect Discovery'}</span>
                        </button>
                      ) : currentUser.role === 'OPPOSING_COUNSEL' && doc.classification !== 'DISCOVERY' ? (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">lock</span>
                          <span>Access Restricted</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenDocument(doc)}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                          <span>
                            {currentUser.role === 'FORENSIC_EXPERT' && doc.classification === 'RESTRICTED_EXPERT'
                              ? quorumStatus?.text?.includes('Satisfied')
                                ? 'Decrypt (Quorum Verified)'
                                : 'Inspect Quorum Required'
                              : doc.classification === 'DISCOVERY'
                              ? 'View Discovery Order'
                              : 'Decrypt (Counsel Privileged)'}
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

        {/* Table Footnote & Cryptographic Integrity Check */}
        <div className="p-4 bg-surface-container-low/50 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between text-on-surface-variant text-xs gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary-container">
              verified
            </span>
            <span>All 4 payloads continuously verified across 7 distributed hardware nodes. Zero state anomalies detected.</span>
          </div>

          <button
            onClick={onOpenMerkleModal}
            type="button"
            className="text-primary hover:underline font-semibold inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Merkle Tree Inspector</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

      </div>

    </div>
  );
};
