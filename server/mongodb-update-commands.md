# MongoDB Update Commands to Fix Application Job IDs

## Problem
Your applications are referencing old job IDs that no longer exist. The applications have job IDs like:
- `507f1f77bcf86cd799439011`
- `507f1f77bcf86cd799439012` 
- `507f1f77bcf86cd799439013`
- `507f1f77bcf86cd799439014`

But your current jobs have IDs like:
- `687b2c0d29fd6db613dfe633` (Senior React Developer)
- `687b2c0d29fd6db613dfe634` (Frontend Developer)
- `687b2c0d29fd6db613dfe635` (Data Scientist)
- `687b2c0d29fd6db613dfe636` (DevOps Engineer)

## Solution
Run these MongoDB update commands to fix the application job IDs:

### 1. Update applications for Senior React Developer
```javascript
db.applications.updateMany(
  { jobId: ObjectId("507f1f77bcf86cd799439011") },
  { $set: { jobId: ObjectId("687b2c0d29fd6db613dfe633") } }
)
```

### 2. Update applications for Frontend Developer
```javascript
db.applications.updateMany(
  { jobId: ObjectId("507f1f77bcf86cd799439012") },
  { $set: { jobId: ObjectId("687b2c0d29fd6db613dfe634") } }
)
```

### 3. Update applications for Data Scientist
```javascript
db.applications.updateMany(
  { jobId: ObjectId("507f1f77bcf86cd799439013") },
  { $set: { jobId: ObjectId("687b2c0d29fd6db613dfe635") } }
)
```

### 4. Update applications for DevOps Engineer
```javascript
db.applications.updateMany(
  { jobId: ObjectId("507f1f77bcf86cd799439014") },
  { $set: { jobId: ObjectId("687b2c0d29fd6db613dfe636") } }
)
```

## How to Run These Commands

### Option 1: MongoDB Shell
1. Open MongoDB shell: `mongosh`
2. Switch to your database: `use employer-analytics`
3. Run each command above

### Option 2: MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Go to the "Shell" tab
4. Run each command above

### Option 3: Command Line
```bash
mongosh "mongodb://localhost:27017/employer-analytics" --eval "
db.applications.updateMany(
  { jobId: ObjectId('507f1f77bcf86cd799439011') },
  { \$set: { jobId: ObjectId('687b2c0d29fd6db613dfe633') } }
);
db.applications.updateMany(
  { jobId: ObjectId('507f1f77bcf86cd799439012') },
  { \$set: { jobId: ObjectId('687b2c0d29fd6db613dfe634') } }
);
db.applications.updateMany(
  { jobId: ObjectId('507f1f77bcf86cd799439013') },
  { \$set: { jobId: ObjectId('687b2c0d29fd6db613dfe635') } }
);
db.applications.updateMany(
  { jobId: ObjectId('507f1f77bcf86cd799439014') },
  { \$set: { jobId: ObjectId('687b2c0d29fd6db613dfe636') } }
);
"
```

## Verify the Update
After running the commands, verify the fix:
```javascript
db.applications.find({}, {jobId: 1, status: 1})
```

You should see applications with the new job IDs:
- `687b2c0d29fd6db613dfe633`
- `687b2c0d29fd6db613dfe634`
- `687b2c0d29fd6db613dfe635`
- `687b2c0d29fd6db613dfe636`

## Expected Result
After running these commands, your dashboard should show:
- Applications data in the funnel charts
- Proper hiring status breakdown
- Complete analytics data

The summary endpoint should show the correct application counts and the jobs endpoint should work properly. 