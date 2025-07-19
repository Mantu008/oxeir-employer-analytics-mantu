Here's your updated `README.md` file for the **Employer Dashboard Analytics Module**, with the **live deployment URLs**, **test login credentials**, and **correct environment config**:

---

```markdown
# Employer Dashboard Analytics Module

🎯 **Goal**: Enable employers to track hiring metrics, optimize postings, and assess candidate-fit performance through visual analytics.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Deployed URLs](#deployed-urls)
- [Login Credentials](#login-credentials)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Backend API](#backend-api)
- [Frontend Implementation](#frontend-implementation)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Running & Testing](#running--testing)
- [Deployment](#deployment)
- [Features](#features)

---

## 🚀 Project Overview

This module provides a comprehensive analytics dashboard for employers, built with a **Node.js + Express** backend and a **React + TypeScript + Tailwind CSS** frontend. Data is stored in **MongoDB**, with aggregation pipelines powering the analytics.

### Key Features

- 📊 Summary KPI cards (Total Jobs, Open Jobs, Applications, Interviews, Hires)
- 📈 Visual analytics (Hiring status, Application funnel, Skill-gap heatmap, Top courses, Geography map)
- 📅 Time-based filtering (Weekly, Monthly, Quarterly, Yearly, Custom date ranges)
- 📋 Job-specific analytics (Funnel analysis, Skill gap assessment)
- 📤 Exportable reports (CSV/PDF formats)
- 🔐 JWT-based authentication with employer-scoped data
- 📱 Responsive design for all devices

---

## 🌐 Deployed URLs

## 🔗 Live URLs

- **Frontend**: https://oxeir-employer-analytics-mantu-f2d5.vercel.app
- **Backend**: https://oxeir-employer-analytics-mantu.vercel.app

---

## 🔐 Login Credentials

Use the following test account to explore the dashboard:

- **Email**: `mantukumar87586299@gmail.com`
- **Password**: `mantu@123`

---

## ⚙️ Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

---

## 📁 Project Structure

```

oxeir-employer-analytics-mantu/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
├── server/                          # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── app.js
│   └── package.json
└── README.md

````

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd oxeir-employer-analytics-mantu
````

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` in `server/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/employer-analytics
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` in `client/`:

```env
VITE_APP_API_URL=https://oxeir-employer-analytics-mantu.vercel.app/api
```

### 4. Run Locally

**Backend:**

```bash
cd server
npm run dev
```

**Frontend:**

```bash
cd client
npm run dev
```

---

## 🔌 Backend API

All endpoints require JWT token (in `Authorization: Bearer <token>`) and are prefixed with `/api/employer/analytics`.

### Summary

```http
GET /summary
```

### Funnel

```http
GET /funnel/:jobId
```

### Skill Gap

```http
GET /skill-gap/:jobId
```

### Top Courses

```http
GET /top-courses
```

### Geography

```http
GET /geography
```

### Export Report

```http
GET /export-report?format=csv|pdf
```

---

## 🎨 Frontend Implementation

### Tech Stack

* React
* TypeScript
* Tailwind CSS
* Recharts (for graphs)
* Axios (API)
* React Icons

### Core Components

* `StatCard`
* `TimeFilter`
* `JobSelector`
* `ExportButton`
* Chart components (`SkillGapHeatmap`, `HiringStatusChart`, etc.)

---

## 🗄️ Database Schema

### Jobs

```json
{
  "title": "Frontend Developer",
  "status": "open",
  "employerId": "ObjectId",
  ...
}
```

### Applications

```json
{
  "jobId": "ObjectId",
  "status": "applied",
  ...
}
```

### SkillScores

```json
{
  "candidateId": "ObjectId",
  "skill": "ReactJS",
  "score": 85
}
```

### CourseCompletion

```json
{
  "candidateId": "ObjectId",
  "courseName": "Full Stack Dev",
  "wasHired": true
}
```

---

## 🔐 Authentication & Security

* JWT-based login
* Token validation middleware
* Employer-based authorization
* HTTPS recommended for production
* Input validation & sanitization

---

## 🚀 Running 

### Development

```bash
# Server
cd server && npm install && npm run dev

# Client
cd client && npm install && npm run dev
```

### Production

```bash
# Frontend
cd client
npm run install
npm run dev
```

---

## 📦 Deployment

### Backend (.env)

```env
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)

```env
VITE_APP_API_URL=https://oxeir-employer-analytics-mantu.vercel.app/api
```

---

## ✨ Features

### ✅ Completed

* [x] Summary Dashboard
* [x] Time Filters
* [x] Application Funnel
* [x] Skill Gap Analysis
* [x] Top Courses & Geography
* [x] Export Reports
* [x] JWT Auth
* [x] Responsive UI
* [x] TypeScript

### 🚧 Coming Soon

* [ ] Real-time notifications
* [ ] Advanced filtering (experience, department)
* [ ] Email report scheduler
* [ ] Predictive analytics
* [ ] Mobile app
* [ ] Dark mode

---
```
