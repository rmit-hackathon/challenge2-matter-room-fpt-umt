import React, { useState } from 'react';
import { UserRole, NavTab, MatterDocument, QuorumRequest, AuditLogEntry } from './types/matter';
import { MOCK_USERS, MOCK_DOCUMENTS, INITIAL_QUORUM_REQUESTS, INITIAL_AUDIT_LOGS } from './data/mockMatterData';
import { TideCloakMatterService, DecryptionResult } from './lib/tidecloak';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuorumApprovalsView } from './components/views/QuorumApprovalsView';
import { EvidenceMatrixView } from './components/views/EvidenceMatrixView';
import { PrivilegeRedactionView } from './components/views/PrivilegeRedactionView';
import { ImmutableAuditTrailView } from './components/views/ImmutableAuditTrailView';
import { LitigationHoldsView } from './components/views/LitigationHoldsView';
import { DocumentViewerModal } from './components/DocumentViewerModal';

export const App: React.FC = () => {
  // Tab 'quorum-approvals' as initial view matches Image 1 directly
  const [currentTab, setCurrentTab] = useState<NavTab>('quorum-approvals');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('LEAD_COUNSEL');
  const [documents] = useState<MatterDocument[]>(MOCK_DOCUMENTS);
  const [quorumRequests, setQuorumRequests] = useState<QuorumRequest[]>(INITIAL_QUORUM_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modal state for viewing decrypted documents or refusal details
  const [selectedDoc, setSelectedDoc] = useState<MatterDocument | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);

  const currentUser = MOCK_USERS[currentUserRole];
  const pendingQuorumCount = quorumRequests.filter(q => q.status === 'PENDING').length;

  // Handler khi click xem tài liệu (Gọi WebCrypto AES-GCM thật)
  const handleOpenDocument = async (doc: MatterDocument) => {
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
        onSelectRole={(role) => setCurrentUserRole(role)}
      />

      {/* Left Sidebar for Virtual Data Room Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingQuorumCount={pendingQuorumCount}
      />

      {/* Main Content Area (pl-72 with room for fixed sidebar and top navbar) */}
      <div className="pl-72 pt-16 min-h-screen bg-surface">
        <main className="p-6 sm:p-8">
          
          {/* Tab 1: Quorum Approvals (Exact Image 1) */}
          {currentTab === 'quorum-approvals' && (
            <QuorumApprovalsView
              quorumRequests={quorumRequests}
              currentUser={currentUser}
              onApproveQuorum={handleApproveQuorum}
            />
          )}

          {/* Tab 2: Evidence Matrix (Clean, focused evidence list) */}
          {currentTab === 'evidence-matrix' && (
            <EvidenceMatrixView
              documents={documents}
              currentUser={currentUser}
              quorumRequests={quorumRequests}
              onOpenDocument={handleOpenDocument}
              onOpenQuorumView={() => setCurrentTab('quorum-approvals')}
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

    </div>
  );
};

export default App;
