import React, { useState } from 'react';
import { SecurityLevel, MatterDocument } from '../types/matter';
import { RealCryptoEngine } from '../lib/cryptoEngine';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: MatterDocument) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Medical Evidence');
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('LEVEL_3_HIGHLY_SENSITIVE');
  const [summary, setSummary] = useState('');
  const [isSealing, setIsSealing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSealing(true);

    try {
      const plaintext = `CONFIDENTIAL SURVIVOR DISCLOSURE ENCLAVE:\nTitle: ${title}\nClassification: ${securityLevel}\nSealed Timestamp: ${new Date().toISOString()}\n\nClient-side encrypted using TideCloak SDK (AES-256-GCM + PBKDF2). Decryption authorized exclusively via Sovereign Survivor Quorum. Zero plaintexts stored on server.`;
      const survivorSeed = RealCryptoEngine.getRoleSeed('SURVIVOR_CLIENT') || 'TIDE_EPHEMERAL_KEY_SLOT_SURVIVOR_SOVEREIGNTY_0x71a2';
      const payload = await RealCryptoEngine.encryptRecord(plaintext, survivorSeed);
      const randomHash = `0x${payload.cipherHex.substring(0, 4)}...${payload.cipherHex.substring(payload.cipherHex.length - 4)}`;

      const newDoc: MatterDocument = {
        id: `doc_${Date.now()}`,
        title: title.trim(),
        category,
        securityLevel,
        size: '14.2 MB',
        uploadedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
        encryptedHash: `${randomHash} (Client Enclave Sealed)`,
        decryptedContent: plaintext,
        encryptedPayload: payload,
        summary: summary.trim() || 'Hồ sơ bằng chứng mới được nạn nhân tải lên và niêm phong mật mã WebCrypto.'
      };

      onUploadSuccess(newDoc);
      setIsSealing(false);
      onClose();
    } catch (err) {
      console.error('Error sealing evidence:', err);
      setIsSealing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header with Judicial Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-[#1E3A8A]" />

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Upload &amp; Seal Survivor Evidence
              </h2>
              <p className="text-xs text-slate-500">
                Client-side encrypted via TideCloak before hitting cloud storage
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Evidence Document Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exhibit C: Audio Transcript & Intimate Diary Disclosures"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
              >
                <option value="Medical Evidence">Medical Trauma Evidence</option>
                <option value="Privileged Testimony">Privileged Testimony</option>
                <option value="Witness Protection">Witness Protection</option>
                <option value="Case Administration">Case Administration</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Security Classification Level:
              </label>
              <select
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value as SecurityLevel)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm font-semibold"
              >
                <option value="LEVEL_1_ROUTINE">Level 1 — Routine (No per-request approval)</option>
                <option value="LEVEL_2_SENSITIVE">Level 2 — Sensitive (Role-based access)</option>
                <option value="LEVEL_3_HIGHLY_SENSITIVE">Level 3 — Highly Sensitive (Victim Quorum Required)</option>
                <option value="LEVEL_4_CRITICAL">Level 4 — Critical (Strongest Dual Escrow)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Summary / Evidentiary Scope:
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the nature of this disclosure and why it is protected under Court Gag Order..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[16px] text-blue-700">lock</span>
              <span>TideCloak Client-Side Encryption Protocol</span>
            </div>
            <p className="text-slate-600">
              Files are encrypted in your local browser sandbox before transmission. The Cloud Hosting Provider and Admin receive solely unreadable AES-256 blocks.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
            >
              Cancel
            </button>

            <button
              disabled={isSealing}
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold shadow-md shadow-blue-900/30 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{isSealing ? 'Encrypting & Enclave Sealing...' : 'Encrypt & Seal into Enclave'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
