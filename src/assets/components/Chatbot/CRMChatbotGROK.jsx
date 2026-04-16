import { useState, useRef, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = "llama3-8b-8192";

const SYSTEM_PROMPT = `You are a helpful CRM assistant for CuriumCRM. You help users with:
- Managing contacts and leads
- Tracking deals and sales pipeline  
- Scheduling follow-ups and tasks
- Analyzing customer data
- Writing emails and messages to clients
Keep responses concise and focused on CRM-related tasks.`;

// ─── Quick suggestions ────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Summarize today's follow-ups",
  "Draft a follow-up email",
  "How to qualify a lead?",
  "Tips to close a deal faster",
];

// ─── Time formatter ───────────────────────────────────────────────────────────
const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
      {/* Avatar */}
      {!isUser && <div className="bot-avatar-sm">✧</div>}
      {isUser  && <div className="user-avatar-sm">RK</div>}

      {/* Bubble */}
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

// ─── Main Chatbot — exported as EMBEDDED ONLY ─────────────────────────────────
/**
 * Props:
 *  darkMode  — matches app theme
 *  onClose   — called when user clicks ✕ (Topbar manages open/close state)
 *
 * Layout:
 *  Desktop  → fixed bottom-right glass panel (controlled by Topbar)
 *  Mobile   → full-screen overlay
 */
