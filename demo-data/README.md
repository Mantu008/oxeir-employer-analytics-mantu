# Demo Data for Employer Analytics Dashboard

This directory contains comprehensive demo data in JSON format for testing the Employer Analytics Dashboard. Each file represents a different collection in the MongoDB database.

## 📁 Files Overview

### 1. `employers.json` - Employer Accounts
**Records:** 3 employers
**Key Fields:**
- `_id`: Unique employer identifier
- `name`: Employer's full name
- `email`: Unique email address
- `password`: Hashed password
- `company`: Company name
- `industry`: Industry sector
- `size`: Company size (startup, small, medium, large)
- `location`: Company location with coordinates
- `website`: Company website
- `subscription`: Subscription plan and expiry

**Sample Employers:**
- John Smith (TechCorp Solutions) - Premium plan
- Sarah Johnson (Innovate Inc) - Enterprise plan
- Michael Chen (DataViz Analytics) - Basic plan

### 2. `jobs.json` - Job Postings
**Records:** 5 jobs
**Key Fields:**
- `_id`: Unique job identifier
- `title`: Job title
- `status`: open, filled, archived, draft
- `employerId`: Employer identifier (all jobs belong to the same employer)
- `skillsRequired`: Array of required skills
- `salary`: Min/max salary with currency
- `location`: City, country, remote option
- `department`: Engineering, Data Science, Operations, Product
- `experienceLevel`: senior, mid
- `views`: Number of job views

**Sample Job Types:**
- Senior React Developer (open)
- Frontend Developer (filled)
- Data Scientist (open)
- DevOps Engineer (archived)
- Product Manager (draft)

### 3. `applications.json` - Job Applications
**Records:** 6 applications
**Key Fields:**
- `_id`: Unique application identifier
- `jobId`: Reference to job posting
- `applicantId`: Unique candidate identifier
- `status`: applied, shortlisted, interviewed, hired, rejected
- `appliedAt`: Application submission date
- `location`: Candidate location with coordinates
- `source`: job-board, direct, referral, social-media
- `skills`: Array of candidate skills
- `experience`: Years of experience
- `education`: Degree, institution, graduation year

**Application Status Distribution:**
- Applied: 2 candidates
- Shortlisted: 1 candidate
- Interviewed: 1 candidate
- Hired: 1 candidate
- Rejected: 1 candidate

### 4. `skillscores.json` - Skill Assessments
**Records:** 18 skill scores
**Key Fields:**
- `_id`: Unique skill score identifier
- `candidateId`: Reference to candidate
- `jobId`: Reference to job posting
- `skill`: Skill name (React, JavaScript, Python, etc.)
- `score`: Numerical score (0-100)
- `category`: technical, soft
- `assessmentType`: test, interview
- `proficiency`: beginner, intermediate, advanced, expert
- `notes`: Evaluation notes

**Skills Covered:**
- **Technical:** React, JavaScript, TypeScript, Python, Machine Learning, SQL, HTML, CSS
- **Soft Skills:** Communication, Leadership

**Score Distribution:**
- Expert (90-100): 3 scores
- Advanced (80-89): 6 scores
- Intermediate (70-79): 6 scores
- Beginner (50-69): 3 scores

### 5. `courses.json` - Available Courses
**Records:** 5 courses
**Key Fields:**
- `_id`: Unique course identifier
- `name`: Course title
- `institution`: Coursera, Udemy, edX, Pluralsight, LinkedIn Learning
- `category`: technical, business
- `duration`: Course duration in weeks
- `level`: intermediate, advanced
- `skills`: Skills taught in the course
- `rating`: Course rating (0-5)
- `enrollmentCount`: Number of enrolled students
- `completionRate`: Percentage of students who completed
- `price`: Course price
- `instructor`: Course instructor name
- `certificate`: Whether certificate is provided

**Course Types:**
- Full-Stack Web Development (Coursera)
- React Advanced Patterns (Udemy)
- Data Science Fundamentals (edX)
- DevOps Engineering (Pluralsight)
- Product Management Essentials (LinkedIn Learning)

### 6. `coursecompletions.json` - Course Completion Records
**Records:** 10 completions
**Key Fields:**
- `_id`: Unique completion identifier
- `candidateId`: Reference to candidate
- `courseId`: Reference to course
- `jobId`: Reference to job posting
- `completedAt`: Completion date
- `grade`: A, B, C
- `wasHired`: Boolean indicating if candidate was hired
- `hireDate`: Date of hire (if applicable)
- `performanceRating`: Performance rating (1-5)

