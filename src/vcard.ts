/**
 * vCard generation for DÉ's contact information.
 * Standard VCF 3.0 format — works on iPhone, Android, and desktop.
 */

export function generateVCard(): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Beard;DésMonique;;;",
    "FN:DÉ (DésMonique Beard)",
    "ORG:Luxury Dream Lounge",
    "TITLE:Founder & CEO | Business Consultant & Architect",
    "EMAIL;TYPE=WORK:Elevate@LuxuryDreamLounge.com",
    "TEL;TYPE=WORK,VOICE:+15022086240",
    "ADR;TYPE=WORK:;;6844 Bardstown Rd #538;Louisville;KY;40291;United States",
    "URL:https://luxurydreamlounge.com",
    "NOTE:Dream big. Start smart. Scale fast.",
    "END:VCARD",
  ].join("\r\n");
}

export function downloadVCard(): void {
  const vcf = generateVCard();
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "DE-LuxuryDreamLounge.vcf";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
