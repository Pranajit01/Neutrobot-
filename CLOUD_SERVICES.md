# ☁️ Nutrobot – Cloud Services Document

## Overview

Nutrobot is an AI-powered nutrition assistant deployed on **Amazon Web Services (AWS)**. The architecture follows a decoupled frontend/backend model, with each component hosted on a purpose-suited cloud service.

---

## Cloud Services Used

### 1. 🟠 AWS Elastic Beanstalk — Backend Hosting
- **Service:** AWS Elastic Beanstalk (Node.js 20 on Amazon Linux 2023)
- **Purpose:** Hosts the Express.js + TypeScript REST API
- **Environment:** `nutrobot-backend-env`
- **Region:** `us-east-1`
- **URL:** `http://nutrobot-backend-env.eba-f3wpvhwk.us-east-1.elasticbeanstalk.com`
- **Features Used:**
  - Auto-managed EC2 instances (t3.micro)
  - Elastic Load Balancer (Application Load Balancer)
  - Auto-scaling group
  - Environment variable management
  - Rolling deployments

---

### 2. 🔵 Amazon RDS (PostgreSQL) — Database
- **Service:** Amazon Relational Database Service (RDS)
- **Engine:** PostgreSQL 16
- **Instance:** `nutrition-bd` (`db.t3.micro`)
- **Region:** `us-east-1`
- **Purpose:** Stores user data, meal logs, nutrition records, and session data
- **Features Used:**
  - Automated backups
  - SSL-enforced connections
  - VPC-isolated with security group access control
  - Prisma ORM for schema management and migrations

---

### 3. 🟡 Amazon S3 — Frontend Hosting
- **Service:** Amazon Simple Storage Service (S3)
- **Bucket:** `nutrobot-frontend-jfufj5`
- **Region:** `us-east-1`
- **Purpose:** Hosts the compiled React (Vite) frontend as a static website
- **Features Used:**
  - Static website hosting
  - Public read access via bucket policy
  - Integrated with CloudFront CDN

---

### 4. 🟣 Amazon CloudFront — CDN & Frontend Delivery
- **Service:** Amazon CloudFront (CDN)
- **Distribution:** `djru6t7rndfpx.cloudfront.net`
- **Origin:** S3 bucket (`nutrobot-frontend-jfufj5`)
- **Purpose:** Delivers the frontend globally with low latency and HTTPS support
- **Features Used:**
  - Global edge caching
  - HTTPS (TLS) termination
  - Cache invalidation on deployments

---

## Architecture Diagram

```
User Browser
     │
     ▼
┌─────────────────────┐
│  CloudFront (CDN)   │  ← HTTPS
│ djru6t7rndfpx.cf.net│
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   S3 Static Site    │  ← React Frontend (Vite Build)
│ nutrobot-frontend-* │
└─────────────────────┘

         +

User Browser
     │
     ▼
┌─────────────────────┐
│  Elastic Beanstalk  │  ← HTTP REST API
│  (Node.js / Express)│
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Amazon RDS        │  ← PostgreSQL 16
│   (nutrition-bd)    │
└─────────────────────┘
```

---

## Infrastructure as Code

All cloud infrastructure is provisioned using **Terraform**:
- Infrastructure files: [`/infrastructure`](./infrastructure/)
- Main config: [`main.tf`](./infrastructure/main.tf)
- Elastic Beanstalk: [`app_runner.tf`](./infrastructure/app_runner.tf)

---

## Tech Stack Summary

| Layer        | Technology                        | Cloud Service        |
|--------------|-----------------------------------|----------------------|
| Frontend     | React + Vite + TypeScript         | S3 + CloudFront      |
| Backend      | Node.js + Express + TypeScript    | AWS Elastic Beanstalk|
| Database     | PostgreSQL 16 + Prisma ORM        | Amazon RDS           |
| IaC          | Terraform                         | AWS (all services)   |
| Region       | us-east-1 (N. Virginia)           | AWS                  |
