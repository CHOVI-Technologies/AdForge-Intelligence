/**
 * AdForge Intelligence V2 — Central Configuration
 * All copy, links, colors, and settings live here.
 * Edit this file to customize the entire system.
 */

// ── Brand Identity ─────────────────────────────────────────────
export const BRAND = {
  name: "AdForge Intelligence",
  shortName: "AdForge",
  tagline: "Precision Ad Intelligence",
  email: "chovitechnologies@gmail.com",
  supportEmail: "contactchovi@gmail.com",
  whatsappNumber: "+2348119696253",          // Replace: digits only, no spaces
  whatsappDisplay: "(+234) 811 9696 253",  // Replace: display format
  whatsapp:      "https://wa.me/+2348119696253",
};

// ── Links ───────────────────────────────────────────────────────
export const LINKS = {
  payment: process.env.NEXT_PUBLIC_FLUTTERWAVE_LINK || "#payment",
  intake: "/intake",
  confirm: "/confirm",
  home: "/",
  whatsapp: `https://wa.me/${BRAND.whatsappNumber}?text=Hi%2C%20I%20have%20a%20question%20about%20my%20AdForge%20Intelligence%20report.`,
};

// ── Pricing ─────────────────────────────────────────────────────
export const PRICE = {
  amount: 397,
  currency: "USD",
  display: "$397",
  guarantee: "Full refund if we can't deliver 3 testable creative directions",
  delivery: "12 hours",
};

// ── Design Tokens ───────────────────────────────────────────────
export const COLORS = {
  bgDeep:       "#06081A",
  bgSurface:    "#0C0F24",
  bgElevated:   "#111428",
  border:       "rgba(255,255,255,0.07)",
  borderAccent: "rgba(0,184,150,0.28)",
  borderGold:   "rgba(201,168,76,0.28)",
  teal:         "#00B896",
  tealDim:      "rgba(0,184,150,0.12)",
  blue:         "#0066CC",
  gold:         "#C9A84C",
  goldDim:      "rgba(201,168,76,0.12)",
  text:         "#F0F2FF",
  textMuted:    "rgba(240,242,255,0.55)",
  textDim:      "rgba(240,242,255,0.28)",
  gradientMain: "linear-gradient(135deg, #00B896 0%, #0066CC 100%)",
  gradientGold: "linear-gradient(135deg, #C9A84C 0%, #E8C876 100%)",
};

