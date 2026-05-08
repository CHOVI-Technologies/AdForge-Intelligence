// pages/index.jsx
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FadeIn from "../components/ui/FadeIn";
import { Icons } from "../components/ui/Icons";
import { useAuth } from "../context/AuthContext";
import { C, COPY, BRAND, PRICE } from "../lib/constants";

// ── Shared ────────────────────────────────────────────────────────
const GT = ({ children, gold }) => (
  <span style={{ background: gold ? C.gradGold : C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
    {children}
  </span>
);
const SL = ({ children }) => (
  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.teal, display: "block", marginBottom: 14 }}>
    {children}
  </span>
);

// ── CTA Hook ──────────────────────────────────────────────────────
function useCtaClick() {
  const { isLoggedIn, openAuth } = useAuth();
  const router = useRouter();

  return () => {
    if (isLoggedIn) router.push("/intake");
    else openAuth("signup", () => router.push("/intake"));
  };
}

// ── CTA Button ────────────────────────────────────────────────────
function CTAButton({ size = "md", fullWidth = false }) {
  const [hov, setHov] = useState(false);
  const onClick = useCtaClick();
  const pad = size === "lg" ? "15px 38px" : "12px 28px";
  const fs  = size === "lg" ? 17 : 15;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: pad, borderRadius: 11, border: "none",
        background: C.grad, color: "#fff",
        fontFamily: "'DM Sans',sans-serif", fontSize: fs, fontWeight: 700,
        letterSpacing: "-0.01em", cursor: "pointer",
        boxShadow: hov ? "0 0 52px rgba(0,184,150,.38),0 8px 28px rgba(0,102,204,.28)" : "0 0 36px rgba(0,184,150,.25),0 4px 18px rgba(0,102,204,.18)",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "all .22s ease",
        width: fullWidth ? "100%" : "auto",
        justifyContent: fullWidth ? "center" : "flex-start",
      }}
    >
      {COPY.hero.cta}
      <Icons.Arrow size={15} color="#fff" />
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
// SECTIONS
// ════════════════════════════════════════════════════════════════════

function Hero() {
  return (
    <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "60px 20px 80px", textAlign: "center" }}>
      <div style={{ position: "absolute", top: "5%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,184,150,.09) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,102,204,.07) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", maskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)" }} />

      <div style={{ maxWidth: 840, position: "relative", zIndex: 1, animation: "fadeUp .65s ease both" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(201,168,76,.3)", background: "rgba(201,168,76,.07)", marginBottom: 36 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, boxShadow: `0 0 8px ${C.gold}`, display: "inline-block", animation: "pulse 2.5s infinite" }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".09em", color: C.gold }}>{COPY.hero.badge}</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-.03em", color: C.text, marginBottom: 24 }}>
          The Strategic Intelligence Behind<br />
          <GT>Top-Performing Ads</GT> in Your Market.
        </h1>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(15px,2vw,18px)", color: C.muted, lineHeight: 1.82, maxWidth: 600, margin: "0 auto 44px" }}>
          {COPY.hero.sub}
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <CTAButton size="lg" />
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icons.Lock size={12} color={C.dim} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim }}>{COPY.hero.trust}</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
          {[["12hr","Delivery Commitment"],[PRICE.display,"Flat Rate"],["100%","Refund Guarantee"]].map(([v,l]) => (
            <div key={v} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim, marginTop: 4, letterSpacing: ".04em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,.018)", padding: "16px 20px", display: "flex", justifyContent: "center", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".09em", color: C.dim }}>TRUSTED BY DTC BRANDS IN</span>
      {["Skincare","Supplements","Apparel","Home Goods","Fitness","Tech"].map(c => (
        <span key={c} style={{ padding: "4px 13px", borderRadius: 100, border: `1px solid rgba(255,255,255,.09)`, fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,242,255,.45)", fontWeight: 600 }}>{c}</span>
      ))}
    </div>
  );
}

