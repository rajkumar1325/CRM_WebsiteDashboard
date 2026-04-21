import { useState, useRef, useEffect } from "react";





// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = "llama3-8b-8192";

// ─── Time formatter ───────────────────────────────────────────────────────────
const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ─── Build a lean CRM context snapshot from mock data ────────────────────────
/**
 * Pass your actual imported data here.
 * We strip heavy fields (callHistory detail, purchaseDate, etc.)
 * so the snapshot stays well under ~1 500 tokens even with 40+ leads.
 */
function buildCRMContext({ mockData = [], analyticsData = {}, calendarData = [], dealsData = [], tasksData = [], customersData = [], AGENTS = [] } = {}) {

  // ── Leads summary ──────────────────────────────────────────────────────────
  const leads = mockData.map(l => ({
    id:           l.id,
    name:         l.name,
    company:      l.company,
    status:       l.status,           // new | contacted | qualified | converted | lost
    source:       l.source,
    assignedTo:   l.assignedTo,
    dealStatus:   l.dealStatus,       // active | close
    receivedAmount: l.receivedAmount,
    createdAt:    l.createdAt?.slice(0, 10),
    lastContact:  l.callHistory?.length
      ? l.callHistory[l.callHistory.length - 1].time?.slice(0, 10)
      : null,
    lastFeedback: l.callHistory?.length
      ? l.callHistory[l.callHistory.length - 1].feedback
      : "No contact yet",
    contactCount: l.callHistory?.length ?? 0,
  }));

  // ── Pipeline KPIs ──────────────────────────────────────────────────────────
  const totalLeads      = leads.length;
  const byStatus        = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});
  const activeDeals     = leads.filter(l => l.dealStatus === "active").length;
  const closedDeals     = leads.filter(l => l.dealStatus === "close").length;
  const totalRevenue    = leads.reduce((s, l) => s + (l.receivedAmount || 0), 0);
  const noContactLeads  = leads.filter(l => l.contactCount === 0).map(l => l.name);
  const hotLeads        = leads.filter(l => ["qualified", "contacted"].includes(l.status) && l.dealStatus === "active");

  // ── Upcoming calendar (next 7 days) ───────────────────────────────────────
  const now     = new Date();
  const in7days = new Date(now.getTime() + 7 * 86400000);
  const upcomingMeetings = calendarData
    .filter(e => new Date(e.date) >= now && new Date(e.date) <= in7days)
    .map(e => ({ title: e.title, date: new Date(e.date).toLocaleDateString(), type: e.type, priority: e.priority }));

  // ── Open tasks ─────────────────────────────────────────────────────────────
  const openTasks = tasksData
    .filter(t => !t.done)
    .map(t => ({ title: t.title, priority: t.priority, due: t.due, lead: t.lead }));

  // ── Active deals ───────────────────────────────────────────────────────────
  const activeDealsDetail = dealsData
    .filter(d => d.status === "Active")
    .map(d => ({ name: d.name, company: d.company, stage: d.stage, value: d.value, probability: d.probability, expectedClose: d.expectedClose }));

  // ── Agent summary ──────────────────────────────────────────────────────────
  const agents = AGENTS.map(a => ({
    name: a.name, role: a.role,
    leadsAssigned: leads.filter(l => l.assignedTo === a.name).length,
  }));

  // ── Analytics highlights ───────────────────────────────────────────────────
  const agentPerf = analyticsData?.agentPerformance ?? [];

  return {
    pipeline: { totalLeads, byStatus, activeDeals, closedDeals, totalRevenue, noContactLeads, hotLeads },
    leads,        // full lean list
    upcomingMeetings,
    openTasks,
    activeDealsDetail,
    agents,
    agentPerformance: agentPerf,
    reportSummary: {
      conversionRate: "24%",
      avgDealValue:   "₹1,285",
      topSource:      "Website (12 leads)",
    },
  };
}

// ─── Build system prompt with injected CRM data ───────────────────────────────
function buildSystemPrompt(crmContext) {
  return `You are an intelligent CRM assistant for CuriumCRM, helping a small sales team of 6 agents.
Today's date: ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIVE CRM DATA (use this to answer specific questions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(crmContext, null, 1)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAPABILITIES:
1. DATA QUESTIONS — answer using the CRM data above:
   • Lead status, count, details ("How many leads are qualified?", "What's Robert White's status?")
   • Pipeline health ("Which deals are active?", "Who hasn't been contacted?")
   • Agent performance ("Who has the most leads?", "How is Rohan Verma doing?")
   • Revenue ("What's our total revenue?", "Which closed deals brought the most?")
   • Calendar / tasks ("What meetings do we have this week?", "What tasks are overdue?")

2. GENERAL CRM HELP — answer from expertise:
   • Email drafting ("Write a follow-up email for a cold lead")
   • Sales advice ("How do I qualify a lead faster?", "Tips to close a deal")
   • Strategy ("How to revive a lost lead?")

RESPONSE RULES:
- Be concise and direct — this is a busy sales team
- For data questions, give specific names/numbers from the data, not vague answers
- For emails/drafts, write them fully and professionally  
- Use ₹ for Indian currency amounts
- If asked about something not in the data, say so honestly and offer general advice
- Format lists cleanly but keep responses short
- Never say "based on the data provided" — just answer naturally`;
}

