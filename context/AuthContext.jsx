// context/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user,          setUser]          = useState(null);   // { email, name, brandName, orderRef }
  const [authLoading,   setAuthLoading]   = useState(true);   // checking token on mount
  const [modalOpen,     setModalOpen]     = useState(false);
  const [modalTab,      setModalTab]      = useState("signup"); // "signup" | "login"
  const [pendingAction, setPendingAction] = useState(null);   // function to run after auth

  // ── Hydrate user from token on mount ─────────────────────────
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("af_token") : null;

    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token invalid — clear it
          localStorage.removeItem("af_token");
        }
      })
      .catch(() => {
        localStorage.removeItem("af_token");
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  // ── Open auth modal ──────────────────────────────────────────
  const openAuth = useCallback((tab = "signup", onSuccess = null) => {
    setModalTab(tab);
    if (onSuccess) setPendingAction(() => onSuccess);
    setModalOpen(true);
  }, []);

  // ── Close auth modal ─────────────────────────────────────────
  const closeAuth = useCallback(() => {
    setModalOpen(false);
    setPendingAction(null);
  }, []);

  // ── Called by AuthModal on successful register/login ─────────
  const onAuthSuccess = useCallback((userData, token) => {
    // Store token
    if (typeof window !== "undefined") {
      localStorage.setItem("af_token", token);
    }

    setUser(userData);
    setModalOpen(false);

    // Execute pending action if any
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      action(userData);
    }
  }, [pendingAction]);

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }

    if (typeof window !== "undefined") {
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_orderRef");
      localStorage.removeItem("af_email");
    }

    setUser(null);
    router.push("/");
  }, [router]);

  const value = {
    user,
    authLoading,
    isLoggedIn:    !!user,
    modalOpen,
    modalTab,
    openAuth,
    closeAuth,
    onAuthSuccess,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
