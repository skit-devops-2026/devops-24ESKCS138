# Kisan Market — MERN Implementation Workflow

## 1. Project objective

Upgrade the existing Kisan Market frontend into a working MERN-stack agricultural marketplace while preserving the current design where practical and protecting the existing Git/DevOps work.

**Target stack**
- Frontend: React + Vite, React Router, CSS (reuse and adapt the current styling)
- Backend: Node.js + Express.js
- Database: MongoDB Atlas + Mongoose
- API communication: Fetch API or Axios (choose one consistently)
- Authentication: bcrypt password hashing + JWT
- Testing: Postman for API checks; automated tests where practical
- Delivery: GitHub, Docker, and deployment updates after local integration works

**Known starting point**
- Existing frontend files include `front1.html`, `front1.css`, and `script1.js`.
- The current app is primarily a frontend; a working backend/database has not yet been established.
- Existing DevOps work includes Docker, a Render deployment, Kubernetes manifests, and Prometheus/Grafana/Blackbox monitoring. Inspect the current repository before changing any of it.
- Repository: `skit-devops-2026/devops-24ESKCS138`.
- Existing Render URL: `https://kisan-market-1-1.onrender.com/` (treat this as the existing deployment, not proof that MERN APIs are deployed).

## 2. Milestone workflow

### M0 — Repository audit and safety [COMPLETED]
**Tasks**
1. Run `git status`, inspect the branch, recent commits, and file tree.
2. Read the current HTML, CSS, JavaScript, README, Dockerfile, Compose files, CI workflow, Kubernetes manifests, and monitoring configuration.
3. Identify current UI sections and interactions (for example, search, category/product cards, product-view popup, market-price section, and farmer/login/register popups if still present).
4. Record which features are real, mocked, or only visual.
5. Do not delete or overwrite unrelated files. Keep existing DevOps assets unless a specific, tested change is needed.

**Exit criteria**
- A short audit report lists the current files, reusable UI, known gaps, and planned file changes.
- The working tree and existing deployment configuration are understood before implementation.

### M1 — Convert the frontend to React [COMPLETED]
**Tasks**
1. Create a Vite React app in a clearly named `client/` directory, after confirming how the current repository is organized.
2. Convert the existing page into reusable components rather than redesigning everything at once.
3. Suggested components: `Navbar`, `HeroSection`, `CategoryList`, `ProductCard`, `ProductList`, `MarketPrices`, `FarmerSection`, `Footer`, and reusable form/modal components as appropriate.
4. Add React Router routes such as `/`, `/products`, `/products/:id`, `/login`, `/register`, and `/farmer/dashboard` where appropriate.
5. Reuse `front1.css` styles where possible; make the layout responsive on mobile, tablet, and desktop.
6. Replace direct DOM manipulation/jQuery patterns with React state and event handlers where needed.
7. Use sample data only as temporary development fixtures and label it clearly.

**Exit criteria**
- React app starts locally.
- Existing visual identity and core interactions remain usable.
- No avoidable console errors; routes and responsive layout are checked.

### M2 — Backend foundation [COMPLETED]
**Tasks**
1. Create `server/` with Node.js and Express.
2. Add a health endpoint: `GET /api/health`.
3. Configure JSON parsing, environment variables, CORS for the frontend origin, and centralized error handling.
4. Organize code into routes, controllers, models, middleware, and configuration.
5. Add `.env.example`; never commit `.env`, database credentials, or JWT secrets.
6. Use one consistent API base URL configured through `VITE_API_URL`.

**Exit criteria**
- Backend starts independently.
- Health endpoint returns a clear success response.
- Invalid requests produce useful status codes and messages.

### M3 — MongoDB and data models [COMPLETED]
**Tasks**
1. Connect the backend to MongoDB Atlas using Mongoose.
2. Define and validate initial models:
   - `Product`: name, description, category, price, unit, quantity/stock, image URL (optional), seller/farmer reference, availability, timestamps.
   - `User`: name, email, password hash, role (`farmer` or `buyer`), optional contact/address fields, timestamps.
   - `Order`: buyer reference, product/order items, quantities, total, delivery details if needed, status, timestamps.
3. Use references and schema validation consistently.
4. Keep secrets in environment variables and verify MongoDB network access.

**Exit criteria**
- API connects to the intended database.
- Valid records can be created and read.
- Invalid data is rejected without crashing the server.

