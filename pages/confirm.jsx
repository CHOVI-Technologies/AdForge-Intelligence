import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { BRAND, LINKS, PRICE, COLORS } from "../lib/constants";

const C = COLORS;

// ── Generate a short order reference ───────────────────────────
function genOrderRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "AF-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ── Success Checkmark Animation ─────────────────────────────────
function SuccessIcon() {
  return (
    <div style={{ width: 80, height: 80, position: "relative", margin: "0 auto 32px" }}>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: -8,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,184,150,0.2) 0%, transparent 70%)",
        animation: "scalePulse 3s ease infinite",
      }} />
      {/* Circle */}
      <svg viewBox="0 0 80 80" style={{ width: 80, height: 80 }}>
        <circle cx="40" cy="40" r="36"
          fill="none"
          stroke="rgba(0,184,150,0.2)"
          strokeWidth="2"
        />
        <circle cx="40" cy="40" r="36"
          fill="rgba(0,184,150,0.1)"
          stroke="#00B896"
          strokeWidth="2"
          strokeDasharray="226"
          strokeDashoffset="0"
          style={{ animation: "fadeIn 0.5s ease 0.2s both" }}
        />
        {/* Checkmark */}
        <polyline
          points="24,40 35,52 56,28"
          fill="none"
          stroke="#00B896"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="50"
          strokeDashoffset="0"
          style={{ animation: "checkIn 0.5s ease 0.4s both" }}
        />
      </svg>
    </div>
  );
}

