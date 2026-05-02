# CuriumCRM — Landing Page & Backend Auth Integration
> Complete technical documentation of everything built and connected.

---

## 📁 File Structure

```
src/
├── LandingPage.jsx          ← Main orchestrator (global state + layout)
├── landingStyles.js         ← All CSS/keyframes
├── data.js                  ← Static content
├── shared/
│   ├── Icons.jsx
│   ├── MiniCalendar.jsx
│   ├── RoleDashboardPreview.jsx
│   └── WorkflowStep.jsx
└── sections/
    ├── Navbar.jsx
    ├── HeroSection.jsx      ← Auth card lives here ← MAIN CHANGES HERE
    ├── WorkflowSection.jsx
    ├── FeaturesSection.jsx
    ├── PricingSection.jsx
    ├── TestimonialsSection.jsx
    ├── FAQSection.jsx
    ├── CTASection.jsx
    └── FooterSection.jsx
```

---

## 🔄 What Was Changed & Why

### 1. Roles Updated
**Old:** `Admin`, `Manager`, `Employee`  
**New:** `Admin`, `Employee`, `Customer`

Each role maps to specific backend endpoints and shows different form fields.

---

### 2. Unified `formData` State (LandingPage.jsx)

**Old approach** — individual states:
```js
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
```

**New approach** — single unified object:
```js
const [formData, setFormData] = useState({
  name: "",         // Customer only
  company: "",      // Admin/Employee only
  email: "",
  phone: "",        // Signup only
  city: "",         // Signup only
  password: "",
  confirmPassword: "",
});
```

**Why:** Easier to spread into the fetch body. One state = one source of truth.

---

### 3. Role-Based Form Fields (HeroSection.jsx)

| Field         | Admin    | Employee | Customer |
|---------------|----------|----------|----------|
| Company       | ✅ Show  | ✅ Show  | ❌ Hide  |
| Full Name     | ❌ Hide  | ❌ Hide  | ✅ Show  |
| Email         | ✅ Show  | ✅ Show  | ✅ Show  |
| Phone         | ✅ Show  | ✅ Show  | ✅ Show  |
| City          | ✅ Show  | ✅ Show  | ✅ Show  |
| Password      | ✅ Show  | ✅ Show  | ✅ Show  |
| Confirm PW    | Signup ✅| Signup ✅| Signup ✅|

---

### 4. Phone Validation (HeroSection.jsx)

```js
// Strips +91 prefix and counts only digits
const phoneDigits = phoneRaw
  .replace(/^\+91[\s-]?/, "")
  .replace(/^0/, "")
  .replace(/\D/g, "");
```

**Rules enforced:**
- ❌ No alphabet characters (blocked on keystroke)
- ❌ No special characters like `@`, `#`, `$`
- ❌ Less than 10 digits → shows countdown "3 more digit(s) needed"
- ❌ More than 10 digits → "Too many digits (max 10)"
- ✅ Exactly 10 digits → green border + "✓ Valid number"

**Visual feedback:**
- Border turns **red** when invalid
- Border turns **green** when valid
- `X/10` digit counter shown live
- Submit blocked if phone invalid during signup

---

### 5. Password Validation (LandingPage.jsx)

```js
const passwordMatch =
  formData.password.length >= 8 &&
  formData.password === formData.confirmPassword;
```

- Minimum 8 characters enforced
- Confirm password border turns red if mismatch
- Submit button disabled until passwords match
- Shake animation triggered on mismatch blur

---

### 6. ROLES Config & Endpoint Mapping (HeroSection.jsx)

```js
const ROLES = [
  {
    key: "admin",
    label: "Admin",
    color: "#f87171",
    loginEndpoint:  "/api/auth/login",
    signupEndpoint: "/api/auth/register",
  },
  {
    key: "employee",
    label: "Employee",
    color: "#fbbf24",
    loginEndpoint:  "/api/auth/login",
    signupEndpoint: "/api/auth/signup",
  },
  {
    key: "customer",
    label: "Customer",
    color: "#34d399",
    loginEndpoint:  "/api/auth/login",
    signupEndpoint: "/api/auth/signup",
  },
];
```

All 3 roles use the **JWT REST API** (`/api/auth/*`), NOT the old Thymeleaf MVC routes.

---

## 🔌 How Frontend Connects to Backend

### Flow Diagram

```
User fills form
      ↓
Clicks "Create workspace" / "Sign in"
      ↓
handleSubmit() in HeroSection
      ↓
onSubmit({ ...formData, role, endpoint }) called
      ↓
handleAuthSubmit() in LandingPage
      ↓
fetch(endpoint, { method: POST, body: JSON })
      ↓
Vite Proxy → forwards to localhost:8080
      ↓
Spring Boot AuthController
      ↓
Returns JWT token + role in JSON
```

---

### handleAuthSubmit (LandingPage.jsx)

```js
const handleAuthSubmit = async ({ role, endpoint, ...data }) => {
  const isApiRoute = endpoint.startsWith("/api/");

  const body = isApiRoute
    ? JSON.stringify({ ...data, role })           // JSON for REST
    : new URLSearchParams({ ...data, role }).toString(); // form-encoded for MVC

  const headers = {
    "Content-Type": isApiRoute
      ? "application/json"
      : "application/x-www-form-urlencoded",
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body,
    credentials: "include",  // session cookies
  });

  if (res.redirected) {
    window.location.href = res.url; // follow Spring MVC redirect
    return;
  }

  const json = await res.json();
  // TODO: Store JWT → redirect to dashboard
  // localStorage.setItem("token", json.token);
};
```

---

### Vite Proxy Config (vite.config.js)

