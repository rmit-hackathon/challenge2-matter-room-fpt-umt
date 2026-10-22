export type UserRole = 
  | 'LEAD_COUNSEL' 
  | 'SURVIVOR_CLIENT' 
  | 'FORENSIC_EXPERT' 
  | 'ADMIN' 
  | 'IT_ADMIN'
  | 'OPPOSING_COUNSEL';

export type NavTab = 
  | 'evidence-matrix' 
  | 'quorum-approvals' 
  | 'privilege-and-redaction' 
  | 'immutable-audit-trail' 
  | 'litigation-holds'
  | 'admin-console';

export type SecurityLevel = 
  | 'LEVEL_1_ROUTINE'          // Level 1 — Routine confidential information (No per-request approval)
  | 'LEVEL_2_SENSITIVE'        // Level 2 — Sensitive case information (Restricted role-based access)
  | 'LEVEL_3_HIGHLY_SENSITIVE' // Level 3 — Highly sensitive personal information (Explicit approval required)
  | 'LEVEL_4_CRITICAL';        // Level 4 — Critical or exceptionally restricted information (Strongest access controls)

export type ClassificationLevel = 
  | 'DISCOVERY' 
  | 'RESTRICTED_EXPERT' 
  | 'STRICT_PRIVILEGE';

export interface EncryptedPayload {
  cipherHex: string;
  ivHex: string;
  saltHex: string;
  tagHex: string;
  classification: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  organization: string;
  role: UserRole;
  avatar: string;
  hasDataAuthority: boolean; // Admin = FALSE (Zero Data Authority), Nạn nhân & Luật sư = TRUE
  roleDescription: string;
}

export interface MatterDocument {
  id: string;
  title: string;
  category: string;
  securityLevel?: SecurityLevel;
  classification?: ClassificationLevel;
  size: string;
  uploadedAt: string;
  encryptedHash: string;
  decryptedContent: string;
  summary: string;
  encryptedPayload?: EncryptedPayload;
  requiredQuorum?: {
    rolesRequired: UserRole[] | string[];
    description: string;
  };
}

export interface QuorumRequest {
  id: string;
  targetDocumentId: string;
  targetDocumentTitle: string;
  requestedBy: string;
  requestedFor: string;
  requestedRole: UserRole | string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvals: {
    signerId: string;
    signerName: string;
    signerRole: UserRole | string;
    timestamp: string;
    signatureHash: string;
  }[];
  threshold: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: UserRole | string;
  status: 'SUCCESS' | 'BLOCKED_BY_TIDE' | 'QUORUM_TRIGGERED';
  details: string;
}
