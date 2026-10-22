import { UserProfile, MatterDocument, QuorumRequest, AuditLogEntry } from '../types/matter';

export const MOCK_USERS: Record<string, UserProfile> = {
  LEAD_COUNSEL: {
    id: 'usr_counsel_01',
    name: 'Elena Howard, Esq.',
    title: 'Lead Survivor Advocate & Trial Counsel',
    organization: 'Howard & Associates Civil Rights Law',
    role: 'LEAD_COUNSEL',
    avatar: '👩‍💼',
    hasDataAuthority: true,
    roleDescription: 'Luật sư đại diện bảo vệ quyền lợi nạn nhân; chịu trách nhiệm pháp lý cao nhất và nắm quyền ký Quorum.'
  },
  SURVIVOR_CLIENT: {
    id: 'usr_client_01',
    name: 'Jane Doe (Protected Pseudonym)',
    title: 'Primary Plaintiff & Survivor',
    organization: 'Court-Protected Anonymous Litigant',
    role: 'SURVIVOR_CLIENT',
    avatar: '🛡️',
    hasDataAuthority: true,
    roleDescription: 'Nạn nhân được Tòa án bảo vệ danh tính; nắm quyền chủ quyền dữ liệu và chữ ký Quorum tối cao.'
  },
  IT_ADMIN: {
    id: 'usr_admin_01',
    name: 'Alex Mercer (Platform Sysadmin)',
    title: 'Cloud Infrastructure & Database Admin',
    organization: 'LegalCloud Hosting Provider',
    role: 'IT_ADMIN',
    avatar: '⚙️',
    hasDataAuthority: false, // RÀO CẢN NIỀM TIN CỐT TỬ: HOÀN TOÀN KHÔNG CÓ DATA AUTHORITY
    roleDescription: 'Quản trị viên máy chủ IT. Tuyệt đối KHÔNG ĐƯỢC GIẢI MÃ hình ảnh y khoa hay lời khai nhạy cảm của nạn nhân.'
  },
  FORENSIC_EXPERT: {
    id: 'usr_expert_01',
    name: 'Dr. Miriam Vance, M.D.',
    title: 'Forensic Medical Examiner & Trauma Psychologist',
    organization: 'Institute for Forensic Medical Evidence',
    role: 'FORENSIC_EXPERT',
    avatar: '🩺',
    hasDataAuthority: false, // Chỉ nảy sinh khi được Quorum Nạn nhân + Luật sư phê duyệt
    roleDescription: 'Bác sĩ pháp y & chuyên gia tâm lý độc lập. Chỉ giải mã hồ sơ y tế khi có đồng thuận Quorum 2-of-2.'
  },
  OPPOSING_COUNSEL: {
    id: 'usr_opposing_01',
    name: 'Richard Sterling, Esq.',
    title: 'Corporate Defense Counsel',
    organization: 'Sterling & Croft LLP (Representing Defendants)',
    role: 'OPPOSING_COUNSEL',
    avatar: '⚖️',
    hasDataAuthority: false,
    roleDescription: 'Luật sư bên bị đơn. Chỉ được tiếp cận chứng cứ Discovery đã qua kiểm duyệt của Tòa án.'
  }
};

