import { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND, LINKS, COLORS } from "../../lib/constants";
import { Icons } from "../ui/Icons";

const NAV_ITEMS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Deliverables",  href: "/#deliverables" },
  { label: "Guarantee",     href: "/#guarantee" },
];

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isBlurred = scrolled || !transparent;

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
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
