# 🧠 Mirabile – Fullstack Agent Overview

## 📌 Overview

Mirabile is a full-stack, agent-oriented system designed to transform user career goals into structured roadmaps with tailored resources, progress tracking, and DevOps automation.

This document describes the **agents, their responsibilities, and how they interact across the system**.

---

## 🏗️ System Architecture

The system is divided into four main layers:

User Input
↓
Frontend (UI Layer)
↓
Backend (Logic Layer)
↓
Database (Persistence Layer)
↓
DevOps Pipeline (CI/CD + Monitoring)


In addition, the system is structured around **specialized agents** that handle distinct responsibilities.

---

## 🤖 Agent-Based Design

### 1. 🎨 Frontend Agent

**Responsibility:**
- User interface and experience
- Visualization of roadmaps
- Interaction with backend APIs

**Skills:**
- React component design
- State management
- API integration
- UI/UX structuring
- Responsive layout design

**Key Outputs:**
- Career input forms
- Roadmap visualization
- Resource panels
- Notes and progress tracking UI

---

### 2. ⚙️ Backend Agent

**Responsibility:**
- Business logic and API handling
- Roadmap generation
- Resource recommendation
- Data processing and persistence

**Skills:**
- REST API design (Express)
- Data modeling
- Algorithmic logic for roadmap generation
- Input parsing and validation
- Database interaction

**Core Modules:**
- Input Parser
- Roadmap Generator
- Company Intelligence Engine
- Resource Recommender
- Progress Calculator

---

### 3. 🚀 DevOps Agent

**Responsibility:**
- CI/CD pipeline implementation
- Build, test, deploy automation
- Monitoring and quality assurance

**Skills:**
- Jenkins pipeline configuration
- Docker containerization
- Automated testing integration
- Code quality analysis (SonarQube)
- Security scanning
- Monitoring setup (Prometheus/Grafana)

**Pipeline Stages:**
1. Build
2. Test
3. Code Quality
4. Security
5. Deploy
6. Release
7. Monitoring

---

### 4. 🧩 Shared Intelligence Layer

**Responsibility:**
- Shared system knowledge
- Cross-agent consistency
- Core domain definitions

**Includes:**
- Entity definitions (User, Roadmap, Step, Resource, Progress)
- Global feature definitions
- System constraints
- Phase definitions (Beginner, Intermediate, Advanced)

---

## 🔄 Agent Interaction Flow

1. User submits a career goal via frontend
2. Frontend agent sends request to backend API
3. Backend agent:
   - Parses input
   - Generates roadmap
   - Attaches resources
   - Stores data in database
4. Frontend renders roadmap and resources
5. User interacts (notes, progress updates)
6. DevOps agent ensures:
   - Code is tested
   - Code quality is verified
   - Application is deployed and monitored

---

## 🧠 Skills Mapping

| Agent       | Primary Skills |
|------------|--------------|
| Frontend   | UI design, React, API integration |
| Backend    | Algorithms, APIs, data modeling |
| DevOps     | CI/CD, Docker, automation, monitoring |
| Shared     | System design, domain modeling |

---

## 📦 System Principles

- **Separation of concerns** across agents
- **Modularity** for scalability
- **Testability** for reliability
- **Automation-first** DevOps approach
- **Context-aware intelligence** in roadmap generation

---

## 🎯 Goals of the System

- Convert abstract career goals into actionable plans
- Provide structured learning pathways
- Deliver personalized recommendations
- Maintain progress visibility
- Demonstrate a complete DevOps lifecycle

---

## 🚀 Summary

Mirabile integrates multiple specialized agents into a cohesive system where:

- The **frontend agent** handles user interaction
- The **backend agent** powers intelligence and logic
- The **devops agent** ensures reliability and deployment
- The **shared layer** maintains consistency across the system

Together, they form a scalable, maintainable, and production-ready full-stack application.