// ── Section Copy ────────────────────────────────────────────────
export const COPY = {
  hero: {
    badge:    "Precision Market Intelligence · 12-Hour Turnaround",
    headline: "The Strategic Intelligence Behind Top-Performing Ads in Your Market.",
    sub:      "We analyze high-performing signals in your niche, decode the messaging frameworks driving results, and translate them into tailored, ready-to-test creative directions for your brand.",
    cta:      "Request Your Intelligence Report — $397",
    trust:    "Secure checkout via Flutterwave · Delivered within 12 hours · Performance guarantee",
  },
  proof: {
    label: "Trusted by growing DTC brands in",
    categories: ["Skincare", "Supplements", "Apparel", "Home Goods", "Fitness", "Tech"],
  },
  pain: {
    headline: "The cost of guessing is compounding.",
    sub: "Every day your campaigns run without fresh market intelligence, spend efficiency erodes.",
    items: [
      {
        title: "Performance erosion is systematic",
        body: "Ad fatigue is predictable. What converted last quarter rarely converts today. Without fresh market signals, ROAS declines are inevitable — not accidental.",
      },
      {
        title: "Research requires bandwidth you don't have",
        body: "Competitive intelligence at the depth required to extract actionable insights takes 40+ hours of manual work per month. Most teams are already at capacity.",
      },
      {
        title: "Creative decisions lack market evidence",
        body: "Launching new creative without intelligence is expensive experimentation. The performance data you need already exists — in campaigns running in your market.",
      },
    ],
  },
  howItWorks: {
    headline: "A precise, three-step process.",
    sub: "From commission to delivery in under 12 hours. No meetings, no back-and-forth.",
    steps: [
      {
        n: "01",
        title: "Commission your report",
        body: "Complete a brief intake form detailing your brand and market. Secure your slot via checkout. The entire process takes under 5 minutes.",
      },
      {
        n: "02",
        title: "We analyze your market",
        body: "Our intelligence process identifies high-performing campaigns in your exact category, deconstructs their frameworks, and adapts the strategic angles to your brand.",
      },
      {
        n: "03",
        title: "Receive your intelligence brief",
        body: "Within 12 hours, a structured report arrives in your inbox — complete with analysis, adapted frameworks, and ready-to-brief creative directions.",
      },
    ],
  },
  deliverables: {
    headline: "What your intelligence report includes.",
    sub: "A complete strategic brief. Not a template. Not a generic audit. Market-specific intelligence built for your brand.",
    items: [
      {
        title: "5 High-Performance Campaign Analyses",
        body: "We identify campaigns that have sustained spend for 30+ days — a reliable signal of strong ROI — and document their structural composition, positioning, and targeting approach.",
      },
      {
        title: "Messaging Framework Deconstruction",
        body: "Each campaign is fully deconstructed: hook mechanism, emotional driver, offer framing, and the specific audience signal it activates. Insight, not just observation.",
      },
      {
        title: "5 Brand-Adapted Creative Directions",
        body: "We translate each market framework into a ready-to-brief creative direction, calibrated precisely to your brand voice, product category, and audience profile.",
      },
      {
        title: "Conversion-Optimised Landing Page Angles",
        body: "Five headline frameworks for your primary landing page, derived from the highest-performing messaging patterns active in your specific category.",
      },
    ],
    valueLabel: "Total intelligence value",
    valueCrossed: "$1,400+",
    valueReal: "$397 flat",
  },
  testimonials: {
    headline: "From operators who've commissioned reports.",
    items: [
      {
        name: "Marcus T.",
        role: "Founder, Vitora Supplements",
        text: "Five frameworks I hadn't identified. We launched two within 48 hours. One outperformed our existing control within the first week. The depth of analysis justified the fee several times over.",
      },
      {
        name: "Priya L.",
        role: "Head of Growth, Lumē Skincare",
        text: "Delivered in nine hours, not twelve. The campaign deconstructions surfaced angles our agency had completely missed. It changed how we brief creative for our category.",
      },
      {
        name: "James O.",
        role: "CMO, Fortis Apparel",
        body: "The landing page frameworks alone changed our above-the-fold messaging. Conversion rate increased within the first test cycle. High-signal, low-noise, immediately actionable.",
      },
    ],
  },
  guarantee: {
    headline: "Our Performance Guarantee.",
    body: "If your report doesn't identify at least 3 distinct, testable creative directions for your brand, we issue a full refund — immediately, without conditions. No forms, no disputes.",
    items: ["12-hour delivery commitment", "Full refund if standards aren't met", "No partial credits — 100% returned"],
  },
  scarcity: {
    text: "To maintain analytical depth and report quality, daily intake is limited. Once today's capacity is reached, the next available slot is the following day.",
  },
  faq: [
    {
      q: "What qualifies as a 'high-performing' campaign?",
      a: "We identify campaigns that have been actively funded for 30+ days. Sustained spend is the most reliable public indicator of ROI — advertisers don't continue funding campaigns that don't convert.",
    },
    {
      q: "How do you ensure the directions are relevant to our brand?",
      a: "Your intake form provides us with brand voice, product positioning, and audience profile. Every creative direction is calibrated to these inputs — not generic market outputs.",
    },
    {
      q: "What format does the report arrive in?",
      a: "A structured PDF brief (20–35 pages), formatted for immediate briefing to your creative team or internal review. Organised for action, not just reading.",
    },
    {
      q: "Is this relevant if we're not running ads yet?",
      a: "Yes. Pre-launch brands use this to enter the market with intelligence rather than assumptions, dramatically reducing initial test spend.",
    },
    {
      q: "What ad platforms do you cover?",
      a: "Primarily Meta (Facebook/Instagram) and TikTok. We can also cover Google Display for relevant categories. Specify your platforms in the intake form.",
    },
  ],
};
export const COLORS = {
  bgDeep:       "#06081A",
  bgSurface:    "#0C0F24",
  bgElevated:   "#111428",
  border:       "rgba(255,255,255,0.07)",
  borderAccent: "rgba(0,184,150,0.28)",
  borderGold:   "rgba(201,168,76,0.28)",
  teal:         "#00B896",
  tealDim:      "rgba(0,184,150,0.12)",
  blue:         "#0066CC",
  gold:         "#C9A84C",
  goldDim:      "rgba(201,168,76,0.12)",
  text:         "#F0F2FF",
  textMuted:    "rgba(240,242,255,0.55)",
  textDim:      "rgba(240,242,255,0.28)",
  gradientMain: "linear-gradient(135deg, #00B896 0%, #0066CC 100%)",
  gradientGold: "linear-gradient(135deg, #C9A84C 0%, #E8C876 100%)",
};

