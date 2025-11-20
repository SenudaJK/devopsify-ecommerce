# DevOpsify E-Commerce - GitOps with ArgoCD Guide

This guide explains how to set up and use ArgoCD for automated GitOps deployments of the DevOpsify E-Commerce application.

## 🎯 What is GitOps?

GitOps is a way of implementing Continuous Deployment where:
- **Git is the single source of truth** for declarative infrastructure and applications
- **Automated processes** sync Git state to your cluster
- **Developers use Git workflows** (PR, review, merge) to deploy
- **Rollbacks** are as simple as reverting a Git commit

## 🚀 Quick Start

### Prerequisites

✅ AKS cluster running and kubectl configured
✅ Git repository accessible from cluster
✅ Sufficient resources (at least 8 CPU cores recommended)

### One-Command Setup

```powershell
# Install ArgoCD + Monitoring Stack
.\setup-gitops.ps1

# Or skip monitoring if you have resource constraints
.\setup-gitops.ps1 -SkipMonitoring

# Or skip ArgoCD if only installing monitoring
.\setup-gitops.ps1 -SkipArgoCD
```

## 📋 What Gets Installed

### ArgoCD Components
- **ArgoCD Server**: Web UI and API server
- **Application Controller**: Monitors applications and syncs with Git
- **Repo Server**: Retrieves manifests from Git
- **DevOpsify Project**: Configured with RBAC and policies
- **Three Applications**: dev, staging, and prod environments

### Monitoring Stack
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Pre-configured dashboards**: For application monitoring
- **Service discovery**: Automatic pod monitoring

## 🏗️ Architecture

### GitOps Workflow

```
Developer → Git Push → GitHub
                         ↓
                    ArgoCD detects change
                         ↓
                    Syncs to cluster
                         ↓
              Application deployed automatically
```

### Environment Structure

```
gitops/
├── base/                    # Base Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── mongodb-deployment.yaml
├── overlays/                # Environment-specific configs
│   ├── dev/                 # Development (auto-sync)
│   ├── staging/             # Staging (auto-sync)
│   └── prod/                # Production (manual sync)
└── argocd/                  # ArgoCD configurations
    ├── applications.yaml    # App definitions
    ├── project.yaml         # Project & RBAC
    └── production-app.yaml  # Production app
```

## 🔧 Configuration Details

### Development Environment
- **Branch**: `dev`
- **Namespace**: `devopsify-dev`
- **Replicas**: 1 per service
- **Sync Policy**: Automated with self-heal
- **Image Tag**: `dev` or `latest`

### Staging Environment
- **Branch**: `master`
- **Namespace**: `devopsify-staging`
- **Replicas**: 2 per service
- **Sync Policy**: Automated with self-heal
- **Image Tag**: `staging`

### Production Environment
- **Branch**: `master`
- **Namespace**: `devopsify-prod`
- **Replicas**: 3 per service
- **Sync Policy**: Manual (requires approval)
- **Image Tag**: Semantic version (e.g., `v1.0.0`)

## 🎮 Using ArgoCD

### Access ArgoCD UI

```powershell
# Get external IP
kubectl get service argocd-server -n argocd

# Access UI at: https://<EXTERNAL-IP>

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
```

### Sync an Application

#### Via UI
1. Login to ArgoCD
2. Click on application (e.g., `devopsify-dev`)
3. Click "SYNC" button
4. Review changes
5. Click "SYNCHRONIZE"

#### Via CLI
```powershell
# Install ArgoCD CLI
winget install ArgoCD.ArgoCD-CLI

# Login
argocd login <ARGOCD-SERVER> --username admin --password <PASSWORD>

# Sync application
argocd app sync devopsify-dev

# Check application health
argocd app get devopsify-dev

# List all applications
argocd app list
```

### Deploy New Version

#### For Development
```bash
# 1. Make changes to code
# 2. Build new image with 'dev' tag
docker build -t ghcr.io/senudajk/devopsify-backend:dev .
docker push ghcr.io/senudajk/devopsify-backend:dev

# 3. ArgoCD automatically detects and deploys (within 3 minutes)
# Or manually sync:
argocd app sync devopsify-dev
```

#### For Production
```bash
# 1. Build image with semantic version
docker build -t ghcr.io/senudajk/devopsify-backend:v1.2.0 .
docker push ghcr.io/senudajk/devopsify-backend:v1.2.0

# 2. Update gitops/overlays/prod/kustomization.yaml
# Change:
#   images:
#   - name: ghcr.io/senudajk/devopsify-backend
#     newTag: v1.2.0

# 3. Commit and push to master
git add gitops/overlays/prod/kustomization.yaml
git commit -m "chore: update production backend to v1.2.0"
git push origin master

# 4. Manually sync in ArgoCD UI (production requires approval)
argocd app sync devopsify-prod
```

## 📊 Monitoring with Prometheus & Grafana

### Access Grafana

```powershell
# Get Grafana URL
kubectl get service grafana -n monitoring

# Access UI at: http://<EXTERNAL-IP>
# Default credentials: admin / ChangeThisPassword123!
```

### What's Monitored