### M4 — Product CRUD (first complete vertical slice) [COMPLETED]
**Tasks**
1. `POST /api/products` — create a product listing.
2. `GET /api/products` — list products, with optional category/search filters.
3. `GET /api/products/:id` — get product details.
4. `PUT /api/products/:id` — update a listing.
5. `DELETE /api/products/:id` — delete a listing.
6. Connect the React product list and forms to these APIs.
7. Show loading, empty, success, and error states.
8. Enforce server-side validation and ownership checks; a user must not edit/delete another farmer's listing.

**Exit criteria**
- All five operations work through the UI and API.
- Changes persist in MongoDB after a page refresh.
- Unauthorized and invalid operations are rejected.

### M5 — Authentication and roles [COMPLETED]
**Tasks**
1. Implement registration and login APIs.
2. Hash passwords with bcrypt; never store plaintext passwords.
3. Sign and verify JWTs on the backend.
4. Add authentication middleware and role authorization.
5. Add React auth state/context and protected routes.
6. Restrict product creation/management to authenticated farmers; buyers can browse and order.
7. Handle expired/invalid tokens and logout safely.

**Exit criteria**
- Registration/login/logout work end to end.
- Backend authorization is enforced even if someone bypasses the frontend.
- Passwords and secrets are not exposed in responses or committed files.

### M6 — Buyer and farmer workflows [COMPLETED]
**Tasks**
1. Farmer dashboard: show that farmer's real listings and allow create/edit/delete.
2. Buyer experience: browse, search, filter, and view product details.
3. Order flow: buyer submits an order; server validates stock and calculates totals.
4. Farmer order management: view relevant orders and update permitted statuses.
5. Order history: show real records from MongoDB.
6. Add reviews or payment integration only if required later; do not fake payment success.

**Exit criteria**
- A buyer can place a test order for an available product.
- A farmer can view and update relevant order status.
- Dashboard values come from APIs, not hard-coded demo values.

### M7 — Quality, security, and verification [COMPLETED]
**Tasks**
1. Test API endpoints (Health, Auth, Products CRUD, Orders, Roles).
2. Test create/read/update/delete, bad IDs, missing fields, duplicates, empty results, and database/API failures.
3. Test buyer/farmer permissions and token lifecycle.
4. Validate forms on both frontend and backend.
5. Check responsive UI, loading states, optimistic updates, and user-facing errors.
6. Added automated test suite `server/tests/api.test.js` using Node.js built-in `node:test` and `node:assert/strict` (33 tests across 4 suites, runs in ~390ms).
7. Added MERN architecture validation test in `tests/test_frontend.py` (`FullStackStructureTests`).
8. Configured `make test-all` in root `Makefile` executing frontend Python tests, backend test suite, and Vite production build.

**Exit criteria**
- [x] All 33 automated backend tests pass (`NODE_ENV=test node --test tests/`).
- [x] Frontend Python unit tests pass (`python3 -m unittest discover -s tests -p "test_*.py" -v`).
- [x] Client production build passes with zero errors (`npm run build`).
- [x] Repository hygiene check passes (`bash scripts/hygiene.sh`).
- [x] Critical happy paths, input validations, and permission rejections are verified.

### M8 — MERN deployment and DevOps integration
**Tasks**
1. Decide whether the existing Docker setup will build the React client and serve it separately from the API, or use a documented multi-service setup.
2. Configure production environment variables and MongoDB Atlas access.
3. Update Docker Compose, GitHub Actions, and deployment configuration only after local integration works.
4. Update Kubernetes manifests and monitoring targets if the deployment architecture changes.
5. Configure production CORS and health checks.
6. Deploy and verify frontend, API, database connectivity, and CRUD flows from the live application.
7. Update screenshots and README to reflect only tested, current behavior.

**Exit criteria**
- The live frontend can reach the live backend.
- A test product can be created, read, updated, and deleted against the intended database.
- CI, container build, deployment, and monitoring status are documented truthfully.

## 3. Recommended implementation order

1. M0 audit
2. M1 React conversion
3. M2 Express backend
4. M3 MongoDB models
5. M4 product CRUD end to end
6. M5 authentication and role authorization
7. M6 orders and dashboards
8. M7 testing/security
9. M8 deployment/DevOps integration

Build one complete vertical slice first: **React product form → Express API → MongoDB → response shown in React**. Then extend the pattern to the remaining features.

## 4. Definition of done for each milestone

- Code is implemented in the correct layer.
- The feature runs locally.
- Positive and negative cases are tested.
- No secrets or unrelated files are committed.
- Existing functionality is not broken without a deliberate replacement.
- Git changes are reviewed and committed in small, logical commits.
- README and task status match the actual tested state.
