[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

# Matter Room — Zero-Trust Legal Sanctuary
> **RMIT Hackathon 2026 — Challenge 2: UNLOCKED (Tide Foundation)**  
> **Team:** FPT - UMT | **Repository:** [rmit-hackathon/challenge2-matter-room-fpt-umt](https://github.com/rmit-hackathon/challenge2-matter-room-fpt-umt)

## Project overview

> A zero-trust legal sanctuary where sensitive sexual assault casework, intimate survivor disclosures, and sealed victim identities are cryptographically blinded from cloud administrators, requiring verified multi-party quorum consensus.

### 1. Vision & originality
Matter Room redefines sensitive litigation by dismantling unilateral administrative power. Instead of entrusting raw survivor disclosures, medical examination logs, and anonymous witness identities to centralized database administrators, our workspace enforces dynamic Emergent Authority—ensuring traumatic case files remain mathematically sealed from unauthorized personnel.

### 2. Trust constraint insight
Today, survivors of sexual assault and workplace abuse frequently remain silent because digital case management requires trusting cloud IT sysadmins. A single curious operator, compromised database credential, or bribed insider can silently leak intimate medical evidence or expose protected survivor identities, causing catastrophic re-traumatization and witness tampering.

### 3. Value & impact
Victims, civil rights advocates, and independent medical examiners can safely collaborate without fear of surveillance. For instance, in a high-profile abuse lawsuit, an anonymous plaintiff ("Jane Doe") can share sensitive forensic injury reports with a court-appointed trauma doctor without exposing her private diary or physical safehouse coordinates.

### 4. Why TideCloak matters
Matter Room utilizes TideCloak to strictly sever Infrastructure Administration from Cryptographic Data Authority. Decryption tokens never touch platform servers. When expert testimony is required, TideCloak enforces an unbypassable Quorum consensus requiring cryptographic signoff from all verified Keyholders (Survivor, Counsel, and Guardian) before Tide's decentralized fabric momentarily synthesizes access.

### 5. Prototype & storytelling
Our prototype demonstrates an IT Root Admin attempting to view an intimate incident audio transcript—immediately blocked by TideCloak's zero-data-authority policy. It then demonstrates an uncompromised All-Keyholders Quorum flow authorizing a forensic medical examiner to access sealed injury documentation, alongside automated exception safeguards.

---

## Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- *(Optional)* **Docker & Docker Compose** for running the live local TideCloak dev container

### 1. Installation
Clone the public repository and install dependencies:
```bash
git clone https://github.com/rmit-hackathon/challenge2-matter-room-fpt-umt.git
cd challenge2-matter-room-fpt-umt
npm install
```

### 2. Development Mode
Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Production Build & Verification
Compile and verify the TypeScript and production assets:
```bash
npm run build
npm run preview
```

### 4. Running TideCloak Local Container (Optional)
To launch the local TideCloak development container pre-configured with the `matter-room` OIDC realm:
```bash
chmod +x scripts/run_tidecloak.sh
./scripts/run_tidecloak.sh
```
*Note: If Docker is unavailable, Matter Room automatically activates its Secure Enclave Engine powered by W3C WebCrypto API (AES-256-GCM) with 100% cryptographic parity.*

---

## Key Cryptographic Verifications to Test in Demo

1. **Negative Test (Zero Data Authority Block):**
   - Click the **Demo Personas** selector in the sidebar and choose **Alex Mercer (Platform Sysadmin)**.
   - Attempt to click **Attempt Decrypt (Sysadmin)** on any sealed exhibit (e.g. *Exhibit B: Confidential Forensic Medical Trauma Evaluation*).
   - Observe TideCloak's immediate cryptographic rejection: `Decryption Refused — 0% Data Authority`.

2. **Positive Test (All-Keyholders Quorum Consensus):**
   - Switch persona to **Elena Howard, Esq. (Lead Counsel)** or **Sarah Jenkins (Legal Guardian)**.
   - Navigate to the **Quorum Approvals** tab.
   - Click **Sign to Authorize** to add cryptographic signatures towards the threshold.
   - Switch to **Dr. Miriam Vance (Forensic Expert)** and decrypt *Exhibit B* to view the authentic forensic medical report.

3. **Exception Safeguard Engine (Guardian Conflict Safeguard):**
   - Click **Simulate Exceptions** in the navigation bar.
   - Trigger **Rule 4: Guardian Implicated in Abuse**.
   - Observe the Quorum threshold automatically exclude the conflicted guardian, reducing the threshold to 2-of-2 (Survivor + Counsel) to prevent retaliation.
