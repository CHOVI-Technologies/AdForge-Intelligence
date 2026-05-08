// pages/confirm.jsx
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { useAuth } from "../context/AuthContext";
import { C, BRAND, PRICE } from "../lib/constants";

// ── Animated SVG checkmark ────────────────────────────────────────
function SuccessCheck() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 350); return () => clearTimeout(t); }, []);
  return (
    <div style={{ width: 84, height: 84, position: "relative", margin: "0 auto 28px" }}>
      <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,184,150,.16) 0%,transparent 70%)", animation: "pulse 3s ease infinite" }} />
      <svg viewBox="0 0 84 84" style={{ width: 84, height: 84 }}>
        <circle cx="42" cy="42" r="38" fill="rgba(0,184,150,0.1)" stroke="#00B896" strokeWidth="2" />
        <polyline
          points="24,42 36,55 60,28"
          fill="none" stroke="#00B896" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="58"
          strokeDashoffset={drawn ? 0 : 58}
          style={{ transition: "stroke-dashoffset 0.55s ease 0.15s" }}
        />
      </svg>
    </div>
  );
}

// ── Delivery timeline ─────────────────────────────────────────────
function Timeline({ orderRef }) {
  const steps = [
    { when: "Right now",       title: "Order confirmed",              body: `Your intake details received and slot secured. Reference: ${orderRef}`,         done: true },
    { when: "Within 2 hours",  title: "Intelligence gathering begins", body: "We identify high-performing campaigns in your exact market and category.",       done: false },
    { when: "Within 8 hours",  title: "Report compilation",           body: "Frameworks adapted to your brand and structured for immediate briefing.",         done: false },
    { when: "Within 12 hours", title: "Report delivered to inbox",    body: "Your complete PDF brief arrives — ready to brief your creative team immediately.", done: false },
  ];
  return (
    <div>
      {steps.map(({ when, title, body, done }, i) => (
        <div key={title} style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.grad : C.elevated, border: done ? "none" : `1px solid ${C.border}`, boxShadow: done ? "0 0 14px rgba(0,184,150,.28)" : "none", flexShrink: 0 }}>
              {done
                ? <Icons.Check size={15} color="#fff" />
                : <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.dim }} />
              }
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 1, flex: 1, minHeight: 22, background: done ? `linear-gradient(180deg,${C.teal},${C.border})` : C.border, margin: "4px 0" }} />
            )}
          </div>
          <div style={{ paddingBottom: i < steps.length - 1 ? 22 : 0 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".09em", color: done ? C.teal : C.dim, display: "block", marginBottom: 4 }}>
              {when.toUpperCase()}
            </span>
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
    ["Amount Paid",    `${PRICE.display} USD`],
    ["Order Ref",      orderRef],
    ["Transaction ID", transactionId || "—"],
    ["Delivery",       "Within 12 hours to your registered email"],
    ["Date",           date],
    ["Support",        BRAND.email],
  ];
  return (
    <>
      <style>{`@media print{.no-print{display:none!important}.print-receipt{background:white!important;color:black!important;border:1px solid #ddd!important}.print-receipt *{color:#333!important}}`}</style>
      <div className="print-receipt" style={{ borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ padding: "13px 20px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,184,150,.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

// ── Create account prompt (shown if not logged in) ────────────────
function CreateAccountPrompt({ email, orderRef, onDone }) {
  const { onAuthSuccess } = useAuth();
  const [name,    setName]    = useState("");
  const [pass,    setPass]    = useState("");
  const [pass2,   setPass2]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  const inp = { width: "100%", padding: "12px 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "rgba(255,255,255,.04)", color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" };

  const submit = async () => {
    if (!name.trim())     return setError("Name is required.");
    if (pass.length < 8)  return setError("Password must be at least 8 characters.");
    if (pass !== pass2)   return setError("Passwords don't match.");
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass, name, orderRef }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Registration failed.");
      if (data.token && typeof window !== "undefined") localStorage.setItem("af_token", data.token);
      onAuthSuccess(data.user, data.token);
      setDone(true);
      onDone && onDone();
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.teal, fontWeight: 600, marginBottom: 14 }}>✓ Account created! You can now track your orders.</p>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 9, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700 }}>
        Go to My Dashboard →
      </Link>
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
          {loading
            ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.25)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Creating account…</>
            : "Create Account & Track Orders →"
          }
        </button>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, textAlign: "center", margin: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: C.teal }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════
