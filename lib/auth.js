/**
 * AdForge Intelligence — Auth Utilities
 * lib/auth.js
 *
 * Handles JWT creation/verification and password hashing.
 *
 * WHY BCRYPTJS FOR HASHING BUT SHA-256 FOR SHEETS:
 * bcryptjs is expensive by design (brute-force protection).
 * We use it server-side to verify passwords.
 * But Google Sheets can't run bcrypt. So we store a SHA-256 hash
 * in Sheets (still better than plaintext) and use bcrypt server-side.
 *
 * UPGRADE PATH:
 * When you move to Supabase/Postgres, swap getUser/createUser calls
 * in the auth routes to query your DB instead of Sheets.
 * JWT logic stays identical.
 */

// lib/auth.js

import jwt      from "jsonwebtoken";
import bcrypt   from "bcryptjs";
import crypto   from "crypto";

const JWT_SECRET  = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "dev-secret-change-this" : null);
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "30d";

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("FATAL: JWT_SECRET environment variable must be set in production");
}

// ── JWT ───────────────────────────────────────────────────────────

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function getTokenFromRequest(req) {
  // 1. Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }

  // 2. httpOnly cookie: af_token
  const cookies = parseCookies(req.headers.cookie || "");
  if (cookies.af_token) {
    return verifyToken(cookies.af_token);
  }

  throw new Error("No authentication token provided");
}

// ── Password ──────────────────────────────────────────────────────

/**
 * SHA-256 hash — used for Google Sheets storage.
 * Sheets is a lightweight DB that can't run bcrypt.
 * SHA-256 is faster and still better than plaintext.
 * Upgrade to bcrypt-in-DB when migrating to Postgres.
 */
export function sha256(str) {
  return crypto.createHash("sha256").update(String(str)).digest("hex");
}

/** bcrypt hash — for future use with proper DB */
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

/** Compare plaintext against bcrypt hash */
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// ── Cookie ────────────────────────────────────────────────────────

export function setAuthCookie(res, token) {
  const maxAge    = 30 * 24 * 60 * 60; // 30 days in seconds
  const secure    = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `af_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
  );
}

export function clearAuthCookie(res) {
  res.setHeader(
    "Set-Cookie",
    "af_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
  );
}

// ── Auth middleware HOC ───────────────────────────────────────────

export function requireAuth(handler) {
  return async function (req, res) {
    try {
      const user = getTokenFromRequest(req);
      req.user   = user;
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
  };
}

// ── Order ref generator ───────────────────────────────────────────

export function generateOrderRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "AF-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// ── Utilities ─────────────────────────────────────────────────────

function parseCookies(cookieStr) {
  const out = {};
  if (!cookieStr) return out;
  cookieStr.split(";").forEach(c => {
    const [k, ...v] = c.split("=");
    if (k) out[k.trim()] = decodeURIComponent(v.join("=").trim());
  });
  return out;
}
