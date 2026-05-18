/**
 * API layer for communicating with the PLP Convex backend.
 */

const CONVEX_URL = "https://marvelous-quail-590.convex.site";

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  linkedin?: string;
  instagram?: string;
  message?: string;
  howWeMet?: string;       // "event", "social", "online", "referral", "other"
  howWeMetDetail?: string; // event name, platform, etc.
}

export async function submitContact(
  data: ContactSubmission,
  audioBlob?: Blob | null,
): Promise<{ success: boolean }> {
  // If there's audio, upload it first to get a storage reference
  let audioBase64: string | undefined;
  if (audioBlob) {
    const buffer = await audioBlob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    audioBase64 = btoa(binary);
  }

  const res = await fetch(`${CONVEX_URL}/api/networking/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      audioBase64: audioBase64 || undefined,
    }),
  });
  return res.json();
}

export async function getContext(): Promise<{
  isActive: boolean;
  sourceChannel: string | null;
  sourceDetail: string | null;
}> {
  try {
    const res = await fetch(`${CONVEX_URL}/api/networking/context`);
    return res.json();
  } catch {
    return { isActive: false, sourceChannel: null, sourceDetail: null };
  }
}
