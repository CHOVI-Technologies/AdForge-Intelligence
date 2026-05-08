
/**
 * Button — Primary CTA component
 *
 * Props:
 *   href      {string}  — link destination (default: intake page)
 *   label     {string}  — button text (default: from constants)
 *   size      {"sm"|"md"|"lg"} — button size
 *   variant   {"gradient"|"outline"|"ghost"} — visual style
 *   arrow     {boolean} — show arrow icon (default: true)
 *   onClick   {function} — click handler (overrides href)
 *   disabled  {boolean}
 *   loading   {boolean} — show loading spinner
 *   fullWidth {boolean}
 *   as        {"a"|"button"} — element type
 */
// components/ui/Button.jsx
import { useState } from "react";
import { Icons } from "./Icons";
import { C } from "../../lib/constants";

export default function Button({
  label, onClick, href, size = "md", variant = "gradient",
  arrow = true, loading = false, disabled = false, fullWidth = false, style: sx = {},
}) {
  const [hov, setHov] = useState(false);

  const pad = { sm: "10px 22px", md: "12px 28px", lg: "15px 38px" }[size];
  const fs  = { sm: 13, md: 15, lg: 17 }[size];

  const base = {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: pad, borderRadius: 11, border: "none",
    fontFamily: "'DM Sans',sans-serif", fontSize: fs, fontWeight: 700,
    letterSpacing: "-0.01em", cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, textDecoration: "none",
    transition: "all 0.22s ease", width: fullWidth ? "100%" : "auto",
    justifyContent: fullWidth ? "center" : "flex-start",
    transform: hov && !disabled ? "translateY(-1px)" : "translateY(0)",
    ...sx,
  };

  const variants = {
    gradient: { background: C.grad, color: "#fff", boxShadow: hov ? "0 0 52px rgba(0,184,150,.38),0 8px 28px rgba(0,102,204,.28)" : "0 0 36px rgba(0,184,150,.25),0 4px 18px rgba(0,102,204,.18)" },
    gold:     { background: C.gradGold, color: "#06081A", boxShadow: hov ? "0 0 42px rgba(201,168,76,.44)" : "0 0 28px rgba(201,168,76,.3)" },
    outline:  { background: "transparent", color: C.teal, border: `1px solid ${hov ? "rgba(0,184,150,0.5)" : "rgba(0,184,150,0.3)"}`, boxShadow: "none" },
    ghost:    { background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", color: C.muted, border: `1px solid ${C.border}`, boxShadow: "none" },
  };

  const Spinner = () => (
    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block", flexShrink: 0 }} />
  );

  const content = (
    <>
      {loading ? <Spinner /> : label}
      {arrow && !loading && <Icons.Arrow size={15} />}
    </>
  );

  if (href) return (
    <a href={href} style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {content}
    </a>
  );

  return (
    <button onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {content}
    </button>
  );
}
  // Size tokens
  const sizes = {
    sm: { padding: "10px 22px", fontSize: 14 },
    md: { padding: "13px 28px", fontSize: 15 },
    lg: { padding: "16px 38px", fontSize: 17 },
  };

  // Variant styles
  const variants = {
    gradient: {
      background: "linear-gradient(135deg, #00B896 0%, #0066CC 100%)",
      color: "#fff",
      border: "none",
      boxShadow: "0 0 40px rgba(0,184,150,0.28), 0 4px 20px rgba(0,102,204,0.2)",
    },
    outline: {
      background: "transparent",
      color: "#00B896",
      border: "1px solid rgba(0,184,150,0.4)",
      boxShadow: "none",
    },
    ghost: {
      background: "rgba(0,184,150,0.08)",
      color: "#00B896",
      border: "1px solid rgba(0,184,150,0.15)",
      boxShadow: "none",
    },
  };

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 11,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
    width: fullWidth ? "100%" : "auto",
    justifyContent: fullWidth ? "center" : "flex-start",
    ...sizes[size],
    ...variants[variant],
    ...extraStyle,
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = "translateY(-1px)";
      if (variant === "gradient") {
        e.currentTarget.style.boxShadow = "0 0 52px rgba(0,184,150,0.38), 0 8px 28px rgba(0,102,204,0.28)";
      }
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = variants[variant].boxShadow || "none";
  };

  // Spinner for loading state
  const Spinner = () => (
    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block", flexShrink: 0 }} />
  );

  // If onClick provided, render button
  if (onClick || Tag === "button") {
    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled || loading}
        style={baseStyle}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {loading ? <Spinner /> : buttonLabel}
        {arrow && !loading && <Icons.ArrowRight size={16} />}
      </button>
    );
  }

  return (
    <a
      href={disabled ? undefined : destination}
      style={baseStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading ? <Spinner /> : buttonLabel}
      {arrow && !loading && <Icons.ArrowRight size={16} />}
    </a>
  );
}
