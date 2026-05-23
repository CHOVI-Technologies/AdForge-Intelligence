// pages/analytics.jsx — Premium Performance Tracker
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Icons } from "../components/ui/Icons";
import { useAuth } from "../context/AuthContext";
import { C, BRAND } from "../lib/constants";

// ── Score calculator ──────────────────────────────────────────────
function calcScore(e) {
  if (!e) return 0;
  let s = 0;
  const rg = e.roasBefore && e.roasAfter ? parseFloat(e.roasAfter) / parseFloat(e.roasBefore) : 1;
  const cg = e.ctrBefore  && e.ctrAfter  ? parseFloat(e.ctrAfter)  / parseFloat(e.ctrBefore)  : 1;
  if (rg >= 2) s += 40; else if (rg >= 1.5) s += 28; else if (rg >= 1.2) s += 16; else if (rg >= 1) s += 8;
  if (cg >= 2) s += 30; else if (cg >= 1.5) s += 20; else if (cg >= 1.2) s += 12; else if (cg >= 1) s += 5;
  const t = parseInt(e.directionsTested) || 0;
  if (t >= 4) s += 20; else if (t >= 2) s += 12; else if (t >= 1) s += 6;
  const rev = parseFloat(e.revenueImpact) || 0;
  if (rev >= 5000) s += 10; else if (rev >= 1000) s += 6; else if (rev > 0) s += 3;
  return Math.min(s, 100);
}

// ── Score ring ────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r    = 42;
  const circ = 2 * Math.PI * r;
  const off  = circ - (score / 100) * circ;
  const col  = score >= 70 ? "#00B896" : score >= 40 ? "#C9A84C" : "#EF4444";
  const lbl  = score >= 70 ? "Strong" : score >= 40 ? "Moderate" : "Early Stage";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 10px" }}>
        <svg viewBox="0 0 100 100" style={{ width: 110, height: 110, transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease .3s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: C.text }}>{score}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: C.dim, letterSpacing: ".05em" }}>/ 100</span>
        </div>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: col, marginBottom: 2 }}>{lbl}</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim }}>Performance Score</p>
    </div>
  );
}

// ── Bar comparison ────────────────────────────────────────────────
function Bar({ label, before, after, unit, color }) {
  const max  = Math.max(parseFloat(before) || 0, parseFloat(after) || 0, 0.01);
  const bPct = Math.min(((parseFloat(before) || 0) / max) * 100, 100);
  const aPct = Math.min(((parseFloat(after)  || 0) / max) * 100, 100);
  const chg  = before && after ? (((parseFloat(after) - parseFloat(before)) / parseFloat(before)) * 100).toFixed(1) : null;
  const up   = chg !== null && parseFloat(chg) >= 0;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.muted }}>{label}</span>
        {chg !== null && (
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: up ? "#00B896" : "#EF4444", background: up ? "rgba(0,184,150,.1)" : "rgba(239,68,68,.1)", padding: "3px 9px", borderRadius: 100 }}>
            {up ? "▲" : "▼"} {Math.abs(chg)}%
          </span>
        )}
      </div>
      {[["Before", bPct, parseFloat(before)||0,"rgba(255,255,255,.14)"],["After",aPct,parseFloat(after)||0,color]].map(([l,p,v,c])=>(
        <div key={l} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.dim, width:38, flexShrink:0 }}>{l}</span>
          <div style={{ flex:1, height:10, borderRadius:5, background:"rgba(255,255,255,.05)", overflow:"hidden" }}>
            <div style={{ width:p+"%", height:"100%", borderRadius:5, background:c, transition:"width 1s ease .2s" }} />
          </div>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:C.text, width:44, textAlign:"right", flexShrink:0 }}>{v}{unit}</span>
        </div>
      ))}
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────
function FInput({ label, name, value, onChange, placeholder, type="text", hint }) {
  const [foc, setFoc] = useState(false);
  return (
    <div>
      <label style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:C.muted, marginBottom:7 }}>{label}</label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type}
        onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
        style={{ width:"100%", padding:"12px 15px", borderRadius:9, border:"1.5px solid "+(foc?"rgba(0,184,150,.5)":C.border), background:foc?"rgba(0,184,150,.04)":"rgba(255,255,255,.03)", color:C.text, fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", transition:"all .2s", boxSizing:"border-box" }} />
      {hint && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.dim, marginTop:5 }}>{hint}</p>}
    </div>
  );
}

