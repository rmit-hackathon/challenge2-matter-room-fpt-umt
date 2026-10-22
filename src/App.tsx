import React, { useState, useEffect } from 'react';
import { UserRole, NavTab, MatterDocument, QuorumRequest, AuditLogEntry } from './types/matter';
import { MOCK_USERS, MOCK_DOCUMENTS, INITIAL_QUORUM_REQUESTS, INITIAL_AUDIT_LOGS } from './data/mockMatterData';
import { TideCloakMatterService, DecryptionResult } from './lib/tidecloak';
import { tidecloak } from './lib/tidecloakSdk';
import { RealCryptoEngine } from './lib/cryptoEngine';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuorumApprovalsView } from './components/views/QuorumApprovalsView';
import { EvidenceMatrixView } from './components/views/EvidenceMatrixView';
import { PrivilegeRedactionView } from './components/views/PrivilegeRedactionView';
import { ImmutableAuditTrailView } from './components/views/ImmutableAuditTrailView';
import { LitigationHoldsView } from './components/views/LitigationHoldsView';
import { AdminConsoleView } from './components/views/AdminConsoleView';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { EnclaveInspectorModal } from './components/EnclaveInspectorModal';
import { UploadModal } from './components/UploadModal';
import { AuthenticationModal } from './components/AuthenticationModal';

