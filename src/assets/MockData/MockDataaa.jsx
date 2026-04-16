/**
 *                                          FULL MOCK DATA
 *          fields:
 *  id
 *  name
 *  company
 *  status            -> stage (new, qualified, contacted, converted, lost)
 *  source
 * 
 *  createdAt         -> lead starting date {required for daily lead counts}
 *  statusUpdatedAt   -> date {required for daily active/closed tracking}
 * 
 *  conversionDate    -> present only for converted leads {required for daily active/closed tracking}
 *  dealStatus        -> "active" | "close"   <-- (you asked for this)
 *  receivedAmount    -> number (0 if not converted)
 * 
 *  
 */
export const mockData = [
  {
    id: 267881,
    name: "Robert White",
    email: "robert.white@datacorp.com",
    company: "DataCorp",
    status: "new",
    source: "Referral",

    createdAt: "2025-12-04 10:10",
    statusUpdatedAt: "2025-12-04 10:10",
    conversionDate: "2025-02-14",

    dealStatus: "active",
    receivedAmount: 1000,
    purchaseDate: "2025-12-01 14:22",

    callHistory: [
      {
        callNumber: "+91 3453 43210",
        feedback: "The Hello dear but needs follow-up.",
        rating: 4,
        time: "2025-01-22 14:32",
        contactedBy: "Rajesh verma",
        contactType: "Call"
      }
    ]
  },

  {
    id: 498276,
    name: "Lowerance Evans",
    email: "lowerance.evans@techify.com",
    company: "Techify",
    status: "contacted",
    source: "Website",

    createdAt: "2025-02-10 09:30",
    statusUpdatedAt: "2025-12-04 14:00",
    conversionDate: "2025-02-14",

    dealStatus: "close",
    receivedAmount: 95000,
    purchaseDate: "2025-02-28 11:45",

    callHistory: [
      {
        callNumber: "+91 98765 43210",
        feedback: "This is hello but needs follow-up.",
        rating: 4,
        time: "2025-02-21 14:32",
        contactedBy: "Rohan verma",
        contactType: "Call"
      }
    ]
  },

  {
    id: 732145,
    name: "Sarah Kim",
    email: "sarah.kim@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Social Media",

    createdAt: "2025-02-22 11:18",
    statusUpdatedAt: "2025-03-22 10:30",
    conversionDate: "2025-03-22",

    dealStatus: "close",
    receivedAmount: 175000,
    purchaseDate: "2025-12-01 16:33",

    callHistory: [
      {
        callNumber: "+91 98765 43210",
        feedback: "The client was interested but needs follow-up.",
        rating: 4,
        time: "2025-01-22 14:32",
        contactedBy: "Roshan verma",
        contactType: "Email"
      }
    ]
  },

  {
    id: 812364,
    name: "Jason Brown",
    email: "jason.brown@solutionsco.com",
    company: "Solutions Co.",
    status: "converted",
    source: "Email Campaign",

    createdAt: "2025-12-04 09:10",
    statusUpdatedAt: "2025-04-01 12:10",
    conversionDate: "2025-04-01",

    dealStatus: "close",
    receivedAmount: 140000,
    purchaseDate: "2025-01-18 10:12",

    callHistory: [
      {
        callNumber: "+91 98765 43210",
        feedback: "The client was interested but needs follow-up.",
        rating: 4,
        time: "2025-01-22 14:32",
        contactedBy: "Ravi verma",
        contactType: "Call"
      }
    ]
  },

  {
    id: 964523,
    name: "Elizabeth Grey",
    email: "elizabeth.grey@techcorp.com",
    company: "Tech Corp.",
    status: "new",
    source: "Website",

    createdAt: "2015-01-20 12:05",
    statusUpdatedAt: "2015-01-20 12:05",
    conversionDate: "2025-04-18",

    dealStatus: "close",
    receivedAmount: 210000,
    purchaseDate: "2015-01-28 13:40",

    callHistory: [
      {
        callNumber: "+91 98765 43210",
        feedback: "The client was interested but needs follow-up.",
        rating: 4,
        time: "2025-01-22 14:32",
        contactedBy: "Rajesh sharma",
        contactType: "Email"
      }
    ]
  },

  {
    id: 174862,
    name: "Laura Green",
    email: "laura.green@datasystems.com",
    company: "Data Systems",
    status: "converted",
    source: "Referral",

    createdAt: "2025-11-20 14:20",
    statusUpdatedAt: "2025-12-05 13:40",
    conversionDate: "2025-05-09",

    dealStatus: "close",
    receivedAmount: 88000,
    purchaseDate: "2025-11-28 19:55",

    callHistory: [
      {
        callNumber: "+91 98765 43210",
        feedback: "The client was interested but needs follow-up.",
        rating: 4,
        time: "2025-01-22 14:32",
        contactedBy: "Rohan verma",
        contactType: "Email"
      }
    ]
  },

  {
    id: 653217,
    name: "Kevin Hill",
    email: "kevin.hill@globalsoftwares.com",
    company: "Global Softwares",
    status: "converted",
    source: "Cold Call",

    createdAt: "2025-11-25 12:00",
    statusUpdatedAt: "2025-12-05 10:05",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 165000,
    purchaseDate: "2025-12-02 12:05",

    callHistory: [
      {
        callNumber: "+91 98765 43210",
        feedback:
          "The client was interested and are ready to buy our project but needs follow-up.",
        rating: 4,
        time: "2025-01-22 14:32",
        contactedBy: "Sohan verma",
        contactType: "Call"
      }
    ]
  },

  {
    id: 762931,
    name: "John Doe",
    email: "john.doe@innovateinc.com",
    company: "Innovate Inc.",
    status: "qualified",
    source: "Website",

    createdAt: "2025-01-01 11:30",
    statusUpdatedAt: "2025-12-05 09:30",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-02 17:50"
  },

  {
    id: 849523,
    name: "Jane Smith",
    email: "jane.smith@solutionsco.com",
    company: "Solutions Co.",
    status: "new",
    source: "Referral",

    createdAt: "2025-01-01 14:00",
    statusUpdatedAt: "2025-12-05 14:00",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-03 09:48"
  },

  {
    id: 951246,
    name: "Peter Jones",
    email: "peter.jones@techcorp.com",
    company: "Tech Corp.",
    status: "contacted",
    source: "Social Media",

    createdAt: "2025-11-30 10:22",
    statusUpdatedAt: "2025-12-05 13:15",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-12-04 18:32"
  },

  {
    id: 103852,
    name: "Mary Johnson",
    email: "mary.johnson@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Website",

    createdAt: "2023-12-28 09:00",
    statusUpdatedAt: "2025-12-05 11:40",
    conversionDate: "2024-01-15",

    dealStatus: "close",
    receivedAmount: 110000,
    purchaseDate: "2025-01-05 12:59"
  },

  {
    id: 118945,
    name: "David Williams",
    email: "david.williams@datasystems.com",
    company: "Data Systems",
    status: "lost",
    source: "Cold Call",

    createdAt: "2025-11-01 10:10",
    statusUpdatedAt: "2025-12-05 14:30",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-11-03 11:20"
  },

  {
    id: 129478,
    name: "Emily Brown",
    email: "emily.brown@solutionsco.com",
    company: "Solutions Co.",
    status: "new",
    source: "Website",

    createdAt: "2025-01-05 10:40",
    statusUpdatedAt: "2025-01-05 10:40",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-07 15:05"
  },

  {
    id: 137592,
    name: "Michael Davis",
    email: "michael.davis@techcorp.com",
    company: "Tech Corp.",
    status: "qualified",
    source: "Referral",

    createdAt: "2025-01-06 09:15",
    statusUpdatedAt: "2025-01-08 09:00",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-08 14:10"
  },

  {
    id: 148236,
    name: "Sophia Taylor",
    email: "sophia.taylor@brightfuture.com",
    company: "Bright Future Ltd.",
    status: "new",
    source: "Social Media",

    createdAt: "2025-12-02 14:00",
    statusUpdatedAt: "2025-12-02 14:00",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-12-03 19:45"
  },

  {
    id: 159847,
    name: "Daniel Wilson",
    email: "daniel.wilson@nextgentech.com",
    company: "NextGen Tech",
    status: "contacted",
    source: "Website",

    createdAt: "2025-04-25 09:30",
    statusUpdatedAt: "2025-04-27 12:30",
    conversionDate: "2025-12-01",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-04-28 09:55"
  },

  {
    id: 163924,
    name: "Olivia Martinez",
    email: "olivia.martinez@visionarysolutions.com",
    company: "Visionary Solutions",
    status: "qualified",
    source: "Referral",

    createdAt: "2025-01-09 10:05",
    statusUpdatedAt: "2025-01-10 12:35",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2025-01-10 13:10"
  },

  {
    id: 174658,
    name: "James Anderson",
    email: "james.anderson@globalsoftwares.com",
    company: "Global Softwares",
    status: "converted",
    source: "Email Campaign",

    createdAt: "2023-12-18 10:20",
    statusUpdatedAt: "2024-02-20 11:10",
    conversionDate: "2024-02-20",

    dealStatus: "close",
    receivedAmount: 132000,
    purchaseDate: "2025-02-15 11:42"
  },

  {
    id: 186523,
    name: "Ava Thomas",
    email: "ava.thomas@datasystems.com",
    company: "Data Systems",
    status: "lost",
    source: "Cold Call",

    createdAt: "2025-04-18 10:00",
    statusUpdatedAt: "2025-05-25 12:00",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-04-23 10:34"
  },

  {
    id: 197351,
    name: "William Garcia",
    email: "william.garcia@innovateinc.com",
    company: "Innovate Inc.",
    status: "qualified",
    source: "Website",

    createdAt: "2021-01-20 10:00",
    statusUpdatedAt: "2021-01-28 10:00",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2021-01-28 14:45"
  },

  {
    id: 203467,
    name: "Isabella Martinez",
    email: "isabella.martinez@solutionsco.com",
    company: "Solutions Co.",
    status: "contacted",
    source: "Social Media",

    createdAt: "2022-01-20 13:00",
    statusUpdatedAt: "2022-01-27 09:40",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2022-01-28 15:58"
  },

  {
    id: 219456,
    name: "Benjamin Lee",
    email: "benjamin.lee@futuretech.com",
    company: "Future Tech Ltd.",
    status: "new",
    source: "Referral",

    createdAt: "2023-01-25 11:00",
    statusUpdatedAt: "2023-01-25 11:00",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2023-01-28 17:20"
  },

  {
    id: 223785,
    name: "Charlotte Walker",
    email: "charlotte.walker@brightfuture.com",
    company: "Bright Future Ltd.",
    status: "converted",
    source: "Website",

    createdAt: "2011-01-10 10:40",
    statusUpdatedAt: "2024-03-05 12:20",
    conversionDate: "2024-03-05",

    dealStatus: "close",
    receivedAmount: 98000,
    purchaseDate: "2011-01-28 13:19"
  },

  {
    id: 234871,
    name: "Lucas Hall",
    email: "lucas.hall@visionarysolutions.com",
    company: "Visionary Solutions",
    status: "lost",
    source: "Cold Call",

    createdAt: "2012-01-16 11:22",
    statusUpdatedAt: "2025-05-25 09:30",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2012-01-28 18:00"
  },

  {
    id: 247953,
    name: "Mia Young",
    email: "mia.young@nextgentech.com",
    company: "NextGen Tech",
    status: "qualified",
    source: "Social Media",

    createdAt: "2014-01-20 10:20",
    statusUpdatedAt: "2014-01-28 13:30",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2014-01-28 11:35"
  },

  {
    id: 258417,
    name: "Ethan Allen",
    email: "ethan.allen@techcorp.com",
    company: "Tech Corp.",
    status: "contacted",
    source: "Email Campaign",

    createdAt: "2001-01-20 12:10",
    statusUpdatedAt: "2001-01-27 10:30",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2001-01-28 16:40"
  },

  {
    id: 268934,
    name: "Amelia King",
    email: "amelia.king@globalsoftwares.com",
    company: "Global Softwares",
    status: "new",
    source: "Website",

    createdAt: "2002-01-20 14:30",
    statusUpdatedAt: "2002-01-20 14:30",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2002-01-28 14:48"
  },

  {
    id: 279846,
    name: "Robert White",
    email: "robert.white@datacorp.com",
    company: "DataCorp",
    status: "converted",
    source: "Referral",

    createdAt: "2003-01-10 11:20",
    statusUpdatedAt: "2025-01-28 10:30",
    conversionDate: "2025-01-28",

    dealStatus: "active",
    receivedAmount: 15000,
    purchaseDate: "2003-01-28 10:50"
  },

  {
    id: 289561,
    name: "Chris Evans",
    email: "chris.evans@techify.com",
    company: "Techify",
    status: "converted",
    source: "Website",

    createdAt: "2004-01-15 09:10",
    statusUpdatedAt: "2025-02-14 09:30",
    conversionDate: "2025-02-14",

    dealStatus: "close",
    receivedAmount: 12000,
    purchaseDate: "2004-01-28 09:55"
  },

  {
    id: 299817,
    name: "Sarah Kim",
    email: "sarah.kim@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Social Media",

    createdAt: "2005-01-12 10:10",
    statusUpdatedAt: "2005-01-20 12:30",
    conversionDate: "2025-03-22",

    dealStatus: "active",
    receivedAmount: 18000,
    purchaseDate: "2005-01-28 12:12"
  },

  {
    id: 306784,
    name: "Jason Brown",
    email: "jason.brown@solutionsco.com",
    company: "Solutions Co.",
    status: "converted",
    source: "Email Campaign",

    createdAt: "2006-01-10 10:00",
    statusUpdatedAt: "2025-04-01 11:40",
    conversionDate: "2025-04-01",

    dealStatus: "close",
    receivedAmount: 20000,
    purchaseDate: "2006-01-28 15:18"
  },

  {
    id: 312958,
    name: "Elizabeth Grey",
    email: "elizabeth.grey@techcorp.com",
    company: "Tech Corp.",
    status: "converted",
    source: "Website",

    createdAt: "2007-01-15 10:30",
    statusUpdatedAt: "2025-04-18 10:20",
    conversionDate: "2025-04-18",

    dealStatus: "active",
    receivedAmount: 22000,
    purchaseDate: "2007-01-28 11:30"
  },

  {
    id: 324879,
    name: "Laura Green",
    email: "laura.green@datasystems.com",
    company: "Data Systems",
    status: "qualified",
    source: "Referral",

    createdAt: "2008-01-20 09:10",
    statusUpdatedAt: "2008-01-28 13:00",
    conversionDate: "2025-05-25",

    dealStatus: "active",
    receivedAmount: 0,
    purchaseDate: "2008-01-28 19:33"
  },

  {
    id: 336512,
    name: "John Doe",
    email: "john.doe@innovateinc.com",
    company: "Innovate Inc.",
    status: "qualified",
    source: "Website",

    createdAt: "2025-03-20 09:20",
    statusUpdatedAt: "2025-03-28 12:00",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-03-28 18:30"
  },

  {
    id: 347916,
    name: "Mary Johnson",
    email: "mary.johnson@innovateinc.com",
    company: "Innovate Inc.",
    status: "converted",
    source: "Website",

    createdAt: "2025-11-01 13:00",
    statusUpdatedAt: "2024-01-15 11:00",
    conversionDate: "2024-01-15",

    dealStatus: "close",
    receivedAmount: 14000,
    purchaseDate: "2025-11-10 20:40"
  },

  {
    id: 358724,
    name: "David Williams",
    email: "david.williams@datasystems.com",
    company: "Data Systems",
    status: "lost",
    source: "Cold Call",

    createdAt: "2025-11-01 10:00",
    statusUpdatedAt: "2025-05-25 14:20",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-11-04 11:55"
  },

  {
    id: 369528,
    name: "Michael Davis",
    email: "michael.davis@techcorp.com",
    company: "Tech Corp.",
    status: "qualified",
    source: "Referral",

    createdAt: "2025-01-28 10:00",
    statusUpdatedAt: "2025-01-31 11:20",
    conversionDate: "2025-05-25",

    dealStatus: "close",
    receivedAmount: 0,
    purchaseDate: "2025-01-31 14:25"
  },

  {
    id: 372814,
    name: "James Anderson",
    email: "james.anderson@globalsoftwares.com",
    company: "Global Softwares",
    status: "converted",
    source: "Email Campaign",

    createdAt: "2025-06-18 10:10",
    statusUpdatedAt: "2024-02-20 11:00",
    conversionDate: "2024-02-20",

    dealStatus: "close",
    receivedAmount: 17500,
    purchaseDate: "2025-06-22 16:45"
  }
];





