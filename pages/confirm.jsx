// pages/confirm.jsx — FIXED
// Handles THREE arrival modes:
// Mode A: ?status=successful&tx_ref=AF-XXX&transaction_id=12345  (card / fast callback)
// Mode B: ?ref=AF-XXX                                            (bank transfer / USSD polling)
// Mode C: ?status=cancelled                                      (user cancelled)

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { useAuth } from "../context/AuthContext";
import { C, BRAND, PRICE } from "../lib/constants";

const POLL_INTERVAL = 5000;   // 5 seconds between polls
const POLL_MAX      = 36;     // 36 × 5s = 3 minutes max polling
const POLL_FAST_END = 12;     // After 12 polls (60s), show "processing" notice

// ── Animated checkmark ─────────────────────────────────────────────
function SuccessCheck() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 350); return () => clearTimeout(t); }, []);
  return (
    <div style={{ width: 84, height: 84, position: "relative", margin: "0 auto 28px" }}>
      <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,184,150,.16) 0%,transparent 70%)", animation: "pulse 3s ease infinite" }} />
      <svg viewBox="0 0 84 84" style={{ width: 84, height: 84 }}>
        <circle cx="42" cy="42" r="38" fill="rgba(0,184,150,0.1)" stroke="#00B896" strokeWidth="2" />
        <polyline points="24,42 36,55 60,28" fill="none" stroke="#00B896" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="58" strokeDashoffset={drawn ? 0 : 58}
          style={{ transition: "stroke-dashoffset 0.55s ease 0.15s" }} />
      </svg>
    </div>
  );
}

