import React, { useState } from 'react';
import { UserRole, UserProfile, NavTab, MatterDocument, QuorumRequest, AuditLogEntry } from './types/matter';
import { MOCK_USERS, MOCK_DOCUMENTS, INITIAL_QUORUM_REQUESTS, INITIAL_AUDIT_LOGS } from './data/mockMatterData';
import { TideCloakMatterService, DecryptionResult } from './lib/tidecloak';
import { tidecloak } from './lib/tidecloakSdk';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QuorumApprovalsView } from './components/views/QuorumApprovalsView';
import { EvidenceMatrixView } from './components/views/EvidenceMatrixView';
import { AdminConsoleView } from './components/views/AdminConsoleView';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { EnclaveInspectorModal } from './components/EnclaveInspectorModal';
import { UploadModal } from './components/UploadModal';
import { AuthenticationModal } from './components/AuthenticationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ExceptionSimulatorModal } from './components/ExceptionSimulatorModal';

export const App: React.FC = () => {
  // Tab 'evidence-matrix' or 'quorum-approvals'
  const [currentTab, setCurrentTab] = useState<NavTab>('evidence-matrix');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('LEAD_COUNSEL');
  const [documents, setDocuments] = useState<MatterDocument[]>(MOCK_DOCUMENTS);
  const [quorumRequests, setQuorumRequests] = useState<QuorumRequest[]>(INITIAL_QUORUM_REQUESTS);
  const [selectedQuorumReqId, setSelectedQuorumReqId] = useState<string>('qr_001');
  const [, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modal state for viewing decrypted documents or refusal details
  const [selectedDoc, setSelectedDoc] = useState<MatterDocument | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);

  // Enclave & Architecture Inspector Modal
  const [isEnclaveInspectorOpen, setIsEnclaveInspectorOpen] = useState(false);

  // User Profile & Cryptographic Settings Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Survivor Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Exception Simulator Modal State (Table 5 Safeguards)
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [isGuardianConflicted, setIsGuardianConflicted] = useState(false);
  const [isVictimUnreachable, setIsVictimUnreachable] = useState(false);
  const [isSystemOutage, setIsSystemOutage] = useState(false);

  // 2-Step Stakeholder Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthDoc, setPendingAuthDoc] = useState<MatterDocument | null>(null);

  // Left Sidebar Collapsible State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // TideCloak Plan C Session Minting Toast State
  const [tideToast, setTideToast] = useState<{ message: string; subtext?: string; isZeroAuth?: boolean } | null>(null);

  // Dynamic user profiles state (supports in-modal editing like Facebook profile edit)
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(MOCK_USERS);
  const currentUser = userProfiles[currentUserRole] || userProfiles.LEAD_COUNSEL;
  const pendingQuorumCount = quorumRequests.filter(q => q.status === 'PENDING').length;

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUserProfiles(prev => ({
      ...prev,
      [updatedUser.role]: updatedUser
    }));
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentUserRole(role);
    if (userProfiles[role]) {
      tidecloak.setRole(role, userProfiles[role].id);
    }

    const targetUser = userProfiles[role];
    const isZeroAuth = role === 'ADMIN' || (role as string) === 'IT_ADMIN';
    setTideToast({
      message: `${targetUser ? targetUser.name : role} authenticated`,
      subtext: isZeroAuth 
        ? 'Claim: zero_data_authority = true (0% Data Authority)' 
        : 'Claim: Sovereign Keyholder slot active',
      isZeroAuth
    });

    // If switching to Admin persona, automatically switch to Admin Console view
    if (role === 'ADMIN' || (role as string) === 'IT_ADMIN') {
      setCurrentTab('admin-console');
    } else if (currentTab === 'admin-console') {
      setCurrentTab('evidence-matrix');
    }
  };

  // Perform actual decryption via TideCloak SDK & Forseti Enclave
  const doActualDecrypt = async (doc: MatterDocument) => {
    setSelectedDoc(doc);

    // Kịch bản ngoại lệ 8: Hệ thống sập / Mất mạng -> Mặc định từ chối giải mã (Fail-Closed)
    if (isSystemOutage) {
      const res: DecryptionResult = {
        success: false,
        errorCode: 'WEBCRYPTO_OPERATION_ERROR',
        errorMessage: 'SYSTEM OUTAGE ENFORCEMENT: Enclave is in offline mode. Decryption mathematically denied under Fail-Closed policy.',
        technicalDetails: '[EXCEPTION_RULE_8_FAIL_CLOSED] Table 5 System Outage safeguard active: Plaintext access denied to prevent exposure during infrastructure failure.'
      };
      setDecryptionResult(res);
      return;
    }

    // Kịch bản ngoại lệ 3: Nạn nhân mất liên lạc -> Im lặng không phải là đồng thuận
    if (isVictimUnreachable && (doc.dataClass === 'C2' || doc.securityLevel === 'LEVEL_3_HIGHLY_SENSITIVE' || doc.securityLevel === 'LEVEL_4_CRITICAL')) {
      const res: DecryptionResult = {
        success: false,
        errorCode: 'QUORUM_REQUIRED',
        errorMessage: 'VICTIM UNREACHABLE SAFEGUARD: Silence is NOT consent. Decryption blocked to protect survivor confidentiality.',
        technicalDetails: '[EXCEPTION_RULE_3_SILENCE_NOT_CONSENT] Table 5 Rule 3 active: Survivor is temporarily unreachable. Quorum approval cannot be presumed.'
      };
      setDecryptionResult(res);
      return;
    }

    const result = await TideCloakMatterService.attemptDecryptAsync(currentUser, doc, quorumRequests);
    setDecryptionResult(result);

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: result.success ? 'DECRYPT_SUCCESS' : 'DECRYPT_DENIED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: result.success ? 'SUCCESS' : 'BLOCKED_BY_TIDE',
      details: `${doc.title} (${doc.dataClass || 'C2'}) -> ${result.success ? `Session key synthesized via device enclave (${result.algorithm || 'AES-GCM'}). Latency: ${result.latencyMs || 12}ms.` : result.errorMessage}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler khi click xem tài liệu
  const handleOpenDocument = async (doc: MatterDocument) => {
    // Admin clicks decrypt -> immediate cryptographic refusal (Negative test)
    if (currentUser.role === 'ADMIN' || (currentUser.role as string) === 'IT_ADMIN') {
      await doActualDecrypt(doc);
      return;
    }

    // Lead Counsel requesting sensitive C2 sealed evidence can perform fast enclave authentication
    const isRestrictedLevel = doc.dataClass === 'C2' || doc.securityLevel === 'LEVEL_3_HIGHLY_SENSITIVE' || doc.securityLevel === 'LEVEL_4_CRITICAL';
    const isKeyholder = currentUser.role === 'LEAD_COUNSEL';

    if (isRestrictedLevel && isKeyholder) {
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

  // Handler khi người dùng upload và mã hóa tài liệu mới (THÊM)
  const handleUploadSuccess = (newDoc: MatterDocument) => {
    setDocuments(prev => [newDoc, ...prev]);

    // Nếu là tài liệu C2, tự động đăng ký một yêu cầu Quorum tương ứng
    if (newDoc.dataClass === 'C2') {
      const isKeyholder = currentUser.role === 'SURVIVOR_CLIENT' || currentUser.role === 'LEAD_COUNSEL' || currentUser.role === 'GUARDIAN';
      const initialApprovals = isKeyholder ? [
        {
          signerId: currentUser.id,
          signerName: currentUser.name,
          signerRole: currentUser.role,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          signatureHash: '0x' + Math.random().toString(16).substring(2, 10)
        }
      ] : [];

      const newQuorumReq: QuorumRequest = {
        id: `qr_${Date.now()}`,
        targetDocumentId: newDoc.id,
        targetDocumentTitle: newDoc.title,
        requestedBy: currentUser.name,
        requestedFor: 'In-Camera Judicial Inspection & Trial Submission',
        requestedRole: currentUser.role,
        reason: `Yêu cầu mở niêm phong chứng cứ C2 '${newDoc.title}' phục vụ tố tụng.`,
        status: 'PENDING',
        approvals: initialApprovals,
        threshold: isGuardianConflicted ? 2 : 3,
        requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
        isGuardianConflicted
      };
      setQuorumRequests(prev => [newQuorumReq, ...prev]);
      setSelectedQuorumReqId(newQuorumReq.id);
    }

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'SURVIVOR_EVIDENCE_SEALED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: 'SUCCESS',
      details: `${currentUser.name} tải lên và niêm phong '${newDoc.title}' (${newDoc.dataClass || 'C2'}). WebCrypto AES-256-GCM bảo vệ an toàn.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler Xóa tài liệu C0 (XÓA)
  const handleDeleteDocument = (docId: string) => {
    const docToDelete = documents.find(d => d.id === docId);
    if (!docToDelete) return;

    setDocuments(prev => prev.filter(d => d.id !== docId));

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'DOCUMENT_DELETED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: 'SUCCESS',
      details: `${currentUser.name} (${currentUser.role}) đã xóa tài liệu vận hành C0 '${docToDelete.title}'.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler Cập nhật / Chỉnh sửa tài liệu C0 (SỬA)
  const handleUpdateDocument = (updatedDoc: MatterDocument) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'DOCUMENT_EDITED',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      status: 'SUCCESS',
      details: `${currentUser.name} (${currentUser.role}) đã chỉnh sửa nội dung tài liệu vận hành C0 '${updatedDoc.title}'.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler khi một Keyholder (Luật sư, Người giám hộ) ký duyệt Quorum All-Keyholders
  const handleApproveQuorum = (requestId: string) => {
    setQuorumRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        if (req.approvals.some(a => a.signerRole === currentUser.role)) {
          return req;
        }

        const sigHash = currentUser.role === 'LEAD_COUNSEL' 
          ? '0x4f8e9a02' 
          : currentUser.role === 'GUARDIAN' 
            ? '0x9d11fa88' 
            : '0x71a2ce89';

        const updatedApprovals = [
          ...req.approvals,
          {
            signerId: currentUser.id,
            signerName: currentUser.name,
            signerRole: currentUser.role,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            signatureHash: sigHash
          }
        ];

        const threshold = isGuardianConflicted ? 2 : (req.threshold || 3);
        const isApproved = updatedApprovals.length >= threshold;

        return {
          ...req,
          approvals: updatedApprovals,
          threshold,
          status: isApproved ? 'APPROVED' : 'PENDING'
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
      details: `${currentUser.name} (${currentUser.role}) ký duyệt Quorum All-Keyholders. Khóa bí mật tổng hợp dần trong Enclave.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler kích hoạt ngoại lệ 4: Người giám hộ xung đột bạo hành
  const handleToggleGuardianConflict = () => {
    setIsGuardianConflicted(prev => {
      const next = !prev;
      setQuorumRequests(reqs => reqs.map(q => ({
        ...q,
        isGuardianConflicted: next,
        threshold: next ? 2 : 3,
        status: q.approvals.length >= (next ? 2 : 3) ? 'APPROVED' : 'PENDING'
      })));

      const newLog: AuditLogEntry = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: next ? 'EXCEPTION_RULE_4_GUARDIAN_CONFLICT' : 'EXCEPTION_RULE_4_RESOLVED',
        actorName: 'TideCloak Safeguard Engine',
        actorRole: 'ADMIN',
        status: next ? 'BLOCKED_BY_TIDE' : 'SUCCESS',
        details: next 
          ? '🚨 BÁO ĐỘNG AN NINH: Nghi ngờ Người giám hộ bạo hành (Ngoại lệ 4). Đã cách ly Người giám hộ, giảm ngưỡng Quorum xuống 2/2 (Jane Doe + Elena Howard).'
          : 'Gỡ bỏ báo động Người giám hộ. Phục hồi ngưỡng Quorum 3/3 All-Keyholders.'
      };
      setAuditLogs(logs => [newLog, ...logs]);
      return next;
    });
  };

  // Handler kích hoạt ngoại lệ 3: Nạn nhân mất liên lạc (Silence != Consent)
  const handleToggleVictimUnreachable = () => {
    setIsVictimUnreachable(prev => {
      const next = !prev;
      const newLog: AuditLogEntry = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: next ? 'EXCEPTION_RULE_3_ACTIVE' : 'EXCEPTION_RULE_3_RESOLVED',
        actorName: 'TideCloak Safeguard Engine',
        actorRole: 'ADMIN',
        status: next ? 'BLOCKED_BY_TIDE' : 'SUCCESS',
        details: next
          ? '⚠️ Ngoại lệ 3: Nạn nhân tạm thời mất liên lạc. Khóa bảo vệ kích hoạt (Silence != Consent), từ chối cấp khóa giải mã nhạy cảm.'
          : 'Nạn nhân đã trực tuyến. Phục hồi khả năng xác thực bình thường.'
      };
      setAuditLogs(logs => [newLog, ...logs]);
      return next;
    });
  };

  // Handler kích hoạt ngoại lệ 8: Hệ thống ngừng hoạt động (System Outage Fail-Closed)
  const handleToggleSystemOutage = () => {
    setIsSystemOutage(prev => {
      const next = !prev;
      const newLog: AuditLogEntry = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: next ? 'EXCEPTION_RULE_8_OUTAGE' : 'EXCEPTION_RULE_8_RESTORED',
        actorName: 'TideCloak Infrastructure',
        actorRole: 'ADMIN',
        status: next ? 'BLOCKED_BY_TIDE' : 'SUCCESS',
        details: next
          ? '🛑 Sự cố gián đoạn hệ thống / mất mạng: Chế độ Fail-Closed kích hoạt. Mặc định từ chối giải mã mọi dữ liệu nhạy cảm C2.'
          : 'Hạ tầng mạng đã phục hồi hoạt động bình thường.'
      };
      setAuditLogs(logs => [newLog, ...logs]);
      return next;
    });
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      
      {/* Top Navigation Bar with Persona & Enclave Status */}
      <Navbar
        currentUser={currentUser}
        allUsers={userProfiles}
        onSelectRole={handleSelectRole}
        onOpenEnclaveInspector={() => setIsEnclaveInspectorOpen(true)}
        onOpenProfileSettings={() => setIsProfileModalOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content Area with Left Collapsible Sidebar */}
      <div className="flex flex-1 pt-16">
        
        {/* Left Collapsible Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingQuorumCount={pendingQuorumCount}
          currentUser={currentUser}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          allUsers={userProfiles}
          onSelectRole={handleSelectRole}
        />

        {/* Dynamic Main Workspace Router */}
        <main
          className={`flex-1 ${
            isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          } p-3 sm:p-5 md:p-6 transition-all duration-300 ease-in-out min-w-0 overflow-x-hidden`}
        >
          
          {/* Tab 0: Admin Console (Infrastructure Root View with 0% Authority) */}
          {currentTab === 'admin-console' && (
            <AdminConsoleView
              currentUser={currentUser}
              documents={documents}
              onLogAudit={handleLogTamper}
              onAttemptDecrypt={handleOpenDocument}
              onOpenEnclaveInspector={() => setIsEnclaveInspectorOpen(true)}
            />
          )}

          {/* Tab 1: Quorum Approvals (All-Keyholders Consensus) */}
          {currentTab === 'quorum-approvals' && (
            <QuorumApprovalsView
              quorumRequests={quorumRequests}
              currentUser={currentUser}
              onApproveQuorum={handleApproveQuorum}
              isGuardianConflicted={isGuardianConflicted}
              documents={documents}
              onOpenDocument={handleOpenDocument}
              selectedRequestId={selectedQuorumReqId}
              onSelectRequestId={setSelectedQuorumReqId}
            />
          )}

          {/* Tab 2: Evidence Matrix (C0, C1, C2 Core Security Tiers + CRUD Rules) */}
          {currentTab === 'evidence-matrix' && (
            <EvidenceMatrixView
              documents={documents}
              currentUser={currentUser}
              quorumRequests={quorumRequests}
              onOpenDocument={handleOpenDocument}
              onOpenQuorumView={(targetDoc) => {
                if (targetDoc) {
                  let req = quorumRequests.find(q => q.targetDocumentId === targetDoc.id);
                  if (!req) {
                    const newReq: QuorumRequest = {
                      id: `qr_${Date.now()}`,
                      targetDocumentId: targetDoc.id,
                      targetDocumentTitle: targetDoc.title,
                      requestedBy: currentUser.name,
                      requestedFor: 'In-Camera Judicial Inspection & Trial Submission',
                      requestedRole: currentUser.role,
                      reason: `Yêu cầu mở niêm phong chứng cứ C2 '${targetDoc.title}' phục vụ tố tụng.`,
                      status: 'PENDING',
                      approvals: [
                        {
                          signerId: 'usr_client_01',
                          signerName: 'Jane Doe (Survivor)',
                          signerRole: 'SURVIVOR_CLIENT',
                          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                          signatureHash: '0x71a2ce89'
                        }
                      ],
                      threshold: isGuardianConflicted ? 2 : 3,
                      requiredRoles: ['SURVIVOR_CLIENT', 'LEAD_COUNSEL', 'GUARDIAN'],
                      isGuardianConflicted
                    };
                    setQuorumRequests(prev => [newReq, ...prev]);
                    setSelectedQuorumReqId(newReq.id);
                  } else {
                    setSelectedQuorumReqId(req.id);
                  }
                }
                setCurrentTab('quorum-approvals');
              }}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenExceptionModal={() => setIsExceptionModalOpen(true)}
              isGuardianConflicted={isGuardianConflicted}
              onDeleteDocument={handleDeleteDocument}
              onUpdateDocument={handleUpdateDocument}
            />
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

      {/* Exception Simulator Modal (Table 5 Safeguards) */}
      <ExceptionSimulatorModal
        isOpen={isExceptionModalOpen}
        onClose={() => setIsExceptionModalOpen(false)}
        isGuardianConflicted={isGuardianConflicted}
        onToggleGuardianConflict={handleToggleGuardianConflict}
        isVictimUnreachable={isVictimUnreachable}
        onToggleVictimUnreachable={handleToggleVictimUnreachable}
        isSystemOutage={isSystemOutage}
        onToggleSystemOutage={handleToggleSystemOutage}
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

      {/* User Profile & Cryptographic Enclave Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        allUsers={userProfiles}
        onSelectRole={handleSelectRole}
        onUpdateUser={handleUpdateUser}
      />

      {/* TideCloak Plan C OIDC Minting Notification Toast */}
      {tideToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            tideToast.isZeroAuth ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]' : 'bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]'
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {tideToast.isZeroAuth ? 'admin_panel_settings' : 'vpn_key'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-[#0F172A] truncate">TideCloak Token Minted</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#CCFBF1] text-[#0F766E]">
                Plan C
              </span>
            </div>
            <p className="text-xs text-[#334155] mt-0.5 truncate">{tideToast.message}</p>
            {tideToast.subtext && (
              <p className={`text-[11px] font-mono mt-0.5 truncate ${tideToast.isZeroAuth ? 'text-[#DC2626]' : 'text-[#0D9488]'}`}>
                {tideToast.subtext}
              </p>
            )}
          </div>
          <button
            onClick={() => setTideToast(null)}
            type="button"
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default App;
