# DevOpsify E-Commerce - ArgoCD GitOps Setup Script
# This script sets up ArgoCD on your AKS cluster for automated GitOps deployments

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipArgoCD = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipMonitoring = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$ArgocdVersion = "v2.9.3"
)

Write-Host "`n===================================================================" -ForegroundColor Cyan
Write-Host "   DevOpsify E-Commerce - GitOps & Monitoring Setup" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan

# Verify kubectl connection
Write-Host "`n[Pre-Check] Verifying AKS connection..." -ForegroundColor Yellow
kubectl cluster-info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Not connected to AKS cluster!" -ForegroundColor Red
    Write-Host "Run: az aks get-credentials --resource-group YOUR_RG --name YOUR_CLUSTER" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Connected to AKS cluster" -ForegroundColor Green

# =============================================================================
# ARGOCD INSTALLATION
# =============================================================================

if (-not $SkipArgoCD) {
    Write-Host "`n===================================================================" -ForegroundColor Cyan
    Write-Host "                     📦 INSTALLING ARGOCD" -ForegroundColor Cyan
    Write-Host "===================================================================" -ForegroundColor Cyan

    # Step 1: Create ArgoCD namespace
    Write-Host "`n[1/7] 📦 Creating ArgoCD namespace..." -ForegroundColor Yellow
    kubectl apply -f gitops/argocd/namespace.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ArgoCD namespace created" -ForegroundColor Green
    }

    # Step 2: Install ArgoCD
    Write-Host "`n[2/7] 🔧 Installing ArgoCD $ArgocdVersion..." -ForegroundColor Yellow
    kubectl apply -n argocd -f "https://raw.githubusercontent.com/argoproj/argo-cd/$ArgocdVersion/manifests/install.yaml"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ArgoCD installed successfully" -ForegroundColor Green
    }

    # Step 3: Wait for ArgoCD to be ready
    Write-Host "`n[3/7] ⏳ Waiting for ArgoCD to be ready (this may take 2-3 minutes)..." -ForegroundColor Yellow
    kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ArgoCD server is ready" -ForegroundColor Green
    }

    # Step 4: Create DevOpsify project
    Write-Host "`n[4/7] 📋 Creating DevOpsify project..." -ForegroundColor Yellow
    kubectl apply -f gitops/argocd/project.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ DevOpsify project created" -ForegroundColor Green
    }

    # Step 5: Create ArgoCD applications
    Write-Host "`n[5/7] 🎯 Creating ArgoCD applications..." -ForegroundColor Yellow
    kubectl apply -f gitops/argocd/applications.yaml
    kubectl apply -f gitops/argocd/production-app.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Applications created (dev, staging, prod)" -ForegroundColor Green
    }

    # Step 6: Expose ArgoCD UI
    Write-Host "`n[6/7] 🌐 Exposing ArgoCD UI via LoadBalancer..." -ForegroundColor Yellow
    kubectl patch svc argocd-server -n argocd -p '{\"spec\": {\"type\": \"LoadBalancer\"}}'
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ArgoCD UI exposed" -ForegroundColor Green
    }

    # Step 7: Get ArgoCD credentials
    Write-Host "`n[7/7] 🔐 Retrieving ArgoCD admin credentials..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    $argocdPassword = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
    
    Write-Host "`n===================================================================" -ForegroundColor Green
    Write-Host "              ✅ ARGOCD INSTALLATION COMPLETE" -ForegroundColor Green
    Write-Host "===================================================================" -ForegroundColor Green
    Write-Host "`n📝 ArgoCD Credentials:" -ForegroundColor Yellow
    Write-Host "   Username: admin" -ForegroundColor White
    Write-Host "   Password: $argocdPassword" -ForegroundColor White
    
    Write-Host "`n🌐 Getting ArgoCD UI URL..." -ForegroundColor Yellow
    Write-Host "   Waiting for external IP assignment..." -ForegroundColor Gray
    $argocdIP = ""
    for ($i = 0; $i -lt 30; $i++) {
        $argocdIP = kubectl get service argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
        if (-not [string]::IsNullOrEmpty($argocdIP)) {
            break
        }
        Start-Sleep -Seconds 5
    }
    
    if (-not [string]::IsNullOrEmpty($argocdIP)) {
        Write-Host "`n   ArgoCD UI: https://$argocdIP" -ForegroundColor Cyan
        Write-Host "   (Use --insecure flag for HTTPS or access via port-forward)" -ForegroundColor Gray
    } else {
        Write-Host "`n   ⏳ External IP still pending. Check with:" -ForegroundColor Yellow
        Write-Host "   kubectl get service argocd-server -n argocd" -ForegroundColor White
    }

} else {
    Write-Host "`n⏭️  Skipping ArgoCD installation" -ForegroundColor Gray
}

