/**
 * AdForge Intelligence — Email System
 * lib/email.js
 *
 * WHY EMAILS WERE FAILING:
 * Resend requires the "from" domain to be verified in their dashboard.
 * Using "@adforge.io" when that domain isn't verified = silent failure.
 *
 * IMMEDIATE FIX:
 * Set RESEND_FROM_EMAIL=onboarding@resend.dev in your env vars.
 * This is Resend's own verified domain for testing.
 * Emails WILL send from this address to any recipient.
 *
 * PRODUCTION FIX (when ready):
 * 1. resend.com → Domains → Add Domain → enter your domain
 * 2. Add the DNS records to your domain registrar
 * 3. Wait for verification (5–30 minutes)
 * 4. Update RESEND_FROM_EMAIL to hello@yourdomain.com
 */

// lib/email.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const FROM_NAME  = process.env.RESEND_FROM_NAME  || "AdForge Intelligence";
const FROM       = `${FROM_NAME} <${FROM_EMAIL}>`;
const SITE       = process.env.NEXT_PUBLIC_SITE_URL || "https://adforgeintelligence.onrender.com";
const NOTIFY     = process.env.NOTIFY_EMAIL || "";

// ── Operator Notification ─────────────────────────────────────────

export async function sendOperatorNotification(order) {
  if (!NOTIFY) {
    console.warn("[email] NOTIFY_EMAIL not set — skipping operator notification");
    return { success: false, error: "no_notify_email" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from:    FROM,
      to:      [NOTIFY],
      subject: `🔥 New commission: ${order.brandName} [${order.orderRef}]`,
      html:    buildOperatorHTML(order),
    });

    if (error) {
      console.error("[email] Operator send failed:", JSON.stringify(error));
      return { success: false, error };
    }

    console.log("[email] Operator notified:", data?.id);
    return { success: true, id: data?.id };

  } catch (err) {
    console.error("[email] Operator exception:", err.message);
    return { success: false, error: err.message };
  }
}

// ── Client Confirmation ───────────────────────────────────────────

export async function sendClientConfirmation(order) {
  if (!order.email) {
    console.warn("[email] No client email — skipping confirmation");
    return { success: false, error: "no_client_email" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from:    FROM,
      to:      [order.email],
      subject: `Your AdForge Intelligence report is being prepared [${order.orderRef}]`,
      html:    buildClientHTML(order),
    });

    if (error) {
      console.error("[email] Client send failed:", JSON.stringify(error));
      return { success: false, error };
    }

    console.log("[email] Client confirmed:", data?.id);
    return { success: true, id: data?.id };

  } catch (err) {
    console.error("[email] Client exception:", err.message);
    return { success: false, error: err.message };
  }
}

// ── Welcome Email ─────────────────────────────────────────────────

export async function sendWelcomeEmail({ email, name, orderRef }) {
  if (!email) return { success: false, error: "no_email" };

  try {
    const { data, error } = await resend.emails.send({
      from:    FROM,
      to:      [email],
      subject: "Welcome to AdForge Intelligence",
      html:    buildWelcomeHTML({ email, name, orderRef }),
    });

    if (error) {
      console.error("[email] Welcome send failed:", JSON.stringify(error));
      return { success: false, error };
    }

    return { success: true, id: data?.id };

  } catch (err) {
    console.error("[email] Welcome exception:", err.message);
    return { success: false, error: err.message };
  }
}

// ════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ════════════════════════════════════════════════════════════════════

