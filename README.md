# Secure Document System

A modern **secure SaaS-style document management platform** built with a scalable cloud-native architecture.
This project demonstrates how to build a **production-ready full-stack application** with authentication, secure file handling, and a serverless backend.

It highlights best practices in **cloud infrastructure, security, and modern web development**, demonstrating how to design and build scalable, production-ready systems. The project showcases practical experience with backend development, cloud-native architecture, and secure application design commonly used in modern software engineering environments.


---

# Live Architecture Overview

```
Users
  │
  ▼
Next.js Frontend (Vercel)
  │
  │ HTTPS + Session Authentication
  ▼
Cloud Run API (Node.js)
  │
  ├── Firebase Authentication (User Identity)
  ├── Cloud SQL (PostgreSQL Database)
  ├── Google Cloud Storage (Document Files)
  └── Secret Manager (Secure Credentials)
```

This architecture follows **modern SaaS deployment patterns** used in production environments.

---

# Key Features

### Secure Authentication

* Firebase Authentication integration
* ID token verification in backend
* Secure session-based login flow
* Protection against unauthorized API access

### Document Management

* Upload and manage secure documents
* Metadata stored in PostgreSQL
* File storage using cloud object storage
* Controlled access to user files

### Cloud-Native Backend

* Stateless API running on serverless containers
* Horizontal scaling via Cloud Run
* Secure database access via Cloud SQL

### Infrastructure Security

* Secrets managed using Secret Manager
* Service account-based authentication
* Secure backend-to-database connectivity
* Environment-based configuration

### Scalable Architecture

* Serverless compute for automatic scaling
* Optimized database connection pooling
* Containerized backend deployment

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Firebase Client SDK

## Backend

* Node.js
* Express.js
* PostgreSQL
* Firebase Admin SDK

## Cloud Infrastructure

* Google Cloud Run
* Google Cloud SQL (PostgreSQL)
* Google Cloud Storage
* Google Secret Manager
* Artifact Registry

## Deployment & DevOps

* Docker
* GitHub Actions CI/CD
* Vercel (Frontend Hosting)
* Google Cloud CLI

---

# Security Highlights

This project demonstrates multiple **real-world security practices**:

* Secure authentication with Firebase ID tokens
* Backend verification using Firebase Admin SDK
* Secrets stored in Secret Manager (no credentials in code)
* Serverless service accounts with IAM permissions
* HTTPS-only cookie handling
* Restricted CORS configuration

These practices align with **production security standards used in modern SaaS systems**.

---

# CI/CD Pipeline

The project uses **GitHub Actions** to automate backend deployments.

Pipeline flow:

```
GitHub Push
   │
   ▼
Build Docker Image
   │
   ▼
Push to Artifact Registry
   │
   ▼
Deploy to Cloud Run
```

Frontend deployment is automatically handled by **Vercel**.

---

# Project Structure

```
secure-doc-system
│
├── apps
│   ├── frontend        # Next.js application
│   └── backend         # Node.js API
│
├── infrastructure
│   └── deployment configs
│
├── .github
│   └── workflows       # CI/CD pipelines
│
└── README.md
```

This **monorepo structure** allows easy management of frontend and backend code.

---

# Running Locally

## 1. Clone Repository

```
git clone https://github.com/Azzam279/secure-doc-system.git
cd secure-doc-system
```

---

## 2. Install Dependencies

```
cd apps/frontend
npm install

cd ../backend
npm install
```

---

## 3. Configure Environment Variables

Create `.env` files for both frontend and backend.

Example:

Backend:

```
PORT=8080
INSTANCE_CONNECTION_NAME=your-cloud-sql-instance
GCP_PROJECT_ID=your-project-id
```

Frontend:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## 4. Start Development Servers

Backend:

```
npm run dev
```

Frontend:

```
npm run dev
```

---

# Why This Project Matters

This project demonstrates practical experience with:

* Designing **scalable backend systems**
* Implementing **secure authentication flows**
* Deploying **cloud-native applications**
* Managing **real-world infrastructure and DevOps pipelines**

It reflects the kind of architecture used by **modern SaaS platforms**.

---

# Future Improvements

Potential enhancements include:

* Role-based access control
* Document sharing between users
* File encryption at rest
* Activity audit logging
* API rate limiting
* Edge caching for global performance
