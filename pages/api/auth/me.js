/**
 * AdForge Intelligence — Current User Endpoint
 * pages/api/auth/me.js
 *
 * GET /api/auth/me
 *
 * Returns the currently authenticated user from their JWT.
 * Used by the dashboard page to hydrate user state.
 */

// pages/api/auth/me.js
import { requireAuth } from "../../../lib/auth";

export default requireAuth(async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  // requireAuth HOC already verified JWT and set req.user
  return res.status(200).json({ success: true, user: req.user });
});
