/**
 * pages/api/orders.js
 * GET /api/orders — returns orders for the logged-in user
 */

// pages/api/orders.js
import { requireAuth } from "../../lib/auth";
import { getOrders }   from "../../lib/sheets";

export default requireAuth(async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const email = req.user?.email;
  if (!email) return res.status(400).json({ error: "No email in token." });

  try {
    const result = await getOrders(email);
    return res.status(200).json({
      success: true,
      orders:  result?.orders || [],
    });
  } catch (err) {
    console.error("[orders] error:", err.message);
    return res.status(500).json({ error: "Failed to fetch orders." });
  }
});
