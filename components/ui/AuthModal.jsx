// components/ui/AuthModal.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Icons } from "./Icons";
import { C } from "../../lib/constants";

// ── Input component ───────────────────────────────────────────────
function Field({ label, name, type = "text", value, onChange, error, placeholder, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const isPwd = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: C.muted }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={isPwd && showPwd ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={isPwd ? "current-password" : name === "email" ? "email" : "on"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: isPwd ? "13px 44px 13px 16px" : "13px 16px",
            borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 15,
            border: `1.5px solid ${error ? C.error : focused ? "rgba(0,184,150,0.55)" : C.border}`,
            background: focused ? "rgba(0,184,150,0.04)" : "rgba(255,255,255,0.03)",
            color: C.text, outline: "none", transition: "all .2s", boxSizing: "border-box",
          }}
        />
        {isPwd && (
          <button type="button" onClick={() => setShowPwd(s => !s)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.dim, padding: 0, display: "flex" }}>
            {showPwd ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.error }}>{error}</span>}
    </div>
  );
}

// ── Tab pill ──────────────────────────────────────────────────────
function TabPill({ active, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "11px", border: "none", borderRadius: 8,
      background: active ? "rgba(0,184,150,0.12)" : "transparent",
      color: active ? C.teal : C.muted,
      fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
      cursor: "pointer", transition: "all .2s",
    }}>
      {label}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN MODAL
// ════════════════════════════════════════════════════════════════════
export default function AuthModal() {
  const { modalOpen, modalTab, closeAuth, onAuthSuccess, isLoggedIn } = useAuth();

  const [tab,       setTab]      = useState(modalTab);
  const [loading,   setLoading]  = useState(false);
  const [apiError,  setApiError] = useState("");
  const [fields,    setFields]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [errs,      setErrs]     = useState({});
  const modalRef = useRef(null);

  // Sync tab when context changes
  useEffect(() => { setTab(modalTab); }, [modalTab]);

  // Reset errors when switching tabs
  useEffect(() => { setErrs({}); setApiError(""); }, [tab]);

  // Lock body scroll when open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  // Close on ESC
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") closeAuth(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [closeAuth]);

  // Close if already logged in
  useEffect(() => {
    if (isLoggedIn && modalOpen) closeAuth();
  }, [isLoggedIn, modalOpen, closeAuth]);

  const hf = e => setFields(p => ({ ...p, [e.target.name]: e.target.value }));

  // ── Validation ─────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (tab === "signup" && !fields.name.trim()) e.name = "Name is required.";
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Valid email required.";
    if (!fields.password || fields.password.length < 8) e.password = "At least 8 characters.";
    if (tab === "signup" && fields.password !== fields.confirm) e.confirm = "Passwords don't match.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────
  const submit = async () => {
    setApiError("");
    if (!validate()) return;
    setLoading(true);

    const endpoint = tab === "signup" ? "/api/auth/register" : "/api/auth/login";
    const body = tab === "signup"
      ? { name: fields.name.trim(), email: fields.email.trim(), password: fields.password }
      : { email: fields.email.trim(), password: fields.password };

    try {
      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Reset form
      setFields({ name: "", email: "", password: "", confirm: "" });
      setErrs({});

      // Notify context
      onAuthSuccess(data.user, data.token);

    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter") submit(); };

  if (!modalOpen) return null;

  // ── Responsive: bottom-sheet on mobile, centered on desktop ────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeAuth}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "fadeIn .2s ease",
        }}
      />

      {/* Modal panel */}
      <div
        ref={modalRef}
        style={{
          position: "fixed", zIndex: 1001,
          // Mobile: bottom sheet
          bottom: 0, left: 0, right: 0,
          borderRadius: "24px 24px 0 0",
          // Desktop override via media styles below
          animation: "slideUp .3s cubic-bezier(0.4,0,0.2,1)",
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderBottom: "none",
          padding: "28px 24px 40px",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
        className="auth-modal-panel"
      >
        {/* Drag handle (mobile) */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 24px" }} />

        {/* Close button */}
        <button onClick={closeAuth} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: C.dim, padding: 4 }}>
          <Icons.X size={20} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.BarChart size={14} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 800, color: C.text }}>
              AdForge <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence</span>
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", marginBottom: 28, overflow: "hidden" }}>
          <TabPill active={tab === "signup"} label="Create Account" onClick={() => setTab("signup")} />
          <TabPill active={tab === "login"}  label="Sign In"         onClick={() => setTab("login")} />
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            {tab === "signup" ? "Create your account." : "Welcome back."}
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.6 }}>
            {tab === "signup"
              ? "Create a free account to commission your report and track orders."
              : "Sign in to access your dashboard and track your reports."}
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tab === "signup" && (
            <Field label="Full Name" name="name" value={fields.name} onChange={hf} error={errs.name} placeholder="Your name" autoFocus />
          )}
          <Field label="Email" name="email" type="email" value={fields.email} onChange={hf} onKeyDown={handleKey} error={errs.email} placeholder="you@yourbrand.com" autoFocus={tab === "login"} />
          <Field label="Password" name="password" type="password" value={fields.password} onChange={hf} onKeyDown={handleKey} error={errs.password} placeholder={tab === "signup" ? "Min 8 characters" : "Your password"} />
          {tab === "signup" && (
            <Field label="Confirm Password" name="confirm" type="password" value={fields.confirm} onChange={hf} onKeyDown={handleKey} error={errs.confirm} placeholder="Repeat password" />
          )}

          {/* API Error */}
          {apiError && (
            <div style={{ padding: "12px 15px", borderRadius: 9, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.07)" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.error, margin: 0 }}>{apiError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            style={{
              padding: "15px", borderRadius: 11, border: "none",
              background: loading ? C.elevated : C.grad,
              color: loading ? C.muted : "#fff",
              fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 28px rgba(0,184,150,.28)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all .2s", width: "100%", marginTop: 4,
            }}
          >
            {loading
              ? <><span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,.25)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />{tab === "signup" ? "Creating account…" : "Signing in…"}</>
              : <>{tab === "signup" ? "Create Account →" : "Sign In →"}</>
            }
          </button>

          {/* Switch tab */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, textAlign: "center", margin: "4px 0 0" }}>
            {tab === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setTab(tab === "signup" ? "login" : "signup")}
              style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>
              {tab === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>

          {tab === "signup" && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim, textAlign: "center", margin: 0, lineHeight: 1.6 }}>
              By creating an account, you agree to our terms. Your data is stored securely.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        input::placeholder { color: rgba(240,242,255,0.28); }
        @media(min-width:600px){
          .auth-modal-panel{
            left:50% !important; right:auto !important; bottom:50% !important;
            transform:translate(-50%,50%) !important;
            border-radius:20px !important; border:1px solid rgba(255,255,255,0.08) !important;
            width:100%; max-width:440px;
            animation:zoomIn .25s ease !important;
          }
          @keyframes zoomIn{from{opacity:0;transform:translate(-50%,50%) scale(.95)}to{opacity:1;transform:translate(-50%,50%) scale(1)}}
        }
      `}</style>
    </>
  );
}
