// pages/_app.jsx
import Script from "next/script";
import { AuthProvider } from "../context/AuthContext";
import AuthModal from "../components/ui/AuthModal";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Flutterwave Inline v3 — loaded once, available globally as window.FlutterwaveCheckout */}
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        strategy="lazyOnload"
      />

      <AuthModal />

      <Component {...pageProps} />

      <style global jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #06081A;
          color: #F0F2FF;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }
        h1,h2,h3,h4,h5,h6 {
          font-family: 'Playfair Display', Georgia, serif;
        }
        a { color: inherit; text-decoration: none; }
        button { font-family: 'DM Sans', sans-serif; }
        input, textarea, select { font-family: 'DM Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: rgba(240,242,255,0.28); }
        select option { background: #0C0F24; color: #F0F2FF; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06081A; }
        ::-webkit-scrollbar-thumb { background: rgba(0,184,150,0.3); border-radius: 2px; }
        ::selection { background: rgba(0,184,150,0.22); color: #F0F2FF; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.4)} }
        @keyframes checkDraw { from{stroke-dashoffset:55} to{stroke-dashoffset:0} }
      `}</style>
    </AuthProvider>
  );
}
