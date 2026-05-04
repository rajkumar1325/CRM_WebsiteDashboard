# CuRiemCRM — Full-Stack CRM Platform

> **Manage clients, projects & tasks in one system.**  
> CuriumCRM bridges the gap between client relationships and project delivery. Role-based dashboards, automated deadline tracking, and a shared event calendar — built for teams that build things.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Frontend Modules](#frontend-modules)
  - [Landing Page](#landing-page)
  - [Leads Module](#leads-module)
  - [Customers Module](#customers-module)
- [Backend Architecture](#backend-architecture)
  - [Controllers](#controllers)
  - [Services](#services)
  - [Entities & Repositories](#entities--repositories)
  - [Security](#security)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)

---

## Overview

CuRiemCRM is a full-stack Customer Relationship Management platform that unifies lead tracking, customer management, project delivery, and team collaboration into a single system. It supports three distinct user roles:

- **Admin** — Full access to all modules, reports, and settings
- **Employee** — Access to assigned leads, tasks, and projects
- **Customer** — Access to their own project and ticket status

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (JSX), Vite |
| Backend | Java (Spring Boot) |
| Auth | JWT (JSON Web Tokens) + BCrypt |
| Database | MySQL (via Spring Data JPA) |
| Security | Spring Security (RBAC) |
| API Pattern | RESTful APIs |

---

## Project Structure

### Frontend — `LandingPage/`

```
LandingPage/
└── src/
    ├── assets/
    ├── sections/
    │   ├── CTASection.jsx
    │   ├── FAQSection.jsx
    │   ├── FeaturesSection.jsx
    │   ├── FooterSection.jsx
    │   ├── HeroSection.jsx
    │   ├── Navbar.jsx
    │   ├── PricingSection.jsx
    │   ├── TestimonialsSection.jsx
    │   └── WorkflowSection.jsx
    ├── shared/
    ├── data.js
    ├── LandingPage.jsx
    └── landingStyles.js
```

### Backend — `CuriemCRM Backend (LandingPage AUTH)/`

```
src/main/java/in/SpringBootProject/crm/CuriemCRM/
├── api/
│   ├── CustomersApi.java
│   ├── FollowUpsApi.java
│   ├── InquiryApi.java
│   └── OrdersApi.java
├── controller/
├── dto/
├── entity/
├── enums/
├── exception/
├── Repository/
├── security/
└── services/
```

---

## Authentication

### Landing Page — Sign Up / Login

The landing page (`/`) features a role-based auth panel where users can register or log in as **Admin**, **Employee**, or **Customer**.

![Auth UI](screenshots/landing-auth.png)

**Sign Up fields:**
- Company Name
- Work Email
- Phone & City
- Password (min. 8 characters)
- Confirm Password

After sign-up, a **workspace** is created with a 14-day free trial, no credit card required.

### Backend Auth Flow

**Database table:** `auth_users`

| Column | Type |
|--------|------|
| id | INT (PK) |
| email | VARCHAR(150) |
| password | VARCHAR(255) — BCrypt hashed |
| role | ENUM: ADMIN / EMPLOYEE / CUSTOMER |

**Security layer (`/security/`):**

| Class | Responsibility |
|-------|---------------|
| `JwtService` | Token generation and validation |
| `JwtAuthenticationFilter` | Intercepts requests and validates Bearer tokens |
| `CustomUserDetailsService` | Loads user by email for Spring Security |
| `SecurityConfig` | Defines protected routes and CORS |
| `ApplicationRoles` | Role constants |
| `WebPaths` | Whitelisted public paths |
| `RbacAccessDeniedHandler` | Returns 403 for unauthorized access |
| `RbacAuthenticationEntryPoint` | Returns 401 for unauthenticated requests |
| `PasswordMatchService` | Password validation helper |
| `MvcSecurityHelper` | MVC security utilities |

**Relevant Controllers:**
- `AuthController` — `/auth/register`, `/auth/login`
- `UserController` — `/user/...` (profile, role management)

---

## Frontend Modules

### Landing Page

The public-facing marketing site for CuriumCRM. Built with React and split into composable section components.

**Sections included:**

| Component | Description |
|-----------|-------------|
| `Navbar.jsx` | Navigation with Login & Start Free CTA |
| `HeroSection.jsx` | Main headline, tagline, and auth sign-up form |
| `FeaturesSection.jsx` | Key product feature highlights |
| `WorkflowSection.jsx` | Visual workflow explanation |
| `PricingSection.jsx` | Pricing tiers |
| `TestimonialsSection.jsx` | Customer testimonials |
| `FAQSection.jsx` | Frequently asked questions |
| `CTASection.jsx` | Bottom call-to-action |
| `FooterSection.jsx` | Links, legal, social |

---

### Leads Module

**Frontend:** Leads dashboard with full CRUD, filtering, and status management.

**Features:**
- Filter tabs: All / New / Contacted / Qualified / Converted / Lost
- Summary stats: Total Leads, Active, Converted, Revenue
- Sortable table with columns: ID, Name, Company, Status, Source, Conversion Date, Deal Status, Received Amount, Actions
- Add Lead button with form
- Edit and Delete per row

**Backend — `leads` table schema:**

| Column | Type |
|--------|------|
| id | INT (PK) |
| full_name | VARCHAR(100) |
| email | VARCHAR(150) |
| phone | VARCHAR(30) |
| company | VARCHAR(100) |
| status | ENUM (new, contacted, qualified, converted, lost) |
| source | ENUM (Website, Referral, Social Media, Email Campaign, Cold Call) |
| agent_id | INT (FK → agents) |
| customer_id | INT (FK → customers) |
| conversion_date | DATE |
| deal_status | ENUM (Active, Closed) |
| received_amount | DECIMAL(12,2) |
| notes | TEXT |
| created_at | DATETIME |
| updated_at | DATETIME |

**Backend class:** `LeadController` → `LeadService` → `LeadRepository`  
**DTO:** `LeadDTO`

---

### Customers Module

**Frontend:** Customer dashboard with card-based layout.

**Features:**
- Filter tabs: All Customers / Active / Closed
- Summary stats: Total, Active, Closed, Revenue
- Customer cards showing: name, company, status badge, email, phone, product ID, purchase date, contract value
- View button per customer

**Backend — `customers` table schema:**

| Column | Type |
|--------|------|
| id | INT (PK) |
| customer_code | VARCHAR(10) |
| full_name | VARCHAR(100) |
| company | VARCHAR(100) |
| email | VARCHAR(150) |
| phone | VARCHAR(30) |
| address | TEXT |
| product_id | INT |
| purchase_date | DATE |
| contract_value | DECIMAL(12,2) |
| plan | ENUM |
| plan_price | DECIMAL(10,2) |
| plan_renew_date | DATE |
| seat_limit | SMALLINT |
| seats_used | SMALLINT |
| status | ENUM (Active, closed) |
| ban_status | — |
| avatar_url | VARCHAR(255) |
| created_at | DATETIME |
| updated_at | DATETIME |

**Backend class:** `CustomerController` → `CustomerService` → `CustomerRepository`  
**DTOs:** `CustomerDTO`, `CustomerStatsDTO`  
**Enums:** `CustomerPlan`, `CustomerStatus`

---

## Backend Architecture

### Controllers

| Controller | Routes / Responsibility |
|------------|------------------------|
| `AuthController` | Register, Login |
| `AdminController` | Admin-only operations |
| `UserController` | User profile and management |
| `EmployeeController` | Employee dashboard data |
| `LeadController` | Lead CRUD + status updates |
| `CustomerController` | Customer CRUD + stats |
| `ProjectController` | Project creation and tracking |
| `OrdersChartController` | Orders analytics |
| `FeedbackController` | Feedback submission and retrieval |
| `FollowUpsController` | Follow-up scheduling |
| `InquiryController` | Inquiry handling |
| `EmpSalesInfoController` | Employee sales data |

### Services

| Service | Purpose |
|---------|---------|
| `LeadService` | Lead business logic |
| `CustomerService` | Customer operations |
| `EmployeeService` | Employee management |
| `OrdersService` | Order processing |
| `OrdersChartService` | Chart/analytics data |
| `FeedbackService` | Feedback logic |
| `FollowUpsService` | Follow-up scheduling |
| `InquiryService` | Inquiry processing |
| `CourseService` | Course management |
| `ClientService` | Client operations |
| `EmpSalesInfoService` | Sales info aggregation |

### Entities & Repositories

**Entities:**

`AuthUser`, `AuthRole`, `BannedUsers`, `Customer`, `Lead`, `Employee`, `EmployeeOrders`, `Feedback`, `FollowUps`, `Inquiry`, `Orders`, `Course`

**Repositories (Spring Data JPA):**

`AuthUserRepository`, `CustomerRepository`, `LeadRepository`, `EmployeeRepository`, `EmployeeOrdersRepository`, `FeedbackRepository`, `FollowUpsRepository`, `InquiryRepository`, `OrdersRepository`, `OrdersChartRepository`, `CourseRepository`, `EmpSalesInfoRepository`, `ClientRepository`

### Security

JWT-based stateless authentication with role-based access control (RBAC).

- Tokens issued on login via `AuthController`
- Every protected request passes through `JwtAuthenticationFilter`
- Role enforcement via Spring Security method-level annotations
- BCrypt password hashing with `PasswordMatchService`

---

## Database Schema

The full database contains **20+ tables** covering all CRM domains:

| Domain | Tables |
|--------|--------|
| Auth & Users | `auth_users` |
| CRM Core | `leads`, `customers`, `agents` |
| Projects | `projects`, `project_tasks`, `project_members`, `project_task_implementers` |
| Orders | `orders` (via `EmployeeOrders`) |
| Communication | `call_history`, `invitations`, `meetings`, `meeting_attendees` |
| Support | `support_tickets` |
| Products | `products` |
| Settings | `organization_settings`, `notifications_config` |
| Scheduling | `calendar_events` |
| Activity | `activity_log` |
| Tasks | `tasks` |
| Deals | `deals` |

**Key relationships:**
- `leads` → `agents` (via `agent_id`)
- `leads` → `customers` (via `customer_id`)
- `projects` → `customers` (via `customer_id`)
- `project_tasks` → `projects` (via `project_id`)
- `tasks` → `leads`, `customers` (via FKs)
- `meetings` → `projects`, `leads` (via FKs)
- `support_tickets` → `customers` (via `customer_id`)
- `calendar_events` → `projects`, `owners`

---

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8+

### Frontend Setup

```bash
cd LandingPage
npm install
npm run dev
```

### Backend Setup

```bash
# Configure your database in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/curiemcrm
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Run the Spring Boot app
./mvnw spring-boot:run
```

### Default Roles

| Role | Access |
|------|--------|
| ADMIN | Full system access |
| EMPLOYEE | Leads, Tasks, Projects, Calendar |
| CUSTOMER | Own project status, Support tickets |

---

## API External Integrations

The `api/` layer provides external-facing API classes:

- `CustomersApi` — External customer data sync
- `FollowUpsApi` — Follow-up webhook/integration
- `InquiryApi` — Inquiry intake from landing page
- `OrdersApi` — Order data integration

---

*Built with Spring Boot + React · JWT Auth · MySQL · Role-Based Access Control*