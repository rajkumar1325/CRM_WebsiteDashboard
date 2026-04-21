import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — replace with real API calls (see backend comments below)
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "new_lead",
    title: "New lead assigned",
    message: "Elizabeth Grey from Tech Corp. was assigned to you.",
    time: "2 min ago",
    read: false,
    avatar: "EG",
    avatarColor: "#6366f1",
    meta: { leadId: "lead_021" },
  },
  {
    id: 2,
    type: "meeting_reminder",
    title: "Meeting in 30 minutes",
    message: "Demo Call with Jane Smith · 5:00 PM",
    time: "28 min ago",
    read: false,
    avatar: "JS",
    avatarColor: "#f59e0b",
    meta: { meetingId: "meet_005" },
  },
  {
    id: 3,
    type: "deal_closed",
    title: "Deal closed — ₹1,75,000",
    message: "Sarah Kim converted at Innovate Inc.",
    time: "1 hr ago",
    read: false,
    avatar: "SK",
    avatarColor: "#10b981",
    meta: { dealId: "deal_089" },
  },
  {
    id: 4,
    type: "task_due",
    title: "Task overdue",
    message: "Send contract to Acme Inc. was due yesterday.",
    time: "3 hr ago",
    read: true,
    avatar: "⚠",
    avatarColor: "#ef4444",
    meta: { taskId: "task_012" },
  },
  {
    id: 5,
    type: "lead_status",
    title: "Lead status changed",
    message: "John Doe moved from Qualified → Converted.",
    time: "5 hr ago",
    read: true,
    avatar: "JD",
    avatarColor: "#8b5cf6",
    meta: { leadId: "lead_003" },
  },
  {
    id: 6,
    type: "follow_up",
    title: "Follow-up reminder",
    message: "Call Rohan Verma — hasn't responded in 3 days.",
    time: "Yesterday",
    read: true,
    avatar: "RV",
    avatarColor: "#0ea5e9",
    meta: { leadId: "lead_017" },
  },
  {
    id: 7,
    type: "system",
    title: "Weekly report ready",
    message: "Your sales summary for W15 is available.",
    time: "Yesterday",
    read: true,
    avatar: "📊",
    avatarColor: "#64748b",
    meta: { reportId: "report_w15" },
  },
];

