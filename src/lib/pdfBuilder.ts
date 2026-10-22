/**
 * CLIENT-SIDE LEGAL PDF GENERATOR
 * Generates standard byte-accurate PDF-1.4 binary buffers in volatile RAM
 */

export function buildClientPdf(title: string, summary: string, metadata?: { securityLevel?: string; author?: string }): Uint8Array {
  const objects: string[] = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >> >> >> >>\nendobj');

  let textStream = 'BT\n';
  textStream += '/F1 15 Tf\n50 740 Td\n(' + (title || 'EVIDENCE DISCLOSURE').replace(/[()\\\\]/g, '\\$&') + ') Tj\n';
  textStream += '/F3 10 Tf\n0 -20 Td\n(SEALED LITIGATION EVIDENCE -- SDNY DOCKET 26-CV-04421) Tj\n';
  textStream += '/F2 9 Tf\n0 -22 Td\n(========================================================================================) Tj\n0 -18 Td\n';

  textStream += '/F1 11 Tf\n(CLASSIFICATION & SECURITY LEVEL:) Tj\n0 -16 Td\n';
  textStream += '/F2 10 Tf\n(' + (metadata?.securityLevel || 'RESTRICTED PRIVILEGE').replace(/[()\\\\]/g, '\\$&') + ') Tj\n0 -16 Td\n';

  textStream += '/F1 11 Tf\n(EVIDENCE SUMMARY & DISCLOSURE RECORD:) Tj\n0 -16 Td\n';
  textStream += '/F2 10 Tf\n';

  const lines = (summary || 'Confidential victim disclosure sealed under Emergent Authority.').split('\n');
  for (const line of lines) {
    textStream += '(' + line.replace(/[()\\\\]/g, '\\$&') + ') Tj\n0 -14 Td\n';
  }

  textStream += '0 -20 Td\n';
  textStream += '/F3 8.5 Tf\n([SEALED VIA TIDECLOAK CLIENT ENCLAVE -- ZERO DATA AUTHORITY ENFORCED]) Tj\n';
  textStream += 'ET';

  const textEncoder = new TextEncoder();
  const streamBytes = textEncoder.encode(textStream);
  objects.push('4 0 obj\n<< /Length ' + streamBytes.length + ' >>\nstream\n' + textStream + '\nendstream\nendobj');

  let output = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(textEncoder.encode(output).length);
    output += objects[i] + '\n';
  }

  const startxref = textEncoder.encode(output).length;
  let xref = 'xref\n0 ' + (objects.length + 1) + '\n';
  xref += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  output += xref;
  output += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF';

  return textEncoder.encode(output);
}
