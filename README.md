# AdForge-Intelligence
AdForge Intelligence - AI powered Ad Optimization Report Service

# AdForge Intelligence V2 — Conversion System

> Premium ad intelligence landing system with multi-step intake, payment integration, and post-purchase confirmation.
> Built with Next.js · Playfair Display + DM Sans · Teal + Gold design system

---

## 📁 Folder Structure

```
adforge-v2/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Sticky nav with mobile menu
│   │   └── Footer.jsx          # Footer with support links
│   └── ui/
│       ├── Icons.jsx           # All 25 inline SVG icons
│       ├── FadeIn.jsx          # Scroll-triggered reveal animation
│       └── Button.jsx          # Reusable CTA button
├── lib/
│   └── constants.js            # ALL copy, colors, links, config ← edit here
├── pages/
│   ├── _app.jsx                # App wrapper
│   ├── index.jsx               # Landing page (all sections)
│   ├── intake.jsx              # 3-step brand intake form
│   ├── confirm.jsx             # Post-payment confirmation page
│   └── api/
│       └── intake.js           # Form submission API route
├── styles/
│   └── globals.css             # Design system, fonts, animations
├── public/
│   └── favicon.ico             # Add your favicon here
├── .env.example                # Environment variables template
├── .gitignore
├── next.config.js              # Security headers + redirects
├── package.json
└── README.md
```

---

## 🚀 Deploy in 15 Minutes (GitHub → Render)

### Step 1 — Clone & Configure

```bash
# Clone the repo (or download the zip)
git clone https://github.com/YOUR_USERNAME/adforge-v2.git
cd adforge-v2

# Set up environment
cp .env.example .env.local
```

Open `.env.local` and fill in:
- `NEXT_PUBLIC_FLUTTERWAVE_LINK` — your Flutterwave payment link
- `ZAPIER_WEBHOOK_URL` — your Zapier webhook
- `RESEND_API_KEY` — your Resend API key (optional but recommended)
- `NOTIFY_EMAIL` — where to receive intake alerts

### Step 2 — Test Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Test the full flow:
1. Landing page → click any CTA
2. Intake form → complete all 3 steps
3. Confirm page → check `http://localhost:3000/confirm?status=successful&tx_ref=test123`

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "AdForge Intelligence V2 — launch"
git branch -M main
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/adforge-v2.git
git push -u origin main
```

### Step 4 — Deploy on Render (Free)

1. Go to [render.com](https://render.com) → Sign up / Log in
2. Click **New +** → **Web Service**
3. Connect GitHub → Select `adforge-v2`
4. Configure:
   | Setting | Value |
   |---|---|
   | Name | `adforge-intelligence` |
   | Environment | `Node` |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |
   | Plan | Free |
5. Add Environment Variables (one by one from your `.env.local`)
6. Click **Create Web Service**
7. Wait ~4 minutes → your site is live 🎉

**Live URL:** `https://adforge-intelligence.onrender.com`

---

## ⚙️ Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FLUTTERWAVE_LINK` | ✅ YES | Flutterwave payment page URL |
| `ZAPIER_WEBHOOK_URL` | ✅ YES | Zapier → Google Sheets hook |
| `RESEND_API_KEY` | Recommended | Email notification key |
| `NOTIFY_EMAIL` | Recommended | Operator alert destination |
| `NEXT_PUBLIC_SITE_URL` | Optional | Live domain for SEO/emails |

---

## 🎨 Icons Setup & Customization

### How Icons Work
All icons are **inline SVGs** in `components/ui/Icons.jsx`. No external library needed.

### Full Icon List
| Icon Name | Used In | Description |
|---|---|---|
| `BarChart` | Navbar, Hero stats | Analytics symbol |
| `Clock` | Pain section | Time / urgency |
| `Target` | Pain section | Precision |
| `Globe` | Step 1, Deliverables | Market / reach |
| `FileText` | Step 2, Deliverables | Report document |
| `Zap` | Step 3 | Fast delivery |
| `Shield` | Guarantee | Security |
| `Search` | Deliverables | Intelligence |
| `Pencil` | Deliverables | Creative directions |
| `TrendingUp` | Pain section | Performance erosion |
| `Award` | Quality | Excellence |
| `Check` | Lists, Form | Checkmark |
| `CheckCircle` | Confirm page | Order success |
| `Star` | Testimonials | Rating |
| `ArrowRight` | CTA Buttons | Direction |
| `ChevronDown` | FAQ Accordion | Expand |
| `ChevronRight` | Breadcrumbs | Navigation |
| `Menu` | Mobile nav | Hamburger |
| `X` | Mobile nav close | Close |
| `Mail` | Footer, Support | Email |
| `MessageCircle` | Footer, Support | WhatsApp |
| `Download` | Confirm receipt | Save PDF |
| `Upload` | Intake form | File upload |
| `Lock` | Hero trust, Footer | Security |
| `Users` | Intake step label | People |
| `Sparkles` | Scarcity badge | Premium |
| `ExternalLink` | External URLs | Open in new tab |

