const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Helper to construct a standard, byte-accurate valid PDF-1.4 document
function buildValidPdf(title, subtitle, sections) {
  let objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >> >> >> >>\nendobj');

  let textStream = 'BT\n';
  // Top Judicial Header
  textStream += '/F1 15 Tf\n50 740 Td\n(' + title.replace(/[()\\\\]/g, '\\\\$&') + ') Tj\n';
  textStream += '/F3 10 Tf\n0 -20 Td\n(' + subtitle.replace(/[()\\\\]/g, '\\\\$&') + ') Tj\n';
  textStream += '/F2 9 Tf\n0 -25 Td\n(========================================================================================) Tj\n0 -18 Td\n';

  for (const sec of sections) {
    textStream += '/F1 11 Tf\n(' + sec.heading.replace(/[()\\\\]/g, '\\\\$&') + ') Tj\n0 -16 Td\n';
    textStream += '/F2 9.5 Tf\n';
    for (const line of sec.lines) {
      textStream += '(' + line.replace(/[()\\\\]/g, '\\\\$&') + ') Tj\n0 -14 Td\n';
    }
    textStream += '0 -10 Td\n';
  }

  // Footer seal
  textStream += '/F3 8.5 Tf\n0 -15 Td\n([SEALED VIA TIDECLOAK EMERGENT ENCLAVE -- ZERO DATA AUTHORITY ENFORCED -- 2026]) Tj\n';
  textStream += 'ET';

  const streamBytes = Buffer.from(textStream, 'utf-8');
  objects.push('4 0 obj\n<< /Length ' + streamBytes.length + ' >>\nstream\n' + textStream + '\nendstream\nendobj');

  let output = '%PDF-1.4\n';
  let offsets = [];
  offsets.push(0);

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(output, 'utf-8'));
    output += objects[i] + '\n';
  }

  const startxref = Buffer.byteLength(output, 'utf-8');
  let xref = 'xref\n0 ' + (objects.length + 1) + '\n';
  xref += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  output += xref;
  output += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF';
  return Buffer.from(output, 'utf-8');
}

