// pages/dashboard.jsx — ENHANCED
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { useAuth } from "../context/AuthContext";
import { C, BRAND, PRICE } from "../lib/constants";

const SITE    = process.env.NEXT_PUBLIC_SITE_URL || "https://adforgeintelligence.onrender.com";
const FLW_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";

function retryPayment({ orderRef, email, name, amount, currency }) {
  if (typeof window === "undefined" || !window.FlutterwaveCheckout) {
    alert("Payment system loading. Please refresh and try again."); return;
  }
  localStorage.setItem("af_orderRef", orderRef);
  localStorage.setItem("af_email",    email);
  localStorage.removeItem("af_transactionId");
  window.FlutterwaveCheckout({
    public_key: FLW_KEY, tx_ref: orderRef,
    amount: amount || PRICE.amount, currency: currency || PRICE.currency,
    payment_options: "card,banktransfer,ussd",
    redirect_url: SITE + "/confirm",
    customer: { email, name: name || email },
    customizations: { title: "AdForge Intelligence", description: "Ad Intelligence Report" },
    callback: function(data) {
      if (data.status === "successful" || data.status === "completed") {
        localStorage.setItem("af_transactionId", String(data.transaction_id || ""));
        window.location.href = SITE + "/confirm?status=successful&tx_ref=" + encodeURIComponent(data.tx_ref || orderRef) + "&transaction_id=" + encodeURIComponent(data.transaction_id || "");
      }
    },
    onclose: function() {
      const ref = localStorage.getItem("af_orderRef") || orderRef;
      const tx  = localStorage.getItem("af_transactionId") || "";
      if (tx) window.location.href = SITE + "/confirm?status=successful&tx_ref=" + encodeURIComponent(ref) + "&transaction_id=" + encodeURIComponent(tx);
      else    window.location.href = SITE + "/confirm?ref=" + encodeURIComponent(ref);
    },
  });
}

function StatusBadge({ status }) {
  const map = {
    successful: { bg:"rgba(0,184,150,.12)",  color:"#00B896", border:"rgba(0,184,150,.3)",  label:"✓ Paid"              },
    pending:    { bg:"rgba(245,158,11,.1)",   color:"#F59E0B", border:"rgba(245,158,11,.3)", label:"⏳ Awaiting Payment" },
    cancelled:  { bg:"rgba(239,68,68,.1)",    color:"#EF4444", border:"rgba(239,68,68,.3)",  label:"✕ Cancelled"        },
  };
  const { bg, color, border, label } = map[status] || map.pending;
  return (
    <span style={{ padding:"4px 12px", borderRadius:100, background:bg, color, border:"1px solid "+border, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700 }}>
      {label}
    </span>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div style={{ padding:"20px 22px", borderRadius:14, border:"1px solid "+C.border, background:C.surface }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:9, background: color+"1a", border:"1px solid "+color+"44", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {icon}
        </div>
      </div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:C.text, margin:"0 0 4px" }}>{value}</p>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.dim, margin:0 }}>{label}</p>
    </div>
  );
}