// ── Delivery timeline ─────────────────────────────────────────────
function Timeline({ orderRef }) {
  const steps = [
    { when: "Right now",       title: "Order confirmed",              body: "Intake details received and slot secured. Reference: " + orderRef, done: true  },
    { when: "Within 2 hours",  title: "Intelligence gathering begins", body: "We identify high-performing campaigns in your exact market.",       done: false },
    { when: "Within 8 hours",  title: "Report compilation",           body: "Frameworks adapted to your brand and structured for briefing.",     done: false },
    { when: "Within 12 hours", title: "Report delivered to inbox",    body: "Your complete PDF brief arrives — ready to act on immediately.",    done: false },
  ];
  return (
    <div>
      {steps.map(({ when, title, body, done }, i) => (
        <div key={title} style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.grad : C.elevated, border: done ? "none" : "1px solid " + C.border, boxShadow: done ? "0 0 14px rgba(0,184,150,.28)" : "none", flexShrink: 0 }}>
              {done ? <Icons.Check size={15} color="#fff" /> : <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.dim }} />}
            </div>
            {i < 3 && <div style={{ width: 1, flex: 1, minHeight: 22, background: done ? "linear-gradient(180deg," + C.teal + "," + C.border + ")" : C.border, margin: "4px 0" }} />}
          </div>
          <div style={{ paddingBottom: i < 3 ? 22 : 0 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".09em", color: done ? C.teal : C.dim, display: "block", marginBottom: 4 }}>{when.toUpperCase()}</span>
            <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 5px" }}>{title}</h4>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.75, margin: 0 }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Printable receipt ─────────────────────────────────────────────
function Receipt({ orderRef, transactionId, email }) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const rows = [
    ["Service",        "Ad Intelligence Report"],
    ["Amount Paid",    PRICE.display + " " + PRICE.currency],
    ["Order Ref",      orderRef],
    ["Transaction ID", transactionId || "—"],
    ["Delivery",       "Within 12 hours to your registered email"],
    ["Date",           date],
    ["Support",        BRAND.email],
  ];
  return (
    <>
      <style>{"@media print{.no-print{display:none!important}.print-card{background:white!important;border:1px solid #ddd!important}.print-card *{color:#333!important}}"}</style>
      <div className="print-card" style={{ borderRadius: 14, border: "1px solid " + C.border, overflow: "hidden" }}>
        <div style={{ padding: "13px 20px", borderBottom: "1px solid " + C.border, background: "rgba(0,184,150,.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: C.teal }}>ORDER RECEIPT</span>
          <button onClick={() => window.print()} className="no-print"
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: C.dim, fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: 0 }}>
            <Icons.Download size={13} color={C.dim} /> Print / Save PDF
          </button>
        </div>
        {rows.map(([label, value], i) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 20px", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)", gap: 14 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, flexShrink: 0 }}>{label}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, textAlign: "right", wordBreak: "break-all" }}>{value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Create account prompt ─────────────────────────────────────────
function CreateAccountPrompt({ email, orderRef, onDone }) {
  const { onAuthSuccess } = useAuth();
  const [name, setName]     = useState("");
  const [pass, setPass]     = useState("");
  const [pass2, setPass2]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 9, border: "1px solid " + C.border, background: "rgba(255,255,255,.04)", color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" };

  const submit = async () => {
    if (!name.trim())    return setError("Name is required.");
    if (pass.length < 8) return setError("Password must be at least 8 characters.");
    if (pass !== pass2)  return setError("Passwords don't match.");
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: pass, name, orderRef }) });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Registration failed.");
      if (data.token && typeof window !== "undefined") localStorage.setItem("af_token", data.token);
      onAuthSuccess(data.user, data.token);
      setDone(true);
      onDone && onDone();
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.teal, fontWeight: 600, marginBottom: 14 }}>✓ Account created!</p>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 9, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700 }}>Go to My Dashboard →</Link>
    </div>
  );

  return (
    <div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 18 }}>
        Create a free account to track this order and access future reports. Email: <strong style={{ color: C.text }}>{email}</strong>
      </p>
      <div style={{ display: "grid", gap: 13 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inp} />
        <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Create a password (min 8 characters)" style={inp} />
        <input value={pass2} onChange={e => setPass2(e.target.value)} type="password" placeholder="Confirm password" style={inp} />
        {error && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.error, margin: 0 }}>{error}</p>}
        <button onClick={submit} disabled={loading}
          style={{ padding: "13px", borderRadius: 10, border: "none", background: loading ? C.elevated : C.grad, color: loading ? C.muted : "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.25)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Creating…</> : "Create Account & Track Orders →"}
        </button>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, textAlign: "center", margin: 0 }}>
          Already have an account? <Link href="/login" style={{ color: C.teal }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════
export default function ConfirmPage() {
  const router   = useRouter();
  const { user } = useAuth();

  // States: loading → verifying | polling → success | cancelled | error | timeout
  const [state,         setState]         = useState("loading");
  const [orderRef,      setOrderRef]      = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [email,         setEmail]         = useState("");
  const [errorMsg,      setErrorMsg]      = useState("");
  const [pollCount,     setPollCount]     = useState(0);
  const [accountDone,   setAccountDone]   = useState(false);
  const didInit   = useRef(false);
  const pollTimer = useRef(null);

  // ── Poll Google Sheets for payment status ─────────────────────
  const startPolling = (ref) => {
    let count = 0;

    const poll = async () => {
      count++;
      setPollCount(count);
      console.log("[confirm] poll #" + count + " for ref=" + ref);

      try {
        const res  = await fetch("/api/check-payment?ref=" + encodeURIComponent(ref));
        const data = await res.json();

        if (data.paymentStatus === "successful") {
          clearInterval(pollTimer.current);
          setTransactionId(data.transactionId || "");
          setEmail(prev => prev || data.email || "");
          setState("success");
          // Clean up
          if (typeof window !== "undefined") {
            localStorage.removeItem("af_orderRef");
            localStorage.removeItem("af_transactionId");
          }
          return;
        }

        if (count >= POLL_MAX) {
          clearInterval(pollTimer.current);
          setState("timeout");
        }
      } catch (err) {
        console.error("[confirm] poll error:", err.message);
        if (count >= POLL_MAX) { clearInterval(pollTimer.current); setState("timeout"); }
      }
    };

    // First poll immediately, then repeat
    poll();
    pollTimer.current = setInterval(poll, POLL_INTERVAL);
  };

  useEffect(() => {
    return () => { if (pollTimer.current) clearInterval(pollTimer.current); };
  }, []);

  // ── Initialise from URL params ────────────────────────────────
  useEffect(() => {
    if (!router.isReady) return;   // CRITICAL — wait for Next.js router
    if (didInit.current) return;
    didInit.current = true;

    const { status, tx_ref, transaction_id, ref } = router.query;

    // Mode C: cancelled
    if (status === "cancelled") { setState("cancelled"); return; }

    // Resolve order ref from URL or localStorage
    const resolvedRef = tx_ref || ref || (typeof window !== "undefined" ? localStorage.getItem("af_orderRef") || "" : "");
    const resolvedTx  = transaction_id || (typeof window !== "undefined" ? localStorage.getItem("af_transactionId") || "" : "");
    const resolvedEmail = user?.email || (typeof window !== "undefined" ? localStorage.getItem("af_email") || "" : "");

    setOrderRef(resolvedRef || "AF-XXXXXXX");
    setTransactionId(resolvedTx);
    setEmail(resolvedEmail);

    // Mode A: Full params — card payment or successful callback
    if ((status === "successful" || status === "completed") && (tx_ref || resolvedTx)) {
      setState("verifying");

      fetch("/api/verify-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: resolvedTx || transaction_id, orderRef: resolvedRef, email: resolvedEmail, status }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.cancelled) { setState("cancelled"); return; }
          if (data.success)   { setState("success"); if (typeof window !== "undefined") { localStorage.removeItem("af_orderRef"); localStorage.removeItem("af_transactionId"); } }
          else                { setState(status === "successful" ? "success" : "error"); setErrorMsg(data.error || "Verification failed."); }
        })
        .catch(() => { setState("success"); }); // Trust FW redirect on API error
      return;
    }

    // Mode B: Only ref — bank transfer / USSD polling
    if (resolvedRef && resolvedRef.startsWith("AF-")) {
      setState("polling");
      startPolling(resolvedRef);
      return;
    }

    // Fallback — no useful params
    setState("error");
    setErrorMsg("Payment parameters missing. If you completed payment, contact support.");

  }, [router.isReady, router.query, user]);

  // ── Loading ────────────────────────────────────────────────────
  if (state === "loading" || state === "verifying") return (
    <>
      <Head><title>Verifying — AdForge Intelligence</title></Head>
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
        <div style={{ width: 44, height: 44, border: "3px solid " + C.border, borderTop: "3px solid " + C.teal, borderRadius: "50%", animation: "spin .9s linear infinite" }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted }}>{state === "loading" ? "Loading…" : "Verifying your payment…"}</p>
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    </>
  );

  // ── Polling (bank transfer waiting) ───────────────────────────
  if (state === "polling") return (
    <>
      <Head><title>Confirming Payment — AdForge Intelligence</title></Head>
      <Navbar />
      <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
          {/* Spinning ring */}
          <div style={{ width: 72, height: 72, margin: "0 auto 28px", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid " + C.border }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTop: "3px solid " + C.teal, animation: "spin .9s linear infinite" }} />
            <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: C.tealDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.Clock size={22} color={C.teal} />
            </div>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Confirming your payment…</h1>

          {pollCount <= POLL_FAST_END ? (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 24 }}>
              We're waiting for your bank transfer to be confirmed. This usually takes under 60 seconds. Please stay on this page.
            </p>
          ) : (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 24 }}>
              Your payment is being processed. Bank transfers can occasionally take a few minutes. You'll be redirected automatically once confirmed.
            </p>
          )}

          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal, opacity: pollCount % 3 === i ? 1 : 0.25, transition: "opacity .3s" }} />
            ))}
          </div>

          <div style={{ padding: "14px 20px", borderRadius: 11, border: "1px solid " + C.border, background: C.surface, marginBottom: 16 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, margin: 0 }}>
              Order reference: <strong style={{ color: C.text }}>{orderRef}</strong>
            </p>
          </div>

          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, lineHeight: 1.65 }}>
            Transferred but this page isn't updating?{" "}
            <a href={"mailto:" + BRAND.email + "?subject=Payment Confirmation - " + orderRef} style={{ color: C.teal }}>Contact support →</a>
          </p>
        </div>
      </main>
      <Footer />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}"}</style>
    </>
  );

  // ── Timeout ────────────────────────────────────────────────────
  if (state === "timeout") return (
    <>
      <Head><title>Payment Processing — AdForge Intelligence</title></Head>
      <Navbar />
      <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 520, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(201,168,76,.22)", background: "rgba(201,168,76,.04)", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 18 }}>⏳</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Payment is being processed.</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>
            Your bank transfer has been submitted but hasn't been confirmed yet. This can take a few minutes.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
            <strong style={{ color: C.text }}>You don't need to do anything.</strong> Once your payment clears, we'll begin working on your report immediately and send confirmation to <strong style={{ color: C.text }}>{email}</strong>.
          </p>
          <div style={{ padding: "14px 20px", borderRadius: 11, border: "1px solid rgba(201,168,76,.2)", background: "rgba(201,168,76,.06)", marginBottom: 24 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, margin: "0 0 4px" }}>Order Reference</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: C.text }}>{orderRef}</p>
          </div>
          <a href={"mailto:" + BRAND.email + "?subject=Payment Check - " + orderRef}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Contact Support →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );

  // ── Cancelled ──────────────────────────────────────────────────
  if (state === "cancelled") return (
    <>
      <Head><title>Payment Cancelled — AdForge Intelligence</title></Head>
      <Navbar />
      <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 500, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(245,158,11,.2)", background: "rgba(245,158,11,.04)", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 18 }}>⚠️</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Payment not completed.</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>No charge was made. Your intake details are saved. Click below to try again.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/intake" style={{ padding: "13px 26px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>Try Again →</Link>
            <a href={"mailto:" + BRAND.email} style={{ padding: "13px 22px", borderRadius: 10, border: "1px solid " + C.border, color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, textDecoration: "none" }}>Contact Support</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  // ── Error ──────────────────────────────────────────────────────
  if (state === "error") return (
    <>
      <Head><title>Issue Detected — AdForge Intelligence</title></Head>
      <Navbar />
      <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 500, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 18 }}>❌</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Something went wrong.</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>{errorMsg}</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, lineHeight: 1.7, marginBottom: 28 }}>If you completed payment, your order IS saved. Email us with your reference and we'll resolve immediately.</p>
          <a href={"mailto:" + BRAND.email + "?subject=Payment Issue - " + orderRef}
            style={{ display: "inline-block", padding: "13px 26px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Contact Support →
          </a>
        </div>
      </main>
      <Footer />
    </>
  );

  // ── SUCCESS ────────────────────────────────────────────────────
  const showAccountPrompt = !user && email && !accountDone;

  return (
    <>
      <Head><title>Order Confirmed — AdForge Intelligence</title><meta name="robots" content="noindex" /></Head>
      <Navbar />
      <main style={{ background: C.bg, padding: "48px 20px 88px" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp .6s ease both" }}>
            <SuccessCheck />
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: C.text, letterSpacing: "-.025em", lineHeight: 1.1, marginBottom: 16 }}>
              Order received.<br />
              <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your report is in motion.</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, maxWidth: 460, margin: "0 auto" }}>
              Our team has been notified. Confirmation sent to <strong style={{ color: C.text }}>{email || "your email"}</strong>.
            </p>
          </div>

          {/* Order ref */}
          <div style={{ padding: "15px 20px", borderRadius: 11, border: "1px solid rgba(201,168,76,.25)", background: "rgba(201,168,76,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 24, animation: "fadeUp .6s ease .1s both" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".09em", color: C.gold, marginBottom: 4 }}>YOUR ORDER REFERENCE</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: ".05em" }}>{orderRef}</p>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim }}>Quote this in all support queries.</p>
          </div>

          {/* Timeline */}
          <div style={{ padding: "28px 24px", borderRadius: 18, border: "1px solid " + C.border, background: C.surface, marginBottom: 20, animation: "fadeUp .6s ease .15s both" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>What happens next</h2>
            <Timeline orderRef={orderRef} />
          </div>

          {/* Receipt */}
          <div style={{ marginBottom: 20, animation: "fadeUp .6s ease .2s both" }}>
            <Receipt orderRef={orderRef} transactionId={transactionId} email={email} />
          </div>

          {/* Create account */}
          {showAccountPrompt && (
            <div style={{ padding: "26px 24px", borderRadius: 18, border: "1px solid rgba(0,184,150,.2)", background: "rgba(0,184,150,.04)", marginBottom: 20, animation: "fadeUp .6s ease .25s both" }} className="no-print">
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Track your report status</h3>
              <CreateAccountPrompt email={email} orderRef={orderRef} onDone={() => setAccountDone(true)} />
            </div>
          )}

          {/* Analytics CTA */}
          {(user || accountDone) && (
            <div style={{ padding: "22px 24px", borderRadius: 16, border: "1px solid rgba(0,184,150,.2)", background: "rgba(0,184,150,.04)", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, animation: "fadeUp .6s ease .28s both" }} className="no-print">
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Track your report performance</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>Log your ROAS, CTR, and revenue results after testing.</p>
              </div>
              <Link href={"/analytics?ref=" + orderRef} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Performance Tracker →
              </Link>
            </div>
          )}

          {/* Support */}
          <div style={{ padding: "24px", borderRadius: 16, border: "1px solid " + C.border, background: C.surface, animation: "fadeUp .6s ease .3s both" }} className="no-print">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14 }}>Need help?</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={"mailto:" + BRAND.email + "?subject=Support - " + orderRef}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 9, border: "1px solid " + C.border, color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13, textDecoration: "none" }}>
                <Icons.Mail size={14} color={C.teal} /> {BRAND.email}
              </a>
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 9, border: "1px solid rgba(37,211,102,.2)", background: "rgba(37,211,102,.04)", color: "#25D366", fontFamily: "'DM Sans',sans-serif", fontSize: 13, textDecoration: "none" }}>
                <Icons.Msg size={14} color="#25D366" /> WhatsApp
              </a>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginTop: 14 }}>
              Quote <strong style={{ color: C.text }}>{orderRef}</strong> in all correspondence.
            </p>
          </div>

          {(user || accountDone) && (
            <div style={{ textAlign: "center", marginTop: 28 }} className="no-print">
              <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, boxShadow: "0 0 22px rgba(0,184,150,.22)", textDecoration: "none" }}>
                View My Dashboard →
              </Link>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 24 }} className="no-print">
            <Link href="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim }}>← Return to homepage</Link>
          </div>
        </div>
      </main>
      <Footer />
      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}} @keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </>
  );
}
