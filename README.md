# Kisan Market — MERN Agricultural Marketplace

Kisan Market is an agricultural marketplace project connecting farmers directly with buyers to discover, purchase, and sell fresh farm produce. The project combines a modern, responsive full-stack **MERN** (MongoDB, Express, React, Node.js) application with automated DevOps practices (CI/CD, Docker containerization, Kubernetes orchestration, and Prometheus/Grafana monitoring).

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS138 | Hanuman Choudhary | [HANUMANart](https://github.com/HANUMANart) |

---

## 1. Live Deployment & DevOps Links

- **Live URL:** [https://kisan-market-1-1.onrender.com/](https://kisan-market-1-1.onrender.com/)
- **Docker Hub Repository:** [hanumanart/kisan-market](https://hub.docker.com/r/hanumanart/kisan-market)
  ```bash
  docker pull hanumanart/kisan-market:1.2
  ```
- **Kubernetes Manifests:** [`k8s/deployment.yaml`](k8s/deployment.yaml), [`k8s/service.yaml`](k8s/service.yaml) (NodePort `30080`, 2 Replicas)
- **Monitoring:** Prometheus, Blackbox Exporter, and Grafana dashboard configured in [`monitoring/`](monitoring/)

---

## 2. Technology Stack

### Full-Stack MERN Application
- **Frontend:** React 18 + Vite (located in [`client/`](client/))
- **Routing:** React Router v6
- **Styling:** CSS3 (reusing and modularizing the Kisan Market theme from [`front1.css`](front1.css))
- **Backend:** Node.js + Express.js REST API (located in [`server/`](server/))
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** bcrypt password hashing + JWT tokens
- **API Testing:** Postman & automated curl checks

### DevOps & Infrastructure
- **Version Control:** Git & GitHub
- **Continuous Integration:** GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) & Jenkins ([`Jenkinsfile`](Jenkinsfile))
- **Containerization:** Docker ([`Dockerfile`](Dockerfile)) & Docker Compose ([`docker-compose.yml`](docker-compose.yml))
- **Orchestration:** Kubernetes (Deployment & Service in [`k8s/`](k8s/))
- **Reverse Proxy:** Nginx ([`nginx.conf`](nginx.conf))
- **Observability:** Prometheus & Grafana dashboard ([`monitoring/`](monitoring/))

---

## 3. Main User Roles

### Farmer
- Register and log in as a farmer.
- Create agricultural product listings (crop name, category, price, stock, description).
- View, edit, and delete their own produce listings.
- Track incoming buyer orders and update permitted order statuses.

### Buyer
- Register and log in as a buyer.
- Browse, search, and filter available products across categories.
- View detailed produce and farmer origin information.
- Place direct orders and track order status.

---

## 4. CRUD API Specification

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| Create | `POST` | `/api/products` | Create a product listing |
| Read all | `GET` | `/api/products` | List/search/filter products |
| Read one | `GET` | `/api/products/:id` | Get product details |
| Update | `PUT` | `/api/products/:id` | Update a listing |
| Delete | `DELETE` | `/api/products/:id` | Remove a listing |

Other key endpoints:
- `GET /api/health` — Backend health check and uptime
- `POST /api/auth/register` — Register a new farmer or buyer
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/orders` — View user/farmer order history
- `POST /api/orders` — Submit new order with server-side stock validation

---

## 5. Project Directory Structure

```text
FSD Project/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Hero, CategoryList, ProductCard, etc.
│   │   ├── pages/              # HomePage, ProductsPage, ProductDetailPage, Login, Register, FarmerDashboard
│   │   ├── data/               # mockProducts.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express REST API Backend
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # healthController, productController, authController
│   ├── middleware/             # errorHandler, authMiddleware
│   ├── models/                 # User, Product, Order schemas
│   ├── routes/                 # healthRoutes, productRoutes, authRoutes, orderRoutes
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── k8s/                        # Kubernetes manifests
│   ├── deployment.yaml
│   └── service.yaml
├── monitoring/                 # Prometheus, Grafana, Blackbox exporter
├── docs/                       # DevOps & deployment screenshots
├── front1.html                 # Preserved frontend entry point
├── front1.css                  # Preserved stylesheet
├── script1.js                  # Preserved jQuery script
├── index.html                  # Preserved for Jenkins file validation
├── Jenkinsfile                 # Jenkins CI Pipeline
├── Dockerfile                  # Container build file
├── docker-compose.yml          # Container compose
├── README.md                   # Project documentation
└── WORKFLOW.md                 # Milestone tracker
```

---

## 6. Development Milestones

- [x] **M0** — Audit repository, current UI, Git state, and DevOps assets.
- [x] **M1** — Convert frontend to React + Vite with responsive Kisan Market theme.
- [x] **M2** — Build Express API foundation, `/api/health`, and centralized error handling.
- [x] **M3** — Connect MongoDB Atlas and define Mongoose models (`User`, `Product`, `Order`).
- [x] **M4** — Implement end-to-end product CRUD with database persistence.
- [ ] **M5** — Add authentication, JWT tokens, bcrypt hashing, and role authorization.
- [ ] **M6** — Connect farmer and buyer dashboards with order placement workflows.
- [ ] **M7** — Comprehensive testing: validation, permissions, error handling, responsive UI.
- [ ] **M8** — Adapt Docker, CI, Kubernetes, and monitoring for full-stack MERN.

---

## 7. Running Locally

### 1. Run the Express Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev     # Starts on http://localhost:5001
```

Health check:
```bash
curl http://localhost:5001/api/health
```

### 2. Run the React Frontend
In a separate terminal:
```bash
cd client
npm install
cp .env.example .env
npm run dev     # Starts on http://localhost:5173
```

---

## 8. Testing Checklist

- [x] Backend health endpoint responds successfully (`GET /api/health`).
- [x] Responsive layout works on mobile, tablet, and desktop.
- [x] Frontend and backend environment variables configured (`.env.example` & local).
- [ ] MongoDB connection succeeds.
- [ ] Registration and login work; passwords hashed with bcrypt.
- [ ] Invalid credentials and invalid inputs return safe error responses.
- [x] Product create/list/detail/update/delete endpoints work end-to-end.
- [x] Product changes persist after page refresh.
- [ ] Role authorization enforced: farmers cannot modify another farmer's produce.
- [ ] Buyer can browse and place an order with server-side stock calculation.
- [ ] Live CRUD flow tested after deployment.

---

## 9. Kubernetes & Container Operations

### Run via Docker
```bash
docker run -d -p 8080:10000 --name kisan-market hanumanart/kisan-market:1.2
```

### Apply Kubernetes Manifests
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Access locally via port forwarding:
```bash
kubectl port-forward service/kisan-market-service 8082:80
```
