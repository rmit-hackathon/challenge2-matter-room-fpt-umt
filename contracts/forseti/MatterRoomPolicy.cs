using System;
using System.Threading.Tasks;

namespace MatterRoom.Forseti.Policies
{
    /// <summary>
    /// FORSETI PROGRAMMABLE POLICY ENGINE CONTRACT
    /// Enforces Emergent Authority and Cryptographic Zero Data Authority on Tide ORK Nodes.
    /// Case: Jane Doe v. Titan Media Group (SDNY Case #2026-CV-04421)
    /// </summary>
    public interface IForsetiPolicy
    {
        bool ValidateDecryptionRequest(CallerContext caller, ResourceContext resource, QuorumState quorum);
    }

    public class CallerContext
    {
        public string UserId { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string EnclaveTokenId { get; set; } = string.Empty;
    }

    public class ResourceContext
    {
        public string DocumentId { get; set; } = string.Empty;
        public string Classification { get; set; } = string.Empty;
        public string Sha256Hash { get; set; } = string.Empty;
    }

    public class QuorumState
    {
        public int Threshold { get; set; } = 3;
        public int SignedCount { get; set; } = 0;
        public string[] RequiredRoles { get; set; } = new string[0];
        public string[] ActiveSignerRoles { get; set; } = new string[0];
        public bool IsGuardianConflicted { get; set; } = false;
    }

    public class MatterRoomQuorumPolicy : IForsetiPolicy
    {
        public const string PolicyContractId = "SDNY-CASE-2026-CV-04421-SURVIVOR-SHIELD";
        public const string RequiredQuorumThreshold = "3-of-3:ALL-KEYHOLDERS(SURVIVOR+COUNSEL+GUARDIAN)";

        public bool ValidateDecryptionRequest(CallerContext caller, ResourceContext resource, QuorumState quorum)
        {
            // =========================================================================
            // INVARIANT RULE 1: ZERO DATA AUTHORITY CONSTRAINT (INFRASTRUCTURE ADMIN)
            // =========================================================================
            // Cloud Infrastructure & Database Sysadmins possess ZERO Data Authority.
            // Tide ORK nodes mathematically refuse ephemeral secret key derivation.
            if (caller.Role == "IT_ADMIN" || caller.Role == "ADMIN")
            {
                return false;
            }

            // =========================================================================
            // INVARIANT RULE 2: C0 — OPERATIONAL & PUBLIC COURT DISCOVERY
            // =========================================================================
            // Operational workflow information and unsealed court documents require no approval.
            if (resource.Classification == "C0" || resource.Classification == "DISCOVERY")
            {
                return true;
            }

            // =========================================================================
            // INVARIANT RULE 3: C1 — CONFIDENTIAL CASE WORK PRODUCT
            // =========================================================================
            // Ordinary case materials are strictly restricted to assigned legal counsel and client.
            if (resource.Classification == "C1")
            {
                return caller.Role == "LEAD_COUNSEL" || caller.Role == "SURVIVOR_CLIENT";
            }

            // =========================================================================
            // INVARIANT RULE 4: C2 — SENSITIVE EVIDENCE & ALL-KEYHOLDERS QUORUM
            // =========================================================================
            // Intimate disclosures, medical findings, DNA, and safehouse coordinates
            // require consensus from ALL keyholders (Client + Counsel + Guardian).
            // Exception Rule 4: If guardian is implicated in abuse, guardian is excluded (2-of-2).
            if (resource.Classification == "C2" || resource.Classification == "RESTRICTED_EXPERT" || resource.Classification == "STRICT_PRIVILEGE")
            {
                bool hasSurvivor = Array.Exists(quorum.ActiveSignerRoles, r => r == "SURVIVOR_CLIENT");
                bool hasCounsel = Array.Exists(quorum.ActiveSignerRoles, r => r == "LEAD_COUNSEL");
                bool hasGuardian = Array.Exists(quorum.ActiveSignerRoles, r => r == "GUARDIAN");

                // Exception Safeguard: Conflicted Guardian Exclusion
                if (quorum.IsGuardianConflicted)
                {
                    return hasSurvivor && hasCounsel && quorum.SignedCount >= 2;
                }

                // Standard Sovereign Quorum: All Keyholders consensus
                return hasSurvivor && hasCounsel && hasGuardian && quorum.SignedCount >= 3;
            }

            return false;
        }
    }
}
