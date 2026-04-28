/**
 * AdForge Intelligence V2 — Intake Form API
 * POST /api/intake
 * 
 * Sends data to Google Apps Script Webhook + Resend emails
 */

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

// Send data to your Google Apps Script
async function sendToGoogleSheet(payload) {
  const url = "https://script.google.com/macros/s/AKfycbzthoTCSa2aIDb5yYzOQ9SIPzxz2-Ac3p9Ati29NYc_plOt0TabpBZVHY4L6q-hLarlRA/exec";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    return { sent: res.ok, status: res.status, result };
  } catch (err) {
    console.error("Google Sheet webhook error:", err);
    return { sent: false, reason: err.message };
  }
}

// Operator Notification Email
async function sendOperatorNotification(payload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://adforge-intelligence.onrender.com";

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
</style></head>
<body>
<div class="card">
  <div class="badge">NEW INTAKE</div>
  <h2>New Report Commission</h2>
  <table>
    <tr><td>Brand</td><td><strong>${payload.brandName}</strong></td></tr>
    <tr><td>Website</td><td>${payload.websiteUrl}</td></tr>
    <tr><td>Email</td><td>${payload.email}</td></tr>
    <tr><td>Country</td><td>${payload.country || "—"}</td></tr>
    <tr><td>Revenue</td><td>${payload.revenue || "—"}</td></tr>
    <tr><td>Platform</td><td>${payload.platform || "—"}</td></tr>
    <tr><td>Submitted</td><td>${new Date(payload.submittedAt).toLocaleString()}</td></tr>
  </table>
</div>
</body>
</html>

`.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${key}` 
      },
      body: JSON.stringify({
        from: "AdForge Intelligence <noreply@adforge.io>",
        to: [to],
        subject: `New Commission: ${payload.brandName}`,
        html,
      }),
    });
    return { sent: res.ok, status: res.status };
  } catch (err) {
    console.error("Operator email failed:", err);
    return { sent: false, reason: err.message };
  }
}

// Client Confirmation Email
async function sendClientConfirmation(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "Resend not configured" };

  const html = `
<p>Thank you for ordering the AdForge Intelligence Report for <strong>${payload.brandName}</strong>.</p>
<p>Your report is being prepared and will be delivered to your email within 12 hours.</p>
<p>Reference: AF-${Date.now().toString().slice(-6)}</p>`.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${key}` 
      },
      body: JSON.stringify({
        from: "AdForge Intelligence <chovitechnologies@gmail.com>",
        to: [payload.email],
        subject: "Your AdForge Intelligence Report is being prepared",
        html,
      }),
    });
    return { sent: res.ok };
  } catch (err) {
    console.error("Client email failed:", err);
    return { sent: false };
  }
}

// Main Handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const body = req.body || {};
  const { valid, error } = validatePayload(body);
  if (!valid) {
    return res.status(400).json({ error });
  }

  const payload = {
    submittedAt: body.submittedAt || new Date().toISOString(),
    brandName: String(body.brandName || "").trim(),
    websiteUrl: String(body.websiteUrl || "").trim(),
    email: String(body.email || "").trim().toLowerCase(),
    country: String(body.country || "").trim(),
    audience: String(body.audience || "").trim(),
    revenue: String(body.revenue || "").trim(),
    platform: String(body.platform || "").trim(),
    challenge: String(body.challenge || "").trim(),
    uploadName: String(body.uploadName || "").trim(),
    uploadSize: String(body.uploadSize || "").trim(),
    ip: ip,
    source: "adforge-v2",
  };

  // Always log to Render console
  console.log("=== NEW ADFORGE INTAKE ===");
  console.log(JSON.stringify(payload, null, 2));
  console.log("=========================");

  // Send to Google Sheet + Emails (non-blocking)
  const [sheetResult, operatorResult, clientResult] = await Promise.allSettled([
    sendToGoogleSheet(payload),
    sendOperatorNotification(payload),
    sendClientConfirmation(payload),
  ]);

  return res.status(200).json({
    success: true,
    message: "Intake received successfully. Your report will be prepared within 12 hours.",
    debug: {
      sheet: sheetResult.status === "fulfilled" ? sheetResult.value : { error: sheetResult.reason },
      operator: operatorResult.status === "fulfilled" ? operatorResult.value : { error: operatorResult.reason },
      client: clientResult.status === "fulfilled" ? clientResult.value : { error: clientResult.reason },
    }
  });
}