// Data for the 'Customers' table view
export const customersData = [
  {
    id: "CUST-1001",
    name: "John Doe",
    company: "Acme Corp",
    address: "12 Market St, Suite 400, San Francisco, CA 94103",
    phone: "+1 (555) 123-4567",
    email: "john.doe@acmecorp.com",
    product: "CRM Pro Subscription",
    purchaseDate: "2024-08-10",
    purchaseTime: "10:30",
    status: "Active",
    value: 12000,
    profilePhoto: null,
  },
  {
    id: "CUST-1002",
    name: "Sarah Kim",
    company: "Innovate Inc.",
    address: "88 Innovation Drive, Palo Alto, CA 94301",
    phone: "+1 (650) 555-2412",
    email: "sarah.kim@innovate.inc",
    product: "Analytics Suite",
    purchaseDate: "2023-07-22",
    purchaseTime: "14:05",
    status: "closed",
    value: 4500,
    profilePhoto: null,
  },
  {
    id: "CUST-1003",
    name: "Priya Sharma",
    company: "Sharma Designs",
    address: "7 Elm Avenue, Portland, OR 97204",
    phone: "+1 (503) 555-9876",
    email: "priya@sharmadesigns.com",
    product: "Project Tracker",
    purchaseDate: "2024-11-05",
    purchaseTime: "09:15",
    status: "Active",
    value: 3000,
    profilePhoto: null,
  },
  {
    id: "CUST-1004",
    name: "Lucas Martínez",
    company: "TechNova Ltd.",
    address: "Calle 58 #142, Mexico City, 01000",
    phone: "+52 (55) 1234-5678",
    email: "lucas.m@technova.mx",
    product: "Cloud Storage",
    purchaseDate: "2025-02-18",
    purchaseTime: "16:45",
    status: "Active",
    value: 12000,
    profilePhoto: null,
  },
  {
    id: "CUST-1005",
    name: "Emma Wilson",
    company: "GreenLeaf",
    address: "341 Green Rd, Seattle, WA 98101",
    phone: "+1 (206) 555-0101",
    email: "emma.wilson@greenleaf.com",
    product: "Finance Manager",
    purchaseDate: "2024-09-28",
    purchaseTime: "11:20",
    status: "Active",
    value: 2800,
    profilePhoto: null,
  },
  {
    id: "CUST-1006",
    name: "Oliver Stone",
    company: "FuturaTech",
    address: "9 Bishop's Lane, London, UK W1D 3BQ",
    phone: "+44 20 7946 0800",
    email: "oliver.stone@futuratech.co.uk",
    product: "AI Assistant",
    purchaseDate: "2024-03-12",
    purchaseTime: "13:00",
    status: "closed",
    value: 6500,
    profilePhoto: null,
  },
  {
    id: "CUST-1007",
    name: "Mona Das",
    company: "Neon Industries",
    address: "Plot 14, Sector 21, Gurgaon, Haryana 122001",
    phone: "+91 124 555 8899",
    email: "mona.das@neonind.com",
    product: "Security Suite",
    purchaseDate: "2025-01-30",
    purchaseTime: "10:50",
    status: "Active",
    value: 5200,
    profilePhoto: null,
  },
  {
    id: "CUST-1008",
    name: "Kevin Hill",
    company: "Global Softwares",
    address: "210 King St, Toronto, ON M5H 1J9",
    phone: "+1 (416) 555-3300",
    email: "kevin.hill@globalsoft.com",
    product: "HR Management System",
    purchaseDate: "2024-05-18",
    purchaseTime: "15:40",
    status: "closed",
    value: 4200,
    profilePhoto: null,
  },
  {
    id: "CUST-1009",
    name: "Linda Scott",
    company: "Prime Solutions",
    address: "4 West Park Ave, Boston, MA 02116",
    phone: "+1 (617) 555-9080",
    email: "linda.scott@primesol.com",
    product: "CRM Pro Subscription",
    purchaseDate: "2025-04-08",
    purchaseTime: "09:45",
    status: "Active",
    value: 1200,
    profilePhoto: null,
  },
  {
    id: "CUST-1010",
    name: "Ethan Moore",
    company: "LogicWave",
    address: "72 River Road, Austin, TX 78701",
    phone: "+1 (512) 555-4123",
    email: "ethan.moore@logicwave.com",
    product: "Analytics Suite",
    purchaseDate: "2024-12-20",
    purchaseTime: "17:10",
    status: "closed",
    value: 6000,
    profilePhoto: null,
  },
  {
    id: "CUST-1011",
    name: "Ava Collins",
    company: "SkyNet",
    address: "18 Ocean Drive, Miami, FL 33101",
    phone: "+1 (305) 555-2211",
    email: "ava.collins@skynet.com",
    product: "Cloud Storage",
    purchaseDate: "2025-06-14",
    purchaseTime: "12:30",
    status: "Active",
    value: 3400,
    profilePhoto: null,
  },
  {
    id: "CUST-1012",
    name: "Liam Turner",
    company: "NextGen Labs",
    address: "55 Innovation Blvd, Denver, CO 80202",
    phone: "+1 (303) 555-6677",
    email: "liam.turner@nextgenlabs.com",
    product: "Project Tracker",
    purchaseDate: "2024-07-09",
    purchaseTime: "10:05",
    status: "closed",
    value: 2100,
    profilePhoto: null,
  },
  {
    id: "CUST-1013",
    name: "Chloe Bennett",
    company: "Prime Solutions",
    address: "4 West Park Ave, Boston, MA 02116",
    phone: "+1 (617) 555-9081",
    email: "chloe.bennett@primesol.com",
    product: "ChatBot Pro",
    purchaseDate: "2024-10-02",
    purchaseTime: "16:00",
    status: "Active",
    value: 1800,
    profilePhoto: null,
  },
  {
    id: "CUST-1014",
    name: "Harshit Singh",
    company: "Data Systems",
    address: "A-23, Connaught Place, New Delhi, 110001",
    phone: "+91 11 5555 2244",
    email: "harshit.singh@datasys.in",
    product: "Security Suite",
    purchaseDate: "2025-03-28",
    purchaseTime: "11:50",
    status: "closed",
    value: 4800,
    profilePhoto: null,
  },
  {
    id: "CUST-1015",
    name: "Rita Kumari",
    company: "Bright Marketing",
    address: "No. 6, MG Road, Bengaluru, KA 560001",
    phone: "+91 80 5555 1212",
    email: "rita.kumari@brightmkt.com",
    product: "Marketing Automation",
    purchaseDate: "2025-09-01",
    purchaseTime: "09:10",
    status: "Active",
    value: 2500,
    profilePhoto: null,
  },
  {
    id: "CUST-1016",
    name: "Kabir Nayak",
    company: "Workcation",
    address: "23 Seaside Ave, Chennai, TN 600001",
    phone: "+91 44 5555 3344",
    email: "kabir.nayak@workcation.in",
    product: "HR Management System",
    purchaseDate: "2024-02-14",
    purchaseTime: "14:30",
    status: "Active",
    value: 4100,
    profilePhoto: null,
  },
  {
    id: "CUST-1017",
    name: "Sophia Patel",
    company: "Tailwind Labs",
    address: "101 Software Park, Bangalore, KA 560045",
    phone: "+91 80 5555 7788",
    email: "sophia.patel@tailwindlabs.com",
    product: "Analytics Suite",
    purchaseDate: "2025-05-21",
    purchaseTime: "15:15",
    status: "Active",
    value: 6200,
    profilePhoto: null,
  },
  {
    id: "CUST-1018",
    name: "Nina Kapoor",
    company: "Workcation",
    address: "9 Harbour St, Wellington 6011, NZ",
    phone: "+64 4 555 9911",
    email: "nina.kapoor@workcation.nz",
    product: "CRM Pro Subscription",
    purchaseDate: "2024-08-06",
    purchaseTime: "09:55",
    status: "Active",
    value: 1250,
    profilePhoto: null,
  },
  {
    id: "CUST-1019",
    name: "David Williams",
    company: "Global Softwares",
    address: "500 Tech Park, Columbus, OH 43215",
    phone: "+1 (614) 555-7800",
    email: "david.williams@globalsoft.com",
    product: "Finance Manager",
    purchaseDate: "2025-10-10",
    purchaseTime: "13:20",
    status: "Active",
    value: 3150,
    profilePhoto: null,
  },
  {
    id: "CUST-1020",
    name: "Peter Jones",
    company: "Solutions Co.",
    address: "12 North Wharf, Sydney, NSW 2000",
    phone: "+61 2 5550 7788",
    email: "peter.jones@solutionsco.au",
    product: "Project Tracker",
    purchaseDate: "2025-11-27",
    purchaseTime: "16:25",
    status: "closed",
    value: 1950,
    profilePhoto: null,
  },
];











