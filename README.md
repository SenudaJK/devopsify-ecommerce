# DevOpsify E-Commerce

A comprehensive DevOps learning project featuring a full-stack e-commerce application with React frontend, Node.js backend, and complete CI/CD pipeline.

## 🎯 Project Goals

This project is designed to help you **master DevOps skills** through hands-on experience with:
- Git workflows and branch protection
- CI/CD pipelines with GitHub Actions
- Docker containerization
- Kubernetes deployment
- Azure cloud infrastructure
- Monitoring and logging
- Security scanning and best practices

## 🏗️ Architecture

```
Frontend (React + TypeScript)  ←→  Backend (Node.js + Express)  ←→  Database (MongoDB)
     ↓                                      ↓                           ↓
  Port 3000                            Port 5001                  Port 27017
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Option 1: Automated Start (Recommended)

**Windows:**
```powershell
.\start-dev.ps1
```

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual Start

1. **Start Backend:**
```bash
cd src/backend
npm install
npm run build
npm start
```

2. **Start Frontend (new terminal):**
```bash
cd src/frontend  
npm install
npm start
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **Health Check:** http://localhost:5001/health

## 🔐 Demo Credentials

- **Email:** demo@devopsify.com
- **Password:** demo123

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/auth/login` | User login |
| GET | `/api/users/profile` | User profile |
| GET | `/api/cart` | Cart items |

## 🛠️ DevOps Features

### ✅ Phase 1: Git Workflow & CI/CD
- [x] Branch protection rules
- [x] CODEOWNERS setup
- [x] GitHub Actions workflows
- [x] Automated testing
- [x] Security scanning
- [x] Advanced CI/CD pipeline with quality gates

### ✅ Phase 2: Application Development  
- [x] React TypeScript frontend
- [x] Node.js Express backend
- [x] Mock data for development
- [x] API integration
- [x] Error handling
- [x] Working authentication

### ✅ Phase 3: Testing & Quality Assurance
- [x] Backend unit tests
- [x] Backend integration tests (Products, Auth, Cart APIs)
- [x] Frontend E2E tests with Playwright
- [x] Security vulnerability scanning (Trivy)
- [x] Code quality checks (ESLint, TypeScript)
- [x] Automated test coverage reporting
- [x] Multi-browser testing (Chrome, Firefox, Safari)
- [x] Mobile responsive testing

### 🔄 Phase 4: Infrastructure (Next)
- [ ] Docker containerization
- [ ] Kubernetes manifests
- [ ] Azure infrastructure with Terraform
- [ ] Monitoring with Prometheus/Grafana
- [ ] Log aggregation

## 📂 Project Structure

```
devopsify-ecommerce/
├── .github/workflows/     # CI/CD pipelines
├── src/
│   ├── frontend/         # React TypeScript app
│   └── backend/          # Node.js Express API
├── infrastructure/       # Terraform & Kubernetes
├── monitoring/          # Prometheus & Grafana
├── docs/               # Documentation
└── gitops/             # ArgoCD configurations
```

## 🧪 Development Mode

The application runs in **mock mode** by default:
- No database required for development
- Sample product data included
- Demo authentication working
- All API endpoints functional

## 🗄️ Database Setup (Optional)

To use MongoDB instead of mock data:

1. Install MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Update backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/devopsify-ecommerce
```

## 🔧 Technology Stack

**Frontend:**
- React 18 + TypeScript
- Material-UI components
- React Router
- Axios for API calls

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Helmet security
- Rate limiting

**DevOps:**
- GitHub Actions
- Docker
- Kubernetes
- Terraform
- Prometheus & Grafana
- Azure Cloud

## 📚 Learning Path

1. **Git & CI/CD** → Understanding workflows and automation
2. **Application Development** → Building full-stack applications
3. **Containerization** → Docker and container orchestration
4. **Infrastructure as Code** → Terraform for cloud resources
5. **Monitoring** → Observability and alerting
6. **Security** → Scanning and compliance

## 🤝 Contributing

This is a learning project! Feel free to:
- Submit issues
- Create pull requests
- Suggest improvements
- Add new DevOps features

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Learning! 🚀**

Master DevOps through hands-on experience with this comprehensive e-commerce project.
