import { UserProfile, MatterDocument, QuorumRequest, AuditLogEntry } from '../types/matter';

export const MOCK_USERS: Record<string, UserProfile> = {
  LEAD_COUNSEL: {
    id: 'usr_counsel_01',
    name: 'Elena Howard, Esq.',
    title: 'Lead Trial Counsel & Advocate',
    organization: 'Howard & Associates Civil Rights Law',
    role: 'LEAD_COUNSEL',
    avatar: '👩‍💼',
    hasDataAuthority: true,
    roleDescription: 'Luật sư đại diện bảo vệ quyền lợi nạn nhân; nắm quyền ký Quorum và kiểm soát pháp lý.'
  },
  SURVIVOR_CLIENT: {
    id: 'usr_client_01',
    name: 'Jane Doe (Protected)',
    title: 'Primary Plaintiff & Sovereign Owner',
    organization: 'Court-Protected Anonymous Litigant',
    role: 'SURVIVOR_CLIENT',
    avatar: '🛡️',
    hasDataAuthority: true,
    roleDescription: 'Nạn nhân được bảo vệ danh tính; nắm chủ quyền dữ liệu tối cao, quyền Upload và Quorum tối cao.'
  },
  ADMIN: {
    id: 'usr_admin_01',
    name: 'Alex Mercer',
    title: 'Cloud Infrastructure Administrator',
    organization: 'LegalCloud Hosting Provider',
    role: 'ADMIN',
    avatar: '⚙️',
    hasDataAuthority: false, // ZERO DATA AUTHORITY
    roleDescription: 'Quản trị viên máy chủ. Nắm root quyền hạ tầng nhưng TUYỆT ĐỐI BỊ MÙ trước dữ liệu nạn nhân.'
  },
  FORENSIC_EXPERT: {
    id: 'usr_expert_01',
    name: 'Dr. Miriam Vance, M.D.',
    title: 'Forensic Medical Examiner & Pathologist',
    organization: 'Institute for Forensic Medical Evidence',
    role: 'FORENSIC_EXPERT',
    avatar: '🩺',
    hasDataAuthority: false,
    roleDescription: 'Bác sĩ pháp y độc lập. Cần xác thực 2 bước + Quorum Nạn nhân duyệt để nhận mã giải mã 1 lần.'
  },
  OPPOSING_COUNSEL: {
    id: 'usr_opposing_01',
    name: 'Richard Sterling, Esq.',
    title: 'Corporate Defense Counsel',
    organization: 'Sterling & Croft LLP',
    role: 'OPPOSING_COUNSEL',
    avatar: '⚖️',
    hasDataAuthority: false,
    roleDescription: 'Luật sư bị đơn. Chỉ được tiếp cận Level 1 và Level 2 đã qua kiểm duyệt của Tòa án.'
  }
};

