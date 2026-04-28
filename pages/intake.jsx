import Head from "next/head";
import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { BRAND, LINKS, PRICE, COLORS } from "../lib/constants";

const C = COLORS;

// ── Step Config ─────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: "Brand Identity",    icon: <Icons.Users size={16} /> },
  { n: 2, label: "Campaign Details",  icon: <Icons.BarChart size={16} /> },
  { n: 3, label: "Review & Confirm",  icon: <Icons.CheckCircle size={16} /> },
];

const REVENUE_OPTIONS = [
  "Under $10k/month",
  "$10k – $50k/month",
  "$50k – $150k/month",
  "$150k – $500k/month",
  "$500k+/month",
  "Prefer not to say",
];

const PLATFORM_OPTIONS = [
  "Meta (Facebook & Instagram)",
  "TikTok",
  "Google (Display/Search)",
  "Meta + TikTok",
  "Meta + Google",
  "All major platforms",
  "Other",
];

const COUNTRY_OPTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Other (EU)",
  "Other",
];

const INITIAL_FORM = {
  brandName: "",
  websiteUrl: "",
  email: "",
  country: "",
  revenue: "",
  platform: "",
  challenge: "",
  uploadName: "",
  uploadSize: "",
};

// ── Shared Components ───────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label className="form-label">
        {label} {required && <span style={{ color: C.teal }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#FF6B6B" }}>
          {error}
        </span>
      )}
    </div>
  );
}

function Input({ type = "text", name, value, onChange, placeholder, onBlur }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); onBlur && onBlur(); }}
      className="form-input"
      style={{ border: `1px solid ${focused ? "rgba(0,184,150,0.5)" : "rgba(255,255,255,0.1)"}` }}
    />
  );
}

function Select({ name, value, onChange, options, placeholder }) {
  return (
    <select name={name} value={value} onChange={onChange} className="form-input"
      style={{ cursor: "pointer", appearance: "none" }}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ name, value, onChange, placeholder, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name} value={value} onChange={onChange}
      placeholder={placeholder} rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="form-input"
      style={{ resize: "vertical", border: `1px solid ${focused ? "rgba(0,184,150,0.5)" : "rgba(255,255,255,0.1)"}` }}
    />
  );
}

// ── Step Indicator ───────────────────────────────────────────────
function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 56 }}>
      {STEPS.map((step, i) => {
        const done    = current > step.n;
        const active  = current === step.n;
        const future  = current < step.n;
        return (
          <div key={step.n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {/* Circle */}
              <div style={{
                width: 42, height: 42,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "linear-gradient(135deg,#00B896,#0066CC)"
                           : active ? "linear-gradient(135deg,#C9A84C,#E8C876)"
                           : "rgba(255,255,255,0.05)",
                border: future ? "1px solid rgba(255,255,255,0.1)" : "none",
                transition: "all 0.4s ease",
                boxShadow: active ? "0 0 20px rgba(201,168,76,0.4)" : done ? "0 0 16px rgba(0,184,150,0.3)" : "none",
              }}>
                {done
                  ? <Icons.Check size={16} color="#fff" />
                  : <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 900, color: active ? "#06081A" : C.textDim }}>
                      {step.n}
                    </span>
                }
              </div>
              {/* Label */}
              <span style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: active ? C.gold : done ? C.teal : C.textDim,
                whiteSpace: "nowrap",
                transition: "color 0.3s",
              }}>
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                width: 80, height: 1,
                marginBottom: 22,
                background: done
                  ? "linear-gradient(90deg,#00B896,rgba(0,184,150,0.3))"
                  : "rgba(255,255,255,0.08)",
                transition: "background 0.4s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── File Upload ──────────────────────────────────────────────────
function FileUpload({ onFile, fileName }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) { alert("File must be under 10MB."); return; }
    onFile({ name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
  };

  return (
    <div
      onClick={() => fileRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        padding: "28px 24px",
        borderRadius: 12,
        border: `1.5px dashed ${dragging ? C.teal : fileName ? "rgba(0,184,150,0.5)" : "rgba(255,255,255,0.12)"}`,
        background: dragging ? C.tealDim : fileName ? "rgba(0,184,150,0.04)" : "rgba(255,255,255,0.02)",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.2s ease",
      }}
    >
      <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
      {fileName ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Icons.Check size={18} color={C.teal} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.teal, fontWeight: 600 }}>{fileName}</span>
        </div>
      ) : (
        <>
          <div style={{ color: C.textDim, marginBottom: 10 }}><Icons.Upload size={24} /></div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted }}>
            Drop a file here or <span style={{ color: C.teal, textDecoration: "underline" }}>browse</span>
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 6 }}>
            Screenshots, current creatives, or references · Max 10MB · PNG, JPG, PDF
          </p>
        </>
      )}
    </div>
  );
}

