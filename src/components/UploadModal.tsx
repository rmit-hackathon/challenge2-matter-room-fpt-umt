import React, { useState, useRef } from 'react';
import { SecurityLevel, MatterDocument, DataClass, CrudPolicy } from '../types/matter';
import { RealCryptoEngine } from '../lib/cryptoEngine';
import { useLanguage } from '../context/LanguageContext';
import { buildClientPdf } from '../lib/pdfBuilder';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: MatterDocument) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const { lang } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Medical Evidence');
  const [dataClass, setDataClass] = useState<DataClass>('C2');
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSealing, setIsSealing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSealing(true);

    try {
      let rawPdfBytes: Uint8Array | ArrayBuffer;
      let finalFileName = selectedFile ? selectedFile.name : `${title.trim().replace(/\s+/g, '_')}.pdf`;
      let sizeStr = selectedFile 
        ? `${(selectedFile.size / 1024).toFixed(1)} KB (PDF)`
        : '2.4 KB (PDF)';

      const securityLevel: SecurityLevel = 
        dataClass === 'C0' ? 'LEVEL_1_ROUTINE' :
        dataClass === 'C1' ? 'LEVEL_2_SENSITIVE' : 'LEVEL_3_HIGHLY_SENSITIVE';

      if (selectedFile) {
        rawPdfBytes = await selectedFile.arrayBuffer();
      } else {
        rawPdfBytes = buildClientPdf(title.trim(), summary.trim() || 'Confidential disclosure sealed under Emergent Authority.', {
          securityLevel,
          author: 'Sovereign Litigant'
        });
        sizeStr = `${(rawPdfBytes.byteLength / 1024).toFixed(1)} KB (PDF)`;
      }

      const survivorSeed = RealCryptoEngine.getRoleSeed('SURVIVOR_CLIENT') || 'TIDE_EPHEMERAL_KEY_SLOT_SURVIVOR_SOVEREIGNTY_0x71a2';
      const payload = await RealCryptoEngine.encryptBinary(rawPdfBytes, survivorSeed, {
        isPdf: true,
        fileName: finalFileName,
        mimeType: 'application/pdf',
        classification: dataClass
      });

      const randomHash = `0x${payload.cipherHex.substring(0, 4)}...${payload.cipherHex.substring(payload.cipherHex.length - 4)}`;

      const crudPolicy: CrudPolicy = dataClass === 'C0' ? {
        canEdit: true,
        canDelete: true,
        canExport: true,
        approvalRequired: false,
        ruleExplanation: 'C0: Dữ liệu vận hành. Mọi người có quyền sửa, xóa, xuất.'
      } : dataClass === 'C1' ? {
        canEdit: false,
        canDelete: false,
        canExport: true,
        exportRestrictedToRole: 'LEAD_COUNSEL',
        approvalRequired: false,
        ruleExplanation: 'C1: Hồ sơ mật nhóm thụ lý. Cấm sửa, cấm xóa; chỉ duy nhất Luật sư phụ trách có quyền xuất.'
      } : {
        canEdit: false,
        canDelete: false,
        canExport: false,
        approvalRequired: true,
        ruleExplanation: 'C2: Bằng chứng nhạy cảm & niêm phong. Cấm sửa, cấm xóa, cấm xuất; bắt buộc Quorum Tất cả bên giữ khóa.'
      };

      const newDoc: MatterDocument = {
        id: `doc_${Date.now()}`,
        title: title.trim(),
        category,
        dataClass,
        securityLevel,
        size: sizeStr,
        uploadedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
        encryptedHash: `${randomHash} (${lang === 'vi' ? 'Đã niêm phong PDF' : 'PDF Enclave Sealed'})`,
        isPdf: true,
        fileName: finalFileName,
        mimeType: 'application/pdf',
        encryptedPayload: payload,
        summary: summary.trim() || (lang === 'vi' ? 'Hồ sơ PDF nhị phân được tải lên và mã hóa WebCrypto.' : 'Authentic PDF binary encrypted client-side via WebCrypto AES-GCM.'),
        crudPolicy
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
        
        {/* Header with Solid Legal Navy Stripe */}
        <div className="h-1 w-full bg-[#1E3A8A]" />

        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-semibold shadow-2xs">
              <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                {lang === 'vi' ? 'Tải Lên & Mã Hóa Tài Liệu' : 'Upload & Seal Evidence'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {lang === 'vi' 
                  ? 'Mã hóa trực tiếp trên trình duyệt trước khi lưu lên máy chủ' 
                  : 'Client-side encrypted via TideCloak before hitting cloud storage'}
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
          
          {/* File Upload Dropzone */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>{lang === 'vi' ? 'Tệp PDF chứng cứ (Tùy chọn):' : 'Evidence PDF File (Optional):'}</span>
              <span className="text-[11px] font-normal text-slate-400">
                {lang === 'vi' ? 'Hỗ trợ .pdf (Mã hóa nhị phân)' : 'Supports .pdf (Binary AES-GCM)'}
              </span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 border-2 border-dashed rounded-xl cursor-pointer transition text-center flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#1E3A8A] bg-blue-50/60'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-[#1E3A8A] bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {selectedFile ? (
                <div className="flex items-center gap-3 w-full justify-between px-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    </div>
                    <div className="text-left truncate">
                      <p className="font-bold text-slate-800 text-xs truncate max-w-xs">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB • Raw PDF</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove file"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">upload_file</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-xs">
                      {lang === 'vi' ? 'Kéo thả file PDF vào đây hoặc bấm để chọn' : 'Drag & drop a PDF file here, or click to browse'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'vi' ? 'Mã hóa nhị phân bằng WebCrypto AES-GCM' : 'Binary encrypted via WebCrypto AES-GCM in RAM'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {lang === 'vi' ? 'Tên tài liệu / chứng cứ:' : 'Evidence Document Title:'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'vi' ? 'Ví dụ: Exhibit C: Bản ghi chép nhật ký và tin nhắn' : 'e.g. Exhibit C: Audio Transcript & Intimate Diary'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'vi' ? 'Danh mục:' : 'Category:'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
              >
                <option value="Medical Evidence">{lang === 'vi' ? 'Chứng cứ y tế / thương tích' : 'Medical Trauma Evidence'}</option>
                <option value="Privileged Testimony">{lang === 'vi' ? 'Lời khai nhân chứng' : 'Privileged Testimony'}</option>
                <option value="Witness Protection">{lang === 'vi' ? 'Hồ sơ bảo vệ nhân chứng' : 'Witness Protection'}</option>
                <option value="Case Administration">{lang === 'vi' ? 'Tài liệu hành chính vụ án' : 'Case Administration'}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'vi' ? 'Phân loại Dữ liệu (Brainstorm 2.0):' : 'Data Classification:'}
              </label>
              <select
                value={dataClass}
                onChange={(e) => setDataClass(e.target.value as DataClass)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm font-semibold"
              >
                <option value="C0">{lang === 'vi' ? 'C0 — Vận hành công khai (Mở Sửa/Xóa/Xuất)' : 'C0 — Operational (Full Open CRUD)'}</option>
                <option value="C1">{lang === 'vi' ? 'C1 — Hồ sơ mật nhóm luật sư (Chỉ Luật sư xuất)' : 'C1 — Confidential (Counsel Export Only)'}</option>
                <option value="C2">{lang === 'vi' ? 'C2 — Chứng cứ niêm phong (Quorum All-Keyholders)' : 'C2 — Sensitive / Sealed (All Keyholders)'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {lang === 'vi' ? 'Mô tả ngắn gọn:' : 'Summary:'}
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={lang === 'vi' ? 'Mô tả tóm tắt nội dung tài liệu...' : 'Describe the nature of this disclosure...'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[16px] text-blue-700">lock</span>
              <span>{lang === 'vi' ? 'Mã hóa đầu-cuối trên trình duyệt' : 'Client-Side Encryption'}</span>
            </div>
            <p className="text-slate-600">
              {lang === 'vi'
                ? 'Tài liệu được mã hóa ngay trên thiết bị của bạn trước khi truyền tải. Máy chủ và Quản trị viên chỉ nhận được các khối dữ liệu mã hóa vô nghĩa.'
                : 'Files are encrypted in your local browser sandbox before transmission. The hosting provider and admin receive solely unreadable AES-256 blocks.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
            >
              {lang === 'vi' ? 'Hủy bỏ' : 'Cancel'}
            </button>

            <button
              disabled={isSealing}
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold shadow-md shadow-blue-900/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{isSealing ? (lang === 'vi' ? 'Đang mã hóa...' : 'Encrypting...') : (lang === 'vi' ? 'Mã hóa & Lưu an toàn' : 'Encrypt & Seal')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
