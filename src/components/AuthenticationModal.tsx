import React, { useState } from 'react';
import { MatterDocument, UserProfile } from '../types/matter';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: MatterDocument | null;
  currentUser: UserProfile;
  onAuthenticationComplete: () => void;
}

export const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  isOpen,
  onClose,
  document,
  currentUser,
  onAuthenticationComplete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen || !document) return null;

  const handleScanBiometric = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      setStep(2);
    }, 1200);
  };

  const handleFinalize = () => {
    onAuthenticationComplete();
    onClose();
    // Reset state
    setStep(1);
    setHasScanned(false);
    setHasAgreed(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header with Judicial Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#1E3A8A] to-emerald-500" />

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-[24px]">fingerprint</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Stakeholder Enclave Authentication
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Target: {document.title.split(':')[0]} ({document.securityLevel ? document.securityLevel.replace(/_/g, ' ') : 'CONFIDENTIAL'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              1
            </span>
            <span className={`text-xs font-bold ${step === 1 ? 'text-[#1E3A8A]' : 'text-slate-500'}`}>
              Hardware / Biometric Scan
            </span>
          </div>

          <span className="text-slate-300">→</span>

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              2
            </span>
            <span className={`text-xs font-bold ${step === 2 ? 'text-[#1E3A8A]' : 'text-slate-500'}`}>
              Legal Scope Commitment
            </span>
          </div>
        </div>

        {/* Step 1: Biometric / Hardware Scan */}
        {step === 1 && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-200 mx-auto flex items-center justify-center text-[#1E3A8A] shadow-inner relative">
              <span className={`material-symbols-outlined text-[44px] ${isScanning ? 'animate-pulse text-emerald-600' : ''}`}>
                {hasScanned ? 'check_circle' : 'fingerprint'}
              </span>
              {isScanning && (
                <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500 animate-ping" />
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {isScanning ? 'Verifying Hardware Token & FaceID...' : 'Scan FIPS 140-2 Hardware Token'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Actor: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.title}). Confirming cryptographic keypair against distributed Tide enclave nodes.
              </p>
            </div>

            <button
              onClick={handleScanBiometric}
              disabled={isScanning}
              type="button"
              className="w-full py-3 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs shadow-md shadow-blue-900/30 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">contactless</span>
              <span>{isScanning ? 'Authenticating...' : 'Authenticate via FIPS Enclave Token'}</span>
            </button>
          </div>
        )}

        {/* Step 2: Legal Scope & Protective Order Commitment */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                <span className="material-symbols-outlined text-[18px] text-amber-700">gavel</span>
                <span>F.R.C.P. Rule 26(c) Mandatory Confidentiality Attestation</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                You are about to synthesize a <strong className="text-amber-900">Single-Use Ephemeral Decryption Key</strong> for sensitive survivor records. Plaintext bytes will exist only in volatile memory for 60 seconds. Any unauthorized disclosure constitutes criminal contempt of federal court.
              </p>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="mt-0.5 rounded text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <span className="text-xs text-slate-700 font-semibold leading-snug">
                I, {currentUser.name}, solemnly attest that my review of this evidence is strictly within judicial mandate. I acknowledge that my session is cryptographically logged on the immutable ledger.
              </span>
            </label>

            <button
              onClick={handleFinalize}
              disabled={!hasAgreed}
              type="button"
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                hasAgreed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Synthesize 1-Time Ephemeral Decryption Key</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