function OrderCard({ order, userName }) {
  const [hov, setHov] = useState(false);
  const isPending = !order.paymentStatus || order.paymentStatus === "pending";
  const date = order.submittedAt ? new Date(order.submittedAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "—";

  return (
    <div style={{ padding:"22px 24px", borderRadius:16, border:"1px solid "+(hov?"rgba(0,184,150,.22)":C.border), background:C.surface, transition:"border-color .25s" }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10, marginBottom:16 }}>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.dim, letterSpacing:".09em", marginBottom:4 }}>ORDER REFERENCE</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:800, color:C.text, letterSpacing:".04em" }}>{order.orderRef}</p>
        </div>
        <StatusBadge status={order.paymentStatus||"pending"} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12, marginBottom: isPending?16:0 }}>
        {[["Brand",order.brandName||"—"],["Submitted",date],["Amount",PRICE.display]].map(([k,v])=>(
          <div key={k}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, color:C.dim, letterSpacing:".07em", marginBottom:3 }}>{k.toUpperCase()}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted }}>{v}</p>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop: isPending?0:12 }}>
        {isPending && (
          <button onClick={()=>retryPayment({ orderRef:order.orderRef, email:order.email, name:userName })}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"10px 18px", borderRadius:9, border:"none", background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 0 18px rgba(0,184,150,.2)" }}>
            <Icons.Zap size={13} color="#fff" /> Complete Payment →
          </button>
        )}
        {order.paymentStatus === "successful" && (
          <Link href={"/analytics?ref="+order.orderRef}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 16px", borderRadius:9, border:"1px solid rgba(0,184,150,.3)", color:C.teal, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, textDecoration:"none" }}>
            <Icons.BarChart size={13} color={C.teal} /> Track Performance
          </Link>
        )}
        {order.paymentStatus === "successful" && (
          <Link href={"/confirm?ref="+order.orderRef}
            style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 16px", borderRadius:9, border:"1px solid "+C.border, color:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, textDecoration:"none" }}>
            <Icons.Download size={13} color={C.muted} /> Receipt
          </Link>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoggedIn, authLoading, openAuth } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!authLoading && !isLoggedIn) openAuth("login", ()=>{});
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("af_token") : null;
    if (!token) return;
    fetch("/api/orders", { headers: { Authorization:"Bearer "+token } })
      .then(r=>r.json())
      .then(data=>{ if(data.success) setOrders(data.orders||[]); else setError(data.error||"Failed to load."); })
      .catch(()=>setError("Network error. Please refresh."))
      .finally(()=>setLoading(false));
  }, [isLoggedIn]);

  const spinner = (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid "+C.border, borderTop:"3px solid "+C.teal, borderRadius:"50%", animation:"spin .9s linear infinite" }} />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );

  if (authLoading || (loading && isLoggedIn)) return spinner;

  if (!isLoggedIn) return (
    <>
      <Head><title>Dashboard — AdForge Intelligence</title></Head>
      <Navbar />
      <div style={{ background:C.bg, minHeight:"calc(100vh - 68px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center" }}>
        <div>
          <div style={{ fontSize:44, marginBottom:18 }}>🔒</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:C.text, marginBottom:14 }}>Sign in to access your dashboard</h1>
          <button onClick={()=>openAuth("login")} style={{ padding:"13px 28px", borderRadius:11, border:"none", background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, cursor:"pointer" }}>Sign In →</button>
        </div>
      </div>
      <Footer />
    </>
  );

  const firstName    = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const paidOrders   = orders.filter(o=>o.paymentStatus==="successful");
  const pendingOrders= orders.filter(o=>!o.paymentStatus||o.paymentStatus==="pending");

  return (
    <>
      <Head><title>My Dashboard — AdForge Intelligence</title><meta name="robots" content="noindex" /></Head>
      <Navbar />
      <main style={{ background:C.bg, minHeight:"calc(100vh - 68px)", padding:"48px 20px 88px", animation:"fadeUp .4s ease both" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom:36 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".12em", color:C.teal, marginBottom:10 }}>CLIENT DASHBOARD</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,4vw,38px)", fontWeight:800, color:C.text, letterSpacing:"-.025em", marginBottom:8 }}>
              Welcome back, {firstName}.
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:C.muted }}>Track your reports, log performance results, and commission new intelligence briefs.</p>
          </div>

          {/* Stats */}
          {orders.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:32 }}>
              <StatCard icon={<Icons.FileText size={18} color={C.teal}/>}   value={orders.length}         label="Total Orders"    color={C.teal} />
              <StatCard icon={<Icons.CheckCircle size={18} color="#00B896"/>} value={paidOrders.length}   label="Reports Paid"    color="#00B896" />
              <StatCard icon={<Icons.Clock size={18} color={C.gold}/>}       value={pendingOrders.length} label="Pending Payment" color={C.gold} />
              <StatCard icon={<Icons.BarChart size={18} color="#8B5CF6}"/>}   value={"→"}                 label="Track Performance" color="#8B5CF6" />
            </div>
          )}

          {error && (
            <div style={{ padding:"14px 18px", borderRadius:10, border:"1px solid rgba(255,107,107,.3)", background:"rgba(255,107,107,.06)", marginBottom:24 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.error, margin:0 }}>{error}</p>
            </div>
          )}

          {/* Pending payment notice */}
          {pendingOrders.length > 0 && (
            <div style={{ padding:"16px 20px", borderRadius:12, border:"1px solid rgba(245,158,11,.25)", background:"rgba(245,158,11,.06)", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
              <Icons.Zap size={18} color="#F59E0B" />
              <div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:"#F59E0B", margin:"0 0 2px" }}>
                  {pendingOrders.length} order{pendingOrders.length>1?"s":""} awaiting payment
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.dim, margin:0 }}>
                  Click "Complete Payment" on the order below to finish checkout.
                </p>
              </div>
            </div>
          )}

          {/* Orders */}
          {orders.length > 0 ? (
            <div style={{ display:"grid", gap:14, marginBottom:28 }}>
              {orders.map(order=>(
                <OrderCard key={order.orderRef} order={order} userName={user?.name||""} />
              ))}
            </div>
          ) : (
            <div style={{ padding:"48px 32px", borderRadius:18, border:"1px solid "+C.border, background:C.surface, textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:44, marginBottom:16 }}>📋</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.text, marginBottom:12 }}>No orders yet.</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:28, lineHeight:1.7, maxWidth:360, margin:"0 auto 28px" }}>
                Commission your first intelligence report — delivered in 12 hours.
              </p>
              <Link href="/intake" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 26px", borderRadius:10, background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, boxShadow:"0 0 22px rgba(0,184,150,.22)", textDecoration:"none" }}>
                Commission My First Report — {PRICE.display} →
              </Link>
            </div>
          )}

          {/* Commission another */}
          {paidOrders.length > 0 && (
            <div style={{ padding:"22px 24px", borderRadius:14, border:"1px solid rgba(0,184,150,.2)", background:"rgba(0,184,150,.04)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, marginBottom:24 }}>
              <div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>Need a fresh intelligence brief?</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>Markets shift. Competitors evolve. Stay ahead.</p>
              </div>
              <Link href="/intake" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px", borderRadius:9, background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, boxShadow:"0 0 18px rgba(0,184,150,.2)", whiteSpace:"nowrap", textDecoration:"none" }}>
                New Report →
              </Link>
            </div>
          )}

          {/* Performance tracker CTA */}
          {paidOrders.length > 0 && (
            <div style={{ padding:"22px 24px", borderRadius:14, border:"1px solid rgba(139,92,246,.2)", background:"rgba(139,92,246,.04)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, marginBottom:24 }}>
              <div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>📊 Track your report performance</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>Log ROAS, CTR, and revenue results. See your before/after improvement.</p>
              </div>
              <Link href="/analytics" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px", borderRadius:9, background:"linear-gradient(135deg,#8B5CF6,#6D28D9)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, whiteSpace:"nowrap", textDecoration:"none" }}>
                Open Tracker →
              </Link>
            </div>
          )}

          {/* Support */}
          <div style={{ padding:"18px 22px", borderRadius:12, border:"1px solid "+C.border, background:"rgba(255,255,255,.01)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.dim }}>Questions or report issues?</p>
            <a href={"mailto:"+BRAND.email} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.teal, textDecoration:"none" }}>{BRAND.email} →</a>
          </div>

        </div>
      </main>
      <Footer />
      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}"}</style>
    </>
  );
}
