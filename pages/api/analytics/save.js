// pages/api/analytics/save.js
import { requireAuth } from "../../../lib/auth";
import { pingSheets }  from "../../../lib/sheets";

// We call sheets directly using the same pattern as other routes
const SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK;

async function saveAnalyticsToSheets(payload) {
  if (!SHEETS_URL) return { success: false, error: "Sheets not configured" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res  = await fetch(SHEETS_URL, {
      method:  "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body:    JSON.stringify({ action: "saveAnalytics", ...payload }),
      signal:  controller.signal,
    });
    clearTimeout(timer);
    const text = await res.text();
    if (text.trim().startsWith("<")) return { success: false, error: "html_response" };
    return JSON.parse(text);
  } catch (err) {
    clearTimeout(timer);
    console.error("[analytics/save] Sheets error:", err.message);
    return { success: false, error: err.message };
  }
}

export default requireAuth(async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    orderRef, brandName,
    directionsTested, roasBefore, roasAfter,
    ctrBefore, ctrAfter, monthlySpend, revenueImpact,
    rating, notes,
  } = req.body || {};

  const email = req.user?.email;
  if (!email)    return res.status(400).json({ error: "No email in token." });
  if (!orderRef) return res.status(400).json({ error: "orderRef is required." });

  const result = await saveAnalyticsToSheets({
    orderRef, email, brandName: brandName || "",
    directionsTested: directionsTested || 0,
    roasBefore:   roasBefore   || "",
    roasAfter:    roasAfter    || "",
    ctrBefore:    ctrBefore    || "",
    ctrAfter:     ctrAfter     || "",
    monthlySpend: monthlySpend || "",
    revenueImpact:revenueImpact|| "",
    rating:       rating       || "",
    notes:        notes        || "",
  });

  if (!result?.success) {
    console.error("[analytics/save] failed:", result?.error);
    return res.status(500).json({ error: result?.error || "Failed to save analytics." });
  }

  console.log("[analytics/save] saved:", result.id, "for", email);
  return res.status(200).json({ success: true, id: result.id });
});
