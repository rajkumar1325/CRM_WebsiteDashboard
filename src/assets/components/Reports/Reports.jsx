import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ⚠️ ADJUST THIS IMPORT PATH TO MATCH YOUR PROJECT STRUCTURE
import { mockData, analyticsData, reportsData, dealsData } from "../../MockData/MockData"; 

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
const PIE_COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#f472b6", "#fbbf24"];

// Upgraded to match the Tasks.jsx premium aesthetic
const PremiumCard = ({ children, className = "", darkMode = true, onClick }) => (
  <div
    onClick={onClick}
    className={`
      rounded-2xl border backdrop-blur-xl transition-all duration-300
      ${darkMode 
        ? "bg-[#151921] border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:border-white/[0.15] hover:bg-[#1A1F29] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-0.5" 
        : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300"}
      ${className}
    `}
  >
    {children}
  </div>
);

const StatChip = ({ value }) => {
  const positive = value >= 0;
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
        ${positive
          ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-300"
          : "bg-rose-500/20 text-rose-600 dark:text-rose-300"}
      `}
    >
      {positive ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  );
};

const MetricCard = ({ icon, label, value, change, accentColor, darkMode }) => (
  <PremiumCard darkMode={darkMode} className="p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className={`text-2xl ${accentColor}`}>{icon}</span>
      <StatChip value={change || 0} />
    </div>
    <div>
      <p className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
        {value}
      </p>
      <p className={`text-xs mt-1 uppercase tracking-widest ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </p>
    </div>
    <div className={`h-[2px] rounded-full bg-gradient-to-r from-transparent ${darkMode ? "via-white/10" : "via-slate-300"} to-transparent`} />
  </PremiumCard>
);

const GlassTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl border px-3 py-2 text-xs shadow-lg ${darkMode ? "bg-[#151921] border-white/10 text-white/80" : "bg-white/90 border-slate-200 text-slate-600"}`}>
      <p className={`font-semibold mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CRMReportsDashboard({ darkMode, isDark }) {
  const activeTheme = darkMode ?? isDark ?? true; 
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isAllActivityModalOpen, setIsAllActivityModalOpen] = useState(false);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);
  const [selectedDealDay, setSelectedDealDay] = useState(null);

  const weeklyDealsData = [
    { day: "Mon", won: 4, lost: 1 },
    { day: "Tue", won: 7, lost: 2 },
    { day: "Wed", won: 5, lost: 3 },
    { day: "Thu", won: 9, lost: 1 },
    { day: "Fri", won: 6, lost: 2 },
    { day: "Sat", won: 3, lost: 0 },
    { day: "Sun", won: 1, lost: 1 },
  ];

  // ─── SIMULATED API CALL ───
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const allActivities = mockData
        .flatMap(lead => lead.callHistory.map(call => ({
          id: `${lead.id}-${call.time}`,
          type: call.contactType.toLowerCase(),
          user: call.contactedBy,
          msg: call.feedback,
          client: lead.name,
          company: lead.company,
          timeStr: call.time,
          rating: call.rating,
          rawDate: new Date(call.time)
        })))
        .sort((a, b) => b.rawDate - a.rawDate);
      
      setData({
        summary: reportsData.summary,
        activeDeals: reportsData.dealStatus.find(d => d.name === "Active")?.value || 0,
        revenueTrend: analyticsData.monthlyRevenue,
        leadSources: analyticsData.leadSources,
        allActivities: allActivities,
        recentActivity: allActivities.slice(0, 5),
        weeklyDeals: weeklyDealsData,
        detailedDealsList: dealsData
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Theme-based classes (Aligned with Tasks UI)
  const textPrimary = activeTheme ? "text-white" : "text-slate-800";
  const textSecondary = activeTheme ? "text-slate-300" : "text-slate-600";
  const textMuted = activeTheme ? "text-slate-500" : "text-slate-400";
  const chartGridColor = activeTheme ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const chartTextColor = activeTheme ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";

  if (isLoading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${activeTheme ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-800"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className={textMuted}>Fetching Reports Data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div 
      className={`min-h-screen font-sans overflow-x-hidden ${activeTheme ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-800"}`}
      style={{ fontFamily: "'DM Sans', 'SF Pro Display', system-ui, sans-serif" }}
    >
      <div className="relative z-10 flex">
        <main className="flex-1 px-8 py-8 w-full max-w-7xl mx-auto">

          {/* ── KPI METRIC TILES ── */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard darkMode={activeTheme} icon="◈" label="Total Leads" value={data.summary.totalLeads} change={12} accentColor="text-sky-400" />
            <MetricCard darkMode={activeTheme} icon="◉" label="Total Customers" value={data.summary.totalCustomers} change={8} accentColor="text-violet-400" />
            <MetricCard darkMode={activeTheme} icon="↗" label="Deals Won" value={data.summary.dealsWon} change={15} accentColor="text-emerald-400" />
            <MetricCard darkMode={activeTheme} icon="↘" label="Deals Lost" value={data.summary.dealsLost} change={-4} accentColor="text-rose-400" />
          </section>

          {/* ── SECONDARY METRIC TILES ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PremiumCard darkMode={activeTheme} className="p-5 flex flex-col justify-center">
              <p className={`text-xs uppercase tracking-widest mb-1 ${textMuted}`}>Total Revenue</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                ${data.summary.totalRevenue.toLocaleString()}
              </p>
              <p className={`text-xs mt-2 ${textMuted}`}>↑ vs last quarter</p>
            </PremiumCard>

            <PremiumCard darkMode={activeTheme} className="p-5 flex flex-col justify-center">
              <p className={`text-xs uppercase tracking-widest mb-2 ${textMuted}`}>Conversion Rate</p>
              <div className="flex items-center gap-5">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="rotate-[-90deg]">
                    <circle cx="18" cy="18" r="15" fill="none" stroke={activeTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="url(#convGrad)" strokeWidth="3" strokeDasharray={`${data.summary.conversionRate * 0.942} ${100}`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-500">
                    {data.summary.conversionRate}%
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-500">{data.summary.conversionRate}%</p>
                  <p className={`text-xs ${textMuted}`}>Leads → Customers</p>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard darkMode={activeTheme} className="p-5 flex flex-col justify-between">
              <div>
                <p className={`text-xs uppercase tracking-widest ${textMuted}`}>Avg Deal Value</p>
                <p className="text-2xl font-bold text-violet-400 mt-1">${data.summary.avgDealValue.toLocaleString()}</p>
              </div>
              <div className={`h-px my-3 ${activeTheme ? "bg-white/5" : "bg-slate-200"}`} />
              <div>
                <p className={`text-xs uppercase tracking-widest ${textMuted}`}>Active Deals</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{data.activeDeals}</p>
              </div>
            </PremiumCard>
          </section>

          {/* ── CHARTS ROW ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <PremiumCard darkMode={activeTheme} className="p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-sm font-semibold ${textPrimary}`}>Revenue Trend</h2>
                  <p className={`text-xs ${textMuted}`}>Last 6 months</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg border ${activeTheme ? "text-slate-300 bg-white/5 border-white/10" : "text-slate-600 bg-slate-100 border-slate-200"}`}>
                  Monthly
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.revenueTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                  <Tooltip content={<GlassTooltip darkMode={activeTheme} />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#60a5fa" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#60a5fa" }} />
                </AreaChart>
              </ResponsiveContainer>
            </PremiumCard>

            <PremiumCard darkMode={activeTheme} className="p-5 lg:col-span-1">
              <h2 className={`text-sm font-semibold mb-1 ${textPrimary}`}>Lead Sources</h2>
              <p className={`text-xs mb-4 ${textMuted}`}>Distribution Breakdown</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={data.leadSources} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="count">
                    {data.leadSources.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} opacity={0.9} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<GlassTooltip darkMode={activeTheme} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1 mt-4">
                {data.leadSources.slice(0, 4).map((item, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs ${textMuted}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {item.source}
                    </div>
                    <span className={`font-medium ${textSecondary}`}>{item.count} leads</span>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </section>

          {/* ── BOTTOM ROW (INTERACTIVE) ── */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* INTERACTIVE WEEKLY DEALS CHART */}
            <PremiumCard darkMode={activeTheme} className="p-5 lg:col-span-3 cursor-pointer">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-sm font-semibold ${textPrimary} flex items-center gap-2`}>
                    Weekly Deal Activity <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">Interactive</span>
                  </h2>
                  <p className={`text-xs ${textMuted}`}>Won vs Lost (Click a bar for details)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart 
                  data={data.weeklyDeals} 
                  barGap={4} 
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  onClick={(state) => {
                    if (state && state.activePayload) {
                      setSelectedDealDay(state.activePayload[0].payload);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: chartTextColor }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: activeTheme ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}} content={<GlassTooltip darkMode={activeTheme} />} />
                  <Bar dataKey="won" name="Won" fill="#34d399" radius={[4,4,0,0]} opacity={0.9} />
                  <Bar dataKey="lost" name="Lost" fill="#f472b6" radius={[4,4,0,0]} opacity={0.9} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", color: chartTextColor, paddingTop: "8px" }} />
                </BarChart>
              </ResponsiveContainer>
            </PremiumCard>

            {/* INTERACTIVE RECENT ACTIVITY LIST */}
            <PremiumCard darkMode={activeTheme} className="p-5 lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h2 className={`text-sm font-semibold ${textPrimary}`}>Recent Activity</h2>
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">Interactive</span>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: 220 }}>
                {data.recentActivity.length > 0 ? data.recentActivity.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedActivityDetail(item)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors border border-transparent ${activeTheme ? "hover:bg-white/5 hover:border-white/10" : "hover:bg-slate-50 hover:border-slate-200"}`}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm shrink-0 shadow-sm ${activeTheme ? "bg-[#1A1F29] border-white/10" : "bg-white border-slate-200"}`}>
                      {item.type === "email" ? "✉️" : "📞"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${textSecondary}`}>
                        <span className="font-bold">{item.client}:</span> {item.msg}
                      </p>
                      <p className={`text-[10px] mt-1 ${textMuted}`}>
                        {item.user} · {new Date(item.timeStr).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className={`text-xs ${textMuted} text-center py-4`}>No recent activity found.</p>
                )}
              </div>
              <button 
                onClick={() => setIsAllActivityModalOpen(true)}
                className="mt-auto pt-4 text-xs text-blue-400 hover:text-blue-300 transition-colors text-left font-medium"
              >
                View all activity →
              </button>
            </PremiumCard>
            
          </section>
        </main>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 1: VIEW ALL ACTIVITIES
      ════════════════════════════════════════════════════════════════════════ */}
      {isAllActivityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <PremiumCard darkMode={activeTheme} className="w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative cursor-default">
            <div className={`p-6 flex items-center justify-between border-b ${activeTheme ? "border-white/10" : "border-slate-200"}`}>
              <div>
                <h2 className={`text-lg font-bold ${textPrimary}`}>All Activity Log</h2>
                <p className={`text-xs mt-1 ${textMuted}`}>Complete history of outreach and updates</p>
              </div>
              <button onClick={() => setIsAllActivityModalOpen(false)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${activeTheme ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-200 text-slate-500"}`}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {data.allActivities.map((item) => (
                <div key={item.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${activeTheme ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-white/60 hover:bg-slate-50"}`}>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg shrink-0 shadow-sm ${activeTheme ? "bg-[#1A1F29] border-white/10" : "bg-white border-slate-200"}`}>
                    {item.type === "email" ? "✉️" : "📞"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <p className={`text-sm font-bold truncate ${textPrimary}`}>{item.client}</p>
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border ${activeTheme ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${textSecondary}`}>{item.msg}</p>
                    <div className={`flex items-center justify-between text-xs pt-3 border-t ${activeTheme ? "border-white/5 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                      <span>Agent: <strong className={textPrimary}>{item.user}</strong></span>
                      <span>{new Date(item.timeStr).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 2: SPECIFIC ACTIVITY DETAILS
      ════════════════════════════════════════════════════════════════════════ */}
      {selectedActivityDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setSelectedActivityDetail(null)}>
          <PremiumCard darkMode={activeTheme} className="w-full max-w-md p-7 shadow-2xl relative cursor-default" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedActivityDetail(null)} className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTheme ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}>✕</button>
            
            <div className="flex items-center gap-4 mb-6 mt-2">
               <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl shadow-inner ${activeTheme ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                  {selectedActivityDetail.type === "email" ? "✉️" : "📞"}
               </div>
               <div>
                 <h3 className={`text-lg font-bold ${textPrimary}`}>{selectedActivityDetail.client}</h3>
                 <p className={`text-sm ${textMuted}`}>{selectedActivityDetail.company}</p>
               </div>
            </div>

            <div className={`p-5 rounded-xl mb-6 border ${activeTheme ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <p className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${textMuted}`}>Interaction Feedback</p>
              <p className={`text-base leading-relaxed ${textPrimary}`}>"{selectedActivityDetail.msg}"</p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${textMuted} mb-1.5`}>Contacted By</p>
                <p className={`text-sm font-semibold ${textPrimary}`}>{selectedActivityDetail.user}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${textMuted} mb-1.5`}>Date & Time</p>
                <p className={`text-sm font-semibold ${textPrimary}`}>{new Date(selectedActivityDetail.timeStr).toLocaleString()}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${textMuted} mb-1.5`}>Method</p>
                <p className={`text-sm font-semibold capitalize ${textPrimary}`}>{selectedActivityDetail.type}</p>
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${textMuted} mb-1.5`}>Lead Rating</p>
                <p className={`text-sm font-semibold ${textPrimary}`}>
                   {Array.from({length: selectedActivityDetail.rating || 3}).map(() => "⭐").join("")}
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 3: WEEKLY DEAL DETAILS
      ════════════════════════════════════════════════════════════════════════ */}
      {selectedDealDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setSelectedDealDay(null)}>
          <PremiumCard darkMode={activeTheme} className="w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl relative cursor-default" onClick={e => e.stopPropagation()}>
            <div className={`p-6 flex items-center justify-between border-b ${activeTheme ? "border-white/10" : "border-slate-200"}`}>
              <div>
                <h2 className={`text-lg font-bold flex items-center gap-3 ${textPrimary}`}>
                  Project & Deal Details 
                  <span className={`text-[11px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border ${activeTheme ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                    {selectedDealDay.day}
                  </span>
                </h2>
                <p className={`text-xs mt-1.5 ${textMuted}`}>Showing pipeline details for selected day</p>
              </div>
              <button onClick={() => setSelectedDealDay(null)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${activeTheme ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-200 text-slate-500"}`}>✕</button>
            </div>

            <div className="p-6 flex gap-4">
              <div className={`flex-1 rounded-xl p-4 border ${activeTheme ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${activeTheme ? 'text-emerald-400' : 'text-emerald-600'}`}>Won Deals</p>
                <p className={`text-3xl font-bold mt-1 ${activeTheme ? 'text-emerald-300' : 'text-emerald-700'}`}>{selectedDealDay.won}</p>
              </div>
              <div className={`flex-1 rounded-xl p-4 border ${activeTheme ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${activeTheme ? 'text-rose-400' : 'text-rose-600'}`}>Lost Deals</p>
                <p className={`text-3xl font-bold mt-1 ${activeTheme ? 'text-rose-300' : 'text-rose-700'}`}>{selectedDealDay.lost}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <h3 className={`text-xs uppercase tracking-widest font-bold mb-4 ${textMuted}`}>Associated Projects</h3>
              <div className="flex flex-col gap-3">
                {data.detailedDealsList.map((deal) => (
                  <div key={deal.id} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${activeTheme ? "bg-[#1A1F29] border-white/5 hover:border-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                    <div>
                      <p className={`font-bold text-sm ${textPrimary}`}>{deal.name}</p>
                      <p className={`text-xs mt-1 ${textMuted}`}>{deal.company} <span className="mx-1">•</span> Rep: {deal.assignedTo}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm mb-1 ${textPrimary}`}>{deal.value}</p>
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                        deal.status === 'Won' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        deal.status === 'Lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>
        </div>
      )}

    </div>
  );
}