# AKS Deployment Guide

This guide explains how to deploy the DevOpsify E-Commerce application to Azure Kubernetes Service (AKS).

## Prerequisites

✅ Azure CLI installed and authenticated (`az login`)
✅ kubectl installed and configured
✅ AKS cluster created and running
✅ Docker images built and pushed to GHCR (GitHub Container Registry)
✅ GitHub Personal Access Token with `read:packages` permission

## Quick Start

### 1. Connect to Your AKS Cluster

```powershell
# Get AKS credentials
az aks get-credentials --resource-group <your-resource-group> --name <your-cluster-name>

# Verify connection
kubectl get nodes
```

### 2. Create Image Pull Secret

```powershell
# Create secret for pulling images from GHCR
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=SenudaJK \
  --docker-password=<YOUR_GITHUB_TOKEN> \
  --namespace=devopsify
```

### 3. Deploy Application

```powershell
# Run the automated deployment script
.\deploy-to-aks.ps1

# Or with GitHub token parameter
.\deploy-to-aks.ps1 -GitHubToken "ghp_your_token_here"
```

## Manual Deployment Steps

If you prefer to deploy manually:

```powershell
# 1. Create namespace
kubectl apply -f infrastructure/kubernetes/manifests-yaml/namespace.yaml

# 2. Create secrets
kubectl apply -f infrastructure/kubernetes/manifests-yaml/secrets.yaml

# 3. Create persistent storage
kubectl apply -f infrastructure/kubernetes/manifests-yaml/mongodb-pvc.yaml

# 4. Deploy MongoDB
kubectl apply -f infrastructure/kubernetes/manifests-yaml/mongodb.yaml

# 5. Deploy Backend
kubectl apply -f infrastructure/kubernetes/manifests-yaml/backend.yaml

# 6. Deploy Frontend
kubectl apply -f infrastructure/kubernetes/manifests-yaml/frontend.yaml

# 7. Check deployment status
kubectl get all -n devopsify
```

## What Was Fixed

### 🔐 Security Improvements
- ✅ Removed hardcoded credentials from manifests
- ✅ Created Kubernetes secrets for MongoDB credentials
- ✅ Created secret for JWT tokens
- ✅ Added image pull secrets for private registry

### 💾 Persistent Storage
- ✅ Added PersistentVolumeClaim for MongoDB
- ✅ Changed from `emptyDir` to Azure Managed Disk
- ✅ Data persists across pod restarts

### ⚡ Resource Optimization
- ✅ Reduced CPU requests to fit within quota limits
- ✅ Optimized memory allocation
- ✅ Adjusted replicas for efficient resource usage

**Resource Summary:**
- Frontend: 100m CPU, 128Mi RAM (per pod, 2 replicas)
- Backend: 100m CPU, 128Mi RAM (per pod, 2 replicas)
- MongoDB: 100m CPU, 256Mi RAM (1 replica)
- **Total: ~600m CPU, ~1Gi RAM** (fits in 6 CPU core limit)

### 🔧 Configuration Updates
- ✅ Service names standardized (`devopsify-*-service`)
- ✅ Added proper labels and metadata
- ✅ Environment variables use secret references
- ✅ Added REACT_APP_API_URL for frontend-backend communication

## Verification

### Check Pod Status
```powershell
kubectl get pods -n devopsify -w
```

Expected output:
```
NAME                                  READY   STATUS    RESTARTS   AGE
devopsify-backend-xxxxx               1/1     Running   0          2m
devopsify-backend-yyyyy               1/1     Running   0          2m
devopsify-frontend-zzzzz              1/1     Running   0          2m
devopsify-frontend-aaaaa              1/1     Running   0          2m
devopsify-mongodb-bbbbb               1/1     Running   0          2m
```

### Check Services
```powershell
kubectl get services -n devopsify
```

### Get External IP
```powershell
kubectl get service devopsify-frontend-service -n devopsify
```

Wait for `EXTERNAL-IP` to change from `<pending>` to an actual IP address.

### Access Application
Once the external IP is available, open it in your browser:
```
http://<EXTERNAL-IP>
```

## Troubleshooting

### Pods in ImagePullBackOff
```powershell
# Check if secret exists
kubectl get secret ghcr-secret -n devopsify

# If missing, create it
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=SenudaJK \
  --docker-password=<YOUR_GITHUB_TOKEN> \
  --namespace=devopsify
```

### Pods in Pending State
```powershell
# Check events
kubectl get events -n devopsify --sort-by='.lastTimestamp'

# Check node resources
kubectl top nodes

# Describe pod to see error
kubectl describe pod <pod-name> -n devopsify
```

### Check Logs
```powershell
# Backend logs
kubectl logs -f deployment/devopsify-backend -n devopsify

# Frontend logs
kubectl logs -f deployment/devopsify-frontend -n devopsify

# MongoDB logs
kubectl logs -f deployment/devopsify-mongodb -n devopsify
```

### MongoDB Connection Issues
```powershell
# Verify MongoDB secret
kubectl get secret mongodb-secret -n devopsify -o yaml

# Check MongoDB service
kubectl get service devopsify-mongodb-service -n devopsify

# Test connection from backend pod
kubectl exec -it deployment/devopsify-backend -n devopsify -- sh
# Inside pod:
# nc -zv devopsify-mongodb-service 27017
```

## Cleanup

To remove the entire deployment:

```powershell
# Delete all resources
kubectl delete namespace devopsify

# Or delete individually
kubectl delete -f infrastructure/kubernetes/manifests-yaml/
```

## Next Steps

1. **Set up monitoring**: Deploy Prometheus and Grafana
2. **Configure GitOps**: Set up ArgoCD for automated deployments
3. **Add HTTPS**: Configure Ingress with TLS certificates
4. **Implement backup**: Set up MongoDB backup strategy
5. **Scale cluster**: Request Azure quota increase if needed

## Important Notes

⚠️ **Security Warning**: The secrets in `secrets.yaml` contain placeholder values. Change these before production deployment!

⚠️ **Storage**: MongoDB uses Azure Managed Disk (5Gi). Adjust size in `mongodb-pvc.yaml` if needed.

⚠️ **Cost**: LoadBalancer service creates an Azure Load Balancer which incurs costs.

## Support

For issues or questions:
- Check pod logs: `kubectl logs -f <pod-name> -n devopsify`
- Check events: `kubectl get events -n devopsify --sort-by='.lastTimestamp'`
- Review AKS cluster health in Azure Portal