// AES-256-GCM Encryption with PBKDF2
async function encryptPdf(pdfBuffer, secretSeed, fileName) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  const keyMaterial = crypto.pbkdf2Sync(secretSeed, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial, iv);

  const encrypted = Buffer.concat([cipher.update(pdfBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Combine cipher + tag matching WebCrypto AES-GCM format
  const fullCipher = Buffer.concat([encrypted, tag]);

  return {
    cipherHex: fullCipher.toString('hex'),
    ivHex: iv.toString('hex'),
    saltHex: salt.toString('hex'),
    tagHex: tag.toString('hex'),
    classification: 'IMMUNITY_SEALED_AES_256_GCM',
    isPdf: true,
    fileName: fileName,
    mimeType: 'application/pdf'
  };
}

async function run() {
  console.log('Generating 4 authentic legal PDFs...');

  // 1. Doc 01
  const pdf1 = buildValidPdf(
    'UNITED STATES DISTRICT COURT - SOUTHERN DISTRICT OF NEW YORK',
    'CIVIL ACTION DOCKET NO. 26-CV-04421-JSR -- PROTECTIVE ORDER',
    [
      {
        heading: 'ORDER GRANTING CONFIDENTIAL PSEUDONYM FILING:',
        lines: [
          '1. Compelling privacy and personal safety interests warrant the Plaintiff to proceed as "Jane Doe".',
          '2. Pre-trial evidentiary discovery timetable: Depositions scheduled for November 12, 2026.',
          '3. Assigned lead trial counsel verified: Elena Howard, Esq. (NY State Bar #882194).',
          '4. All underlying traumatic testimony and physical examination records remain under federal seal.'
        ]
      }
    ]
  );

  // 2. Doc 02
  const pdf2 = buildValidPdf(
    'HOWARD & ASSOCIATES CIVIL RIGHTS LITIGATION GROUP',
    'PRIVILEGED ATTORNEY WORK PRODUCT -- FRE 412 REDACTED EVIDENCE INDEX',
    [
      {
        heading: 'CASE PREPARATION & DISCOVERY INTERROGATORIES:',
        lines: [
          '- Evidentiary Standard: Strict application of FRE 412 shielding victim sexual predisposition evidence.',
          '- Redacted Docket: 14 witness interrogation summaries logged without survivor safehouse coordinates.',
          '- Defense Interrogatory Timeline: Deposition examination window opens October 28, 2026.',
          '- Status: Protected under Lead Counsel Work Product privilege. Opposing counsel restricted.'
        ]
      }
    ]
  );

  // 3. Doc 03
  const pdf3 = buildValidPdf(
    'NEW YORK FORENSIC PATHOLOGY & MEDICAL TRAUMA CENTER',
    'CONFIDENTIAL CLINICAL FORENSIC TRAUMA EVALUATION -- EXHIBIT B',
    [
      {
        heading: 'INDEPENDENT MEDICAL EXAMINER REPORT (DR. MIRIAM VANCE, M.D.):',
        lines: [
          'PATIENT IDENTIFIER: Jane Doe (Verified via Cryptographic Hardware Attestation Token)',
          'DATE OF EXAMINATION: August 16, 2026 | INCIDENT DATE: August 14, 2026 (22:30 EDT)',
          'PHYSICAL TRAUMA FINDINGS: Acute soft-tissue contusions, cervical strain, defensive forearm lacerations.',
          'FORENSIC TOXICOLOGY: Traces of sedative hypnotic derivative consistent with involuntary incapacitation.',
          'PSYCHOLOGICAL ASSESSMENT: Severe Post-Traumatic Stress Disorder (PTSD) under DSM-5 criteria.',
          'MEDICAL OPINION: Clinical findings are strongly consistent with non-consensual physical trauma.'
        ]
      },
      {
        heading: 'TIDECLOAK QUORUM REQUIREMENT:',
        lines: [
          'This document is cryptographically sealed under 2-of-2 Quorum consensus.',
          'Mutual consent required: Jane Doe (Survivor Plaintiff) + Elena Howard (Lead Trial Counsel).'
        ]
      }
    ]
  );

  // 4. Doc 04
  const pdf4 = buildValidPdf(
    'SOVEREIGN PLAINTIFF ENCLAVE -- STRICT WITNESS PRIVILEGE',
    'WITNESS PROTECTION ESCROW -- CRITICAL INCIDENT LOG & COORDINATES',
    [
      {
        heading: 'CHRONOLOGICAL INCIDENT TIMELINE & RECORDED STATEMENTS:',
        lines: [
          '- August 14, 2026 (22:30 EDT): Incident at Lexington Hotel Executive Penthouse Suite.',
          '- Verified Audio Memo #04 Transcription: [00:03:12] Defendant: "No one will believe you."',
          '- Protected Witness Relocation Coordinates: [MANAGED UNDER FEDERAL WITNESS SECURITY PROGRAM - SEALED]',
          '- EMERGENCY INSTRUCTION: Disclosing safehouse coordinates creates imminent life-threatening peril.'
        ]
      },
      {
        heading: 'SOVEREIGN ENCLAVE ATTESTATION:',
        lines: [
          'Sole data authority belongs exclusively to Plaintiff Jane Doe.',
          'Zero platform infrastructure keys exist. Cloud administrators have 0% mathematical decrypt access.'
        ]
      }
    ]
  );

  // Encrypt with designated seeds
  const payload1 = await encryptPdf(pdf1, 'TIDE_PUBLIC_DISCOVERY_KEY_SLOT_SDNY_COURT_0x8f2a', 'Court_Scheduling_Order_2026_CV_04421.pdf');
  const payload2 = await encryptPdf(pdf2, 'TIDE_EPHEMERAL_KEY_SLOT_LEAD_COUNSEL_PRIVILEGE_0x4f8e', 'Privileged_Legal_Correspondence_Redacted_Index.pdf');
  const payload3 = await encryptPdf(pdf3, 'TIDE_EMERGENT_QUORUM_SEED:0x71a2ce89:0x4f8e9a02:SDNY_CASE_2026_CV_4421', 'Exhibit_B_Forensic_Medical_Trauma_Evaluation.pdf');
  const payload4 = await encryptPdf(pdf4, 'TIDE_EPHEMERAL_KEY_SLOT_SURVIVOR_SOVEREIGNTY_0x71a2', 'STRICT_PRIVILEGE_Survivor_Timeline_Safehouse.pdf');

  console.log('PDFs generated & encrypted successfully:');
  console.log('Doc 1 Cipher length:', payload1.cipherHex.length);
  console.log('Doc 2 Cipher length:', payload2.cipherHex.length);
  console.log('Doc 3 Cipher length:', payload3.cipherHex.length);
  console.log('Doc 4 Cipher length:', payload4.cipherHex.length);

  // Write out as json for inspection / injection
  const out = {
    doc_01: payload1,
    doc_02: payload2,
    doc_03: payload3,
    doc_04: payload4
  };
  fs.writeFileSync(path.join(__dirname, 'vault_encrypted_payloads.json'), JSON.stringify(out, null, 2));
  console.log('Saved vault_encrypted_payloads.json');
}

run().catch(console.error);
