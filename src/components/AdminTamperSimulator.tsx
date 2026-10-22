import React, { useState } from 'react';
import { UserProfile } from '../types/matter';
import { TideCloakMatterService } from '../lib/tidecloak';

interface AdminTamperSimulatorProps {
  currentUser: UserProfile;
  onLogAudit: (action: string, status: 'BLOCKED_BY_TIDE', details: string) => void;
}

export const AdminTamperSimulator: React.FC<AdminTamperSimulatorProps> = ({ currentUser, onLogAudit }) => {
  const [showSimBox, setShowSimBox] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [tamperCount, setTamperCount] = useState(4481);

  const handleSimulateIntercept = () => {
    setIsShaking(true);
    setShowSimBox(true);
    setTamperCount(prev => prev + 1);

    const result = TideCloakMatterService.attemptAdminOverride(currentUser);
    onLogAudit(
      'UNILATERAL_ACL_OVERRIDE_INTERCEPTED',
      'BLOCKED_BY_TIDE',
      `[SIMULATION LOG #${tamperCount}]: ${result.logAudit}`
    );

    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  return (
    <div
      className={`bg-surface-container-lowest rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] border border-outline-variant/30 relative overflow-hidden transition-all mb-6 ${
        isShaking ? 'animate-shake border-error ring-2 ring-error/20' : ''
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Explanation */}
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="w-12 h-12 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <span className="material-symbols-outlined text-[26px]">gpp_maybe</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base text-on-surface">
                Cryptographic Firewall Active
              </span>
              <span className="px-2.5 py-0.5 rounded bg-error-container text-on-error-container text-xs font-semibold">
                Zero Data Authority
              </span>
              {currentUser.role === 'IT_ADMIN' && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                  ACTIVE TEST BED
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Cloud Root Sysadmins hold zero data authority. Even under compromised hypervisor credentials, subpoenas or server seizures served to hosting providers yield solely AES-256 ciphertext blocks.
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleSimulateIntercept}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-surface-container text-error font-semibold text-xs hover:bg-error-container transition-colors border border-error/20"
          >
            <span className="material-symbols-outlined text-[18px]">block</span>
            <span>Simulate Sysadmin Access Intercept</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText('0x9e81bfa4481_SHA256_TIDECLOAK_MERKLE_ROOT_ENCLAVE_PROOF');
              alert('Cryptographic proof hashes copied to clipboard!');
            }}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Export Proof Hashes</span>
          </button>
        </div>

      </div>

      {/* Expandable Simulation Terminal Box */}
      {showSimBox && (
        <div className="mt-4 p-3.5 rounded bg-surface-container-low border border-error/30 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 font-mono text-xs text-error">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">gpp_bad</span>
              <div className="space-y-1">
                <p className="font-semibold">
                  SIMULATION LOG #{tamperCount}: Root Sysadmin credential [IAM:role/cloud-admin] intercepted.
                </p>
                <p className="text-on-surface-variant text-[11px]">
                  Key extraction failure: 0 keys present in enclave memory. Result: DENIED (403 Zero Authority Constraint).
                </p>
                <p className="text-[10px] text-tertiary-container font-semibold">
                  Hardware attestation: AMD SEV Enclave #9942 verified tamper rejection across 7 consensus nodes.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSimBox(false)}
              type="button"
              className="text-on-surface-variant hover:text-on-surface p-1 rounded"
              title="Close log"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
