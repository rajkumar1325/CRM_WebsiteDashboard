import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Package, Check, Zap, Shield, Users, Star, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role?.toUpperCase() || null;
  } catch { return null; }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPANDED MOCK DATA — har product ka full detail
// Backend: GET /api/products → @PreAuthorize("isAuthenticated()")
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "CRM Pro Subscription",
    category: "CRM",
    price: 12000,
    annualPrice: 115200,
    status: "Active",
    description: "Full CRM suite with leads, deals, projects and analytics.",
    overview: "CURIEM CRM Pro is an all-in-one customer relationship management platform built for modern IT service companies. It centralizes your leads, deals, projects, tasks, and team communication into a single dashboard — eliminating the need for multiple disconnected tools.",
    problemSolved: "Most SMEs struggle with fragmented tools — using Excel for tasks, WhatsApp for communication, and separate apps for CRM. CURIEM solves this by providing one unified platform with real-time analytics and role-based access.",
    features: [
      { icon: "🎯", title: "Lead Management", desc: "Track and convert leads with pipeline view and status tracking" },
      { icon: "🤝", title: "Deal Tracking", desc: "Manage deals from prospecting to closed won with probability scoring" },
      { icon: "📁", title: "Project Management", desc: "Create projects, assign tasks, track progress and deadlines" },
      { icon: "📊", title: "Analytics Dashboard", desc: "Real-time KPIs, sales charts, and performance metrics" },
      { icon: "👥", title: "Team Collaboration", desc: "Role-based access for Admin, Employee and Customer" },
      { icon: "🔔", title: "Notifications", desc: "Real-time alerts for tasks, deadlines and deal updates" },
      { icon: "🔐", title: "JWT Security", desc: "Spring Security with JWT authentication and RBAC" },
      { icon: "☁️", title: "Cloud Storage", desc: "AWS S3 integration for file and image uploads" },
    ],
    techStack: ["React.js", "Spring Boot", "MySQL", "JWT", "AWS S3", "Tailwind CSS"],
    integrations: ["AWS S3", "Gmail SMTP", "Google Calendar", "Slack (coming soon)"],
    bestFor: ["IT Service Companies", "SMEs", "Startups", "Consulting Firms"],
    support: "Priority Email + Chat",
    sla: "99.9% uptime",
    gettingStarted: [
      "Sign up and create your workspace",
      "Invite your team members with role assignment",
      "Import or add your existing leads and customers",
      "Create your first deal and link it to a project",
      "Track progress from the analytics dashboard",
    ],
    faqs: [
      { q: "Can I import existing data?", a: "Yes, CSV import is supported for leads, customers and deals." },
      { q: "How many users can I add?", a: "Up to 20 users on the Growth plan. Unlimited on Scale." },
      { q: "Is my data secure?", a: "All passwords are BCrypt encrypted. JWT tokens expire automatically. Data stored on secure MySQL servers." },
      { q: "Can customers access the portal?", a: "Yes, customers get a limited view to track their projects and raise support tickets." },
    ],
    testimonials: [
      { name: "Kabir Nayak", company: "Workcation", text: "CURIEM replaced 4 different tools for us. Our team efficiency improved by 40%.", rating: 5 },
      { name: "Emma Wilson", company: "GreenLeaf", text: "The project tracking feature is exactly what we needed. Clean UI and fast.", rating: 5 },
    ],
    plans: [
      { name: "Starter", price: 0,     seats: "Up to 5",    highlight: false, features: ["Leads & Contacts", "Basic Dashboard", "Task Management", "Email Support"] },
      { name: "Growth",  price: 12000, seats: "Up to 20",   highlight: true,  features: ["Everything in Starter", "Advanced Analytics", "Priority Support", "API Access", "Custom Roles"] },
      { name: "Scale",   price: 29999, seats: "Unlimited",  highlight: false, features: ["Everything in Growth", "Full Audit Logs", "SSO Security", "Dedicated Manager", "White-labeling"] },
    ],
  },
  {
    id: 2,
    name: "Analytics Suite",
    category: "Analytics",
    price: 4500,
    annualPrice: 43200,
    status: "Active",
    description: "Real-time dashboards, KPI tracking and custom reports.",
    overview: "Analytics Suite provides deep insights into your business performance with real-time dashboards, custom KPI tracking, and automated reporting. Built on top of CURIEM's data layer, it visualizes your leads, deals, revenue and team performance in one place.",
    problemSolved: "Managers waste hours compiling reports manually from multiple sources. Analytics Suite automates this — giving you live charts and exportable reports with zero manual effort.",
    features: [
      { icon: "📈", title: "Real-time Charts", desc: "Live sales trends, lead conversion and revenue charts" },
      { icon: "🎯", title: "KPI Tracking", desc: "Set and monitor custom KPIs for your team and projects" },
      { icon: "📋", title: "Custom Reports", desc: "Build and export reports in PDF and CSV formats" },
      { icon: "🔍", title: "Drill-down Analysis", desc: "Click into any metric to see granular data" },
      { icon: "📅", title: "Scheduled Reports", desc: "Auto-send weekly/monthly reports to stakeholders" },
      { icon: "🌐", title: "Multi-source Data", desc: "Aggregate data from leads, deals, projects and support" },
    ],
    techStack: ["React.js", "Recharts", "Spring Boot", "MySQL", "JPA"],
    integrations: ["CURIEM CRM", "Gmail SMTP", "Google Sheets (coming soon)"],
    bestFor: ["Sales Managers", "Business Analysts", "C-level Executives", "Project Managers"],
    support: "Email Support",
    sla: "99.5% uptime",
    gettingStarted: [
      "Connect Analytics Suite to your CURIEM workspace",
      "Select the KPIs you want to track",
      "Customize your dashboard layout",
      "Set up automated report schedules",
      "Share dashboards with your team",
    ],
    faqs: [
      { q: "Can I create custom dashboards?", a: "Yes, drag-and-drop dashboard builder is included." },
      { q: "How far back does data go?", a: "Historical data from the day you started using CURIEM is available." },
      { q: "Can I export reports?", a: "Yes, PDF and CSV export is supported on all plans." },
    ],
    testimonials: [
      { name: "Priya Sharma", company: "Sharma Designs", text: "Finally I can see all my business metrics in one place. Saves me 2 hours every week.", rating: 5 },
    ],
    plans: [
      { name: "Basic",      price: 0,    seats: "1 user",    highlight: false, features: ["3 default dashboards", "CSV export", "30-day history"] },
      { name: "Analytics",  price: 4500, seats: "Up to 10",  highlight: true,  features: ["Unlimited dashboards", "PDF + CSV export", "Full history", "Scheduled reports"] },
      { name: "Enterprise", price: 9999, seats: "Unlimited", highlight: false, features: ["Everything in Analytics", "White-label reports", "API access", "Dedicated support"] },
    ],
  },
  {
    id: 3,
    name: "Cloud Storage",
    category: "Cloud",
    price: 2800,
    annualPrice: 26880,
    status: "Active",
    description: "Scalable AWS S3 based storage with CDN delivery.",
    overview: "Cloud Storage provides secure, scalable file and image storage powered by AWS S3 with global CDN delivery. Store profile photos, project documents, client files and reports — all accessible instantly from anywhere.",
    problemSolved: "Local file storage is unreliable and hard to share. Cloud Storage gives your team a centralized, secure place to store all CRM-related files with instant CDN delivery.",
    features: [
      { icon: "☁️", title: "AWS S3 Backend", desc: "Enterprise-grade storage with 99.999999999% durability" },
      { icon: "🚀", title: "CDN Delivery", desc: "Files served from nearest edge node for fast loading" },
      { icon: "🔐", title: "Access Control", desc: "Role-based file access — admins control who sees what" },
      { icon: "📁", title: "File Management", desc: "Upload, organize and delete files with a clean UI" },
      { icon: "🖼️", title: "Image Optimization", desc: "Auto-compress and resize images on upload" },
      { icon: "🔗", title: "Shareable Links", desc: "Generate secure time-limited links for clients" },
    ],
    techStack: ["AWS S3", "CloudFront CDN", "Spring Boot", "React.js"],
    integrations: ["CURIEM CRM", "AWS CloudFront", "Gmail (file attachments)"],
    bestFor: ["Teams sharing files", "Client-facing businesses", "Media-heavy projects"],
    support: "Email Support",
    sla: "99.9% uptime",
    gettingStarted: [
      "Configure your AWS S3 bucket in Settings → Integrations",
      "Set access permissions for your team roles",
      "Upload files from any CURIEM module",
      "Share secure links with clients directly",
    ],
    faqs: [
      { q: "What file types are supported?", a: "JPG, PNG, WEBP, PDF, DOCX, XLSX and more. Max 5MB per file." },
      { q: "Is my data encrypted?", a: "Yes, all files are encrypted at rest using AES-256 and in transit using HTTPS." },
      { q: "Can I use my own S3 bucket?", a: "Yes, you can configure your own AWS credentials in Settings → Integrations." },
    ],
    testimonials: [
      { name: "Lucas Martínez", company: "TechNova Ltd.", text: "We store all client deliverables here. Fast, reliable and secure.", rating: 4 },
    ],
    plans: [
      { name: "Free",       price: 0,    seats: "5GB",    highlight: false, features: ["5GB storage", "Basic CDN", "JPG/PNG only"] },
      { name: "Cloud",      price: 2800, seats: "100GB",  highlight: true,  features: ["100GB storage", "Full CDN", "All file types", "Shareable links"] },
      { name: "Enterprise", price: 7999, seats: "1TB+",   highlight: false, features: ["1TB+ storage", "Priority CDN", "Custom domain", "Dedicated support"] },
    ],
  },
  {
    id: 4,
    name: "Finance Manager",
    category: "Finance",
    price: 3150,
    annualPrice: 30240,
    status: "Active",
    description: "Invoice, billing and revenue tracking module.",
    overview: "Finance Manager gives you complete control over your business finances — from generating invoices to tracking payments and monitoring revenue trends. Integrated directly with your CRM deals and projects.",
    problemSolved: "Most small businesses track finances in spreadsheets. Finance Manager automates invoice generation, payment tracking and revenue reporting — saving hours of manual work.",
    features: [
      { icon: "🧾", title: "Invoice Generation", desc: "Auto-generate professional invoices from closed deals" },
      { icon: "💰", title: "Payment Tracking", desc: "Track paid, pending and overdue payments in real-time" },
      { icon: "📊", title: "Revenue Analytics", desc: "Monthly/quarterly revenue charts and forecasts" },
      { icon: "🔗", title: "Deal Integration", desc: "Invoices auto-link to CRM deals and customers" },
      { icon: "📧", title: "Payment Reminders", desc: "Auto-send payment reminders via email" },
      { icon: "📑", title: "Tax Reports", desc: "Generate GST-ready financial reports" },
    ],
    techStack: ["React.js", "Spring Boot", "MySQL", "Gmail SMTP", "PDF generation"],
    integrations: ["CURIEM CRM", "Gmail SMTP", "GST Portal (coming soon)"],
    bestFor: ["Freelancers", "Small Businesses", "IT Service Firms", "Consultants"],
    support: "Email + Chat Support",
    sla: "99.5% uptime",
    gettingStarted: [
      "Link Finance Manager to your CURIEM deals",
      "Configure your company billing details",
      "Generate your first invoice from a closed deal",
      "Set up automated payment reminder schedules",
      "View revenue analytics in your dashboard",
    ],
    faqs: [
      { q: "Can I customize invoices?", a: "Yes, add your logo, company details and custom line items." },
      { q: "Is GST supported?", a: "Yes, GST calculation and GST-ready reports are included." },
      { q: "Can customers pay online?", a: "Payment gateway integration (Razorpay) is coming in the next release." },
    ],
    testimonials: [
      { name: "Mona Das", company: "Neon Industries", text: "Invoice generation used to take me an hour. Now it's one click.", rating: 5 },
    ],
    plans: [
      { name: "Basic",    price: 0,    seats: "5 invoices/mo", highlight: false, features: ["5 invoices/month", "Basic reports", "PDF export"] },
      { name: "Finance",  price: 3150, seats: "Unlimited",     highlight: true,  features: ["Unlimited invoices", "Payment tracking", "Revenue analytics", "Auto reminders"] },
      { name: "Pro",      price: 6999, seats: "Unlimited",     highlight: false, features: ["Everything in Finance", "GST reports", "Multi-currency", "Priority support"] },
    ],
  },
  {
    id: 5,
    name: "Project Tracker",
    category: "Project",
    price: 1950,
    annualPrice: 18720,
    status: "Active",
    description: "End-to-end project and task management with timeline view.",
    overview: "Project Tracker gives your team a clear view of every project — from creation to delivery. Assign tasks, set deadlines, track progress and keep clients updated — all in one place.",
    problemSolved: "Teams lose track of project status when using email and chat for updates. Project Tracker centralizes all project communication, tasks and milestones with automated status updates.",
    features: [
      { icon: "📁", title: "Project Boards", desc: "Visual project cards with status, progress and team info" },
      { icon: "✅", title: "Task Assignment", desc: "Assign tasks to team members with deadlines and priorities" },
      { icon: "📅", title: "Timeline View", desc: "Gantt-style timeline for project milestones" },
      { icon: "🤖", title: "Auto Status Updates", desc: "Spring @Scheduled auto-updates task and project status" },
      { icon: "👤", title: "Client Portal", desc: "Customers can view their project progress in real-time" },
      { icon: "📊", title: "Progress Analytics", desc: "Task completion rates and team performance metrics" },
    ],
    techStack: ["React.js", "Spring Boot", "MySQL", "Spring @Scheduled", "JWT"],
    integrations: ["CURIEM CRM", "Google Calendar (coming soon)", "Slack (coming soon)"],
    bestFor: ["Project Managers", "Development Teams", "Client-facing Agencies", "IT Firms"],
    support: "Email Support",
    sla: "99.5% uptime",
    gettingStarted: [
      "Create a project and link it to a CRM client",
      "Add tasks and assign to team members",
      "Set start and end dates for each task",
      "Share project view link with your client",
      "Track progress from the analytics dashboard",
    ],
    faqs: [
      { q: "Can clients see project progress?", a: "Yes, customers get a read-only view of their assigned projects." },
      { q: "Does it send deadline reminders?", a: "Yes, automated email reminders are sent 24 hours before task deadlines." },
      { q: "Can I have multiple projects per client?", a: "Yes, one client can have unlimited projects linked." },
    ],
    testimonials: [
      { name: "John Doe", company: "Acme Corp", text: "Our clients love being able to track their project status themselves. Reduced support calls by 60%.", rating: 5 },
    ],
    plans: [
      { name: "Free",     price: 0,    seats: "3 projects",  highlight: false, features: ["3 active projects", "5 team members", "Basic tracking"] },
      { name: "Tracker",  price: 1950, seats: "Unlimited",   highlight: true,  features: ["Unlimited projects", "Client portal", "Auto status updates", "Analytics"] },
      { name: "Pro",      price: 4999, seats: "Unlimited",   highlight: false, features: ["Everything in Tracker", "Gantt charts", "Resource planning", "Priority support"] },
    ],
  },
  {
    id: 6,
    name: "ChatBot Pro",
    category: "AI",
    price: 1800,
    annualPrice: 17280,
    status: "Active",
    description: "AI-powered chatbot for website lead capture and support.",
    overview: "ChatBot Pro is an intelligent conversational AI that lives on your website — capturing leads, answering FAQs and routing support tickets automatically. Integrates directly with CURIEM CRM to push captured leads into your pipeline.",
    problemSolved: "Businesses miss leads when their team is offline. ChatBot Pro works 24/7 — engaging visitors, capturing contact info and creating CRM leads automatically — even at 3AM.",
    features: [
      { icon: "🤖", title: "AI Conversations", desc: "Natural language responses powered by LLM integration" },
      { icon: "🎯", title: "Lead Capture", desc: "Auto-creates CRM leads from chat conversations" },
      { icon: "💬", title: "FAQ Automation", desc: "Answer common questions without human intervention" },
      { icon: "🎫", title: "Ticket Creation", desc: "Auto-creates support tickets from unresolved queries" },
      { icon: "🌐", title: "Website Embed", desc: "One-line script to embed on any website" },
      { icon: "📊", title: "Chat Analytics", desc: "Track conversations, leads captured and resolution rate" },
    ],
    techStack: ["React.js", "Spring Boot", "OpenAI API", "WebSocket", "MySQL"],
    integrations: ["CURIEM CRM", "Website embed", "Gmail", "OpenAI (coming soon)"],
    bestFor: ["SaaS Companies", "E-commerce", "Service Businesses", "Educational Institutes"],
    support: "Chat + Email Support",
    sla: "99.9% uptime",
    gettingStarted: [
      "Configure your ChatBot responses and FAQs",
      "Copy the embed script to your website",
      "Test the chatbot flow end-to-end",
      "Connect to CURIEM CRM for lead auto-creation",
      "Monitor conversations from your dashboard",
    ],
    faqs: [
      { q: "Does it work on mobile?", a: "Yes, the chat widget is fully responsive on all devices." },
      { q: "Can I customize the bot's responses?", a: "Yes, you can define custom responses, FAQs and conversation flows." },
      { q: "How are leads created?", a: "When a visitor provides their email in chat, a lead is automatically created in CURIEM CRM." },
    ],
    testimonials: [
      { name: "Chloe Bennett", company: "Prime Solutions", text: "We capture 15-20 leads every night while we sleep. Game changer.", rating: 5 },
    ],
    plans: [
      { name: "Free",   price: 0,    seats: "100 chats/mo", highlight: false, features: ["100 chats/month", "Basic FAQ", "Manual lead creation"] },
      { name: "ChatBot",price: 1800, seats: "Unlimited",    highlight: true,  features: ["Unlimited chats", "Auto lead capture", "Ticket creation", "Analytics"] },
      { name: "AI Pro", price: 4500, seats: "Unlimited",    highlight: false, features: ["Everything in ChatBot", "LLM-powered responses", "Multi-language", "Priority support"] },
    ],
  },
  {
    id: 7,
    name: "Security Suite",
    category: "Security",
    price: 4800,
    annualPrice: 46080,
    status: "Active",
    description: "Penetration testing, audit logs and hardening toolkit.",
    overview: "Security Suite provides enterprise-grade security for your CURIEM workspace — including audit logs, penetration testing reports, JWT token management, and security hardening recommendations.",
    problemSolved: "Most SMEs don't have dedicated security teams. Security Suite automates security monitoring, logs all user actions and alerts you to suspicious activity — keeping your CRM data safe.",
    features: [
      { icon: "🔐", title: "Audit Logs", desc: "Complete trail of all user actions with timestamp and IP" },
      { icon: "🛡️", title: "JWT Management", desc: "Token invalidation, rotation and session control" },
      { icon: "🔍", title: "Penetration Testing", desc: "Automated vulnerability scanning and reports" },
      { icon: "⚠️", title: "Security Alerts", desc: "Real-time alerts for suspicious login attempts" },
      { icon: "🔒", title: "Password Policies", desc: "Enforce strong passwords and OTP-based recovery" },
      { icon: "📋", title: "Compliance Reports", desc: "Security compliance reports for audits" },
    ],
    techStack: ["Spring Security", "JWT", "BCrypt", "MySQL", "Spring Boot"],
    integrations: ["CURIEM CRM", "Gmail (security alerts)", "SIEM tools (coming soon)"],
    bestFor: ["Enterprise Companies", "Financial Services", "Healthcare", "Government Projects"],
    support: "Priority Support + Dedicated Manager",
    sla: "99.99% uptime",
    gettingStarted: [
      "Enable Security Suite from Settings → Integrations",
      "Review your current security posture report",
      "Configure alert thresholds for suspicious activity",
      "Set up OTP-based password recovery",
      "Schedule weekly security reports",
    ],
    faqs: [
      { q: "What does the audit log capture?", a: "All login/logout events, data changes, role modifications and API calls." },
      { q: "Is BCrypt used for passwords?", a: "Yes, all passwords are hashed with BCrypt before MySQL storage." },
      { q: "Can I revoke a user's session?", a: "Yes, admins can invalidate any active JWT token from the Security dashboard." },
    ],
    testimonials: [
      { name: "Harshit Singh", company: "Data Systems", text: "The audit logs helped us identify a data breach attempt within minutes.", rating: 5 },
    ],
    plans: [
      { name: "Basic",    price: 0,    seats: "Basic logs",  highlight: false, features: ["Login/logout logs", "BCrypt passwords", "Basic alerts"] },
      { name: "Security", price: 4800, seats: "Full suite",  highlight: true,  features: ["Full audit logs", "JWT management", "Security alerts", "Compliance reports"] },
      { name: "Enterprise",price:11999,seats: "Unlimited",   highlight: false, features: ["Everything in Security", "Pen testing", "Dedicated manager", "SLA 99.99%"] },
    ],
  },
  {
    id: 8,
    name: "HR Management System",
    category: "HR",
    price: 3500,
    annualPrice: 33600,
    status: "Active",
    description: "Employee onboarding, attendance and payroll management.",
    overview: "HR Management System integrates with CURIEM to manage your entire employee lifecycle — from onboarding and attendance tracking to payroll processing and performance reviews.",
    problemSolved: "HR teams waste time on manual attendance sheets and Excel payrolls. HR Management automates all of this — saving 10+ hours per month and reducing payroll errors.",
    features: [
      { icon: "👤", title: "Employee Onboarding", desc: "Digital onboarding with document collection and role setup" },
      { icon: "⏰", title: "Attendance Tracking", desc: "Clock-in/out with location and auto-timesheets" },
      { icon: "💵", title: "Payroll Processing", desc: "Auto-calculate salaries with deductions and taxes" },
      { icon: "📊", title: "Performance Reviews", desc: "360-degree feedback and KPI-based appraisals" },
      { icon: "📅", title: "Leave Management", desc: "Apply, approve and track leaves with balance display" },
      { icon: "📋", title: "HR Reports", desc: "Headcount, attrition and payroll summary reports" },
    ],
    techStack: ["React.js", "Spring Boot", "MySQL", "JWT", "Gmail SMTP"],
    integrations: ["CURIEM CRM", "Gmail (payslips)", "Google Sheets (coming soon)"],
    bestFor: ["HR Managers", "Startups scaling teams", "IT Companies", "Agencies"],
    support: "Email + Chat Support",
    sla: "99.5% uptime",
    gettingStarted: [
      "Add your employees and assign CURIEM roles",
      "Configure attendance and leave policies",
      "Set up payroll structure with salary components",
      "Enable automated payslip email delivery",
      "Run your first payroll cycle",
    ],
    faqs: [
      { q: "Can employees apply for leave through CURIEM?", a: "Yes, employees can submit and track leave requests from their dashboard." },
      { q: "Is payroll tax calculation included?", a: "Basic TDS calculation is included. Advanced tax modules are coming soon." },
      { q: "Can I import existing employee data?", a: "Yes, CSV import is supported for bulk employee onboarding." },
    ],
    testimonials: [
      { name: "Kabir Nayak", company: "Workcation", text: "Onboarding new hires went from 3 days to 3 hours with HR Management.", rating: 4 },
    ],
    plans: [
      { name: "Free",  price: 0,    seats: "5 employees", highlight: false, features: ["5 employees", "Basic attendance", "Manual payroll"] },
      { name: "HR",    price: 3500, seats: "Up to 50",    highlight: true,  features: ["50 employees", "Auto attendance", "Payroll processing", "Leave management"] },
      { name: "Enterprise",price:8999,seats:"Unlimited",  highlight: false, features: ["Unlimited employees", "Advanced payroll", "Performance reviews", "Priority support"] },
    ],
  },
  {
    id: 9,
    name: "Marketing Automation",
    category: "Marketing",
    price: 2500,
    annualPrice: 24000,
    status: "Inactive",
    description: "Email campaigns, lead nurturing and conversion tracking.",
    overview: "Marketing Automation helps you run targeted email campaigns, nurture leads through automated sequences and track conversions — all integrated with your CURIEM CRM pipeline.",
    problemSolved: "Sales teams spend hours on manual follow-up emails. Marketing Automation sends the right message to the right lead at the right time — automatically increasing conversion rates.",
    features: [
      { icon: "📧", title: "Email Campaigns", desc: "Design and send bulk campaigns with templates" },
      { icon: "🔄", title: "Lead Nurturing", desc: "Automated email sequences based on lead behaviour" },
      { icon: "📊", title: "Conversion Tracking", desc: "Track open rates, clicks and deal conversions" },
      { icon: "🎯", title: "Audience Segmentation", desc: "Target specific leads based on stage and industry" },
      { icon: "⏱️", title: "Scheduled Campaigns", desc: "Schedule campaigns for optimal delivery times" },
      { icon: "🧪", title: "A/B Testing", desc: "Test subject lines and content for better results" },
    ],
    techStack: ["React.js", "Spring Boot", "Gmail SMTP", "MySQL", "Spring @Scheduled"],
    integrations: ["CURIEM CRM", "Gmail SMTP", "Mailchimp (coming soon)", "HubSpot (coming soon)"],
    bestFor: ["Marketing Teams", "Sales-driven Companies", "SaaS Businesses", "E-commerce"],
    support: "Email Support",
    sla: "99.5% uptime",
    gettingStarted: [
      "Connect your Gmail SMTP in Settings → Integrations",
      "Create your first email template",
      "Segment your leads by stage or industry",
      "Set up an automated nurturing sequence",
      "Monitor campaign performance in Analytics",
    ],
    faqs: [
      { q: "How many emails can I send per month?", a: "Up to 10,000 emails/month on the Marketing plan." },
      { q: "Can I personalize emails?", a: "Yes, use lead name, company and deal value as dynamic variables." },
      { q: "Is this GDPR compliant?", a: "Yes, unsubscribe links are automatically included in all campaigns." },
    ],
    testimonials: [
      { name: "Rita Kumari", company: "Bright Marketing", text: "Our lead conversion rate went up 35% in the first month. Incredible ROI.", rating: 5 },
    ],
    plans: [
      { name: "Free",      price: 0,    seats: "500 emails/mo",   highlight: false, features: ["500 emails/month", "1 campaign", "Basic templates"] },
      { name: "Marketing", price: 2500, seats: "10,000 emails/mo",highlight: true,  features: ["10k emails/month", "Unlimited campaigns", "A/B testing", "Analytics"] },
      { name: "Pro",       price: 5999, seats: "Unlimited",        highlight: false, features: ["Unlimited emails", "Advanced segmentation", "CRM sync", "Priority support"] },
    ],
  },
];