export default function ConfirmPage() {
  const router        = useRouter();
  const { user }      = useAuth();

  const [state,         setState]         = useState("loading");  // loading|verifying|success|cancelled|error
  const [orderRef,      setOrderRef]      = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [email,         setEmail]         = useState("");
  const [errorMsg,      setErrorMsg]      = useState("");
  const [accountDone,   setAccountDone]   = useState(false);
  const didVerify = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;           // CRITICAL — wait for query params
    if (didVerify.current) return;
    didVerify.current = true;

    const { status, tx_ref, transaction_id } = router.query;

    // Payment cancelled
    if (status === "cancelled") { setState("cancelled"); return; }

    // Pull values: URL params first, localStorage fallback
    const ref   = tx_ref          || (typeof window !== "undefined" ? localStorage.getItem("af_orderRef") || "" : "");
    const txId  = transaction_id  || "";
    const mail  = user?.email     || (typeof window !== "undefined" ? localStorage.getItem("af_email") || "" : "");

    setOrderRef(ref   || "AF-XXXXXXX");
    setTransactionId(txId);
    setEmail(mail);
    setState("verifying");

    // POST to our verify endpoint
    fetch("/api/verify-payment", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ transactionId: txId, orderRef: ref, email: mail, status: status || "successful" }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.cancelled) { setState("cancelled"); return; }
        if (data.success)   {
          setState("success");
          // Clean up localStorage
          if (typeof window !== "undefined") localStorage.removeItem("af_orderRef");
        } else {
          // If URL says successful, trust it even if our API had an error
          if (status === "successful" || !status) {
            setState("success");
          } else {
            setErrorMsg(data.error || "Payment verification failed.");
            setState("error");
          }
        }
      })
      .catch(() => {
        // Network error during verification — trust the Flutterwave redirect
        if (status === "successful" || !status) setState("success");
        else { setErrorMsg("Could not verify payment. Please contact support."); setState("error"); }
      });

  }, [router.isReady, router.query, user]);

  // ── Loading / Verifying ─────────────────────────────────────────
  if (state === "loading" || state === "verifying") {
    return (
      <>
        <Head><title>Verifying — AdForge Intelligence</title></Head>
        <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.teal}`, borderRadius: "50%", animation: "spin .9s linear infinite" }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted }}>
            {state === "loading" ? "Loading…" : "Verifying your payment…"}
          </p>
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        </div>
      </>
    );
  }

  // ── Cancelled ─────────────────────────────────────────────────
  if (state === "cancelled") {
    return (
      <>
        <Head><title>Payment Cancelled — AdForge Intelligence</title></Head>
        <Navbar />
        <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ maxWidth: 500, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(245,158,11,.2)", background: "rgba(245,158,11,.04)", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>⚠️</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Payment not completed.</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 30 }}>
              No charge was made. Your intake details are saved. Click below to try payment again.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/intake" style={{ padding: "13px 26px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>
                Try Again →
              </Link>
              <a href={`mailto:${BRAND.email}`} style={{ padding: "13px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                Contact Support
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Error ──────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <>
        <Head><title>Issue Detected — AdForge Intelligence</title></Head>
        <Navbar />
        <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ maxWidth: 500, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>❌</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Something went wrong.</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>{errorMsg}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, lineHeight: 1.7, marginBottom: 28 }}>
              If you completed payment, your order IS saved. Email us with your transaction ID and we'll resolve this immediately.
            </p>
            <a href={`mailto:${BRAND.email}?subject=Payment Issue - ${orderRef}`}
              style={{ display: "inline-block", padding: "13px 26px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>
              Contact Support →
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── SUCCESS ────────────────────────────────────────────────────
  const showAccountPrompt = !user && email && !accountDone;

  return (
    <>
      <Head>
        <title>Order Confirmed — AdForge Intelligence</title>
        <meta name="robots" content="noindex" />
      </Head>

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
              Our team has been notified. A confirmation email has been sent to{" "}
              <strong style={{ color: C.text }}>{email || "your registered email"}</strong>.
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
          <div style={{ padding: "28px 24px", borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 20, animation: "fadeUp .6s ease .15s both" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>What happens next</h2>
            <Timeline orderRef={orderRef} />
          </div>

          {/* Receipt */}
          <div style={{ marginBottom: 20, animation: "fadeUp .6s ease .2s both" }}>
            <Receipt orderRef={orderRef} transactionId={transactionId} email={email} />
          </div>

          {/* Create account prompt */}
          {showAccountPrompt && (
            <div style={{ padding: "26px 24px", borderRadius: 18, border: "1px solid rgba(0,184,150,.2)", background: "rgba(0,184,150,.04)", marginBottom: 20, animation: "fadeUp .6s ease .25s both" }} className="no-print">
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Track your report status</h3>
              <CreateAccountPrompt email={email} orderRef={orderRef} onDone={() => setAccountDone(true)} />
            </div>
          )}

          {/* Support */}
          <div style={{ padding: "24px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, animation: "fadeUp .6s ease .3s both" }} className="no-print">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14 }}>Need help?</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={`mailto:${BRAND.email}?subject=Support - ${orderRef}`}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 9, border: `1px solid ${C.border}`, color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                <Icons.Mail size={14} color={C.teal} /> {BRAND.email}
              </a>
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 9, border: "1px solid rgba(37,211,102,.2)", background: "rgba(37,211,102,.04)", color: "#25D366", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                <Icons.Msg size={14} color="#25D366" /> WhatsApp Support
              </a>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginTop: 14, lineHeight: 1.65 }}>
              Quote <strong style={{ color: C.text }}>{orderRef}</strong> in all correspondence.
            </p>
          </div>

          {/* Dashboard link */}
          {(user || accountDone) && (
            <div style={{ textAlign: "center", marginTop: 28 }} className="no-print">
              <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, boxShadow: "0 0 22px rgba(0,184,150,.22)" }}>
                View My Dashboard →
              </Link>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 28 }} className="no-print">
            <Link href="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim }}>← Return to homepage</Link>
          </div>

        </div>
      </main>

      <Footer />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
    { when: "Right now",       title: "Order confirmed",              body: `Your intake details received and slot secured. Reference: ${orderRef}`,         done: true },
    { when: "Within 2 hours",  title: "Intelligence gathering begins", body: "We identify high-performing campaigns in your exact market and category.",       done: false },
    { when: "Within 8 hours",  title: "Report compilation",           body: "Frameworks adapted to your brand and structured for immediate briefing.",         done: false },
    { when: "Within 12 hours", title: "Report delivered to inbox",    body: "Your complete PDF brief arrives — ready to brief your creative team immediately.", done: false },
  ];
  return (
    <div>
      {steps.map(({ when, title, body, done }, i) => (
        <div key={title} style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.grad : C.elevated, border: done ? "none" : `1px solid ${C.border}`, boxShadow: done ? "0 0 14px rgba(0,184,150,.28)" : "none", flexShrink: 0 }}>
              {done
                ? <Icons.Check size={15} color="#fff" />
                : <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.dim }} />
              }
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 1, flex: 1, minHeight: 22, background: done ? `linear-gradient(180deg,${C.teal},${C.border})` : C.border, margin: "4px 0" }} />
            )}
          </div>
          <div style={{ paddingBottom: i < steps.length - 1 ? 22 : 0 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".09em", color: done ? C.teal : C.dim, display: "block", marginBottom: 4 }}>
              {when.toUpperCase()}
            </span>
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
    ["Amount Paid",    `${PRICE.display} USD`],
    ["Order Ref",      orderRef],
    ["Transaction ID", transactionId || "—"],
    ["Delivery",       "Within 12 hours to your registered email"],
    ["Date",           date],
    ["Support",        BRAND.email],
  ];
  return (
    <>
      <style>{`@media print{.no-print{display:none!important}.print-receipt{background:white!important;color:black!important;border:1px solid #ddd!important}.print-receipt *{color:#333!important}}`}</style>
      <div className="print-receipt" style={{ borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ padding: "13px 20px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,184,150,.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

// ── Create account prompt (shown if not logged in) ────────────────
function CreateAccountPrompt({ email, orderRef, onDone }) {
  const { onAuthSuccess } = useAuth();
  const [name,    setName]    = useState("");
  const [pass,    setPass]    = useState("");
  const [pass2,   setPass2]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  const inp = { width: "100%", padding: "12px 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "rgba(255,255,255,.04)", color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" };

  const submit = async () => {
    if (!name.trim())     return setError("Name is required.");
    if (pass.length < 8)  return setError("Password must be at least 8 characters.");
    if (pass !== pass2)   return setError("Passwords don't match.");
    setError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass, name, orderRef }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Registration failed.");
      if (data.token && typeof window !== "undefined") localStorage.setItem("af_token", data.token);
      onAuthSuccess(data.user, data.token);
      setDone(true);
      onDone && onDone();
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.teal, fontWeight: 600, marginBottom: 14 }}>✓ Account created! You can now track your orders.</p>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 9, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700 }}>
        Go to My Dashboard →
      </Link>
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
          {loading
            ? <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.25)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Creating account…</>
            : "Create Account & Track Orders →"
          }
        </button>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, textAlign: "center", margin: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: C.teal }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════
