# 🧠 CURIEM CRM — Help Guide

A simple guide to understand every file in this project.  
No complicated terms. Just plain explanation.

---

## 📁 Folder Structure at a Glance

```
src/
├── 📄 pages/LandingPage.jsx          ← The main brain
├── 🧩 components/landing/            ← Each section of the webpage
├── 🔩 components/ui/                 ← Tiny reusable pieces
├── 📦 constants/landingData.js       ← All text & data
├── 🛠️  utils/authValidation.js        ← Form checking logic
└── 🌐 services/authService.js        ← All API calls to backend
```

---

## 📄 pages/

---

### `LandingPage.jsx`

**What it does 👉** This is the main file that controls the entire landing page. It holds all the data that changes (called "state") and passes it down to every other component.

**Why it exists 👉** So that one file is in charge. All other components are just display screens — they receive data and show it. LandingPage is the brain, the rest are the hands.

**Think of it like 👉** A TV remote. It controls what's happening on screen. The components are the TV — they just show what the remote tells them.

---

## 🧩 components/landing/

These are the visible sections of the webpage, top to bottom.

---

### `Navbar.jsx`

**What it does 👉** The sticky top bar with the logo, navigation links (Features, Pricing, FAQ...), and the Login / Start free trial buttons.

**Why use it 👉** Lets the user jump to any section or open the auth card from anywhere on the page.

**Cool detail 👉** When you scroll down more than 40px, the navbar gets a blurred glass background automatically. Above 40px it's transparent.

---

### `HeroSection.jsx`

**What it does 👉** The big top section — headline, tagline, "Get started free" button, stats, and the signup/login card on the right.

**Why use it 👉** First thing a visitor sees. It has the marketing copy on the left and the auth form on the right.

**Important 👉** This component doesn't do any logic itself. It just arranges the layout and passes all the form data down to `AuthCard`.

---

### `AuthCard.jsx` ⭐

**What it does 👉** The signup / login form card. This is the most important component on the landing page.

**Why use it 👉** It's where users actually create their account or log in.

**Two modes:**
- 🟢 **Sign up** — shows company name, email, password, confirm password, strength bar
- 🔵 **Log in** — shows email, password, forgot password link

**Security info banner 👉** In signup mode, a small blue box tells the user they are registering as **Admin** (workspace owner). Leader and Member accounts are created later from inside the dashboard — not here.

**Why separated from HeroSection 👉** The form is complex enough to be its own file. Easier to read and edit without scrolling through hero content.

---

### `FeaturesSection.jsx`

**What it does 👉** Three cards explaining the main features — Lead Inbox, Tasks & Activities, Revenue Insights.

**Why use it 👉** Tells visitors what the CRM actually does before they sign up.

**No props needed 👉** All the card content is stored inside this file. Nothing is passed from the parent.

---

### `PricingSection.jsx`

**What it does 👉** Three pricing tiers — Starter (free), Growth ($19/user), Scale (custom). Has a toggle at the top to highlight each plan.

**Why use it 👉** Helps visitors choose the right plan before registering.

**Clicking a plan card 👉** Highlights it with a cyan border. Clicking the CTA button ("Start 14-day trial" etc.) scrolls to the signup form.

---

### `TestimonialsSection.jsx` 🐛→✅

**What it does 👉** A sliding card that shows one customer quote at a time. Auto-advances every 4.5 seconds. Pauses when you hover over it. You can also click the arrows or dots to navigate manually.

**Why use it 👉** Social proof — shows that real teams use and love the product.

**The bug that was fixed here 👉** The auto-slide used to get stuck and only show "Elizabeth Olsen". The fix was removing `testimonialIndex` from the timer's dependency list. Now all 3 slides rotate properly.

---

### `FaqSection.jsx`

**What it does 👉** An accordion list of 5 common questions. Click a question to open its answer. Click again to close.

**Why use it 👉** Answers doubts before a visitor signs up, reducing hesitation.

**Only one open at a time 👉** Clicking a new question closes the previous one automatically.

---

### `CtaBanner.jsx`

**What it does 👉** A gradient box near the bottom of the page with a big "Start your free 14-day trial" button.

**Why use it 👉** A last nudge to sign up for users who scrolled all the way down but haven't registered yet. Clicking it scrolls back up to the auth card.

---

### `Footer.jsx`

**What it does 👉** The very bottom bar — CC logo, copyright year, and links to Privacy, Terms, Docs, Status, GitHub.

**Why use it 👉** Standard footer every website needs.

**Auto year 👉** Uses `new Date().getFullYear()` so the copyright year updates automatically every year. No manual editing needed.

---

## 🔩 components/ui/

These are tiny reusable pieces. They are not sections of the page — they are building blocks used inside the form.

---

### `Input.jsx`

**What it does 👉** A styled text input box. Dark background, rounded, cyan focus glow by default, red glow when there's a validation error.

**Why use it 👉** So every input field in the app looks the same without copy-pasting the same styling 10 times.

