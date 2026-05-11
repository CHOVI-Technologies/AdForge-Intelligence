// lib/constants.js - updated

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://adforgeintelligence.onrender.com";
export const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";

export const BRAND = {
  name:          "AdForge Intelligence",
  shortName:     "AdForge",
  tagline:       "Precision Ad Intelligence",
  email:         process.env.NOTIFY_EMAIL || "chovitechnologies@gmail.com",
  whatsapp:      "https://wa.me/+2348119696253",
};

export const PRICE = {
  amount:   10,
  currency: "USD",
  display:  "#397",
  delivery: "12 hours",
};

// ── Design tokens ─────────────────────────────────────────────────
export const C = {
  bg:       "#06081A",
  surface:  "#0C0F24",
  elevated: "#111428",
  border:   "rgba(255,255,255,0.07)",
  teal:     "#00B896",
  tealDim:  "rgba(0,184,150,0.1)",
  blue:     "#0066CC",
  gold:     "#C9A84C",
  goldDim:  "rgba(201,168,76,0.1)",
  text:     "#F0F2FF",
  muted:    "rgba(240,242,255,0.55)",
  dim:      "rgba(240,242,255,0.28)",
  error:    "#FF6B6B",
  grad:     "linear-gradient(135deg,#00B896 0%,#0066CC 100%)",
  gradGold: "linear-gradient(135deg,#C9A84C 0%,#E8C876 100%)",
};

// ── Form options ──────────────────────────────────────────────────
export const COUNTRIES = [
  "United States","United Kingdom","Canada","Australia",
  "Germany","France","Netherlands","UAE","Nigeria","South Africa","Other",
];

export const REVENUES = [
  "Under $10k/month","$10k – $50k/month","$50k – $150k/month",
  "$150k – $500k/month","$500k+/month","Pre-launch","Prefer not to say",
];

export const PLATFORMS = [
  "Meta (Facebook & Instagram)","TikTok","Google Display",
  "Meta + TikTok","Meta + Google","All major platforms","Other",
];

// ── Copy ──────────────────────────────────────────────────────────
export const COPY = {
  hero: {
    badge:    "Precision Market Intelligence · 12-Hour Turnaround",
    headline: "The Strategic Intelligence Behind Top-Performing Ads in Your Market.",
    sub:      "We analyze high-performing signals in your niche, decode the messaging frameworks driving results, and translate them into tailored, ready-to-test creative directions for your brand.",
    cta:      "Get My Intelligence Report — $397",
    trust:    "Secure Flutterwave checkout · Delivered in 12 hours · Performance guarantee",
  },
  guarantee: {
    headline: "Our Performance Guarantee.",
    body:     "If your report doesn't identify at least 3 distinct, testable creative directions for your brand, we issue a full refund — immediately, without conditions. No forms, no disputes.",
  },
};