export const MOCK_DOCUMENTS: MatterDocument[] = [
  {
    id: 'doc_01',
    title: 'Court Scheduling Order #2026-CV-04421: Protective Order Granting Anonymous Pseudonym Filing',
    category: 'Court Orders',
    securityLevel: 'LEVEL_1_ROUTINE',
    size: '1.2 MB',
    uploadedAt: '2026-10-15 08:30',
    summary: 'Lệnh niêm phong danh tính của Tòa án Liên bang, lịch trình tố tụng và phân công luật sư đại diện.',
    encryptedHash: '0x8f2a...9b11 (Public Discovery Grant)',
    decryptedContent: 'UNITED STATES DISTRICT COURT FOR THE SOUTHERN DISTRICT OF NEW YORK.\nCase No. 26-cv-04421-JSR.\n\nROUTINE CONFIDENTIAL ORDER GOVERNING CASE PROCEEDINGS:\n1. The Court finds compelling privacy and safety interests warranting the Plaintiff to proceed under the pseudonym "Jane Doe".\n2. Appointment schedule: Pre-trial evidentiary hearing scheduled for November 12, 2026.\n3. Assigned trial counsel verified: Elena Howard, Esq. (Bar #NY-882194).'
  },
  {
    id: 'doc_02',
    title: 'Procedural Legal Correspondence & Redacted Evidence Index',
    category: 'Case Administration',
    securityLevel: 'LEVEL_2_SENSITIVE',
    size: '4.8 MB',
    uploadedAt: '2026-10-17 14:10',
    summary: 'Biên bản làm việc nội bộ, tổng kết tiền lệ pháp lý và mục lục chứng cứ đã được che thông tin nhạy cảm.',
    encryptedHash: '0x5d10...7c22 (Role-Restricted Enclave)',
    decryptedContent: 'CONFIDENTIAL WORK PRODUCT — PRIVILEGED LEGAL RESEARCH & REDACTED INDEX:\n- Legal precedent review: Application of FRE 412 in civil workplace retaliation suits.\n- Witness interview docket: Interrogatory responses logged without survivor personal identifiers.\n- Discovery timetable: Defense deposition window opens October 28, 2026.'
  },
  {
    id: 'doc_03',
    title: 'Exhibit B: Confidential Forensic Medical Trauma Evaluation & Physical Examination',
    category: 'Medical Evidence',
    securityLevel: 'LEVEL_3_HIGHLY_SENSITIVE',
    size: '24.5 MB',
    uploadedAt: '2026-10-18 11:20',
    summary: 'Báo cáo giám định y khoa thương tật cấp III, kết quả độc chất học và chẩn đoán sang chấn tâm lý PTSD.',
    encryptedHash: '0x3c7e...44d9 (Survivor Quorum Required)',
    decryptedContent: 'CONFIDENTIAL FORENSIC MEDICAL EXAMINATION REPORT — EYES-ONLY FOR APPROVED MEDICAL EXPERTS.\n\nEXAMINATION SUMMARY:\n- Patient: Jane Doe (DOB verified via cryptographic hardware token)\n- Physical Trauma Findings: Acute soft tissue contusions, acute cervical strain, and defensive forearm abrasions documented via ultraviolet imaging.\n- Forensic Toxicology Analysis: Detectable traces of sedative compounds (Z-class hypnotic derivative) consistent with involuntary incapacitation.\n- Psychological Trauma Assessment: Severe Post-Traumatic Stress Disorder (PTSD) with acute avoidance symptoms under DSM-5 criteria.\n\nCONCLUSION: Physical and forensic findings are medically consistent with non-consensual sexual assault occurring on August 14, 2026.',
    requiredQuorum: {
      rolesRequired: ['LEAD_COUNSEL', 'SURVIVOR_CLIENT'],
      description: 'Yêu cầu sự phê duyệt rõ ràng từ chính Nạn nhân (Jane Doe) + Luật sư đại diện (Elena Howard).'
    }
  },
  {
    id: 'doc_04',
    title: 'STRICT PRIVILEGE: Survivor Incident Timeline, Audio Transcripts & Sealed Identity Escrow',
    category: 'Witness Protection',
    securityLevel: 'LEVEL_4_CRITICAL',
    size: '10.2 MB',
    uploadedAt: '2026-10-21 19:15',
    summary: 'Bản tường trình chi tiết sự việc, bóc băng ghi âm quấy rối và tọa độ nơi cư trú an toàn của nạn nhân.',
    encryptedHash: '0xe19a...7c03 (Dual Air-Gapped Sovereign Escrow)',
    decryptedContent: 'CRITICAL WITNESS PROTECTION & STRICT PRIVILEGE ESCROW:\n\n1. Chronological Timeline of Harassment & Sexual Assault:\n- August 14, 2026 (22:30 EDT): Incident at Lexington Hotel private executive suite.\n- Audio Memo #04 Transcription: [00:03:12] Defendant: "No one will believe you. Your career is finished if a word of this leaves this room."\n\n2. Protected Witness Safehouse Location:\n- Current Safehouse Coordinates: [MANAGED UNDER FEDERAL WITNESS SECURITY PROGRAM - SEALED]\n\nWARNING: Any leak directly threatens the physical safety and life of the survivor. Protected under TideCloak Zero Data Authority.'
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
    reason: 'Ủy quyền cho Bác sĩ pháp y độc lập giải mã hồ sơ giám định y khoa để nộp bản báo cáo chuyên môn cho Tòa án.',
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
    details: 'Nạn nhân đề xuất cấp quyền xem Exhibit B cho Bác sĩ Dr. Miriam Vance (Đã ký: 1/2).'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-22 10:45:10',
    action: 'DISCOVERY_ACCESS',
    actorName: 'Richard Sterling, Esq.',
    actorRole: 'OPPOSING_COUNSEL',
    status: 'SUCCESS',
    details: 'Mở xem Lệnh niêm phong bảo vệ danh tính Level 1 theo Discovery hợp lệ.'
  }
];
