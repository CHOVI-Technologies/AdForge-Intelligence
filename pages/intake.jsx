// pages/intake.jsx — FIXED
// KEY FIXES:
// 1. callback() now redirects immediately when FW confirms (works for card + fast bank transfers)
// 2. onclose() now redirects to /confirm?ref=AF-XXX for polling (works for ALL async payments)
// 3. transactionId stored in localStorage before redirect so confirm page can use it

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { useAuth } from "../context/AuthContext";
import { C, COUNTRIES, REVENUES, PLATFORMS, PRICE } from "../lib/constants";

const SITE    = process.env.NEXT_PUBLIC_SITE_URL || "https://adforgeintelligence.onrender.com";
const FLW_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";

// ── Flutterwave Inline trigger ────────────────────────────────────
function openFlutterwave({ orderRef, email, name, amount, currency }) {
  if (typeof window === "undefined" || !window.FlutterwaveCheckout) {
    alert("Payment is loading. Please wait 3 seconds and try again.");
    return;
  }

  // Store ref BEFORE opening modal — survives all redirect scenarios
  localStorage.setItem("af_orderRef", orderRef);
  localStorage.setItem("af_email",    email);

  window.FlutterwaveCheckout({
    public_key:      FLW_KEY,
    tx_ref:          orderRef,
    amount:          amount  || 397,
    currency:        currency || "USD",
    payment_options: "card,banktransfer,ussd",
    redirect_url:    SITE + "/confirm",   // Fires for card payments
    customer: { email: email, name: name || email },
    customizations: {
      title:       "AdForge Intelligence",
      description: "Competitor Ad Intelligence Report — 12hr Delivery",
      logo:        SITE + "/logo.png",
    },

    // callback fires when FW confirms payment while modal is still open
    // Works reliably for card. May fire for bank transfer if user waits.
    callback: function(data) {
      console.log("[flw] callback status:", data.status, "tx_ref:", data.tx_ref);
      if (data.status === "successful" || data.status === "completed") {
        localStorage.setItem("af_transactionId", String(data.transaction_id || ""));
        // Redirect with full params — confirm page handles verification
        window.location.href =
          SITE + "/confirm?status=successful" +
          "&tx_ref=" + encodeURIComponent(data.tx_ref || orderRef) +
          "&transaction_id=" + encodeURIComponent(data.transaction_id || "");
      }
    },

    // onclose fires when user closes modal — covers ALL async payment types
    // (bank transfer, USSD, mobile money) where redirect_url doesn't auto-fire
    onclose: function() {
      console.log("[flw] modal closed — redirecting to confirm for polling");
      const storedRef = localStorage.getItem("af_orderRef") || orderRef;
      const storedTx  = localStorage.getItem("af_transactionId") || "";

      if (storedTx) {
        // We already got a successful callback before close
        window.location.href =
          SITE + "/confirm?status=successful" +
          "&tx_ref=" + encodeURIComponent(storedRef) +
          "&transaction_id=" + encodeURIComponent(storedTx);
      } else {
        // No callback yet — go to confirm in polling mode
        window.location.href = SITE + "/confirm?ref=" + encodeURIComponent(storedRef);
      }
    },
  });
}

// ── Shared form components ────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
      {children}{required && <span style={{ color: C.teal }}> *</span>}
    </label>
  );
}
function FieldErr({ msg }) {
  return msg ? <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.error, marginTop: 5 }}>{msg}</p> : null;
}
const iStyle = (err) => ({
  width: "100%", padding: "13px 16px", borderRadius: 10,
  border: "1.5px solid " + (err ? C.error : "rgba(255,255,255,0.1)"),
  background: "rgba(255,255,255,0.04)", color: C.text,
  fontFamily: "'DM Sans',sans-serif", fontSize: 14,
  outline: "none", transition: "border-color .2s, background .2s", boxSizing: "border-box",
});
function TInput({ name, value, onChange, placeholder, type = "text", error }) {
  return (
    <input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type}
      onFocus={e => { e.target.style.borderColor = "rgba(0,184,150,0.55)"; e.target.style.background = "rgba(0,184,150,0.04)"; }}
      onBlur={e  => { e.target.style.borderColor = error ? C.error : "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
      style={iStyle(error)} />
  );
}
function SInput({ name, value, onChange, options, placeholder }) {
  return (
    <select name={name} value={value} onChange={onChange}
      style={{ ...iStyle(false), cursor: "pointer", appearance: "none" }}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o} style={{ background: C.surface }}>{o}</option>)}
    </select>
  );
}

