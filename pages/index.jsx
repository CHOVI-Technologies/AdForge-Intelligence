import Head from "next/head";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FadeIn from "../components/ui/FadeIn";
import Button from "../components/ui/Button";
import { Icons } from "../components/ui/Icons";
import { BRAND, LINKS, PRICE, COPY, COLORS } from "../lib/constants";
import { useState } from "react";

// ── Design tokens ──────────────────────────────────────────────
const C = COLORS;
const s = { // section padding
  section: { padding: "96px 0" },
  sectionAlt: { padding: "96px 0", background: "rgba(255,255,255,0.012)" },
};

// ── Shared UI ──────────────────────────────────────────────────
function SectionLabel({ children }) {
  return <span className="section-label">{children}</span>;
}

function GradientText({ children, gold = false }) {
  return (
    <span style={{
      background: gold
        ? "linear-gradient(135deg, #C9A84C 0%, #E8C876 100%)"
        : "linear-gradient(135deg, #00B896 0%, #0066CC 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0" }} />;
}

// ── Hero ────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "60px 0 80px" }}>
      {/* Orb glows */}
      <div style={{ position: "absolute", top: "5%", left: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,184,150,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-8%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,204,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)", marginBottom: 40, animation: "fadeDown 0.55s ease both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9A84C", boxShadow: "0 0 8px #C9A84C", animation: "scalePulse 2.5s infinite", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.09em", color: "#C9A84C" }}>
              {COPY.hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 6.5vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: C.text,
            marginBottom: 28,
            animation: "fadeUp 0.65s ease 0.1s both",
          }}>
            The Strategic Intelligence Behind<br />
            <GradientText>Top-Performing Ads</GradientText> in Your Market.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(16px, 2.2vw, 19px)",
            color: C.textMuted,
            lineHeigkht: 1.8,
            maxWidth: 620,
            margin: "0 auto 52px",
            animation: "fadeUp 0.65s ease 0.2s both",
          }}>
            {COPY.hero.sub}
          </p>

          {/* CTA group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, animation: "fadeUp 0.65s ease 0.3s both" }}>
            <Button size="lg" href={LINKS.intake} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.Lock size={13} color={C.textDim} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim }}>{COPY.hero.trust}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 56, marginTop: 72, flexWrap: "wrap", animation: "fadeUp 0.65s ease 0.4s both" }}>
            {[["12hr", "Delivery Commitment"], [PRICE.display, "Flat Rate"], ["100%", "Refund Guarantee"]].map(([val, label]) => (
              <div key={val} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 900, background: "linear-gradient(135deg,#00B896,#0066CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {val}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 4, letterSpacing: "0.04em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Social Proof Bar ────────────────────────────────────────────
function ProofBar() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.018)", padding: "18px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", color: C.textDim }}>
          {COPY.proof.label.toUpperCase()}
        </span>
        {COPY.proof.categories.map(cat => (
          <span key={cat} style={{ padding: "4px 13px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.09)", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,242,255,0.45)", fontWeight: 600 }}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Pain Section ────────────────────────────────────────────────
function PainSection() {
  return (
    <section style={s.section}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 64px" }}>
            <SectionLabel>The Problem</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 18 }}>
              {COPY.pain.headline}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75 }}>
              {COPY.pain.sub}
            </p>
          </div>
        </FadeIn>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {COPY.pain.items.map(({ title, body }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="card" style={{ padding: "32px 28px", borderRadius: 16, height: "100%" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.tealDim, border: "1px solid rgba(0,184,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, marginBottom: 20 }}>
                  {i === 0 ? <Icons.TrendingUp size={22} /> : i === 1 ? <Icons.Clock size={22} /> : <Icons.Target size={22} />}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.25 }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>
                  {body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ────────────────────────────────────────────────
function HowItWorks() {
  const stepIcons = [<Icons.Globe key={0} />, <Icons.Search key={1} />, <Icons.Zap key={2} />];
  return (
    <section id="how-it-works" style={{ ...s.sectionAlt }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 72px" }}>
            <SectionLabel>The Process</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              {COPY.howItWorks.headline}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginTop: 16 }}>
              {COPY.howItWorks.sub}
            </p>
          </div>
        </FadeIn>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative" }}>
          {COPY.howItWorks.steps.map(({ n, title, body }, i) => (
            <FadeIn key={n} delay={i * 0.12}>
              <div style={{ padding: "36px 28px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)", background: C.bgSurface, textAlign: "center", position: "relative", overflow: "hidden" }}>
                {/* Step number watermark */}
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none" }}>
                  {n}
                </div>
                {/* Step badge */}
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#E8C876)", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 800, color: "#06081A", marginBottom: 22 }}>
                  {i + 1}
                </div>
                {/* Icon */}
                <div style={{ width: 54, height: 54, borderRadius: 14, background: C.tealDim, border: "1px solid rgba(0,184,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, margin: "0 auto 22px" }}>
                  {stepIcons[i]}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Deliverables ────────────────────────────────────────────────
function Deliverables() {
  const icons = [<Icons.Search />, <Icons.FileText />, <Icons.Pencil />, <Icons.Globe />];
  return (
    <section id="deliverables" style={s.section}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 68px" }}>
            <SectionLabel>What You Receive</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 16 }}>
              {COPY.deliverables.headline}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75 }}>
              {COPY.deliverables.sub}
            </p>
          </div>
        </FadeIn>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 40 }}>
          {COPY.deliverables.items.map(({ title, body }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <div className="card" style={{ display: "flex", gap: 18, padding: "28px 28px", borderRadius: 15 }}>
                <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 12, background: C.tealDim, border: "1px solid rgba(0,184,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.teal }}>
                  {icons[i]}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.25 }}>{title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>{body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Value Stack */}
        <FadeIn delay={0.25}>
          <div style={{ padding: "28px 36px", borderRadius: 16, border: "1px solid rgba(201,168,76,0.22)", background: "linear-gradient(135deg, rgba(201,168,76,0.04), rgba(0,102,204,0.04))", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, letterSpacing: "0.06em", marginBottom: 6 }}>{COPY.deliverables.valueLabel.toUpperCase()}</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color: C.text }}>
                <span style={{ textDecoration: "line-through", color: C.textDim, fontSize: 20 }}>{COPY.deliverables.valueCrossed} </span>
                <GradientText gold>{COPY.deliverables.valueReal}</GradientText>
              </p>
            </div>
            <Button size="md" href={LINKS.intake} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Testimonials ────────────────────────────────────────────────
