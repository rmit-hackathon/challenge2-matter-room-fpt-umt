import React from 'react';
import { MatterDocument } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface MerkleTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: MatterDocument[];
}

export const MerkleTreeModal: React.FC<MerkleTreeModalProps> = ({ isOpen, onClose, documents }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">account_tree</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">
                {t.merkleModalTitle}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                {t.rootKey}: 0x91F4A801...B62AE49D ({t.epoch} 04)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
          
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-tertiary-container font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span>{t.merkleAllVerified}</span>
          </div>

          <div className="space-y-2 font-mono">
            <p className="font-bold text-on-surface uppercase text-[11px] tracking-wider font-sans">
              {t.enclaveTreeHierarchy}
            </p>

            {/* Root Node */}
            <div className="p-3 rounded bg-surface-container-high border border-outline-variant/30 text-primary font-bold">
              {t.enclaveConsensusRoot}
            </div>

            {/* Tree Branch */}
            <div className="pl-4 border-l-2 border-primary/20 space-y-2 pt-1">
              {documents.map((doc, idx) => (
                <div key={doc.id} className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-primary font-bold">{t.leafNodePrefix} #{idx + 1}: </span>
                    <span className="text-on-surface font-sans font-medium">{doc.title.split(':')[0]}</span>
                    <div className="text-[11px] text-on-surface-variant">{doc.encryptedHash}</div>
                  </div>
                  <span className="text-tertiary-container font-semibold self-start sm:self-auto text-[11px] bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/20">
                    Enclave Node #0{idx + 1} {t.attestedBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant leading-relaxed">
            <p className="font-bold text-on-surface mb-1">{t.decentralizedTrustTitle}</p>
            {t.decentralizedTrustBody}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded bg-primary text-on-primary font-semibold text-xs hover:bg-primary-container transition shadow-sm"
          >
            {t.btnCloseInspector}
          </button>
        </div>

      </div>
    </div>
  );
};
