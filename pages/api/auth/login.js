/**
 * AdForge Intelligence — User Login
 * pages/api/auth/login.js
 *
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Validates credentials against Google Sheets.
 * Returns a JWT token on success.
 */

// pages/api/auth/login.js
import { sha256, signToken, setAuthCookie } from "../../../lib/auth";
import { loginUser } from "../../../lib/sheets";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};

  if (!email?.trim() || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const emailNorm    = email.trim().toLowerCase();
  const passwordHash = sha256(password);

  let result;
  try {
    result = await loginUser({ email: emailNorm, passwordHash });
  } catch (err) {
    console.error("[login] error:", err.message);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }

  if (!result?.success) {
    // Same error for not-found AND wrong password — prevents email enumeration
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user  = result.user;
  const token = signToken(user);
  setAuthCookie(res, token);

  console.log("[login] User logged in:", emailNorm);

  return res.status(200).json({ success: true, token, user });
}
