/**
 * ============================================================
 *                     FULL MOCK DATA
 * ============================================================
 * Fields on each lead:
 *  id, name, email, company, status, source
 *  createdAt, statusUpdatedAt, conversionDate
 *  dealStatus        → "active" | "close"
 *  receivedAmount    → number (0 if not converted)
 *  purchaseDate
 *  assignedTo        → sales agent name  ← NEW
 *  callHistory[]     → full contact log  ← EXPANDED
 * ============================================================
 */

// ─── Sales Agents (used across all data) ─────────────────────────────────────
export const AGENTS = [
  { id: "A1", name: "Rajesh Verma",  avatar: "RV", role: "Senior AE"  },
  { id: "A2", name: "Rohan Verma",   avatar: "RV", role: "AE"         },
  { id: "A3", name: "Roshan Verma",  avatar: "RS", role: "SDR"        },
  { id: "A4", name: "Ravi Verma",    avatar: "RA", role: "AE"         },
  { id: "A5", name: "Rajesh Sharma", avatar: "RS", role: "Senior AE"  },
  { id: "A6", name: "Sohan Verma",   avatar: "SV", role: "SDR"        },
];





// ─── Main Leads / Deals Data ──────────────────────────────────────────────────
export const mockData = [
  {
    id: 267881,
    name: "Robert White",
    email: "robert.white@datacorp.com",
    company: "DataCorp",
    status: "new",
    source: "Referral",
    assignedTo: "Rajesh Verma",

    createdAt: "2025-12-04 10:10",
    statusUpdatedAt: "2025-12-04 10:10",
    conversionDate: "2025-02-14",
    dealStatus: "active",
    receivedAmount: 1000,
    purchaseDate: "2025-12-01 14:22",

    callHistory: [
      { callNumber: "+91 3453 43210", feedback: "Client is warm, needs a product walkthrough.", rating: 4, time: "2025-01-22 14:32", contactedBy: "Rajesh Verma", contactType: "Call" },
      { email: "robert.white@datacorp.com", feedback: "Sent pricing deck. Awaiting response.", rating: 3, time: "2025-01-28 10:00", contactedBy: "Rajesh Verma", contactType: "Email" },
    ]
  },

  {
    id: 498276,
    name: "Lowerance Evans",
    email: "lowerance.evans@techify.com",
    company: "Techify",
    status: "contacted",
    source: "Website",
    assignedTo: "Rohan Verma",

    createdAt: "2025-02-10 09:30",
    statusUpdatedAt: "2025-12-04 14:00",
    conversionDate: "2025-02-14",
    dealStatus: "close",
    receivedAmount: 95000,
    purchaseDate: "2025-02-28 11:45",

    callHistory: [
      { callNumber: "+91 98765 43210", feedback: "Very interested. Budget confirmed.", rating: 5, time: "2025-02-21 14:32", contactedBy: "Rohan Verma", contactType: "Call" },
      { callNumber: "+91 98765 43210", feedback: "Contract signed. Deal closed.", rating: 5, time: "2025-02-28 09:00", contactedBy: "Rohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 732145,
    name: "Sarah Kim",
    email: "sarah.kim@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Social Media",
    assignedTo: "Roshan Verma",

    createdAt: "2025-02-22 11:18",
    statusUpdatedAt: "2025-03-22 10:30",
    conversionDate: "2025-03-22",
    dealStatus: "close",
    receivedAmount: 175000,
    purchaseDate: "2025-12-01 16:33",

    callHistory: [
      { email: "sarah.kim@innovateinc.com", feedback: "Sent intro email. Client responded positively.", rating: 4, time: "2025-01-22 14:32", contactedBy: "Roshan Verma", contactType: "Email" },
      { callNumber: "+91 90000 11111", feedback: "Demo done. Client loved the product.", rating: 5, time: "2025-03-10 11:00", contactedBy: "Roshan Verma", contactType: "Call" },
    ]
  },

  {
    id: 812364,
    name: "Jason Brown",
    email: "jason.brown@solutionsco.com",
    company: "Solutions Co.",
    status: "converted",
    source: "Email Campaign",
    assignedTo: "Ravi Verma",

    createdAt: "2025-12-04 09:10",
    statusUpdatedAt: "2025-04-01 12:10",
    conversionDate: "2025-04-01",
    dealStatus: "close",
    receivedAmount: 140000,
    purchaseDate: "2025-01-18 10:12",

    callHistory: [
      { callNumber: "+91 98765 43210", feedback: "Cold outreach. Client showed interest.", rating: 3, time: "2025-01-22 14:32", contactedBy: "Ravi Verma", contactType: "Call" },
      { callNumber: "+91 98765 43210", feedback: "Follow-up call. Proposal accepted.", rating: 5, time: "2025-03-25 15:00", contactedBy: "Ravi Verma", contactType: "Call" },
    ]
  },

  {
    id: 964523,
    name: "Elizabeth Grey",
    email: "elizabeth.grey@techcorp.com",
    company: "Tech Corp.",
    status: "new",
    source: "Website",
    assignedTo: "Rajesh Sharma",

    createdAt: "2015-01-20 12:05",
    statusUpdatedAt: "2015-01-20 12:05",
    conversionDate: "2025-04-18",
    dealStatus: "close",
    receivedAmount: 210000,
    purchaseDate: "2015-01-28 13:40",

    callHistory: [
      { email: "elizabeth.grey@techcorp.com", feedback: "Initial outreach email sent.", rating: 3, time: "2025-01-22 14:32", contactedBy: "Rajesh Sharma", contactType: "Email" },
    ]
  },

  {
    id: 174862,
    name: "Laura Green",
    email: "laura.green@datasystems.com",
    company: "Data Systems",
    status: "converted",
    source: "Referral",
    assignedTo: "Rohan Verma",

    createdAt: "2025-11-20 14:20",
    statusUpdatedAt: "2025-12-05 13:40",
    conversionDate: "2025-05-09",
    dealStatus: "close",
    receivedAmount: 88000,
    purchaseDate: "2025-11-28 19:55",

    callHistory: [
      { email: "laura.green@datasystems.com", feedback: "Referral intro. Warm lead.", rating: 4, time: "2025-01-22 14:32", contactedBy: "Rohan Verma", contactType: "Email" },
      { callNumber: "+91 77777 88888", feedback: "Negotiation complete. Deal confirmed.", rating: 5, time: "2025-05-08 14:00", contactedBy: "Rohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 653217,
    name: "Kevin Hill",
    email: "kevin.hill@globalsoftwares.com",
    company: "Global Softwares",
    status: "converted",
    source: "Cold Call",
    assignedTo: "Sohan Verma",

    createdAt: "2025-11-25 12:00",
    statusUpdatedAt: "2025-12-05 10:05",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 165000,
    purchaseDate: "2025-12-02 12:05",

    callHistory: [
      { callNumber: "+91 98765 43210", feedback: "Client ready to buy. Finalizing docs.", rating: 5, time: "2025-01-22 14:32", contactedBy: "Sohan Verma", contactType: "Call" },
      { callNumber: "+91 98765 43210", feedback: "Contract signed. Excellent outcome.", rating: 5, time: "2025-05-25 10:00", contactedBy: "Sohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 762931,
    name: "John Doe",
    email: "john.doe@innovateinc.com",
    company: "Innovate Inc.",
    status: "qualified",
    source: "Website",
    assignedTo: "Rajesh Verma",

    createdAt: "2025-01-01 11:30",
    statusUpdatedAt: "2025-12-05 09:30",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-02 17:50",

    callHistory: [
      { callNumber: "+91 11111 22222", feedback: "Qualified lead. Scheduling demo.", rating: 4, time: "2025-12-01 10:00", contactedBy: "Rajesh Verma", contactType: "Call" },
    ]
  },

  {
    id: 849523,
    name: "Jane Smith",
    email: "jane.smith@solutionsco.com",
    company: "Solutions Co.",
    status: "new",
    source: "Referral",
    assignedTo: "Ravi Verma",

    createdAt: "2025-01-01 14:00",
    statusUpdatedAt: "2025-12-05 14:00",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-03 09:48",

    callHistory: []
  },

  {
    id: 951246,
    name: "Peter Jones",
    email: "peter.jones@techcorp.com",
    company: "Tech Corp.",
    status: "contacted",
    source: "Social Media",
    assignedTo: "Roshan Verma",

    createdAt: "2025-11-30 10:22",
    statusUpdatedAt: "2025-12-05 13:15",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-12-04 18:32",

    callHistory: [
      { callNumber: "+91 33333 44444", feedback: "First contact made. Interested in demo.", rating: 3, time: "2025-12-01 09:00", contactedBy: "Roshan Verma", contactType: "Call" },
    ]
  },

  {
    id: 103852,
    name: "Mary Johnson",
    email: "mary.johnson@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Website",
    assignedTo: "Rajesh Sharma",

    createdAt: "2023-12-28 09:00",
    statusUpdatedAt: "2025-12-05 11:40",
    conversionDate: "2024-01-15",
    dealStatus: "close",
    receivedAmount: 110000,
    purchaseDate: "2025-01-05 12:59",

    callHistory: [
      { callNumber: "+91 55555 66666", feedback: "Long-term client. Renewal discussion.", rating: 5, time: "2025-11-20 11:00", contactedBy: "Rajesh Sharma", contactType: "Call" },
    ]
  },

  {
    id: 118945,
    name: "David Williams",
    email: "david.williams@datasystems.com",
    company: "Data Systems",
    status: "lost",
    source: "Cold Call",
    assignedTo: "Sohan Verma",

    createdAt: "2025-11-01 10:10",
    statusUpdatedAt: "2025-12-05 14:30",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-11-03 11:20",

    callHistory: [
      { callNumber: "+91 77777 88888", feedback: "Client lost to competitor pricing.", rating: 2, time: "2025-11-25 14:00", contactedBy: "Sohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 129478,
    name: "Emily Brown",
    email: "emily.brown@solutionsco.com",
    company: "Solutions Co.",
    status: "new",
    source: "Website",
    assignedTo: "Rohan Verma",

    createdAt: "2025-01-05 10:40",
    statusUpdatedAt: "2025-01-05 10:40",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-07 15:05",

    callHistory: []
  },

  {
    id: 137592,
    name: "Michael Davis",
    email: "michael.davis@techcorp.com",
    company: "Tech Corp.",
    status: "qualified",
    source: "Referral",
    assignedTo: "Rajesh Verma",

    createdAt: "2025-01-06 09:15",
    statusUpdatedAt: "2025-01-08 09:00",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-08 14:10",

    callHistory: [
      { callNumber: "+91 99999 00000", feedback: "Strong qualification. Proposal stage next.", rating: 4, time: "2025-01-07 10:00", contactedBy: "Rajesh Verma", contactType: "Call" },
    ]
  },

  {
    id: 148236,
    name: "Sophia Taylor",
    email: "sophia.taylor@brightfuture.com",
    company: "Bright Future Ltd.",
    status: "new",
    source: "Social Media",
    assignedTo: "Ravi Verma",

    createdAt: "2025-12-02 14:00",
    statusUpdatedAt: "2025-12-02 14:00",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-12-03 19:45",

    callHistory: []
  },

  {
    id: 159847,
    name: "Daniel Wilson",
    email: "daniel.wilson@nextgentech.com",
    company: "NextGen Tech",
    status: "contacted",
    source: "Website",
    assignedTo: "Roshan Verma",

    createdAt: "2025-04-25 09:30",
    statusUpdatedAt: "2025-04-27 12:30",
    conversionDate: "2025-12-01",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-04-28 09:55",

    callHistory: [
      { email: "daniel.wilson@nextgentech.com", feedback: "Sent product overview. Awaiting reply.", rating: 3, time: "2025-04-26 09:00", contactedBy: "Roshan Verma", contactType: "Email" },
    ]
  },

  {
    id: 163924,
    name: "Olivia Martinez",
    email: "olivia.martinez@visionarysolutions.com",
    company: "Visionary Solutions",
    status: "qualified",
    source: "Referral",
    assignedTo: "Rajesh Sharma",

    createdAt: "2025-01-09 10:05",
    statusUpdatedAt: "2025-01-10 12:35",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-10 13:10",

    callHistory: [
      { callNumber: "+91 44444 55555", feedback: "Qualified. Needs custom pricing.", rating: 4, time: "2025-01-10 11:00", contactedBy: "Rajesh Sharma", contactType: "Call" },
    ]
  },

  {
    id: 174658,
    name: "James Anderson",
    email: "james.anderson@globalsoftwares.com",
    company: "Global Softwares",
    status: "converted",
    source: "Email Campaign",
    assignedTo: "Rohan Verma",

    createdAt: "2023-12-18 10:20",
    statusUpdatedAt: "2024-02-20 11:10",
    conversionDate: "2024-02-20",
    dealStatus: "close",
    receivedAmount: 132000,
    purchaseDate: "2025-02-15 11:42",

    callHistory: [
      { callNumber: "+91 66666 77777", feedback: "Long sales cycle but closed strong.", rating: 5, time: "2024-02-18 14:00", contactedBy: "Rohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 186523,
    name: "Ava Thomas",
    email: "ava.thomas@datasystems.com",
    company: "Data Systems",
    status: "lost",
    source: "Cold Call",
    assignedTo: "Sohan Verma",

    createdAt: "2025-04-18 10:00",
    statusUpdatedAt: "2025-05-25 12:00",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-04-23 10:34",

    callHistory: [
      { callNumber: "+91 22222 33333", feedback: "Budget constraints. Could revisit Q3.", rating: 2, time: "2025-05-20 10:00", contactedBy: "Sohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 197351,
    name: "William Garcia",
    email: "william.garcia@innovateinc.com",
    company: "Innovate Inc.",
    status: "qualified",
    source: "Website",
    assignedTo: "Rajesh Verma",

    createdAt: "2021-01-20 10:00",
    statusUpdatedAt: "2021-01-28 10:00",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2021-01-28 14:45",

    callHistory: [
      { callNumber: "+91 11111 99999", feedback: "Old lead revived. Good potential.", rating: 3, time: "2025-11-01 09:00", contactedBy: "Rajesh Verma", contactType: "Call" },
    ]
  },

  {
    id: 203467,
    name: "Isabella Martinez",
    email: "isabella.martinez@solutionsco.com",
    company: "Solutions Co.",
    status: "contacted",
    source: "Social Media",
    assignedTo: "Ravi Verma",

    createdAt: "2022-01-20 13:00",
    statusUpdatedAt: "2022-01-27 09:40",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2022-01-28 15:58",

    callHistory: [
      { email: "isabella.martinez@solutionsco.com", feedback: "Social media DM converted to email.", rating: 3, time: "2025-10-05 11:00", contactedBy: "Ravi Verma", contactType: "Email" },
    ]
  },

  {
    id: 219456,
    name: "Benjamin Lee",
    email: "benjamin.lee@futuretech.com",
    company: "Future Tech Ltd.",
    status: "new",
    source: "Referral",
    assignedTo: "Roshan Verma",

    createdAt: "2023-01-25 11:00",
    statusUpdatedAt: "2023-01-25 11:00",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2023-01-28 17:20",

    callHistory: []
  },

  {
    id: 223785,
    name: "Charlotte Walker",
    email: "charlotte.walker@brightfuture.com",
    company: "Bright Future Ltd.",
    status: "converted",
    source: "Website",
    assignedTo: "Rajesh Sharma",

    createdAt: "2011-01-10 10:40",
    statusUpdatedAt: "2024-03-05 12:20",
    conversionDate: "2024-03-05",
    dealStatus: "close",
    receivedAmount: 98000,
    purchaseDate: "2011-01-28 13:19",

    callHistory: [
      { callNumber: "+91 88888 11111", feedback: "Legacy client. Smooth renewal.", rating: 5, time: "2024-03-01 10:00", contactedBy: "Rajesh Sharma", contactType: "Call" },
    ]
  },

  {
    id: 234871,
    name: "Lucas Hall",
    email: "lucas.hall@visionarysolutions.com",
    company: "Visionary Solutions",
    status: "lost",
    source: "Cold Call",
    assignedTo: "Sohan Verma",

    createdAt: "2012-01-16 11:22",
    statusUpdatedAt: "2025-05-25 09:30",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2012-01-28 18:00",

    callHistory: [
      { callNumber: "+91 55555 44444", feedback: "No budget this cycle. Follow up next year.", rating: 1, time: "2025-05-20 14:00", contactedBy: "Sohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 247953,
    name: "Mia Young",
    email: "mia.young@nextgentech.com",
    company: "NextGen Tech",
    status: "qualified",
    source: "Social Media",
    assignedTo: "Rohan Verma",

    createdAt: "2014-01-20 10:20",
    statusUpdatedAt: "2014-01-28 13:30",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2014-01-28 11:35",

    callHistory: [
      { callNumber: "+91 33333 22222", feedback: "Social referral. Promising lead.", rating: 4, time: "2025-09-15 10:00", contactedBy: "Rohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 258417,
    name: "Ethan Allen",
    email: "ethan.allen@techcorp.com",
    company: "Tech Corp.",
    status: "contacted",
    source: "Email Campaign",
    assignedTo: "Rajesh Verma",

    createdAt: "2001-01-20 12:10",
    statusUpdatedAt: "2001-01-27 10:30",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2001-01-28 16:40",

    callHistory: [
      { email: "ethan.allen@techcorp.com", feedback: "Email campaign response. Scheduling call.", rating: 3, time: "2025-08-10 09:00", contactedBy: "Rajesh Verma", contactType: "Email" },
    ]
  },

  {
    id: 268934,
    name: "Amelia King",
    email: "amelia.king@globalsoftwares.com",
    company: "Global Softwares",
    status: "new",
    source: "Website",
    assignedTo: "Ravi Verma",

    createdAt: "2002-01-20 14:30",
    statusUpdatedAt: "2002-01-20 14:30",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2002-01-28 14:48",

    callHistory: []
  },

  {
    id: 279846,
    name: "Robert White",
    email: "robert.white@datacorp.com",
    company: "DataCorp",
    status: "converted",
    source: "Referral",
    assignedTo: "Roshan Verma",

    createdAt: "2003-01-10 11:20",
    statusUpdatedAt: "2025-01-28 10:30",
    conversionDate: "2025-01-28",
    dealStatus: "active",
    receivedAmount: 15000,
    purchaseDate: "2003-01-28 10:50",

    callHistory: [
      { callNumber: "+91 12121 34343", feedback: "Repeat client. Upsell successful.", rating: 5, time: "2025-01-25 11:00", contactedBy: "Roshan Verma", contactType: "Call" },
    ]
  },

  {
    id: 289561,
    name: "Chris Evans",
    email: "chris.evans@techify.com",
    company: "Techify",
    status: "converted",
    source: "Website",
    assignedTo: "Rajesh Sharma",

    createdAt: "2004-01-15 09:10",
    statusUpdatedAt: "2025-02-14 09:30",
    conversionDate: "2025-02-14",
    dealStatus: "close",
    receivedAmount: 12000,
    purchaseDate: "2004-01-28 09:55",

    callHistory: [
      { callNumber: "+91 56565 78787", feedback: "Demo closed deal. Great experience.", rating: 5, time: "2025-02-10 10:00", contactedBy: "Rajesh Sharma", contactType: "Call" },
    ]
  },

  {
    id: 299817,
    name: "Sarah Kim",
    email: "sarah.kim@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Social Media",
    assignedTo: "Rohan Verma",

    createdAt: "2026-04-15 10:10",
    statusUpdatedAt: "2005-01-20 12:30",
    conversionDate: "2025-03-22",
    dealStatus: "active",
    receivedAmount: 18000,
    purchaseDate: "2005-01-28 12:12",

    callHistory: [
      { callNumber: "+91 90000 11111", feedback: "Inbound lead. Converted quickly.", rating: 5, time: "2025-03-20 14:00", contactedBy: "Rohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 306784,
    name: "Jason Brown",
    email: "jason.brown@solutionsco.com",
    company: "Solutions Co.",
    status: "converted",
    source: "Email Campaign",
    assignedTo: "Ravi Verma",

    createdAt: "2003-04-1 10:00",
    statusUpdatedAt: "2026-04-16 11:40",
    conversionDate: "2025-04-01",
    dealStatus: "active",
    receivedAmount: 20000,
    purchaseDate: "2006-01-28 15:18",

    callHistory: [
      { callNumber: "+91 98765 43210", feedback: "Email nurture worked. Clean close.", rating: 4, time: "2025-03-28 09:00", contactedBy: "Ravi Verma", contactType: "Call" },
    ]
  },

  {
    id: 312958,
    name: "Elizabeth Grey",
    email: "elizabeth.grey@techcorp.com",
    company: "Tech Corp.",
    status: "converted",
    source: "Website",
    assignedTo: "Rajesh Verma",

    createdAt: "2007-01-15 10:30",
    statusUpdatedAt: "2025-04-18 10:20",
    conversionDate: "2025-04-18",
    dealStatus: "active",
    receivedAmount: 22000,
    purchaseDate: "2007-01-28 11:30",

    callHistory: [
      { callNumber: "+91 11111 00000", feedback: "Great fit for enterprise plan.", rating: 5, time: "2025-04-15 11:00", contactedBy: "Rajesh Verma", contactType: "Call" },
    ]
  },

  {
    id: 324879,
    name: "Laura Green",
    email: "laura.green@datasystems.com",
    company: "Data Systems",
    status: "qualified",
    source: "Referral",
    assignedTo: "Sohan Verma",

    createdAt: "2008-01-20 09:10",
    statusUpdatedAt: "2008-01-28 13:00",
    conversionDate: "2025-05-25",
    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2008-01-28 19:33",

    callHistory: [
      { callNumber: "+91 44444 33333", feedback: "Referral from existing client. Strong fit.", rating: 4, time: "2025-10-01 10:00", contactedBy: "Sohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 336512,
    name: "John Doe",
    email: "john.doe@innovateinc.com",
    company: "Innovate Inc.",
    status: "qualified",
    source: "Website",
    assignedTo: "Roshan Verma",

    createdAt: "2025-03-20 09:20",
    statusUpdatedAt: "2025-03-28 12:00",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-03-28 18:30",

    callHistory: [
      { callNumber: "+91 22222 11111", feedback: "Proposal sent. Waiting on legal.", rating: 3, time: "2025-03-25 09:00", contactedBy: "Roshan Verma", contactType: "Call" },
    ]
  },

  {
    id: 347916,
    name: "Mary Johnson",
    email: "mary.johnson@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Website",
    assignedTo: "Rajesh Sharma",

    createdAt: "2025-11-01 13:00",
    statusUpdatedAt: "2024-01-15 11:00",
    conversionDate: "2024-01-15",
    dealStatus: "close",
    receivedAmount: 14000,
    purchaseDate: "2025-11-10 20:40",

    callHistory: [
      { callNumber: "+91 99988 77766", feedback: "Smooth renewal. Client very happy.", rating: 5, time: "2024-01-10 10:00", contactedBy: "Rajesh Sharma", contactType: "Call" },
    ]
  },

  {
    id: 358724,
    name: "David Williams",
    email: "david.williams@datasystems.com",
    company: "Data Systems",
    status: "lost",
    source: "Cold Call",
    assignedTo: "Sohan Verma",

    createdAt: "2025-11-01 10:00",
    statusUpdatedAt: "2025-05-25 14:20",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-11-04 11:55",

    callHistory: [
      { callNumber: "+91 33344 55566", feedback: "Not the right time. Will revisit.", rating: 2, time: "2025-11-15 10:00", contactedBy: "Sohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 369528,
    name: "Michael Davis",
    email: "michael.davis@techcorp.com",
    company: "Tech Corp.",
    status: "qualified",
    source: "Referral",
    assignedTo: "Rohan Verma",

    createdAt: "2025-01-28 10:00",
    statusUpdatedAt: "2025-01-31 11:20",
    conversionDate: "2025-05-25",
    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-01-31 14:25",

    callHistory: [
      { callNumber: "+91 77788 99900", feedback: "Decision delayed to Q2.", rating: 3, time: "2025-01-30 10:00", contactedBy: "Rohan Verma", contactType: "Call" },
    ]
  },

  {
    id: 372814,
    name: "James Anderson",
    email: "james.anderson@globalsoftwares.com",
    company: "Global Softwares",
    status: "converted",
    source: "Email Campaign",
    assignedTo: "Ravi Verma",

    createdAt: "2025-06-18 10:10",
    statusUpdatedAt: "2024-02-20 11:00",
    conversionDate: "2024-02-20",
    dealStatus: "close",
    receivedAmount: 17500,
    purchaseDate: "2025-06-22 16:45",

    callHistory: [
      { callNumber: "+91 11122 33344", feedback: "Email campaign → demo → close. Textbook.", rating: 5, time: "2024-02-15 11:00", contactedBy: "Ravi Verma", contactType: "Call" },
    ]
  },
];









// ─── Analytics Data (for Analytics page) ─────────────────────────────────────
export const analyticsData = {
  // Monthly revenue trend (last 12 months)
  monthlyRevenue: [
    { month: "Jan", revenue: 210000, leads: 8,  converted: 3 },
    { month: "Feb", revenue: 285000, leads: 11, converted: 5 },
    { month: "Mar", revenue: 175000, leads: 7,  converted: 2 },
    { month: "Apr", revenue: 330000, leads: 14, converted: 6 },
    { month: "May", revenue: 245000, leads: 9,  converted: 4 },
    { month: "Jun", revenue: 410000, leads: 16, converted: 8 },
    { month: "Jul", revenue: 295000, leads: 10, converted: 4 },
    { month: "Aug", revenue: 360000, leads: 13, converted: 6 },
    { month: "Sep", revenue: 280000, leads: 10, converted: 3 },
    { month: "Oct", revenue: 445000, leads: 18, converted: 9 },
    { month: "Nov", revenue: 390000, leads: 15, converted: 7 },
    { month: "Dec", revenue: 520000, leads: 20, converted: 11 },
  ],

  // Lead source breakdown
  leadSources: [
    { source: "Website",        count: 12, revenue: 580000 },
    { source: "Referral",       count: 9,  revenue: 490000 },
    { source: "Social Media",   count: 7,  revenue: 310000 },
    { source: "Cold Call",      count: 5,  revenue: 165000 },
    { source: "Email Campaign", count: 5,  revenue: 270000 },
  ],

  // Agent performance
  agentPerformance: [
    { agent: "Rajesh Verma",  deals: 8,  revenue: 398000, avgRating: 4.2, calls: 12 },
    { agent: "Rohan Verma",   deals: 7,  revenue: 510000, avgRating: 4.6, calls: 10 },
    { agent: "Rajesh Sharma", deals: 6,  revenue: 434000, avgRating: 4.8, calls: 8  },
    { agent: "Ravi Verma",    deals: 5,  revenue: 177500, avgRating: 4.0, calls: 9  },
    { agent: "Roshan Verma",  deals: 4,  revenue: 190000, avgRating: 3.8, calls: 7  },
    { agent: "Sohan Verma",   deals: 2,  revenue: 165000, avgRating: 2.8, calls: 6  },
  ],

  // Funnel stages (how many leads at each stage)
  funnel: [
    { stage: "New",       count: 7  },
    { stage: "Contacted", count: 5  },
    { stage: "Qualified", count: 8  },
    { stage: "Converted", count: 14 },
    { stage: "Lost",      count: 4  },
  ],
};

// ─── Calendar / Meetings Data ─────────────────────────────────────────────────
export const calendarData = [
  { id: 1,  title: "Demo Call with Jane Smith",         date: new Date("2026-04-18T17:00:00"), type: "demo",    priority: "high",   attendees: ["JS"],       status: "upcoming" },
  { id: 2,  title: "Review Meeting with ABC Ltd",       date: new Date("2026-04-19T10:00:00"), type: "review",  priority: "medium", attendees: ["AB", "CL"], status: "upcoming" },
  { id: 3,  title: "Follow-up Call with John Doe",      date: new Date("2026-04-20T14:00:00"), type: "call",    priority: "high",   attendees: ["JD"],       status: "upcoming" },
  { id: 4,  title: "Client Sync with Tech Solutions",   date: new Date("2026-04-21T11:00:00"), type: "sync",    priority: "medium", attendees: ["TS","RK"],  status: "upcoming" },
  { id: 5,  title: "Team Standup",                      date: new Date("2026-04-22T09:00:00"), type: "standup", priority: "low",    attendees: ["RK","JS"],  status: "upcoming" },
  { id: 6,  title: "Q2 Pipeline Review",                date: new Date("2026-04-24T15:00:00"), type: "review",  priority: "high",   attendees: ["RV","RS"],  status: "upcoming" },
  { id: 7,  title: "Onboarding — Sarah Kim",            date: new Date("2026-04-25T10:00:00"), type: "sync",    priority: "high",   attendees: ["SK"],       status: "upcoming" },
  { id: 8,  title: "Cold Outreach Strategy Session",    date: new Date("2026-04-28T14:00:00"), type: "standup", priority: "medium", attendees: ["RV","SV"],  status: "upcoming" },
  { id: 9,  title: "Contract Signing — Kevin Hill",     date: new Date("2026-05-02T11:00:00"), type: "demo",    priority: "high",   attendees: ["KH"],       status: "upcoming" },
  { id: 10, title: "Monthly All-Hands",                 date: new Date("2026-05-05T09:00:00"), type: "standup", priority: "low",    attendees: ["ALL"],      status: "upcoming" },
];

// ─── Customers Table Data ─────────────────────────────────────────────────────
export const customersData = [
  { id: "CUST-1001", name: "John Doe",        company: "Acme Corp",         address: "12 Market St, Suite 400, San Francisco, CA 94103", phone: "+1 (555) 123-4567",  email: "john.doe@acmecorp.com",          product: "CRM Pro Subscription",    purchaseDate: "2024-08-10", purchaseTime: "10:30", status: "Active", value: 12000, profilePhoto: null },
  { id: "CUST-1002", name: "Sarah Kim",       company: "Innovate Inc.",      address: "88 Innovation Drive, Palo Alto, CA 94301",         phone: "+1 (650) 555-2412",  email: "sarah.kim@innovate.inc",         product: "Analytics Suite",          purchaseDate: "2023-07-22", purchaseTime: "14:05", status: "closed", value: 4500,  profilePhoto: null },
  { id: "CUST-1003", name: "Priya Sharma",    company: "Sharma Designs",     address: "7 Elm Avenue, Portland, OR 97204",                 phone: "+1 (503) 555-9876",  email: "priya@sharmadesigns.com",        product: "Project Tracker",          purchaseDate: "2024-11-05", purchaseTime: "09:15", status: "Active", value: 3000,  profilePhoto: null },
  { id: "CUST-1004", name: "Lucas Martínez",  company: "TechNova Ltd.",      address: "Calle 58 #142, Mexico City, 01000",                phone: "+52 (55) 1234-5678", email: "lucas.m@technova.mx",            product: "Cloud Storage",            purchaseDate: "2025-02-18", purchaseTime: "16:45", status: "Active", value: 12000, profilePhoto: null },
  { id: "CUST-1005", name: "Emma Wilson",     company: "GreenLeaf",          address: "341 Green Rd, Seattle, WA 98101",                  phone: "+1 (206) 555-0101",  email: "emma.wilson@greenleaf.com",      product: "Finance Manager",          purchaseDate: "2024-09-28", purchaseTime: "11:20", status: "Active", value: 2800,  profilePhoto: null },
  { id: "CUST-1006", name: "Oliver Stone",    company: "FuturaTech",         address: "9 Bishop's Lane, London, UK W1D 3BQ",              phone: "+44 20 7946 0800",   email: "oliver.stone@futuratech.co.uk",  product: "AI Assistant",             purchaseDate: "2024-03-12", purchaseTime: "13:00", status: "closed", value: 6500,  profilePhoto: null },
  { id: "CUST-1007", name: "Mona Das",        company: "Neon Industries",    address: "Plot 14, Sector 21, Gurgaon, Haryana 122001",      phone: "+91 124 555 8899",   email: "mona.das@neonind.com",           product: "Security Suite",           purchaseDate: "2025-01-30", purchaseTime: "10:50", status: "Active", value: 5200,  profilePhoto: null },
  { id: "CUST-1008", name: "Kevin Hill",      company: "Global Softwares",   address: "210 King St, Toronto, ON M5H 1J9",                phone: "+1 (416) 555-3300",  email: "kevin.hill@globalsoft.com",      product: "HR Management System",     purchaseDate: "2024-05-18", purchaseTime: "15:40", status: "closed", value: 4200,  profilePhoto: null },
  { id: "CUST-1009", name: "Linda Scott",     company: "Prime Solutions",    address: "4 West Park Ave, Boston, MA 02116",                phone: "+1 (617) 555-9080",  email: "linda.scott@primesol.com",       product: "CRM Pro Subscription",    purchaseDate: "2025-04-08", purchaseTime: "09:45", status: "Active", value: 1200,  profilePhoto: null },
  { id: "CUST-1010", name: "Ethan Moore",     company: "LogicWave",          address: "72 River Road, Austin, TX 78701",                  phone: "+1 (512) 555-4123",  email: "ethan.moore@logicwave.com",      product: "Analytics Suite",          purchaseDate: "2024-12-20", purchaseTime: "17:10", status: "closed", value: 6000,  profilePhoto: null },
  { id: "CUST-1011", name: "Ava Collins",     company: "SkyNet",             address: "18 Ocean Drive, Miami, FL 33101",                  phone: "+1 (305) 555-2211",  email: "ava.collins@skynet.com",         product: "Cloud Storage",            purchaseDate: "2025-06-14", purchaseTime: "12:30", status: "Active", value: 3400,  profilePhoto: null },
  { id: "CUST-1012", name: "Liam Turner",     company: "NextGen Labs",       address: "55 Innovation Blvd, Denver, CO 80202",             phone: "+1 (303) 555-6677",  email: "liam.turner@nextgenlabs.com",    product: "Project Tracker",          purchaseDate: "2024-07-09", purchaseTime: "10:05", status: "closed", value: 2100,  profilePhoto: null },
  { id: "CUST-1013", name: "Chloe Bennett",   company: "Prime Solutions",    address: "4 West Park Ave, Boston, MA 02116",                phone: "+1 (617) 555-9081",  email: "chloe.bennett@primesol.com",     product: "ChatBot Pro",              purchaseDate: "2024-10-02", purchaseTime: "16:00", status: "Active", value: 1800,  profilePhoto: null },
  { id: "CUST-1014", name: "Harshit Singh",   company: "Data Systems",       address: "A-23, Connaught Place, New Delhi, 110001",         phone: "+91 11 5555 2244",   email: "harshit.singh@datasys.in",       product: "Security Suite",           purchaseDate: "2025-03-28", purchaseTime: "11:50", status: "closed", value: 4800,  profilePhoto: null },
  { id: "CUST-1015", name: "Rita Kumari",     company: "Bright Marketing",   address: "No. 6, MG Road, Bengaluru, KA 560001",             phone: "+91 80 5555 1212",   email: "rita.kumari@brightmkt.com",      product: "Marketing Automation",     purchaseDate: "2025-09-01", purchaseTime: "09:10", status: "Active", value: 2500,  profilePhoto: null },
  { id: "CUST-1016", name: "Kabir Nayak",     company: "Workcation",         address: "23 Seaside Ave, Chennai, TN 600001",               phone: "+91 44 5555 3344",   email: "kabir.nayak@workcation.in",      product: "HR Management System",     purchaseDate: "2024-02-14", purchaseTime: "14:30", status: "Active", value: 4100,  profilePhoto: null },
  { id: "CUST-1017", name: "Sophia Patel",    company: "Tailwind Labs",      address: "101 Software Park, Bangalore, KA 560045",          phone: "+91 80 5555 7788",   email: "sophia.patel@tailwindlabs.com",  product: "Analytics Suite",          purchaseDate: "2025-05-21", purchaseTime: "15:15", status: "Active", value: 6200,  profilePhoto: null },
  { id: "CUST-1018", name: "Nina Kapoor",     company: "Workcation",         address: "9 Harbour St, Wellington 6011, NZ",                phone: "+64 4 555 9911",     email: "nina.kapoor@workcation.nz",      product: "CRM Pro Subscription",    purchaseDate: "2024-08-06", purchaseTime: "09:55", status: "Active", value: 1250,  profilePhoto: null },
  { id: "CUST-1019", name: "David Williams",  company: "Global Softwares",   address: "500 Tech Park, Columbus, OH 43215",                phone: "+1 (614) 555-7800",  email: "david.williams@globalsoft.com",  product: "Finance Manager",          purchaseDate: "2025-10-10", purchaseTime: "13:20", status: "Active", value: 3150,  profilePhoto: null },
  { id: "CUST-1020", name: "Peter Jones",     company: "Solutions Co.",      address: "12 North Wharf, Sydney, NSW 2000",                 phone: "+61 2 5550 7788",    email: "peter.jones@solutionsco.au",     product: "Project Tracker",          purchaseDate: "2025-11-27", purchaseTime: "16:25", status: "closed", value: 1950,  profilePhoto: null },
];

// ─── Support Tickets ──────────────────────────────────────────────────────────
export const supportData = [
  { id: "TCK-001", customer: "John Doe",       issue: "Login not working",      description: "Customer is unable to log into their dashboard using Google sign-in.", priority: "High",   status: "Open",        assignedTo: "Sarah Kim",      dateCreated: "2025-11-05", lastUpdated: "2025-11-10", channel: "Email" },
  { id: "TCK-002", customer: "Priya Sharma",   issue: "Billing error",          description: "Invoice shows incorrect amount for September.",                        priority: "Medium", status: "In Progress", assignedTo: "Lucas Martínez", dateCreated: "2025-11-02", lastUpdated: "2025-11-08", channel: "Chat"  },
  { id: "TCK-003", customer: "TechNova Ltd.",  issue: "Request for data export", description: "Customer requested CSV export of all user data for audit purposes.",  priority: "Low",    status: "Resolved",    assignedTo: "John Doe",       dateCreated: "2025-10-25", lastUpdated: "2025-11-01", channel: "Phone" },
];

// ─── Deals ────────────────────────────────────────────────────────────────────
export const dealsData = [
  { id: "DEAL-001", name: "Website Redesign Project",    company: "Sharma Designs",  contactPerson: "Priya Sharma",   stage: "Proposal Sent", value: "$3,000",  probability: 70,  expectedClose: "2025-11-25", status: "Active", assignedTo: "Sarah Kim",      notes: "Waiting for client to review proposal." },
  { id: "DEAL-002", name: "Cloud Migration Service",     company: "TechNova Ltd.",   contactPerson: "Lucas Martínez", stage: "Negotiation",   value: "$12,000", probability: 60,  expectedClose: "2025-12-10", status: "Active", assignedTo: "John Doe",       notes: "Negotiation on pricing terms." },
  { id: "DEAL-003", name: "CRM Subscription Renewal",   company: "Acme Corp",       contactPerson: "John Doe",       stage: "Closed Won",    value: "$1,200",  probability: 100, expectedClose: "2025-10-30", status: "Won",    assignedTo: "Priya Sharma",   notes: "Deal successfully renewed for 12 months." },
  { id: "DEAL-004", name: "Marketing Automation Package",company: "Bright Marketing",contactPerson: "Sarah Kim",      stage: "Closed Lost",   value: "$2,500",  probability: 0,   expectedClose: "2025-09-20", status: "Lost",   assignedTo: "Lucas Martínez", notes: "Client chose competitor's product." },
];

// ─── Reports ──────────────────────────────────────────────────────────────────
export const reportsData = {
  summary: { totalLeads: 145, totalCustomers: 87, dealsWon: 35, dealsLost: 12, totalRevenue: 45000, conversionRate: 24, avgDealValue: 1285 },
  monthlySales: [
    { month: "Jan", value: 10000 }, { month: "Feb", value: 14000 },
    { month: "Mar", value: 18000 }, { month: "Apr", value: 22000 },
    { month: "May", value: 26000 }, { month: "Jun", value: 30000 },
    { month: "Jul", value: 28000 }, { month: "Aug", value: 31000 },
    { month: "Sep", value: 33000 }, { month: "Oct", value: 40000 },
    { month: "Nov", value: 45000 }, { month: "Dec", value: 48000 },
  ],
  dealStatus:    [{ name: "Won", value: 35 }, { name: "Lost", value: 12 }, { name: "Active", value: 28 }],
  topSalesReps:  [{ name: "Sarah Kim", value: 12000 }, { name: "Priya Sharma", value: 10000 }, { name: "John Doe", value: 9000 }, { name: "Lucas Martínez", value: 8000 }],
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const CheckBoxData = [
  { id: 1, text: "Follow up with John Doe",       completed: false },
  { id: 2, text: "Send contract to Acme Inc",     completed: false },
  { id: 3, text: "Call Jane Smith",               completed: false },
  { id: 4, text: "Prepare proposal for XYZ Corp", completed: false },
  { id: 5, text: "Schedule product demo",         completed: false },
];




// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasksData = [
  { id: 1, title: "Follow up with Mary Johnson", desc: "Send pricing proposal for Q2 deal — she asked for it last call.", type: "follow-up", priority: "high", due: "2025-05-26", lead: "Mary Johnson", company: "Innovate Inc.", done: false },
  { id: 2, title: "Schedule demo with Michael Davis", desc: "Tech Corp. is qualified — book a 30-min product walkthrough.", type: "call", priority: "medium", due: "2025-05-27", lead: "Michael Davis", company: "Tech Corp.", done: false },
  { id: 3, title: "Review deal: Cloud Migration Service", desc: "Negotiation phase — check TechNova's latest counter-offer.", type: "deal", priority: "high", due: "2025-05-25", lead: "Lucas Martínez", company: "TechNova Ltd.", done: false },
  { id: 4, title: "Send onboarding docs to Laura Green", desc: "Converted lead — share welcome kit and access credentials.", type: "email", priority: "low", due: "2025-05-28", lead: "Laura Green", company: "Data Systems", done: true },
  { id: 5, title: "Resolve billing error ticket", desc: "Priya Sharma billing dispute is in-progress — follow up with support.", type: "support", priority: "medium", due: "2025-05-26", lead: "Priya Sharma", company: "Sharma Designs", done: false },
  { id: 6, title: "Prepare monthly report", desc: "Compile lead conversion and revenue data for May review meeting.", type: "report", priority: "low", due: "2025-05-31", lead: null, company: null, done: false },
];