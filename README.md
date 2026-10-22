[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

## Project overview

> A zero-trust legal sanctuary where sensitive sexual assault casework, intimate survivor disclosures, and sealed victim identities are cryptographically blinded from cloud administrators, requiring dual survivor-counsel quorum consensus.

### 1. Vision & originality
Matter Room redefines sensitive litigation by dismantling unilateral administrative power. Instead of entrusting raw survivor disclosures, medical examination logs, and anonymous witness identities to centralized database administrators, our workspace enforces dynamic Emergent Authority—ensuring traumatic case files remain mathematically sealed from unauthorized personnel.

### 2. Trust constraint insight
Today, survivors of sexual assault and workplace abuse frequently remain silent because digital case management requires trusting cloud IT sysadmins. A single curious operator, compromised database credential, or bribed insider can silently leak intimate medical evidence or expose protected survivor identities, causing catastrophic re-traumatization and witness tampering.

### 3. Value & impact
Victims, civil rights advocates, and independent medical examiners can safely collaborate without fear of surveillance. For instance, in a high-profile abuse lawsuit, an anonymous plaintiff ("Jane Doe") can share sensitive forensic injury reports with a court-appointed trauma doctor without exposing her private diary or physical safehouse coordinates.

### 4. Why TideCloak matters
Matter Room utilizes TideCloak to strictly sever Infrastructure Administration from Cryptographic Data Authority. Decryption tokens never touch platform servers. When expert testimony is required, TideCloak enforces an unbypassable 2-of-2 Quorum policy requiring mutual cryptographic consent from both Survivor and Lead Counsel before Tide's decentralized fabric momentarily synthesizes access.

### 5. Prototype & storytelling
Our prototype demonstrates an IT Root Admin attempting to view an intimate incident audio transcript—immediately blocked by TideCloak's zero-data-authority policy. It then demonstrates an uncompromised Quorum approval flow, where the survivor and lead counsel authorize a forensic medical examiner to access sealed injury documentation.

---

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- (Optional) Docker & Docker Compose for running the local TideCloak dev container

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<your-username>/matter-room-tidecloak.git
cd matter-room-tidecloak
npm install
```

### 2. Development Mode
Run the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Production Build & Inspection
To create an optimized production build:
```bash
npm run build
npm run preview
```

### 4. Running TideCloak Local Container (Optional)
To run the local TideCloak dev container configured with OIDC Realm import:
```bash
chmod +x scripts/run_tidecloak.sh
./scripts/run_tidecloak.sh
```
*Note: If Docker is unavailable, the application seamlessly runs in Secure Web Enclave mode utilizing native W3C WebCrypto API (AES-256-GCM).*

---

## Key Cryptographic Verifications to Test in Demo
1. **Negative Test (Zero Data Authority):**
   - Click the top Persona switcher and select **Alex Mercer (Platform Sysadmin)**.
   - Attempt to click **Attempt Decrypt (Sysadmin)** on any privileged file.
   - Observe TideCloak's immediate cryptographic rejection (*Decryption Refused — 0% Data Authority*).
2. **Positive Test (2-of-2 Emergent Quorum):**
   - Switch to **Elena Howard, Esq. (Lead Counsel)**.
   - Open **Manage Quorum Escrow** and sign to complete the 2/2 threshold for Dr. Miriam Vance.
   - Switch to **Dr. Miriam Vance (Forensic Expert)** and decrypt Exhibit B (*Forensic Medical Findings*).
