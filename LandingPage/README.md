# 🏢 CURIEM CRM

> **CUstomer Relationship Intelligence and Experiences Management**

A full-stack CRM web application built for Small and Medium-sized Enterprises (SMEs).  
Unifies customer management, project tracking, task assignment, analytics, and role-based access — all in one platform.

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | ReactJS, Redux, TailwindCSS |
| ⚙️ Backend | Spring Boot, Spring Security, JWT |
| 🗄️ Database | MySQL |
| ☁️ File Storage | AWS S3 |
| 🧪 API Testing | Postman |
| 🔀 Version Control | Git & GitHub |

---

## ✨ Features

- 🔐 **Role-Based Access Control (RBAC)** — Admin, Leader, and Member roles secured with Spring Security + JWT
- 👥 **Client Management** — Add, update, delete clients with profile image upload to AWS S3
- 📁 **Project Management** — Create projects linked to clients, assign leaders, track status
- ✅ **Task Management** — Assign tasks to Members, automated deadline-based status updates via Spring `@Scheduled`
- 📊 **Analytics Dashboard** — Task statistics and project-level performance charts
- 📅 **Event Calendar** — Create and manage internal meetings and deadlines
- 🔑 **Secure Authentication** — JWT login, token refresh, OTP-based password recovery
- 🌐 **Landing Page** — Public-facing marketing page with integrated signup/login card

---

## 👤 Role Hierarchy

| Role | ID | Who They Are | What They Can Do |
|---|---|---|---|
| 🔴 **Admin** | 1 | Workspace/Company Owner | Full access — manages users, clients, projects, billing. Creates Leader and Member accounts. |
| 🟡 **Leader** | 2 | Project Manager | Creates and manages projects and tasks. Monitors client performance. |
| 🟢 **Member** | 3 | Employee | Views and updates status of assigned tasks. Access to personal dashboard only. |

> 💡 **Important:** Only the Admin registers via the public landing page.  
> Leader and Member accounts are created by the Admin from **inside the dashboard** after login.

---

## 📁 Project Structure

```
src/
├── 📄 pages/
│   └── LandingPage.jsx          # Root — owns all shared state
│
├── 🧩 components/
│   ├── landing/
│   │   ├── Navbar.jsx           # Sticky nav with scroll-aware blur
│   │   ├── HeroSection.jsx      # Hero copy + AuthCard layout
│   │   ├── AuthCard.jsx         # Public signup / login form ⭐
│   │   ├── FeaturesSection.jsx  # Three feature cards
│   │   ├── PricingSection.jsx   # Three pricing tiers
│   │   ├── TestimonialsSection.jsx  # Auto-advancing carousel
│   │   ├── FaqSection.jsx       # Accordion FAQ
│   │   ├── CtaBanner.jsx        # Final call-to-action
│   │   └── Footer.jsx           # Links + copyright
│   │
│   └── ui/
│       ├── Toast.jsx            # Popup notification (success/error/info)
│       ├── Input.jsx            # Styled input with error state
│       ├── Field.jsx            # Label + input + error wrapper
│       └── PasswordStrengthBar.jsx  # 4-segment strength indicator
│
├── 📦 constants/
│   └── landingData.js           # All text content — edit here to update the page
│
├── 🛠️ utils/
│   └── authValidation.js        # Form validation logic
│
└── 🌐 services/
    └── authService.js           # Every API call to the Spring Boot backend
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Running CURIEM Spring Boot backend (default port `8888`)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/curiem-crm-landing.git
cd curiem-crm-landing

# 2. Install dependencies
npm install

# 3. Set the backend URL
echo "VITE_API_BASE=http://localhost:8888" > .env

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production

```bash
npm run build
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:8888` | Base URL of the Spring Boot backend |

---

## 🌐 API Endpoints

All API calls live in `src/services/authService.js`.

### 🔑 Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/login` | All roles | Log in any user |
| POST | `/api/v1/auth/register/{roleId}` | Public | Register Admin (workspace owner) |
| POST | `/api/v1/auth/refreshToken` | All roles | Refresh expired JWT |
| POST | `/api/v1/logout` | All roles | Invalidate token |
| POST | `/api/v1/auth/forgot-password` | Public | Send OTP to email |
| POST | `/api/v1/auth/verify-otp` | Public | Verify OTP code |
| POST | `/api/v1/auth/reset-password` | Public | Set new password |