// Icon map per notification type
const TYPE_ICONS = {
  new_lead:       "👤",
  meeting_reminder: "📅",
  deal_closed:    "🏆",
  task_due:       "⚠️",
  lead_status:    "🔄",
  follow_up:      "📞",
  system:         "📊",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function NotificationBell({ darkMode }) {
  const [open, setOpen]               = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter]           = useState("all"); // "all" | "unread"
  const panelRef                      = useRef(null);

  // ── BACKEND COMMENT ① ─────────────────────────────────────────────────────
  // Replace MOCK_NOTIFICATIONS with a real fetch on mount.
  //
  //   useEffect(() => {
  //     async function load() {
  //       // GET /api/notifications?userId=<currentUserId>&limit=30
  //       // Expected response shape: { notifications: Notification[] }
  //       // Notification: { id, type, title, message, time, read, avatar,
  //       //                  avatarColor, meta }
  //       const res  = await fetch("/api/notifications");
  //       const data = await res.json();
  //       setNotifications(data.notifications);
  //     }
  //     load();
  //   }, []);
  // ──────────────────────────────────────────────────────────────────────────

  // ── BACKEND COMMENT ② ─────────────────────────────────────────────────────
  // Real-time updates: use WebSocket or SSE so new CRM events push instantly.
  //
  //   useEffect(() => {
  //     const es = new EventSource("/api/notifications/stream?userId=<id>");
  //     es.onmessage = (e) => {
  //       const newNotif = JSON.parse(e.data);
  //       setNotifications(prev => [newNotif, ...prev]);
  //     };
  //     return () => es.close();
  //   }, []);
  // ──────────────────────────────────────────────────────────────────────────

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed   = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  // Mark single notification as read
  function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // ── BACKEND COMMENT ③ ───────────────────────────────────────────────────
    // Persist read state to backend:
    //
    //   await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    // ────────────────────────────────────────────────────────────────────────
  }

  // Mark all as read
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // ── BACKEND COMMENT ④ ───────────────────────────────────────────────────
    // Mark all as read in backend:
    //
    //   await fetch("/api/notifications/read-all", { method: "PATCH" });
    // ────────────────────────────────────────────────────────────────────────
  }

  // Navigate to related entity when notification is clicked
  function handleNotifClick(notif) {
    markRead(notif.id);

    // ── BACKEND COMMENT ⑤ ───────────────────────────────────────────────────
    // Route the user to the relevant page based on type:
    //
    //   switch (notif.type) {
    //     case "new_lead":
    //     case "lead_status":
    //       navigate(`/leads/${notif.meta.leadId}`);   // React Router / Next.js
    //       break;
    //     case "deal_closed":
    //       navigate(`/deals/${notif.meta.dealId}`);
    //       break;
    //     case "meeting_reminder":
    //       navigate(`/meetings/${notif.meta.meetingId}`);
    //       break;
    //     case "task_due":
    //       navigate(`/tasks/${notif.meta.taskId}`);
    //       break;
    //     case "system":
    //       navigate(`/reports/${notif.meta.reportId}`);
    //       break;
    //   }
    // ────────────────────────────────────────────────────────────────────────

    setOpen(false);
  }

  // ── Theming ─────────────────────────────────────────────────────────────
  const bg        = darkMode ? "#1e2130" : "#ffffff";
  const bgHover   = darkMode ? "#252840" : "#f8f9fb";
  const border    = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const text      = darkMode ? "#e2e8f0" : "#1e293b";
  const textMuted = darkMode ? "#94a3b8" : "#64748b";
  const shadow    = darkMode
    ? "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)"
    : "0 24px 60px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.07)";
  const pillBg    = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const pillActive = darkMode ? "#6366f1" : "#6366f1";

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={panelRef}>

      {/* ── Bell Button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        style={{
          position: "relative",
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "none",
          background: open
            ? (darkMode ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.10)")
            : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.18s",
          color: darkMode ? "#e2e8f0" : "#334155",
        }}
      >
        {/* Bell SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 17,
            height: 17,
            borderRadius: "50%",
            background: "#ef4444",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${darkMode ? "#111827" : "#f8fafc"}`,
            lineHeight: 1,
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ──────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          width: 360,
          maxHeight: 520,
          borderRadius: 16,
          background: bg,
          boxShadow: shadow,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
          animation: "nb-drop 0.18s cubic-bezier(0.22,1,0.36,1)",
        }}>

          <style>{`
            @keyframes nb-drop {
              from { opacity: 0; transform: translateY(-8px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .nb-item:hover { background: ${bgHover} !important; }
            .nb-item { transition: background 0.14s; }
            .nb-scroll::-webkit-scrollbar { width: 4px; }
            .nb-scroll::-webkit-scrollbar-thumb {
              background: ${border}; border-radius: 4px;
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: "16px 18px 12px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: text }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span style={{
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 20,
                  padding: "1px 7px",
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 12,
                  color: "#6366f1",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{
            padding: "10px 18px 8px",
            display: "flex",
            gap: 6,
            borderBottom: `1px solid ${border}`,
            flexShrink: 0,
          }}>
            {["all", "unread"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "4px 13px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: filter === f ? pillActive : pillBg,
                  color: filter === f ? "#fff" : textMuted,
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {f === "all"
                  ? `All (${notifications.length})`
                  : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div
            className="nb-scroll"
            style={{ overflowY: "auto", flexGrow: 1 }}
          >
            {displayed.length === 0 ? (
              <div style={{
                padding: "36px 20px",
                textAlign: "center",
                color: textMuted,
                fontSize: 13,
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
                You're all caught up!
              </div>
            ) : (
              displayed.map((notif) => (
                <div
                  key={notif.id}
                  className="nb-item"
                  onClick={() => handleNotifClick(notif)}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 18px",
                    cursor: "pointer",
                    borderBottom: `1px solid ${border}`,
                    background: !notif.read
                      ? (darkMode ? "rgba(99,102,241,0.07)" : "rgba(99,102,241,0.04)")
                      : "transparent",
                    position: "relative",
                  }}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div style={{
                      position: "absolute",
                      top: 18,
                      left: 6,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#6366f1",
                    }} />
                  )}

                  {/* Avatar */}
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: notif.avatarColor + "22",
                    color: notif.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: notif.avatar.length > 2 ? 18 : 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    border: `1.5px solid ${notif.avatarColor}44`,
                  }}>
                    {notif.avatar.length > 2 ? notif.avatar : notif.avatar}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: notif.read ? 500 : 700,
                      color: text,
                      marginBottom: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {TYPE_ICONS[notif.type]} {notif.title}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: textMuted,
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {notif.message}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: textMuted,
                      marginTop: 4,
                      opacity: 0.7,
                    }}>
                      {notif.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 18px",
            borderTop: `1px solid ${border}`,
            textAlign: "center",
            flexShrink: 0,
          }}>
            <button
              style={{
                fontSize: 13,
                color: "#6366f1",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}

              // ── BACKEND COMMENT ⑥ ────────────────────────────────────────
              // Navigate to full notifications page:
              //   onClick={() => navigate("/notifications")}
              // Or load more with pagination:
              //   onClick={() => fetchMore({ page: currentPage + 1 })}
              // ─────────────────────────────────────────────────────────────
            >
              View all notifications →
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
