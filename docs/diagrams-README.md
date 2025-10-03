# DevOpsify E-Commerce Architecture Diagrams

This directory contains comprehensive architecture d### **For Azure Deployment:**
- Replace "Cloud Provider" with specific Azure services
- Update VNet CIDR blocks to match your setup (10.0.0.0/16)
- Modify VM sizes based on your requirements (Standard_D2s_v3)
- Use Azure Container Registry (ACR) instead of Docker Hub
- Configure Azure Key Vault for secrets management
- Set up Azure Monitor + Application Insights for monitoring

### **For Different Cloud Providers:**
- **AWS**: Replace AKS with EKS, ACR with ECR, Azure VMs with EC2
- **GCP**: Replace AKS with GKE, ACR with GCR, Azure VMs with Compute Enginefor the DevOpsify E-Commerce application, covering all aspects from application architecture to infrastructure and CI/CD pipelines.

## 📋 Available Diagrams

### 1. **Application Architecture** (`architecture-diagram.puml`)
- **Purpose**: High-level overview of application components
- **Includes**: Frontend, Backend, Database tiers with their interactions
- **Key Elements**: 
  - React Frontend (Nginx) - Port 3000/80
  - Node.js Backend (Express) - Port 5001  
  - MongoDB Database - Port 27017
  - Container Registry integration
  - CI/CD pipeline flow

### 2. **Network Architecture** (`network-diagram.puml`)
- **Purpose**: Detailed Kubernetes networking and pod communication
- **Includes**: Subnets, Service mesh, Network policies
- **Key Elements**:
  - Pod networks (10.244.x.0/24)
  - Service networks (10.96.x.0/16)
  - Ingress controller routing
  - Inter-service communication
  - DNS resolution

### 3. **Infrastructure Architecture** (`infrastructure-diagram.puml`)
- **Purpose**: Cloud infrastructure and resource allocation
- **Includes**: VPC, Subnets, Security groups, Instance types
- **Key Elements**:
  - VPC Design (10.0.0.0/16)
  - Multi-AZ deployment
  - Public/Private subnet separation
  - Load balancer configuration
  - Storage and compute resources

### 4. **CI/CD Pipeline** (`cicd-pipeline-diagram.puml`)
- **Purpose**: Complete DevOps workflow from development to production
- **Includes**: Git workflow, Build pipeline, Deployment strategy
- **Key Elements**:
  - Development → Staging → Production flow
  - GitHub Actions CI/CD
  - Container registry integration
  - Rollback strategies
  - Monitoring and alerting

## 🛠️ How to View the Diagrams

### Option 1: PlantUML Online (Immediate)
1. Copy the content of any `.puml` file
2. Go to [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
3. Paste the content and click "Submit"

### Option 2: VS Code Extension (Recommended for Development)
1. Install the "PlantUML" extension in VS Code
2. Open any `.puml` file
3. Use `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram"
4. Or use `Alt+D` for quick preview

### Option 3: Local PlantUML Installation
```bash
# Install PlantUML
npm install -g plantuml
# or
pip install plantuml

# Generate PNG images
plantuml docs/*.puml

# Generate SVG images  
plantuml -tsvg docs/*.puml
```

### Option 4: Docker (No Installation Required)
```bash
# Generate all diagrams as PNG
docker run --rm -v $(pwd)/docs:/data plantuml/plantuml:latest -o /data/images /data/*.puml

# Generate as SVG
docker run --rm -v $(pwd)/docs:/data plantuml/plantuml:latest -tsvg -o /data/images /data/*.puml
```

## 🏗️ Diagram Elements Legend

### Colors Used:
- **Blue (#2196F3)**: Frontend components, CI/CD
- **Green (#4CAF50)**: Backend components, Success states
- **Red (#F44336)**: Database, Critical components
- **Orange (#FF9800)**: Staging environment, Build processes
- **Purple (#9C27B0)**: Container registry, External services
- **Cyan (#00BCD4)**: Kubernetes infrastructure

### Component Types:
- **Rectangles**: Services, Applications, Infrastructure
- **Packages**: Logical groupings (Networks, Tiers)
- **Actors**: Users, Developers
- **Clouds**: External services, Internet

## 🔧 Customization for Your Environment

### For AWS Deployment:
- Replace "Cloud Provider" with specific AWS services
- Update VPC CIDR blocks to match your setup
- Modify instance types based on your requirements

### For Different Cloud Providers:
- **GCP**: Replace EC2 with Compute Engine, EKS with GKE
- **Azure**: Replace EC2 with Virtual Machines, EKS with AKS

### For On-Premises:
- Replace cloud services with on-prem equivalents
- Update network ranges to match your infrastructure
- Modify load balancer to your solution (HAProxy, etc.)

## 📊 Infrastructure Specifications

### Current Configuration:
- **Frontend**: 2 replicas, 128Mi-256Mi memory, 100m-200m CPU
- **Backend**: 2 replicas, 256Mi-512Mi memory, 250m-500m CPU  
- **Database**: 1 replica, Persistent volume, MongoDB 6.0
- **Load Balancer**: Kubernetes LoadBalancer service
- **Container Registry**: GitHub Container Registry (ghcr.io)

### Network Configuration:
- **Frontend Network**: External port 3000, Internal port 80
- **Backend Network**: Port 5001, Health check on /health
- **Database Network**: Port 27017, Internal cluster access only
- **Ingress**: HTTP/HTTPS traffic routing

## 🚀 Next Steps

1. **Review Current Architecture**: Understand the existing setup
2. **Plan Infrastructure**: Choose cloud provider and sizing
3. **Set up Monitoring**: Implement Prometheus + Grafana
4. **Security Hardening**: Add network policies, RBAC
5. **Disaster Recovery**: Plan backup and restore procedures

## 🔗 Related Documentation

- [README.md](../README.md) - Project overview
- [deployment.md](deployment.md) - Deployment instructions  
- [../infrastructure/](../infrastructure/) - Infrastructure as Code
- [../.github/workflows/](../.github/workflows/) - CI/CD pipeline configuration
