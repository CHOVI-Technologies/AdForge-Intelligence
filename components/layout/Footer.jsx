// components/layout/Footer.jsx
import Link from "next/link";
import { Icons } from "../ui/Icons";
import { C, BRAND } from "../../lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,0.01)", padding: "36px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18, marginBottom: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.BarChart size={13} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 800, color: C.text }}>AdForge Intelligence</span>
          </Link>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["/#how-it-works","How It Works"],["/#deliverables","Deliverables"],["/#guarantee","Guarantee"],["mailto:"+BRAND.email,"Contact"]].map(([href,label]) => (
              <a key={label} href={href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.dim}>
                {label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <a href={`mailto:${BRAND.email}`} title="Email support" style={{ color: C.dim, transition: "color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.teal} onMouseLeave={e=>e.currentTarget.style.color=C.dim}>
              <Icons.Mail size={17} />
            </a>
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ color: C.dim, transition: "color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#25D366"} onMouseLeave={e=>e.currentTarget.style.color=C.dim}>
              <Icons.Msg size={17} />
            </a>
          </div>
        </div>
        <div style={{ paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.04)`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim }}>© {year} AdForge Intelligence. All rights reserved.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Icons.Lock size={11} color={C.dim} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim }}>Payments by Flutterwave</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
