# Employer Dashboard Analytics Module

🎯 **Goal**: Enable employers to track hiring metrics, optimize postings, and assess candidate-fit performance through visual analytics.

## 📋 Table of Contents

- [Project Overview](#project-overview)
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
- [Contributing](#contributing)
- [License](#license)

## 🚀 Project Overview

This module provides a comprehensive analytics dashboard for employers, built with a **Node.js + Express** backend and a **React + TypeScript + Tailwind CSS** frontend. Data is stored in **MongoDB**, with aggregation pipelines powering the analytics.

### Key Features

- 📊 **Summary KPI cards** (Total Jobs, Open Jobs, Applications, Interviews, Hires)
- 📈 **Visual analytics** (Hiring status, Application funnel, Skill-gap heatmap, Top courses, Geography map)
- 📅 **Time-based filtering** (Weekly, Monthly, Quarterly, Yearly, Custom date ranges)
- 📋 **Job-specific analytics** (Funnel analysis, Skill gap assessment)
- 📤 **Exportable reports** (CSV/PDF formats)
- 🔐 **JWT-based authentication** with employer-scoped data
- 📱 **Responsive design** for all devices

## ⚙️ Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **MongoDB** (v4.2+)
- **Git**

## 📁 Project Structure

```
oxeir-employer-analytics-mantu/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/              # Chart components
│   │   │   │   ├── ApplicationFunnel.tsx
│   │   │   │   ├── GeographyMap.tsx
│   │   │   │   ├── HiringStatusChart.tsx
│   │   │   │   ├── SkillGapHeatmap.tsx
│   │   │   │   └── TopCoursesChart.tsx
│   │   │   ├── ExportButton.tsx
│   │   │   ├── JobSelector.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── TimeFilter.tsx
│   │   │   └── TopNavbar.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Main analytics dashboard
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.ts               # API service layer
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
├── server/                          # Node.js Backend
│   ├── models/                      # MongoDB models
│   │   ├── Application.js
│   │   ├── Course.js
│   │   ├── CourseCompletion.js
│   │   ├── Employer.js
│   │   ├── Job.js
│   │   ├── SkillScore.js
│   │   └── View.js
│   ├── routes/
│   │   ├── analytics.js             # Analytics endpoints
│   │   ├── index.js                 # Job endpoints
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── app.js
│   └── package.json
└── README.md
```

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd oxeir-employer-analytics-mantu
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/employer-analytics
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Start the application

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔌 Backend API

All endpoints are prefixed with `/api/employer/analytics` and require a valid JWT in `Authorization: Bearer <token>`.

### Summary Endpoints

#### `GET /summary`
Returns overall hiring metrics.

**Query Parameters:**
- `start` (optional): Start date (YYYY-MM-DD)
- `end` (optional): End date (YYYY-MM-DD)
- `period` (optional): Quick period (week, month, quarter, year)

**Response:**
```json
{
  "totalJobs": 50,
  "openJobs": 30,
  "filledJobs": 15,
  "archivedJobs": 5,
  "applicantsTotal": 1200,
  "interviews": 100,
  "hires": 20,
  "shortlisted": 80,
  "recentApplications": 150,
  "recentHires": 5
}
```

### Funnel Endpoints

#### `GET /funnel/:jobId`
Returns application funnel data for a specific job.

**Response:**
```json
{
  "views": 300,
  "applications": 200,
  "shortlisted": 80,
  "interviewed": 50,
  "hired": 20
}
```

### Skill-Gap Endpoints

#### `GET /skill-gap/:jobId`
Returns skill gap analysis for a specific job.

**Response:**
```json
[
  {
    "_id": "ReactJS",
    "avgSkillScore": 68.5,
    "candidateCount": 25,
    "maxScore": 95,
    "minScore": 45
  }
]
```

### Top-Courses Endpoint

#### `GET /top-courses`
Returns top courses that led to successful hires.

**Response:**
```json
[
  {
    "_id": "course-id",
    "courseName": "Full-Stack Web Development",
    "institution": "Coursera",
    "hiresCount": 12,
    "avgPerformanceRating": 4.2
  }
]
```

### Geography Endpoint

#### `GET /geography`
Returns geographic distribution of applicants.

**Response:**
```json
[
  {
    "_id": "United States",
    "applications": 500,
    "hires": 15
  }
]
```

### Export Report Endpoint

#### `GET /export-report`
Exports analytics data in CSV or PDF format.

**Query Parameters:**
- `format`: csv or pdf
- `start`, `end`, `period`: Date range parameters

## 🎨 Frontend Implementation

### Component Library & Styles

- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **React Icons**: Icon library
- **Axios**: HTTP client for API requests

### Key Components

- **`StatCard`**: Displays KPI metrics with icons and colors
- **`TimeFilter`**: Date range and time period selector
- **`JobSelector`**: Job selection for detailed analytics
- **`ExportButton`**: Report export functionality
- **Chart Components**: Various data visualizations

### Data Fetching

- Centralized API calls in `/src/services/api.ts`
- Automatic token management
- Error handling and loading states
- TypeScript interfaces for type safety

## 🗄️ Database Schema

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String, // 'open', 'filled', 'archived', 'draft'
  employerId: ObjectId,
  skillsRequired: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  location: {
    city: String,
    country: String,
    remote: Boolean
  },
  department: String,
  experienceLevel: String,
  jobType: String,
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date,
  views: Number
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId,
  applicantId: ObjectId,
  status: String, // 'applied', 'shortlisted', 'interviewed', 'hired', 'rejected'
  appliedAt: Date,
  shortlistedAt: Date,
  interviewedAt: Date,
  hiredAt: Date,
  rejectedAt: Date,
  location: {
    city: String,
    country: String,
    coordinates: [Number]
  },
  source: String,
  skills: [String],
  experience: Number,
  education: {
    degree: String,
    institution: String,
    graduationYear: Number
  }
}
```

### SkillScores Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId,
  jobId: ObjectId,
  skill: String,
  score: Number, // 0-100
  category: String, // 'technical', 'soft', 'domain'
  assessmentType: String, // 'test', 'interview', 'portfolio', 'certification'
  evaluatedAt: Date,
  proficiency: String // 'beginner', 'intermediate', 'advanced', 'expert'
}
```

### CourseCompletion Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId,
  courseId: ObjectId,
  jobId: ObjectId,
  completedAt: Date,
  grade: String,
  wasHired: Boolean,
  hireDate: Date,
  performanceRating: Number // 1-5
}
```

## 🔐 Authentication & Security

- **JWT-based authentication** with token validation on each API call
- **Authorization middleware** that checks employerId in payload vs. data owner
- **HTTPS enforcement** in production
- **Input validation** and sanitization
- **Rate limiting** (recommended for production)

## 🚀 Running & Testing

### Development Mode

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

### Production Build

```bash
# Backend
cd server
npm start

# Frontend
cd client
npm run build
npm run preview
```

### Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🌐 Deployment

### Environment Variables

**Backend (.env):**
```env
PORT=3000
MONGO_URI=mongodb://your-mongo-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Deployment Options

1. **Vercel** (Frontend) + **Railway** (Backend)
2. **Netlify** (Frontend) + **Heroku** (Backend)
3. **AWS** (EC2 + S3 + RDS)
4. **Docker** containers

## ✨ Features

### ✅ Implemented Features

- [x] **Summary Dashboard** with KPI cards
- [x] **Time-based filtering** (Week, Month, Quarter, Year, Custom)
- [x] **Hiring Status Chart** with color-coded statuses
- [x] **Application Funnel** with conversion rates
- [x] **Skill Gap Analysis** with heatmap visualization
- [x] **Top Courses Chart** showing successful course completions
- [x] **Geographic Distribution** of applicants
- [x] **Job-specific Analytics** with job selector
- [x] **Export Functionality** (CSV/PDF)
- [x] **Responsive Design** for all screen sizes
- [x] **JWT Authentication** with secure endpoints
- [x] **Loading States** and error handling
- [x] **TypeScript** for type safety

### 🚧 Future Enhancements

- [ ] **Real-time notifications** for new applications
- [ ] **Advanced filtering** (department, experience level, etc.)
- [ ] **Predictive analytics** for hiring success
- [ ] **Email reports** scheduling
- [ ] **Custom dashboard** layouts
- [ ] **Data import/export** functionality
- [ ] **Multi-language support**
- [ ] **Dark mode** theme
- [ ] **Mobile app** version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better hiring decisions**
