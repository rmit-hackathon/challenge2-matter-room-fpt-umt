import { UserProfile, MatterDocument, QuorumRequest, AuditLogEntry } from '../types/matter';
import vaultPayloads from './vault_encrypted_payloads.json';

export const MOCK_USERS: Record<string, UserProfile> = {
  LEAD_COUNSEL: {
    id: 'usr_counsel_01',
    name: 'Luật sư: Elena Howard, Esq.',
    title: 'Đại diện Pháp lý & Ký duyệt Quorum',
    organization: 'Howard & Associates Civil Rights Law Firm',
    role: 'LEAD_COUNSEL',
    avatar: '👩‍💼',
    hasDataAuthority: true,
    roleDescription: 'Luật sư đại diện của thân chủ; giữ mảnh khóa pháp lý trong Quorum All-Keyholders mở tài liệu C2.',
    legalCredential: 'Chứng chỉ Luật sư New York Bar #5298144 (Cấp phép 2014)',
    jurisdiction: 'Tòa án Liên bang Địa hạt Miền Nam New York (U.S. District Court SDNY)',
    appointmentDate: '15/01/2026 (Chỉ định theo Lệnh số #2026-CV-04421)',
    secureEmail: 'elena.howard@civilrights-law.attorney',
    securePhone: '+1 (212) 555-0188 (Đường dây bảo mật E2EE)',
    officeAddress: 'Suite 1400, 45 Rockefeller Plaza, Manhattan, New York, NY 10111',
    privacyScope: 'Đại diện Tố tụng Liên bang (Attorney-Client Privilege / F.R.C.P. 26c)',
    bio: 'Hơn 12 năm kinh nghiệm tranh tụng nhân quyền và bảo vệ quyền lợi nạn nhân trước Tòa án Liên bang. Giữ trách nhiệm pháp lý độc lập trong hội đồng ký duyệt mật mã Quorum.',
    did: 'did:tide:0x4f8e9a02ce893b1277a01d5e6f3b8901',
    publicKey: '0x04e12fa89b21a007629bc44d01c08fe2331189ac72... (ECDSA P-256)',
    quorumWeight: 'Đồng ký duyệt bắt buộc (Co-Signer - 2/2 hoặc 3/3 All-Keyholders)',
    dataAccessScope: 'C0 (Toàn quyền), C1 (Toàn quyền & Xuất độc quyền), C2 (Khi đạt Quorum)',
    enclaveHardwareState: 'Attested Apple Secure Enclave / WebCrypto RAM Isolated'
  },
  SURVIVOR_CLIENT: {
    id: 'usr_client_01',
    name: 'Nạn nhân: Jane Doe (Protected)',
    title: 'Chủ thể Quyền lực Dữ liệu Tối cao',
    organization: 'Đương sự được Tòa án Liên bang bảo vệ đặc biệt (SDNY)',
    role: 'SURVIVOR_CLIENT',
    avatar: '🛡️',
    hasDataAuthority: true,
    roleDescription: 'Nạn nhân được bảo vệ danh tính; giữ mảnh khóa chủ quyền tối cao, có quyền cấp phép hoặc thu hồi truy cập.',
    legalCredential: 'Lệnh Bảo vệ Ẩn danh Tòa án Liên bang #2026-CV-04421-SEAL',
    jurisdiction: 'Khu vực Bảo vệ Nhân chứng & Tố tụng Dân sự Khẩn cấp SDNY',
    appointmentDate: '10/01/2026 (Kích hoạt chế độ Bảo vệ Chủ quyền)',
    secureEmail: 'vault-relayed-jane@anon-protect.court.gov (Bảo mật 1 chiều)',
    securePhone: 'Kênh liên lạc ẩn danh TideCloak Whisper Relay (Không lưu SĐT thật)',
    officeAddress: '[ĐÃ NIÊM PHONG TUYỆT ĐỐI THEO LỆNH TÒA ÁN CẤP 4 - LEVEL 4]',
    privacyScope: 'Chủ thể Tối cao (Sovereign Vault Ownership - Silence ≠ Consent)',
    bio: 'Thân chủ nguyên đơn trong vụ kiện dân sự liên bang. Nắm quyền phủ quyết tối cao đối với toàn bộ dữ liệu C2 (Bệnh án, lời khai sang chấn tâm lý, tọa độ nơi ở an toàn).',
    did: 'did:tide:0x71a2ce8954d01b8a923ecf410acb7904',
    publicKey: '0x04c89ba011f4569e200bc77148ae3901bce70921fe... (Client Hardware Enclave)',
    quorumWeight: 'Chủ quyền Quyết định Tối cao (Sovereign Approver - Bắt buộc có chữ ký)',
    dataAccessScope: 'C0, C1, C2, C3 (Toàn quyền sở hữu - Quyền thu hồi bất kỳ lúc nào)',
    enclaveHardwareState: 'Client Device Secure Enclave (Zero Remote Server Copy)'
  },
  GUARDIAN: {
    id: 'usr_guardian_01',
    name: 'Người giám hộ: Sarah Jenkins',
    title: 'Đại diện Hợp pháp của Nạn nhân',
    organization: 'Văn phòng Giám hộ Pháp lý Chỉ định bởi Tòa án (SDNY Guardianship)',
    role: 'GUARDIAN',
    avatar: '🤝',
    hasDataAuthority: true,
    roleDescription: 'Người giám hộ bảo trợ hợp pháp; giữ mảnh khóa bảo hộ thứ ba trong Quorum All-Keyholders mở dữ liệu C2.',
    legalCredential: 'Quyết định Giám hộ Pháp lý Chỉ định số #GD-2025-9921',
    jurisdiction: 'Tòa án Gia đình & Giám hộ Bảo trợ Bang New York',
    appointmentDate: '05/12/2025 (Chính thức phê chuẩn)',
    secureEmail: 'sarah.jenkins@ny-guardianship.court.gov',
    securePhone: '+1 (212) 555-0143 (Đường dây văn phòng giám hộ)',
    officeAddress: 'Phòng 310, Tòa nhà Tư pháp 40 Foley Square, New York, NY 10007',
    privacyScope: 'Bảo trợ & Đồng giám hộ (Tự động cách ly nếu Xung đột lợi ích)',
    bio: 'Chuyên viên bảo trợ pháp lý cao cấp với 15 năm kinh nghiệm trong lĩnh vực bảo hộ nhân thân và hỗ trợ nạn nhân dễ bị tổn thương. Tham gia phê duyệt Quorum bảo vệ thân chủ.',
    did: 'did:tide:0x9d11fa88ca23b49910d55e81c7e09923',
    publicKey: '0x04f55a12ec8930419e782bc41109aed837190ca829... (Court Enclave ECDSA)',
    quorumWeight: 'Bên giữ khóa thứ ba (3rd Keyholder - Cách ly khi kích hoạt Ngoại lệ 4)',
    dataAccessScope: 'C0 (Xem/Sửa), C1 (Xem), C2 (Ký duyệt mở chứng cứ y tế)',
    enclaveHardwareState: 'Court Attested Workstation Enclave'
  },
  ADMIN: {
    id: 'usr_admin_01',
    name: 'Admin: Alex Mercer',
    title: 'Quản trị viên Hạ tầng (0% Data Authority)',
    organization: 'LegalCloud Enterprise Hosting Provider (FedRAMP High)',
    role: 'ADMIN',
    avatar: '⚙️',
    hasDataAuthority: false, // ZERO DATA AUTHORITY
    roleDescription: 'Quản trị viên máy chủ. Nắm quyền root hạ tầng nhưng hoàn toàn bị mù toán học trước dữ liệu nạn nhân.',
    legalCredential: 'Chứng nhận SRE An ninh Đám mây AWS GovCloud / FedRAMP #SRE-8812',
    jurisdiction: 'Hạ tầng Đám mây Trung tâm Dữ liệu Cấp 4 (US-East GovCloud)',
    appointmentDate: '01/08/2024 (Quản lý hạ tầng máy chủ)',
    secureEmail: 'alex.mercer@legalcloud-hosting.net',
    securePhone: '+1 (800) 555-0199 (NOC SRE trực 24/7)',
    officeAddress: 'LegalCloud Ops Center, 1100 Wilson Blvd, Arlington, VA 22209',
    privacyScope: 'Không có thẩm quyền dữ liệu (Mathematically Blinded Zero-Knowledge)',
    bio: 'Kỹ sư trưởng vận hành hạ tầng máy chủ và tường lửa phần cứng. Quản trị máy chủ, CPU, RAM và đường truyền mạng, nhưng bị cô lập toán học hoàn toàn khỏi mọi khóa giải mã nội dung vụ án.',
    did: 'did:tide:0x00000000000000000000000000 (Zero-Knowledge Blinded)',
    publicKey: '[KHÔNG TỒN TẠI KHÓA GIẢI MÃ NỘI DUNG - ZERO KEY ACCESS]',
    quorumWeight: '0% Thẩm quyền (Bị loại trừ toán học tuyệt đối khỏi Quorum)',
    dataAccessScope: 'C0 (Chỉ vận hành hệ thống), C1 & C2: 0 BẢN RÕ (Toàn bộ là Ciphertext AES)',
    enclaveHardwareState: 'Host Hardware Node (Zero Access to Enclave Registers)'
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
    size: '38.5 KB (DOCX)',
    uploadedAt: '2026-10-15 08:30',
    summary: 'Lệnh niêm phong danh tính của Tòa án Liên bang, lịch trình tố tụng và phân công luật sư đại diện.',
    encryptedHash: '0x8f2a...9b11 (Public Discovery Grant)',
    isPdf: false,
    isDocx: true,
    docxUrl: '/documents/Court_Scheduling_Order_2026_CV_04421.docx',
    docxFileName: 'Court_Scheduling_Order_2026_CV_04421.docx',
    fileName: 'Court_Scheduling_Order_2026_CV_04421.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    size: '36.8 KB (DOCX)',
    uploadedAt: '2026-10-16 11:00',
    summary: 'Giấy báo xuất hiện trước tòa và xác nhận thẩm quyền đại diện pháp lý đã công khai tại tòa án.',
    encryptedHash: '0x1a8f...3c99 (Public Discovery)',
    isDocx: true,
    docxUrl: '/documents/Filed_Notice_of_Appearance_and_Retainer.docx',
    docxFileName: 'Filed_Notice_of_Appearance_and_Retainer.docx',
    fileName: 'Filed_Notice_of_Appearance_and_Retainer.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    size: '39.2 KB (DOCX)',
    uploadedAt: '2026-10-17 14:10',
    summary: 'Biên bản làm việc nội bộ, tổng kết tiền lệ pháp lý và mục lục chứng cứ đã được che thông tin nhạy cảm.',
    encryptedHash: '0x5d10...7c22 (Role-Restricted Enclave)',
    isPdf: false,
    isDocx: true,
    docxUrl: '/documents/Privileged_Legal_Correspondence_Redacted_Index.docx',
    docxFileName: 'Privileged_Legal_Correspondence_Redacted_Index.docx',
    fileName: 'Privileged_Legal_Correspondence_Redacted_Index.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    size: '37.5 KB (DOCX)',
    uploadedAt: '2026-10-17 16:45',
    summary: 'Sổ cái hành trình lưu vết chứng cứ, mã băm SHA-256 và mốc thời gian tiếp nhận vật chứng.',
    encryptedHash: '0x4e2d...8b10 (Ledger Sealed)',
    isDocx: true,
    docxUrl: '/documents/Chain_of_Custody_Cryptographic_Ledger.docx',
    docxFileName: 'Chain_of_Custody_Cryptographic_Ledger.docx',
    fileName: 'Chain_of_Custody_Cryptographic_Ledger.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    decryptedContent: 'EVIDENCE CHAIN-OF-CUSTODY AUDIT LOG:\nItem 01 (Audio): Received 2026-08-15 | Custodian: Elena Howard, Esq.\nItem 02 (Toxicology): Received 2026-08-18 | Custodian: State Forensic Laboratory (Sealed)',
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
    size: '41.8 KB (DOCX)',
    uploadedAt: '2026-10-18 11:20',
    summary: 'Báo cáo giám định y khoa thương tật cấp III, kết quả độc chất học và chẩn đoán sang chấn tâm lý PTSD.',
    encryptedHash: '0x3c7e...44d9 (Survivor Quorum Required)',
    isPdf: false,
    isDocx: true,
    docxUrl: '/documents/Exhibit_B_Forensic_Medical_Trauma_Evaluation.docx',
    docxFileName: 'Exhibit_B_Forensic_Medical_Trauma_Evaluation.docx',
    fileName: 'Exhibit_B_Forensic_Medical_Trauma_Evaluation.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    size: '39.6 KB (DOCX)',
    uploadedAt: '2026-10-21 19:15',
    summary: 'Bản tường trình chi tiết sự việc, bóc băng ghi âm quấy rối và tọa độ nơi cư trú an toàn của nạn nhân.',
    encryptedHash: '0xe19a...7c03 (Dual Air-Gapped Sovereign Escrow)',
    isPdf: false,
    isDocx: true,
    docxUrl: '/documents/STRICT_PRIVILEGE_Survivor_Timeline_Safehouse.docx',
    docxFileName: 'STRICT_PRIVILEGE_Survivor_Timeline_Safehouse.docx',
    fileName: 'STRICT_PRIVILEGE_Survivor_Timeline_Safehouse.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    size: '37.9 KB (DOCX)',
    uploadedAt: '2026-10-19 09:30',
    summary: 'Ghi chép trị liệu tâm lý chuyên sâu, đánh giá nguy cơ tự hại và phác đồ can thiệp khủng hoảng sau sự vụ.',
    encryptedHash: '0x7b2f...1a44 (Psych-Immunity Lock)',
    isDocx: true,
    docxUrl: '/documents/Clinical_Psychotherapy_Notes_PTSD_Evaluation.docx',
    docxFileName: 'Clinical_Psychotherapy_Notes_PTSD_Evaluation.docx',
    fileName: 'Clinical_Psychotherapy_Notes_PTSD_Evaluation.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    decryptedContent: 'CLINICAL PSYCHOTHERAPY NOTES — STRICT PRIVILEGE:\n- Patient: Jane Doe | Assessment: Acute Post-Traumatic Stress Disorder with persistent intrusive flashbacks.\n- Therapy sessions log: 14 clinical encounters documented.\n- High sensitivity: Disclosure causes severe emotional and mental health trauma.',
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
    size: '38.2 KB (DOCX)',
    uploadedAt: '2026-10-21 21:00',
    summary: 'Bằng chứng tin nhắn đe dọa trả thù từ bị đơn, kế hoạch di tản khẩn cấp và vị trí trú ẩn bí mật.',
    encryptedHash: '0x9c41...6d22 (Safehouse Sealed)',
    isDocx: true,
    docxUrl: '/documents/Witness_Protection_Threat_Messages_Evidence.docx',
    docxFileName: 'Witness_Protection_Threat_Messages_Evidence.docx',
    fileName: 'Witness_Protection_Threat_Messages_Evidence.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    requestedFor: 'In-Camera Judicial Inspection & Legal Trial Preparation',
    requestedRole: 'LEAD_COUNSEL',
    reason: 'Yêu cầu mở niêm phong hồ sơ y khoa C2 phục vụ thẩm tra kín (In-Camera Review) của Tòa án và chuẩn bị tranh tụng.',
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
    details: 'Nạn nhân Jane Doe khởi tạo yêu cầu Quorum All-Keyholders mở niêm phong chứng cứ C2 Exhibit B (Đã ký: 1/3).'
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
