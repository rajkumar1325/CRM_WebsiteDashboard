/**
 * LandingPage.jsx — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * Thin orchestrator: owns shared state and wires sub-components.
 * No JSX markup lives here — all sections are imported components.
 *
 * State managed here (shared across multiple children):
 *   • scroll / navScrolled    → Navbar + parallax blobs
 *   • authMode                → Navbar, HeroSection (AuthCard)
 *   • authCardRef             → HeroSection → scroll-into-view
 *   • authHighlight / shake   → AuthCard ring + shake animation
 *   • auth form fields        → AuthCard (controlled inputs)
 *   • isSubmitting / toast    → AuthCard submit button + Toast
 *
 * Auth endpoints (all calls live in /services/authService.js):
 *   Signup → POST /api/v1/auth/register/1   (Admin only — public)
 *   Login  → POST /api/v1/auth/login        (All roles — public)
 *
 * Post-auth TODO (Redux integration):
 *   dispatch(setCredentials({ token: data.token, user: data.userProfile }))
 *   navigate("/dashboard")
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState, useRef, useCallback } from "react";

// ── Services ──────────────────────────────────────────────────────
import { loginUser, registerAdminUser } from "../services/authService";

// ── Utilities ─────────────────────────────────────────────────────
import { validateForm } from "../utils/authValidation";

// ── UI components ─────────────────────────────────────────────────
import Toast from "../components/ui/Toast";

// ── Landing sections ──────────────────────────────────────────────
import Navbar               from "../components/landing/Navbar";
import HeroSection          from "../components/landing/HeroSection";
import FeaturesSection      from "../components/landing/FeaturesSection";
import PricingSection       from "../components/landing/PricingSection";
import TestimonialsSection  from "../components/landing/TestimonialsSection";
import FaqSection           from "../components/landing/FaqSection";
import CtaBanner            from "../components/landing/CtaBanner";
import Footer               from "../components/landing/Footer";

// ── Floating background particle ──────────────────────────────────
function FloatingDot({ className, style }) {
  return <span className={`absolute rounded-full pointer-events-none ${className}`} style={style} />;
}

// ─────────────────────────────────────────────────────────────────
export default function LandingPage() {

  // ── Scroll ────────────────────────────────────────────────────
  const [scrollY,     setScrollY]     = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  // ── Auth form ─────────────────────────────────────────────────
  const [authMode,      setAuthMode]      = useState("signup");
  const [authHighlight, setAuthHighlight] = useState(false);
  const [shake,         setShake]         = useState(false);
  const authCardRef = useRef(null);

  const [companyName,      setCompanyName]      = useState("");
  const [email,            setEmail]            = useState("");
  const [password,         setPassword]         = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [fieldErrors,      setFieldErrors]      = useState({});
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [toast,            setToast]            = useState(null);

  // ── Scroll listener (passive, RAF-throttled) ──────────────────
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        setScrollY(y);
        setNavScrolled(y > 40);
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Reset form when toggling login ↔ signup ───────────────────
  useEffect(() => {
    setCompanyName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFieldErrors({});
  }, [authMode]);

  // ── Scroll auth card into view + highlight ring ───────────────
  const focusAuthCard = useCallback((mode) => {
    if (mode) setAuthMode(mode);
    authCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setAuthHighlight(true);
    setTimeout(() => setAuthHighlight(false), 700);
  }, []);

  // ── Shake animation helper ────────────────────────────────────
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  // ─────────────────────────────────────────────────────────────
  /**
   * handleSubmit
   *
   * SIGNUP:
   *   1. Validate companyName, email, password, confirmPassword
   *   2. Call registerAdminUser()
   *      → POST /api/v1/auth/register/1  (roleId=1, Admin only)
   *   3. TODO: dispatch(setCredentials(...)) + navigate("/dashboard")
   *
   *   After login the Admin creates Leader (roleId=2) and Member (roleId=3)
   *   accounts from the dashboard:
   *      → POST /api/v1/users/role/{roleId}  (Admin only, JWT required)
   *
   * LOGIN:
   *   1. Validate email + password
   *   2. Call loginUser()
   *      → POST /api/v1/auth/login  (all roles — Admin / Leader / Member)
   *   3. TODO: dispatch(setCredentials(...)) + navigate("/dashboard")
   *
   * Both functions throw on non-OK HTTP; catch shows the error via toast.
   */
  const handleSubmit = async () => {
    const errors = validateForm(
      { companyName, email, password, confirmPassword },
      authMode,
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      let data;

      if (authMode === "login") {
        // POST /api/v1/auth/login
        data = await loginUser({ email, password });
        showToast("Welcome back! Redirecting…", "success");
      } else {
        // POST /api/v1/auth/register/1  (Admin — the only public role)
        data = await registerAdminUser({ companyName, email, password });
        showToast("Workspace created! Redirecting…", "success");
      }

      /**
       * TODO (Redux + React Router):
       *   dispatch(setCredentials({ token: data.token, user: data.userProfile }));
       *   navigate("/dashboard");
       */
      console.log("[CURIEM] Auth success →", data);

    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Parallax offsets ──────────────────────────────────────────
  const layer1 = scrollY * 0.10;
  const layer2 = scrollY * 0.20;
  const layer3 = scrollY * 0.05;

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050816] text-gray-100 relative overflow-x-hidden">

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* Glow beam */}
      <div className="glow-stream" />

      {/* Parallax blobs */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-72 w-72 rounded-full
        bg-purple-600/30 blur-3xl"
        style={{ transform: `translateY(${layer1}px)` }} />
      <div className="pointer-events-none fixed bottom-10 -right-40 h-80 w-80 rounded-full
        bg-cyan-500/20 blur-3xl"
        style={{ transform: `translateY(${layer2}px)` }} />
      <div className="pointer-events-none fixed top-1/2 left-1/2 h-96 w-96 rounded-full
        bg-indigo-600/10 blur-3xl"
        style={{ transform: `translate(-50%, calc(-50% + ${layer3}px))` }} />

      {/* Floating particles */}
      <FloatingDot className="top-24 left-10 h-2 w-2 bg-cyan-400/60"
        style={{ animation: "float-slow 10s ease-in-out infinite" }} />
      <FloatingDot className="top-1/3 right-16 h-1.5 w-1.5 bg-purple-400/70"
        style={{ animation: "float-slower 12s ease-in-out infinite" }} />
      <FloatingDot className="bottom-20 left-1/2 h-2 w-2 bg-emerald-400/60"
        style={{ animation: "float-slow 14s ease-in-out infinite" }} />






      {/* ── Page content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">

        <Navbar
          navScrolled={navScrolled}
          authMode={authMode}
          onFocusAuth={focusAuthCard}
        />

        <HeroSection
          onFocusAuth={focusAuthCard}
          authCardRef={authCardRef}
          authHighlight={authHighlight}
          shake={shake}
          authMode={authMode}        setAuthMode={setAuthMode}
          onSubmit={handleSubmit}    isSubmitting={isSubmitting}
          showToast={showToast}
          companyName={companyName}  setCompanyName={setCompanyName}
          email={email}              setEmail={setEmail}
          password={password}        setPassword={setPassword}
          confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
          fieldErrors={fieldErrors}  setFieldErrors={setFieldErrors}
        />

        <FeaturesSection />

        <PricingSection onFocusAuth={focusAuthCard} />

        <TestimonialsSection />

        <FaqSection />

        <CtaBanner onFocusAuth={focusAuthCard} />

        <Footer />
      </div>
    </div>
  );
}
