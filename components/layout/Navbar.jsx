// components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { Icons } from "../ui/Icons";
import { C } from "../../lib/constants";

export default function Navbar() {
  const { user, isLoggedIn, openAuth, logout, authLoading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleGetReport = () => {
    if (isLoggedIn) router.push("/intake");
    else openAuth("signup", () => router.push("/intake"));
  };

  const handleSignIn = () => openAuth("login");

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        height: 68,
        background: scrolled ? "rgba(6,8,26,0.95)" : "rgba(6,8,26,0.7)",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all .35s ease",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icons.BarChart size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 800, color: C.text }}>
              AdForge <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {["/#how-it-works", "/#deliverables", "/#guarantee"].map((href, i) => (
              <a key={href} href={href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = C.teal}
                onMouseLeave={e => e.target.style.color = C.muted}>
                {["How It Works", "Deliverables", "Guarantee"][i]}
              </a>
            ))}

            {!authLoading && (
              isLoggedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>
                    Hi, <strong style={{ color: C.text }}>{user?.name?.split(" ")[0] || user?.email?.split("@")[0]}</strong>
                  </span>
                  <Link href="/dashboard" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.teal, textDecoration: "none" }}>
                    Dashboard
                  </Link>
                  <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.dim, fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer" }}>
                    <Icons.LogOut size={13} /> Sign out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={handleSignIn} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 16px", color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Sign In
                  </button>
                  <button onClick={handleGetReport} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(0,184,150,.22)" }}>
                    Get Report — $397
                  </button>
                </div>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="nav-mobile-btn" onClick={() => setMenuOpen(o => !o)}
            style={{ display: "none", background: "none", border: "none", color: C.text, cursor: "pointer", padding: 4 }}>
            {menuOpen ? <Icons.X size={22} /> : <Icons.Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 68, left: 0, right: 0, zIndex: 199,
        background: "rgba(6,8,26,0.98)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        transform: menuOpen ? "translateY(0)" : "translateY(-110%)",
        transition: "transform .32s cubic-bezier(0.4,0,0.2,1)",
        padding: "16px 24px 28px",
      }}>
        {[["/#how-it-works","How It Works"],["/#deliverables","Deliverables"],["/#guarantee","Guarantee"]].map(([href, label]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}
            style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(240,242,255,0.75)", padding: "13px 0", borderBottom: `1px solid ${C.border}`, textDecoration: "none" }}>
            {label}
          </a>
        ))}

        {!authLoading && (
          isLoggedIn ? (
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                style={{ display: "block", padding: "13px", borderRadius: 10, background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textAlign: "center", textDecoration: "none" }}>
                My Dashboard
              </Link>
              <button onClick={() => { setMenuOpen(false); logout(); }}
                style={{ padding: "12px", borderRadius: 10, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, cursor: "pointer" }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => { setMenuOpen(false); handleGetReport(); }}
                style={{ padding: "14px", borderRadius: 10, border: "none", background: C.grad, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Get Report — $397
              </button>
              <button onClick={() => { setMenuOpen(false); handleSignIn(); }}
                style={{ padding: "12px", borderRadius: 10, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, cursor: "pointer" }}>
                Sign In
              </button>
            </div>
          )
        )}
      </div>

      <style>{`
        @media(max-width:768px){ .nav-desktop{display:none!important;} .nav-mobile-btn{display:flex!important;} }
        @media(min-width:769px){ .nav-mobile-btn{display:none!important;} }
      `}</style>
    </>
  );
}
        height: 70,
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        background: isBlurred ? "rgba(6,8,26,0.92)" : "transparent",
        backdropFilter: isBlurred ? "blur(20px) saturate(1.5)" : "none",
        WebkitBackdropFilter: isBlurred ? "blur(20px) saturate(1.5)" : "none",
        borderBottom: isBlurred ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href={LINKS.home} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 8,
              background: "linear-gradient(135deg, #00B896, #0066CC)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icons.BarChart size={18} color="#fff" />
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, fontWeight: 800,
              color: COLORS.text,
              letterSpacing: "-0.02em",
            }}>
              {BRAND.shortName}{" "}
              <span style={{
                background: "linear-gradient(135deg, #00B896, #0066CC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Intelligence</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {NAV_ITEMS.map(({ label, href }) => (
              <a key={label} href={href} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 500,
                color: COLORS.textMuted,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
                onMouseEnter={e => e.target.style.color = COLORS.teal}
                onMouseLeave={e => e.target.style.color = COLORS.textMuted}
              >
                {label}
              </a>
            ))}

            <a href={LINKS.intake} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 20px",
              borderRadius: 9,
              background: "linear-gradient(135deg, #00B896, #0066CC)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(0,184,150,0.25)",
              transition: "opacity 0.2s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Get Report — $397
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none", border: "none",
              color: COLORS.text,
              padding: 4, cursor: "pointer",
              display: "none",
              alignItems: "center", justifyContent: "center",
            }}
          >
            {menuOpen ? <Icons.X size={22} /> : <Icons.Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div style={{
        position: "fixed",
        top: 70, left: 0, right: 0,
        zIndex: 199,
        background: "rgba(6,8,26,0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        transform: menuOpen ? "translateY(0)" : "translateY(-110%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        padding: "20px 24px 28px",
      }}>
        {NAV_ITEMS.map(({ label, href }) => (
          <a key={label} href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, fontWeight: 500,
              color: "rgba(240,242,255,0.7)",
              padding: "13px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
        <a href={LINKS.intake} style={{
          display: "block", marginTop: 20,
          padding: "15px",
          borderRadius: 10,
          background: "linear-gradient(135deg, #00B896, #0066CC)",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 700,
          textAlign: "center", textDecoration: "none",
        }}>
          Request Report — $397
        </a>
      </div>

      {/* Spacer */}
      <div style={{ height: 70 }} />
    </>
  );
}
