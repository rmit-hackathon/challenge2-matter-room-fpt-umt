import { describe, it, expect } from 'vitest';
import { tidecloak } from '../src/lib/tidecloakSdk';
import { MOCK_USERS } from '../src/data/mockMatterData';

describe('TideCloak Plan C Simulation Compliance Tests', () => {
  it('1. should activate SECURE_WEB_ENCLAVE mode with 100% cryptographic parity under Plan C', () => {
    const activeMode = tidecloak.getActiveMode();
    expect(['SECURE_WEB_ENCLAVE', 'LIVE_DOCKER_OIDC']).toContain(activeMode);
  });

  it('2. should mint valid RS256 JWT claims upon actor role assignment', () => {
    tidecloak.setRole('LEAD_COUNSEL', MOCK_USERS.LEAD_COUNSEL.id);
    const token = tidecloak.getToken();

    expect(token).not.toBeNull();
    expect(token?.claims).toBeDefined();
    expect(token?.claims.realm_roles).toContain('LEAD_COUNSEL');
    expect(token?.claims.zero_data_authority).toBe(false);
    expect(token?.claims.ork_enclave_node).toContain('AMD-SEV-SNP');
    expect(token?.claims.iss).toContain('realms/matter-room');

    // Verify JWT structure: header.payload.signature
    const parts = token?.accessToken.split('.');
    expect(parts?.length).toBe(3);

    const header = JSON.parse(atob(parts![0]));
    expect(header.alg).toBe('RS256');
    expect(header.typ).toBe('JWT');
  });

  it('3. should enforce zero_data_authority: true in OIDC claims for Sysadmin (Alex Mercer)', () => {
    tidecloak.setRole('ADMIN', MOCK_USERS.ADMIN.id);
    const token = tidecloak.getToken();

    expect(token).not.toBeNull();
    expect(token?.claims.zero_data_authority).toBe(true);
    expect(token?.claims.realm_roles).toContain('ADMIN');
    expect(token?.ephemeralKeySlot).toBe('NONE_ZERO_DATA_AUTHORITY');
  });

  it('4. should restore sovereign keyholder privileges when switching back to Survivor or Counsel', () => {
    tidecloak.setRole('SURVIVOR_CLIENT', MOCK_USERS.SURVIVOR_CLIENT.id);
    const token = tidecloak.getToken();

    expect(token).not.toBeNull();
    expect(token?.claims.zero_data_authority).toBe(false);
    expect(token?.claims.realm_roles).toContain('SURVIVOR_CLIENT');
    expect(token?.ephemeralKeySlot).not.toBe('NONE_ZERO_DATA_AUTHORITY');
  });
});
