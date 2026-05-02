// ─── LandingPage.jsx (main orchestrator) ─────────────────────────────────────
import { useEffect, useState, useRef } from "react";

import { LANDING_CSS }     from "./landingStyles";
import Navbar              from "./sections/Navbar";
import HeroSection         from "./sections/HeroSection";
import WorkflowSection     from "./sections/WorkflowSection";
import FeaturesSection     from "./sections/FeaturesSection";
import PricingSection      from "./sections/PricingSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FAQSection          from "./sections/FAQSection";
import CTASection          from "./sections/CTASection";
import FooterSection       from "./sections/FooterSection";

export default function LandingPage() {

  // ── Auth card UI state ─────────────────────────────────────────────────────
  const [authMode, setAuthMode]           = useState("signup"); // "signup" | "login"
  const [authHighlight, setAuthHighlight] = useState(false);
  const authCardRef                       = useRef(null);
  const [selectedRole, setSelectedRole]   = useState(null);    // "admin" | "employee" | "customer"

  // ── Form state ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name:            "",   // customer signup only
    company:         "",   // admin/employee signup only
    email:           "",
    phone:           "",   // signup only
    city:            "",   // signup only
    password:        "",
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

  // ── Auth request status ────────────────────────────────────────────────────
  // "idle" | "loading" | "success" | "error"
  const [authStatus, setAuthStatus] = useState("idle");
  const [authError, setAuthError]   = useState("");

  // ── Scroll auth card into view + flash highlight ring ─────────────────────
  const focusAuthCard = () => {
    authCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setAuthHighlight(true);
    setTimeout(() => setAuthHighlight(false), 800);
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleAuthSubmit = async ({ role, endpoint, ...data }) => {
    setAuthStatus("loading");
    setAuthError("");

    try {
      const isApiRoute = endpoint.startsWith("/api/");

      const body = isApiRoute
        ? JSON.stringify({ ...data, role })
        : new URLSearchParams({ ...data, role }).toString();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": isApiRoute
            ? "application/json"
            : "application/x-www-form-urlencoded",
        },
        body,
        credentials: "include", // for session cookies (MVC routes)
      });

      // ── Handle errors ──────────────────────────────────────────────────────
      if (!res.ok) {
        if (res.status === 401) {
          setAuthError("❌ Wrong email or password.");
        } else if (res.status === 409) {
          setAuthError("❌ Email already registered. Try logging in.");
        } else if (res.status === 400) {
          setAuthError("❌ Invalid data. Please check your inputs.");
        } else if (res.status === 500) {
          setAuthError("❌ Server error. Please try again later.");
        } else {
          const msg = await res.text().catch(() => "");
          setAuthError(`❌ ${msg || "Something went wrong."}`);
        }
        setAuthStatus("error");
        return;
      }

      // ── Handle Spring MVC redirect (session-based routes) ─────────────────
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      // ── Handle JWT success (API routes) ───────────────────────────────────
      const json = await res.json();
      localStorage.setItem("token", json.token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", json.email);

      setAuthStatus("success");

      // Redirect after short delay so user sees the success state on button
      setTimeout(() => {
        if (role === "admin")         window.location.href = "/adminProfile";
        else if (role === "employee") window.location.href = "/employeeManagement";
        else                          window.location.href = "/home";
      }, 1200);

    } catch (err) {
      console.error("Auth error:", err);
      setAuthError("❌ Cannot reach server. Is Spring Boot running on port 8080?");
      setAuthStatus("error");
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

      {/* Parallax glow orbs */}
      <div className="lp-glow-orb-1" style={{ transform: `translateY(${layer1}px)` }} />
      <div className="lp-glow-orb-2" style={{ transform: `translateY(${layer2}px)` }} />

      {/* Dot grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-1.5 h-1.5 rounded-full bg-cyan-400/50 anim-float-a" />
        <div className="absolute top-1/2 right-24 w-1 h-1 rounded-full bg-purple-400/60 anim-float-b" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-32 left-1/3 w-2 h-2 rounded-full bg-emerald-400/40 anim-float-a" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/4 right-1/3 w-1 h-1 rounded-full bg-amber-400/50 anim-float-b" style={{ animationDelay: "1s" }} />
      </div>

      {/* Page content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Navbar
          onLogin={()    => { setAuthMode("login");  focusAuthCard(); }}
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
          authStatus={authStatus}
          authError={authError}
          setAuthStatus={setAuthStatus}
          setAuthError={setAuthError}
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