export default function CRMChatbot({ darkMode = true, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your CRM assistant 👋 Ask me anything about your contacts, deals, or pipeline.",
      time: fmt(new Date()),
    },
  ]);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  // Focus input on mount
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
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...apiMsgs],
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `API Error ${res.status}`);
      }

      // Add empty streaming placeholder
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
    setMessages([{ role: "assistant", content: "Chat cleared! How can I help you?", time: fmt(new Date()) }]);
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <style>{`
        /* ── GLASS PANEL ─────────────────────────────────────────────────── */
        .chat-glass-dark {
          background: rgba(18, 18, 30, 0.82);
          border: 1px solid rgba(255,255,255,0.11);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .chat-glass-light {
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.95);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          box-shadow:
            0 32px 80px rgba(100,100,150,0.18),
            inset 0 1px 0 rgba(255,255,255,1);
        }

        /* ── HEADER ──────────────────────────────────────────────────────── */
        .chat-header-dark  { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .chat-header-light { background: rgba(255,255,255,0.6);  border-bottom: 1px solid rgba(0,0,0,0.07); }

        .chat-title-dark  { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.92); }
        .chat-title-light { font-size: 13px; font-weight: 600; color: #1a1a2e; }

        .chat-status-dark  { font-size: 10px; color: rgba(255,255,255,0.35); }
        .chat-status-light { font-size: 10px; color: rgba(30,30,60,0.45); }

        .chat-hbtn {
          width: 26px; height: 26px; border-radius: 8px; border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; cursor: pointer; transition: background 0.2s;
        }
        .chat-hbtn-dark  { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); }
        .chat-hbtn-dark:hover  { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); }
        .chat-hbtn-light { background: rgba(0,0,0,0.05); color: rgba(30,30,60,0.5); }
        .chat-hbtn-light:hover { background: rgba(0,0,0,0.1); }

        /* ── MESSAGES AREA ───────────────────────────────────────────────── */
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px 14px;
          display: flex; flex-direction: column;
          scrollbar-width: thin;
          scrollbar-color: rgba(192,132,252,0.3) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(192,132,252,0.3); border-radius: 99px; }

        /* ── BUBBLES ─────────────────────────────────────────────────────── */
        .chat-row      { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 10px; }
        .chat-row-user { flex-direction: row-reverse; }
        .chat-row-bot  { flex-direction: row; }

        .bot-avatar-sm {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: white; font-weight: 700;
        }
        .user-avatar-sm {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          background: #3b82f6; color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 800;
        }

        .chat-bubble {
          max-width: 78%; padding: 9px 12px; border-radius: 16px;
          font-size: 12.5px; line-height: 1.55;
        }
        .bubble-user {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border-bottom-right-radius: 4px;
        }
        .bubble-bot-dark  {
          background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.88);
          border: 1px solid rgba(255,255,255,0.1); border-bottom-left-radius: 4px;
        }
        .bubble-bot-light {
          background: rgba(255,255,255,0.85); color: #1a1a2e;
          border: 1px solid rgba(0,0,0,0.08); border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .bubble-error {
          background: rgba(248,113,113,0.12); color: #f87171;
          border: 1px solid rgba(248,113,113,0.25); border-bottom-left-radius: 4px;
        }
        .bubble-text { margin: 0; white-space: pre-wrap; }
        .bubble-time { font-size: 9.5px; margin-top: 4px; opacity: 0.55; }
        .time-user      { color: rgba(255,255,255,0.7); text-align: right; }
        .time-bot-dark  { color: rgba(255,255,255,0.3); }
        .time-bot-light { color: rgba(30,30,60,0.4); }

        /* Typing dots */
        .typing-bubble {
          padding: 10px 14px; border-radius: 16px; border-bottom-left-radius: 4px;
          display: flex; gap: 4px; align-items: center;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(192,132,252,0.7);
          animation: dotBounce 1.2s infinite ease-in-out;
          display: inline-block;
        }
        @keyframes dotBounce {
          0%,80%,100% { transform: translateY(0); opacity: 0.4; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }

        /* ── SUGGESTIONS ─────────────────────────────────────────────────── */
        .suggestions-wrap { padding: 0 14px 10px; display: flex; flex-wrap: wrap; gap: 5px; }
        .suggestion-btn {
          font-size: 10.5px; font-weight: 500; padding: 4px 10px; border-radius: 20px;
          cursor: pointer; transition: all 0.15s; border: none;
          white-space: nowrap;
        }
        .sugg-dark  { background: rgba(192,132,252,0.15); color: #c084fc; border: 1px solid rgba(192,132,252,0.28); }
        .sugg-light { background: rgba(107,72,255,0.08);  color: #7c3aed; border: 1px solid rgba(107,72,255,0.2); }
        .sugg-dark:hover  { background: rgba(192,132,252,0.25); }
        .sugg-light:hover { background: rgba(107,72,255,0.15); }

        /* ── INPUT BAR ───────────────────────────────────────────────────── */
        .chat-input-wrap {
          padding: 10px 12px; flex-shrink: 0;
        }
        .chat-input-bar-dark  { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-top: 1px solid rgba(255,255,255,0.08); }
        .chat-input-bar-light { background: rgba(0,0,0,0.025); border-top: 1px solid rgba(0,0,0,0.07); }

        .chat-input-row {
          display: flex; align-items: flex-end; gap: 8px;
          padding: 8px 10px; border-radius: 14px;
        }
        .chat-input-row-dark  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .chat-input-row-light { background: rgba(255,255,255,0.8);  border: 1px solid rgba(0,0,0,0.09); }

        .chat-textarea {
          flex: 1; background: transparent; border: none; outline: none;
          resize: none; font-size: 12.5px; line-height: 1.5;
          max-height: 80px;
        }
        .chat-textarea-dark  { color: rgba(255,255,255,0.88); }
        .chat-textarea-light { color: #1a1a2e; }
        .chat-textarea::placeholder { color: rgba(128,128,128,0.5); }

        .chat-send-btn {
          width: 30px; height: 30px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; font-size: 13px;
          transition: opacity 0.2s, transform 0.1s;
        }
        .chat-send-btn:disabled { opacity: 0.35; cursor: default; }
        .chat-send-btn:not(:disabled):hover { opacity: 0.88; }
        .chat-send-btn:not(:disabled):active { transform: scale(0.92); }

        .chat-hint {
          text-align: center; font-size: 9.5px; margin-top: 5px;
        }
        .chat-hint-dark  { color: rgba(255,255,255,0.2); }
        .chat-hint-light { color: rgba(30,30,60,0.3); }

        /* ── ENTRANCE ANIMATION ──────────────────────────────────────────── */
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-entrance { animation: chatSlideUp 0.35s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>

      <div
        className={`
          chat-entrance
          flex flex-col
          ${darkMode ? "chat-glass-dark" : "chat-glass-light"}
          /* ── Desktop: fixed bottom-right panel ── */
          fixed bottom-6 right-6 z-[200]
          w-[360px] h-[560px]
          rounded-2xl overflow-hidden
          /* ── Mobile: full-screen overlay ── */
          max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:bottom-0 max-sm:right-0
        `}
      >
        {/* ── Header ── */}
        <div className={`flex items-center justify-between px-4 py-3 flex-shrink-0 ${darkMode ? "chat-header-dark" : "chat-header-light"}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Gradient bot icon */}
            <div style={{
              width: 30, height: 30, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, #818cf8, #c084fc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "white", fontWeight: 700,
            }}>✧</div>
            <div>
              <p className={darkMode ? "chat-title-dark" : "chat-title-light"}>CRM Assistant</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                {/* Green online dot */}
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                <span className={darkMode ? "chat-status-dark" : "chat-status-light"}>Online · Powered by Groq</span>
              </div>
            </div>
          </div>

          {/* Header actions */}
          <div style={{ display: "flex", gap: 6 }}>
            {/* Clear */}
            <button className={`chat-hbtn ${darkMode ? "chat-hbtn-dark" : "chat-hbtn-light"}`} onClick={clearChat} title="Clear chat">
              🗑
            </button>
            {/* Close — calls parent onClose */}
            <button className={`chat-hbtn ${darkMode ? "chat-hbtn-dark" : "chat-hbtn-light"}`} onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <Bubble key={i} msg={msg} darkMode={darkMode} />
          ))}
          {isLoading && <TypingDots darkMode={darkMode} />}
          <div ref={bottomRef} />
        </div>

        {/* ── Quick suggestions (shown only initially) ── */}
        {messages.length <= 1 && (
          <div className="suggestions-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className={`suggestion-btn ${darkMode ? "sugg-dark" : "sugg-light"}`}
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── Input bar ── */}
        <div className={`chat-input-wrap ${darkMode ? "chat-input-bar-dark" : "chat-input-bar-light"}`}>
          <div className={`chat-input-row ${darkMode ? "chat-input-row-dark" : "chat-input-row-light"}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your CRM…"
              rows={1}
              className={`chat-textarea ${darkMode ? "chat-textarea-dark" : "chat-textarea-light"}`}
            />
            <button
              className="chat-send-btn"
              onClick={() => send()}
              disabled={!input.trim() || isLoading}
            >
              ➤
            </button>
          </div>
          <p className={`chat-hint ${darkMode ? "chat-hint-dark" : "chat-hint-light"}`}>
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </div>
    </>
  );
}
