# DevOpsify E-Commerce - CI/CD Setup

## 🚀 Automated Docker Build & Deployment

This project uses GitHub Actions to automatically build and deploy the frontend Docker image whenever changes are pushed to the master branch.

### 📋 Setup Requirements

1. **Docker Hub Secrets**: Add the following secrets to your GitHub repository:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

2. **Repository Settings**:
   - Go to Settings → Secrets and variables → Actions
   - Add the required secrets

### 🔄 Automated Workflow

The GitHub Actions workflow (`build-frontend.yml`) automatically:

1. **Triggers on**:
   - Push to `master` or `main` branch
   - Changes in `src/frontend/` directory
   - Pull requests to master branch

2. **Build Process**:
   - ✅ Checks out the repository
   - ✅ Sets up Docker Buildx for multi-platform builds
   - ✅ Logs into Docker Hub
   - ✅ Builds the frontend Docker image
   - ✅ Pushes to Docker Hub as `s3nudaj/devopsify-frontend:latest`
   - ✅ Supports both AMD64 and ARM64 architectures

3. **GitOps Integration**:
   - ArgoCD automatically detects the new image
   - Deploys to production environment
   - Updates the live website at http://20.6.157.14

### 🏗️ Manual Build (Troubleshooting)

If you need to build manually:

```bash
# Navigate to frontend directory
cd src/frontend

# Build the image
docker build -t s3nudaj/devopsify-frontend:latest .

# Push to Docker Hub
docker push s3nudaj/devopsify-frontend:latest
```

### 🔍 Monitoring Deployments

1. **GitHub Actions**: Check the Actions tab for build status
2. **ArgoCD Dashboard**: Monitor deployment status at localhost:8083
3. **Production Site**: Verify changes at http://20.6.157.14

### 🎨 Modern UI Features

The latest build includes:
- 🌙 Dark theme with glassmorphism effects
- 🎨 Advanced gradients and animations
- 💎 Premium product catalog
- ✨ Interactive hover effects
- 🚀 Modern typography and spacing

### 🐛 Troubleshooting

**Build Failures**: Check GitHub Actions logs for details
**Deployment Issues**: Verify ArgoCD application sync status
**Image Pull Issues**: Ensure Docker Hub credentials are correct

### 📈 Performance Optimizations

- Multi-stage Docker build for smaller images
- Production-optimized React build
- Nginx with custom configuration
- Health checks for container monitoring
- Multi-platform support (AMD64/ARM64)