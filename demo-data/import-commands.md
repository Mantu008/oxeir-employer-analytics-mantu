# MongoDB Import Commands

## Step 1: Import Jobs
```bash
mongoimport --db employer-analytics --collection jobs --file demo-data/jobs-data.json --jsonArray
```

## Step 2: Import Applications
```bash
mongoimport --db employer-analytics --collection applications --file demo-data/applications-data.json --jsonArray
```

## Step 3: Import Skill Scores
```bash
mongoimport --db employer-analytics --collection skillscores --file demo-data/skillscores-data.json --jsonArray
```

## Step 4: Import Courses
```bash
mongoimport --db employer-analytics --collection courses --file demo-data/courses-data.json --jsonArray
```

## Step 5: Import Course Completions
```bash
mongoimport --db employer-analytics --collection coursecompletions --file demo-data/coursecompletions-data.json --jsonArray
```

## Step 6: Import Views
```bash
mongoimport --db employer-analytics --collection views --file demo-data/views-data.json --jsonArray
```

## Alternative: Using MongoDB Shell
```javascript
// Connect to your database
use employer-analytics

// Insert jobs
db.jobs.insertMany([
  // Copy the jobs data from jobs-data.json
])

// Insert applications
db.applications.insertMany([
  // Copy the applications data from applications-data.json
])

// Insert skill scores
db.skillscores.insertMany([
  // Copy the skill scores data from skillscores-data.json
])

// Insert courses
db.courses.insertMany([
  // Copy the courses data from courses-data.json
])

// Insert course completions
db.coursecompletions.insertMany([
  // Copy the course completions data from coursecompletions-data.json
])

// Insert views
db.views.insertMany([
  // Copy the views data from views-data.json
])
```

## Important Notes:
1. Replace `JOB_ID_1`, `JOB_ID_2`, etc. with actual job IDs from your database
2. Replace `APPLICANT_001`, `APPLICANT_002`, etc. with actual applicant IDs
3. Replace `COURSE_001`, `COURSE_002`, etc. with actual course IDs
4. Make sure the `employerId` matches your actual employer ID: `687b2580ea593440bbd92361` 