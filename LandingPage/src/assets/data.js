// ─── data.js ──────────────────────────────────────────────────────────────────
// All static content arrays for the landing page.
// Edit copy here — never touch the section components for text changes.


// ─── Testimonials ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name:     "Raj Kumar",
    role:     "CTO, NovaBuild Technologies",
    initials: "Rk",
    hue:      200,
    text:     "Before CuriumCRM, our project managers were juggling 3 tools. Now the Client → Project → Task chain is one click. Delivery improved by 30%.",
    
    rating:   5,
// The loop runs 5 times. 
// i (0, 1, 2, 3, 4) is ALWAYS less than 5.
// Result: ★ ★ ★ ★ ★ (All Amber)

  },
  {
    name:     "Anushka Aggarwal",
    role:     "Operations Lead, PixelForge",
    initials: "AA",
    hue:      280,
    text:     "The automated deadline tracking is a game-changer. We used to chase status updates manually. Now the system flags overdue tasks before we even notice.",
    rating:   4,
  },
  {
    name:     "Jack Sparrow",
    role:     "Founder, GrowthStack India",
    initials: "JS",
    hue:      160,
    text:     "Role-based dashboards are exactly what we needed. My employees see only their tasks, my managers see their team, and I see everything. Perfect hierarchy.",
    rating:   2,

    // The loop runs 5 times.
// i=0 (0 < 2) -> Amber ★
// i=1 (1 < 2) -> Amber ★
// i=2 (2 < 2) -> FALSE -> Gray ★
// i=3 (3 < 2) -> FALSE -> Gray ★
// i=4 (4 < 2) -> FALSE -> Gray ★
// Result: ★ ★ ☆ ☆ ☆ (2 Amber, 3 Gray)
  },
  {
    name:     "Andrew Garfield",
    role:     "CEO, MetaServices US",
    initials: "AG",
    hue:      130,
    text:     "Text models are integrated into the workflow. My employees see only their tasks, my managers see their team, and I see everything. Perfect hierarchy.",
    rating:   3,
  },
];

// ─── FAQs ──────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: "How does the Client → Project → Task system work?",
    a: "Each client you onboard can have multiple projects. Each project contains tasks assigned to team members. Everything is linked — so if a client pauses, you can see all affected tasks in one click.",
  },
  {
    q: "What is 'Automated Task Status'?",
    a: "Our backend runs a scheduled job that automatically marks tasks as 'Overdue' when deadlines pass, without any manual input. You get real-time accuracy without chasing updates.",
  },
  {
    q: "Can different team members see different dashboards?",
    a: "Yes. Admins see org-wide metrics and manage users. Managers see their team's tasks and project health. Employees see only their own assignments and calendar.",
  },
  {
    q: "Is the Event Calendar shared across the team?",
    a: "Yes. Meetings added by managers are visible to relevant team members. Deadlines auto-populate from tasks, so the calendar always reflects real project data.",
  },
  {
    q: "Do I need a credit card for the free trial?",
    a: "No. Start with just your work email and company name. 14 days, full access, no card required.",
  },
];

