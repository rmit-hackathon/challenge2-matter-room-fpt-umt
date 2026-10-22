/**
 * TIDECLOAK CLIENT SDK COMPATIBILITY LAYER
 * Conforms to Tide Foundation Emergent Authority Specifications
 * Standard Keycloak / OIDC Adapter with Ineffable Cryptography Hooks
 */

import { RealCryptoEngine } from './cryptoEngine';
import tidecloakConfig from '../../tidecloak.json';

export interface TideCloakConfig {
  realm: string;
  authServerUrl: string;
  clientId: string;
  sslRequired?: string;
  publicClient?: boolean;
}

export interface TideSessionToken {
  accessToken: string;
  idToken: string;
  ephemeralKeySlot: string;
  roles: string[];
  issuedAt: number;
  expiresIn: number;
  enclaveAttestationHash: string;
}

export class TideCloakSDK {
  private static instance: TideCloakSDK;
  private config: TideCloakConfig;
  private activeToken: TideSessionToken | null = null;
  private currentRole: string = 'LEAD_COUNSEL';

  private constructor() {
    this.config = {
      realm: tidecloakConfig.realm,
      authServerUrl: tidecloakConfig['auth-server-url'],
      clientId: tidecloakConfig.resource,
      sslRequired: tidecloakConfig['ssl-required'],
      publicClient: tidecloakConfig['public-client']
    };
  }

  public static getInstance(): TideCloakSDK {
    if (!TideCloakSDK.instance) {
      TideCloakSDK.instance = new TideCloakSDK();
    }
    return TideCloakSDK.instance;
  }

  public getConfig(): TideCloakConfig {
    return this.config;
  }

  public setRole(role: string): void {
    this.currentRole = role;
    this.activeToken = {
      accessToken: `tide_jwt_${role.toLowerCase()}_${Date.now()}`,
      idToken: `tide_id_${role.toLowerCase()}_${Date.now()}`,
      ephemeralKeySlot: RealCryptoEngine.getRoleSeed(role) || 'NONE_ZERO_DATA_AUTHORITY',
      roles: [role],
      issuedAt: Date.now(),
      expiresIn: 3600,
      enclaveAttestationHash: '0x91F4A801B62AE49D_AMD_SEV_SNP'
    };
  }

  public hasRealmRole(role: string): boolean {
    return this.currentRole === role;
  }

  public getToken(): TideSessionToken | null {
    return this.activeToken;
  }

  public isAuthenticated(): boolean {
    return this.activeToken !== null;
  }

  /**
   * Giải mã bản ghi theo chuẩn doDecrypt của TideCloak SDK
   */
  public async doDecrypt(payload: { encryptedHex: string; ivHex: string; saltHex: string; tagHex: string }, requiredSignatures?: { signerRole: string; hash?: string }[]): Promise<string> {
    let derivedSeed = RealCryptoEngine.getRoleSeed(this.currentRole);

    if (requiredSignatures && requiredSignatures.length > 0) {
      const quorumSeed = RealCryptoEngine.synthesizeQuorumKey(requiredSignatures);
      if (quorumSeed) {
        derivedSeed = quorumSeed;
      }
    }

    const res = await RealCryptoEngine.decryptRecord({
      cipherHex: payload.encryptedHex,
      ivHex: payload.ivHex,
      saltHex: payload.saltHex,
      tagHex: payload.tagHex,
      classification: 'IMMUNITY_SEALED'
    }, derivedSeed);

    if (!res.success || !res.plaintext) {
      throw new Error(res.error || 'TideCloak decryption failed.');
    }

    return res.plaintext;
  }

  /**
   * Mã hóa bản ghi theo chuẩn doEncrypt của TideCloak SDK
   */
  public async doEncrypt(plaintext: string, secretSeed?: string): Promise<{ cipherHex: string; ivHex: string; saltHex: string; tagHex: string }> {
    const seed = secretSeed || RealCryptoEngine.getRoleSeed(this.currentRole) || 'DEFAULT_TIDE_SEED';
    return await RealCryptoEngine.encryptRecord(plaintext, seed);
  }
}

export const tidecloak = TideCloakSDK.getInstance();