### Replace an Icon
To swap any icon with a Heroicons alternative:
1. Go to [heroicons.com](https://heroicons.com) → find your icon → copy SVG paths
2. Open `components/ui/Icons.jsx`
3. Find the icon you want to replace (e.g., `BarChart`)
4. Replace the `<svg>` content with the Heroicons paths

### Usage
```jsx
import { Icons } from "../components/ui/Icons";

// Basic usage (default size 22, color "currentColor")
<Icons.BarChart />

// With custom size and color
<Icons.Shield size={32} color="#00B896" />
```

---

## ✏️ Customization Guide

### 1. Update All Copy
Open `lib/constants.js` — this is the single source of truth for:
- Brand name, email, WhatsApp number
- All headline and body copy
- FAQ questions and answers
- Deliverables list

### 2. Change Colors
In `lib/constants.js`, edit the `COLORS` object:
```js
export const COLORS = {
  teal: "#00B896",  // Primary brand color
  gold: "#C9A84C",  // Premium accent color
  blue: "#0066CC",  // Secondary gradient color
  // ...
};
```

### 3. Change Fonts
In `styles/globals.css`, update the Google Fonts import:
```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap');
```

Then update `h1, h2, h3` and `body` font-family properties.

### 4. Add Your Logo
1. Add your logo to `/public/logo.svg` (or `.png`)
2. In `components/layout/Navbar.jsx`, replace the icon div:
```jsx
<img src="/logo.svg" alt="AdForge Intelligence" height={36} />
```

### 5. Update Payment Flow
1. In Flutterwave dashboard: set redirect URL to `https://yourdomain.com/confirm`
2. In `.env.local`: set `NEXT_PUBLIC_FLUTTERWAVE_LINK`
3. Test: click a CTA → complete intake → you'll be redirected to Flutterwave → after payment → lands on /confirm

### 6. Update Testimonials
In `lib/constants.js`, find `COPY.testimonials.items` and replace with real client quotes once collected.

---

## 🔄 Complete User Flow

```
Landing Page (/)
  ↓ Click any CTA button
Intake Form (/intake)
  ↓ Step 1: Brand name, URL, email, country
  ↓ Step 2: Revenue, platform, challenge, optional file upload
  ↓ Step 3: Review summary → "Confirm & Proceed to Payment"
  ↓ POST /api/intake → data saved to Zapier + emailed to you
Flutterwave Payment Page (external)
  ↓ Customer pays $397
  ↓ Flutterwave redirects to:
Confirmation Page (/confirm?status=successful&tx_ref=xxx)
  ↓ Shows: order reference, timeline, receipt, support contacts
  ↓ Print/Save PDF option available
```

---

## 📊 Data Flow Architecture

```
Client Browser
  ↓ POST /api/intake (JSON)
Next.js API Route (pages/api/intake.js)
  ├── [1] Zapier Webhook → Google Sheets     (primary record)
  ├── [2] Resend → You (operator alert)      (real-time notification)
  └── [3] Resend → Client (confirmation)     (professional experience)
  ↓ 200 OK → client redirects to Flutterwave
Flutterwave → /confirm (with query params)
```

---

## 📧 Email Setup (Resend.com)

### Quick Setup (5 minutes)
1. Sign up at [resend.com](https://resend.com) — free tier: 3,000 emails/month
2. Go to **API Keys** → **Create API Key** → copy the key
3. Add to `.env.local` as `RESEND_API_KEY`
4. Set `NOTIFY_EMAIL` to your email address

### Sending From Your Own Domain
1. In Resend → **Domains** → **Add Domain** → enter `adforge.io` (or your domain)
2. Add the DNS records they provide to your domain registrar
3. Wait for verification (usually 5–15 minutes)
4. Update the `from:` fields in `pages/api/intake.js`:
   ```js
   from: "AdForge Intelligence <hello@yourdomain.com>"
   ```

---

## 🛡️ Security Features

- **Security headers** on all routes (X-Frame-Options, CSP, etc.) via `next.config.js`
- **Input validation** and **sanitization** in the API route
- **Length limits** on all form fields to prevent injection
- **No sensitive keys** exposed to frontend (server-side only)
- **Email validation** with regex before processing

---

## 🔧 Local Development

```bash
npm install
npm run dev
# http://localhost:3000

# Test confirmation page (without payment):
# http://localhost:3000/confirm?status=successful&tx_ref=test_123

# Test failed payment:
# http://localhost:3000/confirm?status=cancelled
```

---

## 📈 Performance Notes

- **Fonts**: Google Fonts with `display=swap` — no layout shift
- **Animations**: CSS transforms + IntersectionObserver — no scroll listeners
- **Images**: None by default — fast initial load
- **Bundle**: Zero heavy dependencies — only Next.js + React
- **Expected Lighthouse**: 92–98 Performance

---

## 🆙 Upgrade Path

### Adding More Offers
1. Add new offer to `lib/constants.js`
2. Create new landing page: `pages/offer-2.jsx`
3. Create new intake form: `pages/intake-2.jsx`
4. Create new payment link in Flutterwave

### Adding Analytics
In `pages/_app.jsx`:
```jsx
import { useEffect } from "react";
import { useRouter } from "next/router";

// Google Analytics 4
export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRoute = (url) => {
      window.gtag?.("config", "G-XXXXXXX", { page_path: url });
    };
    router.events.on("routeChangeComplete", handleRoute);
    return () => router.events.off("routeChangeComplete", handleRoute);
  }, [router.events]);
  return <Component {...pageProps} />;
}
```

### Adding a CRM
Replace or extend the Zapier webhook in `pages/api/intake.js` to call:
- HubSpot API
- Notion API
- Airtable API

---

## 🆘 Troubleshooting

| Issue | Solution |
|---|---|
| Fonts not loading | Check internet connection; fonts load from Google CDN |
| Form submission fails | Check browser console; verify API route is running |
| Stripe not available | Use PayPal.me + Wise as backup payment options |
| Confirm page not loading | Verify Flutterwave redirect URL is set to `/confirm` |
| Emails not sending | Check `RESEND_API_KEY` is set and valid in Render environment |
| Zapier not receiving | Use Zapier's "Test" function; check webhook URL is correct |

---

*Built for conversion, not decoration. Ship it and sell.*
