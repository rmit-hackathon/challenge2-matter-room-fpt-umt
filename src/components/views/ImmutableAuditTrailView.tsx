import React from 'react';
import { AuditLogEntry, MatterDocument } from '../../types/matter';
import { useLanguage } from '../../context/LanguageContext';

interface ImmutableAuditTrailViewProps {
  auditLogs: AuditLogEntry[];
  documents: MatterDocument[];
}

export const ImmutableAuditTrailView: React.FC<ImmutableAuditTrailViewProps> = ({
  auditLogs,
  documents,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">gavel</span>
          <span>Matter 24-CV-8821</span>
          <span className="text-slate-300">/</span>
          <span>{t.navImmutableAuditTrail}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E3A8A] font-extrabold tracking-tight">{t.merkleConsensusBreadcrumb}</span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>{t.blockValidatedBadge}</span>
        </div>
      </div>

      {/* Merkle Tree & Consensus Card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {/* Top Decorative Judicial Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-[#1E3A8A] to-amber-500" />

        <div className="p-7 sm:p-8 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                {t.merkleTreeHeadline}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {t.merkleTreeSubhead}
              </p>
            </div>

            <div className="font-mono text-xs text-[#1E3A8A] font-extrabold bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg shadow-2xs">
              {t.rootHashLabel}: 0x91F4A801...B62A
            </div>
          </div>

          {/* Tree Leaf Nodes with Distinct Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#1E3A8A]">{t.leafNodePrefix} #{idx + 1}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold">
                    Node #0{idx + 1} {t.nodeAttestedBadge}
                  </span>
                </div>
                <p className="font-extrabold text-xs text-slate-900 line-clamp-1">{doc.title}</p>
                <span className="font-mono text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 break-all font-medium">
                  {doc.encryptedHash}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chronological Event Ledger */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-7 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#1E3A8A]">receipt_long</span>
            <span>{t.ledgerEntriesHeadline}</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
            {t.rfc3161Badge}
          </span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-blue-50/40 hover:border-blue-200 transition-colors shadow-2xs"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0 ${
                    log.status === 'BLOCKED_BY_TIDE' ? 'bg-rose-500 ring-2 ring-rose-200' : 'bg-emerald-500 ring-2 ring-emerald-200'
                  }`}
                />
                <div>
                  <span className="font-extrabold text-slate-900 mr-2">[{log.action}]</span>
                  <span className="text-slate-600 font-sans font-medium">{log.details}</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 shrink-0 sm:ml-4 font-sans font-bold">
                {log.timestamp} • <strong className="text-slate-900">{log.actorName}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