// ─── Features (4 USPs) ─────────────────────────────────────────────────────────
// NOTE: Icon references are functions — they will be resolved at import time.
export const FEATURES = [
  {
    tag:      "Integrated Project Management",
    tagColor: "#22d3ee",
    title:    "Client → Project → Task. One system.",
    desc:     "Link every client to their projects, every project to its tasks. No more switching between your CRM and your PM tool — everything lives in one connected workspace.",
    points:   [
      "One-click drill-down from client to task",
      "Project health visible from client card",
      "Cross-project task dependencies",
    ],
    iconKey: "Link",
  },
  {
    tag:      "Role-Based Dashboards",
    tagColor: "#a78bfa",
    title:    "Every role sees exactly what they need.",
    desc:     "Admins oversee everything. Managers track their team. Employees focus on their tasks. RBAC-powered dashboards eliminate information overload at every level.",
    points:   [
      "Admin: org-wide metrics & user control",
      "Manager: team load, timelines & client health",
      "Employee: personal tasks & calendar only",
    ],
    iconKey: "Shield",
  },
  {
    tag:      "Automated Task Status",
    tagColor: "#f59e0b",
    title:    "Deadlines tracked automatically.",
    desc:     "A backend scheduler silently marks tasks overdue the moment their deadline passes. No manual updates. No stale data. Real-time accuracy, always.",
    points:   [
      "@Scheduled backend job runs every hour",
      "Tasks auto-flagged: Pending → Overdue",
      "Instant dashboard alerts for managers",
    ],
    iconKey: "Zap",
  },
  {
    tag:      "Event Calendar",
    tagColor: "#34d399",
    title:    "Meetings and deadlines in one view.",
    desc:     "A team-wide calendar that auto-populates task deadlines alongside meetings. No more missed standups or forgotten deliveries.",
    points:   [
      "Task deadlines auto-appear on calendar",
      "Managers schedule meetings for their team",
      "Week and month view with priority tags",
    ],
    iconKey: "Calendar",
  },
];

// ─── Pricing Plans ─────────────────────────────────────────────────────────────
export const PLANS = [
  {
    key:     "Starter",
    price:   "₹0",
    sub:     "For individual freelancers",
    accent:  "rgba(148,163,184,0.6)",
    border:  "rgba(148,163,184,0.15)",
    popular: false,
    cta:     "Get started",
    points:  [
      "1 client, 3 projects",
      "Basic task management",
      "Personal calendar",
      "Email support",
    ],
  },
  {
    key:     "Growth",
    price:   "₹999",
    sub:     "/ user / month",
    accent:  "#22d3ee",
    border:  "rgba(34,211,238,0.25)",
    popular: true,
    cta:     "Start 14-day trial",
    points:  [
      "Unlimited clients & projects",
      "Role-based dashboards (all 3)",
      "Automated task scheduler",
      "Event calendar & meetings",
      "Priority support",
    ],
  },
  {
    key:     "Scale",
    price:   "Custom",
    sub:     "For large orgs",
    accent:  "#a78bfa",
    border:  "rgba(167,139,250,0.25)",
    popular: false,
    cta:     "Contact sales",
    points:  [
      "All Growth features",
      "Custom roles & permissions",
      "Audit logs & SSO",
      "Dedicated success manager",
      "SLA guarantee",
    ],
  },
];

// ─── Workflow Steps ─────────────────────────────────────────────────────────────
export const WORKFLOW_STEPS = [
  { emoji: "👤", label: "Client",     sub: "Onboarded",   color: "#22d3ee" },
  { emoji: "📁", label: "Project",    sub: "Created",     color: "#818cf8" },
  { emoji: "✅", label: "Tasks",      sub: "Assigned",    color: "#a78bfa" },
  { emoji: "🤖", label: "Scheduler", sub: "Auto-tracks", color: "#f59e0b" },
  { emoji: "📆", label: "Calendar",  sub: "Synced",      color: "#34d399" },
  { emoji: "📊", label: "Dashboard", sub: "Live view",   color: "#f472b6" },
];

// ─── Workflow Highlights (3 cards below the step chain) ────────────────────────
export const WORKFLOW_HIGHLIGHTS = [
  { label: "Research Gap Addressed", val: "CRM + PM in one",       icon: "🔗", color: "#22d3ee" },
  { label: "Backend Tech",           val: "@Scheduled auto-updater", icon: "⚡", color: "#f59e0b" },
  { label: "Access Control",         val: "Role-based permissions", icon: "🛡️", color: "#a78bfa" },
];

// ─── Nav links ─────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: "#features",      label: "Features"   },
  { href: "#workflow",      label: "Workflow"    },
  { href: "#pricing",       label: "Pricing"     },
  { href: "#testimonials",  label: "Customers"   },
  { href: "#faq",           label: "FAQ"         },
];