- **Pod Health**: Up/down status of all pods
- **CPU Usage**: Per pod and per namespace
- **Memory Usage**: Current and historical usage
- **Request Rate**: HTTP requests per second
- **Response Times**: API response latencies
- **Error Rates**: Failed requests and errors

### Available Dashboards

1. **DevOpsify E-Commerce Dashboard**: Main application metrics
2. **Kubernetes Cluster**: Overall cluster health
3. **Pod Metrics**: Detailed pod-level metrics

### Custom Metrics

Add Prometheus annotations to your pods:

```yaml
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "5001"
    prometheus.io/path: "/metrics"
```

## 🔐 Security Best Practices

### Change Default Passwords

```powershell
# ArgoCD password
kubectl -n argocd patch secret argocd-secret -p '{"stringData": {"admin.password": "<NEW-BCRYPT-HASH>"}}'

# Grafana password
kubectl -n monitoring patch secret grafana-secret -p '{"stringData": {"admin-password": "NewSecurePassword"}}'
```

### Configure RBAC

Edit `gitops/argocd/project.yaml` to add roles:

```yaml
roles:
- name: developer
  description: Developer access
  policies:
  - p, proj:devopsify-project:developer, applications, sync, devopsify-project/dev-*, allow
```

### Use Secrets Management

- Store secrets in Azure Key Vault
- Use External Secrets Operator
- Never commit secrets to Git

## 🔄 GitOps Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes to code
# 3. Build and push dev image
docker build -t ghcr.io/senudajk/devopsify-backend:dev .
docker push ghcr.io/senudajk/devopsify-backend:dev

# 4. Push to dev branch
git push origin feature/new-feature

# 5. Create PR to dev branch
# 6. After merge, ArgoCD syncs to devopsify-dev namespace
```

### Release to Staging
```bash
# 1. Merge dev to master
git checkout master
git merge dev
git push origin master

# 2. ArgoCD syncs to devopsify-staging namespace
```

### Release to Production
```bash
# 1. Update image tag in prod overlay
# Edit gitops/overlays/prod/kustomization.yaml

# 2. Commit and push
git add gitops/overlays/prod/kustomization.yaml
git commit -m "release: v1.2.0"
git tag v1.2.0
git push origin master --tags

# 3. Manually sync in ArgoCD UI
```

## 🐛 Troubleshooting

### Application Out of Sync

```powershell
# Check application status
argocd app get devopsify-dev

# View sync errors
argocd app sync devopsify-dev --dry-run

# Force sync
argocd app sync devopsify-dev --force
```

### ArgoCD UI Not Accessible

```powershell
# Check service
kubectl get service argocd-server -n argocd

# Port forward as workaround
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access at: https://localhost:8080
```

### Monitoring Not Working

```powershell
# Check Prometheus
kubectl get pods -n monitoring
kubectl logs -f deployment/prometheus -n monitoring

# Check Grafana
kubectl logs -f deployment/grafana -n monitoring

# Verify datasource
kubectl exec -it deployment/grafana -n monitoring -- curl http://prometheus:9090/-/healthy
```

### Common Issues

#### "Application has pending changes"
- **Cause**: Git changes detected but not synced
- **Solution**: Click "Sync" in ArgoCD UI

#### "Image pull failed"
- **Cause**: Image doesn't exist or no pull secret
- **Solution**: Verify image exists and add image pull secret

#### "Insufficient resources"
- **Cause**: Not enough CPU/memory in cluster
- **Solution**: Scale cluster or reduce resource requests

## 📈 Metrics and Observability

### Key Metrics to Monitor

- **Deployment Frequency**: How often you deploy
- **Lead Time**: Time from commit to production
- **Mean Time to Recovery**: How quickly you fix issues
- **Change Failure Rate**: Percentage of failed deployments

### ArgoCD Notifications

Configure notifications for deployment events:

```yaml
# Add to argocd-notifications-cm ConfigMap
triggers:
  - name: on-sync-succeeded
    condition: app.status.operationState.phase in ['Succeeded']
    template: app-sync-succeeded
```

## 🎓 Best Practices

1. **Use Semantic Versioning**: Tag images with v1.2.3 format
2. **Automate Dev/Staging**: Let them sync automatically
3. **Manual Production**: Require approval for prod deployments
4. **Monitor Everything**: Set up alerts for critical metrics
5. **Test in Staging**: Always test before production
6. **Small Changes**: Deploy frequently with small changes
7. **Quick Rollback**: Keep previous versions for fast rollback
8. **Document Changes**: Use meaningful commit messages

## 🔄 Rollback Procedure

### Rollback via Git

```bash
# 1. Revert commit
git revert <commit-hash>
git push origin master

# 2. ArgoCD syncs reverted state
```

### Rollback via ArgoCD

```powershell
# View history
argocd app history devopsify-prod

# Rollback to previous version
argocd app rollback devopsify-prod <REVISION>
```

## 📚 Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Kustomize Documentation](https://kustomize.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🆘 Support

For issues or questions:
- Check ArgoCD logs: `kubectl logs -f deployment/argocd-server -n argocd`
- Check application events: `kubectl get events -n devopsify-dev`
- Review application status: `argocd app get devopsify-dev`

---

**Next Steps**: Run `.\setup-gitops.ps1` to get started!