export default function ConfirmPage() {
  const router        = useRouter();
  const { user }      = useAuth();

  const [state,         setState]         = useState("loading");  // loading|verifying|success|cancelled|error
  const [orderRef,      setOrderRef]      = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [email,         setEmail]         = useState("");
  const [errorMsg,      setErrorMsg]      = useState("");
  const [accountDone,   setAccountDone]   = useState(false);
  const didVerify = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;           // CRITICAL — wait for query params
    if (didVerify.current) return;
    didVerify.current = true;

    const { status, tx_ref, transaction_id } = router.query;

    // Payment cancelled
    if (status === "cancelled") { setState("cancelled"); return; }

    // Pull values: URL params first, localStorage fallback
    const ref   = tx_ref          || (typeof window !== "undefined" ? localStorage.getItem("af_orderRef") || "" : "");
    const txId  = transaction_id  || "";
    const mail  = user?.email     || (typeof window !== "undefined" ? localStorage.getItem("af_email") || "" : "");

    setOrderRef(ref   || "AF-XXXXXXX");
    setTransactionId(txId);
    setEmail(mail);
    setState("verifying");

    // POST to our verify endpoint
    fetch("/api/verify-payment", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ transactionId: txId, orderRef: ref, email: mail, status: status || "successful" }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.cancelled) { setState("cancelled"); return; }
        if (data.success)   {
          setState("success");
          // Clean up localStorage
          if (typeof window !== "undefined") localStorage.removeItem("af_orderRef");
        } else {
          // If URL says successful, trust it even if our API had an error
          if (status === "successful" || !status) {
            setState("success");
          } else {
            setErrorMsg(data.error || "Payment verification failed.");
            setState("error");
          }
        }
      })
      .catch(() => {
        // Network error during verification — trust the Flutterwave redirect
        if (status === "successful" || !status) setState("success");
        else { setErrorMsg("Could not verify payment. Please contact support."); setState("error"); }
      });

  }, [router.isReady, router.query, user]);

  // ── Loading / Verifying ─────────────────────────────────────────
  if (state === "loading" || state === "verifying") {
    return (
      <>
        <Head><title>Verifying — AdForge Intelligence</title></Head>
        <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.teal}`, borderRadius: "50%", animation: "spin .9s linear infinite" }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted }}>
            {state === "loading" ? "Loading…" : "Verifying your payment…"}
          </p>
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        </div>
      </>
    );
  }

  // ── Cancelled ─────────────────────────────────────────────────
  if (state === "cancelled") {
    return (
      <>
        <Head><title>Payment Cancelled — AdForge Intelligence</title></Head>
        <Navbar />
        <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ maxWidth: 500, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(245,158,11,.2)", background: "rgba(245,158,11,.04)", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>⚠️</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Payment not completed.</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 30 }}>
              No charge was made. Your intake details are saved. Click below to try payment again.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/intake" style={{ padding: "13px 26px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>
                Try Again →
              </Link>
              <a href={`mailto:${BRAND.email}`} style={{ padding: "13px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                Contact Support
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Error ──────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <>
        <Head><title>Issue Detected — AdForge Intelligence</title></Head>
        <Navbar />
        <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ maxWidth: 500, width: "100%", padding: "48px 32px", borderRadius: 20, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>❌</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Something went wrong.</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>{errorMsg}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, lineHeight: 1.7, marginBottom: 28 }}>
              If you completed payment, your order IS saved. Email us with your transaction ID and we'll resolve this immediately.
            </p>
            <a href={`mailto:${BRAND.email}?subject=Payment Issue - ${orderRef}`}
              style={{ display: "inline-block", padding: "13px 26px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>
              Contact Support →
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── SUCCESS ────────────────────────────────────────────────────
  const showAccountPrompt = !user && email && !accountDone;

  return (
    <>
      <Head>
        <title>Order Confirmed — AdForge Intelligence</title>
        <meta name="robots" content="noindex" />
      </Head>

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
              Our team has been notified. A confirmation email has been sent to{" "}
              <strong style={{ color: C.text }}>{email || "your registered email"}</strong>.
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
          <div style={{ padding: "28px 24px", borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 20, animation: "fadeUp .6s ease .15s both" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>What happens next</h2>
            <Timeline orderRef={orderRef} />
          </div>

          {/* Receipt */}
          <div style={{ marginBottom: 20, animation: "fadeUp .6s ease .2s both" }}>
            <Receipt orderRef={orderRef} transactionId={transactionId} email={email} />
          </div>

          {/* Create account prompt */}
          {showAccountPrompt && (
            <div style={{ padding: "26px 24px", borderRadius: 18, border: "1px solid rgba(0,184,150,.2)", background: "rgba(0,184,150,.04)", marginBottom: 20, animation: "fadeUp .6s ease .25s both" }} className="no-print">
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Track your report status</h3>
              <CreateAccountPrompt email={email} orderRef={orderRef} onDone={() => setAccountDone(true)} />
            </div>
          )}

          {/* Support */}
          <div style={{ padding: "24px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, animation: "fadeUp .6s ease .3s both" }} className="no-print">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14 }}>Need help?</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={`mailto:${BRAND.email}?subject=Support - ${orderRef}`}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 9, border: `1px solid ${C.border}`, color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                <Icons.Mail size={14} color={C.teal} /> {BRAND.email}
              </a>
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 9, border: "1px solid rgba(37,211,102,.2)", background: "rgba(37,211,102,.04)", color: "#25D366", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                <Icons.Msg size={14} color="#25D366" /> WhatsApp Support
              </a>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginTop: 14, lineHeight: 1.65 }}>
              Quote <strong style={{ color: C.text }}>{orderRef}</strong> in all correspondence.
            </p>
          </div>

          {/* Dashboard link */}
          {(user || accountDone) && (
            <div style={{ textAlign: "center", marginTop: 28 }} className="no-print">
              <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, boxShadow: "0 0 22px rgba(0,184,150,.22)" }}>
                View My Dashboard →
              </Link>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 28 }} className="no-print">
            <Link href="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim }}>← Return to homepage</Link>
          </div>

        </div>
      </main>

      <Footer />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
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
