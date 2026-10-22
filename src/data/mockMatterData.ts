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
    roleDescription: 'Luật sư đại diện của thân chủ; giữ mảnh khóa pháp lý trong Quorum All-Keyholders mở tài liệu C2.'
  },
  SURVIVOR_CLIENT: {
    id: 'usr_client_01',
    name: 'Nạn nhân: Jane Doe (Protected)',
    title: 'Chủ thể Quyền lực Dữ liệu Tối cao',
    organization: 'Court-Protected Anonymous Litigant',
    role: 'SURVIVOR_CLIENT',
    avatar: '🛡️',
    hasDataAuthority: true,
    roleDescription: 'Nạn nhân được bảo vệ danh tính; giữ mảnh khóa chủ quyền tối cao, có quyền cấp phép hoặc thu hồi truy cập.'
  },
  GUARDIAN: {
    id: 'usr_guardian_01',
    name: 'Người giám hộ: Sarah Jenkins',
    title: 'Đại diện Hợp pháp của Nạn nhân',
    organization: 'Court-Appointed Legal Guardianship Office',
    role: 'GUARDIAN',
    avatar: '🤝',
    hasDataAuthority: true,
    roleDescription: 'Người giám hộ bảo trợ hợp pháp; giữ mảnh khóa bảo hộ thứ ba trong Quorum All-Keyholders mở dữ liệu C2.'
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
    roleDescription: 'Bác sĩ pháp y độc lập. Cần được Nạn nhân, Luật sư và Người giám hộ cùng phê duyệt Quorum All-Keyholders mới có thể giải mã hồ sơ y tế.'
  }
};