function buildOperatorHTML(o) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,sans-serif;background:#f5f5f5;margin:0;padding:20px}
.card{background:#fff;border-radius:14px;max-width:580px;margin:0 auto;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}
.hdr{background:linear-gradient(135deg,#00B896,#0066CC);padding:28px 32px}
.hdr h1{color:#fff;font-size:20px;margin:0 0 4px}
.hdr p{color:rgba(255,255,255,.8);font-size:13px;margin:0}
.ref{display:inline-block;background:rgba(255,255,255,.2);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-top:10px}
.body{padding:28px 32px}
table{width:100%;border-collapse:collapse}
td{padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;vertical-align:top}
td:first-child{font-weight:600;color:#666;width:130px}
.challenge{background:#f9f9f9;border-left:3px solid #00B896;padding:12px 16px;margin-top:16px;font-size:13px;color:#555;line-height:1.7;border-radius:0 8px 8px 0}
.btn{display:inline-block;margin-top:22px;padding:11px 22px;background:linear-gradient(135deg,#00B896,#0066CC);color:#fff;text-decoration:none;border-radius:9px;font-weight:700;font-size:13px}
.footer{padding:16px 32px;border-top:1px solid #f0f0f0;font-size:11px;color:#999}
</style></head><body>
<div class="card">
  <div class="hdr">
    <h1>🔥 New Report Commission</h1>
    <p>Deliver within 12 hours of payment confirmation.</p>
    <span class="ref">${o.orderRef}</span>
  </div>
  <div class="body">
    <table>
      <tr><td>Brand</td><td><strong>${o.brandName}</strong></td></tr>
      <tr><td>Website</td><td><a href="${o.websiteUrl}" style="color:#00B896">${o.websiteUrl}</a></td></tr>
      <tr><td>Email</td><td><a href="mailto:${o.email}" style="color:#00B896">${o.email}</a></td></tr>
      <tr><td>Country</td><td>${o.country || "—"}</td></tr>
      <tr><td>Audience</td><td>${o.audience || "—"}</td></tr>
      <tr><td>Revenue</td><td>${o.revenue || "—"}</td></tr>
      <tr><td>Platform</td><td>${o.platform || "—"}</td></tr>
      <tr><td>Submitted</td><td>${new Date(o.submittedAt).toLocaleString("en-US",{timeZone:"UTC"})} UTC</td></tr>
    </table>
    ${o.challenge ? `<div class="challenge">${o.challenge}</div>` : ""}
    <a href="mailto:${o.email}?subject=Re: AdForge Report ${o.orderRef}" class="btn">Reply to Client</a>
  </div>
  <div class="footer">AdForge Intelligence &middot; ${SITE}</div>
</div>
</body></html>`;
}

function buildClientHTML(o) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,sans-serif;background:#06081A;margin:0;padding:20px}
.card{background:#0C0F24;border-radius:16px;max-width:540px;margin:0 auto;border:1px solid rgba(255,255,255,0.07);overflow:hidden}
.hdr{background:linear-gradient(135deg,rgba(0,184,150,.12),rgba(0,102,204,.12));padding:36px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,.06)}
.hdr .icon{font-size:44px;margin-bottom:14px}
.hdr h1{color:#F0F2FF;font-size:22px;margin:0 0 8px}
.hdr p{color:rgba(240,242,255,.6);font-size:14px;margin:0;line-height:1.6}
.ref{display:inline-block;margin-top:14px;padding:7px 18px;border-radius:100px;border:1px solid rgba(201,168,76,.3);background:rgba(201,168,76,.1);color:#C9A84C;font-size:12px;font-weight:700;letter-spacing:.06em}
.body{padding:28px 32px}
.section-title{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(240,242,255,.4);margin-bottom:12px}
.item{display:flex;gap:10px;margin-bottom:10px;font-size:13px;color:rgba(240,242,255,.65);line-height:1.5}
.check{color:#00B896;font-weight:bold;flex-shrink:0}
hr{border:none;border-top:1px solid rgba(255,255,255,.06);margin:22px 0}
.tl{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px}
.dot{width:8px;height:8px;border-radius:50%;background:#00B896;flex-shrink:0;margin-top:5px}
.dot.gold{background:#C9A84C}
.dot.dim{background:rgba(240,242,255,.2)}
.tl-text{font-size:13px;color:rgba(240,242,255,.6);line-height:1.5}
.tl-text strong{color:#F0F2FF}
.btn{display:inline-block;margin-top:4px;padding:12px 26px;background:linear-gradient(135deg,#00B896,#0066CC);color:#fff;text-decoration:none;border-radius:9px;font-weight:700;font-size:13px}
.footer{padding:18px 32px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:rgba(240,242,255,.25)}
.footer a{color:#00B896}
</style></head><body>
<div class="card">
  <div class="hdr">
    <div class="icon">✅</div>
    <h1>Your report is being prepared.</h1>
    <p>Thank you for commissioning a report for <strong style="color:#F0F2FF">${o.brandName}</strong>.</p>
    <div class="ref">ORDER REF: ${o.orderRef}</div>
  </div>
  <div class="body">
    <p class="section-title">Your Report Includes</p>
    <div class="item"><span class="check">✓</span> 5 high-performance campaign analyses from your market</div>
    <div class="item"><span class="check">✓</span> Messaging framework deconstruction for each campaign</div>
    <div class="item"><span class="check">✓</span> 5 brand-adapted creative directions ready to test</div>
    <div class="item"><span class="check">✓</span> Conversion-optimised landing page angle suggestions</div>
    <hr>
    <p class="section-title">Delivery Timeline</p>
    <div class="tl"><div class="dot"></div><div class="tl-text"><strong>Right now:</strong> Team notified, report queued.</div></div>
    <div class="tl"><div class="dot gold"></div><div class="tl-text"><strong>Within 2 hours:</strong> Intelligence gathering begins.</div></div>
    <div class="tl"><div class="dot dim"></div><div class="tl-text"><strong>Within 12 hours:</strong> Complete report delivered to <strong>${o.email}</strong>.</div></div>
    <hr>
    <div style="text-align:center">
      <a href="${SITE}/dashboard" class="btn">Track Your Order →</a>
    </div>
  </div>
  <div class="footer">
    Questions? <a href="mailto:${NOTIFY}">${NOTIFY}</a> &middot; Ref: ${o.orderRef}<br>
    <a href="${SITE}">${SITE}</a>
  </div>
</div>
</body></html>`;
}

function buildWelcomeHTML({ email, name, orderRef }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,sans-serif;background:#06081A;margin:0;padding:20px}
.card{background:#0C0F24;border-radius:16px;max-width:500px;margin:0 auto;border:1px solid rgba(255,255,255,.07);padding:40px 32px}
h1{color:#F0F2FF;font-size:22px;margin:0 0 12px}
p{color:rgba(240,242,255,.65);font-size:14px;line-height:1.75}
.btn{display:inline-block;margin-top:22px;padding:12px 26px;background:linear-gradient(135deg,#00B896,#0066CC);color:#fff;text-decoration:none;border-radius:9px;font-weight:700;font-size:13px}
.footer{margin-top:28px;padding-top:18px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:rgba(240,242,255,.25)}
.footer a{color:#00B896}
</style></head><body>
<div class="card">
  <div style="font-size:36px;margin-bottom:16px">👋</div>
  <h1>Welcome${name ? `, ${name}` : ""}.</h1>
  <p>Your AdForge Intelligence account is ready. Log in anytime to track your report status and access future orders.</p>
  ${orderRef ? `<p>Current order reference: <strong style="color:#C9A84C">${orderRef}</strong></p>` : ""}
  <a href="${SITE}/dashboard" class="btn">Go to My Dashboard →</a>
  <div class="footer"><a href="${SITE}">${SITE}</a></div>
</div>
</body></html>`;
}