// ── Star rating ───────────────────────────────────────────────────
function Stars({ value, onChange }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(n=>(
        <button key={n} type="button" onClick={()=>onChange(n)}
          style={{ background:"none", border:"none", cursor:"pointer", padding:2, fontSize:26, color: n<=value ? C.gold : C.dim, transition:"color .15s", lineHeight:1 }}>★</button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
const BLANK = { directionsTested:"", roasBefore:"", roasAfter:"", ctrBefore:"", ctrAfter:"", monthlySpend:"", revenueImpact:"", rating:0, notes:"" };

export default function AnalyticsPage() {
  const router  = useRouter();
  const { user, isLoggedIn, authLoading, openAuth } = useAuth();
  const [orders,    setOrders]    = useState([]);
  const [entries,   setEntries]   = useState([]);
  const [pageLoad,  setPageLoad]  = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");
  const [form,      setForm]      = useState(BLANK);
  const [activeRef, setActiveRef] = useState("");
  const [showForm,  setShowForm]  = useState(false);

  useEffect(() => { if (!authLoading && !isLoggedIn) openAuth("login", ()=>{}); }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (router.isReady && router.query.ref) { setActiveRef(router.query.ref); setShowForm(true); }
  }, [router.isReady, router.query.ref]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const tok = typeof window !== "undefined" ? localStorage.getItem("af_token") : null;
    if (!tok) return;
    Promise.all([
      fetch("/api/orders",         { headers:{ Authorization:"Bearer "+tok }}).then(r=>r.json()),
      fetch("/api/analytics/get",  { headers:{ Authorization:"Bearer "+tok }}).then(r=>r.json()),
    ]).then(([od, ad]) => {
      if (od.success) setOrders(od.orders||[]);
      if (ad.success) setEntries(ad.entries||[]);
    }).catch(()=>setError("Failed to load data."))
      .finally(()=>setPageLoad(false));
  }, [isLoggedIn]);

  const h = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const save = async () => {
    if (!activeRef) return;
    setSaving(true); setError("");
    try {
      const tok   = typeof window !== "undefined" ? localStorage.getItem("af_token") : null;
      const order = orders.find(o=>o.orderRef===activeRef);
      const res   = await fetch("/api/analytics/save", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:"Bearer "+tok },
        body: JSON.stringify({ ...form, orderRef:activeRef, email:user?.email, brandName:order?.brandName }),
      });
      const data  = await res.json();
      if (!res.ok || !data.success) { setError(data.error||"Save failed."); return; }
      setEntries(p=>[...p, { ...form, id:data.id, orderRef:activeRef, email:user?.email, loggedAt:new Date().toISOString() }]);
      setSaved(true); setShowForm(false); setForm(BLANK);
      setTimeout(()=>setSaved(false), 4000);
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const paidOrders = orders.filter(o=>o.paymentStatus==="successful");

  if (authLoading || pageLoad) return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid "+C.border, borderTop:"3px solid "+C.teal, borderRadius:"50%", animation:"spin .9s linear infinite" }} />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );

  if (!isLoggedIn) return (
    <><Head><title>Analytics — AdForge Intelligence</title></Head><Navbar />
    <div style={{ background:C.bg, minHeight:"calc(100vh - 68px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center" }}>
      <div>
        <div style={{ fontSize:44, marginBottom:18 }}>🔒</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:C.text, marginBottom:14 }}>Sign in to access analytics</h1>
        <button onClick={()=>openAuth("login")} style={{ padding:"13px 28px", borderRadius:11, border:"none", background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, cursor:"pointer" }}>Sign In →</button>
      </div>
    </div><Footer /></>
  );

  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <>
      <Head><title>Performance Tracker — AdForge Intelligence</title><meta name="robots" content="noindex" /></Head>
      <Navbar />
      <main style={{ background:C.bg, minHeight:"calc(100vh - 68px)", padding:"48px 20px 88px", animation:"fadeUp .4s ease both" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom:36 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".12em", color:"#8B5CF6", marginBottom:10 }}>PERFORMANCE TRACKER</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,4vw,38px)", fontWeight:800, color:C.text, letterSpacing:"-.025em", marginBottom:10 }}>
              Measure Your Report Impact.
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:C.muted, lineHeight:1.75, maxWidth:580 }}>
              Log your ad performance before and after implementing the intelligence brief. Track ROAS, CTR, and revenue improvements with a performance score.
            </p>
          </div>

          {/* Saved notice */}
          {saved && (
            <div style={{ padding:"14px 20px", borderRadius:10, border:"1px solid rgba(0,184,150,.3)", background:"rgba(0,184,150,.08)", marginBottom:24, display:"flex", alignItems:"center", gap:10 }}>
              <Icons.Check size={16} color={C.teal} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.teal, fontWeight:600 }}>Performance data saved!</span>
            </div>
          )}

          {error && (
            <div style={{ padding:"14px 18px", borderRadius:10, border:"1px solid rgba(255,107,107,.3)", background:"rgba(255,107,107,.06)", marginBottom:24 }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.error, margin:0 }}>{error}</p>
            </div>
          )}

          {paidOrders.length === 0 ? (
            <div style={{ padding:"48px 32px", borderRadius:18, border:"1px solid "+C.border, background:C.surface, textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:16 }}>📊</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.text, marginBottom:12 }}>No completed reports yet.</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:28, lineHeight:1.7, maxWidth:360, margin:"0 auto 28px" }}>
                Commission and pay for a report first. Once delivered, come back here to log your results.
              </p>
              <Link href="/intake" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 26px", borderRadius:10, background:C.grad, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, textDecoration:"none" }}>
                Commission Report →
              </Link>
            </div>
          ) : (
            <>
              {/* Order selector */}
              <div style={{ marginBottom:24 }}>
                <label style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:C.muted, marginBottom:10 }}>Select Report to Track</label>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {paidOrders.map(o=>(
                    <button key={o.orderRef} onClick={()=>{ setActiveRef(o.orderRef); setShowForm(true); setSaved(false); setForm(BLANK); }}
                      style={{ padding:"10px 18px", borderRadius:10, border:"1.5px solid "+(activeRef===o.orderRef?C.teal:C.border), background:activeRef===o.orderRef?"rgba(0,184,150,.1)":"rgba(255,255,255,.02)", color:activeRef===o.orderRef?C.teal:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>
                      {o.orderRef} — {o.brandName||"Brand"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Log form */}
              {showForm && activeRef && (
                <div style={{ padding:"32px 28px", borderRadius:20, border:"1px solid rgba(139,92,246,.25)", background:"rgba(139,92,246,.04)", marginBottom:32 }}>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:C.text, marginBottom:6 }}>Log Performance Results</h2>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:28, lineHeight:1.7 }}>
                    Enter metrics before and after testing the report's creative directions. All fields optional — fill in what you have.
                  </p>
                  <div style={{ display:"grid", gap:20 }}>
                    <FInput label="Creative Directions Tested" name="directionsTested" value={form.directionsTested} onChange={h} placeholder="e.g. 3" type="number" hint="How many of the 5 report directions did you run as ads?" />

                    <div>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:C.text, marginBottom:12 }}>Return on Ad Spend (ROAS)</p>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14 }}>
                        <FInput label="ROAS Before" name="roasBefore" value={form.roasBefore} onChange={h} placeholder="e.g. 1.8" type="number" />
                        <FInput label="ROAS After"  name="roasAfter"  value={form.roasAfter}  onChange={h} placeholder="e.g. 3.2" type="number" />
                      </div>
                    </div>

                    <div>
                      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, color:C.text, marginBottom:12 }}>Click-Through Rate — CTR (%)</p>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14 }}>
                        <FInput label="CTR Before (%)" name="ctrBefore" value={form.ctrBefore} onChange={h} placeholder="e.g. 1.2" type="number" />
                        <FInput label="CTR After (%)"  name="ctrAfter"  value={form.ctrAfter}  onChange={h} placeholder="e.g. 2.8" type="number" />
                      </div>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14 }}>
                      <FInput label="Monthly Ad Spend ($)"     name="monthlySpend"   value={form.monthlySpend}   onChange={h} placeholder="e.g. 3500"  type="number" />
                      <FInput label="Est. Revenue Impact ($)"  name="revenueImpact"  value={form.revenueImpact}  onChange={h} placeholder="e.g. 12000" type="number" hint="Additional revenue attributed to the report" />
                    </div>

                    <div>
                      <label style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:C.muted, marginBottom:10 }}>Rate This Report</label>
                      <Stars value={form.rating} onChange={v=>setForm(p=>({...p,rating:v}))} />
                    </div>

                    <div>
                      <label style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:C.muted, marginBottom:7 }}>Notes (Optional)</label>
                      <textarea name="notes" value={form.notes} onChange={h} rows={3}
                        placeholder="What worked best, observations, what you'd like in the next brief..."
                        onFocus={e=>e.target.style.borderColor="rgba(0,184,150,.5)"}
                        onBlur={e=>e.target.style.borderColor=C.border}
                        style={{ width:"100%", padding:"12px 15px", borderRadius:9, border:"1.5px solid "+C.border, background:"rgba(255,255,255,.03)", color:C.text, fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", resize:"vertical", boxSizing:"border-box" }} />
                    </div>

                    <button onClick={save} disabled={saving}
                      style={{ padding:"14px", borderRadius:11, border:"none", background:saving?C.elevated:"linear-gradient(135deg,#8B5CF6,#6D28D9)", color:saving?C.muted:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, cursor:saving?"not-allowed":"pointer", boxShadow:saving?"none":"0 0 28px rgba(139,92,246,.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      {saving
                        ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.25)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} />Saving…</>
                        : "Save Performance Data →"
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {entries.length > 0 && (
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.text, marginBottom:20 }}>Your Performance Results</h2>
                  <div style={{ display:"grid", gap:20 }}>
                    {entries.map((entry, idx) => {
                      const score = calcScore(entry);
                      return (
                        <div key={entry.id||idx} style={{ padding:"28px", borderRadius:18, border:"1px solid "+C.border, background:C.surface }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:24, paddingBottom:20, borderBottom:"1px solid "+C.border }}>
                            <div>
                              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.dim, letterSpacing:".08em", marginBottom:4 }}>REPORT REFERENCE</p>
                              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:800, color:C.text }}>{entry.orderRef}</p>
                              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.dim, marginTop:3 }}>
                                Logged {entry.loggedAt ? new Date(entry.loggedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—"}
                              </p>
                            </div>
                            <ScoreRing score={score} />
                          </div>

                          {(entry.roasBefore||entry.roasAfter) && <Bar label="ROAS" before={entry.roasBefore} after={entry.roasAfter} unit="x" color={C.teal} />}
                          {(entry.ctrBefore||entry.ctrAfter)   && <Bar label="CTR (%)" before={entry.ctrBefore} after={entry.ctrAfter} unit="%" color="#8B5CF6" />}

                          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12, marginTop:20, paddingTop:20, borderTop:"1px solid "+C.border }}>
                            {[
                              ["Directions Tested", entry.directionsTested||"—"],
                              ["Monthly Spend",     entry.monthlySpend ? "$"+Number(entry.monthlySpend).toLocaleString() : "—"],
                              ["Revenue Impact",    entry.revenueImpact ? "$"+Number(entry.revenueImpact).toLocaleString() : "—"],
                              ["Rating",            entry.rating ? "★".repeat(parseInt(entry.rating)||0) : "—"],
                            ].map(([lbl,val])=>(
                              <div key={lbl} style={{ padding:"14px", borderRadius:10, border:"1px solid "+C.border, background:"rgba(255,255,255,.02)" }}>
                                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, color:C.dim, letterSpacing:".07em", marginBottom:6 }}>{lbl.toUpperCase()}</p>
                                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:C.text }}>{val}</p>
                              </div>
                            ))}
                          </div>

                          {entry.notes && (
                            <div style={{ marginTop:16, padding:"14px 16px", borderRadius:9, border:"1px solid "+C.border, background:"rgba(255,255,255,.015)" }}>
                              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, color:C.dim, letterSpacing:".07em", marginBottom:6 }}>NOTES</p>
                              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, lineHeight:1.75 }}>{entry.notes}</p>
                            </div>
                          )}

                          {entry.revenueImpact && entry.monthlySpend && (
                            <div style={{ marginTop:16, padding:"14px 20px", borderRadius:10, border:"1px solid rgba(201,168,76,.2)", background:"rgba(201,168,76,.05)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                              <div>
                                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.dim, marginBottom:2 }}>ESTIMATED ROI ON REPORT FEE</p>
                                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:C.gold }}>
                                  {((parseFloat(entry.revenueImpact)/397)*100).toFixed(0)}%
                                </p>
                              </div>
                              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.dim, maxWidth:200, lineHeight:1.6 }}>
                                ${Number(entry.revenueImpact).toLocaleString()} revenue vs $397 report fee.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ textAlign:"center", marginTop:36 }}>
            <Link href="/dashboard" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.dim, textDecoration:"none" }}>← Back to Dashboard</Link>
          </div>
        </div>
      </main>
      <Footer />
      <style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </>
  );
}
