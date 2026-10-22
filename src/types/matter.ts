import { EncryptedPayload } from '../lib/cryptoEngine';

export type UserRole = 
  | 'LEAD_COUNSEL' 
  | 'SURVIVOR_CLIENT' 
  | 'FORENSIC_EXPERT' 
  | 'IT_ADMIN' 
  | 'OPPOSING_COUNSEL';

export type NavTab = 
  | 'evidence-matrix' 
  | 'quorum-approvals' 
  | 'privilege-and-redaction' 
  | 'immutable-audit-trail' 
  | 'litigation-holds';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  organization: string;
  role: UserRole;
  avatar: string;
  hasDataAuthority: boolean; // IT Admin = FALSE, Nạn nhân & Luật sư = TRUE
  roleDescription: string;
}

export type ClassificationLevel = 
  | 'DISCOVERY'           // Công khai theo lệnh Discovery của Tòa án
  | 'RESTRICTED_EXPERT'   // Giới hạn, cần Quorum 2-of-2 (Nạn nhân + Luật sư) để mở cho Giám định y khoa
  | 'STRICT_PRIVILEGE';   // Tuyệt mật Attorney-Client, lời khai riêng tư & danh tính thật, cấm Admin vĩnh viễn

export interface MatterDocument {
  id: string;
  title: string;
  category: string;
  classification: ClassificationLevel;
  size: string;
  uploadedAt: string;
  encryptedHash: string;
  decryptedContent: string;
  summary: string;
  encryptedPayload?: EncryptedPayload;
  requiredQuorum?: {
    rolesRequired: UserRole[];
    description: string;
  };
}

export interface QuorumRequest {
  id: string;
  targetDocumentId: string;
  targetDocumentTitle: string;
  requestedBy: string;
  requestedFor: string;
  requestedRole: UserRole;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvals: {
    signerId: string;
    signerName: string;
    signerRole: UserRole;
    timestamp: string;
    signatureHash: string;
  }[];
  threshold: number; // Yêu cầu 2 chữ ký: Nạn nhân (Jane Doe) + Luật sư đại diện
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  status: 'SUCCESS' | 'BLOCKED_BY_TIDE' | 'QUORUM_TRIGGERED';
  details: string;
}
