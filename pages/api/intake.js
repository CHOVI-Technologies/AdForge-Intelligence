/**
 * AdForge Intelligence — Intake Form API
 * pages/api/intake.js
 *
 * POST /api/intake
 *
 * WHAT WAS BROKEN & WHAT WAS FIXED:
 * 1. Was calling Zapier (old) — now calls Google Sheets via Apps Script
 * 2. Was using unverified Resend domain — now uses env var RESEND_FROM_EMAIL
 * 3. No order reference generated — now generates and returns orderRef
 * 4. Errors were silently swallowed — now logged clearly
 * 5. No input sanitization length limits — now sanitized
 *
 * FLOW:
 *   Client submits form → POST /api/intake
 *   → Validate required fields
 *   → Generate order reference
 *   → Save to Google Sheets (non-blocking — doesn't fail the request)
 *   → Send operator notification email
 *   → Send client confirmation email
 *   → Return { success: true, orderRef }
 *   → Client is redirected to Flutterwave with orderRef in tx_ref
 */

// pages/api/intake.js
import { generateOrderRef } from "../../lib/auth";
import { saveOrder }        from "../../lib/sheets";
import { sendOperatorNotification, sendClientConfirmation } from "../../lib/email";

function validate(body) {
  const errors = [];
  if (!body.brandName?.trim())  errors.push("brandName is required");
  if (!body.websiteUrl?.trim()) errors.push("websiteUrl is required");
  if (!body.email?.trim())      errors.push("email is required");
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("Invalid email");
  if (body.websiteUrl && !/^https?:\/\/.+/.test(body.websiteUrl)) errors.push("websiteUrl must start with https://");
  return errors;
}

function sanitize(body) {
  const s = (v, max = 500) => String(v || "").trim().slice(0, max);
  return {
    brandName:   s(body.brandName, 200),
    websiteUrl:  s(body.websiteUrl, 500),
    email:       s(body.email, 254).toLowerCase(),
    country:     s(body.country, 100),
    audience:    s(body.audience, 500),
    revenue:     s(body.revenue, 100),
    platform:    s(body.platform, 100),
    challenge:   s(body.challenge, 2000),
    uploadName:  s(body.uploadName, 255),
    uploadSize:  s(body.uploadSize, 50),
    source:      "adforge-v3",
    submittedAt: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};

  // ── Validate ──────────────────────────────────────────────────
  const errors = validate(body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0], errors });
  }

  // ── Build payload ─────────────────────────────────────────────
  const orderRef = generateOrderRef();
  const ip       = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();

  const payload = {
    ...sanitize(body),
    orderRef,
    ip,
    paymentStatus: "pending",
  };

  // ── Console log — ALWAYS (emergency fallback record) ──────────
  console.log("[intake] New submission:", JSON.stringify({
    orderRef,
    brand:   payload.brandName,
    email:   payload.email,
    country: payload.country,
    ts:      payload.submittedAt,
  }));

  // ── Save to Google Sheets — non-blocking ──────────────────────
  // We do NOT await — user gets instant response regardless of Sheets speed.
  // If Sheets fails, console.log above is the emergency record.
  saveOrder(payload)
    .then(result => {
      if (!result?.success) {
        console.error("[intake] Sheets save failed:", result?.error || "unknown");
      } else {
        console.log("[intake] Sheets saved OK — orderRef:", orderRef);
      }
    })
    .catch(err => console.error("[intake] Sheets exception:", err.message));

  // ── Send emails — non-blocking ────────────────────────────────
  Promise.allSettled([
    sendOperatorNotification(payload),
    sendClientConfirmation(payload),
  ]).then(results => {
    const labels = ["operator", "client"];
    results.forEach((r, i) => {
      if (r.status === "rejected") console.error(`[intake] ${labels[i]} email rejected:`, r.reason?.message);
      else if (!r.value?.success)  console.error(`[intake] ${labels[i]} email failed:`,   r.value?.error);
      else                         console.log(`[intake] ${labels[i]} email sent OK`);
    });
  });

  // ── Return immediately with orderRef ──────────────────────────
  return res.status(200).json({
    success:  true,
    orderRef: orderRef,
    message:  "Intake received. Proceed to payment.",
  });
}
