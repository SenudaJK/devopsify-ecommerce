# DevOpsify E-Commerce AKS Deployment Script
# This script deploys the application to Azure Kubernetes Service

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipImagePullSecret = $false
)

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "   🚀 DevOpsify E-Commerce AKS Deployment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Step 1: Verify kubectl connection
Write-Host "`n[1/9] 📡 Verifying AKS connection..." -ForegroundColor Yellow
kubectl cluster-info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not connected to AKS cluster!" -ForegroundColor Red
    Write-Host "Run: az aks get-credentials --resource-group <rg-name> --name <cluster-name>" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Connected to AKS cluster" -ForegroundColor Green

# Step 2: Create namespace
Write-Host "`n[2/9] 📦 Creating namespace..." -ForegroundColor Yellow
kubectl apply -f infrastructure/kubernetes/manifests-yaml/namespace.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Namespace created/updated" -ForegroundColor Green
}

# Step 3: Create secrets
Write-Host "`n[3/9] 🔐 Creating application secrets..." -ForegroundColor Yellow
kubectl apply -f infrastructure/kubernetes/manifests-yaml/secrets.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Secrets created/updated" -ForegroundColor Green
}

# Step 4: Create image pull secret
if (-not $SkipImagePullSecret) {
    Write-Host "`n[4/9] 🔑 Creating image pull secret..." -ForegroundColor Yellow
    
    if ([string]::IsNullOrEmpty($GitHubToken)) {
        Write-Host "⚠️  GitHub token not provided. Checking if secret already exists..." -ForegroundColor Yellow
        $existingSecret = kubectl get secret ghcr-secret -n devopsify 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Image pull secret 'ghcr-secret' does not exist!" -ForegroundColor Red
            Write-Host "Please create it manually with:" -ForegroundColor Yellow
            Write-Host "kubectl create secret docker-registry ghcr-secret ``" -ForegroundColor White
            Write-Host "  --docker-server=ghcr.io ``" -ForegroundColor White
            Write-Host "  --docker-username=SenudaJK ``" -ForegroundColor White
            Write-Host "  --docker-password=<YOUR_GITHUB_TOKEN> ``" -ForegroundColor White
            Write-Host "  --namespace=devopsify" -ForegroundColor White
            exit 1
        } else {
            Write-Host "✅ Image pull secret already exists" -ForegroundColor Green
        }
    } else {
        kubectl create secret docker-registry ghcr-secret `
            --docker-server=ghcr.io `
            --docker-username=SenudaJK `
            --docker-password=$GitHubToken `
            --namespace=devopsify `
            --dry-run=client -o yaml | kubectl apply -f -
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Image pull secret created/updated" -ForegroundColor Green
        }
    }
} else {
    Write-Host "`n[4/9] ⏭️  Skipping image pull secret creation" -ForegroundColor Gray
}

# Step 5: Create PVC for MongoDB
Write-Host "`n[5/9] 💾 Creating persistent storage for MongoDB..." -ForegroundColor Yellow
kubectl apply -f infrastructure/kubernetes/manifests-yaml/mongodb-pvc.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Persistent Volume Claim created" -ForegroundColor Green
}

# Step 6: Deploy MongoDB
Write-Host "`n[6/9] 🗄️  Deploying MongoDB..." -ForegroundColor Yellow
kubectl apply -f infrastructure/kubernetes/manifests-yaml/mongodb.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB deployment created/updated" -ForegroundColor Green
}

# Step 7: Deploy Backend
Write-Host "`n[7/9] ⚙️  Deploying Backend..." -ForegroundColor Yellow
kubectl apply -f infrastructure/kubernetes/manifests-yaml/backend.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend deployment created/updated" -ForegroundColor Green
}

# Step 8: Deploy Frontend
Write-Host "`n[8/9] 🎨 Deploying Frontend..." -ForegroundColor Yellow
kubectl apply -f infrastructure/kubernetes/manifests-yaml/frontend.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend deployment created/updated" -ForegroundColor Green
}

# Step 9: Wait for deployments
Write-Host "`n[9/9] ⏳ Waiting for deployments to be ready..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

Write-Host "`nWaiting for MongoDB..." -ForegroundColor Gray
kubectl wait --for=condition=available --timeout=300s deployment/devopsify-mongodb -n devopsify 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB is ready" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB deployment still in progress" -ForegroundColor Yellow
}

Write-Host "Waiting for Backend..." -ForegroundColor Gray
kubectl wait --for=condition=available --timeout=300s deployment/devopsify-backend -n devopsify 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend is ready" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend deployment still in progress" -ForegroundColor Yellow
}

Write-Host "Waiting for Frontend..." -ForegroundColor Gray
kubectl wait --for=condition=available --timeout=300s deployment/devopsify-frontend -n devopsify 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend is ready" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend deployment still in progress" -ForegroundColor Yellow
}

# Display deployment status
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "              ✅ DEPLOYMENT STATUS" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "`n📊 All Resources:" -ForegroundColor Yellow
kubectl get all -n devopsify

Write-Host "`n🌐 Getting external IP..." -ForegroundColor Yellow
$externalIP = kubectl get service devopsify-frontend-service -n devopsify -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null

if ([string]::IsNullOrEmpty($externalIP)) {
    Write-Host "⏳ External IP is still being provisioned..." -ForegroundColor Yellow
    Write-Host "Run this command to check status:" -ForegroundColor Gray
    Write-Host "kubectl get service devopsify-frontend-service -n devopsify" -ForegroundColor White
} else {
    Write-Host "`n🎉 APPLICATION DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "Frontend URL: http://$externalIP" -ForegroundColor Cyan
    Write-Host "`nOpen this URL in your browser to access the application." -ForegroundColor White
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "              📋 USEFUL COMMANDS" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "View pods:         kubectl get pods -n devopsify" -ForegroundColor White
Write-Host "View services:     kubectl get services -n devopsify" -ForegroundColor White
Write-Host "Backend logs:      kubectl logs -f deployment/devopsify-backend -n devopsify" -ForegroundColor White
Write-Host "Frontend logs:     kubectl logs -f deployment/devopsify-frontend -n devopsify" -ForegroundColor White
Write-Host "MongoDB logs:      kubectl logs -f deployment/devopsify-mongodb -n devopsify" -ForegroundColor White
Write-Host "View events:       kubectl get events -n devopsify --sort-by='.lastTimestamp'" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
