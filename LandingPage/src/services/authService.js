/**
 * authService.js — CURIEM CRM
 * ─────────────────────────────────────────────────────────────────
 * All HTTP service calls to the Spring Boot backend.
 * Organised exactly as the project report's API endpoint tables
 * (Tables 3–9, Chapter 3, pp.47–50).
 *
 * BASE URL: read from VITE_API_BASE env var.
 * Fallback : http://localhost:8888 (local dev — matches report config).
 *
 * ROLE HIERARCHY (Table 1 — User Role Analysis):
 *   Admin  (roleId 1) — Full system access. Manages users, clients,
 *                        projects, roles. Creates Leader + Member accounts.
 *   Leader (roleId 2) — Project Manager. Creates/assigns projects & tasks.
 *                        Monitors performance for clients they manage.
 *   Member (roleId 3) — Employee. Updates assigned task status. Views
 *                        personal task dashboard and profile page.
 *
 * ─────────────────────────────────────────────────────────────────
 * TABLE 3 — Authentication Endpoints (all POST, /api/v1/auth/*)
 * ─────────────────────────────────────────────────────────────────
 *  POST /api/v1/auth/login              | All role | Authorize user
 *  POST /api/v1/auth/register/{roleId}  | Admin    | Register + assign role
 *  POST /api/v1/auth/refreshToken       | All role | New token when expired
 *  POST /api/v1/logout                  | All role | Log out user
 *  POST /api/v1/auth/forgot-password    | Public   | Send OTP to email
 *  POST /api/v1/auth/verify-otp         | Public   | Verify OTP code
 *  POST /api/v1/auth/reset-password     | Public   | Reset password after OTP
 *
 * TABLE 4 — Client Endpoints (/api/v1/clients/*)
 * ─────────────────────────────────────────────────────────────────
 *  GET    /api/v1/clients          | Admin, Leader | View all clients
 *  POST   /api/v1/clients          | Admin         | Add new client
 *  PUT    /api/v1/clients/{id}     | Admin         | Update client
 *  DELETE /api/v1/clients/{id}     | Admin         | Delete client
 *  POST   /api/v1/client/image     | Admin         | Upload client image (S3)
 *
 * TABLE 5 — Project Endpoints (/api/v1/projects/*)
 * ─────────────────────────────────────────────────────────────────
 *  GET    /api/v1/projects                                | All role      | View all projects
 *  GET    /api/v1/projects/{id}                           | Admin, Leader | View specific project
 *  POST   /api/v1/projects                                | Admin, Leader | Add new project
 *  PUT    /api/v1/projects/{id}/originator/{originatorId} | Admin, Leader | Update project
 *  DELETE /api/v1/projects/{id}                           | Admin, Leader | Delete project
 *
 * TABLE 6 — Role Endpoints (/api/v1/roles/*)
 * ─────────────────────────────────────────────────────────────────
 *  GET    /api/v1/roles | —     | View all roles
 *  PUT    /api/v1/roles | Admin | Update role description
 *  DELETE /api/v1/roles | —     | Delete role
 *
 * TABLE 7 — User Endpoints (/api/v1/users/*)
 * ─────────────────────────────────────────────────────────────────
 *  GET  /api/v1/users                | Admin, Leader | View all users
 *  GET  /api/v1/users/{id}           | Admin         | View specific user
 *  GET  /api/v1/users/profile        | All role      | Own profile after login
 *  POST /api/v1/users/role/{roleId}  | Admin         | Add user + assign role
 *
 *  NOTE: POST /api/v1/users/role/{roleId} is the ONLY way to create
 *  Leader (2) and Member (3) accounts. Admin-only, JWT required.
 *  The public landing page only calls POST /api/v1/auth/register/1.
 *
 * TABLE 8 — Task Endpoints (/api/v1/tasks/*)
 * ─────────────────────────────────────────────────────────────────
 *  GET  /api/v1/tasks                                       | All role      | View all tasks
 *  GET  /api/v1/tasks/{id}                                  | All role      | View specific task
 *  POST /api/v1/tasks/projects/{projectId}/users/{userId}   | Admin, Leader | Add task + assign implementer
 *  PUT  /tasks/{id}                                         | Member        | Update task status
 *
 *  Auto-update: Spring @Scheduled job evaluates deadlines and updates
 *  task/project status automatically — no manual trigger needed.
 *
 * TABLE 9 — Statistics Endpoints
 * ─────────────────────────────────────────────────────────────────
 *  GET /api/v1/taskStatistics             | All role      | Task statistics
 *  GET /api/v1/jobStatitstic/{projectId}  | Admin, Leader | Project statistics
 *  NOTE: "jobStatitstic" is the exact spelling in the backend route (report p.50).
 *
 * ─────────────────────────────────────────────────────────────────
 * JWT STORAGE:
 *   NEVER localStorage (XSS risk).
 *   Store in Redux auth slice + httpOnly cookie where possible.
 *   Login/Register success → dispatch(setCredentials({ token, user }))
 *   Logout             → dispatch(clearCredentials())
 * ─────────────────────────────────────────────────────────────────
 */

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8888";