const CATEGORIES = ["All", "CRM", "Analytics", "Cloud", "Finance", "Project", "AI", "Security", "HR", "Marketing"];

const CATEGORY_COLORS = {
  CRM:       { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20"    },
  Analytics: { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20"  },
  Cloud:     { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20"    },
  Finance:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Project:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20"   },
  AI:        { bg: "bg-pink-500/10",    text: "text-pink-400",    border: "border-pink-500/20"    },
  Security:  { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20"    },
  HR:        { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/20"  },
  Marketing: { bg: "bg-teal-500/10",    text: "text-teal-400",    border: "border-teal-500/20"    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Product Detail Modal — full premium view
// ─────────────────────────────────────────────────────────────────────────────
function ProductDetailModal({ product: p, darkMode: d, onClose }) {
  const [activeTab, setActiveTab]   = useState("overview");
  const [billing, setBilling]       = useState("monthly");
  const [openFaq, setOpenFaq]       = useState(null);
  const cc = CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS["CRM"];
  const text  = d ? "text-white"       : "text-slate-800";
  const muted = d ? "text-white/40"    : "text-slate-400";
  const card  = d ? "bg-white/[0.04] border-white/[0.07]" : "bg-white border-slate-200";
  const divider = d ? "border-white/[0.06]" : "border-slate-100";

  const TABS = ["overview", "features", "pricing", "reviews"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl
        ${d ? "bg-[#0d1117] border-white/[0.08]" : "bg-white border-slate-200"}`}>

        {/* ── Hero Header ── */}
        <div className={`sticky top-0 z-10 px-6 pt-6 pb-4 border-b ${d ? "bg-[#0d1117] border-white/[0.06]" : "bg-white border-slate-100"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${cc.bg} ${cc.border}`}>
                <Package size={20} className={cc.text} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className={`text-[18px] font-bold ${text}`}>{p.name}</h2>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cc.bg} ${cc.text} ${cc.border}`}>{p.category}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase
                    ${p.status === "Active" ? d ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                                            : d ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                    {p.status}
                  </span>
                </div>
                <p className={`text-[12px] mt-0.5 ${muted}`}>{p.description}</p>
              </div>
            </div>
            <button onClick={onClose}
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d ? "hover:bg-white/10 text-white/40" : "hover:bg-slate-100 text-slate-400"}`}>
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all
                  ${activeTab === tab
                    ? "bg-blue-500 text-white"
                    : d ? "text-white/35 hover:text-white hover:bg-white/[0.05]" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                  }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-5">

              {/* Overview */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${muted}`}>Overview</p>
                <p className={`text-[13px] leading-relaxed ${d ? "text-white/70" : "text-slate-600"}`}>{p.overview}</p>
              </div>

              {/* Problem Solved */}
              <div className={`p-4 rounded-xl border-l-[3px] ${d ? "bg-white/[0.03] border-l-blue-500/50" : "bg-blue-50 border-l-blue-400"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${muted}`}>Problem it solves</p>
                <p className={`text-[13px] leading-relaxed ${d ? "text-white/60" : "text-slate-600"}`}>{p.problemSolved}</p>
              </div>

              {/* Best For */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${muted}`}>Best For</p>
                <div className="flex flex-wrap gap-2">
                  {p.bestFor.map(b => (
                    <span key={b} className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border
                      ${d ? "bg-white/[0.04] border-white/[0.08] text-white/60" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                      <Users size={10} /> {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${muted}`}>Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {p.techStack.map(t => (
                    <span key={t} className={`text-[11px] font-semibold px-3 py-1 rounded-lg border
                      ${d ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-violet-50 border-violet-200 text-violet-600"}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${muted}`}>Integrations</p>
                <div className="flex flex-wrap gap-2">
                  {p.integrations.map(i => (
                    <span key={i} className={`text-[11px] font-semibold px-3 py-1 rounded-lg border
                      ${d ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-cyan-600"}`}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* SLA + Support */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "SLA / Uptime", value: p.sla,     icon: <Shield size={14} /> },
                  { label: "Support",      value: p.support, icon: <Zap size={14} />    },
                ].map(item => (
                  <div key={item.label} className={`p-4 rounded-xl border ${card}`}>
                    <div className={`flex items-center gap-1.5 mb-1 ${muted}`}>{item.icon}<p className="text-[10px] font-bold uppercase tracking-widest">{item.label}</p></div>
                    <p className={`text-[13px] font-semibold ${text}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Getting Started */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${muted}`}>Getting Started</p>
                <div className="flex flex-col gap-2">
                  {p.gettingStarted.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5
                        ${d ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                        {i + 1}
                      </div>
                      <p className={`text-[12px] leading-relaxed pt-0.5 ${d ? "text-white/60" : "text-slate-600"}`}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${muted}`}>FAQ</p>
                <div className="flex flex-col gap-2">
                  {p.faqs.map((faq, i) => (
                    <div key={i} className={`rounded-xl border overflow-hidden ${card}`}>
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all
                          ${d ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                        <p className={`text-[13px] font-medium ${text}`}>{faq.q}</p>
                        {openFaq === i ? <ChevronUp size={14} className={muted} /> : <ChevronDown size={14} className={muted} />}
                      </button>
                      {openFaq === i && (
                        <div className={`px-4 pb-3 border-t ${divider}`}>
                          <p className={`text-[12px] leading-relaxed pt-3 ${d ? "text-white/55" : "text-slate-500"}`}>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ FEATURES TAB ══ */}
          {activeTab === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {p.features.map((f, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${card}`}>
                  <span className="text-2xl shrink-0">{f.icon}</span>
                  <div>
                    <p className={`text-[13px] font-semibold ${text}`}>{f.title}</p>
                    <p className={`text-[11px] mt-0.5 leading-relaxed ${muted}`}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ PRICING TAB ══ */}
          {activeTab === "pricing" && (
            <div className="flex flex-col gap-5">

              {/* Monthly / Annual toggle */}
              <div className="flex items-center justify-center gap-2">
                <div className={`flex items-center gap-1 p-1 rounded-xl border ${d ? "bg-white/[0.05] border-white/[0.08]" : "bg-slate-100 border-slate-200"}`}>
                  {["monthly", "annual"].map(b => (
                    <button key={b} onClick={() => setBilling(b)}
                      className={`px-4 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all
                        ${billing === b
                          ? d ? "bg-blue-500 text-white" : "bg-white text-slate-800 shadow-sm"
                          : d ? "text-white/35 hover:text-white" : "text-slate-400 hover:text-slate-700"
                        }`}>
                      {b} {b === "annual" && <span className="text-emerald-400 ml-1">(-20%)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {p.plans.map((plan, i) => (
                  <div key={i} className={`p-5 rounded-2xl border flex flex-col relative
                    ${plan.highlight
                      ? d ? "border-blue-500/40 bg-blue-500/[0.05]" : "border-blue-300 bg-blue-50"
                      : card
                    }`}>
                    {plan.highlight && (
                      <span className={`absolute -top-3 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full border
                        ${d ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-blue-100 border-blue-200 text-blue-600"}`}>
                        Most Popular
                      </span>
                    )}
                    <p className={`text-[14px] font-bold mt-2 ${text}`}>{plan.name}</p>
                    <div className="flex items-end gap-1 my-2">
                      <span className={`text-2xl font-bold ${text}`}>
                        {plan.price === 0 ? "Free" : `₹${billing === "annual" ? Math.round(plan.price * 0.8).toLocaleString() : plan.price.toLocaleString()}`}
                      </span>
                      {plan.price > 0 && <span className={`text-[11px] pb-0.5 ${muted}`}>/mo</span>}
                    </div>
                    <p className={`text-[11px] mb-3 ${muted}`}>{plan.seats}</p>
                    <div className="flex flex-col gap-1.5 flex-1 mb-4">
                      {plan.features.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-2">
                          <Check size={10} className="text-emerald-400 mt-1 shrink-0" />
                          <span className={`text-[11px] ${d ? "text-white/50" : "text-slate-500"}`}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button className={`w-full py-2 rounded-xl text-[12px] font-semibold transition-all
                      ${plan.highlight
                        ? "bg-blue-500 hover:bg-blue-400 text-white shadow-md"
                        : d ? "border border-white/10 text-white/50 hover:bg-white/[0.05]" : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}>
                      {plan.price === 0 ? "Get Started Free" : "Contact Sales"} <ArrowRight size={11} className="inline ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ REVIEWS TAB ══ */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-4">
              {p.testimonials.map((t, i) => (
                <div key={i} className={`p-5 rounded-xl border ${card}`}>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className={`text-[13px] leading-relaxed italic mb-3 ${d ? "text-white/65" : "text-slate-600"}`}>"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold
                      ${d ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className={`text-[12px] font-semibold ${text}`}>{t.name}</p>
                      <p className={`text-[10px] ${muted}`}>{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PRODUCTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Products({ darkMode }) {
  const d = darkMode;
  const role    = getRoleFromToken();
  const isAdmin = role === "ADMIN";

  const [products, setProducts]       = useState(MOCK_PRODUCTS);
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [showModal, setShowModal]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null); // ✅ detail modal
  const [form, setForm]               = useState({ name: "", category: "CRM", price: "", status: "Active", description: "" });

  const filtered = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const openAdd  = () => { setEditProduct(null); setForm({ name: "", category: "CRM", price: "", status: "Active", description: "" }); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ name: p.name, category: p.category, price: p.price, status: p.status, description: p.description }); setShowModal(true); };

  const save = () => {
    if (!form.name.trim() || !form.price) return;
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...form, price: Number(form.price) } : p));
    } else {
      setProducts(prev => [...prev, { id: Date.now(), ...form, price: Number(form.price), overview: form.description, problemSolved: "", features: [], techStack: [], integrations: [], bestFor: [], support: "Email", sla: "99.5%", gettingStarted: [], faqs: [], testimonials: [], plans: [] }]);
    }
    setShowModal(false);
  };

  const deleteProduct = (id) => { if (window.confirm("Delete this product?")) setProducts(prev => prev.filter(p => p.id !== id)); };

  const bg    = d ? "bg-[#171821]" : "bg-amber-50";
  const card  = d ? "bg-white/[0.04] border-white/[0.07]" : "bg-white border-slate-200";
  const text  = d ? "text-white"   : "text-slate-800";
  const muted = d ? "text-white/40": "text-slate-400";
  const input = d ? "bg-white/[0.05] border-white/[0.08] text-white placeholder-white/20" : "bg-white border-slate-200 text-slate-800";
  const hover = d ? "hover:bg-white/[0.06]" : "hover:bg-slate-50";

  return (
    <div className={`min-h-screen w-full px-5 py-6 ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${text}`}>Products</h1>
          <p className={`text-[13px] mt-0.5 ${muted}`}>{products.length} products · {products.filter(p => p.status === "Active").length} active</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-blue-500 hover:bg-blue-400 text-white transition-all shadow-[0_4px_16px_rgba(59,130,246,0.35)] hover:-translate-y-0.5">
            <Plus size={15} /> Add Product
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border flex-1 ${d ? "bg-white/[0.04] border-white/[0.07]" : "bg-white border-slate-200"}`}>
          <Search size={14} className={muted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className={`flex-1 text-[13px] bg-transparent outline-none ${d ? "text-white placeholder-white/25" : "text-slate-700 placeholder-slate-300"}`} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border
                ${activeCategory === cat ? "bg-blue-500 text-white border-blue-500" : d ? "border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05]" : "border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-white"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: products.length, color: "text-blue-400" },
          { label: "Active",         value: products.filter(p => p.status === "Active").length, color: "text-emerald-400" },
          { label: "Inactive",       value: products.filter(p => p.status === "Inactive").length, color: "text-rose-400" },
          { label: "Avg Price",      value: `₹${Math.round(products.reduce((a,p)=>a+p.price,0)/products.length).toLocaleString()}`, color: "text-violet-400" },
        ].map(k => (
          <div key={k.label} className={`rounded-2xl border p-4 ${card}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className={`text-center py-16 ${muted}`}><Package size={40} className="mx-auto mb-3 opacity-30" /><p>No products found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const cc = CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS["CRM"];
            return (
              <div key={p.id} className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${card} ${hover}`}
                onClick={() => setViewProduct(p)}>  {/* ✅ click anywhere to open detail */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cc.bg} ${cc.border}`}>
                      <Package size={16} className={cc.text} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[14px] font-semibold truncate ${text}`}>{p.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cc.bg} ${cc.text} ${cc.border}`}>{p.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase
                      ${p.status === "Active" ? d ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                                              : d ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                      {p.status}
                    </span>
                    {isAdmin && (
                      <>
                        <button onClick={e => { e.stopPropagation(); openEdit(p); }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${d ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400"}`}>
                          <Edit2 size={12} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); deleteProduct(p.id); }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${d ? "hover:bg-rose-500/10 text-white/40 hover:text-rose-400" : "hover:bg-rose-50 text-slate-400 hover:text-rose-500"}`}>
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className={`text-[12px] leading-relaxed mb-4 line-clamp-2 ${muted}`}>{p.description}</p>
                <div className={`pt-3 border-t ${d ? "border-white/[0.05]" : "border-slate-100"}`}>
                  <p className={`text-xl font-bold ${d ? "text-white" : "text-slate-800"}`}>
                    ₹{p.price.toLocaleString()}<span className={`text-[11px] font-normal ml-1 ${muted}`}>/mo</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {viewProduct && <ProductDetailModal product={viewProduct} darkMode={d} onClose={() => setViewProduct(null)} />}

      {/* Add/Edit Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${d ? "bg-[#0f1420] border-white/[0.08]" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-[16px] font-bold ${text}`}>{editProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${d ? "hover:bg-white/10 text-white/50" : "hover:bg-slate-100 text-slate-400"}`}><X size={15} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>Product Name</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. CRM Pro Subscription" className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-[13px] outline-none ${input}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-[13px] outline-none ${input}`}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-[13px] outline-none ${input}`}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>Price (₹/mo)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="e.g. 2500" className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-[13px] outline-none ${input}`} />
              </div>
              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Brief product description..." rows={3} className={`w-full mt-1.5 border rounded-xl px-4 py-2.5 text-[13px] outline-none resize-none ${input}`} />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-xl text-[12px] font-semibold border ${d ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"}`}>Cancel</button>
              <button onClick={save} className="px-5 py-2 rounded-xl text-[12px] font-semibold bg-blue-500 hover:bg-blue-400 text-white">{editProduct ? "Update" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}