function Testimonials() {
  return (
    <section style={s.sectionAlt}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>Client Results</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              {COPY.testimonials.headline}
            </h2>
          </div>
        </FadeIn>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {COPY.testimonials.items.map(({ name, role, text, body }, i) => (
            <FadeIn key={name} delay={i * 0.1}>
              <div className="card" style={{ padding: "30px", borderRadius: 16, height: "100%" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {[...Array(5)].map((_, j) => <Icons.Star key={j} size={14} />)}
                </div>
                {/* Quote */}
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(240,242,255,0.72)", lineHeight: 1.85, fontStyle: "italic", marginBottom: 24 }}>
                  "{text || body}"
                </p>
                {/* Attribution */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>{name}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 3 }}>{role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Guarantee ───────────────────────────────────────────────────
function Guarantee() {
  return (
    <section id="guarantee" style={s.section}>
      <div className="container">
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ padding: "60px 52px", borderRadius: 24, border: "1px solid rgba(0,184,150,0.22)", background: "linear-gradient(135deg, rgba(0,184,150,0.05), rgba(0,102,204,0.05))", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,184,150,0.08), transparent)", pointerEvents: "none" }} />
              {/* Icon */}
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.tealDim, border: "1px solid rgba(0,184,150,0.28)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", color: C.teal }}>
                <Icons.Shield size={28} />
              </div>
              <SectionLabel>Performance Guarantee</SectionLabel>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 20 }}>
                {COPY.guarantee.headline}
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.85, maxWidth: 520, margin: "0 auto 36px" }}>
                {COPY.guarantee.body}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginBottom: 40 }}>
                {COPY.guarantee.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.teal }}><Icons.Check size={16} /></span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted }}>{item}</span>
                  </div>
                ))}
              </div>
              <Button size="md" href={LINKS.intake} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Scarcity ─────────────────────────────────────────────────────