//supportData
export const supportData = [
  
  {
    id: "TCK-001",
    customer: "John Doe",
    issue: "Login not working",
    description: "Customer is unable to log into their dashboard using Google sign-in.",
    priority: "High",
    status: "Open",
    assignedTo: "Sarah Kim",
    dateCreated: "2025-11-05",
    lastUpdated: "2025-11-10",
    channel: "Email",
  },
  {
    id: "TCK-002",
    customer: "Priya Sharma",
    issue: "Billing error",
    description: "Invoice shows incorrect amount for September.",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Lucas Martínez",
    dateCreated: "2025-11-02",
    lastUpdated: "2025-11-08",
    channel: "Chat",
  },
  {
    id: "TCK-003",
    customer: "TechNova Ltd.",
    issue: "Request for data export",
    description: "Customer requested CSV export of all user data for audit purposes.",
    priority: "Low",
    status: "Resolved",
    assignedTo: "John Doe",
    dateCreated: "2025-10-25",
    lastUpdated: "2025-11-01",
    channel: "Phone",
  },
];




export const dealsData = [
  {
    id: "DEAL-001",
    name: "Website Redesign Project",
    company: "Sharma Designs",
    contactPerson: "Priya Sharma",
    stage: "Proposal Sent",
    value: "$3,000",
    probability: 70,
    expectedClose: "2025-11-25",
    status: "Active",
    assignedTo: "Sarah Kim",
    notes: "Waiting for client to review proposal.",
  },
  {
    id: "DEAL-002",
    name: "Cloud Migration Service",
    company: "TechNova Ltd.",
    contactPerson: "Lucas Martínez",
    stage: "Negotiation",
    value: "$12,000",
    probability: 60,
    expectedClose: "2025-12-10",
    status: "Active",
    assignedTo: "John Doe",
    notes: "Negotiation on pricing terms.",
  },
  {
    id: "DEAL-003",
    name: "CRM Subscription Renewal",
    company: "Acme Corp",
    contactPerson: "John Doe",
    stage: "Closed Won",
    value: "$1,200",
    probability: 100,
    expectedClose: "2025-10-30",
    status: "Won",
    assignedTo: "Priya Sharma",
    notes: "Deal successfully renewed for 12 months.",
  },
  {
    id: "DEAL-004",
    name: "Marketing Automation Package",
    company: "Bright Marketing",
    contactPerson: "Sarah Kim",
    stage: "Closed Lost",
    value: "$2,500",
    probability: 0,
    expectedClose: "2025-09-20",
    status: "Lost",
    assignedTo: "Lucas Martínez",
    notes: "Client chose competitor’s product.",
  },
];








