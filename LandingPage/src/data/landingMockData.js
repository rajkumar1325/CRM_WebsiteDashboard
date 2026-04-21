// LANDING PAGE DATA , SOTRED HERE FOR EASY MAINTENANCE AND REFERENCE

/**
 * ROLE_MAP
 *
 * Source of truth: Table 1 (User Role Analysis) in the project report.
 *
 * Three roles exist in the system:
 *   Admin  (roleId 1) — Managing user accounts/permissions, adding employees
 *                        or leaders, editing client/role/project information.
 *                        Full access to all system functionalities.
 *
 *   Leader (roleId 2) — Creating and managing projects, assigning tasks to
 *   (Project Manager)   team members, monitoring project progress and client
 *                        performance. Access to project management tools and
 *                        ability to view project-specific data.
 *
 *   Member (roleId 3) — Updating work progress by updating task status,
 *   (Employee)          viewing assigned tasks. Access to personal task
 *                        dashboard and their own profile page.
 *
 * SECURITY — PUBLIC LANDING PAGE:
 *   Only "Admin" (roleId = 1) is registered from the public landing page.
 *   The Admin is the company/workspace owner who sets up the organisation.
 *
 *   Leader and Member accounts are created INTERNALLY by the Admin from
 *   the dashboard using the Admin-only endpoint:
 *     POST /api/v1/users/role/{roleId}   (Admin only, JWT required)
 *
 *   The public registration endpoint:
 *     POST /api/v1/auth/register/{roleId}
 *   is backend-restricted to roleId = 1. Sending roleId 2 or 3 from
 *   a public form would be rejected by Spring Security.
 *
 * Keys map to backend roleId path params.
 */
export const ROLE_MAP = {
  admin: {
    id: 1,
    label: "Admin",
    tip: "Full access: users, billing, settings. You manage the workspace.",
  },
  // leader: { id: 2, label: "Leader", tip: "..." }  ← Dashboard only (Admin creates)
  // member: { id: 3, label: "Member", tip: "..." }  ← Dashboard only (Admin creates)
};

/** Password strength level definitions (score 1–4) */
export const PWD_LEVELS = [
  { label: "Weak",   color: "bg-red-500",     min: 1 },
  { label: "Fair",   color: "bg-yellow-400",  min: 2 },
  { label: "Good",   color: "bg-blue-400",    min: 3 },
  { label: "Strong", color: "bg-emerald-400", min: 4 },
];

export const TESTIMONIALS = [
  {
    name: "Tony Stark",
    role: "Sales Lead, Stark Tower",
    text: "We moved from messy sheets to this CRM in a week. Our team finally has one clean view of every lead.",
    initials: "TS",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Elizabeth Olsen",
    role: "Founder, GrowthStack",
    text: "The dashboards are simple but powerful. The team loves the clarity on daily tasks and pipeline health.",
    initials: "EO",
    color: "from-purple-400 to-indigo-500",
  },
  {
    name: "Andrew Garfield",
    role: "Head of Customer Success, TrioSoft",
    text: "Follow-ups and renewals are now automated. Churn dropped and upsells increased in just two months.",
    initials: "AG",
    color: "from-emerald-400 to-cyan-500",
  },
];

export const FAQS = [
  {
    q: "Is this CRM good for small teams?",
    a: "Yes. Start with 2–3 users and scale as your team grows. Pricing is per seat, no hidden charges.",
  },
  {
    q: "Do I need a credit card for the free trial?",
    a: "No. Start a 14-day free trial with just your email and company name.",
  },
  {
    q: "Can I import my existing leads?",
    a: "Yes. Import from CSV or Excel in a few clicks. Our wizard maps all fields correctly.",
  },
  {
    q: "Is there support available?",
    a: "Email and chat support for all paid plans, plus dedicated onboarding for teams of 10+.",
  },
  {
    q: "How does role-based access work?",
    a: "Admins manage all users, billing, and workspace settings. Leaders (Project Managers) create projects, assign tasks, and monitor team performance. Members (Employees) view and update their assigned tasks only. Admins create Leader and Member accounts from inside the dashboard.",
  },
];

export const PLANS = [
  {
    id: "Starter",
    price: "$0",
    sub: "/ user / mo",
    desc: "For solo founders and very small teams.",
    cta: "Get started",
    accent: "cyan",
    features: [
      "Up to 100 active leads",
      "1 pipeline",
      "Basic task management",
      "Email support",
    ],
  },
  {
    id: "Growth",
    price: "$19",
    sub: "/ user / mo",
    desc: "For growing SaaS teams.",
    cta: "Start 14-day trial",
    accent: "indigo",
    popular: true,
    features: [
      "Unlimited leads & pipelines",
      "Tasks, reminders, automations",
      "Dashboards & reports",
      "Priority support",
    ],
  },
  {
    id: "Scale",
    price: "Let's talk",
    sub: "",
    desc: "For large teams needing governance.",
    cta: "Contact sales",
    accent: "purple",
    features: [
      "Roles & permissions (RBAC)",
      "Custom workflows",
      "Dedicated success manager",
      "SSO & audit logs",
    ],
  },
];