function Scarcity() {
  return (
    <div style={{ padding: "0 0 56px" }}>
      <div className="container">
        <FadeIn>
          <div style={{ padding: "18px 28px", borderRadius: 12, border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.04)", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Icons.Sparkles size={18} color="#C9A84C" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>
              <strong style={{ color: C.text, fontWeight: 700 }}>Note on availability: </strong>
              {COPY.scarcity.text}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={s.sectionAlt}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em" }}>
              Common questions.
            </h2>
          </div>
        </FadeIn>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {COPY.faq.map(({ q, a }, i) => (
            <FadeIn key={q} delay={i * 0.05}>
              <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 6 }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: "100%", padding: "20px 24px",
                  background: open === i ? "rgba(0,184,150,0.05)" : "rgba(255,255,255,0.015)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  transition: "background 0.2s ease",
                }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: C.text, textAlign: "left" }}>{q}</span>
                  <span style={{ color: C.teal, flexShrink: 0, transition: "transform 0.28s ease", transform: open === i ? "rotate(180deg)" : "rotate(0)" }}>
                    <Icons.ChevronDown size={18} />
                  </span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 24px 20px", background: "rgba(0,184,150,0.025)", animation: "fadeDown 0.25s ease" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.85 }}>{a}</p>
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

// ── Final CTA ────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={s.section}>
      <div className="container">
        <FadeIn>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 52px", borderRadius: 28, border: "1px solid rgba(255,255,255,0.07)", background: `radial-gradient(ellipse at 50% 0%, rgba(0,184,150,0.09) 0%, transparent 60%), ${C.bgSurface}`, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <SectionLabel>Commission Your Report</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5.5vw,58px)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 22, position: "relative" }}>
              The intelligence your<br />market already contains.<br />
              <GradientText>Now accessible to you.</GradientText>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: C.textMuted, marginBottom: 44, position: "relative" }}>
              {PRICE.display} flat · Delivered in {PRICE.delivery} · {PRICE.guarantee}
            </p>
            <div style={{ position: "relative" }}>
              <Button size="lg" href={LINKS.intake} />
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 20, position: "relative" }}>
              Secure checkout via Flutterwave · Instant confirmation
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Head>
        <title>{BRAND.name} — Precision Ad Intelligence in 12 Hours</title>
        <meta name="description" content="We analyze high-performing signals in your market, decode the messaging frameworks driving results, and translate them into tailored creative directions for your brand. Delivered in 12 hours." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${BRAND.name} — Strategic Ad Intelligence, 12-Hour Delivery`} />
        <meta property="og:description" content="Precision market intelligence for DTC brands. $397 flat. Full performance guarantee." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <Navbar transparent />
      <Hero />
      <ProofBar />
      <PainSection />
      <Divider />
      <HowItWorks />
      <Deliverables />
      <Testimonials />
      <Guarantee />
      <Scarcity />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
  return <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0" }} />;
}

// ── Hero ────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "60px 0 80px" }}>
      {/* Orb glows */}
      <div style={{ position: "absolute", top: "5%", left: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,184,150,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-8%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,204,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)", marginBottom: 40, animation: "fadeDown 0.55s ease both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9A84C", boxShadow: "0 0 8px #C9A84C", animation: "scalePulse 2.5s infinite", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.09em", color: "#C9A84C" }}>
              {COPY.hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 6.5vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: C.text,
            marginBottom: 28,
            animation: "fadeUp 0.65s ease 0.1s both",
          }}>
            The Strategic Intelligence Behind<br />
            <GradientText>Top-Performing Ads</GradientText> in Your Market.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(16px, 2.2vw, 19px)",
            color: C.textMuted,
            lineHeigkht: 1.8,
            maxWidth: 620,
            margin: "0 auto 52px",
            animation: "fadeUp 0.65s ease 0.2s both",
          }}>
            {COPY.hero.sub}
          </p>

          {/* CTA group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, animation: "fadeUp 0.65s ease 0.3s both" }}>
            <Button size="lg" href={LINKS.intake} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.Lock size={13} color={C.textDim} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim }}>{COPY.hero.trust}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 56, marginTop: 72, flexWrap: "wrap", animation: "fadeUp 0.65s ease 0.4s both" }}>
            {[["12hr", "Delivery Commitment"], [PRICE.display, "Flat Rate"], ["100%", "Refund Guarantee"]].map(([val, label]) => (
              <div key={val} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 900, background: "linear-gradient(135deg,#00B896,#0066CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {val}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 4, letterSpacing: "0.04em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Social Proof Bar ────────────────────────────────────────────
function ProofBar() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.018)", padding: "18px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", color: C.textDim }}>
          {COPY.proof.label.toUpperCase()}
        </span>
        {COPY.proof.categories.map(cat => (
          <span key={cat} style={{ padding: "4px 13px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.09)", fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,242,255,0.45)", fontWeight: 600 }}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Pain Section ────────────────────────────────────────────────
function PainSection() {
  return (
    <section style={s.section}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 64px" }}>
            <SectionLabel>The Problem</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 18 }}>
              {COPY.pain.headline}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75 }}>
              {COPY.pain.sub}
            </p>
          </div>
        </FadeIn>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {COPY.pain.items.map(({ title, body }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="card" style={{ padding: "32px 28px", borderRadius: 16, height: "100%" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.tealDim, border: "1px solid rgba(0,184,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, marginBottom: 20 }}>
                  {i === 0 ? <Icons.TrendingUp size={22} /> : i === 1 ? <Icons.Clock size={22} /> : <Icons.Target size={22} />}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.25 }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>
                  {body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ────────────────────────────────────────────────
function HowItWorks() {
  const stepIcons = [<Icons.Globe key={0} />, <Icons.Search key={1} />, <Icons.Zap key={2} />];
  return (
    <section id="how-it-works" style={{ ...s.sectionAlt }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 72px" }}>
            <SectionLabel>The Process</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              {COPY.howItWorks.headline}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75, marginTop: 16 }}>
              {COPY.howItWorks.sub}
            </p>
          </div>
        </FadeIn>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative" }}>
          {COPY.howItWorks.steps.map(({ n, title, body }, i) => (
            <FadeIn key={n} delay={i * 0.12}>
              <div style={{ padding: "36px 28px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)", background: C.bgSurface, textAlign: "center", position: "relative", overflow: "hidden" }}>
                {/* Step number watermark */}
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1, userSelect: "none" }}>
                  {n}
                </div>
                {/* Step badge */}
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#E8C876)", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 800, color: "#06081A", marginBottom: 22 }}>
                  {i + 1}
                </div>
                {/* Icon */}
                <div style={{ width: 54, height: 54, borderRadius: 14, background: C.tealDim, border: "1px solid rgba(0,184,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, margin: "0 auto 22px" }}>
                  {stepIcons[i]}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Deliverables ────────────────────────────────────────────────
function Deliverables() {
  const icons = [<Icons.Search />, <Icons.FileText />, <Icons.Pencil />, <Icons.Globe />];
  return (
    <section id="deliverables" style={s.section}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 580, margin: "0 auto 68px" }}>
            <SectionLabel>What You Receive</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 16 }}>
              {COPY.deliverables.headline}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.75 }}>
              {COPY.deliverables.sub}
            </p>
          </div>
        </FadeIn>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 40 }}>
          {COPY.deliverables.items.map(({ title, body }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <div className="card" style={{ display: "flex", gap: 18, padding: "28px 28px", borderRadius: 15 }}>
                <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 12, background: C.tealDim, border: "1px solid rgba(0,184,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.teal }}>
                  {icons[i]}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.25 }}>{title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>{body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Value Stack */}
        <FadeIn delay={0.25}>
          <div style={{ padding: "28px 36px", borderRadius: 16, border: "1px solid rgba(201,168,76,0.22)", background: "linear-gradient(135deg, rgba(201,168,76,0.04), rgba(0,102,204,0.04))", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, letterSpacing: "0.06em", marginBottom: 6 }}>{COPY.deliverables.valueLabel.toUpperCase()}</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color: C.text }}>
                <span style={{ textDecoration: "line-through", color: C.textDim, fontSize: 20 }}>{COPY.deliverables.valueCrossed} </span>
                <GradientText gold>{COPY.deliverables.valueReal}</GradientText>
              </p>
            </div>
            <Button size="md" href={LINKS.intake} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Testimonials ────────────────────────────────────────────────
function Testimonials() {
  return (
    <section style={s.sectionAlt}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>Client Results</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              {COPY.testimonials.headline}
            </h2>
          </div>
        </FadeIn>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {COPY.testimonials.items.map(({ name, role, text, body }, i) => (
            <FadeIn key={name} delay={i * 0.1}>
              <div className="card" style={{ padding: "30px", borderRadius: 16, height: "100%" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {[...Array(5)].map((_, j) => <Icons.Star key={j} size={14} />)}
                </div>
                {/* Quote */}
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(240,242,255,0.72)", lineHeight: 1.85, fontStyle: "italic", marginBottom: 24 }}>
                  "{text || body}"
                </p>
                {/* Attribution */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>{name}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 3 }}>{role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Guarantee ───────────────────────────────────────────────────
function Guarantee() {
  return (
    <section id="guarantee" style={s.section}>
      <div className="container">
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ padding: "60px 52px", borderRadius: 24, border: "1px solid rgba(0,184,150,0.22)", background: "linear-gradient(135deg, rgba(0,184,150,0.05), rgba(0,102,204,0.05))", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,184,150,0.08), transparent)", pointerEvents: "none" }} />
              {/* Icon */}
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: C.tealDim, border: "1px solid rgba(0,184,150,0.28)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", color: C.teal }}>
                <Icons.Shield size={28} />
              </div>
              <SectionLabel>Performance Guarantee</SectionLabel>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 20 }}>
                {COPY.guarantee.headline}
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.textMuted, lineHeight: 1.85, maxWidth: 520, margin: "0 auto 36px" }}>
                {COPY.guarantee.body}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", marginBottom: 40 }}>
                {COPY.guarantee.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.teal }}><Icons.Check size={16} /></span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted }}>{item}</span>
                  </div>
                ))}
              </div>
              <Button size="md" href={LINKS.intake} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Scarcity ─────────────────────────────────────────────────────
function Scarcity() {
  return (
    <div style={{ padding: "0 0 56px" }}>
      <div className="container">
        <FadeIn>
          <div style={{ padding: "18px 28px", borderRadius: 12, border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.04)", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Icons.Sparkles size={18} color="#C9A84C" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>
              <strong style={{ color: C.text, fontWeight: 700 }}>Note on availability: </strong>
              {COPY.scarcity.text}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={s.sectionAlt}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, color: C.text, letterSpacing: "-0.025em" }}>
              Common questions.
            </h2>
          </div>
        </FadeIn>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {COPY.faq.map(({ q, a }, i) => (
            <FadeIn key={q} delay={i * 0.05}>
              <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 6 }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: "100%", padding: "20px 24px",
                  background: open === i ? "rgba(0,184,150,0.05)" : "rgba(255,255,255,0.015)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  transition: "background 0.2s ease",
                }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: C.text, textAlign: "left" }}>{q}</span>
                  <span style={{ color: C.teal, flexShrink: 0, transition: "transform 0.28s ease", transform: open === i ? "rotate(180deg)" : "rotate(0)" }}>
                    <Icons.ChevronDown size={18} />
                  </span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 24px 20px", background: "rgba(0,184,150,0.025)", animation: "fadeDown 0.25s ease" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.85 }}>{a}</p>
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

// ── Final CTA ────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={s.section}>
      <div className="container">
        <FadeIn>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 52px", borderRadius: 28, border: "1px solid rgba(255,255,255,0.07)", background: `radial-gradient(ellipse at 50% 0%, rgba(0,184,150,0.09) 0%, transparent 60%), ${C.bgSurface}`, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            <SectionLabel>Commission Your Report</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5.5vw,58px)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 22, position: "relative" }}>
              The intelligence your<br />market already contains.<br />
              <GradientText>Now accessible to you.</GradientText>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: C.textMuted, marginBottom: 44, position: "relative" }}>
              {PRICE.display} flat · Delivered in {PRICE.delivery} · {PRICE.guarantee}
            </p>
            <div style={{ position: "relative" }}>
              <Button size="lg" href={LINKS.intake} />
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.textDim, marginTop: 20, position: "relative" }}>
              Secure checkout via Flutterwave · Instant confirmation
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Head>
        <title>{BRAND.name} — Precision Ad Intelligence in 12 Hours</title>
        <meta name="description" content="We analyze high-performing signals in your market, decode the messaging frameworks driving results, and translate them into tailored creative directions for your brand. Delivered in 12 hours." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${BRAND.name} — Strategic Ad Intelligence, 12-Hour Delivery`} />
        <meta property="og:description" content="Precision market intelligence for DTC brands. $397 flat. Full performance guarantee." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <Navbar transparent />
      <Hero />
      <ProofBar />
      <PainSection />
      <Divider />
      <HowItWorks />
      <Deliverables />
      <Testimonials />
      <Guarantee />
      <Scarcity />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