// ── Step 1: Brand Identity ───────────────────────────────────────
function Step1({ form, onChange, errors }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="grid-2">
        <Field label="Brand Name" required error={errors.brandName}>
          <Input name="brandName" value={form.brandName} onChange={onChange} placeholder="e.g. Lumē Skincare" />
        </Field>
        <Field label="Website URL" required error={errors.websiteUrl}>
          <Input name="websiteUrl" value={form.websiteUrl} onChange={onChange} placeholder="https://yourbrand.com" type="url" />
        </Field>
      </div>
      <Field label="Email Address" required error={errors.email}>
        <Input name="email" value={form.email} onChange={onChange} placeholder="you@yourbrand.com" type="email" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="grid-2">
        <Field label="Primary Market / Country" required error={errors.country}>
          <Select name="country" value={form.country} onChange={onChange} options={COUNTRY_OPTIONS} placeholder="Select country..." />
        </Field>
        <Field label="Target Customer Profile" required={false} error={errors.audience}>
          <Input name="audience" value={form.audience} onChange={onChange} placeholder="e.g. Women 28–45, anti-aging" />
        </Field>
      </div>
    </div>
  );
}

// ── Step 2: Campaign Details ─────────────────────────────────────
function Step2({ form, onChange, onFile }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="grid-2">
        <Field label="Monthly Revenue Range" required={false}>
          <Select name="revenue" value={form.revenue} onChange={onChange} options={REVENUE_OPTIONS} placeholder="Select range..." />
        </Field>
        <Field label="Primary Ad Platform" required={false}>
          <Select name="platform" value={form.platform} onChange={onChange} options={PLATFORM_OPTIONS} placeholder="Select platform..." />
        </Field>
      </div>
      <Field label="Primary Challenge or Goal" required={false}>
        <Textarea
          name="challenge"
          value={form.challenge}
          onChange={onChange}
          placeholder="Describe your current ad performance challenge or what you're hoping to achieve. The more context you provide, the more targeted your report will be."
          rows={4}
        />
      </Field>
      <Field label="Reference Materials (Optional)" required={false}>
        <FileUpload onFile={({ name, size }) => onFile(name, size)} fileName={form.uploadName} />
      </Field>
      <div style={{ padding: "16px 20px", borderRadius: 10, border: "1px solid rgba(201,168,76,0.18)", background: "rgba(201,168,76,0.04)" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
          <strong style={{ color: C.text }}>Tip: </strong>
          Uploading your current ad creative or landing page screenshots helps us calibrate the report more precisely to your brand voice and existing creative direction.
        </p>
      </div>
    </div>
  );
}

// ── Step 3: Review & Confirm ─────────────────────────────────────
function Step3({ form }) {
  const reviewItems = [
    { label: "Brand",    value: form.brandName },
    { label: "Website",  value: form.websiteUrl },
    { label: "Email",    value: form.email },
    { label: "Market",   value: form.country || "Not specified" },
    { label: "Platform", value: form.platform || "Not specified" },
    { label: "Revenue",  value: form.revenue || "Not specified" },
    { label: "Upload",   value: form.uploadName ? `${form.uploadName} (${form.uploadSize})` : "None" },
  ];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Summary Card */}
      <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", background: "rgba(0,184,150,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>
            YOUR BRIEF SUMMARY
          </span>
        </div>
        <div style={{ padding: "6px 0" }}>
          {reviewItems.map(({ label, value }, i) => (
            <div key={label} style={{
              display: "flex", padding: "12px 22px",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              gap: 16,
            }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.textDim, minWidth: 90 }}>
                {label}
              </span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textMuted, wordBreak: "break-all" }}>
                {value}
              </span>
            </div>
          ))}
          {form.challenge && (
            <div style={{ padding: "12px 22px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: C.textDim, marginBottom: 6 }}>CHALLENGE / GOAL</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{form.challenge}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div style={{ padding: "22px", borderRadius: 14, border: "1px solid rgba(201,168,76,0.22)", background: "rgba(201,168,76,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: C.text }}>
            Ad Intelligence Report
          </span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg,#C9A84C,#E8C876)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {PRICE.display}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["5 high-performance campaign analyses", "Messaging framework deconstruction", "5 brand-adapted creative directions", "Conversion-optimised landing page angles", "Delivery within 12 hours to your inbox"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.Check size={14} color={C.teal} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.textMuted }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          [<Icons.Shield size={14} />, "Performance guarantee"],
          [<Icons.Lock size={14} />, "Secure Flutterwave checkout"],
          [<Icons.Clock size={14} />, "12-hour delivery"],
        ].map(([icon, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ color: C.teal }}>{icon}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function IntakePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_FORM, audience: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (name, size) => setForm(p => ({ ...p, uploadName: name, uploadSize: size }));

  // Validate step 1
  const validateStep1 = () => {
    const errs = {};
    if (!form.brandName.trim()) errs.brandName = "Brand name is required.";
    if (!form.websiteUrl.trim()) errs.websiteUrl = "Website URL is required.";
    else if (!/^https?:\/\/.+/.test(form.websiteUrl)) errs.websiteUrl = "Enter a valid URL starting with https://";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.country) errs.country = "Please select a country.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(s => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit: POST to API, then redirect to Flutterwave
  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("API error");
    } catch (err) {
      console.error("[intake] submission error:", err);
      // Still redirect — don't block payment on API failure
    } finally {
      // Redirect to payment
      const paymentLink = process.env.NEXT_PUBLIC_FLUTTERWAVE_LINK;
      if (paymentLink && paymentLink !== "#payment") {
        window.location.href = paymentLink;
      } else {
        // Dev fallback
        window.location.href = LINKS.confirm + "?status=successful&tx_ref=dev_" + Date.now();
      }
    }
  };

  return (
    <>
      <Head>
        <title>Request Your Report — AdForge Intelligence</title>
        <meta name="description" content="Commission your precision ad intelligence report. Takes under 5 minutes." />
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main style={{ minHeight: "calc(100vh - 70px)", padding: "52px 24px 96px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100, border: "1px solid rgba(201,168,76,0.28)", background: "rgba(201,168,76,0.07)", marginBottom: 24 }}>
              <Icons.Sparkles size={14} color={COLORS.gold} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: COLORS.gold }}>
                STEP {step} OF 3
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 14 }}>
              {step === 1 ? "Tell us about your brand." : step === 2 ? "Share your campaign context." : "Review and proceed to payment."}
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.textMuted }}>
              {step === 1 ? "Basic details that help us identify the right competitive landscape for your brand." :
               step === 2 ? "Campaign details that allow us to calibrate the intelligence report precisely." :
               "Confirm your details are correct, then complete secure payment to lock in your slot."}
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator current={step} />

          {/* Form Card */}
          <div style={{ padding: "40px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: C.bgSurface, marginBottom: 24 }}>
            <div style={{ animation: "fadeUp 0.35s ease both" }} key={step}>
              {step === 1 && <Step1 form={form} onChange={handle} errors={errors} />}
              {step === 2 && <Step2 form={form} onChange={handle} onFile={handleFile} />}
              {step === 3 && <Step3 form={form} />}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, justifyContent: step > 1 ? "space-between" : "flex-end" }}>
            {step > 1 && (
              <button onClick={back} style={{
                padding: "13px 24px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: C.textMuted,
                fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = C.textMuted; }}
              >
                ← Back
              </button>
            )}

            {step < 3 ? (
              <button onClick={next} style={{
                padding: "13px 32px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #00B896, #0066CC)",
                color: "#fff", fontFamily: "'DM Sans',sans-serif",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 0 28px rgba(0,184,150,0.28)",
                display: "flex", alignItems: "center", gap: 8,
                letterSpacing: "-0.01em",
              }}>
                Continue <Icons.ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={loading} style={{
                padding: "15px 36px", borderRadius: 10, border: "none",
                background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C9A84C, #E8C876)",
                color: loading ? C.textMuted : "#06081A",
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 28px rgba(201,168,76,0.35)",
                display: "flex", alignItems: "center", gap: 10,
                letterSpacing: "-0.01em", transition: "all 0.25s",
              }}>
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)", borderTop: "2px solid #06081A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Saving details...
                  </>
                ) : (
                  <>
                    Confirm & Proceed to Payment — {PRICE.display}
                    <Icons.ArrowRight size={16} color="#06081A" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Support note */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, textAlign: "center", marginTop: 28 }}>
            Questions? Email us at{" "}
            <a href={`mailto:${BRAND.email}`} style={{ color: C.teal, textDecoration: "none" }}>
              {BRAND.email}
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