export const MOCK_DOCUMENTS: MatterDocument[] = [
  {
    id: 'doc_01',
    title: 'Court Order #2026-CV-4421: Protective Order Granting Anonymous Pseudonym Filing',
    category: 'Court Orders',
    classification: 'DISCOVERY',
    size: '1.2 MB',
    uploadedAt: '2026-10-15 08:30',
    summary: 'Lệnh niêm phong danh tính của Tòa án Liên bang cho phép nguyên đơn sử dụng bí danh Jane Doe.',
    encryptedHash: '0x8f2a...9b11 (Public Discovery Grant)',
    decryptedContent: 'UNITED STATES DISTRICT COURT FOR THE SOUTHERN DISTRICT OF NEW YORK.\nCase No. 26-cv-04421-JSR.\nPROTECTIVE ORDER GOVERNING CONFIDENTIAL SENSITIVE DISCOVERY:\n1. The Court finds compelling privacy and safety interests warranting the Plaintiff to proceed under the pseudonym "Jane Doe".\n2. All unredacted medical evaluations, intimate correspondence, and witness protection records are hereby placed under permanent seal.\n3. Willful disclosure by hosting providers or IT staff shall constitute immediate criminal contempt of court.',
    encryptedPayload: {
      cipherHex: "43dd88d1cddb8d05c5140069b8db6ce71dfbbe1c56cb10a58e64f5015dd877b7448686f9ad19b45378417b2d2d65ef4b0cb24221d7b3faf0c22b01f15df0b39e51b0a4b7b94bb15644fbd40ee199f383ddc5bce8bb97e3afff10cbaf0964ce00160473b762cece3e0de35e8a6290078d212739486040a0d537a41bfb0932209abebf1f0c59d62837f7bd9fa2d6cc163f1acb6435dd91ec1ba2a63d2a4f4520ae69415acd19ada640bc8838e7d46763edfac435b5fe93216a984c9488b4c4d6cb4e5d1365ae0af1efe72a268f755305481dd3f0b87da8d35f4f6d9225e479c2a7babe66477a7c50bbf7c35010b5a38568a419a06de0e35e0ed5e9be9d651badda5fd8e5fbd9f97d082b50ee3b7da22d548ee3c56504f554df1f499e1bafe0b0219f73ff4cb01c4063221a3b9b11d17bad71ec051963ccbc3f9e82ba1efa08978bdbeec1a5f8f0706646177a773192014a92ec55de5c152728754fa80447d74b9f8ccb17d319dc9139425a451240f744dab4793fa0ba21b36ea8cc5c1c4055cfe81f59bbd12e9cc8f2ca6944f710f6521df477b8a7e1cf1950eb6c20b1e6bb6e4b3344f4a281b8b9d9ef96441226545e23284e1c8ce21799dfb4f0ca29abbf6cb397872596cbe769f2975ac6f9f67080b0a19c371ed13288d81be31f927274b3b250b7e9c6a145f12e9eaf4af18ad047d499b8efafbe0abae838e8135fad35eb573eb73d7663ad5c9b63f6516d646dbf1aba3949dbe69386f4a2e11cb12d97",
      ivHex: "28b62db4677f2a9e589f21a8",
      saltHex: "eea47cfa8772ac9f0d10cf9fc5dc83cd",
      tagHex: "eea47cfa8772ac9f",
      classification: "IMMUNITY_SEALED_AES_256_GCM"
    }
  },
  {
    id: 'doc_02',
    title: 'Exhibit B: Confidential Forensic Medical Trauma Evaluation & Physical Examination',
    category: 'Medical Evidence',
    classification: 'RESTRICTED_EXPERT',
    size: '24.5 MB',
    uploadedAt: '2026-10-18 11:20',
    summary: 'Báo cáo giám định y khoa thương tật, giám định mẫu sinh học và đánh giá sang chấn tâm lý PTSD.',
    encryptedHash: '0x3c7e...44d9 (Tide Cloaked - Dual Survivor Quorum)',
    decryptedContent: 'CONFIDENTIAL FORENSIC MEDICAL EXAMINATION REPORT — EYES-ONLY FOR APPROVED MEDICAL EXPERTS.\nEXAMINATION SUMMARY:\n- Patient: Jane Doe (DOB verified via cryptographic token)\n- Physical Trauma Findings: Acute soft tissue contusions and defensive lacerations documented via ultraviolet imaging.\n- Forensic Toxicology Analysis: Detectable traces of sedative compounds consistent with involuntary incapacitation.\n- Psychological Trauma Assessment: Severe Post-Traumatic Stress Disorder (PTSD) with acute avoidance symptoms.\nCONCLUSION: Physical and forensic findings are medically consistent with non-consensual sexual assault occurring on August 14, 2026.',
    encryptedPayload: {
      cipherHex: "357ccec411f6e36f8013f0c414153588eb339ad23ae221bbf35b02e489e09858aef1a5a57073ecb7d05e0620f5c2bf1950f257b236e826281ba43e9a501eb6d29f8f11b71ca4734f53286e02990d3e9aeff9e6127709e041a17cc76f183655d8fdfaef9d47b3f0aaacea1da43714f1d8017006a0c9acc774765fd87095e8f694d76635607b03c4353c6375aeac8c1b2d1e0a7342f5c9b90362666874a50dd4b4ed6b47d0c4d94a460330cc980899612f1637185ba141742f3f2b2d676f206a8d7ac04ea2069423c8b66e74d1bef9d04708abfdd7bd87983bacd6cfdc611d18c5a390d22a41ef069c976fb0f77830ce2c24597e7ffee91dca13ede048f4676d126ff0784f51986189fb766966558cb9231252ec7740a84acda26f8a566332d27ff8bfadc23554f00e38a26607c1356f1a3520ef80c19d48be84b9a27aa8977653f9d9819f06ca1c6db7c14a206b6c7a65e3bcd704dd4d491b6c21e996c049b7650466a367bfdf939d019f7c275598e055c0d915179e918811013d3167365536e18cab9011471f5f7699ba838cbcd8f2af5747c9387cbfb12ce460d323ea1134c56e4406a70764b3a15f353706d3d1d8718704980c6d563029a8a7716e489dd0b7e3dedaed23233d845317426b5f3c24913436765ddaa8092c2672c31e6e8e0291a0b0bfe01d3b59f8de6c8912e2a4387ea0fa0c8244518bf5225a4c6ec7069480ec7ebaef8a7bba807f0323134d51a14f14602805d85b54ee5e312e7a8020f41bfcc4ee5dc32d9b3e8d024c8747b4c275af1cb67407b65493d745c23f27a17ac5ff9dc75faeadb6c47372e240ef0ee6e8c6aa5614e365cedc68409bef88026b7d1f640df37450e47c6ba60f5d4119586e024ec7a47d152eef2a4c566ba8b8f0f2c33848dc52dec4e35c59443c182bbdd7feb02a42ab05c1ad803ef3",
      ivHex: "b9d71fd22b5c228dedc2668a",
      saltHex: "cb320ae2e984bac3ce83fb1d52165309",
      tagHex: "cb320ae2e984bac3",
      classification: "IMMUNITY_SEALED_AES_256_GCM"
    },
    requiredQuorum: {
      rolesRequired: ['LEAD_COUNSEL', 'SURVIVOR_CLIENT'],
      description: 'Yêu cầu đồng thuận Quorum 2-of-2: Bản thân Nạn nhân (Jane Doe) + Luật sư đại diện (Elena Howard).'
    }
  },
  {
    id: 'doc_03',
    title: 'STRICT PRIVILEGE: Survivor Personal Incident Timeline, Harassment Transcripts & Audio Memos',
    category: 'Privileged Testimony',
    classification: 'STRICT_PRIVILEGE',
    size: '8.4 MB',
    uploadedAt: '2026-10-20 16:45',
    summary: 'Bản tường trình chi tiết sự việc của nạn nhân, bản bóc băng ghi âm quấy rối và nhật ký tin nhắn đe dọa.',
    encryptedHash: '0xe19a...7c03 (Tide Cloaked - Zero Admin E2EE)',
    decryptedContent: 'STRICT ATTORNEY-CLIENT PRIVILEGED & WORK PRODUCT DOCTRINE.\nTO: Elena Howard, Esq. (Lead Counsel)\nFROM: Jane Doe (Survivor / Plaintiff)\nSUBJECT: Full Chronological Incident Timeline & Corroborating Audio Transcripts.\n\nSummary of Disclosed Events:\nAugust 14, 2026 (22:30 EDT) — After the executive dinner at the Lexington Hotel, Defendant cornered Plaintiff in the private suite.\nAudio Memo #04 Transcription: [00:03:12] Defendant: "No one will believe you. Your career is finished if a word of this leaves this room."\n\nCRITICAL DIRECTIVE: This file contains highly intimate and traumatic personal disclosures. Under NO circumstances should any IT platform administrator, cloud host, or opposing counsel access this data. Protected by TideCloak Session-bound E2EE.',
    encryptedPayload: {
      cipherHex: "83d17a4f282557429c5647adedf3e4571dd58213713e3b152f2340dc477962b6c274c0fbdabf1d33a84ffcbaf4f03184bc76e66dd01615950192e6f1114fe0ad8703d2aeaf7a95ccfeab37f82c78733381a13f8e9726c86878e438bb252792d513ded074cb9b2ca3add8ca59fd0acc7386a3d8f70e2abbefc1b71e5424542bceea21fa89707edb0d76bcfb03f60bc68b9a55c40fdeceff37a2002d001058faf25e6abf07c00303959ff68de70622a1da87688546a4c357b471bb63327b8694e07168b5dad14c1a898fe8054fc16719ad650fad8c04d60b744368aca2ab4200196252f831419a8ad95154f98c5f57ef220f69db78d61584600b4d154dd8daf8e2b137261632899e78eb8d3b36f2d7b73570cc3785d796867416c45e1df87fdaf634a916124ef864d1080aedcd7bca6f9cb6d3af3503e0d20a1a19560603cee317674ce1c33bfe536fbfd19e0453c8a4f7a8c0c2b8909a1da2e873a49d9c06682697b8bf3facafe920a2a856ffba786c34e0705b470b649429ebc78cb0717919afa2b2b777eb59ccf03a34e9fd02364d5b30559b300bcba3fda8d822636f3be34e713a8b82c7b70a5402674467ebec70685f43f13538e4e96856d86926a4aebe6ab547ba3eb5132aacf5058d63bb511c3e654817ebb5800417d317e912a0dc7675817459ab09ecbd09b29577e8a1ea156485b6d4bd7f4292c7e1201705f245cd7e2600f860e31eed198c08839e90175fcc83072e4dc3abc27a677f19aa57452b241b2753eeb18041437cafff3098fd8a303f6d97733042cf13788977414326d057da25c0d25f498db146c709754fdd56655c6aa2e1e66d0f7925fc02b48140af6a98e7e425fcb18817b9a8db0e628b68235977ceb604af42c253ce3a96fd0c6cceb111ac79ddb240efbc3caa193ed195dadf31b164df80ebb4ec54267ccd7248c66fafa7d293613ceebff3179d690790972fc0bce4b323ef117384bc0ec737f262ec1fe63e9a35e35e91793859eafe6ad42359f581ffd0db445136a1aec0d43e7ff5db95895e65c38845f8fbe14e63e36e34c643ec7b96940d6b37c1ec6e2fa59ad89f627de55aebba79c8007d",
      ivHex: "9cd4a5c8edc0edf9c278e4e2",
      saltHex: "698702dc24e579b38cfe8a36786fa9c3",
      tagHex: "698702dc24e579b3",
      classification: "IMMUNITY_SEALED_AES_256_GCM"
    }
  },
  {
    id: 'doc_04',
    title: 'SEALED IDENTITY ESCROW: True Legal Identity Verification & Witness Protection Safehouse Location',
    category: 'Witness Protection',
    classification: 'STRICT_PRIVILEGE',
    size: '1.8 MB',
    uploadedAt: '2026-10-21 19:15',
    summary: 'Hồ sơ xác thực danh tính thật của Jane Doe và địa chỉ nơi cư trú an toàn được bảo vệ nhân chứng.',
    encryptedHash: '0x992f...a10b (Tide Cloaked - Sovereign Escrow)',
    decryptedContent: 'SEALED COURT ESCROW — WITNESS PROTECTION ENCLAVE.\nSUBJECT: Real Legal Identity & Current Protected Safehouse Coordinates.\n1. Real Identity: [REDACTED UNDER TIDE ZERO-KNOWLEDGE PROOF]\n2. Safehouse Relocation Address: Confidential relocation facility managed by Federal Witness Protection Program.\nWARNING: Any leak of this document directly endangers the physical safety and life of the survivor. Protected by TideCloak Emergent Authority.',
    encryptedPayload: {
      cipherHex: "5ebd4b15977a4d1ed7220fff1085bf1acd8672f84bd7d597939cf3864d6d23a68d807dde5d391ad3264207025c4ac70c83361fad70808967ce62993757659cc4d896f453bd6768a2353ccbd6ff58fc13b6df3d92d010532e67f91e8826da79d20f5a197488908094f2a4495ebc20e1bdfbb25dcf80ca115a6808bfa12fc5523c85854a93cdf46e6ecd57d38c6b9cd4d2325635ded0ccb3309d1fa87fdda5fecc7f7625d8ec7f0274115a61645052590747a12ab72d12c002b92a2f929115cd81a535e9ca57eaeeaeb3c450f03f4df5b81373708597ba368a625fe430976cab6a846deac3e89e1833065fe541ab9df1ade5ac0321a713b041cdcda67c469b9412fca69defadce499d2ef12555066dc6c2e995d9459b6aa99ee0a822a09390dcc684e12de49a16c4d3929365ddd51d97006637fc71676de33fb6a53dbf5d499f5319fad725d2b36034face8afece6c56c61c40a152e5e814b57c5becbd135eacd60ed938297e605710fa120ee6a713a3ae95c7552269f8f3b7f6f0eb4ab4ef9c4fa1af3ff37360fc9cec9b328e0316679a563e5549788e6768872837993e92449a943592ee306c57925f4143b5cde15fd67e245172d3bfb5fb38d5fb76f7554a355358c74dcd41518a",
      ivHex: "369a0df78ccc333a78bf4ef4",
      saltHex: "1d6849da6ef8c56b024fcb6e4a91b329",
      tagHex: "1d6849da6ef8c56b",
      classification: "IMMUNITY_SEALED_AES_256_GCM"
    }
  }
];

export const INITIAL_QUORUM_REQUESTS: QuorumRequest[] = [
  {
    id: 'qr_001',
    targetDocumentId: 'doc_02',
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
    details: 'Nạn nhân đề xuất cấp quyền giải mã Báo cáo y tế Exhibit B cho Bác sĩ pháp y Dr. Miriam Vance (Đã ký: 1/2).'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-22 10:45:10',
    action: 'DISCOVERY_ACCESS',
    actorName: 'Richard Sterling, Esq.',
    actorRole: 'OPPOSING_COUNSEL',
    status: 'SUCCESS',
    details: 'Mở xem Lệnh niêm phong bảo vệ danh tính (Protective Order) theo quy chế Discovery hợp lệ.'
  }
];
