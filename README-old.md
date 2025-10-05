# DevOpsify — Cloud-Native E-Commerce App

## Overview

DevOpsify is a cloud-native e-commerce application built using a microservices architecture. This project aims to provide a comprehensive DevOps experience by integrating various tools and practices, including Git, CI/CD, Infrastructure as Code (IaC), Kubernetes, GitOps, monitoring, and security.

## Project Structure

The project is organized into the following main directories:

- **src**: Contains the source code for the frontend and backend applications.
  - **frontend**: React/Next.js application for the user interface.
  - **backend**: Node.js/Express REST API for handling business logic.
  - **database**: Contains migration files for managing the PostgreSQL database schema.

- **infrastructure**: Contains Terraform and Kubernetes configurations for provisioning and deploying the application.
  - **terraform**: Terraform modules and environment configurations.
  - **kubernetes**: Kubernetes manifests and Helm charts for deploying the application components.

- **.github**: Contains GitHub Actions workflows for CI/CD.
  - **workflows**: CI and CD workflow definitions.

- **gitops**: Contains configurations for ArgoCD to manage GitOps deployments.

- **monitoring**: Contains configurations for monitoring the application using Prometheus and Grafana.

- **docs**: Documentation for the architecture and deployment processes.

- **docker-compose.yml**: Configuration for running the application locally using Docker Compose.

- **Dockerfile**: Instructions for building the Docker image for the application.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Terraform installed for infrastructure provisioning.
- Access to an Azure account for cloud resources.
- kubectl installed for managing Kubernetes clusters.
- ArgoCD installed for GitOps.

### Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd devopsify-ecommerce
   ```

2. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```
     cd src/frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

3. **Backend Setup**:
   - Navigate to the backend directory:
     ```
     cd ../backend
     ```
   - Install dependencies:
     ```
     npm install
     ```

4. **Run the application locally**:
   - Use Docker Compose to start the application:
     ```
     docker-compose up
     ```

### Deployment

1. **Provision Infrastructure**:
   - Navigate to the Terraform directory:
     ```
     cd infrastructure/terraform
     ```
   - Initialize Terraform:
     ```
     terraform init
     ```
   - Apply the Terraform configuration:
     ```
     terraform apply
     ```

2. **Deploy to Kubernetes**:
   - Use the Kubernetes manifests or Helm charts to deploy the application components.

3. **Set up GitOps with ArgoCD**:
   - Configure ArgoCD to manage the application deployments.

### Monitoring

- Set up Prometheus and Grafana for monitoring application metrics and logs.

## Contributing

Contributions are welcome! Please follow the standard Git workflow for submitting pull requests. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.