# =============================================================================
# MONITORING STACK INSTALLATION
# =============================================================================

if (-not $SkipMonitoring) {
    Write-Host "`n===================================================================" -ForegroundColor Cyan
    Write-Host "                  📊 INSTALLING MONITORING STACK" -ForegroundColor Cyan
    Write-Host "===================================================================" -ForegroundColor Cyan

    # Step 1: Create monitoring namespace
    Write-Host "`n[1/4] 📦 Creating monitoring namespace..." -ForegroundColor Yellow
    kubectl apply -f monitoring/namespace.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Monitoring namespace created" -ForegroundColor Green
    }

    # Step 2: Deploy Prometheus
    Write-Host "`n[2/4] 📈 Deploying Prometheus..." -ForegroundColor Yellow
    kubectl apply -f monitoring/prometheus/deployment.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prometheus deployed" -ForegroundColor Green
    }

    # Step 3: Deploy Grafana
    Write-Host "`n[3/4] 📊 Deploying Grafana..." -ForegroundColor Yellow
    kubectl apply -f monitoring/grafana/deployment.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Grafana deployed" -ForegroundColor Green
    }

    # Step 4: Wait for monitoring stack
    Write-Host "`n[4/4] ⏳ Waiting for monitoring stack to be ready..." -ForegroundColor Yellow
    kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n monitoring 2>$null
    kubectl wait --for=condition=available --timeout=300s deployment/grafana -n monitoring 2>$null
    
    Write-Host "`n===================================================================" -ForegroundColor Green
    Write-Host "           ✅ MONITORING STACK INSTALLATION COMPLETE" -ForegroundColor Green
    Write-Host "===================================================================" -ForegroundColor Green
    
    Write-Host "`n🌐 Getting Grafana URL..." -ForegroundColor Yellow
    $grafanaIP = ""
    for ($i = 0; $i -lt 30; $i++) {
        $grafanaIP = kubectl get service grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
        if (-not [string]::IsNullOrEmpty($grafanaIP)) {
            break
        }
        Start-Sleep -Seconds 5
    }
    
    if (-not [string]::IsNullOrEmpty($grafanaIP)) {
        Write-Host "`n   Grafana UI: http://$grafanaIP" -ForegroundColor Cyan
        Write-Host "`n   Default Credentials:" -ForegroundColor Yellow
        Write-Host "   Username: admin" -ForegroundColor White
        Write-Host "   Password: ChangeThisPassword123!" -ForegroundColor White
        Write-Host "   ⚠️  Change this password immediately!" -ForegroundColor Red
    } else {
        Write-Host "`n   ⏳ External IP still pending. Check with:" -ForegroundColor Yellow
        Write-Host "   kubectl get service grafana -n monitoring" -ForegroundColor White
    }

} else {
    Write-Host "`n⏭️  Skipping monitoring installation" -ForegroundColor Gray
}

# =============================================================================
# SUMMARY
# =============================================================================

Write-Host "`n===================================================================" -ForegroundColor Cyan
Write-Host "                      🎉 SETUP COMPLETE!" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan

Write-Host "`n📋 What was installed:" -ForegroundColor Yellow
if (-not $SkipArgoCD) {
    Write-Host "   ✅ ArgoCD GitOps platform" -ForegroundColor Green
    Write-Host "   ✅ DevOpsify project and applications (dev, staging, prod)" -ForegroundColor Green
}
if (-not $SkipMonitoring) {
    Write-Host "   ✅ Prometheus monitoring" -ForegroundColor Green
    Write-Host "   ✅ Grafana dashboards" -ForegroundColor Green
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Access ArgoCD UI and sync your applications" -ForegroundColor White
Write-Host "   2. Configure Grafana dashboards for monitoring" -ForegroundColor White
Write-Host "   3. Push changes to your Git repository to trigger deployments" -ForegroundColor White
Write-Host "   4. Monitor application health in ArgoCD and Grafana" -ForegroundColor White

Write-Host "`n📚 Useful Commands:" -ForegroundColor Yellow
Write-Host "   ArgoCD apps:       kubectl get applications -n argocd" -ForegroundColor White
Write-Host "   ArgoCD sync:       argocd app sync devopsify-dev" -ForegroundColor White
Write-Host "   Monitoring pods:   kubectl get pods -n monitoring" -ForegroundColor White
Write-Host "   Application pods:  kubectl get pods -n devopsify-dev" -ForegroundColor White

Write-Host "`n===================================================================" -ForegroundColor Cyan