// ── Section Copy ────────────────────────────────────────────────
export const COPY = {
  hero: {
    badge:    "Precision Market Intelligence · 12-Hour Turnaround",
    headline: "The Strategic Intelligence Behind Top-Performing Ads in Your Market.",
    sub:      "We analyze high-performing signals in your niche, decode the messaging frameworks driving results, and translate them into tailored, ready-to-test creative directions for your brand.",
    cta:      "Request Your Intelligence Report — $397",
    trust:    "Secure checkout via Flutterwave · Delivered within 12 hours · Performance guarantee",
  },
  proof: {
    label: "Trusted by growing DTC brands in",
    categories: ["Skincare", "Supplements", "Apparel", "Home Goods", "Fitness", "Tech"],
  },
  pain: {
    headline: "The cost of guessing is compounding.",
    sub: "Every day your campaigns run without fresh market intelligence, spend efficiency erodes.",
    items: [
      {
        title: "Performance erosion is systematic",
        body: "Ad fatigue is predictable. What converted last quarter rarely converts today. Without fresh market signals, ROAS declines are inevitable — not accidental.",
      },
      {
        title: "Research requires bandwidth you don't have",
        body: "Competitive intelligence at the depth required to extract actionable insights takes 40+ hours of manual work per month. Most teams are already at capacity.",
      },
      {
        title: "Creative decisions lack market evidence",
        body: "Launching new creative without intelligence is expensive experimentation. The performance data you need already exists — in campaigns running in your market.",
      },
    ],
  },
  howItWorks: {
    headline: "A precise, three-step process.",
    sub: "From commission to delivery in under 12 hours. No meetings, no back-and-forth.",
    steps: [
      {
        n: "01",
        title: "Commission your report",
        body: "Complete a brief intake form detailing your brand and market. Secure your slot via checkout. The entire process takes under 5 minutes.",
      },
      {
        n: "02",
        title: "We analyze your market",
        body: "Our intelligence process identifies high-performing campaigns in your exact category, deconstructs their frameworks, and adapts the strategic angles to your brand.",
      },
      {
        n: "03",
        title: "Receive your intelligence brief",
        body: "Within 12 hours, a structured report arrives in your inbox — complete with analysis, adapted frameworks, and ready-to-brief creative directions.",
      },
    ],
  },
  deliverables: {
    headline: "What your intelligence report includes.",
    sub: "A complete strategic brief. Not a template. Not a generic audit. Market-specific intelligence built for your brand.",
    items: [
      {
        title: "5 High-Performance Campaign Analyses",
        body: "We identify campaigns that have sustained spend for 30+ days — a reliable signal of strong ROI — and document their structural composition, positioning, and targeting approach.",
      },
      {
        title: "Messaging Framework Deconstruction",
        body: "Each campaign is fully deconstructed: hook mechanism, emotional driver, offer framing, and the specific audience signal it activates. Insight, not just observation.",
      },
      {
        title: "5 Brand-Adapted Creative Directions",
        body: "We translate each market framework into a ready-to-brief creative direction, calibrated precisely to your brand voice, product category, and audience profile.",
      },
      {
        title: "Conversion-Optimised Landing Page Angles",
        body: "Five headline frameworks for your primary landing page, derived from the highest-performing messaging patterns active in your specific category.",
      },
    ],
    valueLabel: "Total intelligence value",
    valueCrossed: "$1,400+",
    valueReal: "$397 flat",
  },
  testimonials: {
    headline: "From operators who've commissioned reports.",
    items: [
      {
        name: "Marcus T.",
        role: "Founder, Vitora Supplements",
        text: "Five frameworks I hadn't identified. We launched two within 48 hours. One outperformed our existing control within the first week. The depth of analysis justified the fee several times over.",
      },
      {
        name: "Priya L.",
        role: "Head of Growth, Lumē Skincare",
        text: "Delivered in nine hours, not twelve. The campaign deconstructions surfaced angles our agency had completely missed. It changed how we brief creative for our category.",
      },
      {
        name: "James O.",
        role: "CMO, Fortis Apparel",
        body: "The landing page frameworks alone changed our above-the-fold messaging. Conversion rate increased within the first test cycle. High-signal, low-noise, immediately actionable.",
      },
    ],
  },
  guarantee: {
    headline: "Our Performance Guarantee.",
    body: "If your report doesn't identify at least 3 distinct, testable creative directions for your brand, we issue a full refund — immediately, without conditions. No forms, no disputes.",
    items: ["12-hour delivery commitment", "Full refund if standards aren't met", "No partial credits — 100% returned"],
  },
  scarcity: {
    text: "To maintain analytical depth and report quality, daily intake is limited. Once today's capacity is reached, the next available slot is the following day.",
  },
  faq: [
    {
      q: "What qualifies as a 'high-performing' campaign?",
      a: "We identify campaigns that have been actively funded for 30+ days. Sustained spend is the most reliable public indicator of ROI — advertisers don't continue funding campaigns that don't convert.",
    },
    {
      q: "How do you ensure the directions are relevant to our brand?",
      a: "Your intake form provides us with brand voice, product positioning, and audience profile. Every creative direction is calibrated to these inputs — not generic market outputs.",
    },
    {
      q: "What format does the report arrive in?",
      a: "A structured PDF brief (20–35 pages), formatted for immediate briefing to your creative team or internal review. Organised for action, not just reading.",
    },
    {
      q: "Is this relevant if we're not running ads yet?",
      a: "Yes. Pre-launch brands use this to enter the market with intelligence rather than assumptions, dramatically reducing initial test spend.",
    },
    {
      q: "What ad platforms do you cover?",
      a: "Primarily Meta (Facebook/Instagram) and TikTok. We can also cover Google Display for relevant categories. Specify your platforms in the intake form.",
    },
  ],
};
