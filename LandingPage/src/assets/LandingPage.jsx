// ─── LandingPage.jsx (main orchestrator) ─────────────────────────────────────
// This file is intentionally thin.
// All sections live in ./sections/, shared widgets in ./shared/, data in ./data.js.
//
// File map:
//   LandingPage.jsx            ← you are here (global state + layout)
//   data.js                    ← all static content (edit copy here)
//   landingStyles.js           ← all CSS/keyframes (edit styles here)
//   shared/
//     Icons.jsx                ← SVG icon map
//     MiniCalendar.jsx         ← decorative calendar widget
//     RoleDashboardPreview.jsx ← interactive dashboard preview
//     WorkflowStep.jsx         ← single step node in workflow chain
//   sections/
//     Navbar.jsx
//     HeroSection.jsx          ← auth card lives here
//     WorkflowSection.jsx
//     FeaturesSection.jsx
//     PricingSection.jsx
//     TestimonialsSection.jsx
//     FAQSection.jsx
//     CTASection.jsx
//     FooterSection.jsx






// ─── LandingPage.jsx (main orchestrator) ─────────────────────────────────────
import { useEffect, useState, useRef } from "react";

import { LANDING_CSS }        from "./landingStyles";
import Navbar                 from "./sections/Navbar";
import HeroSection            from "./sections/HeroSection";
import WorkflowSection        from "./sections/WorkflowSection";
import FeaturesSection        from "./sections/FeaturesSection";
import PricingSection         from "./sections/PricingSection";
import TestimonialsSection    from "./sections/TestimonialsSection";
import FAQSection             from "./sections/FAQSection";
import CTASection             from "./sections/CTASection";
import FooterSection          from "./sections/FooterSection";

export default function LandingPage() {

  // ── Auth card state ────────────────────────────────────────────────────────
  const [authMode, setAuthMode]           = useState("signup");
  const [authHighlight, setAuthHighlight] = useState(false);
  const authCardRef                       = useRef(null);
  const [selectedRole, setSelectedRole]   = useState(null);

  // ── Unified form state ─────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [shake, setShake]   = useState(false);
  const [showPw, setShowPw] = useState(false);

  const passwordMatch =
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const focusAuthCard = () => {
    authCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setAuthHighlight(true);
    setTimeout(() => setAuthHighlight(false), 800);
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleAuthSubmit = async ({ role, endpoint, ...data }) => {
    const isApiRoute = endpoint.startsWith("/api/");

    const body = isApiRoute
      ? JSON.stringify({ ...data, role })
      : new URLSearchParams({ ...data, role }).toString();

    const headers = {
      "Content-Type": isApiRoute
        ? "application/json"
        : "application/x-www-form-urlencoded",
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
        credentials: "include", // needed for session cookies
      });

      if (res.redirected) {
        window.location.href = res.url; // follow Spring MVC redirect
        return;
      }

      const json = await res.json();
      console.log("Auth response:", json);
      // TODO: store JWT token if using /api/auth/* routes
      // localStorage.setItem("token", json.token);
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  // ── Parallax scroll ────────────────────────────────────────────────────────
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || window.pageYOffset);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const layer1 = scrollY * 0.08;
  const layer2 = scrollY * 0.15;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-gray-100 relative overflow-x-hidden"
      style={{ background: "#060918", fontFamily: "'DM Sans', -apple-system, sans-serif" }}
    >
      <style>{LANDING_CSS}</style>

      <div className="lp-glow-orb-1" style={{ transform: `translateY(${layer1}px)` }} />
      <div className="lp-glow-orb-2" style={{ transform: `translateY(${layer2}px)` }} />

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-1.5 h-1.5 rounded-full bg-cyan-400/50 anim-float-a" />
        <div className="absolute top-1/2 right-24 w-1 h-1 rounded-full bg-purple-400/60 anim-float-b" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-32 left-1/3 w-2 h-2 rounded-full bg-emerald-400/40 anim-float-a" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/4 right-1/3 w-1 h-1 rounded-full bg-amber-400/50 anim-float-b" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Navbar
          onLogin={() => { setAuthMode("login"); focusAuthCard(); }}
          onStartFree={() => { setAuthMode("signup"); focusAuthCard(); }}
        />

        <HeroSection
          authCardRef={authCardRef}
          authHighlight={authHighlight}
          authMode={authMode}
          setAuthMode={setAuthMode}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          formData={formData}
          setFormData={setFormData}
          shake={shake}
          showPw={showPw}
          setShowPw={setShowPw}
          passwordMatch={passwordMatch}
          triggerShake={triggerShake}
          focusAuthCard={focusAuthCard}
          onSubmit={handleAuthSubmit}
        />

        <WorkflowSection />
        <FeaturesSection />
        <PricingSection focusAuthCard={focusAuthCard} />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onStartFree={() => { setAuthMode("signup"); focusAuthCard(); }} />
        <FooterSection />

      </div>
    </div>
  );
}