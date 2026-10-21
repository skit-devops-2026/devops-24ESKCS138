# Kisan Market

Kisan Market is an agriculture marketplace frontend that connects farmers and customers through a simple web interface. The project demonstrates frontend development using HTML, CSS, JavaScript, and jQuery.

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS138 | Hanuman Choudhary | [HANUMANart](https://github.com/HANUMANart) |

## About

The application provides a marketplace-style interface for agricultural products. The project is being extended with DevOps practices such as Continuous Integration, automated testing, containerization, monitoring, and deployment.

## Live URL

The application is deployed and accessible online:

**[Open Kisan Market](https://kisan-market-1-1.onrender.com/)**

## Docker Image

The Docker image is published on Docker Hub.

**Docker Hub:** [hanumanart/kisan-market](https://hub.docker.com/r/hanumanart/kisan-market)

**Pull command:**

```bash
docker pull hanumanart/kisan-market:1.1
```

**Run the container locally:**

```bash
docker run -d -p 8080:10000 --name kisan-market hanumanart/kisan-market:1.1
```

Open `http://localhost:8080` in your browser.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, jQuery
- **Backend:** None currently
- **Database:** None currently
- **DevOps:** Git, GitHub, Jenkins, GitHub Actions, Docker, Docker Hub, Render
- **Monitoring:** Prometheus, Blackbox Exporter, Grafana

## Project Files

- `front1.html` — Main frontend page
- `front1.css` — Frontend styling
- `script1.js` — JavaScript/jQuery functionality
- `Dockerfile` — Docker image configuration
- `docker-compose.yml` — Application container configuration
- `Jenkinsfile` — Jenkins CI pipeline
- `Makefile` — Install, test, build, and run commands
- `monitoring/` — Prometheus, Blackbox Exporter, and Grafana dashboard configuration
- `docs/` — Deployment and monitoring screenshots

## Running Locally

```bash
make install
make test
make build
make run
```

## Continuous Integration

GitHub Actions automatically runs repository hygiene checks and the frontend test suite on pushes and pull requests.

## Deployment and Monitoring

The application is containerized using Docker and deployed on Render. Prometheus and Blackbox Exporter are configured to monitor the availability and response time of the live website. Grafana is used to visualize monitoring metrics.

## Kubernetes Deployment

The Kisan Market application is deployed on Kubernetes using a Deployment with two replicas and a NodePort Service.

### Verify the Deployment

```bash
kubectl get nodes
kubectl get deployments
kubectl get pods
kubectl get services
```

### Access the Application

Run the following command to access the application locally:

```bash
kubectl port-forward service/kisan-market-service 8082:80
```

Keep the terminal running and open http://localhost:8082 in your browser.

### Configuration

- Deployment manifest: `k8s/deployment.yaml`
- Service manifest: `k8s/service.yaml`
- Container image: `hanumanart/kisan-market:1.2`
- Replicas: 2
- Container port: 10000
- Service type: NodePort
- Configured NodePort: 30080
- Deployment screenshot: `docs/kubernetes-deployment.png`

### Apply the Manifests

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Kubernetes Deployment

The Kisan Market application is deployed on Kubernetes using a Deployment
with two replicas and a NodePort Service.

### Verify the Deployment

```bash
kubectl get nodes
kubectl get deployments
kubectl get pods
kubectl get services

## Git Workflow

Feature changes are developed on separate branches and merged into `main` through Pull Requests.