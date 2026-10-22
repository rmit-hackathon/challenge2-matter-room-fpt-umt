export type UserRole = 
  | 'LEAD_COUNSEL' 
  | 'SURVIVOR_CLIENT' 
  | 'GUARDIAN'
  | 'FORENSIC_EXPERT' 
  | 'ADMIN' 
  | 'IT_ADMIN';

export type NavTab = 
  | 'evidence-matrix' 
  | 'quorum-approvals' 
  | 'admin-console';

// Brainstorm 2.0 Core Data Classification: C0, C1, C2
export type DataClass = 'C0' | 'C1' | 'C2';

export interface CrudPolicy {
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  exportRestrictedTo?: UserRole;
  approvalRequired: boolean;
  ruleExplanation: string;
}

export type SecurityLevel = 
  | 'LEVEL_1_ROUTINE'          // C0 — Operational: non-sensitive workflow information (No approval needed)
  | 'LEVEL_2_SENSITIVE'        // C1 — Confidential: ordinary case material restricted to lawyers
  | 'LEVEL_3_HIGHLY_SENSITIVE' // C2 — Sensitive: personal/case information, requires ALL keyholders
  | 'LEVEL_4_CRITICAL';        // C2 — Sealed critical identity/safehouse coordinates

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
  isPdf?: boolean;
  fileName?: string;
  mimeType?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  organization: string;
  role: UserRole;
  avatar: string;
  hasDataAuthority: boolean; // Admin = FALSE (Zero Data Authority), Nạn nhân & Luật sư & Người giám hộ = TRUE
  roleDescription: string;
}

export interface MatterDocument {
  id: string;
  title: string;
  category: string;
  dataClass?: DataClass; // C0, C1, C2
  securityLevel?: SecurityLevel;
  classification?: ClassificationLevel;
  size: string;
  uploadedAt: string;
  encryptedHash: string;
  decryptedContent?: string;
  summary: string;
  encryptedPayload?: EncryptedPayload;
  isPdf?: boolean;
  fileName?: string;
  mimeType?: string;
  crudPolicy?: CrudPolicy;
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
  requiredRoles?: UserRole[];
  isGuardianConflicted?: boolean;
  safeguardNotice?: string;
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