export const App: React.FC = () => {
  // Tab 'quorum-approvals' as initial view matches Image 1 directly
  const [currentTab, setCurrentTab] = useState<NavTab>('quorum-approvals');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('LEAD_COUNSEL');
  const [documents, setDocuments] = useState<MatterDocument[]>(MOCK_DOCUMENTS);
  const [quorumRequests, setQuorumRequests] = useState<QuorumRequest[]>(INITIAL_QUORUM_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modal state for viewing decrypted documents or refusal details
  const [selectedDoc, setSelectedDoc] = useState<MatterDocument | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);

  // Enclave & Architecture Inspector Modal
  const [isEnclaveInspectorOpen, setIsEnclaveInspectorOpen] = useState(false);

  // Survivor Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 2-Step Stakeholder Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthDoc, setPendingAuthDoc] = useState<MatterDocument | null>(null);

  // Left Sidebar Collapsible State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Khởi tạo mã hóa WebCrypto AES-256-GCM thật cho tất cả tài liệu ban đầu
  useEffect(() => {
    let isMounted = true;
    const initializeEncryptedVault = async () => {
      try {
        const encryptedList = await Promise.all(
          MOCK_DOCUMENTS.map(async (doc) => {
            let seed: string | null = null;
            if (doc.id === 'doc_01') {
              seed = RealCryptoEngine.getRoleSeed('DISCOVERY_PUBLIC');
            } else if (doc.id === 'doc_02') {
              seed = RealCryptoEngine.getRoleSeed('LEAD_COUNSEL');
            } else if (doc.id === 'doc_03') {
              // Yêu cầu chữ ký Quorum 2-of-2 (Jane Doe + Elena Howard)
              seed = RealCryptoEngine.synthesizeQuorumKey([
                { signerRole: 'SURVIVOR_CLIENT', signatureHash: '0x71a2ce89' },
                { signerRole: 'LEAD_COUNSEL', signatureHash: '0x4f8e9a02' }
              ]);
            } else if (doc.id === 'doc_04') {
              seed = RealCryptoEngine.getRoleSeed('SURVIVOR_CLIENT');
            }

            if (seed) {
              const payload = await RealCryptoEngine.encryptRecord(doc.decryptedContent, seed);
              return { ...doc, encryptedPayload: payload };
            }
            return doc;
          })
        );
        if (isMounted) {
          setDocuments(encryptedList);
        }
      } catch (err) {
        console.warn('WebCrypto auto-encryption fallback:', err);
      }
    };
    initializeEncryptedVault();
    return () => { isMounted = false; };
  }, []);

  const currentUser = MOCK_USERS[currentUserRole];
  const pendingQuorumCount = quorumRequests.filter(q => q.status === 'PENDING').length;

  const handleSelectRole = (role: UserRole) => {
    setCurrentUserRole(role);
    tidecloak.setRole(role, MOCK_USERS[role].id);

    // If switching to Admin persona, automatically switch to Admin Console view
    if (role === 'ADMIN') {
      setCurrentTab('admin-console');
    } else if (currentTab === 'admin-console') {
      setCurrentTab('evidence-matrix');
    }
  };

  // Perform actual decryption via TideCloak SDK & Forseti Enclave
  const doActualDecrypt = async (doc: MatterDocument) => {
    setSelectedDoc(doc);
    const result = await TideCloakMatterService.attemptDecryptAsync(currentUser, doc, quorumRequests);
    setDecryptionResult(result);

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: result.success ? 'DECRYPT_SUCCESS' : 'DECRYPT_DENIED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: result.success ? 'SUCCESS' : 'BLOCKED_BY_TIDE',
      details: `${doc.title} -> ${result.success ? `Session key synthesized via device enclave (${result.algorithm || 'AES-GCM'}). Latency: ${result.latencyMs || 12}ms.` : result.errorMessage}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler khi click xem tài liệu
  const handleOpenDocument = async (doc: MatterDocument) => {
    // Admin clicks decrypt -> immediate cryptographic refusal (Negative test)
    if (currentUser.role === 'ADMIN') {
      await doActualDecrypt(doc);
      return;
    }

    // Stakeholders requesting sensitive Level 3 or Level 4 docs must authenticate (Biometric + Scope agreement)
    const isRestrictedLevel = doc.securityLevel === 'LEVEL_3_HIGHLY_SENSITIVE' || doc.securityLevel === 'LEVEL_4_CRITICAL';
    const isStakeholder = currentUser.role === 'FORENSIC_EXPERT' || currentUser.role === 'OPPOSING_COUNSEL';

    if (isRestrictedLevel && isStakeholder) {
      setPendingAuthDoc(doc);
      setIsAuthModalOpen(true);
      return;
    }

    // Otherwise, decrypt directly
    await doActualDecrypt(doc);
  };

  // Handler khi hoàn tất xác thực 2 bước
  const handleAuthenticationComplete = async () => {
    if (pendingAuthDoc) {
      const doc = pendingAuthDoc;
      setPendingAuthDoc(null);
      await doActualDecrypt(doc);
    }
  };

  // Handler khi nạn nhân upload và mã hóa tài liệu mới
  const handleUploadSuccess = (newDoc: MatterDocument) => {
    setDocuments(prev => [newDoc, ...prev]);

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'SURVIVOR_EVIDENCE_SEALED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: 'SUCCESS',
      details: `Sovereign Plaintiff uploaded & enclave-sealed '${newDoc.title}' (${newDoc.securityLevel}). Client-side AES-256-GCM cipher payload stored.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler khi Lead Counsel ký duyệt Quorum
  const handleApproveQuorum = (requestId: string) => {
    setQuorumRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedApprovals = [
          ...req.approvals,
          {
            signerId: currentUser.id,
            signerName: currentUser.name,
            signerRole: currentUser.role,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            signatureHash: '0x4f8e9a02'
          }
        ];
        return {
          ...req,
          approvals: updatedApprovals,
          status: updatedApprovals.length >= req.threshold ? 'APPROVED' : 'PENDING'
        };
      }
      return req;
    }));

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'QUORUM_SIGNED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: 'SUCCESS',
      details: `Counsel Elena Howard ký duyệt Quorum (2/2). TSS Key Seed đã tổng hợp trong enclave cho Dr. Miriam Vance.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogTamper = (action: string, status: 'BLOCKED_BY_TIDE', details: string) => {
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={MOCK_USERS}
        onSelectRole={handleSelectRole}
        onOpenEnclaveInspector={() => setIsEnclaveInspectorOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Left Sidebar for Virtual Data Room Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingQuorumCount={pendingQuorumCount}
        currentUser={currentUser}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content Area (Responsive padding for collapsible sidebar) */}
      <div className={`${isSidebarCollapsed ? 'pl-20' : 'pl-72'} pt-16 min-h-screen bg-slate-50/60 transition-all duration-300 ease-in-out`}>
        <main className="p-6 sm:p-8">
          
          {/* Admin Console View (Dedicated view when Admin persona is active or on admin-console tab) */}
          {currentTab === 'admin-console' && (
            <AdminConsoleView
              currentUser={currentUser}
              documents={documents}
              onLogAudit={handleLogTamper}
              onAttemptDecrypt={handleOpenDocument}
            />
          )}

          {/* Tab 1: Quorum Approvals (Exact Image 1) */}
          {currentTab === 'quorum-approvals' && (
            <QuorumApprovalsView
              quorumRequests={quorumRequests}
              currentUser={currentUser}
              onApproveQuorum={handleApproveQuorum}
            />
          )}

          {/* Tab 2: Evidence Matrix (4 Security Levels + Survivor Upload) */}
          {currentTab === 'evidence-matrix' && (
            <EvidenceMatrixView
              documents={documents}
              currentUser={currentUser}
              quorumRequests={quorumRequests}
              onOpenDocument={handleOpenDocument}
              onOpenQuorumView={() => setCurrentTab('quorum-approvals')}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />
          )}

          {/* Tab 3: Privilege & Redaction (Zero Data Authority & Sysadmin Firewall) */}
          {currentTab === 'privilege-and-redaction' && (
            <PrivilegeRedactionView
              currentUser={currentUser}
              onLogAudit={handleLogTamper}
            />
          )}

          {/* Tab 4: Immutable Audit Trail (Merkle Consensus & Ledger) */}
          {currentTab === 'immutable-audit-trail' && (
            <ImmutableAuditTrailView
              auditLogs={auditLogs}
              documents={documents}
            />
          )}

          {/* Tab 5: Litigation Holds (Court Orders & Decrypted Forensic Exhibit) */}
          {currentTab === 'litigation-holds' && (
            <LitigationHoldsView />
          )}

        </main>
      </div>

      {/* Viewer Modal for Documents & Decryption Refusal Inspection */}
      <DocumentViewerModal
        document={selectedDoc}
        currentUser={currentUser}
        result={decryptionResult}
        onClose={() => setSelectedDoc(null)}
        onRequestQuorum={() => {
          setSelectedDoc(null);
          setCurrentTab('quorum-approvals');
        }}
      />

      {/* Architecture & Hardware Enclave Inspector Modal */}
      <EnclaveInspectorModal
        isOpen={isEnclaveInspectorOpen}
        onClose={() => setIsEnclaveInspectorOpen(false)}
      />

      {/* Survivor Upload & Seal Evidence Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Stakeholder 2-Step Authentication Modal */}
      <AuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAuthDoc(null);
        }}
        document={pendingAuthDoc}
        currentUser={currentUser}
        onAuthenticationComplete={handleAuthenticationComplete}
      />

    </div>
  );
};

export default App;