// ── Step indicator ────────────────────────────────────────────────
function StepDots({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 44 }}>
      {[1,2,3].map((n, i) => {
        const done = current > n, active = current === n;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? C.grad : active ? C.gradGold : "rgba(255,255,255,.05)",
                border: (!done && !active) ? "1px solid " + C.border : "none",
                boxShadow: active ? "0 0 18px rgba(201,168,76,.4)" : done ? "0 0 14px rgba(0,184,150,.28)" : "none",
                transition: "all .4s",
              }}>
                {done
                  ? <Icons.Check size={16} color="#fff" />
                  : <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 900, color: active ? "#06081A" : C.dim }}>{n}</span>
                }
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: active ? C.gold : done ? C.teal : C.dim, whiteSpace: "nowrap" }}>
                {["Brand Identity","Campaign Details","Review & Pay"][n-1]}
              </span>
            </div>
            {i < 2 && <div style={{ width: 64, height: 1, marginBottom: 22, background: done ? "linear-gradient(90deg," + C.teal + ",rgba(0,184,150,.3))" : C.border, transition: "background .4s" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── File upload ───────────────────────────────────────────────────
function FileZone({ uploadName, onFile }) {
  const [drag, setDrag] = useState(false);
  const handle = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("File must be under 10MB."); return; }
    onFile({ name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
  };
  return (
    <div
      onClick={() => document.getElementById("af-file-input").click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      style={{ padding: "24px 20px", borderRadius: 11, textAlign: "center", cursor: "pointer",
        border: "1.5px dashed " + (drag ? C.teal : uploadName ? "rgba(0,184,150,0.5)" : "rgba(255,255,255,0.12)"),
        background: drag || uploadName ? "rgba(0,184,150,.03)" : "rgba(255,255,255,.02)", transition: "all .2s" }}>
      <input id="af-file-input" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
      {uploadName
        ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
            <Icons.Check size={15} color={C.teal} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.teal, fontWeight: 600 }}>{uploadName}</span>
          </div>
        : <>
            <Icons.Upload size={22} color={C.dim} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginTop: 8, marginBottom: 4 }}>
              Drop a file or <span style={{ color: C.teal, textDecoration: "underline" }}>browse</span>
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim }}>Screenshots, creatives · Max 10MB · PNG, JPG, PDF</p>
          </>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════
const INIT = { brandName:"", websiteUrl:"", email:"", country:"", audience:"", revenue:"", platform:"", challenge:"", uploadName:"", uploadSize:"" };

export default function IntakePage() {
  const { user, isLoggedIn, openAuth, authLoading } = useAuth();
  const [step,      setStep]      = useState(1);
  const [form,      setForm]      = useState(INIT);
  const [errors,    setErrors]    = useState({});
  const [apiError,  setApiError]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const flwReady = useRef(false);

  // Pre-fill from auth
  useEffect(() => {
    if (user?.email && !form.email)     setForm(p => ({ ...p, email: user.email }));
    if (user?.brandName && !form.brandName) setForm(p => ({ ...p, brandName: user.brandName }));
  }, [user]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isLoggedIn) openAuth("signup", () => {});
  }, [authLoading, isLoggedIn]);

  // Poll for FLW v3 script readiness
  useEffect(() => {
    const check = setInterval(() => {
      if (typeof window !== "undefined" && window.FlutterwaveCheckout) {
        flwReady.current = true;
        clearInterval(check);
      }
    }, 500);
    return () => clearInterval(check);
  }, []);

  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = ({ name, size }) => setForm(p => ({ ...p, uploadName: name, uploadSize: size }));

  const validate1 = () => {
    const e = {};
    if (!form.brandName.trim())  e.brandName  = "Brand name is required.";
    if (!form.websiteUrl.trim()) e.websiteUrl = "Website URL is required.";
    else if (!/^https?:\/\/.+/.test(form.websiteUrl)) e.websiteUrl = "Must start with https://";
    if (!form.email.trim())      e.email      = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.country)           e.country    = "Please select a market.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validate1()) return;
    setStep(s => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => { setStep(s => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const submit = async () => {
    setApiError(""); setLoading(true); setCancelled(false);
    // Clear any old transaction ID
    localStorage.removeItem("af_transactionId");

    try {
      const res  = await fetch("/api/intake", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setApiError(data.error || "Submission failed. Please try again."); setLoading(false); return; }

      setLoading(false);

      // Open Flutterwave inline checkout
      openFlutterwave({
        orderRef: data.orderRef,
        email:    form.email,
        name:     form.brandName,
        amount:   PRICE.amount,
        currency: PRICE.currency,
      });

    } catch (err) {
      setApiError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid " + C.border, borderTop: "3px solid " + C.teal, borderRadius: "50%", animation: "spin .9s linear infinite" }} />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );

  if (!isLoggedIn) return (
    <>
      <Head><title>Sign Up Required — AdForge Intelligence</title></Head>
      <Navbar />
      <div style={{ background: C.bg, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 44, marginBottom: 20 }}>🔒</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 14 }}>Account required</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Create a free account or sign in to commission your intelligence report.
          </p>
          <button onClick={() => openAuth("signup")}
            style={{ padding: "14px 30px", borderRadius: 11, border: "none", background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 28px rgba(0,184,150,.25)" }}>
            Create Account →
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  const G2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 };
  const titles = ["Tell us about your brand.", "Share your campaign context.", "Review and proceed to payment."];
  const subs   = ["Basic details that help us identify the right competitive landscape.", "Campaign context that lets us calibrate the report precisely.", "Confirm your details, then complete secure payment."];

  return (
    <>
      <Head>
        <title>Request Your Report — AdForge Intelligence</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />
      <main style={{ background: C.bg, minHeight: "calc(100vh - 68px)", padding: "48px 20px 88px" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100, border: "1px solid rgba(201,168,76,.28)", background: "rgba(201,168,76,.07)", marginBottom: 20 }}>
              <Icons.Spark size={13} color={C.gold} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".09em", color: C.gold }}>STEP {step} OF 3</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em", lineHeight: 1.12, marginBottom: 10 }}>{titles[step-1]}</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted }}>{subs[step-1]}</p>
          </div>

          <StepDots current={step} />

          {/* Form */}
          <div style={{ padding: "36px 28px", borderRadius: 20, border: "1px solid rgba(255,255,255,.08)", background: C.surface, marginBottom: 20 }} key={step}>

            {step === 1 && (
              <div style={{ display: "grid", gap: 20 }}>
                <div style={G2}>
                  <div><Label required>Brand Name</Label><TInput name="brandName" value={form.brandName} onChange={h} placeholder="e.g. Lumē Skincare" error={errors.brandName} /><FieldErr msg={errors.brandName} /></div>
                  <div><Label required>Website URL</Label><TInput name="websiteUrl" value={form.websiteUrl} onChange={h} placeholder="https://yourbrand.com" type="url" error={errors.websiteUrl} /><FieldErr msg={errors.websiteUrl} /></div>
                </div>
                <div><Label required>Email Address</Label><TInput name="email" value={form.email} onChange={h} placeholder="you@yourbrand.com" type="email" error={errors.email} /><FieldErr msg={errors.email} /></div>
                <div style={G2}>
                  <div><Label required>Primary Market</Label><SInput name="country" value={form.country} onChange={h} options={COUNTRIES} placeholder="Select country..." /><FieldErr msg={errors.country} /></div>
                  <div><Label>Target Customer</Label><TInput name="audience" value={form.audience} onChange={h} placeholder="e.g. Women 28–45, anti-aging" /></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "grid", gap: 20 }}>
                <div style={G2}>
                  <div><Label>Monthly Revenue</Label><SInput name="revenue" value={form.revenue} onChange={h} options={REVENUES} placeholder="Select range..." /></div>
                  <div><Label>Ad Platform</Label><SInput name="platform" value={form.platform} onChange={h} options={PLATFORMS} placeholder="Select platform..." /></div>
                </div>
                <div>
                  <Label>Primary Challenge or Goal</Label>
                  <textarea name="challenge" value={form.challenge} onChange={h} rows={4}
                    placeholder="Describe your current ad performance challenge. More context = more targeted report."
                    onFocus={e => e.target.style.borderColor = "rgba(0,184,150,0.55)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    style={{ ...iStyle(false), resize: "vertical" }} />
                </div>
                <div><Label>Reference Materials (Optional)</Label><FileZone uploadName={form.uploadName} onFile={handleFile} /></div>
                <div style={{ padding: "13px 16px", borderRadius: 9, border: "1px solid rgba(201,168,76,.18)", background: "rgba(201,168,76,.04)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                  <strong style={{ color: C.text }}>Tip:</strong> Uploading existing ad creative helps calibrate the report to your brand voice.
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "grid", gap: 20 }}>
                {/* Summary */}
                <div style={{ borderRadius: 13, border: "1px solid " + C.border, overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", background: "rgba(0,184,150,.07)", borderBottom: "1px solid " + C.border }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: C.teal }}>BRIEF SUMMARY</span>
                  </div>
                  {[["Brand",form.brandName||"—"],["Website",form.websiteUrl||"—"],["Email",form.email||"—"],["Market",form.country||"Not specified"],["Platform",form.platform||"Not specified"],["Revenue",form.revenue||"Not specified"]].map(([k,v],i)=>(
                    <div key={k} style={{ display:"flex", padding:"10px 18px", background: i%2===0?"transparent":"rgba(255,255,255,.01)", gap:14 }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.dim, minWidth:75 }}>{k}</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, wordBreak:"break-all" }}>{v}</span>
                    </div>
                  ))}
                </div>
                {/* Order box */}
                <div style={{ padding: "18px", borderRadius: 13, border: "1px solid rgba(201,168,76,.22)", background: "rgba(201,168,76,.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: C.text }}>Ad Intelligence Report</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg,#C9A84C,#E8C876)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{PRICE.display}</span>
                  </div>
                  {["5 high-performance campaign analyses","Messaging framework deconstruction","5 brand-adapted creative directions","Conversion-optimised landing page angles","Delivery within 12 hours to your inbox"].map(item=>(
                    <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                      <Icons.Check size={13} color={C.teal} />
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{item}</span>
                    </div>
                  ))}
                </div>

                {cancelled && (
                  <div style={{ padding:"14px 16px", borderRadius:9, border:"1px solid rgba(245,158,11,.3)", background:"rgba(245,158,11,.06)" }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#F59E0B", margin:0 }}>
                      ⚠️ Payment window closed. If you completed a bank transfer, your payment is being confirmed automatically. Otherwise click below to try again.
                    </p>
                  </div>
                )}
                {apiError && (
                  <div style={{ padding:"14px 16px", borderRadius:9, border:"1px solid rgba(255,107,107,.3)", background:"rgba(255,107,107,.06)" }}>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.error, margin:0 }}>{apiError}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div style={{ display:"flex", gap:12, justifyContent: step>1?"space-between":"flex-end" }}>
            {step > 1 && (
              <button onClick={back} style={{ padding:"13px 22px", borderRadius:10, border:"1px solid " + C.border, background:"transparent", color:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                ← Back
              </button>
            )}
            {step < 3
              ? <button onClick={next} style={{ padding:"13px 30px", borderRadius:10, border:"none", background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 0 24px rgba(0,184,150,.25)" }}>
                  Continue <Icons.Arrow size={15} color="#fff" />
                </button>
              : <button onClick={submit} disabled={loading} style={{ padding:"15px 28px", borderRadius:10, border:"none", background: loading?C.elevated:"linear-gradient(135deg,#C9A84C,#E8C876)", color: loading?C.muted:"#06081A", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:800, cursor: loading?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:10, boxShadow: loading?"none":"0 0 28px rgba(201,168,76,.3)", transition:"all .25s" }}>
                  {loading
                    ? <><span style={{ width:16, height:16, border:"2px solid rgba(0,0,0,.2)", borderTop:"2px solid #06081A", borderRadius:"50%", animation:"spin .8s linear infinite" }} />Saving…</>
                    : <>Confirm &amp; Pay {PRICE.display} <Icons.Arrow size={15} color="#06081A" /></>
                  }
                </button>
            }
          </div>

          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.dim, textAlign:"center", marginTop:20 }}>
            Questions? <a href="mailto:chovitechnologies@gmail.com" style={{ color:C.teal }}>chovitechnologies@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </>
  );
}
