/**
 * AdForge Intelligence V2 — Intake Form API
 * POST /api/intake
 *
 * Accepts JSON body from the multi-step intake form.
 * Dispatches to:
 *   1. Zapier webhook → Google Sheets (primary record keeping)
 *   2. Resend.com → Email notification to operator (optional)
 *   3. Resend.com → Confirmation email to client (optional)
 *   4. Console log (always — fallback record)
 *
 * Required env vars:
 *   ZAPIER_WEBHOOK_URL    — Zapier catch hook URL
 *   RESEND_API_KEY        — Resend API key (re_xxx)
 *   NOTIFY_EMAIL          — Where to send operator alerts
 *   NEXT_PUBLIC_SITE_URL  — Your live domain
 */

// ── Validation ───────────────────────────────────────────────────
function validatePayload(body) {
  const required = ["brandName", "websiteUrl", "email"];
  const missing = required.filter(f => !body[f]?.trim());
  if (missing.length > 0) {
    return { valid: false, error: `Missing required fields: ${missing.join(", ")}` };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return { valid: false, error: "Invalid email address." };
  }
  return { valid: true };
}

// ── Zapier → Google Sheets ───────────────────────────────────────
async function sendToZapier(payload) {
  const url = process.env.ZAPIER_WEBHOOK_URL;
  if (!url) return { sent: false, reason: "ZAPIER_WEBHOOK_URL not set" };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return { sent: res.ok, status: res.status };
}