function Pain() {
  const items = [
    { icon: <Icons.TrendUp size={22} color={C.teal} />, title: "Performance erosion is systematic", body: "Ad fatigue is predictable. What converted last quarter rarely converts today. Without fresh market signals, ROAS declines are inevitable — not accidental." },
    { icon: <Icons.Clock    size={22} color={C.teal} />, title: "Research requires bandwidth you don't have", body: "Competitive intelligence at the depth required to extract actionable insights takes 40+ hours per month. Most teams are already at capacity." },
    { icon: <Icons.Target   size={22} color={C.teal} />, title: "Creative decisions lack market evidence", body: "Launching new creative without intelligence is expensive experimentation. The performance data you need already exists in your competitors' campaigns." },
  ];
  return (
    <section style={{ padding: "92px 20px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 56px" }}>
          <SL>The Problem</SL>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em", lineHeight: 1.12, marginBottom: 16 }}>
            The cost of guessing is compounding.
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
            Every day campaigns run without fresh market intelligence, spend efficiency erodes.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {items.map(({ icon, title, body }, i) => (
            <FadeIn key={title} delay={i * .1}>
              <div style={{ padding: "28px 24px", borderRadius: 15, border: `1px solid ${C.border}`, background: "rgba(255,255,255,.02)", height: "100%", transition: "border-color .3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,184,150,.22)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: C.tealDim, border: "1px solid rgba(0,184,150,.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>{icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 11, lineHeight: 1.25 }}>{title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.82 }}>{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n:"01", icon: <Icons.User   size={22} color={C.teal} />, title: "Create your account", body: "Sign up in seconds — name, email, password. Your account is your dashboard to commission reports and track deliveries." },
    { n:"02", icon: <Icons.FileText size={22} color={C.teal} />, title: "Submit brand details", body: "Complete a 3-step intake form with your brand, competitors, and campaign goals. Takes under 5 minutes." },
    { n:"03", icon: <Icons.Zap    size={22} color={C.teal} />, title: "Receive your intelligence brief", body: "Within 12 hours, a structured PDF arrives — 5 competitor analyses, rewritten creative directions, and homepage angles." },
  ];
  return (
    <section id="how-it-works" style={{ padding: "92px 20px", background: "rgba(255,255,255,.012)" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 60px" }}>
          <SL>The Process</SL>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em", lineHeight: 1.12 }}>
            Three steps. Twelve hours.
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
          {steps.map(({ n, icon, title, body }, i) => (
            <FadeIn key={n} delay={i * .1}>
              <div style={{ padding: "32px 24px", borderRadius: 17, border: `1px solid ${C.border}`, background: C.surface, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 14, right: 18, fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,.03)", lineHeight: 1, userSelect: "none" }}>{n}</div>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: C.gradGold, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 800, color: "#06081A", marginBottom: 18 }}>{i + 1}</div>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: C.tealDim, border: "1px solid rgba(0,184,150,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 11 }}>{title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.82 }}>{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Deliverables() {
  const items = [
    { icon: <Icons.Search   size={20} color={C.teal} />, title: "5 High-Performance Campaign Analyses", body: "Campaigns with 30+ days of sustained spend — the most reliable public indicator of ROI — fully documented with structural composition and positioning." },
    { icon: <Icons.FileText size={20} color={C.teal} />, title: "Messaging Framework Deconstruction", body: "Hook mechanism, emotional driver, offer framing, and specific audience signal activated. Insight, not just observation." },
    { icon: <Icons.Pencil   size={20} color={C.teal} />, title: "5 Brand-Adapted Creative Directions", body: "Each framework translated into a ready-to-brief creative direction, calibrated to your brand voice, product, and audience." },
    { icon: <Icons.Globe    size={20} color={C.teal} />, title: "Conversion-Optimised Landing Page Angles", body: "Five headline frameworks derived from the highest-performing messaging patterns active in your specific category." },
  ];
  return (
    <section id="deliverables" style={{ padding: "92px 20px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
          <SL>What You Receive</SL>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em", lineHeight: 1.12, marginBottom: 14 }}>
            Everything in your intelligence brief.
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8 }}>A complete strategic brief. Market-specific intelligence built for your brand.</p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: 18, marginBottom: 32 }}>
          {items.map(({ icon, title, body }, i) => (
            <FadeIn key={title} delay={i * .08}>
              <div style={{ display: "flex", gap: 16, padding: "24px", borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(255,255,255,.02)", transition: "border-color .3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,184,150,.2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 10, background: C.tealDim, border: "1px solid rgba(0,184,150,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 9, lineHeight: 1.25 }}>{title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.82 }}>{body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={.2}>
          <div style={{ padding: "24px 30px", borderRadius: 14, border: "1px solid rgba(201,168,76,.22)", background: "rgba(201,168,76,.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim, letterSpacing: ".06em", marginBottom: 5 }}>TOTAL VALUE</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: C.text }}>
                <span style={{ textDecoration: "line-through", color: C.dim, fontSize: 18 }}>$1,400+ </span>
                <GT gold>{PRICE.display} flat</GT>
              </p>
            </div>
            <CTAButton />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Marcus T.", role: "Founder, Vitora Supplements", text: "Five frameworks I hadn't identified. We launched two within 48 hours. One outperformed our existing control within the first week. The depth of analysis justified the fee several times over." },
    { name: "Priya L.", role: "Head of Growth, Lumē Skincare", text: "Delivered in nine hours, not twelve. The campaign deconstructions surfaced angles our agency had completely missed. It changed how we brief creative for our category." },
    { name: "James O.", role: "CMO, Fortis Apparel", text: "The landing page frameworks alone changed our above-the-fold messaging. Conversion rate increased within the first test cycle. High-signal, low-noise, immediately actionable." },
  ];
  return (
    <section style={{ padding: "92px 20px", background: "rgba(255,255,255,.012)" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
          <SL>Client Results</SL>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em" }}>From operators who've commissioned reports.</h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {items.map(({ name, role, text }, i) => (
            <FadeIn key={name} delay={i * .09}>
              <div style={{ padding: "26px", borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(255,255,255,.02)", height: "100%" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <Icons.Star key={j} size={13} />)}
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(240,242,255,.72)", lineHeight: 1.88, fontStyle: "italic", marginBottom: 20 }}>"{text}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>{name}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginTop: 3 }}>{role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section id="guarantee" style={{ padding: "92px 20px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ padding: "52px 36px", borderRadius: 22, border: "1px solid rgba(0,184,150,.22)", background: "linear-gradient(135deg,rgba(0,184,150,.05),rgba(0,102,204,.05))", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.tealDim, border: "1px solid rgba(0,184,150,.28)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", color: C.teal }}>
              <Icons.Shield size={26} color={C.teal} />
            </div>
            <SL>Performance Guarantee</SL>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em", lineHeight: 1.12, marginBottom: 18 }}>{COPY.guarantee.headline}</h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.85, maxWidth: 500, margin: "0 auto 30px" }}>{COPY.guarantee.body}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", marginBottom: 34 }}>
              {["12-hour delivery commitment","Full refund if standards aren't met","No partial credits — 100% returned"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icons.Check size={14} color={C.teal} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <CTAButton />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    ["What qualifies as a 'high-performing' campaign?","We identify campaigns funded for 30+ days. Sustained spend is the most reliable public indicator of ROI — advertisers don't continue funding campaigns that don't convert."],
    ["How do you ensure directions are relevant to our brand?","Your intake form provides brand voice, product positioning, and audience profile. Every creative direction is calibrated to these — not generic market outputs."],
    ["What format does the report arrive in?","A structured PDF brief (20–35 pages), formatted for immediate briefing to your creative team. Organised for action, not just reading."],
    ["Is this relevant if we're not running ads yet?","Yes. Pre-launch brands use this to enter the market with intelligence rather than assumptions, dramatically reducing initial test spend."],
    ["What ad platforms do you cover?","Primarily Meta (Facebook/Instagram) and TikTok. Google Display is available for relevant categories. Specify in the intake form."],
  ];
  return (
    <section style={{ padding: "92px 20px", background: "rgba(255,255,255,.012)" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
          <SL>FAQ</SL>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: C.text, letterSpacing: "-.025em" }}>Common questions.</h2>
        </FadeIn>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {faqs.map(([q, a], i) => (
            <FadeIn key={q} delay={i * .05}>
              <div style={{ borderRadius: 11, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 5 }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "18px 22px", background: open === i ? "rgba(0,184,150,.05)" : "rgba(255,255,255,.015)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, transition: "background .2s" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: C.text, textAlign: "left" }}>{q}</span>
                  <span style={{ color: C.teal, flexShrink: 0, transition: "transform .28s", transform: open === i ? "rotate(180deg)" : "rotate(0)" }}><Icons.ChevDown size={18} color={C.teal} /></span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 22px 18px", background: "rgba(0,184,150,.025)" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.85 }}>{a}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ padding: "92px 20px" }}>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ padding: "72px 36px", borderRadius: 26, border: `1px solid ${C.border}`, background: `radial-gradient(ellipse at 50% 0%,rgba(0,184,150,.09) 0%,transparent 60%),${C.surface}`, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <SL>Commission Your Report</SL>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,5vw,54px)", fontWeight: 900, color: C.text, letterSpacing: "-.03em", lineHeight: 1.08, marginBottom: 20, position: "relative" }}>
              The intelligence your<br />market already contains.<br /><GT>Now accessible to you.</GT>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.muted, marginBottom: 38, position: "relative" }}>
              {PRICE.display} flat · Delivered in {PRICE.delivery} · Full performance guarantee
            </p>
            <div style={{ position: "relative" }}><CTAButton size="lg" /></div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginTop: 18, position: "relative" }}>Secure checkout via Flutterwave · Instant confirmation</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Head>
        <title>AdForge Intelligence — Precision Ad Intelligence in 12 Hours</title>
        <meta name="description" content="We analyze high-performing signals in your market, decode the messaging frameworks driving results, and deliver tailored creative directions in 12 hours. $397 flat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AdForge Intelligence — Strategic Ad Intelligence, 12-Hour Delivery" />
        <meta property="og:description" content="Precision market intelligence for DTC brands. $397 flat. Full performance guarantee." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navbar />
      <Hero />
      <ProofBar />
      <Pain />
      <HowItWorks />
      <Deliverables />
      <Testimonials />
      <Guarantee />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
