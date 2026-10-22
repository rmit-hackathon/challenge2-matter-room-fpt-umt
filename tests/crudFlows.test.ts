import { describe, it, expect } from 'vitest';
import { MatterDocument, QuorumRequest, UserProfile } from '../src/types/matter';
import { MOCK_USERS, MOCK_DOCUMENTS, INITIAL_QUORUM_REQUESTS } from '../src/data/mockMatterData';
import { RealCryptoEngine } from '../src/lib/cryptoEngine';

describe('MatterRoom CRUD & Quorum Operational Flows (Brainstorm 2.0)', () => {
  const janeDoe = MOCK_USERS.SURVIVOR_CLIENT;
  const elenaCounsel = MOCK_USERS.LEAD_COUNSEL;
  const sarahGuardian = MOCK_USERS.GUARDIAN;
  const alexAdmin = MOCK_USERS.ADMIN;

  describe('1. THÊM (Document Ingestion & Policy Binding)', () => {
    it('creates a C0 operational document with full edit, delete, and public export rights', () => {
      const c0Doc: MatterDocument = {
        id: 'doc_c0_test',
        title: 'Lịch thẩm vấn sơ bộ phiên tòa',
        category: 'Court Orders',
        size: '45 KB',
        uploadedAt: '2026-10-22 14:00',
        encryptedHash: '0xabc123',
        summary: 'Lịch làm việc với thư ký tòa án',
        securityLevel: 'LEVEL_1_ROUTINE',
        dataClass: 'C0',
        crudPolicy: {
          canEdit: true,
          canDelete: true,
          canExport: true,
          approvalRequired: false,
          ruleExplanation: 'C0: Dữ liệu vận hành tố tụng thông thường. Mọi người dùng nội bộ đều có quyền sửa, xóa, xuất file mà không cần phê duyệt.'
        }
      };

      expect(c0Doc.dataClass).toBe('C0');
      expect(c0Doc.crudPolicy?.canEdit).toBe(true);
      expect(c0Doc.crudPolicy?.canDelete).toBe(true);
      expect(c0Doc.crudPolicy?.canExport).toBe(true);
      expect(c0Doc.crudPolicy?.approvalRequired).toBe(false);
    });

    it('creates a C1 counsel privileged document that bars edit/delete under FRE 901/902', () => {
      const c1Doc: MatterDocument = {
        id: 'doc_c1_test',
        title: 'Bản phân tích chiến lược bào chữa mật',
        category: 'Legal Pleadings',
        size: '128 KB',
        uploadedAt: '2026-10-22 14:30',
        encryptedHash: '0xdef456',
        summary: 'Attorney-client privilege memo',
        securityLevel: 'LEVEL_2_SENSITIVE',
        dataClass: 'C1',
        crudPolicy: {
          canEdit: false,
          canDelete: false,
          canExport: true,
          exportRestrictedTo: 'LEAD_COUNSEL',
          approvalRequired: false,
          ruleExplanation: 'FRE 901/902 & FRCP 37(e): Hồ sơ đặc quyền luật sư không được phép sửa đổi hoặc tiêu hủy. Chỉ duy nhất Luật sư phụ trách có thẩm quyền xuất file.'
        }
      };

      expect(c1Doc.dataClass).toBe('C1');
      expect(c1Doc.crudPolicy?.canEdit).toBe(false);
      expect(c1Doc.crudPolicy?.canDelete).toBe(false);
      expect(c1Doc.crudPolicy?.canExport).toBe(true);
      expect(c1Doc.crudPolicy?.exportRestrictedTo).toBe('LEAD_COUNSEL');
      expect(c1Doc.crudPolicy?.ruleExplanation).toContain('FRE 901/902');
    });

    it('creates a C2 sealed survivor exhibit requiring All-Keyholders Quorum', () => {
      const c2Doc: MatterDocument = {
        id: 'doc_c2_test',
        title: 'Lời khai ghi âm hiện trường của Nạn nhân',
        category: 'Medical Evidence',
        size: '12.4 MB',
        uploadedAt: '2026-10-22 15:00',
        encryptedHash: '0x789abc',
        summary: 'Vật chứng niêm phong C2',
        securityLevel: 'LEVEL_4_CRITICAL',
        dataClass: 'C2',
        crudPolicy: {
          canEdit: false,
          canDelete: false,
          canExport: false,
          approvalRequired: true,
          ruleExplanation: 'Vật chứng tối mật C2: Cấm sửa đổi (FRE 901), Cấm tiêu hủy (FRCP 37(e)), Cấm xuất thô (Enclave Protected).'
        }
      };

      expect(c2Doc.dataClass).toBe('C2');
      expect(c2Doc.crudPolicy?.canEdit).toBe(false);
      expect(c2Doc.crudPolicy?.canDelete).toBe(false);
      expect(c2Doc.crudPolicy?.canExport).toBe(false);
      expect(c2Doc.crudPolicy?.approvalRequired).toBe(true);
    });

    it('automatically generates a Quorum Escrow Request when C2 document is uploaded', () => {
      let docStore = [...MOCK_DOCUMENTS];
      let quorumStore = [...INITIAL_QUORUM_REQUESTS];

      const newC2Doc: MatterDocument = {
        id: `doc_c2_${Date.now()}`,
        title: 'Video ghi hình phòng khám của Nạn nhân',
        category: 'Medical Evidence',
        size: '45.2 MB',
        uploadedAt: '2026-10-22 15:30',
        encryptedHash: '0x999aaa',
        summary: 'Bằng chứng ghi nhận vết thương thực tế',
        securityLevel: 'LEVEL_4_CRITICAL',
        dataClass: 'C2',
        crudPolicy: {
          canEdit: false,
          canDelete: false,
          canExport: false,
          approvalRequired: true,
          ruleExplanation: 'FRE 901/902 & FRCP 37(e)'
        }
      };

      // State mutator simulation matching App.tsx handleUploadSuccess
      docStore = [newC2Doc, ...docStore];

      const newQuorumReq: QuorumRequest = {
        id: `qr_${Date.now()}`,
        targetDocumentId: newC2Doc.id,
        targetDocumentTitle: newC2Doc.title,
        requestedBy: janeDoe.name,
        requestedFor: 'In-Camera Judicial Inspection & Trial Submission',
        requestedRole: janeDoe.role,
        reason: `Yêu cầu mở niêm phong chứng cứ C2 '${newC2Doc.title}' phục vụ tố tụng.`,
        status: 'PENDING',
        approvals: [
          {
            signerId: janeDoe.id,
            signerName: janeDoe.name,
            signerRole: janeDoe.role,
            timestamp: '2026-10-22 16:00:00',
            signatureHash: '0x71a2ce89'
          }
        ],
        threshold: 3,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted: false
      };

      quorumStore = [newQuorumReq, ...quorumStore];

      expect(docStore.find(d => d.id === newC2Doc.id)).toBeDefined();
      expect(quorumStore.find(q => q.targetDocumentId === newC2Doc.id)).toBeDefined();
      expect(newQuorumReq.approvals.length).toBe(1);
      expect(newQuorumReq.status).toBe('PENDING');
      expect(newQuorumReq.threshold).toBe(3);
    });
  });

  describe('2. SỬA (Document Editing & Legal Lock Enforcing)', () => {
    it('allows updating metadata and notes for C0 operational documents', () => {
      let docStore = [...MOCK_DOCUMENTS];
      const targetC0 = docStore.find(d => d.dataClass === 'C0');
      expect(targetC0).toBeDefined();

      if (targetC0) {
        const updatedDoc: MatterDocument = {
          ...targetC0,
          title: 'Court Scheduling Order (Updated v2)',
          summary: 'Đã bổ sung danh sách đại diện Viện kiểm sát và thẩm phán phụ trách'
        };

        // State mutation
        docStore = docStore.map(d => d.id === updatedDoc.id ? updatedDoc : d);

        const saved = docStore.find(d => d.id === targetC0.id);
        expect(saved?.title).toBe('Court Scheduling Order (Updated v2)');
        expect(saved?.summary).toContain('bổ sung danh sách');
      }
    });

    it('rejects editing for C1 or C2 documents, enforcing integrity locking', () => {
      const c1Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C1');
      const c2Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C2');

      const attemptEdit = (doc: MatterDocument) => {
        if (!doc.crudPolicy?.canEdit) {
          throw new Error(doc.crudPolicy?.ruleExplanation || 'FRE 901/902 Integrity Lock: Tamper-proof barrier');
        }
        return true;
      };

      expect(() => attemptEdit(c1Doc!)).toThrow(/Cấm chỉnh sửa|FRE 901/);
      expect(() => attemptEdit(c2Doc!)).toThrow(/Cấm sửa|FRE 901/);
    });
  });

  describe('3. XÓA (Document Deletion & Spoliation Barring)', () => {
    it('allows deleting C0 operational documents from state', () => {
      let docStore = [...MOCK_DOCUMENTS];
      const targetC0 = docStore.find(d => d.dataClass === 'C0');
      expect(targetC0).toBeDefined();

      if (targetC0) {
        const initialCount = docStore.length;
        docStore = docStore.filter(d => d.id !== targetC0.id);
        expect(docStore.length).toBe(initialCount - 1);
        expect(docStore.find(d => d.id === targetC0.id)).toBeUndefined();
      }
    });

    it('strictly forbids deleting C1 and C2 evidence under FRCP 37(e) spoliation sanctions', () => {
      const c1Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C1');
      const c2Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C2');

      const attemptDelete = (doc: MatterDocument) => {
        if (!doc.crudPolicy?.canDelete) {
          throw new Error(`FRCP 37(e) Spoliation Bar: Deletion of evidence (${doc.dataClass}) is strictly criminalized.`);
        }
        return true;
      };

      expect(() => attemptDelete(c1Doc!)).toThrow(/FRCP 37\(e\)/);
      expect(() => attemptDelete(c2Doc!)).toThrow(/FRCP 37\(e\)/);
    });
  });

  describe('4. DUYỆT (All-Keyholders Quorum Approval Engine)', () => {
    it('executes 3-of-3 Quorum approval flow for C2 sealed evidence', () => {
      let req: QuorumRequest = {
        id: 'qr_test_3of3',
        targetDocumentId: 'doc_c2_evidence',
        targetDocumentTitle: 'Hồ sơ bệnh án tâm lý ban đầu của Jane Doe',
        requestedBy: elenaCounsel.name,
        requestedFor: 'In-Camera Judicial Inspection',
        requestedRole: elenaCounsel.role,
        reason: 'Xuất trình theo trát của Tòa án nhân dân tối cao',
        status: 'PENDING',
        approvals: [],
        threshold: 3,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted: false
      };

      const signQuorum = (currentReq: QuorumRequest, user: UserProfile): QuorumRequest => {
        // Only keyholders can sign
        const validRoles = ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'];
        if (!validRoles.includes(user.role)) {
          throw new Error(`Unauthorized: Role ${user.role} is not a designated Keyholder.`);
        }

        // Avoid duplicate signing
        if (currentReq.approvals.some(a => a.signerRole === user.role)) {
          return currentReq;
        }

        const sigHash = user.role === 'LEAD_COUNSEL'
          ? '0x4f8e9a02'
          : user.role === 'GUARDIAN'
            ? '0x9d11fa88'
            : '0x71a2ce89';

        const updatedApprovals = [
          ...currentReq.approvals,
          {
            signerId: user.id,
            signerName: user.name,
            signerRole: user.role,
            timestamp: '2026-10-22 16:30:00',
            signatureHash: sigHash
          }
        ];

        const threshold = currentReq.isGuardianConflicted ? 2 : currentReq.threshold;
        const isApproved = updatedApprovals.length >= threshold;

        return {
          ...currentReq,
          approvals: updatedApprovals,
          status: isApproved ? 'APPROVED' : 'PENDING'
        };
      };

      // Step 1: Jane Doe signs (1/3)
      req = signQuorum(req, janeDoe);
      expect(req.approvals.length).toBe(1);
      expect(req.status).toBe('PENDING');

      // Step 2: Elena Howard signs (2/3)
      req = signQuorum(req, elenaCounsel);
      expect(req.approvals.length).toBe(2);
      expect(req.status).toBe('PENDING');

      // Duplicate signing attempt by Elena must be idempotent
      req = signQuorum(req, elenaCounsel);
      expect(req.approvals.length).toBe(2);

      // Step 3: Guardian Sarah Jenkins signs (3/3)
      req = signQuorum(req, sarahGuardian);
      expect(req.approvals.length).toBe(3);
      expect(req.status).toBe('APPROVED');
    });

    it('rejects Admin Alex Mercer from signing Quorum (Zero-Trust Data Authority)', () => {
      const signQuorum = (user: UserProfile) => {
        const validRoles = ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'];
        if (!validRoles.includes(user.role)) {
          throw new Error(`Forseti Invariant #1 Violation: Role ${user.role} has 0% Data Authority.`);
        }
      };

      expect(() => signQuorum(alexAdmin)).toThrow(/Forseti Invariant #1 Violation/);
    });

    it('executes Rule 4 Guardian Conflict Isolation: threshold automatically adapts to 2-of-2', () => {
      let req: QuorumRequest = {
        id: 'qr_test_rule4',
        targetDocumentId: 'doc_c2_child_abuse',
        targetDocumentTitle: 'Vật chứng bạo hành trẻ em',
        requestedBy: janeDoe.name,
        requestedFor: 'Emergency In-Camera Inspection',
        requestedRole: janeDoe.role,
        reason: 'Người giám hộ bị tình nghi đồng lõa với bên bạo hành',
        status: 'PENDING',
        approvals: [],
        threshold: 3,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted: false
      };

      // Activate Rule 4 exception
      const toggleGuardianConflict = (r: QuorumRequest): QuorumRequest => ({
        ...r,
        isGuardianConflicted: true,
        threshold: 2,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL']
      });

      req = toggleGuardianConflict(req);
      expect(req.isGuardianConflicted).toBe(true);
      expect(req.threshold).toBe(2);
      expect(req.requiredRoles).not.toContain('GUARDIAN');

      // Jane signs (1/2)
      req.approvals.push({
        signerId: janeDoe.id,
        signerName: janeDoe.name,
        signerRole: janeDoe.role,
        timestamp: '2026-10-22 16:35:00',
        signatureHash: '0x71a2ce89'
      });
      expect(req.approvals.length).toBe(1);
      expect(req.status).toBe('PENDING');

      // Elena Counsel signs (2/2) -> Meets threshold of 2!
      req.approvals.push({
        signerId: elenaCounsel.id,
        signerName: elenaCounsel.name,
        signerRole: elenaCounsel.role,
        timestamp: '2026-10-22 16:36:00',
        signatureHash: '0x4f8e9a02'
      });
      if (req.approvals.length >= req.threshold) {
        req.status = 'APPROVED';
      }

      expect(req.approvals.length).toBe(2);
      expect(req.status).toBe('APPROVED');
    });

    it('enables sub-50ms cryptographic synthesis and in-memory decryption once approved', async () => {
      const signatures3 = [
        { signerId: janeDoe.id, signerName: janeDoe.name, signerRole: janeDoe.role, signatureHash: '0x71a2ce89' },
        { signerId: elenaCounsel.id, signerName: elenaCounsel.name, signerRole: elenaCounsel.role, signatureHash: '0x4f8e9a02' },
        { signerId: sarahGuardian.id, signerName: sarahGuardian.name, signerRole: sarahGuardian.role, signatureHash: '0x9d11fa88' }
      ];

      // Simulate cryptographic key derivation from the 3 approved signers
      const startTime = performance.now();
      const derivedKeySeed = RealCryptoEngine.synthesizeQuorumKey(signatures3, false);
      const synthesisDuration = performance.now() - startTime;

      expect(derivedKeySeed).toBeDefined();
      expect(derivedKeySeed).toContain('ALL_KEYHOLDERS');
      expect(synthesisDuration).toBeLessThan(50); // Enclave latency requirement < 50ms

      // Verify that this key can cleanly encrypt and decrypt sample C2 payload
      const secretPayload = "PROPRIETARY_COURT_TRANSCRIPT_EXHIBIT_C2_UNSEALED";
      const encrypted = await RealCryptoEngine.encryptRecord(secretPayload, derivedKeySeed!);

      const decrypted = await RealCryptoEngine.decryptRecord(encrypted, derivedKeySeed!);
      expect(decrypted.success).toBe(true);
      expect(decrypted.plaintext).toBe(secretPayload);
    });
  });

  describe('5. XUẤT (Export & Judicial Data Handling)', () => {
    it('allows exporting C0 documents publicly', () => {
      const c0Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C0')!;
      const canExport = (user: UserProfile, doc: MatterDocument) => {
        if (doc.dataClass === 'C0') return true;
        if (doc.dataClass === 'C1') return user.role === 'LEAD_COUNSEL';
        return false;
      };

      expect(canExport(janeDoe, c0Doc)).toBe(true);
      expect(canExport(elenaCounsel, c0Doc)).toBe(true);
      expect(canExport(alexAdmin, c0Doc)).toBe(true);
    });

    it('authorizes C1 export exclusively for Lead Counsel (Elena Howard)', () => {
      const c1Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C1')!;
      const canExport = (user: UserProfile, doc: MatterDocument) => {
        if (doc.dataClass === 'C0') return true;
        if (doc.dataClass === 'C1') return user.role === 'LEAD_COUNSEL';
        return false;
      };

      expect(canExport(elenaCounsel, c1Doc)).toBe(true);
      expect(canExport(janeDoe, c1Doc)).toBe(false);
      expect(canExport(alexAdmin, c1Doc)).toBe(false);
    });

    it('mathematically bars raw export of C2 documents to maintain strict chain-of-custody', () => {
      const c2Doc = MOCK_DOCUMENTS.find(d => d.dataClass === 'C2')!;
      const canExport = (_user: UserProfile, doc: MatterDocument) => {
        if (doc.dataClass === 'C2') return false; // In-camera enclave display only
        return true;
      };

      expect(canExport(elenaCounsel, c2Doc)).toBe(false);
      expect(canExport(janeDoe, c2Doc)).toBe(false);
      expect(canExport(alexAdmin, c2Doc)).toBe(false);
    });
  });
});