// reports section
export const reportsData = {
  summary: {
    totalLeads: 145,
    totalCustomers: 87,
    dealsWon: 35,
    dealsLost: 12,
    totalRevenue: 45000,
    conversionRate: 24,
    avgDealValue: 1285,
  },
  monthlySales: [
    { month: "Jan", value: 10000 },
    { month: "Feb", value: 14000 },
    { month: "Mar", value: 18000 },
    { month: "Apr", value: 22000 },
    { month: "May", value: 26000 },
    { month: "Jun", value: 30000 },
    { month: "Jul", value: 28000 },
    { month: "Aug", value: 31000 },
    { month: "Sep", value: 33000 },
    { month: "Oct", value: 40000 },
    { month: "Nov", value: 45000 },
    { month: "Dec", value: 48000 },
  ],
  dealStatus: [
    { name: "Won", value: 35 },
    { name: "Lost", value: 12 },
    { name: "Active", value: 28 },
  ],
  topSalesReps: [
    { name: "Sarah Kim", value: 12000 },
    { name: "Priya Sharma", value: 10000 },
    { name: "John Doe", value: 9000 },
    { name: "Lucas Martínez", value: 8000 },
  ],
};









// CHECKBOX DATA
// A mock array of tasks with a completed state.
export const CheckBoxData = [
    { id: 1, text: "Follow up with John Doe", completed: false },
    { id: 2, text: "Send contract to Acme Inc", completed: false },
    { id: 3, text: "Call Jane Smith", completed: false },
    { id: 4, text: "Prepare proposal for XYZ.Corp", completed: false },
    { id: 5, text: "Schedule product demo", completed: false },
];







// Data for Meetings
export const mockMeetingsData = [
    { id: 1, title: "Demo Call with Jane Smith", date: "Mar 11, 2024", time: "5:00 PM" },
    { id: 2, title: "Review Meeting with ABC Ltd", date: "Mar 12, 2024", time: "10:00 AM" },
    { id: 3, title: "Follow-up Call with John Doe", date: "Mar 13, 2024", time: "2:00 PM" },
    { id: 4, title: "Client Sync with Tech Solutions", date: "Mar 14, 2024", time: "11:00 AM" },
    { id: 5, title: "Team Standup", date: "Mar 14, 2024", time: "9:00 AM" },
];  