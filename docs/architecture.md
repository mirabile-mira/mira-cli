# 🧠 Mirabile Architecture Report

## 📌 Overview

Mirabile is a full-stack, AI-assisted career roadmap platform designed to transform user-defined career goals into structured, actionable learning paths. The system is built using a modular architecture that separates concerns across frontend, backend, and DevOps layers, while incorporating an agent-based design for scalability and maintainability.

---

## 🏗️ System Architecture

![System Architecture](code-architecture.png)

The system follows a layered architecture consisting of:

- **Frontend Layer** – User interface and interaction  
- **Backend Layer** – Business logic and processing  
- **Database Layer** – Data persistence  
- **DevOps Layer** – CI/CD pipeline and monitoring  

### 🔷 Architecture Diagram

![Agent Flow](agent-interaction-flow.png)

```mermaid
flowchart TD

    User[User] --> UI[Frontend (React)]

    UI --> API[Backend API (Express)]

    API --> Parser[Input Parser]
    API --> Roadmap[Roadmap Generator]
    API --> Company[Company Intelligence Engine]
    API --> Resources[Resource Recommender]
    API --> Progress[Progress Calculator]

    Roadmap --> DB[(Database)]
    Progress --> DB
    Resources --> DB

    Parser --> Roadmap
    Company --> Roadmap

    UI -->|Notes & Progress Updates| API
    UI -->|Fetch Roadmap| API

    subgraph DevOps Pipeline (Jenkins)
        Build[Build]
        Test[Test]
        Quality[Code Quality - SonarQube]
        Security[Security Scan]
        Deploy[Deploy to Staging]
        Release[Release to Production]
        Monitor[Monitoring - Prometheus/Grafana]

        Build --> Test --> Quality --> Security --> Deploy --> Release --> Monitor
    end

    API --> Build

## 🧩 Component Breakdown
1. 🎨 Frontend Layer

The frontend is built using React and is responsible for:

- Capturing user input (career goals)
- Displaying generated roadmaps
- Visualizing roadmap phases
- Rendering resources and recommendations
- Providing interfaces for:
- Notes
- Progress tracking
- Roadmap history

It communicates with the backend via REST APIs.

## 2. ⚙️ Backend Layer

The backend is built using Node.js with Express and serves as the core intelligence layer of the system.

Key Responsibilities:
- Parsing user input into structured data:
- Role
- Company
- Domain
- Generating structured roadmaps
- Applying company-specific logic
- Recommending relevant resources
- Managing progress and notes
- Handling API requests

Core Modules:
- Input Parser
- Roadmap Generator
- Company Intelligence Engine
- Resource Recommender
- Progress Calculator

3. 🗄️ Database Layer

The database stores all persistent data including:

- Users
- Generated roadmaps
- Notes
- Progress tracking data

A relational (PostgreSQL) or NoSQL (MongoDB) database can be used depending on implementation preferences.

4. 🤖 Agent-Based Design

Mirabile adopts a modular agent-inspired approach:

- Frontend Agent
Handles UI/UX and user interactions
- Backend Agent
Implements business logic and API services
- DevOps Agent
Manages CI/CD pipeline, deployment, and monitoring
- Shared Intelligence Layer
Defines global entities and system-wide structure

This separation allows independent development and scalability.

🔄 Data Flow
1. User submits a career goal via the frontend
2. The frontend sends the input to the backend API
3. The backend:
- Parses the input
- Generates a roadmap
- Attaches resources
- Stores results in the database
4. The frontend renders the roadmap and resources
5. Users interact by:
- Adding notes
- Updating progress
6. Updates are persisted in the database

## 🚀 DevOps Pipeline

The system implements a full CI/CD pipeline using Jenkins with the following stages:

Pipeline Stages
- Build
    - Install dependencies
    - Compile application
    - Build Docker images
- Test
    - Run unit and integration tests
- Code Quality
    - Static analysis using SonarQube
- Security
    - Dependency vulnerability scanning (npm audit / Snyk / Trivy)
- Deploy
    - Deploy application to staging environment using Docker Compose
- Release
    - Promote build to production (manual approval optional)
- Monitoring
    - Track performance and system metrics using Prometheus and Grafana
## 🧠 Design Principles
- Separation of Concerns – Each layer and agent has a distinct responsibility
- Modularity – Components are loosely coupled and independently maintainable
- Scalability – Architecture supports future expansion
- Automation – CI/CD pipeline ensures continuous integration and delivery
- Observability – Monitoring and logging enable system insights

## 🎯 Conclusion

Mirabile demonstrates a complete full-stack system with integrated DevOps practices and an agent-based architecture. The design emphasizes modularity, automation, and intelligent processing to transform abstract career goals into structured, actionable learning pathways.

The combination of frontend, backend, database, and CI/CD pipeline ensures that the system is production-ready, maintainable, and scalable.