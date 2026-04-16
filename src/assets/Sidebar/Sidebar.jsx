import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, UsersRound, Users, Headphones,
  Handshake, BarChart3, ClipboardList, LogOut, Menu, X,
} from "lucide-react";

import ProfileImg from "./profile.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const getInitials = (n) => n.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────────────────────────────────────
// Navigation items config
// ─────────────────────────────────────────────────────────────────────────────
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

// ── Resize / snap constants ───────────────────────────────────────────────────
const MIN_W       = 64;
const MAX_W       = 320;
const SNAP_CLOSED = 64;
const SNAP_OPEN   = 220;
const SNAP_THRESH = 120;

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
//
// Props:
//   isDark — boolean : syncs with the app-wide dark/light theme
//
// Features:
//   • Drag-to-resize on desktop (snaps open/closed at SNAP_THRESH)
//   • Click profile header to toggle collapsed/expanded
//   • Keyboard shortcut: Cmd+[ (Mac) / Ctrl+[ (Win/Linux) → toggle sidebar
//   • Mobile: renders a 0-size wrapper so it never affects flex layout;
//     a hamburger button + slide-in drawer is used instead
// ─────────────────────────────────────────────────────────────────────────────
export default function Sidebar({ isDark = true }) {
  const location = useLocation();
  const shellRef = useRef(null);

  const [width,       setWidth]       = useState(SNAP_OPEN);
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 768);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [dragActive,  setDragActive]  = useState(false);

  // ── Responsive: detect mobile breakpoint ─────────────────────────────────
  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      if (!m) setMobileOpen(false);
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Close mobile drawer on route change ──────────────────────────────────
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // ── Close mobile drawer on Escape ────────────────────────────────────────
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Global shortcut: Cmd+[ (Mac) / Ctrl+[ → toggle sidebar ───────────────
  // On desktop: snaps between open and closed
  // On mobile:  toggles the drawer
  useEffect(() => {
    const handleShortcut = (e) => {
      const isMac  = navigator.platform.toUpperCase().includes("MAC");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "[") {
        e.preventDefault(); // prevent browser default (e.g. back navigation)
        if (isMobile) {
          setMobileOpen((v) => !v);
        } else {
          // snap toggle between open and closed
          setWidth((w) => (w < SNAP_THRESH ? SNAP_OPEN : SNAP_CLOSED));
        }
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [isMobile]);

  // ── Drag-to-resize handler ────────────────────────────────────────────────
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
      window.removeEventListener("mouseup",  onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, [width]);

  const collapsed  = width < SNAP_THRESH;
  const showLabels = !collapsed;
  const toggle     = () => setWidth((w) => (w < SNAP_THRESH ? SNAP_OPEN : SNAP_CLOSED));

  // ── Theme tokens (mirrors Topbar approach — all conditional on isDark) ────
  // Dark mode keeps the existing deep navy palette.
  // Light mode uses soft whites and grays to match the Topbar light theme.
  const shell     = isDark
    ? "bg-[#0b101e]/90 border-white/10 shadow-[4px_0_48px_rgba(0,0,0,0.5),inset_-1px_0_0_rgba(255,255,255,0.04)]"
    : "bg-white/95    border-gray-200  shadow-[4px_0_24px_rgba(0,0,0,0.08),inset_-1px_0_0_rgba(0,0,0,0.04)]";

  const profileBorder = isDark ? "border-white/20"  : "border-gray-300/60";
  const profileDivider= isDark ? "border-white/5"   : "border-gray-200";
  const profileName   = isDark ? "text-[#dde4f0]"   : "text-gray-800";
  const toggleBtn     = isDark
    ? "border-white/10 bg-white/5 text-[#5a6a80]"
    : "border-gray-200 bg-gray-100 text-gray-400";

  const menuLabel     = isDark ? "text-[#2e3f55]"   : "text-gray-300";
  const navActive     = isDark
    ? "text-[#e8eef8] bg-indigo-500/20 border-indigo-500/30 shadow-[0_2px_20px_rgba(99,102,241,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
    : "text-indigo-700 bg-indigo-50    border-indigo-200/80  shadow-[0_2px_12px_rgba(99,102,241,0.10)]";
  const navInactive   = isDark
    ? "text-[#8fa3be] border-transparent hover:text-[#c8d8ea] hover:bg-white/5 hover:border-white/10"
    : "text-gray-500  border-transparent hover:text-gray-800  hover:bg-gray-100 hover:border-gray-200";
  const activeBar     = isDark
    ? "bg-gradient-to-b from-indigo-400 to-sky-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]"
    : "bg-gradient-to-b from-indigo-500 to-sky-500";
  const activeIcon    = isDark ? "text-indigo-400" : "text-indigo-600";

  const tooltip       = isDark
    ? "bg-[#070b19]/95 border-indigo-500/30 text-[#c8d8ea] shadow-[0_6px_24px_rgba(0,0,0,0.55)]"
    : "bg-white        border-gray-200      text-gray-700   shadow-[0_6px_24px_rgba(0,0,0,0.12)]";

  const bottomDivider = isDark ? "border-white/5"  : "border-gray-200";
  const versionText   = isDark ? "text-[#1e2d3d]"  : "text-gray-300";
  const logoutColor   = isDark
    ? "text-[#6b7a8f] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
    : "text-gray-400  hover:text-red-500 hover:bg-red-50      hover:border-red-200";

  // ── Glow overlays (decorative, dark-only) ────────────────────────────────
  const topGlow    = isDark ? "bg-[radial-gradient(ellipse_160%_120%_at_10%_0%,rgba(99,102,241,0.20)_0%,transparent_65%)]"    : "";
  const bottomGlow = isDark ? "bg-[radial-gradient(ellipse_140%_100%_at_10%_100%,rgba(6,182,212,0.10)_0%,transparent_70%)]" : "";

  // ─────────────────────────────────────────────────────────────────────────
  // NavContent — shared between desktop sidebar and mobile drawer
  //
  // Props:
  //   mobile — boolean: when true, renders in full-label mode always
  //                     and shows the X close button in the profile row
  // ─────────────────────────────────────────────────────────────────────────
  const NavContent = ({ mobile = false }) => (
    <>
      {/* Ambient top glow (dark only) */}
      {isDark && <div className={`absolute top-0 inset-x-0 h-[200px] pointer-events-none z-0 ${topGlow}`} />}
      {/* Ambient bottom glow (dark only) */}
      {isDark && <div className={`absolute bottom-0 inset-x-0 h-[150px] pointer-events-none z-0 ${bottomGlow}`} />}

      {/* ── Drag resize handle (desktop only) ──────────────────────────── */}
      {!mobile && (
        <div
          className="group/rh absolute top-0 -right-[5px] w-[10px] h-full cursor-col-resize z-[60] flex items-center justify-center"
          onMouseDown={onResizeStart}
        >
          <div className={`
            w-[2px] h-[48px] rounded-[2px] transition-colors duration-200
            ${dragActive
              ? "bg-indigo-500/65"
              : isDark
                ? "bg-transparent group-hover/rh:bg-indigo-500/65"
                : "bg-transparent group-hover/rh:bg-indigo-400/50"
            }
          `} />
        </div>
      )}

      {/* ── Profile / header row ─────────────────────────────────────────── */}
      <div
        className={`
          relative z-10 flex items-center gap-[10px] px-3 pt-[18px] pb-3.5
          border-b cursor-pointer shrink-0 transition-colors duration-200
          ${profileDivider}
          ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}
        `}
        onClick={mobile ? undefined : toggle}
      >
        {/* Avatar */}
        <div className={`
          w-[38px] h-[38px] shrink-0 rounded-[11px] overflow-hidden
          border-[1.5px] shadow-[0_3px_14px_rgba(0,0,0,0.4)]
          bg-gradient-to-br from-[#6366f1] to-[#06b6d4]
          flex items-center justify-center text-[13px] font-bold text-white
          ${profileBorder}
        `}>
          <img src={ProfileImg} alt={USER_NAME} className="w-full h-full object-cover block" />
        </div>

        {/* Name */}
        <span className={`
          text-[13px] font-semibold whitespace-nowrap overflow-hidden
          text-ellipsis flex-1 min-w-0 transition-all duration-150
          ${profileName}
          ${showLabels || mobile ? "opacity-100 max-w-full" : "opacity-0 max-w-0"}
        `}>
          {USER_NAME}
        </span>

        {/* Mobile: X close button / Desktop: collapse arrow */}
        {mobile ? (
          <button
            className="ml-auto bg-transparent border-none cursor-pointer flex p-0 shrink-0 text-gray-400"
            onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
          >
            <X size={15} />
          </button>
        ) : (
          <div className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold ${toggleBtn}`}>
            {collapsed ? "›" : "‹"}
          </div>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-2 pt-1.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* Section label */}
        <div className={`
          text-[9px] font-bold tracking-[1.8px] uppercase whitespace-nowrap
          overflow-hidden transition-all duration-150
          ${menuLabel}
          ${showLabels || mobile ? "opacity-100 px-2 pt-2.5 pb-1.5 h-auto" : "opacity-0 h-0 p-0"}
        `}>
          Menu
        </div>

        {NAV_ITEMS.map(({ to, label, Icon }, index) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{ animation: `sbIn 0.28s ease both`, animationDelay: `${(index + 1) * 0.04}s` }}
              className={`
                group relative flex items-center gap-[11px] px-[11px] py-[9px]
                rounded-[10px] mb-0.5 no-underline border
                transition-all duration-200 overflow-hidden
                ${active ? navActive : navInactive}
              `}
            >
              {/* Active left accent bar */}
              {active && (
                <span className={`absolute left-0 top-[22%] bottom-[22%] w-[3px] rounded-r-sm ${activeBar}`} />
              )}

              {/* Icon */}
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? activeIcon : ""}`}
                size={16}
                strokeWidth={active ? 2 : 1.6}
              />

              {/* Label */}
              <span className={`
                text-[13px] font-normal whitespace-nowrap overflow-hidden
                transition-all duration-150
                ${showLabels || mobile ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"}
              `}>
                {label}
              </span>

              {/* Tooltip — shown only when collapsed on desktop */}
              {(!showLabels && !mobile) && (
                <span className={`
                  absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2
                  text-[11px] px-3 py-1 rounded-lg whitespace-nowrap border
                  pointer-events-none opacity-0 transition-opacity duration-150
                  z-[200] group-hover:opacity-100
                  ${tooltip}
                `}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: version + logout ──────────────────────────────────────── */}
      <div className={`relative z-10 px-2 pt-2 pb-4 border-t shrink-0 ${bottomDivider}`}>

        {/* Version string */}
        <div className={`text-[9px] text-center pb-1.5 tracking-[0.5px] ${versionText}`}>
          {showLabels || mobile ? "CuriumCRM v1.0" : "v1"}
        </div>

        {/* Log out button */}
        <div
          className={`
            group relative flex items-center gap-[11px] px-[11px] py-[9px]
            rounded-[10px] cursor-pointer border border-transparent
            transition-all duration-200 ${logoutColor}
          `}
          onClick={() => alert("Log Out")}
        >
          <LogOut size={15} strokeWidth={1.6} className="shrink-0" />

          <span className={`
            text-[13px] whitespace-nowrap overflow-hidden transition-all duration-150
            ${showLabels || mobile ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"}
          `}>
            Log out
          </span>

          {/* Tooltip when collapsed */}
          {(!showLabels && !mobile) && (
            <span className={`
              absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2
              text-[11px] px-3 py-1 rounded-lg whitespace-nowrap border
              pointer-events-none opacity-0 transition-opacity duration-150
              z-[200] group-hover:opacity-100
              ${tooltip}
            `}>
              Log out
            </span>
          )}
        </div>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Mobile render
  // Zero-size wrapper keeps it out of the flex flow in App.jsx.
  // Sidebar content slides in as a fixed overlay drawer.
  // ─────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 w-0 h-0 z-[50]">
        <style>{`@keyframes sbIn { from { opacity:0; transform:translateX(-8px);} to {opacity:1; transform:translateX(0);}}`}</style>

        {/* Hamburger — floats over page content */}
        <button
          className={`
            fixed top-[13px] left-[13px] w-[38px] h-[38px] rounded-[10px] border
            backdrop-blur-xl flex items-center justify-center cursor-pointer
            transition-all duration-200
            ${isDark
              ? "border-white/10 bg-[#080e1a]/90 text-[#7a8a9e] hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/10"
              : "border-gray-200 bg-white/90      text-gray-500  hover:border-indigo-300    hover:text-indigo-600 hover:bg-indigo-50"
            }
          `}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={17} />
        </button>

        {/* Backdrop overlay */}
        <div
          className={`
            fixed inset-0 z-[39] transition-all duration-300
            ${mobileOpen
              ? "opacity-100 pointer-events-auto backdrop-blur-sm bg-black/40"
              : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setMobileOpen(false)}
        />

        {/* Slide-in drawer */}
        <div className={`
          fixed top-0 left-0 h-screen w-[240px] z-[40] flex flex-col
          backdrop-blur-[40px] backdrop-saturate-[2]
          border-r transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isDark
            ? "bg-[#0b101e]/80 border-white/10 shadow-[4px_0_48px_rgba(0,0,0,0.6),inset_-1px_0_0_rgba(255,255,255,0.06)]"
            : "bg-white/95     border-gray-200  shadow-[4px_0_24px_rgba(0,0,0,0.10)]"
          }
        `}>
          <NavContent mobile />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Desktop render — resizable fixed-width column in the flex layout
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes sbIn { from { opacity:0; transform:translateX(-8px);} to {opacity:1; transform:translateX(0);}}`}</style>
      <div
        ref={shellRef}
        className={`
          relative h-screen flex flex-col shrink-0 select-none
          font-['DM_Sans',sans-serif]
          backdrop-blur-[32px] backdrop-saturate-[1.8]
          border-r transition-[width] duration-75 overflow-visible
          ${shell}
        `}
        style={{ width }}
      >
        <NavContent />
      </div>
    </>
  );
}
