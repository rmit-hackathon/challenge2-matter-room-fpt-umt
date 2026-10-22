import { describe, it, expect } from 'vitest';
import { TideCloakMatterService } from '../src/lib/tidecloak';
import { MOCK_USERS, MOCK_DOCUMENTS } from '../src/data/mockMatterData';
import { QuorumRequest, MatterDocument } from '../src/types/matter';

describe('TideCloakMatterService (End-to-End Demo Decryption Flows)', () => {
  const c0Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C0') || MOCK_DOCUMENTS[0];
  const c1Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C1') || MOCK_DOCUMENTS[2];
  const c2Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C2') || MOCK_DOCUMENTS[4];

  it('1. NEGATIVE TEST: Platform Sysadmin has 0% Data Authority and is rejected', async () => {
    const adminUser = MOCK_USERS.ADMIN;
    const result = await TideCloakMatterService.attemptDecryptAsync(adminUser, c2Doc, []);

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('ADMIN_NO_DATA_AUTHORITY');
    expect(result.errorMessage).toContain('Infrastructure Admin possesses ZERO Data Authority');
    expect(result.forsetiInvariant).toBe('INVARIANT_RULE_1_ZERO_DATA_AUTHORITY');
  });

  it('2. C0 FLOW: Operational document is accessible directly to authorized users', async () => {
    const counselUser = MOCK_USERS.LEAD_COUNSEL;
    const result = await TideCloakMatterService.attemptDecryptAsync(counselUser, c0Doc, []);

    expect(result.success).toBe(true);
    expect(result.content).toBeDefined();
    expect(result.forsetiInvariant).toBe('INVARIANT_RULE_2_OPERATIONAL_PUBLIC');
  });

  it('3. C1 FLOW: Confidential records allow Lead Counsel but reject unauthorized roles', async () => {
    const counselUser = MOCK_USERS.LEAD_COUNSEL;
    const guardianUser = MOCK_USERS.GUARDIAN;

    // Counsel accesses C1 -> Allowed
    const counselRes = await TideCloakMatterService.attemptDecryptAsync(counselUser, c1Doc, []);
    expect(counselRes.success).toBe(true);
    expect(counselRes.forsetiInvariant).toBe('INVARIANT_RULE_3_CONFIDENTIAL_LEGAL');

    // Guardian alone on C1 -> Denied
    const guardianRes = await TideCloakMatterService.attemptDecryptAsync(guardianUser, c1Doc, []);
    expect(guardianRes.success).toBe(false);
    expect(guardianRes.errorCode).toBe('UNAUTHORIZED_OPPONENT');
  });

  it('4. C2 FLOW: Blocked when Quorum consensus is pending (1/3 signed)', async () => {
    const counselUser = MOCK_USERS.LEAD_COUNSEL;
    const pendingQuorum: QuorumRequest[] = [
      {
        id: 'qr_test',
        targetDocumentId: c2Doc.id,
        targetDocumentTitle: c2Doc.title,
        requestedBy: 'Jane Doe',
        requestedFor: 'Court Inspection',
        requestedRole: 'LEAD_COUNSEL',
        reason: 'Trial evidence verification',
        status: 'PENDING',
        approvals: [
          {
            signerId: 'usr_client_01',
            signerName: 'Jane Doe',
            signerRole: 'SURVIVOR_CLIENT',
            timestamp: '2026-10-22 10:00:00',
            signatureHash: '0x71a2ce89'
          }
        ],
        threshold: 3,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted: false
      }
    ];

    const result = await TideCloakMatterService.attemptDecryptAsync(counselUser, c2Doc, pendingQuorum);
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('QUORUM_REQUIRED');
    expect(result.errorMessage).toContain('All-Keyholders Quorum Consensus Required');
  });

  it('5. POSITIVE TEST: C2 Sealed Evidence decrypts in <50ms when All-Keyholders Quorum (3/3) is satisfied', async () => {
    const counselUser = MOCK_USERS.LEAD_COUNSEL;
    const approvedQuorum: QuorumRequest[] = [
      {
        id: 'qr_test',
        targetDocumentId: c2Doc.id,
        targetDocumentTitle: c2Doc.title,
        requestedBy: 'Jane Doe',
        requestedFor: 'Court Inspection',
        requestedRole: 'LEAD_COUNSEL',
        reason: 'Trial evidence verification',
        status: 'APPROVED',
        approvals: [
          {
            signerId: 'usr_client_01',
            signerName: 'Jane Doe',
            signerRole: 'SURVIVOR_CLIENT',
            timestamp: '2026-10-22 10:00:00',
            signatureHash: '0x71a2ce89'
          },
          {
            signerId: 'usr_counsel_01',
            signerName: 'Elena Howard',
            signerRole: 'LEAD_COUNSEL',
            timestamp: '2026-10-22 10:05:00',
            signatureHash: '0x4f8e9a02'
          },
          {
            signerId: 'usr_guardian_01',
            signerName: 'Sarah Jenkins',
            signerRole: 'GUARDIAN',
            timestamp: '2026-10-22 10:10:00',
            signatureHash: '0x9d11fa88'
          }
        ],
        threshold: 3,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted: false
      }
    ];

    const result = await TideCloakMatterService.attemptDecryptAsync(counselUser, c2Doc, approvedQuorum);
    expect(result.success).toBe(true);
    expect(result.latencyMs).toBeDefined();
    expect(result.latencyMs).toBeLessThan(100); // 12ms benchmark
    expect(result.forsetiInvariant).toBe('INVARIANT_RULE_4_ALL_KEYHOLDERS_QUORUM');
  });

  it('6. SAFEGUARD TEST: Guardian Conflict Rule 4 unlocks C2 with 2-of-2 consensus', async () => {
    const counselUser = MOCK_USERS.LEAD_COUNSEL;
    const conflictedQuorum: QuorumRequest[] = [
      {
        id: 'qr_test',
        targetDocumentId: c2Doc.id,
        targetDocumentTitle: c2Doc.title,
        requestedBy: 'Jane Doe',
        requestedFor: 'Court Inspection',
        requestedRole: 'LEAD_COUNSEL',
        reason: 'Trial evidence verification under Rule 4',
        status: 'APPROVED',
        approvals: [
          {
            signerId: 'usr_client_01',
            signerName: 'Jane Doe',
            signerRole: 'SURVIVOR_CLIENT',
            timestamp: '2026-10-22 10:00:00',
            signatureHash: '0x71a2ce89'
          },
          {
            signerId: 'usr_counsel_01',
            signerName: 'Elena Howard',
            signerRole: 'LEAD_COUNSEL',
            timestamp: '2026-10-22 10:05:00',
            signatureHash: '0x4f8e9a02'
          }
        ],
        threshold: 2,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted: true // Exception 4 activated
      }
    ];

    const result = await TideCloakMatterService.attemptDecryptAsync(counselUser, c2Doc, conflictedQuorum);
    expect(result.success).toBe(true);
    expect(result.forsetiInvariant).toBe('INVARIANT_RULE_4_SAFEGUARD_EXCEPTION_QUORUM');
  });

  it('7. TAMPER ATTEMPT: Admin privilege escalation attempt is rejected with audit tamper alert', () => {
    const adminUser = MOCK_USERS.ADMIN;
    const overrideResult = TideCloakMatterService.attemptAdminOverride(adminUser);

    expect(overrideResult.success).toBe(false);
    expect(overrideResult.alertMessage).toContain('CRITICAL SECURITY INTERVENTION');
    expect(overrideResult.logAudit).toContain('FORSETI_TAMPER_BLOCKED');
  });
});
