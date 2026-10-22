import { describe, it, expect } from 'vitest';
import { RealCryptoEngine } from '../src/lib/cryptoEngine';

describe('RealCryptoEngine (W3C WebCrypto AES-256-GCM)', () => {
  const secretSeed = 'TIDE_EPHEMERAL_KEY_SLOT_SURVIVOR_SOVEREIGNTY_0x71a2';
  const testPlaintext = 'CONFIDENTIAL LITIGATION EVIDENCE: Intimate disclosures under Protective Order #2026-CV-04421.';

  it('1. should encrypt and decrypt text records using native WebCrypto AES-256-GCM', async () => {
    // Encrypt
    const payload = await RealCryptoEngine.encryptRecord(testPlaintext, secretSeed);
    
    expect(payload).toBeDefined();
    expect(payload.cipherHex).toBeDefined();
    expect(payload.cipherHex.length).toBeGreaterThan(0);
    expect(payload.ivHex).toHaveLength(24); // 12 bytes = 24 hex chars
    expect(payload.saltHex).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(payload.tagHex).toBeDefined();

    // Decrypt
    const result = await RealCryptoEngine.decryptRecord(payload, secretSeed);
    expect(result.success).toBe(true);
    expect(result.plaintext).toBe(testPlaintext);
    expect(result.latencyMs).toBeDefined();
    expect(result.latencyMs).toBeLessThan(100); // Fast client-side execution <100ms
  });

  it('2. should encrypt and decrypt binary PDF documents preserving byte integrity', async () => {
    const rawPdfBytes = new TextEncoder().encode('%PDF-1.4 Authentic PDF raw byte stream.');
    const binaryPayload = await RealCryptoEngine.encryptBinary(rawPdfBytes, secretSeed, {
      isPdf: true,
      fileName: 'exhibit_test.pdf',
      classification: 'C2'
    });

    expect(binaryPayload.isPdf).toBe(true);
    expect(binaryPayload.fileName).toBe('exhibit_test.pdf');
    expect(binaryPayload.classification).toBe('C2');

    const result = await RealCryptoEngine.decryptBinary(binaryPayload, secretSeed);
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Uint8Array);
    
    const decodedText = new TextDecoder().decode(result.data!);
    expect(decodedText).toBe('%PDF-1.4 Authentic PDF raw byte stream.');
  });

  it('3. should return cryptographic failure when an invalid key is provided (Zero Data Authority)', async () => {
    const payload = await RealCryptoEngine.encryptRecord(testPlaintext, secretSeed);
    const wrongKey = 'WRONG_ADMIN_KEY_ATTEMPT_0xDEADBEEF';

    const result = await RealCryptoEngine.decryptRecord(payload, wrongKey);
    expect(result.success).toBe(false);
    expect(result.error).toContain('CRYPTOGRAPHIC_FAILURE');
  });

  it('4. should derive correct seeds for all canonical personas', () => {
    const survivorSeed = RealCryptoEngine.getRoleSeed('SURVIVOR_CLIENT');
    const counselSeed = RealCryptoEngine.getRoleSeed('LEAD_COUNSEL');
    const guardianSeed = RealCryptoEngine.getRoleSeed('GUARDIAN');
    const adminSeed = RealCryptoEngine.getRoleSeed('ADMIN');

    expect(survivorSeed).toContain('SURVIVOR');
    expect(counselSeed).toContain('COUNSEL');
    expect(guardianSeed).toContain('GUARDIAN');
    expect(adminSeed).toBeNull(); // Sysadmin has 0% data authority seed!
  });

  it('5. should synthesize 3-of-3 Quorum key for All-Keyholders', () => {
    const signatures3 = [
      { signerId: '1', signerName: 'Jane', signerRole: 'SURVIVOR_CLIENT', signatureHash: '0x1' },
      { signerId: '2', signerName: 'Elena', signerRole: 'LEAD_COUNSEL', signatureHash: '0x2' },
      { signerId: '3', signerName: 'Sarah', signerRole: 'GUARDIAN', signatureHash: '0x3' }
    ];

    const quorumKey = RealCryptoEngine.synthesizeQuorumKey(signatures3, false);
    expect(quorumKey).toBeDefined();
    expect(quorumKey).toContain('ALL_KEYHOLDERS');
    expect(quorumKey).toContain('TIDE_EMERGENT_QUORUM_SEED');
  });

  it('6. should synthesize 2-of-2 Quorum key when Guardian is conflicted (Exception Rule 4)', () => {
    const signatures2 = [
      { signerId: '1', signerName: 'Jane', signerRole: 'SURVIVOR_CLIENT', signatureHash: '0x1' },
      { signerId: '2', signerName: 'Elena', signerRole: 'LEAD_COUNSEL', signatureHash: '0x2' }
    ];

    const conflictedKey = RealCryptoEngine.synthesizeQuorumKey(signatures2, true);
    expect(conflictedKey).toBeDefined();
    expect(conflictedKey).toContain('EXCEPTION_RULE_4');
  });

  it('7. should return null key when insufficient signatures are provided', () => {
    const signatures1 = [
      { signerId: '1', signerName: 'Jane', signerRole: 'SURVIVOR_CLIENT', signatureHash: '0x1' }
    ];

    const incompleteKey = RealCryptoEngine.synthesizeQuorumKey(signatures1, false);
    expect(incompleteKey).toBeNull();
  });
});
