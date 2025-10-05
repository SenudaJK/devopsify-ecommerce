# Azure Architecture Diagrams for DevOpsify E-Commerce

## 🔵 **Azure-Specific Draw.io Guide**

### **Azure Icon Libraries to Enable in Draw.io:**

1. **Go to Draw.io**: [app.diagrams.net](https://app.diagrams.net)
2. **Enable Azure Libraries**:
   - ✅ **Azure** (Main Azure services)
   - ✅ **Azure - Enterprise Integration** 
   - ✅ **Azure - Analytics**
   - ✅ **Azure - Compute**
   - ✅ **Azure - Containers**
   - ✅ **Azure - Databases**
   - ✅ **Azure - DevOps**
   - ✅ **Azure - Identity**
   - ✅ **Azure - Integration**
   - ✅ **Azure - Networking**
   - ✅ **Azure - Security**
   - ✅ **Azure - Storage**
   - ✅ **Kubernetes** (for AKS)

### **Azure Services to Use in Your Diagrams:**

#### **1. Application Architecture:**
```
Internet Users
     ↓
Azure Load Balancer (Standard SKU)
     ↓
Azure Kubernetes Service (AKS)
├── Frontend Pods (React + Nginx)
├── Backend Pods (Node.js + Express)  
└── MongoDB Pods (with Azure Disk)
     ↓
Azure Container Registry (ACR)
```

#### **2. Azure Infrastructure Components:**

**Resource Group: `devopsify-rg`**
- **Location**: East US (or your preferred region)
- **Contains**: All resources for the application

**Virtual Network (VNet): `devopsify-vnet`**
- **Address Space**: 10.0.0.0/16
- **Subnets**:
  - Public Subnet: 10.0.1.0/24 (Load Balancer, NAT Gateway)
  - AKS Subnet: 10.0.10.0/24 (Kubernetes nodes)
  - Database Subnet: 10.0.20.0/24 (Database workloads)
  - Management Subnet: 10.0.30.0/24 (ACR, Key Vault)

**Azure Kubernetes Service (AKS): `devopsify-aks`**
- **Node Pools**: 
  - System Pool: Standard_D2s_v3 (2 nodes)
  - User Pool: Standard_D2s_v3 (2-10 nodes, auto-scaling)
- **Kubernetes Version**: 1.28+
- **Network Plugin**: Azure CNI
- **Identity**: Managed Identity
- **RBAC**: Azure AD Integration

#### **3. Azure Services Icons in Draw.io:**

**For Infrastructure Diagram:**
- **Azure**: Main cloud icon
- **Resource Groups**: Folder/container icon
- **Virtual Network**: Network icon from Azure library
- **AKS**: Container service icon
- **Load Balancer**: Load balancer icon
- **Virtual Machines**: VM icon (for AKS nodes)
- **Storage Account**: Storage icon
- **Container Registry**: Registry/repository icon
- **Key Vault**: Key/security icon

**For Application Flow:**
- **Users**: Person/actor icon
- **Load Balancer**: Azure Load Balancer icon
- **AKS Cluster**: Kubernetes/container orchestration icon
- **Pods**: Small container icons
- **Database**: Database/storage icon
- **Monitoring**: Chart/analytics icon

#### **4. Azure-Specific Color Scheme:**

```css
Azure Blue:     #0078D4  (Primary Azure brand color)
Azure Light:    #40E0D0  (Secondary/accent)
Success Green:  #4CAF50  (Healthy/running services)
Warning Orange: #FF9800  (Staging/warnings)
Danger Red:     #F44336  (Critical/database)
Gray:           #6C757D  (Infrastructure/background)
```

### **Azure Architecture Layout in Draw.io:**

#### **Hierarchical Structure:**
```
┌─── Microsoft Azure Cloud ────────────────────────────┐
│  ┌─── Resource Group: devopsify-rg ─────────────────┐ │
│  │  ┌─── Virtual Network: devopsify-vnet ─────────┐ │ │
│  │  │  ┌─── Public Subnet ──────────────────────┐ │ │ │
│  │  │  │  • Azure Load Balancer              │ │ │ │
│  │  │  │  • Public IP                        │ │ │ │
│  │  │  │  • NAT Gateway                      │ │ │ │
│  │  │  └─────────────────────────────────────┘ │ │ │
│  │  │  ┌─── AKS Subnet ─────────────────────────┐ │ │ │
│  │  │  │  • AKS Cluster (devopsify-aks)      │ │ │ │
│  │  │  │    ├─ Node Pool 1                   │ │ │ │
│  │  │  │    ├─ Node Pool 2                   │ │ │ │
│  │  │  │    ├─ Frontend Pods                 │ │ │ │
│  │  │  │    ├─ Backend Pods                  │ │ │ │
│  │  │  │    └─ MongoDB Pods                  │ │ │ │
│  │  │  └─────────────────────────────────────┘ │ │ │
│  │  │  ┌─── Management Subnet ──────────────────┐ │ │ │
│  │  │  │  • Azure Container Registry (ACR)   │ │ │ │
│  │  │  │  • Azure Key Vault                  │ │ │ │
│  │  │  └─────────────────────────────────────┘ │ │ │
│  │  └───────────────────────────────────────────┘ │ │
│  │  ┌─── Storage Account ─────────────────────────┐ │ │
│  │  │  • Azure Blob Storage (Logs)             │ │ │
│  │  │  • Azure Files (Persistent Volumes)      │ │ │
│  │  └───────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### **Draw.io Step-by-Step for Azure:**

#### **1. Create Azure Cloud Container:**
- **Shape**: Large rectangle
- **Color**: Azure Blue (#0078D4)
- **Label**: "Microsoft Azure"
- **Icon**: Azure cloud icon from library

#### **2. Add Resource Group:**
- **Shape**: Rectangle inside Azure container
- **Color**: Light blue (#E3F2FD)
- **Label**: "Resource Group: devopsify-rg"
- **Icon**: Folder icon

#### **3. Create Virtual Network:**
- **Shape**: Rectangle inside Resource Group
- **Color**: Light green (#E8F5E8)
- **Label**: "Virtual Network: devopsify-vnet\n10.0.0.0/16"
- **Icon**: Network icon from Azure library

#### **4. Add Subnets:**
- **Public Subnet**: Light orange container
- **AKS Subnet**: Light blue container  
- **Management Subnet**: Light purple container

#### **5. Place Azure Services:**
- **Load Balancer**: Azure Load Balancer icon
- **AKS**: Kubernetes icon with "AKS" label
- **ACR**: Container registry icon
- **Key Vault**: Security/key icon

#### **6. Add Connection Lines:**
- **Internet → Load Balancer**: Thick blue arrow
- **Load Balancer → AKS**: Blue arrow
- **AKS → ACR**: Dotted line (image pulls)
- **AKS → Key Vault**: Dashed line (secrets)

### **Azure Resource Specifications:**

#### **Compute:**
```
AKS Node Pools:
├── System Pool
│   ├── VM Size: Standard_D2s_v3
│   ├── Node Count: 2 (fixed)
│   ├── OS Disk: 30GB Premium SSD
│   └── Purpose: System workloads
└── User Pool  
    ├── VM Size: Standard_D2s_v3
    ├── Node Count: 2-10 (auto-scaling)
    ├── OS Disk: 30GB Premium SSD
    └── Purpose: Application workloads
```

#### **Storage:**
```
Azure Disk (for MongoDB):
├── Type: Premium SSD
├── Size: 100GB
├── IOPS: 500
├── Throughput: 100 MB/s
└── Replication: LRS

Azure Blob Storage:
├── Tier: Hot
├── Replication: GRS
├── Purpose: Application logs
└── Access: Private
```

#### **Networking:**
```
Load Balancer:
├── SKU: Standard
├── Type: Public
├── Frontend IP: Static Public IP
└── Backend Pool: AKS nodes

Network Security Groups:
├── Public Subnet NSG:
│   ├── Allow HTTP (80)
│   ├── Allow HTTPS (443)
│   └── Deny all other inbound
└── AKS Subnet NSG:
    ├── Allow internal traffic
    ├── Allow outbound internet
    └── Managed by AKS
```

### **Integration with GitHub Actions:**

Add these Azure secrets to your GitHub repository:
- `AZURE_CLIENT_ID`: Service Principal Application ID
- `AZURE_CLIENT_SECRET`: Service Principal Secret
- `AZURE_TENANT_ID`: Azure AD Tenant ID
- `AZURE_SUBSCRIPTION_ID`: Azure Subscription ID

### **Monitoring with Azure Services:**

```
Azure Monitor Stack:
├── Azure Monitor
│   ├── Metrics: Container insights
│   ├── Logs: Log Analytics workspace
│   └── Alerts: Action groups
├── Application Insights
│   ├── APM: Node.js & React monitoring
│   ├── Tracing: Distributed tracing
│   └── Performance: Response times
└── Azure Security Center
    ├── Security recommendations
    ├── Threat detection
    └── Compliance monitoring
```

This Azure-specific setup gives you enterprise-grade infrastructure with excellent integration between AKS, GitHub Actions, and Azure DevOps services!