export const MOCK_DOCUMENTS: MatterDocument[] = [
  // ==========================================
  // C0: OPERATIONAL — Mọi người Sửa/Xóa/Xuất, không cần duyệt
  // ==========================================
  {
    id: 'doc_01',
    title: 'Court Scheduling Order #2026-CV-04421: Protective Order Granting Anonymous Pseudonym Filing',
    category: 'Court Orders',
    dataClass: 'C0',
    securityLevel: 'LEVEL_1_ROUTINE',
    size: '1.5 KB (PDF)',
    uploadedAt: '2026-10-15 08:30',
    summary: 'Lệnh niêm phong danh tính của Tòa án Liên bang, lịch trình tố tụng và phân công luật sư đại diện.',
    encryptedHash: '0x8f2a...9b11 (Public Discovery Grant)',
    isPdf: true,
    fileName: 'Court_Scheduling_Order_2026_CV_04421.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_01,
    crudPolicy: {
      canEdit: true,
      canDelete: true,
      canExport: true,
      approvalRequired: false,
      ruleExplanation: 'C0: Dữ liệu vận hành tố tụng thông thường. Mọi người dùng nội bộ đều có quyền sửa, xóa, xuất file mà không cần phê duyệt.'
    }
  },
  {
    id: 'doc_05',
    title: 'Filed Court Documents: Notice of Appearance & Verified Retainer Statement',
    category: 'Court Orders',
    dataClass: 'C0',
    securityLevel: 'LEVEL_1_ROUTINE',
    size: '2.4 MB',
    uploadedAt: '2026-10-16 11:00',
    summary: 'Giấy báo xuất hiện trước tòa và xác nhận thẩm quyền đại diện pháp lý đã công khai tại tòa án.',
    encryptedHash: '0x1a8f...3c99 (Public Discovery)',
    decryptedContent: 'UNITED STATES DISTRICT COURT — SOUTHERN DISTRICT OF NEW YORK\nDocket Notice: Verified notice of legal appearance for Plaintiff Jane Doe by Howard & Associates Civil Rights Law firm.',
    crudPolicy: {
      canEdit: true,
      canDelete: true,
      canExport: true,
      approvalRequired: false,
      ruleExplanation: 'C0: Văn bản tài liệu chính thức đã nộp tòa. Tự do xuất file và quản lý hành chính.'
    }
  },

  // ==========================================
  // C1: CONFIDENTIAL — Cấm sửa, Cấm xóa, Chỉ Luật sư được Xuất file
  // ==========================================
  {
    id: 'doc_02',
    title: 'Procedural Legal Correspondence & Redacted Evidence Index',
    category: 'Case Administration',
    dataClass: 'C1',
    securityLevel: 'LEVEL_2_SENSITIVE',
    size: '1.6 KB (PDF)',
    uploadedAt: '2026-10-17 14:10',
    summary: 'Biên bản làm việc nội bộ, tổng kết tiền lệ pháp lý và mục lục chứng cứ đã được che thông tin nhạy cảm.',
    encryptedHash: '0x5d10...7c22 (Role-Restricted Enclave)',
    isPdf: true,
    fileName: 'Privileged_Legal_Correspondence_Redacted_Index.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_02,
    crudPolicy: {
      canEdit: false,
      canDelete: false,
      canExport: true,
      exportRestrictedToRole: 'LEAD_COUNSEL',
      approvalRequired: false,
      ruleExplanation: 'C1: Hồ sơ mật nhóm thụ lý vụ án. Quy tắc: Cấm chỉnh sửa, cấm xóa. Chỉ duy nhất Luật sư phụ trách có thẩm quyền xuất file.'
    }
  },
  {
    id: 'doc_06',
    title: 'Chain-of-Custody Cryptographic Ledger & Evidence Timestamp Manifest',
    category: 'Case Administration',
    dataClass: 'C1',
    securityLevel: 'LEVEL_2_SENSITIVE',
    size: '3.1 MB',
    uploadedAt: '2026-10-17 16:45',
    summary: 'Sổ cái hành trình lưu vết chứng cứ, mã băm SHA-256 và mốc thời gian tiếp nhận vật chứng.',
    encryptedHash: '0x4e2d...8b10 (Ledger Sealed)',
    decryptedContent: 'EVIDENCE CHAIN-OF-CUSTODY AUDIT LOG:\nItem 01 (Audio): Received 2026-08-15 | Custodian: Elena Howard, Esq.\nItem 02 (Toxicology): Received 2026-08-18 | Custodian: Dr. Miriam Vance, M.D.',
    crudPolicy: {
      canEdit: false,
      canDelete: false,
      canExport: true,
      exportRestrictedToRole: 'LEAD_COUNSEL',
      approvalRequired: false,
      ruleExplanation: 'C1: Chuỗi lưu vết chứng cứ tố tụng. Bảo đảm tính nguyên vẹn: Cấm chỉnh sửa/xóa; chỉ Luật sư có quyền xuất.'
    }
  },

  // ==========================================
  // C2: SENSITIVE / SEALED — Cấm sửa, Cấm xóa, Cấm xuất; Quorum ALL KEYHOLDERS
  // ==========================================
  {
    id: 'doc_03',
    title: 'Exhibit B: Confidential Forensic Medical Trauma Evaluation & Physical Examination',
    category: 'Medical Evidence',
    dataClass: 'C2',
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
      rolesRequired: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      description: 'Yêu cầu sự phê duyệt đồng thuận từ TẤT CẢ các bên giữ khóa (Thân chủ, Luật sư, Người giám hộ).'
    },
    crudPolicy: {
      canEdit: false,
      canDelete: false,
      canExport: false,
      approvalRequired: true,
      ruleExplanation: 'C2: Bằng chứng y tế giám định đặc biệt nhạy cảm. Cấm sửa, cấm xóa, cấm xuất ra ngoài; bắt buộc Quorum ALL KEYHOLDERS đồng thuận.'
    }
  },
  {
    id: 'doc_04',
    title: 'STRICT PRIVILEGE: Survivor Incident Timeline, Audio Transcripts & Sealed Identity Escrow',
    category: 'Witness Protection',
    dataClass: 'C2',
    securityLevel: 'LEVEL_4_CRITICAL',
    size: '1.9 KB (PDF)',
    uploadedAt: '2026-10-21 19:15',
    summary: 'Bản tường trình chi tiết sự việc, bóc băng ghi âm quấy rối và tọa độ nơi cư trú an toàn của nạn nhân.',
    encryptedHash: '0xe19a...7c03 (Dual Air-Gapped Sovereign Escrow)',
    isPdf: true,
    fileName: 'STRICT_PRIVILEGE_Survivor_Timeline_Safehouse.pdf',
    mimeType: 'application/pdf',
    encryptedPayload: vaultPayloads.doc_04,
    requiredQuorum: {
      rolesRequired: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      description: 'Niêm phong tối mật thông tin nhân thân và tọa độ nhà an toàn của nạn nhân.'
    },
    crudPolicy: {
      canEdit: false,
      canDelete: false,
      canExport: false,
      approvalRequired: true,
      ruleExplanation: 'C2: Niêm phong tối mật an toàn sinh mạng. Tuyệt đối cấm sửa, cấm xóa, cấm xuất file.'
    }
  },
  {
    id: 'doc_07',
    title: 'Confidential Psychotherapy Notes & DSM-5 PTSD Clinical Trauma Evaluation',
    category: 'Medical Evidence',
    dataClass: 'C2',
    securityLevel: 'LEVEL_3_HIGHLY_SENSITIVE',
    size: '18.2 MB',
    uploadedAt: '2026-10-19 09:30',
    summary: 'Ghi chép trị liệu tâm lý chuyên sâu, đánh giá nguy cơ tự hại và phác đồ can thiệp khủng hoảng sau sự vụ.',
    encryptedHash: '0x7b2f...1a44 (Psych-Immunity Lock)',
    decryptedContent: 'CLINICAL PSYCHOTHERAPY NOTES — STRICT PRIVILEGE:\n- Patient: Jane Doe | Assessment: Acute Post-Traumatic Stress Disorder with persistent intrusive flashbacks.\n- Therapy sessions log: 12 clinical encounters documented.\n- High sensitivity: Disclosure causes severe emotional and mental health trauma.',
    requiredQuorum: {
      rolesRequired: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      description: 'Hồ sơ tâm lý cực kỳ nhạy cảm, cần sự đồng thuận của cả 3 bên giữ khóa.'
    },
    crudPolicy: {
      canEdit: false,
      canDelete: false,
      canExport: false,
      approvalRequired: true,
      ruleExplanation: 'C2: Ghi chép trị liệu tâm lý. Cấm sửa, cấm xóa, cấm xuất; bảo vệ quyền riêng tư tuyệt đối.'
    }
  },
  {
    id: 'doc_08',
    title: 'STRICT PRIVILEGE: Safehouse Relocation Coordinates & Threat Messages Evidence',
    category: 'Witness Protection',
    dataClass: 'C2',
    securityLevel: 'LEVEL_4_CRITICAL',
    size: '12.4 MB',
    uploadedAt: '2026-10-21 21:00',
    summary: 'Bằng chứng tin nhắn đe dọa trả thù từ bị đơn, kế hoạch di tản khẩn cấp và vị trí trú ẩn bí mật.',
    encryptedHash: '0x9c41...6d22 (Safehouse Sealed)',
    decryptedContent: 'WITNESS PROTECTION ACTION PLAN:\n- Threat Record #104: Text messages containing explicit threats of retaliation sent from prepaid burner device.\n- Emergency Safehouse GPS Coordinates: [PROTECTED UNDER MARSHALL WITNESS ESCROW].',
    requiredQuorum: {
      rolesRequired: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      description: 'Kế hoạch an toàn sinh mạng khẩn cấp.'
    },
    crudPolicy: {
      canEdit: false,
      canDelete: false,
      canExport: false,
      approvalRequired: true,
      ruleExplanation: 'C2: Tọa độ nơi ở an toàn & chứng cứ rình rập. Cấm sửa, cấm xóa, cấm xuất file.'
    }
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
        signatureHash: '0x71a2ce89'
      }
    ],
    threshold: 3,
    requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
    isGuardianConflicted: false
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
    details: 'Nạn nhân Jane Doe khởi tạo yêu cầu Quorum All-Keyholders cấp quyền xem Exhibit B cho Bác sĩ Miriam Vance (Đã ký: 1/3).'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-22 10:45:10',
    action: 'ENCLAVE_POLICY_VERIFIED',
    actorName: 'Elena Howard, Esq.',
    actorRole: 'LEAD_COUNSEL',
    status: 'SUCCESS',
    details: 'Luật sư trưởng kiểm tra chính sách Forseti Enclave C0-C1-C2 và trạng thái niêm phong dữ liệu.'
  }
];
