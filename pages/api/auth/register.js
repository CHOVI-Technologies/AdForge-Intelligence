/**
 * AdForge Intelligence — User Registration
 * pages/api/auth/register.js
 *
 * POST /api/auth/register
 * Body: { email, password, name, brandName, orderRef }
 *
 * Creates a new user account in Google Sheets.
 * Returns a JWT token on success.
 */

// pages/api/auth/register.js
import { sha256, signToken, setAuthCookie, generateOrderRef } from "../../../lib/auth";
import { createUser, getUser } from "../../../lib/sheets";
import { sendWelcomeEmail } from "../../../lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password, brandName, orderRef } = req.body || {};

  // ── Validate ─────────────────────────────────────────────────
  if (!email?.trim() || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const emailNorm = email.trim().toLowerCase();

  // ── Check duplicate ───────────────────────────────────────────
  try {
    const existing = await getUser(emailNorm);
    if (existing?.found) {
      return res.status(409).json({ error: "An account with this email already exists. Please sign in instead." });
    }
  } catch (err) {
    console.error("[register] getUser check error:", err.message);
    // Don't block — proceed with registration
  }

  // ── Hash password (SHA-256 for Sheets storage) ────────────────
  const passwordHash = sha256(password);

  // ── Save to Sheets ────────────────────────────────────────────
  let createResult;
  try {
    createResult = await createUser({
      email:        emailNorm,
      passwordHash,
      name:         name?.trim() || "",
      brandName:    brandName?.trim() || "",
      orderRef:     orderRef || "",
    });
  } catch (err) {
    console.error("[register] createUser error:", err.message);
    return res.status(500).json({ error: "Failed to create account. Please try again." });
  }

  if (!createResult?.success) {
    // Could be duplicate caught at DB level
    if (createResult?.error?.includes("already exists")) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    return res.status(400).json({ error: createResult?.error || "Account creation failed." });
  }

  // ── Build user object ─────────────────────────────────────────
  const user = {
    email:     emailNorm,
    name:      name?.trim() || "",
    brandName: brandName?.trim() || "",
    orderRef:  orderRef || "",
  };

  // ── Sign JWT ──────────────────────────────────────────────────
  const token = signToken(user);
  setAuthCookie(res, token);

  // ── Welcome email (non-blocking) ──────────────────────────────
  sendWelcomeEmail({ email: user.email, name: user.name, orderRef })
    .catch(err => console.error("[register] welcome email error:", err.message));

  console.log("[register] New user:", emailNorm);

  return res.status(201).json({ success: true, token, user });
}