// ─── Quick suggestions ────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Who hasn't been contacted yet?",
  "Summarize today's pipeline",
  "Which agent has the most leads?",
  "Draft a follow-up email",
  "What meetings are this week?",
  "Show hot leads",
];

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots({ darkMode }) {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="bot-avatar-sm">✧</div>
      <div className={`typing-bubble ${darkMode ? "bubble-bot-dark" : "bubble-bot-light"}`}>
        <span className="dot" style={{ animationDelay: "0ms" }} />
        <span className="dot" style={{ animationDelay: "150ms" }} />
        <span className="dot" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg, darkMode }) {
  const isUser  = msg.role === "user";
  const isError = msg.isError;

  return (
    <div className={`chat-row ${isUser ? "chat-row-user" : "chat-row-bot"}`}>
      {!isUser && <div className="bot-avatar-sm">✧</div>}
      {isUser  && <div className="user-avatar-sm">RK</div>}
      <div className={`
        chat-bubble
        ${isUser  ? "bubble-user" : ""}
        ${!isUser && !isError ? (darkMode ? "bubble-bot-dark" : "bubble-bot-light") : ""}
        ${isError ? "bubble-error" : ""}
      `}>
        <p className="bubble-text">{msg.content}</p>
        <p className={`bubble-time ${isUser ? "time-user" : (darkMode ? "time-bot-dark" : "time-bot-light")}`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   darkMode   — matches app theme
 *   onClose    — called when user clicks ✕
 *   crmData    — object with { mockData, analyticsData, calendarData, dealsData, tasksData, customersData, AGENTS }
 *               Pass your imported mock data here. Falls back to empty if not provided.
 *
 * Usage example:
 *   import { mockData, analyticsData, calendarData, dealsData, tasksData, customersData, AGENTS } from "./mockData";
 *   <CRMChatbot darkMode={darkMode} onClose={close} crmData={{ mockData, analyticsData, calendarData, dealsData, tasksData, customersData, AGENTS }} />
 */
export default function CRMChatbot({ darkMode = true, onClose, crmData = {} }) {
  // Build CRM context once on mount (or when crmData changes)
  const crmContext   = buildCRMContext(crmData);
  const systemPrompt = buildSystemPrompt(crmContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm your CRM assistant 👋\n\nI can see your live pipeline — ${crmContext.pipeline.totalLeads} leads, ₹${crmContext.pipeline.totalRevenue.toLocaleString("en-IN")} revenue, ${crmContext.pipeline.noContactLeads.length} leads with no contact yet.\n\nAsk me anything about your leads, deals, team, or tasks!`,
      time: fmt(new Date()),
    },
  ]);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);

  // ── Send ──────────────────────────────────────────────────────────────────
  async function send(text) {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;
    setInput("");

    const userMsg = { role: "user", content: userText, time: fmt(new Date()) };
    const history = [...messages, userMsg];
    setMessages(history);
    setIsLoading(true);

    const apiMsgs = history.map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: systemPrompt }, ...apiMsgs],
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `API Error ${res.status}`);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", time: fmt(new Date()) },
      ]);
      setIsLoading(false);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content || "";
            text += delta;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: text, time: fmt(new Date()) };
              return updated;
            });
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${err.message || "Something went wrong."}`, time: fmt(new Date()), isError: true },
      ]);
    }
  }

  function clearChat() {
    setMessages([{
      role: "assistant",
      content: `Chat cleared! I still have your CRM data ready — ${crmContext.pipeline.totalLeads} leads, ${crmContext.pipeline.activeDeals} active deals. How can I help?`,
      time: fmt(new Date()),
    }]);
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── Stats bar (mini KPI strip) ─────────────────────────────────────────────
  const kpis = [
    { label: "Leads",   value: crmContext.pipeline.totalLeads },
    { label: "Active",  value: crmContext.pipeline.activeDeals },
    { label: "Revenue", value: `₹${(crmContext.pipeline.totalRevenue / 1000).toFixed(0)}K` },
    { label: "No Contact", value: crmContext.pipeline.noContactLeads.length },
  ];

  return (
    <>
      <style>{`
        .chat-glass-dark {
          background: rgba(13, 13, 24, 0.88);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .chat-glass-light {
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(220,220,240,0.9);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          box-shadow: 0 32px 80px rgba(80,80,140,0.15), inset 0 1px 0 rgba(255,255,255,1);
        }
        .chat-header-dark  { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .chat-header-light { background: rgba(255,255,255,0.65); border-bottom: 1px solid rgba(0,0,0,0.06); }
        .chat-title-dark  { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.93); letter-spacing: -0.2px; }
        .chat-title-light { font-size: 13px; font-weight: 700; color: #13132a; letter-spacing: -0.2px; }
        .chat-status-dark  { font-size: 10px; color: rgba(255,255,255,0.32); }
        .chat-status-light { font-size: 10px; color: rgba(30,30,60,0.42); }
        .chat-hbtn {
          width: 26px; height: 26px; border-radius: 8px; border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; cursor: pointer; transition: background 0.2s;
        }
        .chat-hbtn-dark  { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45); }
        .chat-hbtn-dark:hover  { background: rgba(255,255,255,0.11); color: rgba(255,255,255,0.9); }
        .chat-hbtn-light { background: rgba(0,0,0,0.04); color: rgba(30,30,60,0.45); }
        .chat-hbtn-light:hover { background: rgba(0,0,0,0.09); color: #13132a; }

        /* ── KPI strip ── */
        .kpi-strip { display: flex; gap: 6px; padding: 8px 14px; flex-shrink: 0; }
        .kpi-card-dark  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 5px 9px; flex: 1; text-align: center; }
        .kpi-card-light { background: rgba(107,72,255,0.06); border: 1px solid rgba(107,72,255,0.14); border-radius: 8px; padding: 5px 9px; flex: 1; text-align: center; }
        .kpi-value-dark  { font-size: 13px; font-weight: 700; color: #c084fc; line-height: 1; }
        .kpi-value-light { font-size: 13px; font-weight: 700; color: #7c3aed; line-height: 1; }
        .kpi-label-dark  { font-size: 9px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .kpi-label-light { font-size: 9px; color: rgba(30,30,60,0.45); margin-top: 2px; }

        /* ── Messages ── */
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 12px 14px;
          display: flex; flex-direction: column;
          scrollbar-width: thin;
          scrollbar-color: rgba(192,132,252,0.25) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(192,132,252,0.3); border-radius: 99px; }

        /* ── Bubbles ── */
        .chat-row      { display: flex; align-items: flex-end; gap: 7px; margin-bottom: 9px; }
        .chat-row-user { flex-direction: row-reverse; }
        .chat-row-bot  { flex-direction: row; }
        .bot-avatar-sm {
          width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: white; font-weight: 700;
        }
        .user-avatar-sm {
          width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
          background: #3b82f6; color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 7.5px; font-weight: 800;
        }
        .chat-bubble { max-width: 80%; padding: 8px 11px; border-radius: 14px; font-size: 12px; line-height: 1.6; }
        .bubble-user      { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-bottom-right-radius: 3px; }
        .bubble-bot-dark  { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.87); border: 1px solid rgba(255,255,255,0.09); border-bottom-left-radius: 3px; }
        .bubble-bot-light { background: rgba(255,255,255,0.9); color: #13132a; border: 1px solid rgba(0,0,0,0.07); border-bottom-left-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .bubble-error     { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.22); border-bottom-left-radius: 3px; }
        .bubble-text { margin: 0; white-space: pre-wrap; }
        .bubble-time { font-size: 9px; margin-top: 3px; opacity: 0.5; }
        .time-user      { color: rgba(255,255,255,0.7); text-align: right; }
        .time-bot-dark  { color: rgba(255,255,255,0.3); }
        .time-bot-light { color: rgba(30,30,60,0.35); }

        /* Typing dots */
        .typing-bubble { padding: 9px 13px; border-radius: 14px; border-bottom-left-radius: 3px; display: flex; gap: 4px; align-items: center; }
        .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(192,132,252,0.7); animation: dotBounce 1.2s infinite ease-in-out; display: inline-block; }
        @keyframes dotBounce { 0%,80%,100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-4px); opacity: 1; } }

        /* ── Suggestions ── */
        .suggestions-wrap { padding: 0 12px 8px; display: flex; flex-wrap: wrap; gap: 4px; }
        .suggestion-btn { font-size: 10px; font-weight: 500; padding: 4px 9px; border-radius: 20px; cursor: pointer; transition: all 0.15s; border: none; white-space: nowrap; }
        .sugg-dark  { background: rgba(192,132,252,0.12); color: #c084fc; border: 1px solid rgba(192,132,252,0.24); }
        .sugg-light { background: rgba(107,72,255,0.07); color: #7c3aed; border: 1px solid rgba(107,72,255,0.18); }
        .sugg-dark:hover  { background: rgba(192,132,252,0.22); }
        .sugg-light:hover { background: rgba(107,72,255,0.13); }

        /* ── Input ── */
        .chat-input-wrap { padding: 10px 12px; flex-shrink: 0; }
        .chat-input-bar-dark  { border-top: 1px solid rgba(255,255,255,0.07); }
        .chat-input-bar-light { border-top: 1px solid rgba(0,0,0,0.06); }
        .chat-input-row { display: flex; align-items: flex-end; gap: 8px; padding: 7px 10px; border-radius: 12px; }
        .chat-input-row-dark  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); }
        .chat-input-row-light { background: rgba(255,255,255,0.85); border: 1px solid rgba(0,0,0,0.08); }
        .chat-textarea { flex: 1; background: transparent; border: none; outline: none; resize: none; font-size: 12px; line-height: 1.5; max-height: 72px; }
        .chat-textarea-dark  { color: rgba(255,255,255,0.88); }
        .chat-textarea-light { color: #13132a; }
        .chat-textarea::placeholder { color: rgba(128,128,128,0.45); }
        .chat-send-btn { width: 28px; height: 28px; border-radius: 9px; border: none; background: linear-gradient(135deg, #818cf8, #c084fc); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 12px; transition: opacity 0.2s, transform 0.1s; }
        .chat-send-btn:disabled { opacity: 0.3; cursor: default; }
        .chat-send-btn:not(:disabled):hover { opacity: 0.85; }
        .chat-send-btn:not(:disabled):active { transform: scale(0.91); }
        .chat-hint { text-align: center; font-size: 9px; margin-top: 5px; }
        .chat-hint-dark  { color: rgba(255,255,255,0.18); }
        .chat-hint-light { color: rgba(30,30,60,0.28); }

        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-entrance { animation: chatSlideUp 0.32s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>

      <div className={`
        chat-entrance flex flex-col
        ${darkMode ? "chat-glass-dark" : "chat-glass-light"}
        fixed bottom-6 right-6 z-[200]
        w-[370px] h-[580px]
        rounded-2xl overflow-hidden
        max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:bottom-0 max-sm:right-0
      `}>

        {/* ── Header ── */}
        <div className={`flex items-center justify-between px-4 py-3 flex-shrink-0 ${darkMode ? "chat-header-dark" : "chat-header-light"}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, background: "linear-gradient(135deg, #818cf8, #c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white", fontWeight: 700 }}>✧</div>
            <div>
              <p className={darkMode ? "chat-title-dark" : "chat-title-light"}>CRM Assistant</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                <span className={darkMode ? "chat-status-dark" : "chat-status-light"}>Live data · Groq AI</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <button className={`chat-hbtn ${darkMode ? "chat-hbtn-dark" : "chat-hbtn-light"}`} onClick={clearChat} title="Clear chat">🗑</button>
            <button className={`chat-hbtn ${darkMode ? "chat-hbtn-dark" : "chat-hbtn-light"}`} onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        {/* ── KPI strip ── */}
        <div className="kpi-strip">
          {kpis.map(k => (
            <div key={k.label} className={darkMode ? "kpi-card-dark" : "kpi-card-light"}>
              <div className={darkMode ? "kpi-value-dark" : "kpi-value-light"}>{k.value}</div>
              <div className={darkMode ? "kpi-label-dark" : "kpi-label-light"}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* ── Messages ── */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <Bubble key={i} msg={msg} darkMode={darkMode} />
          ))}
          {isLoading && <TypingDots darkMode={darkMode} />}
          <div ref={bottomRef} />
        </div>

        {/* ── Suggestions (shown initially) ── */}
        {messages.length <= 1 && (
          <div className="suggestions-wrap">
            {SUGGESTIONS.map((s) => (
              <button key={s} className={`suggestion-btn ${darkMode ? "sugg-dark" : "sugg-light"}`} onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <div className={`chat-input-wrap ${darkMode ? "chat-input-bar-dark" : "chat-input-bar-light"}`}>
          <div className={`chat-input-row ${darkMode ? "chat-input-row-dark" : "chat-input-row-light"}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about leads, deals, tasks…"
              rows={1}
              className={`chat-textarea ${darkMode ? "chat-textarea-dark" : "chat-textarea-light"}`}
            />
            <button className="chat-send-btn" onClick={() => send()} disabled={!input.trim() || isLoading}>➤</button>
          </div>
          <p className={`chat-hint ${darkMode ? "chat-hint-dark" : "chat-hint-light"}`}>Enter to send · Shift+Enter for newline</p>
        </div>
      </div>
    </>
  );
}