// ── Email: Operator Notification ─────────────────────────────────
async function sendOperatorNotification(payload) {
  const key   = process.env.RESEND_API_KEY;
  const to    = process.env.NOTIFY_EMAIL;
  const site  = process.env.NEXT_PUBLIC_SITE_URL || "https://adforge.io";

  if (!key || !to) return { sent: false, reason: "Resend not configured" };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, sans-serif; background: #f5f5f5; margin:0; padding:20px; }
  .card { background:white; border-radius:12px; padding:32px; max-width:600px; margin:0 auto; }
  h2 { color:#111; margin:0 0 8px; }
  .badge { display:inline-block; background:#00B896; color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:20px; }
  table { width:100%; border-collapse:collapse; margin-top:20px; }
  td { padding:10px 12px; border-bottom:1px solid #f0f0f0; font-size:14px; }
  td:first-child { font-weight:600; color:#666; width:130px; }
  .challenge { background:#f9f9f9; border-radius:8px; padding:14px; margin-top:16px; font-size:14px; color:#555; line-height:1.7; }
  .footer { margin-top:24px; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:16px; }
</style></head>
<body>
<div class="card">
  <div class="badge">🔥 NEW INTAKE</div>
  <h2>New Report Commission</h2>
  <p style="color:#666;margin:0 0 4px">Action required: deliver report within 12 hours of payment confirmation.</p>
  <table>
    <tr><td>Brand</td><td><strong>${payload.brandName}</strong></td></tr>
    <tr><td>Website</td><td><a href="${payload.websiteUrl}">${payload.websiteUrl}</a></td></tr>
    <tr><td>Email</td><td><a href="mailto:${payload.email}">${payload.email}</a></td></tr>
    <tr><td>Country</td><td>${payload.country || "—"}</td></tr>
    <tr><td>Audience</td><td>${payload.audience || "—"}</td></tr>
    <tr><td>Revenue</td><td>${payload.revenue || "—"}</td></tr>
    <tr><td>Platform</td><td>${payload.platform || "—"}</td></tr>
    <tr><td>Upload</td><td>${payload.uploadName ? `${payload.uploadName} (${payload.uploadSize})` : "None"}</td></tr>
    <tr><td>Submitted</td><td>${new Date(payload.submittedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC</td></tr>
  </table>
  ${payload.challenge ? `<p style="font-weight:600;margin:16px 0 6px;font-size:13px;color:#666">CHALLENGE / GOAL</p><div class="challenge">${payload.challenge}</div>` : ""}
  <div class="footer">
    AdForge Intelligence · <a href="${site}">${site}</a>
  </div>
</div>
</body>
</html>
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "AdForge Intelligence <noreply@adforge.io>",
      to: [to],
      subject: `🔥 New commission: ${payload.brandName}`,
      html,
    }),
  });

  return { sent: res.ok, status: res.status };
}

// ── Email: Client Confirmation ───────────────────────────────────
async function sendClientConfirmation(payload) {
  const key  = process.env.RESEND_API_KEY;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://adforge.io";

  if (!key) return { sent: false, reason: "Resend not configured" };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family:-apple-system,sans-serif; background:#06081A; margin:0; padding:20px; }
  .card { background:#0C0F24; border-radius:14px; padding:40px; max-width:560px; margin:0 auto; border:1px solid rgba(255,255,255,0.07); }
  h2 { color:#F0F2FF; font-size:26px; margin:0 0 8px; }
  p { color:rgba(240,242,255,0.6); font-size:15px; line-height:1.7; }
  .teal { color:#00B896; }
  .badge { display:inline-block; background:rgba(0,184,150,0.12); color:#00B896; border:1px solid rgba(0,184,150,0.3); padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:24px; letter-spacing:0.06em; }
  .divider { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:24px 0; }
  .item { display:flex; gap:10px; margin-bottom:10px; font-size:14px; color:rgba(240,242,255,0.6); }
  .check { color:#00B896; font-weight:bold; flex-shrink:0; }
  .footer { font-size:12px; color:rgba(240,242,255,0.25); margin-top:28px; }
  a { color:#00B896; }
</style></head>
<body>
<div class="card">
  <div class="badge">ORDER CONFIRMED</div>
  <h2>Your report is being prepared.</h2>
  <p>Thank you for commissioning an AdForge Intelligence report for <strong style="color:#F0F2FF">${payload.brandName}</strong>. Our team has been notified and your intelligence brief is being compiled.</p>
  <hr class="divider">
  <p style="font-size:13px;font-weight:700;color:rgba(240,242,255,0.4);letter-spacing:0.06em;margin-bottom:12px">YOUR REPORT INCLUDES</p>
  ${["5 high-performance campaign analyses","Messaging framework deconstruction","5 brand-adapted creative directions","Conversion-optimised landing page angles"].map(item => `<div class="item"><span class="check">✓</span><span>${item}</span></div>`).join("")}
  <hr class="divider">
  <p><strong style="color:#F0F2FF">Delivery timeline:</strong> Your complete report will arrive at <span class="teal">${payload.email}</span> within <strong style="color:#F0F2FF">12 hours</strong> of payment confirmation.</p>
  <hr class="divider">
  <p style="font-size:14px">Questions? Reply to this email or contact us at <a href="mailto:support@adforge.io">support@adforge.io</a>.</p>
  <div class="footer">
    AdForge Intelligence · <a href="${site}">${site}</a><br>
    This is a transactional email. You received it because you placed an order.
  </div>
</div>
</body>
</html>
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: "AdForge Intelligence <hello@adforge.io>",
      to: [payload.email],
      subject: "Your intelligence report is being prepared — AdForge",
      html,
    }),
  });

  return { sent: res.ok, status: res.status };
}

// ── Handler ──────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: basic check (production: use Upstash or similar)
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  // Validate
  const body = req.body || {};
  const { valid, error } = validatePayload(body);
  if (!valid) {
    return res.status(400).json({ error });
  }

  // Sanitize
  const payload = {
    brandName:   String(body.brandName || "").trim().slice(0, 200),
    websiteUrl:  String(body.websiteUrl || "").trim().slice(0, 500),
    email:       String(body.email || "").trim().toLowerCase().slice(0, 254),
    country:     String(body.country || "").trim().slice(0, 100),
    audience:    String(body.audience || "").trim().slice(0, 500),
    revenue:     String(body.revenue || "").trim().slice(0, 100),
    platform:    String(body.platform || "").trim().slice(0, 100),
    challenge:   String(body.challenge || "").trim().slice(0, 2000),
    uploadName:  String(body.uploadName || "").trim().slice(0, 255),
    uploadSize:  String(body.uploadSize || "").trim().slice(0, 50),
    submittedAt: body.submittedAt || new Date().toISOString(),
    source:      "adforge-v2-landing",
    ip,
  };

  // Always log (server console = permanent record even if all else fails)
  console.log("[adforge/intake]", JSON.stringify({
    brand: payload.brandName,
    email: payload.email,
    country: payload.country,
    platform: payload.platform,
    ts: payload.submittedAt,
  }));

  // Dispatch all integrations in parallel (non-blocking failures)
  const [zapier, operator, client] = await Promise.allSettled([
    sendToZapier(payload),
    sendOperatorNotification(payload),
    sendClientConfirmation(payload),
  ]);

  return res.status(200).json({
    success: true,
    message: "Intake received successfully.",
    debug: {
      zapier:   zapier.status === "fulfilled" ? zapier.value : { error: zapier.reason?.message },
      operator: operator.status === "fulfilled" ? operator.value : { error: operator.reason?.message },
      client:   client.status === "fulfilled" ? client.value : { error: client.reason?.message },
    },
  });
}
