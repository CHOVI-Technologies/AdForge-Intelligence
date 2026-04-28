import { Icons } from "./Icons";
import { LINKS, COPY } from "../../lib/constants";

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
export default function Button({
  href,
  label,
  size = "md",
  variant = "gradient",
  arrow = true,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  as: Tag,
  style: extraStyle = {},
  className = "",
}) {
  // Determine destination
  const destination = href || LINKS.intake;
  const buttonLabel = label || COPY.hero.cta;

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