// ── Timeline ─────────────────────────────────────────────────────
function Timeline({ orderRef }) {
  const steps = [
    {
      icon: <Icons.CheckCircle size={18} />,
      label: "Right now",
      title: "Order confirmed",
      body: `Your intake details have been received and your slot secured. Reference: ${orderRef}`,
      done: true,
    },
    {
      icon: <Icons.Search size={18} />,
      label: "Within 2 hours",
      title: "Intelligence gathering begins",
      body: "We identify and analyse high-performing campaigns in your exact market and category.",
      done: false,
    },
    {
      icon: <Icons.Pencil size={18} />,
      label: "Within 8 hours",
      title: "Report compilation",
      body: "Frameworks are deconstructed, adapted to your brand, and structured for immediate briefing.",
      done: false,
    },
    {
      icon: <Icons.Zap size={18} />,
      label: "Within 12 hours",
      title: "Report delivered to your inbox",
      body: "Your complete intelligence brief arrives as a structured PDF, ready to act on immediately.",
      done: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map(({ icon, label, title, body, done }, i) => (
        <div key={title} style={{ display: "flex", gap: 20 }}>
          {/* Left: dot + line */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: "50%",
              background: done ? "linear-gradient(135deg,#00B896,#0066CC)" : C.bgElevated,
              border: done ? "none" : "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: done ? "#fff" : C.textDim,
              flexShrink: 0,
              boxShadow: done ? "0 0 16px rgba(0,184,150,0.3)" : "none",
            }}>
              {icon}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 1, flex: 1, background: i === 0 ? "linear-gradient(180deg,#00B896,rgba(255,255,255,0.06))" : "rgba(255,255,255,0.06)", marginTop: 4, marginBottom: 4 }} />
            )}
          </div>
          {/* Right: content */}
          <div style={{ paddingBottom: i < steps.length - 1 ? 28 : 0 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: done ? C.teal : C.textDim }}>
              {label.toUpperCase()}
            </span>
            <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: C.text, margin: "5px 0 7px" }}>
              {title}
            </h4>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.75 }}>
              {body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Printable Confirmation ───────────────────────────────────────
function PrintReceipt({ orderRef, txRef }) {
  const handlePrint = () => window.print();
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-receipt { background: white !important; color: black !important; border: 1px solid #ddd !important; }
        }
      `}</style>
      <div className="print-receipt" style={{ padding: "24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: C.bgSurface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.textDim, marginBottom: 6 }}>
              ORDER CONFIRMATION
            </p>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text }}>
              Ad Intelligence Report
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginBottom: 4 }}>Amount paid</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg,#C9A84C,#E8C876)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {PRICE.display}
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "grid", gap: 8 }}>
          {[
            ["Order Reference", orderRef],
            ["Transaction ID", txRef || "—"],
            ["Service", "Precision Ad Intelligence Report"],
            ["Delivery", "Within 12 hours to your registered email"],
            ["Date", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
            ["Support", BRAND.email],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textDim, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textMuted, textAlign: "right", wordBreak: "break-all" }}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={handlePrint} className="no-print" style={{
          marginTop: 20, width: "100%", padding: "12px",
          borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent", color: C.textMuted,
          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = C.textMuted; }}
        >
          <Icons.Download size={14} /> Print / Save as PDF
        </button>
      </div>
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function ConfirmPage() {
  const router = useRouter();
  const [orderRef] = useState(genOrderRef);
  const [txRef, setTxRef] = useState("");
  const [status, setStatus] = useState("unknown");

  useEffect(() => {
    const { status: st, tx_ref, transaction_id } = router.query;
    if (st) setStatus(st);
    if (tx_ref || transaction_id) setTxRef(tx_ref || transaction_id);
  }, [router.query]);

  const failed = status === "cancelled" || status === "failed";

  return (
    <>
      <Head>
        <title>{failed ? "Payment Cancelled" : "Order Confirmed"} — AdForge Intelligence</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />

      <main style={{ padding: "52px 24px 96px", minHeight: "calc(100vh - 70px)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {failed ? (
            /* ── Failed State ── */
            <div style={{ textAlign: "center", padding: "60px 40px", borderRadius: 20, border: "1px solid rgba(255,100,100,0.2)", background: "rgba(255,100,100,0.04)" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 16 }}>
                Payment was not completed.
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginBottom: 36 }}>
                No charge was made. You can return to the payment page to try again, or contact us if you encountered an issue.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={LINKS.intake} style={{ padding: "13px 28px", borderRadius: 10, background: "linear-gradient(135deg,#00B896,#0066CC)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  Try Again
                </a>
                <a href={`mailto:${BRAND.email}`} style={{ padding: "13px 28px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: C.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  Contact Support
                </a>
              </div>
            </div>
          ) : (
            /* ── Success State ── */
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 52, animation: "fadeUp 0.6s ease both" }}>
                <SuccessIcon />
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 16 }}>
                  Order received.<br />
                  <span style={{ background: "linear-gradient(135deg,#00B896,#0066CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Your report is in motion.
                  </span>
                </h1>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
                  Our team has been notified and your intelligence brief is being compiled. You'll receive it at your registered email within 12 hours.
                </p>
              </div>

              {/* Order Ref Banner */}
              <div style={{ padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 36, animation: "fadeUp 0.6s ease 0.1s both" }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gold, marginBottom: 4 }}>YOUR ORDER REFERENCE</p>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: "0.06em" }}>{orderRef}</p>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textDim }}>
                  Keep this reference for support queries.
                </p>
              </div>

              {/* What Happens Next */}
              <div style={{ padding: "36px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)", background: C.bgSurface, marginBottom: 24, animation: "fadeUp 0.6s ease 0.15s both" }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 30 }}>
                  What happens next
                </h2>
                <Timeline orderRef={orderRef} />
              </div>

              {/* Receipt */}
              <div style={{ marginBottom: 24, animation: "fadeUp 0.6s ease 0.2s both" }}>
                <PrintReceipt orderRef={orderRef} txRef={txRef} />
              </div>

              {/* Support */}
              <div style={{ padding: "28px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: C.bgSurface, animation: "fadeUp 0.6s ease 0.25s both" }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>
                  Need help?
                </h3>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <a href={`mailto:${BRAND.supportEmail}?subject=Support - ${orderRef}`} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 20px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                    color: C.textMuted, fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,184,150,0.4)"; e.currentTarget.style.color = C.teal; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = C.textMuted; }}
                  >
                    <Icons.Mail size={15} /> {BRAND.supportEmail}
                  </a>
                  <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 20px", borderRadius: 9,
                    border: "1px solid rgba(37,211,102,0.2)", background: "rgba(37,211,102,0.04)",
                    color: "#25D366", fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                  }}>
                    <Icons.MessageCircle size={15} /> WhatsApp Support
                  </a>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 16, lineHeight: 1.6 }}>
                  Quote your order reference <strong style={{ color: C.text }}>{orderRef}</strong> in all correspondence for faster resolution.
                </p>
              </div>

              {/* Return home */}
              <div style={{ textAlign: "center", marginTop: 36, animation: "fadeUp 0.6s ease 0.3s both" }}>
                <Link href={LINKS.home} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textDim, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.teal}
                  onMouseLeave={e => e.target.style.color = C.textDim}
                >
                  ← Return to homepage
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
