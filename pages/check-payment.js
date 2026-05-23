// pages/api/check-payment.js
// GET /api/check-payment?ref=AF-XXXXXX
// Polls Google Sheets for payment status.
// Called by /confirm when user arrives via ?ref= (async bank transfer flow).

import { getOrderByRef } from "../../lib/sheets";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { ref } = req.query;

  if (!ref || typeof ref !== "string" || !ref.startsWith("AF-")) {
    return res.status(400).json({ error: "Valid order ref required" });
  }

  try {
    const result = await getOrderByRef(ref.trim());

    if (!result || !result.found) {
      return res.status(200).json({
        found:         false,
        paymentStatus: "pending",
        orderRef:      ref,
      });
    }

    return res.status(200).json({
      found:         true,
      paymentStatus: result.paymentStatus || "pending",
      orderRef:      result.orderRef,
      email:         result.email,
      brandName:     result.brandName,
      transactionId: result.transactionId || "",
      paymentDate:   result.paymentDate   || "",
    });

  } catch (err) {
    console.error("[check-payment] Error:", err.message);
    // Return pending so client keeps polling rather than showing an error
    return res.status(200).json({
      found:         false,
      paymentStatus: "pending",
      orderRef:      ref,
      error:         err.message,
    });
  }
}
