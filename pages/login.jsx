/**
 * AdForge Intelligence — Login / Register Page
 * pages/login.jsx
 *
 * Single page with toggle between Login and Register.
 * On success, stores JWT in localStorage + redirects to /dashboard.
 */

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const C = {
  bg: "#06081A", surface: "#0C0F24", border: "rgba(255,255,255,0.07)",
  teal: "#00B896", gold: "#C9A84C", text: "#F0F2FF",
  muted: "rgba(240,242,255,0.55)", dim: "rgba(240,242,255,0.28)",
  grad: "linear-gradient(135deg,#00B896 0%,#0066CC 100%)",
  error: "#FF6B6B",
};

const inp = (err) => ({
  width: "100%", padding: "13px 16px", borderRadius: 9,
  border: `1px solid ${err ? C.error : "rgba(255,255,255,0.1)"}`,
  background: "rgba(255,255,255,0.04)", color: C.text,
  fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none",
  boxSizing: "border-box",
});

export default function LoginPage() {
  const router = useRouter();
  const [mode,     setMode]     = useState("login"); // "login" | "register"
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [fieldErrs,setFieldErrs]= useState({});

  const validate = () => {
    const e = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required.";
    if (!password || password.length < 8) e.password = "Password must be 8+ characters.";
    if (mode === "register") {
      if (!name.trim()) e.name = "Your name is required.";
      if (password !== confirm) e.confirm = "Passwords don't match.";
    }
    setFieldErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body     = mode === "login"
      ? { email, password }
      : { email, password, name };

    try {
      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // Store token
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("af_token", data.token);
      }

      // Redirect
      const next = router.query.next || "/dashboard";
      router.push(next);

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter") submit(); };

  return (
    <>
      <Head>
        <title>{mode === "login" ? "Sign In" : "Create Account"} — AdForge Intelligence</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${C.bg};color:${C.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
        input::placeholder{color:${C.dim};}
        input:focus{border-color:rgba(0,184,150,0.5)!important;background:rgba(0,184,150,0.04)!important;outline:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 40 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: C.text }}>
            AdForge <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence</span>
          </span>
        </Link>

        {/* Card */}
        <div style={{ width: "100%", maxWidth: 440, padding: "40px", borderRadius: 20, border: `1px solid ${C.border}`, background: C.surface, animation: "fadeUp 0.4s ease both" }}>

          {/* Mode toggle */}
          <div style={{ display: "flex", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)", marginBottom: 32, overflow: "hidden" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setFieldErrs({}); }}
                style={{ flex: 1, padding: "11px", border: "none", background: mode === m ? "rgba(0,184,150,0.12)" : "transparent", color: mode === m ? C.teal : C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>
            {mode === "login" ? "Welcome back." : "Create your account."}
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 1.65 }}>
            {mode === "login"
              ? "Sign in to track your report status and access your orders."
              : "Create a free account to track your report and access future orders."}
          </p>

          <div style={{ display: "grid", gap: 16 }}>

            {/* Name — register only */}
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: C.muted, marginBottom: 7 }}>
                  Your Name <span style={{ color: C.teal }}>*</span>
                </label>
                <input value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} placeholder="Your full name" style={inp(fieldErrs.name)} />
                {fieldErrs.name && <p style={{ fontSize: 11, color: C.error, marginTop: 5 }}>{fieldErrs.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: C.muted, marginBottom: 7 }}>
                Email <span style={{ color: C.teal }}>*</span>
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} placeholder="you@yourbrand.com" style={inp(fieldErrs.email)} />
              {fieldErrs.email && <p style={{ fontSize: 11, color: C.error, marginTop: 5 }}>{fieldErrs.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: C.muted, marginBottom: 7 }}>
                Password <span style={{ color: C.teal }}>*</span>
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} placeholder={mode === "register" ? "Min 8 characters" : "Your password"} style={inp(fieldErrs.password)} />
              {fieldErrs.password && <p style={{ fontSize: 11, color: C.error, marginTop: 5 }}>{fieldErrs.password}</p>}
            </div>

            {/* Confirm password — register only */}
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: C.muted, marginBottom: 7 }}>
                  Confirm Password <span style={{ color: C.teal }}>*</span>
                </label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={handleKey} placeholder="Repeat password" style={inp(fieldErrs.confirm)} />
                {fieldErrs.confirm && <p style={{ fontSize: 11, color: C.error, marginTop: 5 }}>{fieldErrs.confirm}</p>}
              </div>
            )}

            {/* Global error */}
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 9, border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.06)" }}>
                <p style={{ fontSize: 13, color: C.error }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button onClick={submit} disabled={loading}
              style={{ padding: "14px", borderRadius: 10, border: "none", background: loading ? "rgba(255,255,255,0.05)" : C.grad, color: loading ? C.muted : "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: loading ? "none" : "0 0 24px rgba(0,184,150,0.25)", transition: "all 0.2s" }}>
              {loading
                ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> {mode === "login" ? "Signing in…" : "Creating account…"}</>
                : mode === "login" ? "Sign In →" : "Create Account →"
              }
            </button>

          </div>

          {/* Footer note */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, textAlign: "center", marginTop: 22 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setFieldErrs({}); }}
              style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

        </div>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginTop: 24 }}>
          <Link href="/" style={{ color: C.dim, textDecoration: "none" }}>← Return to homepage</Link>
        </p>
      </div>
    </>
  );
}
