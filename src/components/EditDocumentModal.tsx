import React, { useState, useEffect } from 'react';
import { MatterDocument } from '../types/matter';
import { useLanguage } from '../context/LanguageContext';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: MatterDocument | null;
  onSave: (updatedDoc: MatterDocument) => void;
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  onSave,
}) => {
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setCategory(document.category || 'Case Administration');
      setSummary(document.summary || '');
      setContent(document.decryptedContent || '');
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const isC0 = document.dataClass === 'C0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isC0) return;

    const updatedDoc: MatterDocument = {
      ...document,
      title: title.trim(),
      category: category.trim(),
      summary: summary.trim(),
      decryptedContent: content.trim(),
    };

    onSave(updatedDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header Stripe */}
        <div className={`h-1.5 w-full ${isC0 ? 'bg-[#0F766E]' : 'bg-[#991B1B]'}`} />

        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold shadow-2xs ${
              isC0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {isC0 ? 'edit_note' : 'edit_off'}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
                {isC0
                  ? (lang === 'vi' ? 'Chỉnh sửa tài liệu vận hành (C0)' : 'Edit C0 Operational Document')
                  : (lang === 'vi' ? 'CẤM CHỈNH SỬA CHỨNG CỨ NIÊM PHONG' : 'SEALED EVIDENCE — EDIT PROHIBITED')}
              </h2>
              <p className="text-xs text-[#64748B]">
                {isC0
                  ? (lang === 'vi' ? 'Dữ liệu C0 cho phép mọi người chỉnh sửa thông tin hành chính' : 'C0 data is freely editable by all case participants')
                  : (lang === 'vi' ? `Quy tắc ${document.dataClass}: Hồ sơ bảo toàn tố tụng` : `Rule ${document.dataClass}: Integrity Preservation Locked`)}
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

        {/* Modal Body */}
        {isC0 ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'vi' ? 'Tiêu đề tài liệu:' : 'Document Title:'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'vi' ? 'Danh mục:' : 'Category:'}
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'vi' ? 'Tóm tắt nội dung:' : 'Summary:'}
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E] text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'vi' ? 'Nội dung văn bản quy trình:' : 'Procedural Content / Notes:'}
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F766E] text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
              >
                {lang === 'vi' ? 'Hủy bỏ' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>{lang === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
                <span>{lang === 'vi' ? 'Cấm Sửa Đổi Chứng Cứ Tố Tụng' : 'Litigation Evidence Integrity Lock'}</span>
              </div>
              <p className="leading-relaxed">
                {lang === 'vi'
                  ? `Tài liệu '${document.title}' được phân loại cấp độ ${document.dataClass}. Theo quy định bảo toàn chứng cứ (Federal Rules of Evidence 901/902) và Hợp đồng Thông minh TideCloak Forseti, hồ sơ đã được niêm phong vĩnh viễn với mã băm SHA-256:`
                  : `Document '${document.title}' is classified as ${document.dataClass}. Under Federal Rules of Evidence and TideCloak Forseti contracts, this evidence is sealed with cryptographic hash:`}
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-rose-200 font-mono text-xs text-rose-700 break-all">
                {document.encryptedHash}
              </div>
              <p className="text-[11px] text-rose-700 italic">
                {lang === 'vi'
                  ? 'Bất kỳ hành vi sửa đổi nào sẽ làm sai lệch mã băm và bị xử lý hình sự theo Điều 1512 USC về tội tiêu hủy hoặc làm sai lệch tài liệu tố tụng.'
                  : 'Any modification violates mathematical hash attestation and constitutes evidence tampering under 18 U.S.C. § 1512.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
              >
                {lang === 'vi' ? 'Đã hiểu & Đóng' : 'Understood & Close'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
