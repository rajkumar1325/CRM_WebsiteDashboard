import React, { useState, useRef, useEffect, useCallback } from "react";

import BellIcon  from "./Icons/bell-notification.svg?react";
import Setting   from "./Icons/settings.svg?react";
import Sun       from "./Icons/sun-light.svg?react";
import Moon      from "./Icons/half-moon.svg?react";
import ChatIcon  from "./Icons/chatIcon.svg?react";
import CRMChatbot from "../components/Chatbot/CRMChatbot";

function Topbar({ setSearch, searchPlaceHolder, isDark, setIsDark }) {

  const [isChatOpen,    setIsChatOpen]    = useState(false);
  const [isNotifOpen,   setIsNotifOpen]   = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef   = useRef(null);   
  const profileRef = useRef(null);   
  const chatRef    = useRef(null);   
  const searchRef  = useRef(null);   

  useEffect(() => {
    function handleOutsideClick(e) {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      
      // We no longer close chat on outside click here, otherwise interacting inside the fixed 
      // chatbot window might accidentally close it if the ref doesn't capture the portal!
      // (Optional: You can add a dedicated close "X" button inside the chatbot)
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleGlobalKeyDown = useCallback((e) => {
    const isMac      = navigator.platform.toUpperCase().includes("MAC");
    const modKey     = isMac ? e.metaKey : e.ctrlKey;   
    const isSearchKb = modKey && e.key.toLowerCase() === "f";

    if (isSearchKb) {
      e.preventDefault();           
      searchRef.current?.focus();   
      searchRef.current?.select();  
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const notifications = [
    { id: 1, text: "Mary Johnson accepted your proposal",          time: "2m ago",  dot: "bg-emerald-400", unread: true  },
    { id: 2, text: "New lead from Website: Tech Corp.",            time: "18m ago", dot: "bg-violet-400",  unread: true  },
    { id: 3, text: "Deal 'Cloud Migration' moved to Negotiation",  time: "1h ago",  dot: "bg-amber-400",   unread: true  },
    { id: 4, text: "Support ticket #312 resolved",                 time: "3h ago",  dot: "bg-sky-400",     unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length; 

  const bar         = isDark ? "bg-[#151921] border-white/[0.06]"   : "bg-white border-gray-200";
  const inputBg     = isDark
    ? "bg-[#1A1F29] border-white/[0.08] text-gray-100 placeholder-gray-500 focus:border-blue-500/50"
    : "bg-gray-50  border-gray-200      text-gray-800 placeholder-gray-400  focus:border-blue-400";
  const inputShadow = searchFocused
    ? (isDark ? "shadow-blue-500/10 shadow-md" : "shadow-blue-200/60 shadow-md")
    : "";
  const iconColor   = isDark ? "text-gray-400 hover:text-white"     : "text-gray-500 hover:text-gray-800";
  const btnHover    = isDark ? "hover:bg-white/[0.07]"              : "hover:bg-gray-100";
  const divider     = isDark ? "bg-white/[0.07]"                    : "bg-gray-200";
  const dropBg      = isDark
    ? "bg-[#1A1F29] border-white/[0.08] shadow-black/40"
    : "bg-white     border-gray-200     shadow-gray-200/80";
  const dropTitle   = isDark ? "text-white/70"        : "text-gray-500";
  const dropItem    = isDark ? "hover:bg-white/[0.05] text-white/80" : "hover:bg-gray-50 text-gray-700";
  const dropSub     = isDark ? "text-white/35"        : "text-gray-400";
  const unreadBg    = isDark ? "bg-white/[0.04]"      : "bg-blue-50/60";
  const badgeBg     = "bg-blue-600 text-white";     

  const isMac       = typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC");
  const shortcutLabel = isMac ? "⌘F" : "^F";

  const IconBtn = ({ onClick, children, badge, active, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={`
        relative flex items-center justify-center w-9 h-9 rounded-xl
        transition-all duration-200 ${btnHover}
        ${active ? (isDark ? "bg-white/[0.09]" : "bg-blue-50") : ""}
      `}
    >
      {children}
      {badge > 0 && (
        <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${badgeBg}`}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className={`
      sticky top-0 z-40
      flex items-center
      w-full min-w-0                
      px-6 py-3
      border-b backdrop-blur-xl
      transition-colors duration-300
      ${bar}
    `}>

      {/* ── Search bar ──────────────────────────────────────────────────── */}
      <div className="relative flex-1 min-w-0 max-w-xl">
        <svg
          className={`
            absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
            transition-colors duration-200 pointer-events-none
            ${searchFocused ? "text-blue-500" : isDark ? "text-gray-600" : "text-gray-400"}
          `}
          fill="none" viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6"/>
          <path   d="M14.5 14.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>

        <input
          ref={searchRef}
          type="text"
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder={searchPlaceHolder || "Search leads, deals, customers..."}
          className={`
            w-full pl-9 pr-14 py-2 rounded-xl border text-sm outline-none
            transition-all duration-200 ${inputBg} ${inputShadow}
          `}
        />

        <kbd className={`
          absolute right-3 top-1/2 -translate-y-1/2
          hidden sm:flex items-center gap-0.5
          px-1.5 py-0.5 rounded text-[10px] font-mono border
          transition-opacity duration-150 select-none
          ${isDark  ? "border-white/10 text-white/25 bg-white/5" : "border-gray-200 text-gray-300 bg-gray-50"}
          ${searchFocused ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}>
          {shortcutLabel}
        </kbd>
      </div>


      {/* ── Action icon group (FIXED: Added ml-auto so it pushes right) ── */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto">

        <div ref={notifRef} className="relative">
          <IconBtn
            onClick={() => {
              setIsNotifOpen(v => !v);
              setIsProfileOpen(false);
              setIsChatOpen(false);
            }}
            badge={unreadCount}
            active={isNotifOpen}
            title="Notifications"
          >
            <BellIcon className={`w-5 h-5 transition-colors duration-200 ${iconColor}`} />
          </IconBtn>

          {isNotifOpen && (
            <div className={`
              absolute top-12 right-0 w-80 rounded-2xl border shadow-2xl overflow-hidden
              animate-in fade-in slide-in-from-top-2 duration-200
              ${dropBg}
            `}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${dropTitle}`}>Notifications</span>
                <button className="text-[11px] text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${dropItem} ${n.unread ? unreadBg : ""}`}>
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-snug">{n.text}</p>
                      <p className={`text-[10px] mt-0.5 ${dropSub}`}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`px-4 py-2 border-t ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
                <button className={`text-[11px] w-full text-center ${dropSub} hover:text-blue-500 transition-colors`}>
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── AI Chatbot Trigger ── */}
        <div>
          <IconBtn
            onClick={() => {
              setIsChatOpen(v => !v);
              setIsNotifOpen(false);
              setIsProfileOpen(false);
            }}
            active={isChatOpen}
            title="AI Assistant"
          >
            <ChatIcon className={`w-5 h-5 transition-colors duration-200 ${iconColor}`} />
          </IconBtn>
        </div>

        <IconBtn
          onClick={() => setIsDark(!isDark)}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark
            ? <Sun  className={`w-5 h-5 transition-colors duration-200 ${iconColor}`} />
            : <Moon className={`w-5 h-5 transition-colors duration-200 ${iconColor}`} />
          }
        </IconBtn>

        <IconBtn onClick={() => alert("Settings")} title="Settings">
          <Setting className={`w-5 h-5 transition-colors duration-200 ${iconColor}`} />
        </IconBtn>

        <div className={`hidden sm:block w-px h-6 mx-1 shrink-0 ${divider}`} />

        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(v => !v);
              setIsNotifOpen(false);
              setIsChatOpen(false);
            }}
            className={`
              flex items-center gap-2 pl-1.5 pr-3 py-1
              rounded-xl border transition-all duration-200
              ${isDark
                ? "border-white/[0.08] hover:bg-white/[0.07] bg-white/[0.04]"
                : "border-gray-200    hover:bg-gray-100      bg-gray-50"}
            `}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              RK
            </div>

            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className={`text-xs font-semibold ${isDark ? "text-white/85" : "text-gray-700"}`}>
                Raj Kumar
              </span>
              <span className={`text-[10px] ${isDark ? "text-white/35" : "text-gray-400"}`}>
                Admin
              </span>
            </div>

            <svg className={`w-3 h-3 hidden md:block transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""} ${isDark ? "text-white/30" : "text-gray-400"}`} fill="none" viewBox="0 0 12 12">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {isProfileOpen && (
            <div className={`
              absolute top-12 right-0 w-52 rounded-2xl border shadow-2xl overflow-hidden
              animate-in fade-in slide-in-from-top-2 duration-200
              ${dropBg}
            `}>
              <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  RK
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? "text-white/90" : "text-gray-800"}`}>
                    Raj Kumar
                  </p>
                  <p className={`text-[11px] ${dropSub}`}>raj@curiemcrm.com</p>
                </div>
              </div>

              {[
                { label: "My Profile",          icon: "👤" },
                { label: "Account Settings",    icon: "⚙️" },
                { label: "Billing",             icon: "💳" },
                { label: "Keyboard Shortcuts",  icon: "⌨️" },
              ].map(item => (
                <button key={item.label} className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${dropItem}`}>
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              <div className={`border-t ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
                <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-500/10 transition-colors duration-150">
                  <span className="text-base leading-none">🚪</span>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Chatbot Portal (FIXED: Removed from relative layout to snap bottom-right) ── */}
      {isChatOpen && (
        <div className={`
          fixed bottom-6 right-6 z-[100] 
          w-[360px] h-[550px] 
          rounded-2xl shadow-2xl border flex flex-col overflow-hidden
          animate-in fade-in slide-in-from-bottom-6 duration-300
          ${isDark ? 'bg-[#151921] border-white/10' : 'bg-white border-slate-200'}
        `}>
          
          {/* Custom Header for the Chatbot with a Close Button */}
          <div className={`px-4 py-3 border-b flex justify-between items-center ${isDark ? 'border-white/10 bg-[#1A1F29]' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">✧</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>CRM AI Assistant</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-200 text-slate-500'}`}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <CRMChatbot embedded={true} />
          </div>
        </div>
      )}

    </div>
  );
}

export default Topbar;