import { BRAND, LINKS, COLORS } from "../../lib/constants";
import { Icons } from "../ui/Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.01)",
      padding: "40px 24px",
    }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg,#00B896,#0066CC)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.BarChart size={14} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 800, color: COLORS.text }}>
                {BRAND.shortName} Intelligence
              </span>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: COLORS.textDim }}>
              Precision market intelligence for DTC brands.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { label: "How It Works", href: "/#how-it-works" },
              { label: "Deliverables",  href: "/#deliverables" },
              { label: "Guarantee",     href: "/#guarantee" },
              { label: `Contact`,       href: `mailto:${BRAND.email}` },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13, color: COLORS.textDim,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = COLORS.teal}
                onMouseLeave={e => e.target.style.color = COLORS.textDim}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Support Contacts */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href={`mailto:${BRAND.email}`}
              title="Email support"
              style={{ color: COLORS.textDim, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = COLORS.teal}
              onMouseLeave={e => e.target.style.color = COLORS.textDim}
            >
              <Icons.Mail size={18} />
            </a>
            <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
              title="WhatsApp support"
              style={{ color: COLORS.textDim, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#25D366"}
              onMouseLeave={e => e.target.style.color = COLORS.textDim}
            >
              <Icons.MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: COLORS.textDim }}>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.Lock size={12} color={COLORS.textDim} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: COLORS.textDim }}>
              Payments secured by Flutterwave
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
