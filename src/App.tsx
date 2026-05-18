import { useState, useEffect, useRef, useCallback } from "react";
import { downloadVCard } from "./vcard";
import { submitContact, getContext } from "./api";
import type { ContactSubmission } from "./api";

/* ═══════════════════════════════════════════════════════════
   SVG Icons (inline — zero deps)
   ═══════════════════════════════════════════════════════════ */

function IconDownload({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconPhone({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconGlobe({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconSend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function IconMic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconStop({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function IconTrash({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function IconPlay({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   LDL Monogram
   ═══════════════════════════════════════════════════════════ */

function LDLMonogram({ className = "", small = false }: { className?: string; small?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: small ? "28px" : "42px",
        fontWeight: 600,
        letterSpacing: "0.35em",
        lineHeight: 1,
        color: "#B8A48A",
      }}>
        LDL
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: small ? "7px" : "9px",
        fontWeight: 400,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: "rgba(184,164,138,0.6)",
        marginTop: small ? "4px" : "6px",
      }}>
        Luxury Dream Lounge
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Voice Recorder Component
   ═══════════════════════════════════════════════════════════ */

const MAX_SECONDS = 60;

function VoiceRecorder({
  audioBlob,
  onRecorded,
  onClear,
}: {
  audioBlob: Blob | null;
  onRecorded: (blob: Blob) => void;
  onClear: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>(0);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const stopRec = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state === "recording") {
      mediaRef.current.stop();
    }
    clearInterval(timerRef.current);
    setRecording(false);
  }, []);

  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecorded(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRef.current = mr;
      mr.start(250);
      setRecording(true);
      setElapsed(0);

      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            stopRec();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      // Microphone denied — fail silently
    }
  }

  function togglePlay() {
    if (!audioBlob) return;
    if (playing && audioElRef.current) {
      audioElRef.current.pause();
      setPlaying(false);
      return;
    }
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    audioElRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.play();
    setPlaying(true);
  }

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // No audio recorded yet — show record button
  if (!audioBlob && !recording) {
    return (
      <button
        type="button"
        onClick={startRec}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all"
        style={{
          background: "rgba(184,164,138,0.06)",
          border: "1px solid rgba(184,164,138,0.12)",
          color: "rgba(184,164,138,0.6)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.08em",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(184,164,138,0.3)"; e.currentTarget.style.color = "#B8A48A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(184,164,138,0.12)"; e.currentTarget.style.color = "rgba(184,164,138,0.6)"; }}
      >
        <IconMic className="w-4 h-4" />
        Leave a Voice Note (optional)
      </button>
    );
  }

  // Recording in progress
  if (recording) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg" style={{ background: "rgba(184,164,138,0.08)", border: "1px solid rgba(184,164,138,0.2)" }}>
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#C75D5D" }} />
          <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#C75D5D" }} />
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#F5F0EA", flex: 1 }}>
          Recording... {fmtTime(elapsed)}
        </span>
        <div style={{ flex: 2, height: "3px", background: "rgba(184,164,138,0.15)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${(elapsed / MAX_SECONDS) * 100}%`, height: "100%", background: "#B8A48A", transition: "width 1s linear", borderRadius: "2px" }} />
        </div>
        <button type="button" onClick={stopRec} style={{ background: "none", border: "none", cursor: "pointer", color: "#C75D5D", padding: "4px" }}>
          <IconStop className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Audio recorded — show playback controls
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-lg" style={{ background: "rgba(91,168,124,0.06)", border: "1px solid rgba(91,168,124,0.15)" }}>
      <button type="button" onClick={togglePlay} style={{ background: "none", border: "none", cursor: "pointer", color: "#5BA87C", padding: "4px" }}>
        {playing ? <IconStop className="w-4 h-4" /> : <IconPlay className="w-4 h-4" />}
      </button>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(245,240,234,0.6)", flex: 1 }}>
        Voice note recorded ({fmtTime(elapsed)})
      </span>
      <button
        type="button"
        onClick={() => { onClear(); setElapsed(0); if (audioElRef.current) { audioElRef.current.pause(); setPlaying(false); } }}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,240,234,0.3)", padding: "4px" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#C75D5D")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,240,234,0.3)")}
      >
        <IconTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════════════════════ */

type ViewState = "card" | "form" | "success";

const HOW_WE_MET_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "event", label: "At an Event" },
  { value: "social", label: "Social Media" },
  { value: "online", label: "Online" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

const SOCIAL_PLATFORMS = [
  { value: "", label: "Which platform?" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "other", label: "Other" },
];

export default function App() {
  const [view, setView] = useState<ViewState>("card");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [eventInfo, setEventInfo] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [howWeMet, setHowWeMet] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch capture context on mount
  useEffect(() => {
    getContext().then((ctx) => {
      if (ctx.isActive && ctx.sourceDetail) {
        setEventInfo(ctx.sourceDetail);
      }
    });
  }, []);

  function handleSaveContact() {
    downloadVCard();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    setSubmitting(true);
    const fd = new FormData(formRef.current);

    // Build howWeMetDetail based on selection
    let howWeMetDetail = "";
    if (howWeMet === "social") {
      howWeMetDetail = socialPlatform || "social";
    } else if (howWeMet === "event" && eventInfo) {
      howWeMetDetail = eventInfo;
    }

    const data: ContactSubmission = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      company: (fd.get("company") as string) || undefined,
      title: (fd.get("title") as string) || undefined,
      linkedin: (fd.get("linkedin") as string) || undefined,
      instagram: (fd.get("instagram") as string) || undefined,
      message: (fd.get("message") as string) || undefined,
      howWeMet: howWeMet || undefined,
      howWeMetDetail: howWeMetDetail || undefined,
    };

    try {
      await submitContact(data, audioBlob);
      setView("success");
    } catch {
      setView("success");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: "linear-gradient(180deg, #0C0A08 0%, #100E0B 40%, #0C0A08 100%)" }}>
      {/* Subtle top ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "600px", height: "400px", background: "radial-gradient(ellipse at center, rgba(184,164,138,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-[440px] px-6 py-12 pb-20">

        {/* ═══════════════════════════════════════════════
            CARD VIEW — DÉ's Digital Business Card
            ═══════════════════════════════════════════════ */}
        {view === "card" && (
          <div>
            {/* Monogram */}
            <div className="animate-fade-up flex justify-center mb-10">
              <LDLMonogram />
            </div>

            <div className="gold-divider mb-10 delay-200" />

            {/* Name & Title */}
            <div className="animate-fade-up delay-200 text-center mb-8">
              <h1
                className="text-shimmer mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(36px, 8vw, 48px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                D&#201;
              </h1>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "16px", fontWeight: 400, fontStyle: "italic",
                color: "rgba(245,240,234,0.7)", letterSpacing: "0.05em", lineHeight: 1.5,
              }}>
                Business Consultant &amp; Architect
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "14px", fontWeight: 600,
                color: "rgba(184,164,138,0.7)", letterSpacing: "0.12em",
                textTransform: "uppercase", marginTop: "4px",
              }}>
                Founder &amp; CEO
              </p>
            </div>

            {/* Tagline */}
            <div className="animate-fade-up delay-300 text-center mb-10">
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "15px", fontWeight: 300, fontStyle: "italic",
                color: "rgba(245,240,234,0.45)", letterSpacing: "0.08em",
              }}>
                Dream big. Start smart. Scale fast.
              </p>
            </div>

            {/* Credentials */}
            <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-2 mb-10">
              {["UofL B.A. — Communication & Marketing", "Certified Workflow Specialist"].map((cred) => (
                <span key={cred} style={{
                  display: "inline-block", padding: "6px 14px",
                  fontSize: "10px", fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "rgba(184,164,138,0.65)",
                  border: "1px solid rgba(184,164,138,0.15)", borderRadius: "100px",
                }}>
                  {cred}
                </span>
              ))}
            </div>

            {/* Contact Info */}
            <div className="animate-fade-up delay-500 space-y-0 mb-10">
              {[
                { icon: <IconMail />, label: "Elevate@LuxuryDreamLounge.com", href: "mailto:Elevate@LuxuryDreamLounge.com" },
                { icon: <IconPhone />, label: "+1 (502) 208-6240", href: "tel:+15022086240" },
                { icon: <IconPin />, label: "Louisville, KY" },
                { icon: <IconGlobe />, label: "luxurydreamlounge.com", href: "https://luxurydreamlounge.com" },
              ].map((item) => {
                const Tag = item.href ? "a" : "div";
                return (
                  <Tag
                    key={item.label}
                    {...(item.href ? {
                      href: item.href,
                      target: item.href.startsWith("http") ? "_blank" : undefined,
                      rel: item.href.startsWith("http") ? "noopener noreferrer" : undefined,
                    } : {})}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors"
                    style={{ color: "rgba(245,240,234,0.75)", textDecoration: "none" }}
                    onMouseEnter={(e) => { if (item.href) (e.currentTarget as HTMLElement).style.background = "rgba(184,164,138,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span style={{ color: "#B8A48A", opacity: 0.6 }}>{item.icon}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13.5px", fontWeight: 400, letterSpacing: "0.015em" }}>
                      {item.label}
                    </span>
                  </Tag>
                );
              })}
            </div>

            {/* Save Contact Button */}
            <div className="animate-fade-up delay-600 flex justify-center mb-6">
              <button onClick={handleSaveContact} className="btn-gold w-full" style={{ maxWidth: "320px" }}>
                {saved ? (
                  <><IconCheck className="w-4 h-4" /> Contact Saved</>
                ) : (
                  <><IconDownload className="w-4 h-4" /> Save My Contact</>
                )}
              </button>
            </div>

            <div className="gold-divider my-10 delay-700" />

            {/* Connect Prompt */}
            <div className="animate-fade-up delay-800 text-center mb-8">
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "24px", fontWeight: 600, color: "#B8A48A",
                letterSpacing: "0.04em", marginBottom: "8px",
              }}>
                Let&apos;s Stay Connected
              </h2>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300,
                color: "rgba(245,240,234,0.45)", lineHeight: 1.6,
                letterSpacing: "0.02em", maxWidth: "320px", margin: "0 auto",
              }}>
                Share your details below so I can reach back.
                {eventInfo && (
                  <span style={{ display: "block", marginTop: "8px", color: "rgba(184,164,138,0.5)" }}>
                    Connecting via {eventInfo}
                  </span>
                )}
              </p>
            </div>

            {/* Connect Button */}
            <div className="animate-fade-up delay-1000 flex justify-center">
              <button onClick={() => setView("form")} className="btn-outline w-full" style={{ maxWidth: "320px" }}>
                <IconSend className="w-4 h-4" />
                Share Your Info
              </button>
            </div>

            {/* Footer */}
            <div className="animate-fade-in delay-1200 text-center mt-16">
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "11px", fontWeight: 400, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "rgba(184,164,138,0.25)",
              }}>
                Luxury Dream Lounge
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            FORM VIEW — Connect / Lock In
            ═══════════════════════════════════════════════ */}
        {view === "form" && (
          <div className="animate-fade-up">
            {/* Back */}
            <button
              onClick={() => setView("card")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                color: "rgba(184,164,138,0.5)", fontSize: "12px",
                fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em",
                textTransform: "uppercase", background: "none", border: "none",
                cursor: "pointer", padding: "4px 0", marginBottom: "32px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#B8A48A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(184,164,138,0.5)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Back
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <LDLMonogram small />
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "28px", fontWeight: 600, color: "#B8A48A",
                letterSpacing: "0.04em", marginTop: "24px", marginBottom: "8px",
              }}>
                Lock In
              </h2>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 300,
                color: "rgba(245,240,234,0.45)", lineHeight: 1.6, letterSpacing: "0.02em",
              }}>
                Your information stays private and secure.
              </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <FormField label="Full Name" required>
                <input name="name" type="text" required className="lockin-input" placeholder="Your full name" autoComplete="name" />
              </FormField>

              {/* Email */}
              <FormField label="Email" required>
                <input name="email" type="email" required className="lockin-input" placeholder="your@email.com" autoComplete="email" />
              </FormField>

              {/* Phone */}
              <FormField label="Phone">
                <input name="phone" type="tel" className="lockin-input" placeholder="+1 (___) ___-____" autoComplete="tel" />
              </FormField>

              {/* Two-col: Company + Title */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Company">
                  <input name="company" type="text" className="lockin-input" placeholder="Business name" autoComplete="organization" />
                </FormField>
                <FormField label="Title">
                  <input name="title" type="text" className="lockin-input" placeholder="Your role" autoComplete="organization-title" />
                </FormField>
              </div>

              {/* Two-col: LinkedIn + Instagram */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="LinkedIn">
                  <input name="linkedin" type="text" className="lockin-input" placeholder="linkedin.com/in/..." />
                </FormField>
                <FormField label="Instagram">
                  <input name="instagram" type="text" className="lockin-input" placeholder="@handle" />
                </FormField>
              </div>

              {/* How did we connect? */}
              <FormField label="How did we connect?">
                <select
                  name="howWeMet"
                  className="lockin-select"
                  value={howWeMet}
                  onChange={(e) => { setHowWeMet(e.target.value); setSocialPlatform(""); }}
                >
                  {HOW_WE_MET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}{opt.value === "event" && eventInfo ? ` — ${eventInfo}` : ""}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Social platform sub-selector — only shows when "Social Media" is selected */}
              {howWeMet === "social" && (
                <div className="animate-fade-up" style={{ marginTop: "-4px" }}>
                  <FormField label="Which platform?">
                    <select
                      name="howWeMetDetail"
                      className="lockin-select"
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                    >
                      {SOCIAL_PLATFORMS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
              )}

              {/* Message */}
              <FormField label="Anything else?">
                <textarea
                  name="message"
                  className="lockin-input"
                  rows={3}
                  placeholder="A note, a question, or how I can help..."
                  style={{ resize: "vertical", minHeight: "80px" }}
                />
              </FormField>

              {/* Voice Note Recorder */}
              <VoiceRecorder
                audioBlob={audioBlob}
                onRecorded={setAudioBlob}
                onClear={() => setAudioBlob(null)}
              />

              {/* Submit */}
              <div className="pt-4">
                <button type="submit" disabled={submitting} className="btn-gold w-full">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Securing Connection...
                    </span>
                  ) : (
                    <><IconSend className="w-4 h-4" /> Lock In</>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center mt-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(245,240,234,0.25)", letterSpacing: "0.02em" }}>
              Your information is handled with care and never shared.
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SUCCESS VIEW
            ═══════════════════════════════════════════════ */}
        {view === "success" && (
          <div className="animate-scale-in text-center" style={{ paddingTop: "20vh" }}>
            <div className="mx-auto mb-8 flex items-center justify-center" style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(91,168,124,0.1)", border: "1px solid rgba(91,168,124,0.2)",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5BA87C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "30px", fontWeight: 600, color: "#B8A48A",
              letterSpacing: "0.04em", marginBottom: "12px",
            }}>
              Locked In
            </h2>

            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 300,
              color: "rgba(245,240,234,0.5)", lineHeight: 1.7,
              maxWidth: "300px", margin: "0 auto 40px", letterSpacing: "0.02em",
            }}>
              Your connection has been saved. Expect to hear from me soon.
            </p>

            <div className="gold-divider mx-auto" style={{ maxWidth: "120px", marginBottom: "40px" }} />

            <button onClick={() => { setView("card"); setAudioBlob(null); setHowWeMet(""); setSocialPlatform(""); }} className="btn-outline">
              Back to Card
            </button>

            <div className="mt-16">
              <LDLMonogram />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Form Field Wrapper
   ═══════════════════════════════════════════════════════════ */

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-2" style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px", fontWeight: 500,
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: "rgba(184,164,138,0.5)",
      }}>
        {label} {required && <span style={{ color: "#B8A48A" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
