// lib/sheets.js — Updated with getOrderByRef + analytics support
// CRITICAL: Content-Type MUST be "text/plain;charset=utf-8" — NOT application/json
// Reason: application/json triggers CORS preflight which Apps Script cannot handle

const SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK;
const TIMEOUT_MS = 15000;

async function sheetsRequest(payload) {
  if (!SHEETS_URL) {
    console.error("[sheets] GOOGLE_SHEETS_WEBHOOK not configured");
    return { success: false, error: "sheets_not_configured" };
  }

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(SHEETS_URL, {
      method:  "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });
    clearTimeout(timer);

    const raw = await res.text();

    if (raw.trim().startsWith("<!") || raw.trim().startsWith("<h")) {
      console.error("[sheets] HTML response — check Apps Script URL and 'Anyone' access setting");
      return { success: false, error: "html_response_check_deployment" };
    }

    try {
      return JSON.parse(raw);
    } catch {
      console.error("[sheets] Non-JSON:", raw.slice(0, 150));
      return { success: false, error: "invalid_json" };
    }
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      console.error("[sheets] Timeout after", TIMEOUT_MS, "ms");
      return { success: false, error: "timeout" };
    }
    console.error("[sheets] Fetch error:", err.message);
    return { success: false, error: err.message };
  }
}

// ── Orders ────────────────────────────────────────────────────────
export const saveOrder          = (data)   => sheetsRequest({ action:"saveOrder",     ...data });
export const updateOrderPayment = (data)   => sheetsRequest({ action:"updateOrder",   ...data, paymentDate: new Date().toISOString() });
export const getOrderByRef      = (ref)    => sheetsRequest({ action:"getOrderByRef", orderRef: ref });
export const getOrders          = (email)  => sheetsRequest({ action:"getOrders",     email: String(email||"").toLowerCase().trim() });

// ── Users ─────────────────────────────────────────────────────────
export const createUser  = (data)  => sheetsRequest({ action:"createUser",  ...data, email: String(data.email||"").toLowerCase().trim() });
export const loginUser   = (data)  => sheetsRequest({ action:"loginUser",   ...data, email: String(data.email||"").toLowerCase().trim() });
export const getUser     = (email) => sheetsRequest({ action:"getUser",     email: String(email||"").toLowerCase().trim() });

// ── Analytics ─────────────────────────────────────────────────────
export const saveAnalytics = (data)  => sheetsRequest({ action:"saveAnalytics", ...data });
export const getAnalytics  = (email) => sheetsRequest({ action:"getAnalytics",  email: String(email||"").toLowerCase().trim() });

// ── Utilities ─────────────────────────────────────────────────────
export const pingSheets = () => sheetsRequest({ action: "ping" });