### 👥 Clients

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/clients` | Admin, Leader | View all clients |
| POST | `/api/v1/clients` | Admin | Add client |
| PUT | `/api/v1/clients/{id}` | Admin | Update client |
| DELETE | `/api/v1/clients/{id}` | Admin | Delete client |
| POST | `/api/v1/client/image` | Admin | Upload image to S3 |

### 📁 Projects

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/projects` | All roles | View all projects |
| GET | `/api/v1/projects/{id}` | Admin, Leader | View specific project |
| POST | `/api/v1/projects` | Admin, Leader | Create project |
| PUT | `/api/v1/projects/{id}/originator/{originatorId}` | Admin, Leader | Update + reassign project |
| DELETE | `/api/v1/projects/{id}` | Admin, Leader | Delete project |

### 🏷️ Roles

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/roles` | — | View all roles |
| PUT | `/api/v1/roles` | Admin | Update role description |
| DELETE | `/api/v1/roles` | — | Delete role |

### 👤 Users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/users` | Admin, Leader | View all users |
| GET | `/api/v1/users/{id}` | Admin | View specific user |
| GET | `/api/v1/users/profile` | All roles | Own profile |
| POST | `/api/v1/users/role/{roleId}` | Admin | Create Leader or Member account |

### ✅ Tasks

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/tasks` | All roles | View all tasks |
| GET | `/api/v1/tasks/{id}` | All roles | View specific task |
| POST | `/api/v1/tasks/projects/{projectId}/users/{userId}` | Admin, Leader | Create + assign task |
| PUT | `/tasks/{id}` | Member | Update task status |

### 📊 Statistics

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/taskStatistics` | All roles | Task performance data |
| GET | `/api/v1/jobStatitstic/{projectId}` | Admin, Leader | Project statistics |

> ⚠️ `jobStatitstic` is the exact spelling in the backend controller. Do not correct it.

---

## 🎨 Tailwind Custom Animations

Add to `tailwind.config.js` if not already present:

```js
theme: {
  extend: {
    keyframes: {
      fade:  { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      shake: { "0%,100%": { transform: "translateX(0)" }, "20%,60%": { transform: "translateX(-6px)" }, "40%,80%": { transform: "translateX(6px)" } },
    },
    animation: {
      fade:  "fade 0.3s ease forwards",
      shake: "shake 0.45s ease",
    },
  },
},
```

---

## 🔗 Redux Integration (Next Step)

After successful login/signup, replace the `console.log` in `LandingPage.jsx` with:

```js
dispatch(setCredentials({ token: data.token, user: data.userProfile }));
navigate("/dashboard");
```

---

## 🗃️ Database Schema

```
clients ──< projects ──< tasks ──< implementers_tasks >── users
                                                              │
                                              users_roles >── roles
```

- One **Client** → many **Projects**
- One **Project** → many **Tasks**
- One **Task** → many **Users** (implementers) via join table
- One **User** → many **Roles** via join table

---

## 🔒 Security Notes

- 🔐 Passwords stored encrypted with BCrypt via Spring Security
- 🚫 JWT **never stored in `localStorage`** — goes into Redux state (XSS protection)
- 🛡️ All endpoints except auth/public routes require a valid JWT
- ✅ Public registration restricted to Admin (roleId = 1) only — enforced by backend

---

## 👨‍💻 Authors

| Name | Roll No. |
|---|---|
| Anshika Aggarwal | 2204920100024 |
| Raj Kumar | 2204920100118 |

**Project Guide:** Ms. Sarita Singh, Assistant Professor, Dept. of CSE  
**Institution:** KCC Institute of Technology and Management, Greater Noida

---

## 📄 License

Submitted as a 7th Semester B.Tech project at KCCITM, Greater Noida.  
© 2025 Anshika Aggarwal & Raj Kumar. All rights reserved.
