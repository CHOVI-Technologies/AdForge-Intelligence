// pages/api/analytics/get.js
import { requireAuth } from "../../../lib/auth";

const SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK;

async function getAnalyticsFromSheets(email) {
  if (!SHEETS_URL) return { success: false, error: "Sheets not configured" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res  = await fetch(SHEETS_URL, {
      method:  "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body:    JSON.stringify({ action: "getAnalytics", email }),
      signal:  controller.signal,
    });
    clearTimeout(timer);
    const text = await res.text();
    if (text.trim().startsWith("<")) return { success: false, error: "html_response", entries: [] };
    return JSON.parse(text);
  } catch (err) {
    clearTimeout(timer);
    console.error("[analytics/get] Sheets error:", err.message);
    return { success: false, error: err.message, entries: [] };
  }
}

export default requireAuth(async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const email = req.user?.email;
  if (!email) return res.status(400).json({ error: "No email in token." });

  try {
    const result = await getAnalyticsFromSheets(email);
    return res.status(200).json({
      success: true,
      entries: result?.entries || [],
    });
  } catch (err) {
    console.error("[analytics/get] error:", err.message);
    return res.status(200).json({ success: true, entries: [] }); // Return empty rather than error
  }
});