**Why needed:** React dev server runs on port `5174`, Spring Boot on `8080`.  
Without proxy, `/api/auth/login` would hit `localhost:5174/api/auth/login` → 404.  
With proxy, Vite forwards it to `localhost:8080/api/auth/login`.

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api':          'http://localhost:8080',
      '/regForm':      'http://localhost:8080',
      '/loginForm':    'http://localhost:8080',
      '/empLoginForm': 'http://localhost:8080',
      '/adminLoginForm': 'http://localhost:8080',
    }
  }
})
```

---

## 🗄️ Backend Changes Made

### AuthRole.java (Entity)

```java
public enum AuthRole {
    ADMIN,
    EMPLOYEE,
    CUSTOMER
}
```

> ⚠️ Old `USER` enum was removed. Existing DB rows were migrated to `CUSTOMER`.

---

### RegisterRequest.java (DTO)

Added `role` field so backend can receive it from frontend JSON:

```java
public class RegisterRequest {
    private String email;
    private String password;
    private String role;          // ← ADDED

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
```

---

### AuthController.java — signup()

Changed from hardcoded `USER` to dynamic role mapping:

```java
@PostMapping({ "/signup", "/register" })
public ResponseEntity<?> signup(@Valid @RequestBody RegisterRequest request) {
    String email = request.getEmail().trim().toLowerCase();

    if (authUserRepository.existsByEmailIgnoreCase(email)) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                             .body("Email already registered");
    }

    AuthUser user = new AuthUser();
    user.setEmail(email);
    user.setPassword(passwordMatchService.encode(request.getPassword()));

    // Dynamic role mapping ← KEY CHANGE
    AuthRole authRole;
    try {
        authRole = AuthRole.valueOf(request.getRole().toUpperCase()); // "admin" → ADMIN
    } catch (Exception e) {
        authRole = AuthRole.CUSTOMER; // fallback
    }
    user.setRole(authRole);

    authUserRepository.save(user);

    UserDetails details = userDetailsService.loadUserByUsername(email);
    String token = jwtService.generateToken(details);
    return ResponseEntity.ok(new AuthResponse(token, email, authRole));
}
```

---

### MySQL — auth_users Table Fix

The DB `role` column ENUM was updated to match new roles:

```sql
-- Step 1: Temporarily add all values
ALTER TABLE auth_users
MODIFY COLUMN role ENUM('ADMIN', 'EMPLOYEE', 'CUSTOMER', 'USER') NOT NULL;

-- Step 2: Migrate old USER rows
SET SQL_SAFE_UPDATES = 0;
UPDATE auth_users SET role = 'CUSTOMER' WHERE role = 'USER';
SET SQL_SAFE_UPDATES = 1;

-- Step 3: Remove USER from ENUM
ALTER TABLE auth_users
MODIFY COLUMN role ENUM('ADMIN', 'EMPLOYEE', 'CUSTOMER') NOT NULL;
```

---

## 📡 Auth Endpoints Reference

### All 3 roles use these JWT endpoints:

| Action   | Method | Endpoint             | Controller Method       | Response          |
|----------|--------|----------------------|-------------------------|-------------------|
| Register | POST   | `/api/auth/register` | `AuthController#signup` | JWT token + role  |
| Signup   | POST   | `/api/auth/signup`   | `AuthController#signup` | JWT token + role  |
| Login    | POST   | `/api/auth/login`    | `AuthController#login`  | JWT token + role  |

### Role-specific MVC endpoints (for dashboard navigation, NOT used in landing page):

| Role     | Login Page GET     | Login POST          | Logout GET          |
|----------|--------------------|---------------------|---------------------|
| Admin    | `/adminLogin`      | `/adminLoginForm`   | `/adminLogout`      |
| Employee | `/employeeLogin`   | `/empLoginForm`     | `/employeeLogout`   |
| Customer | `/login`           | `/loginForm`        | session invalidate  |

---

## 🚦 Request Payload Sent to Backend

### Signup (POST `/api/auth/signup`)
```json
{
  "email": "emp@company.com",
  "password": "securepass123",
  "role": "employee",
  "name": "",
  "company": "Acme Corp",
  "phone": "9876543210",
  "city": "Mumbai",
  "confirmPassword": "securepass123"
}
```

### Login (POST `/api/auth/login`)
```json
{
  "email": "emp@company.com",
  "password": "securepass123"
}
```

### Response (both signup & login)
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "emp@company.com",
  "role": "EMPLOYEE"
}
```

---

## ✅ What's Working

| Feature                            | Status |
|------------------------------------|--------|
| Role selector (Admin/Employee/Customer) | ✅ |
| Dynamic form fields per role       | ✅     |
| Phone validation (10 digit, no alpha) | ✅  |
| Password match validation          | ✅     |
| Signup → saves correct role in DB  | ✅     |
| Login → returns JWT token          | ✅     |
| Vite proxy → Spring Boot 8080      | ✅     |
| Duplicate email → 409 Conflict     | ✅     |
| DB ENUM updated (ADMIN/EMPLOYEE/CUSTOMER) | ✅ |

---

## 🔜 Next Steps (TODO)

```js
// After successful login/signup, store JWT and redirect:
const json = await res.json();
localStorage.setItem("token", json.token);

if (role === "admin")         window.location.href = "/adminProfile";
else if (role === "employee") window.location.href = "/employeeManagement";
else                          window.location.href = "/home";
```

- [ ] Add JWT token to all protected API calls via `Authorization: Bearer <token>` header
- [ ] Handle token expiry → auto logout
- [ ] Add signout buttons in each role's dashboard navbar:
  - Admin: `GET /adminLogout`
  - Employee: `GET /employeeLogout`
  - Customer: session invalidate