**The `hasError` prop 👉** Pass `hasError={true}` and the border turns red. Pass nothing and it stays the default cyan-on-focus style.

---

### `Field.jsx`

**What it does 👉** A wrapper that puts a label above an input and an error message below it.

**Why use it 👉** Without it, every form field needs 3 separate lines (label, input, error). With it, you just wrap:

```jsx
<Field label="Email" error="Enter a valid email">
  <Input ... />
</Field>
```

**The error message 👉** Only shows if the `error` prop has text. If it's empty or undefined, nothing shows.

---

### `PasswordStrengthBar.jsx`

**What it does 👉** The 4-segment coloured bar that appears under the password field during signup. Shows Weak → Fair → Good → Strong as you type.

**Why use it 👉** Visual feedback that helps users make a stronger password without reading rules.

**How the score works 👉** 1 point for each:
- ✅ At least 8 characters
- ✅ Has an uppercase letter (A-Z)
- ✅ Has a number (0-9)
- ✅ Has a special character (!@#$ etc.)

**Disappears when empty 👉** If the password field is blank, this component returns nothing. It only appears once you start typing.

---

### `Toast.jsx`

**What it does 👉** A small popup notification in the bottom-right corner. Appears for 4 seconds then disappears on its own. Can also be closed by clicking ✕.

**Three styles:**
- ✅ `success` — green (e.g. "Workspace created!")
- ❌ `error` — red (e.g. "Invalid credentials")
- ℹ️ `info` — cyan (e.g. "OTP flow coming soon")

**Why use it 👉** Gives the user instant feedback after any action (form submit, button click, API response) without blocking the page with a modal.

---

## 📦 constants/

---

### `landingData.js`

**What it does 👉** Stores all the fixed content for the landing page — testimonials, pricing plans, FAQ questions, role definitions, password strength labels.

**Why use it 👉** If you want to change the pricing, update a FAQ answer, or add a new testimonial — you only need to edit this one file. You never have to touch the component code.

**What's inside:**

| Export | Used by | What it is |
|---|---|---|
| `ROLE_MAP` | AuthCard | Admin role definition (roleId = 1) |
| `PWD_LEVELS` | PasswordStrengthBar | Weak/Fair/Good/Strong labels & colours |
| `TESTIMONIALS` | TestimonialsSection | The 3 customer quotes |
| `FAQS` | FaqSection | The 5 questions & answers |
| `PLANS` | PricingSection | The 3 pricing tiers |

---

## 🛠️ utils/

---

### `authValidation.js`

**What it does 👉** Two simple functions that check if form inputs are valid before sending anything to the backend.

**Why use it 👉** So the app never calls the API with empty or bad data. Catches mistakes instantly and shows an error under the right field.

**`getPasswordStrength(password)` 👉** Returns a score from 0 to 4. Used by `PasswordStrengthBar` to decide the colour.

**`validateForm(fields, mode)` 👉** Checks all fields and returns an object of error messages. If no errors, returns `{}` (empty = form is valid). LandingPage calls this before every submit.

---

## 🌐 services/

---

### `authService.js`

**What it does 👉** Every single API call to the Spring Boot backend lives in this file. Nothing else in the frontend makes fetch calls directly.

**Why use it 👉** One place for all backend communication. If the backend URL or an endpoint changes, you fix it here — not scattered across 10 files.

**Used by the landing page:**

| Function | Hits | When |
|---|---|---|
| `loginUser()` | `POST /api/v1/auth/login` | User clicks Sign in |
| `registerAdminUser()` | `POST /api/v1/auth/register/1` | User clicks Create workspace |

**Also ready for the dashboard** — all client, project, task, user, role, and statistics endpoints are already written and documented in this file. They just need to be called from dashboard components when you build them.

> ⚠️ **The `jobStatitstic` typo** — The backend route is spelled wrong (`jobStatitstic` instead of `jobStatistics`). This is kept as-is in the frontend too. If you "fix" the spelling here, the API call will break.

---

## ❓ Quick Questions

**Q: Why so many files instead of one big file?**  
👉 Each file does one job. Changing the FAQ won't risk breaking the auth form. Finding code is fast — if something's wrong with pricing, you go straight to `PricingSection.jsx`.

**Q: Why does LandingPage hold all the state?**  
👉 Because multiple components need the same data. The Navbar, HeroSection, and CtaBanner all need to know which auth mode is active. One parent sharing state is cleaner than three components trying to stay in sync.

**Q: What happens after successful login?**  
👉 Currently it logs to console and shows a toast. The next step (not yet built) is to store the JWT token in Redux and redirect to `/dashboard`.

**Q: Where do I update the testimonials or pricing?**  
👉 Only in `src/constants/landingData.js`. Edit the `TESTIMONIALS` or `PLANS` arrays. The components pick up the changes automatically.

**Q: Where do I add a new form field?**  
👉 Three steps: add state in `LandingPage.jsx` → pass it as a prop through `HeroSection` → use it in `AuthCard` with a `<Field>` + `<Input>`.
