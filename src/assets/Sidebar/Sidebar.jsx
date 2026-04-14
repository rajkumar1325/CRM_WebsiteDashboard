import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, UsersRound, Users, Headphones,
  Handshake, BarChart3, ClipboardList, LogOut, Menu, X,
} from "lucide-react";

import ProfileImg from "./profile.jpg";

const getInitials = (n) => n.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

const NAV_ITEMS = [
  { to: "/",                  label: "Home",      Icon: Home          },
  { to: "/leads",             label: "Leads",     Icon: UsersRound    },
  { to: "/customers",         label: "Customers", Icon: Users         },
  { to: "/support",           label: "Support",   Icon: Headphones    },
  { to: "/deals",             label: "Deals",     Icon: Handshake     },
  { to: "/reports",           label: "Reports",   Icon: BarChart3     },
  { to: "/taskAndActivities", label: "Tasks",     Icon: ClipboardList },
];

const USER_NAME   = "Raj Kumar";
const MIN_W       = 64;
const MAX_W       = 320;
const SNAP_CLOSED = 64;
const SNAP_OPEN   = 220;
const SNAP_THRESH = 120;

export default function Sidebar() {
  const location = useLocation();
  const shellRef = useRef(null);

  const [width, setWidth]           = useState(SNAP_OPEN);
  const [isMobile, setIsMobile]     = useState(() => window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      if (!m) setMobileOpen(false);
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
    const startX = e.clientX;
    const startW = shellRef.current?.offsetWidth ?? width;

    const onMove = (ev) => {
      setWidth(Math.min(MAX_W, Math.max(MIN_W, startW + ev.clientX - startX)));
    };
    const onUp = (ev) => {
      const final = Math.min(MAX_W, Math.max(MIN_W, startW + ev.clientX - startX));
      setWidth(final < SNAP_THRESH ? SNAP_CLOSED : final);
      setDragActive(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [width]);

  const collapsed  = width < SNAP_THRESH;
  const showLabels = !collapsed;
  const toggle = () => setWidth((w) => (w < SNAP_THRESH ? SNAP_OPEN : SNAP_CLOSED));

  const NavContent = ({ mobile = false }) => (
    <>
      {/* Top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-[200px] pointer-events-none z-0 bg-[radial-gradient(ellipse_160%_120%_at_10%_0%,rgba(99,102,241,0.20)_0%,transparent_65%)]" />
      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 inset-x-0 h-[150px] pointer-events-none z-0 bg-[radial-gradient(ellipse_140%_100%_at_10%_100%,rgba(6,182,212,0.10)_0%,transparent_70%)]" />

      {/* Resize handle – desktop only */}
      {!mobile && (
        <div
          className="group/rh absolute top-0 -right-[5px] w-[10px] h-full cursor-col-resize z-[60] flex items-center justify-center"
          onMouseDown={onResizeStart}
        >
          <div className={`w-[2px] h-[48px] rounded-[2px] transition-colors duration-200 ${dragActive ? "bg-indigo-500/65" : "bg-transparent group-hover/rh:bg-indigo-500/65"}`} />
        </div>
      )}

      {/* PROFILE */}
      <div
        className="relative z-10 flex items-center gap-[10px] px-3 pt-[18px] pb-3.5 border-b border-white/5 cursor-pointer shrink-0 transition-colors duration-200 hover:bg-white/5"
        onClick={mobile ? undefined : toggle}
      >
        <div className="w-[38px] h-[38px] shrink-0 rounded-[11px] overflow-hidden border-[1.5px] border-white/20 shadow-[0_3px_14px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center text-[13px] font-bold text-white">
          <img src={ProfileImg} alt={USER_NAME} className="w-full h-full object-cover block" />
        </div>
        <span className={`text-[13px] font-semibold text-[#dde4f0] whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 transition-all duration-150 ${showLabels || mobile ? "opacity-100 max-w-full" : "opacity-0 max-w-0"}`}>
          {USER_NAME}
        </span>
        {mobile ? (
          <button
            className="ml-auto bg-transparent border-none cursor-pointer text-[#475569] flex p-0 shrink-0"
            onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
          >
            <X size={15} />
          </button>
        ) : (
          <div className="shrink-0 w-5 h-5 rounded-md border border-white/10 bg-white/5 text-[#5a6a80] flex items-center justify-center text-[10px] font-bold">
            {collapsed ? "›" : "‹"}
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-2 pt-1.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={`text-[9px] font-bold tracking-[1.8px] uppercase text-[#2e3f55] whitespace-nowrap overflow-hidden transition-all duration-150 ${showLabels || mobile ? "opacity-100 px-2 pt-2.5 pb-1.5 h-auto" : "opacity-0 h-0 p-0"}`}>
          Menu
        </div>
        {NAV_ITEMS.map(({ to, label, Icon }, index) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{ animation: `sbIn 0.28s ease both`, animationDelay: `${(index + 1) * 0.04}s` }}
              className={`group relative flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] mb-0.5 no-underline border transition-all duration-200 overflow-hidden
                ${active
                  ? "text-[#e8eef8] bg-indigo-500/20 border-indigo-500/30 shadow-[0_2px_20px_rgba(99,102,241,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-[#8fa3be] border-transparent hover:text-[#c8d8ea] hover:bg-white/5 hover:border-white/10"
                }`}
            >
              {active && <span className="absolute left-0 top-[22%] bottom-[22%] w-[3px] rounded-r-sm bg-gradient-to-b from-indigo-400 to-sky-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]" />}
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-indigo-400" : ""}`} size={16} strokeWidth={active ? 2 : 1.6} />
              <span className={`text-[13px] font-normal whitespace-nowrap overflow-hidden transition-all duration-150 ${showLabels || mobile ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"}`}>
                {label}
              </span>
              {(!showLabels && !mobile) && (
                <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#070b19]/95 border border-indigo-500/30 text-[#c8d8ea] text-[11px] px-3 py-1 rounded-lg whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-150 z-[200] shadow-[0_6px_24px_rgba(0,0,0,0.55)] group-hover:opacity-100">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM */}
      <div className="relative z-10 px-2 pt-2 pb-4 border-t border-white/5 shrink-0">
        <div className="text-[9px] text-[#1e2d3d] text-center pb-1.5 tracking-[0.5px]">
          {showLabels || mobile ? "CuriumCRM v1.0" : "v1"}
        </div>
        <div
          className="group relative flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] cursor-pointer text-[#6b7a8f] border border-transparent transition-all duration-200 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
          onClick={() => alert("Log Out")}
        >
          <LogOut size={15} strokeWidth={1.6} className="shrink-0" />
          <span className={`text-[13px] whitespace-nowrap overflow-hidden transition-all duration-150 ${showLabels || mobile ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"}`}>
            Log out
          </span>
          {(!showLabels && !mobile) && (
            <span className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#070b19]/95 border border-indigo-500/30 text-[#c8d8ea] text-[11px] px-3 py-1 rounded-lg whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-150 z-[200] shadow-[0_6px_24px_rgba(0,0,0,0.55)] group-hover:opacity-100">
              Log out
            </span>
          )}
        </div>
      </div>
    </>
  );

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      // ✅ KEY FIX: This wrapper is position:fixed with zero width/height
      // so it takes up ZERO space in the flex layout of App.jsx
      <div className="fixed top-0 left-0 w-0 h-0 z-[50]">
        <style>{`@keyframes sbIn { from { opacity:0; transform:translateX(-8px);} to {opacity:1; transform:translateX(0);}}`}</style>

        {/* Hamburger — fixed, floats over content */}
        <button
          className="fixed top-[13px] left-[13px] w-[38px] h-[38px] rounded-[10px] border border-white/10 bg-[#080e1a]/90 backdrop-blur-xl flex items-center justify-center cursor-pointer text-[#7a8a9e] transition-all duration-200 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/10"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={17} />
        </button>

        {/* ✅ Glass overlay backdrop — overlaps content, does NOT push it */}
        <div
          className={`fixed inset-0 z-[39] transition-all duration-300
            ${mobileOpen
              ? "opacity-100 pointer-events-auto backdrop-blur-sm bg-black/40"
              : "opacity-0 pointer-events-none backdrop-blur-none bg-transparent"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* ✅ Drawer — slides in over content with glass design */}
        <div
          className={`fixed top-0 left-0 h-screen w-[240px] z-[40] flex flex-col
            bg-[#0b101e]/80 backdrop-blur-[40px] backdrop-saturate-[2]
            border-r border-white/10
            shadow-[4px_0_48px_rgba(0,0,0,0.6),inset_-1px_0_0_rgba(255,255,255,0.06)]
            transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <NavContent mobile />
        </div>
      </div>
    );
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes sbIn { from { opacity:0; transform:translateX(-8px);} to {opacity:1; transform:translateX(0);}}`}</style>
      <div
        ref={shellRef}
        className="relative h-screen flex flex-col shrink-0 select-none font-['DM_Sans',sans-serif]
          bg-[#0b101e]/90 backdrop-blur-[32px] backdrop-saturate-[1.8]
          border-r border-white/10
          shadow-[4px_0_48px_rgba(0,0,0,0.5),inset_-1px_0_0_rgba(255,255,255,0.04)]
          transition-[width] duration-75 overflow-visible"
        style={{ width }}
      >
        <NavContent />
      </div>
    </>
  );
}