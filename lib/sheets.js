// lib/sheets.js

/**
 * AdForge Intelligence — Google Sheets Interface
 *
 * CRITICAL: Content-Type MUST be "text/plain;charset=utf-8"
 * Sending "application/json" triggers a CORS preflight (OPTIONS)
 * that Apps Script cannot handle — it returns an HTML redirect page.
 * text/plain bypasses the preflight. Body is still valid JSON.
 * Apps Script parses it with: JSON.parse(e.postData.contents)
 */

const SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK;
const TIMEOUT_MS = 15000; // 15s — Apps Script cold starts can be slow

async function sheetsRequest(payload) {
  if (!SHEETS_URL) {
    console.error("[sheets] GOOGLE_SHEETS_WEBHOOK not set");
    return { success: false, error: "sheets_not_configured" };
  }

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(SHEETS_URL, {
      method:  "POST",
      headers: {
        // DO NOT change to application/json — see file header comment
        "Content-Type": "text/plain;charset=utf-8",
      },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });

    clearTimeout(timer);

    const raw = await res.text();

    // HTML = Apps Script auth/redirect issue
    if (raw.trim().startsWith("<!") || raw.trim().startsWith("<h")) {
      console.error("[sheets] Got HTML response — check deployment URL and 'Anyone' access");
      return { success: false, error: "html_response_check_deployment" };
    }

    try {
      const json = JSON.parse(raw);
      return json;
    } catch {
      console.error("[sheets] Non-JSON response:", raw.slice(0, 150));
      return { success: false, error: "invalid_json_response" };
    }

  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      console.error("[sheets] Request timed out after", TIMEOUT_MS, "ms");
      return { success: false, error: "timeout" };
    }
    console.error("[sheets] Fetch error:", err.message);
    return { success: false, error: err.message };
  }
}

// ── Public API ────────────────────────────────────────────────────

export function saveOrder(data) {
  return sheetsRequest({ action: "saveOrder", ...data });
}

export function updateOrderPayment({ orderRef, email, transactionId, paymentStatus }) {
  return sheetsRequest({
    action:        "updateOrder",
    orderRef,
    email,
    transactionId: String(transactionId || ""),
    paymentStatus,
    paymentDate:   new Date().toISOString(),
  });
}

export function getOrderByRef(orderRef) {
  return sheetsRequest({ action: "getOrderByRef", orderRef });
}

export function getOrders(email) {
  return sheetsRequest({ action: "getOrders", email: String(email || "").toLowerCase().trim() });
}

export function createUser({ email, passwordHash, name, brandName, orderRef }) {
  return sheetsRequest({
    action:       "createUser",
    email:        String(email || "").toLowerCase().trim(),
    passwordHash,
    name:         name || "",
    brandName:    brandName || "",
    orderRef:     orderRef || "",
  });
}

export function loginUser({ email, passwordHash }) {
  return sheetsRequest({
    action:       "loginUser",
    email:        String(email || "").toLowerCase().trim(),
    passwordHash,
  });
}

export function getUser(email) {
  return sheetsRequest({
    action: "getUser",
    email:  String(email || "").toLowerCase().trim(),
  });
}

export function pingSheets() {
  return sheetsRequest({ action: "ping" });
}