// ─── Internal helper ─────────────────────────────────────────────────────────

/**
 * _request — Generic fetch wrapper.
 * Throws Error with server's message on non-OK status.
 */
async function _request(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return {};
  return res.json();
}

const _post   = (path, body, token) => _request("POST",   path, body, token);
const _get    = (path, token)        => _request("GET",    path, null, token);
const _put    = (path, body, token)  => _request("PUT",    path, body, token);
const _delete = (path, token)        => _request("DELETE", path, null, token);


// ═══════════════════════════════════════════════════════════════════════
// TABLE 3 — AUTH
// ═══════════════════════════════════════════════════════════════════════

/**
 * loginUser
 * POST /api/v1/auth/login  |  All roles  |  Public
 *
 * Backend reads role from DB — client never sends roleId at login.
 * @param {{ email, password }} credentials
 * @returns {Promise<{ token, refreshToken, expiresIn, roles[], userProfile{} }>}
 */
export async function loginUser({ email, password }) {
  return _post("/api/v1/auth/login", { email, password });
}

/**
 * registerAdminUser
 * POST /api/v1/auth/register/1  |  Admin  |  Public (self-registration)
 *
 * Registers the workspace owner as Admin (roleId=1).
 * This is the ONLY public registration allowed on the landing page.
 * Leader/Member accounts → use createUserWithRole() below (dashboard only).
 *
 * @param {{ companyName, email, password }}
 * @returns {Promise<{ token, refreshToken, expiresIn, roles[], userProfile{} }>}
 */
export async function registerAdminUser({ companyName, email, password }) {
  return _post("/api/v1/auth/register/1", {
    username: companyName,
    email,
    password,
  });
}

/**
 * refreshAuthToken
 * POST /api/v1/auth/refreshToken  |  All roles  |  Auth required
 *
 * Wire into a fetch/Axios interceptor on 401 responses.
 * @param {{ refreshToken }} payload
 * @returns {Promise<{ token, refreshToken, expiresIn }>}
 */
export async function refreshAuthToken({ refreshToken }) {
  return _post("/api/v1/auth/refreshToken", { refreshToken });
}

/**
 * logoutUser
 * POST /api/v1/logout  |  All roles  |  Auth required
 *
 * Invalidates JWT server-side. Always follow with dispatch(clearCredentials()).
 * @param {{ token }} payload
 */
export async function logoutUser({ token }) {
  return _post("/api/v1/logout", { token });
}

/**
 * forgotPassword
 * POST /api/v1/auth/forgot-password  |  Public  |  Step 1 of OTP recovery
 * @param {{ email }} payload
 */
export async function forgotPassword({ email }) {
  return _post("/api/v1/auth/forgot-password", { email });
}

/**
 * verifyOtp
 * POST /api/v1/auth/verify-otp  |  Public  |  Step 2 of OTP recovery
 * @param {{ email, otp }} payload
 * @returns {Promise<{ message, verified: boolean }>}
 */
export async function verifyOtp({ email, otp }) {
  return _post("/api/v1/auth/verify-otp", { email, otp });
}

/**
 * resetPassword
 * POST /api/v1/auth/reset-password  |  Public  |  Step 3 of OTP recovery
 * Call only after verifyOtp() returns verified = true.
 * @param {{ email, newPassword }} payload
 */
export async function resetPassword({ email, newPassword }) {
  return _post("/api/v1/auth/reset-password", { email, newPassword });
}


// ═══════════════════════════════════════════════════════════════════════
// TABLE 4 — CLIENT
// ═══════════════════════════════════════════════════════════════════════

/**
 * getAllClients
 * GET /api/v1/clients  |  Admin, Leader
 *
 * EER: one Client → many Projects. Leaders see clients linked to their projects.
 * @param {string} token
 */
export async function getAllClients(token) {
  return _get("/api/v1/clients", token);
}

