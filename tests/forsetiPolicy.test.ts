import { describe, it, expect } from 'vitest';
import { ForsetiEngine, CallerContext, ResourceContext, QuorumState } from '../src/lib/forsetiEngine';

describe('ForsetiEngine (Attested Enclave Smart Contract Evaluation)', () => {
  const dummyResource = (classification: 'C0' | 'C1' | 'C2'): ResourceContext => ({
    documentId: 'doc_test',
    classification,
    sha256Hash: '0xabc123...'
  });

  const emptyQuorum: QuorumState = {
    threshold: 3,
    signedCount: 0,
    requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
    activeSignerRoles: []
  };

  it('1. should enforce Invariant Rule 1: Zero Data Authority Constraint for Sysadmin (ADMIN & IT_ADMIN)', () => {
    const adminCallers: CallerContext[] = [
      { userId: 'usr_admin', role: 'ADMIN', enclaveTokenId: 'tok_1', hasDataAuthority: false },
      { userId: 'usr_it_admin', role: 'IT_ADMIN', enclaveTokenId: 'tok_2', hasDataAuthority: false }
    ];

    for (const caller of adminCallers) {
      for (const classification of ['C0', 'C1', 'C2'] as const) {
        const result = ForsetiEngine.evaluatePolicy(caller, dummyResource(classification), emptyQuorum);
        expect(result.allowed).toBe(false);
        expect(result.invariantTriggered).toBe('INVARIANT_RULE_1_ZERO_DATA_AUTHORITY');
        expect(result.reason).toContain('0% Data Authority');
      }
    }
  });

  it('2. should enforce Invariant Rule 2: C0 Operational files are accessible without Quorum', () => {
    const counselCaller: CallerContext = {
      userId: 'usr_counsel',
      role: 'LEAD_COUNSEL',
      enclaveTokenId: 'tok_3',
      hasDataAuthority: true
    };

    const result = ForsetiEngine.evaluatePolicy(counselCaller, dummyResource('C0'), emptyQuorum);
    expect(result.allowed).toBe(true);
    expect(result.invariantTriggered).toBe('INVARIANT_RULE_2_OPERATIONAL_PUBLIC');
  });

  it('3. should enforce Invariant Rule 3: C1 Confidential records restricted strictly to Counsel & Survivor', () => {
    const counselCaller: CallerContext = {
      userId: 'usr_counsel',
      role: 'LEAD_COUNSEL',
      enclaveTokenId: 'tok_3',
      hasDataAuthority: true
    };

    const guardianCaller: CallerContext = {
      userId: 'usr_guardian',
      role: 'GUARDIAN',
      enclaveTokenId: 'tok_4',
      hasDataAuthority: true
    };

    // Lead Counsel -> Allowed
    const counselRes = ForsetiEngine.evaluatePolicy(counselCaller, dummyResource('C1'), emptyQuorum);
    expect(counselRes.allowed).toBe(true);
    expect(counselRes.invariantTriggered).toBe('INVARIANT_RULE_3_CONFIDENTIAL_LEGAL');

    // Guardian alone on C1 -> Blocked
    const guardianRes = ForsetiEngine.evaluatePolicy(guardianCaller, dummyResource('C1'), emptyQuorum);
    expect(guardianRes.allowed).toBe(false);
    expect(guardianRes.invariantTriggered).toBe('INVARIANT_RULE_3_CONFIDENTIAL_LEGAL');
  });

  it('4. should enforce Invariant Rule 4: C2 Sensitive Evidence requires All-Keyholders Quorum (3-of-3)', () => {
    const counselCaller: CallerContext = {
      userId: 'usr_counsel',
      role: 'LEAD_COUNSEL',
      enclaveTokenId: 'tok_3',
      hasDataAuthority: true
    };

    // 0 Signatures
    const res0 = ForsetiEngine.evaluatePolicy(counselCaller, dummyResource('C2'), emptyQuorum);
    expect(res0.allowed).toBe(false);

    // 2 Signatures (Survivor + Counsel, missing Guardian)
    const quorum2: QuorumState = {
      threshold: 3,
      signedCount: 2,
      requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      activeSignerRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL'],
      isGuardianConflicted: false
    };
    const res2 = ForsetiEngine.evaluatePolicy(counselCaller, dummyResource('C2'), quorum2);
    expect(res2.allowed).toBe(false);
    expect(res2.invariantTriggered).toBe('INVARIANT_RULE_4_ALL_KEYHOLDERS_QUORUM');

    // 3 Signatures (All 3 Keyholders signed)
    const quorum3: QuorumState = {
      threshold: 3,
      signedCount: 3,
      requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      activeSignerRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      isGuardianConflicted: false
    };
    const res3 = ForsetiEngine.evaluatePolicy(counselCaller, dummyResource('C2'), quorum3);
    expect(res3.allowed).toBe(true);
    expect(res3.invariantTriggered).toBe('INVARIANT_RULE_4_ALL_KEYHOLDERS_QUORUM');
  });

  it('5. should enforce Exception Rule 4: Guardian Conflict Exclusion (2-of-2 bypass)', () => {
    const counselCaller: CallerContext = {
      userId: 'usr_counsel',
      role: 'LEAD_COUNSEL',
      enclaveTokenId: 'tok_3',
      hasDataAuthority: true
    };

    const conflictedQuorum2: QuorumState = {
      threshold: 2,
      signedCount: 2,
      requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
      activeSignerRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL'],
      isGuardianConflicted: true // Safeguard activated
    };

    const result = ForsetiEngine.evaluatePolicy(counselCaller, dummyResource('C2'), conflictedQuorum2);
    expect(result.allowed).toBe(true);
    expect(result.invariantTriggered).toBe('INVARIANT_RULE_4_SAFEGUARD_EXCEPTION_QUORUM');
    expect(result.reason).toContain('Exception Rule 4 applied');
  });

  it('6. should verify contract integrity against SHA-512 bytecode manifest', () => {
    const integrity = ForsetiEngine.verifyContractIntegrity();
    expect(integrity.verified).toBe(true);
    expect(integrity.contractId).toBe('SDNY-CASE-2026-CV-4421-SURVIVOR-SHIELD');
    expect(integrity.sha512).toHaveLength(128); // 512 bits = 128 hex chars
  });
});