**Completion Statistics:**
- Total Completions: 10
- Hired Candidates: 5
- Average Performance Rating: 4.4
- Grade Distribution: A (8), B (2), C (1)

### 7. `views.json` - Job View Records
**Records:** 30 views
**Key Fields:**
- `_id`: Unique view identifier
- `jobId`: Reference to job posting
- `viewerId`: Unique viewer identifier
- `viewedAt`: View timestamp

**View Distribution by Job:**
- Senior React Developer: 5 views
- Frontend Developer: 5 views
- Data Scientist: 5 views
- DevOps Engineer: 10 views
- Product Manager: 5 views

## 🔗 Data Relationships

### Primary Relationships:
1. **Employers → Jobs**: One employer can have multiple jobs
2. **Jobs → Applications**: One job can have multiple applications
3. **Applications → Skill Scores**: One application can have multiple skill scores
4. **Applications → Course Completions**: One application can have multiple course completions
5. **Jobs → Views**: One job can have multiple views
6. **Courses → Course Completions**: One course can have multiple completions

### Key IDs:
- **Employer ID:** `507f1f77bcf86cd799439011` (TechCorp Solutions - main employer for jobs)
- **Job IDs:** 
  - Senior React Developer: `507f1f77bcf86cd799439001`
  - Frontend Developer: `507f1f77bcf86cd799439002`
  - Data Scientist: `507f1f77bcf86cd799439003`
  - DevOps Engineer: `507f1f77bcf86cd799439004`
  - Product Manager: `507f1f77bcf86cd799439005`

## 📊 Analytics Insights

### Hiring Funnel:
- **Views:** 30 total views across all jobs
- **Applications:** 6 applications (20% view-to-application rate)
- **Shortlisted:** 1 candidate (16.7% application-to-shortlist rate)
- **Interviewed:** 1 candidate (16.7% shortlist-to-interview rate)
- **Hired:** 1 candidate (16.7% interview-to-hire rate)

### Skill Analysis:
- **Most Assessed Skills:** React (4 assessments), JavaScript (4 assessments)
- **Highest Average Score:** Python (80.0)
- **Lowest Average Score:** TypeScript (75.0)

### Course Effectiveness:
- **Course Completion Rate:** 100% (all enrolled candidates completed)
- **Hire Rate from Course Completions:** 50%
- **Average Performance Rating:** 4.4/5.0

## 🚀 Usage Instructions

### 1. Import to MongoDB:
```bash
# Import each collection
mongoimport --db employer-analytics --collection employers --file employers.json --jsonArray
mongoimport --db employer-analytics --collection jobs --file jobs.json --jsonArray
mongoimport --db employer-analytics --collection applications --file applications.json --jsonArray
mongoimport --db employer-analytics --collection skillscores --file skillscores.json --jsonArray
mongoimport --db employer-analytics --collection courses --file courses.json --jsonArray
mongoimport --db employer-analytics --collection coursecompletions --file coursecompletions.json --jsonArray
mongoimport --db employer-analytics --collection views --file views.json --jsonArray
```

### 2. Use with API Testing:
```bash
# Test analytics endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/employer/analytics/summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/employer/analytics/hiring-funnel
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/employer/analytics/skill-gaps
```

### 3. Frontend Testing:
- Use the test login to get authentication token
- Navigate through different time periods
- Test job-specific analytics
- Export reports in CSV/PDF format

## 📈 Expected Dashboard Metrics

### Summary KPIs:
- **Total Jobs:** 5
- **Active Applications:** 4
- **Hiring Success Rate:** 16.7%
- **Average Time to Hire:** 19 days

### Charts Data:
- **Hiring Status:** Applied (2), Shortlisted (1), Interviewed (1), Hired (1), Rejected (1)
- **Top Skills:** React, JavaScript, Python, TypeScript
- **Course Performance:** Full-Stack Web Development (highest completion rate)
- **Geographic Distribution:** New York (3), San Francisco (1), Boston (1), Seattle (1)

This demo data provides a realistic foundation for testing all analytics features and visualizations in the Employer Dashboard. 