/**
 * addClient
 * POST /api/v1/clients  |  Admin only
 * @param {{ fullname, companyName, email, phoneNum, linkedIn, joinDate, status }} payload
 * @param {string} token
 */
export async function addClient(payload, token) {
  return _post("/api/v1/clients", payload, token);
}

/**
 * updateClient
 * PUT /api/v1/clients/{id}  |  Admin only
 * @param {number} id
 * @param {Partial<Client>} payload
 * @param {string} token
 */
export async function updateClient(id, payload, token) {
  return _put(`/api/v1/clients/${id}`, payload, token);
}

/**
 * deleteClient
 * DELETE /api/v1/clients/{id}  |  Admin only
 * @param {number} id
 * @param {string} token
 */
export async function deleteClient(id, token) {
  return _delete(`/api/v1/clients/${id}`, token);
}

/**
 * uploadClientImage
 * POST /api/v1/client/image  |  Admin only
 *
 * Uploads client avatar to AWS S3. Must send as multipart/form-data.
 * Do NOT set Content-Type header — browser sets the multipart boundary.
 * @param {FormData} formData — include `file` and `clientId` fields
 * @param {string}   token
 * @returns {Promise<{ imageUrl: string }>}
 */
export async function uploadClientImage(formData, token) {
  const res = await fetch(`${API_BASE}/api/v1/client/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Image upload failed.");
  }
  return res.json();
}


// ═══════════════════════════════════════════════════════════════════════
// TABLE 5 — PROJECT
// ═══════════════════════════════════════════════════════════════════════

/**
 * getAllProjects
 * GET /api/v1/projects  |  All roles
 *
 * Members see only their assigned projects.
 * @param {string} token
 */
export async function getAllProjects(token) {
  return _get("/api/v1/projects", token);
}

/**
 * getProjectById
 * GET /api/v1/projects/{id}  |  Admin, Leader
 *
 * Returns full project detail with task list and originator.
 * @param {number} id
 * @param {string} token
 */
export async function getProjectById(id, token) {
  return _get(`/api/v1/projects/${id}`, token);
}

/**
 * addProject
 * POST /api/v1/projects  |  Admin, Leader
 *
 * EER: one Project → many Tasks; linked to one Client.
 * @param {{ name, startDate, endDate, clientId, originatorId, deal, status }} payload
 * @param {string} token
 */
export async function addProject(payload, token) {
  return _post("/api/v1/projects", payload, token);
}

/**
 * updateProject
 * PUT /api/v1/projects/{id}/originator/{originatorId}  |  Admin, Leader
 *
 * Updates project details and/or reassigns the project originator (Leader).
 * @param {number} id
 * @param {number} originatorId — userId of the new project originator
 * @param {Partial<Project>} payload
 * @param {string} token
 */
export async function updateProject(id, originatorId, payload, token) {
  return _put(`/api/v1/projects/${id}/originator/${originatorId}`, payload, token);
}

/**
 * deleteProject
 * DELETE /api/v1/projects/{id}  |  Admin, Leader
 * @param {number} id
 * @param {string} token
 */
export async function deleteProject(id, token) {
  return _delete(`/api/v1/projects/${id}`, token);
}


// ═══════════════════════════════════════════════════════════════════════
// TABLE 6 — ROLE
// ═══════════════════════════════════════════════════════════════════════

/**
 * getAllRoles
 * GET /api/v1/roles  |  (open per Table 6)
 *
 * Returns system roles: Admin (1), Leader (2), Member (3).
 * Used to populate role dropdowns in the Admin dashboard user-creation form.
 * @param {string} token
 */
export async function getAllRoles(token) {
  return _get("/api/v1/roles", token);
}

/**
 * updateRole
 * PUT /api/v1/roles  |  Admin only
 *
 * Updates a role's description. Role names/IDs are fixed backend seeds.
 * @param {{ id, description }} payload
 * @param {string} token
 */
export async function updateRole(payload, token) {
  return _put("/api/v1/roles", payload, token);
}

/**
 * deleteRole
 * DELETE /api/v1/roles  |  (open per Table 6)
 * @param {string} token
 */
export async function deleteRole(token) {
  return _delete("/api/v1/roles", token);
}


// ═══════════════════════════════════════════════════════════════════════
// TABLE 7 — USER
// ═══════════════════════════════════════════════════════════════════════

/**
 * getAllUsers
 * GET /api/v1/users  |  Admin, Leader
 * @param {string} token
 */
export async function getAllUsers(token) {
  return _get("/api/v1/users", token);
}

/**
 * getUserById
 * GET /api/v1/users/{id}  |  Admin only
 * @param {number} id
 * @param {string} token
 */
export async function getUserById(id, token) {
  return _get(`/api/v1/users/${id}`, token);
}

/**
 * getUserProfile
 * GET /api/v1/users/profile  |  All roles
 *
 * Returns the authenticated user's own profile (name, email, phone, image, role).
 * Call immediately after login to hydrate the Redux auth slice.
 * @param {string} token
 */
export async function getUserProfile(token) {
  return _get("/api/v1/users/profile", token);
}

/**
 * createUserWithRole
 * POST /api/v1/users/role/{roleId}  |  Admin only  |  JWT required
 *
 * THE ONLY way to create Leader (roleId=2) or Member (roleId=3) accounts.
 * Called from the Admin dashboard — NEVER from the public landing page.
 *
 * roleId: 1=Admin  2=Leader (Project Manager)  3=Member (Employee)
 *
 * @param {1|2|3} roleId
 * @param {{ username, email, password, phoneNum }} payload
 * @param {string} token — Admin JWT
 */
export async function createUserWithRole(roleId, payload, token) {
  return _post(`/api/v1/users/role/${roleId}`, payload, token);
}


// ═══════════════════════════════════════════════════════════════════════
// TABLE 8 — TASK
// ═══════════════════════════════════════════════════════════════════════

/**
 * getAllTasks
 * GET /api/v1/tasks  |  All roles
 *
 * Role-filtered by backend:
 *   Admin/Leader → all tasks for their projects
 *   Member       → only tasks in implementers_tasks where implementer_id = them
 * @param {string} token
 */
export async function getAllTasks(token) {
  return _get("/api/v1/tasks", token);
}

/**
 * getTaskById
 * GET /api/v1/tasks/{id}  |  All roles
 * @param {number} id
 * @param {string} token
 */
export async function getTaskById(id, token) {
  return _get(`/api/v1/tasks/${id}`, token);
}

/**
 * addTask
 * POST /api/v1/tasks/projects/{projectId}/users/{userId}  |  Admin, Leader
 *
 * Creates a task inside a project and assigns it to an implementer (Member).
 * EER: one Task → many implementers via implementers_tasks join table.
 *
 * @param {number} projectId
 * @param {number} userId    — implementer's userId (Member)
 * @param {{ name, startDate, endDate, status }} payload
 * @param {string} token
 */
export async function addTask(projectId, userId, payload, token) {
  return _post(
    `/api/v1/tasks/projects/${projectId}/users/${userId}`,
    payload,
    token,
  );
}

/**
 * updateTaskStatus
 * PUT /tasks/{id}  |  Member (implementer)
 *
 * Allows an assigned Member to update their task's status.
 * Spring @Scheduled also auto-updates status when deadlines are crossed.
 *
 * @param {number} id
 * @param {{ status: "PENDING"|"IN_PROGRESS"|"COMPLETED"|"OVERDUE" }} payload
 * @param {string} token — Member JWT
 */
export async function updateTaskStatus(id, payload, token) {
  return _put(`/tasks/${id}`, payload, token);
}


// ═══════════════════════════════════════════════════════════════════════
// TABLE 9 — STATISTICS
// ═══════════════════════════════════════════════════════════════════════

/**
 * getTaskStatistics
 * GET /api/v1/taskStatistics  |  All roles
 *
 * Aggregated task stats for dashboard charts:
 *   - task performance distribution (pending/in-progress/completed/overdue)
 *   - implementer workload distribution
 *   - user-specific task progress reports
 * @param {string} token
 */
export async function getTaskStatistics(token) {
  return _get("/api/v1/taskStatistics", token);
}

/**
 * getProjectStatistics
 * GET /api/v1/jobStatitstic/{projectId}  |  Admin, Leader
 *
 * ⚠️  "jobStatitstic" is the exact backend route spelling (typo preserved from
 *    the report, Table 9 p.50). Do NOT fix the spelling here — it must match
 *    the Spring controller's @GetMapping annotation exactly.
 *
 * Returns per-project stats:
 *   - task completion rate
 *   - client-wise project progress
 *   - pipeline by stage and owner
 *
 * @param {number} projectId
 * @param {string} token
 */
export async function getProjectStatistics(projectId, token) {
  return _get(`/api/v1/jobStatitstic/${projectId}`, token);
}
