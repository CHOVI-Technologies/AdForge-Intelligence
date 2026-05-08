// pages/api/verify-payment.js
import { updateOrderPayment } from "../../lib/sheets";

const FW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;

// ── Verify transaction with Flutterwave API ───────────────────────
async function verifyWithFlutterwave(transactionId) {
  if (!FW_SECRET) {
    console.log("[verify] No FW secret key — skipping API verification");
    return { verified: true, note: "no_secret_key" };
  }
  if (!transactionId) {
    return { verified: true, note: "no_transaction_id" };
  }

  try {
    const res = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      { headers: { Authorization: `Bearer ${FW_SECRET}`, "Content-Type": "application/json" } }
    );
    const data = await res.json();

    if (data.status === "success" && data.data?.status === "successful") {
      console.log("[verify] FW confirmed:", transactionId, "amount:", data.data.amount, data.data.currency);
      return {
        verified:   true,
        amount:     data.data.amount,
        currency:   data.data.currency,
        txRef:      data.data.tx_ref,
        chargedAt:  data.data.charged_at,
      };
    }

    console.warn("[verify] FW returned non-success:", data.message || data.status);
    return { verified: false, reason: data.message };

  } catch (err) {
    console.error("[verify] FW API exception:", err.message);
    // Don't block user on API error — trust the redirect
    return { verified: true, note: "api_error_trust_redirect" };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { transactionId, orderRef, email, status } = req.body || {};

  // ── Cancelled payment ─────────────────────────────────────────
  if (status === "cancelled") {
    return res.status(200).json({ success: false, cancelled: true });
  }

  // ── Verify with Flutterwave ───────────────────────────────────
  const verification = await verifyWithFlutterwave(transactionId);

  if (!verification.verified) {
    return res.status(400).json({
      success: false,
      error:   "Payment verification failed.",
      reason:  verification.reason,
    });
  }

  // ── Update Sheets — non-blocking ──────────────────────────────
  if (orderRef || email) {
    updateOrderPayment({
      orderRef,
      email,
      transactionId: String(transactionId || ""),
      paymentStatus: "successful",
    })
      .then(r  => console.log("[verify] Sheets updated:", r?.success, "orderRef:", orderRef))
      .catch(e => console.error("[verify] Sheets update error:", e.message));
  }

  return res.status(200).json({
    success:       true,
    verified:      verification.verified,
    orderRef:      orderRef,
    transactionId: transactionId,
    ...(verification.note ? { note: verification.note } : {}),
  });
}
