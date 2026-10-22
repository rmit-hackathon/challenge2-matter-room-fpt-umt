import { UserProfile, MatterDocument, QuorumRequest, AuditLogEntry } from '../types/matter';
import vaultPayloads from './vault_encrypted_payloads.json';

export const MOCK_USERS: Record<string, UserProfile> = {
  LEAD_COUNSEL: {
    id: 'usr_counsel_01',
    name: 'Luật sư: Elena Howard, Esq.',
    title: 'Đại diện Pháp lý & Ký duyệt Quorum',
    organization: 'Howard & Associates Civil Rights Law',
    role: 'LEAD_COUNSEL',
    avatar: '👩‍💼',
    hasDataAuthority: true,
    roleDescription: 'Luật sư đại diện của thân chủ; có thẩm quyền ký phê duyệt Quorum mở khóa tài liệu.'
  },
  SURVIVOR_CLIENT: {
    id: 'usr_client_01',
    name: 'Nạn nhân: Jane Doe (Protected)',
    title: 'Chủ thể Quyền lực Dữ liệu Tối cao',
    organization: 'Court-Protected Anonymous Litigant',
    role: 'SURVIVOR_CLIENT',
    avatar: '🛡️',
    hasDataAuthority: true,
    roleDescription: 'Nạn nhân được bảo vệ danh tính; nắm chủ quyền dữ liệu tối cao, có quyền cấp phép hoặc thu hồi truy cập.'
  },
  ADMIN: {
    id: 'usr_admin_01',
    name: 'Admin: Alex Mercer',
    title: 'Quản trị viên Hạ tầng (0% Data Authority)',
    organization: 'LegalCloud Hosting Provider',
    role: 'ADMIN',
    avatar: '⚙️',
    hasDataAuthority: false, // ZERO DATA AUTHORITY
    roleDescription: 'Quản trị viên máy chủ. Nắm quyền root hạ tầng nhưng hoàn toàn bị mù toán học trước dữ liệu nạn nhân.'
  },
  FORENSIC_EXPERT: {
    id: 'usr_expert_01',
    name: 'Bác sĩ pháp y: Dr. Miriam Vance, M.D.',
    title: 'Bác sĩ Giám định Y khoa Độc lập',
    organization: 'Institute for Forensic Medical Evidence',
    role: 'FORENSIC_EXPERT',
    avatar: '🩺',
    hasDataAuthority: false,
    roleDescription: 'Bác sĩ pháp y độc lập. Cần được Nạn nhân và Luật sư cùng phê duyệt Quorum 2/2 mới có thể giải mã hồ sơ y tế.'
  }
};

export const MOCK_DOCUMENTS: MatterDocument[] = [
  {
    id: 'doc_01',
    title: 'Court Scheduling Order #2026-CV-04421: Protective Order Granting Anonymous Pseudonym Filing',
    category: 'Court Orders',
    securityLevel: 'LEVEL_1_ROUTINE',
    size: '1.5 KB (PDF)',
    uploadedAt: '2026-10-15 08:30',
    summary: 'Lệnh niêm phong danh tính của Tòa án Liên bang, lịch trình tố tụng và phân công luật sư đại diện.',
    encryptedHash: '0x8f2a...9b11 (Public Discovery Grant)',
    isPdf: true,
    fileName: 'Court_Scheduling_Order_2026_CV_04421.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_01
  },
  {
    id: 'doc_02',
    title: 'Procedural Legal Correspondence & Redacted Evidence Index',
    category: 'Case Administration',
    securityLevel: 'LEVEL_2_SENSITIVE',
    size: '1.6 KB (PDF)',
    uploadedAt: '2026-10-17 14:10',
    summary: 'Biên bản làm việc nội bộ, tổng kết tiền lệ pháp lý và mục lục chứng cứ đã được che thông tin nhạy cảm.',
    encryptedHash: '0x5d10...7c22 (Role-Restricted Enclave)',
    isPdf: true,
    fileName: 'Privileged_Legal_Correspondence_Redacted_Index.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_02
  },
  {
    id: 'doc_03',
    title: 'Exhibit B: Confidential Forensic Medical Trauma Evaluation & Physical Examination',
    category: 'Medical Evidence',
    securityLevel: 'LEVEL_3_HIGHLY_SENSITIVE',
    size: '2.1 KB (PDF)',
    uploadedAt: '2026-10-18 11:20',
    summary: 'Báo cáo giám định y khoa thương tật cấp III, kết quả độc chất học và chẩn đoán sang chấn tâm lý PTSD.',
    encryptedHash: '0x3c7e...44d9 (Survivor Quorum Required)',
    isPdf: true,
    fileName: 'Exhibit_B_Forensic_Medical_Trauma_Evaluation.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_03,
    requiredQuorum: {
      rolesRequired: ['LEAD_COUNSEL', 'SURVIVOR_CLIENT'],
      description: 'Yêu cầu sự phê duyệt từ cả Thân chủ (Jane Doe) và Luật sư đại diện (Elena Howard).'
    }
  },
  {
    id: 'doc_04',
    title: 'STRICT PRIVILEGE: Survivor Incident Timeline, Audio Transcripts & Sealed Identity Escrow',
    category: 'Witness Protection',
    securityLevel: 'LEVEL_4_CRITICAL',
    size: '1.9 KB (PDF)',
    uploadedAt: '2026-10-21 19:15',
    summary: 'Bản tường trình chi tiết sự việc, bóc băng ghi âm quấy rối và tọa độ nơi cư trú an toàn của nạn nhân.',
    encryptedHash: '0xe19a...7c03 (Dual Air-Gapped Sovereign Escrow)',
    isPdf: true,
    fileName: 'STRICT_PRIVILEGE_Survivor_Timeline_Safehouse.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_04
  }
];

export const INITIAL_QUORUM_REQUESTS: QuorumRequest[] = [
  {
    id: 'qr_001',
    targetDocumentId: 'doc_03',
    targetDocumentTitle: 'Exhibit B: Confidential Forensic Medical Trauma Evaluation & Physical Examination',
    requestedBy: 'Jane Doe (Survivor)',
    requestedFor: 'Dr. Miriam Vance, M.D. (Forensic Medical Examiner)',
    requestedRole: 'FORENSIC_EXPERT',
    reason: 'Cấp quyền cho Bác sĩ pháp y độc lập xem hồ sơ giám định y khoa để nộp báo cáo chuyên môn cho Tòa án.',
    status: 'PENDING',
    approvals: [
      {
        signerId: 'usr_client_01',
        signerName: 'Jane Doe (Survivor)',
        signerRole: 'SURVIVOR_CLIENT',
        timestamp: '2026-10-22 10:15:32',
        signatureHash: '0x71a2...ce89'
      }
    ],
    threshold: 2
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-22 10:15:32',
    action: 'QUORUM_PROPOSED',
    actorName: 'Jane Doe',
    actorRole: 'SURVIVOR_CLIENT',
    status: 'QUORUM_TRIGGERED',
    details: 'Nạn nhân Jane Doe khởi tạo yêu cầu Quorum cấp quyền xem Exhibit B cho Bác sĩ Miriam Vance (Đã ký: 1/2).'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-22 10:45:10',
    action: 'ENCLAVE_POLICY_VERIFIED',
    actorName: 'Elena Howard, Esq.',
    actorRole: 'LEAD_COUNSEL',
    status: 'SUCCESS',
    details: 'Luật sư trưởng kiểm tra chính sách Forseti Enclave và trạng thái niêm phong dữ liệu.'
  }
];
