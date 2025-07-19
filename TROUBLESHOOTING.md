# 🔧 Troubleshooting Guide - Data Not Showing on UI

## 🚨 **Common Issues & Solutions**

### **Issue 1: Authentication Token Missing**
**Symptoms:** 401 Unauthorized errors, "No token provided"
**Solution:**
1. Open browser console and check for 401 errors
2. Go to `http://localhost:5173` and click "Get Test Token"
3. Verify token is saved in localStorage: `localStorage.getItem('token')`

### **Issue 2: Database Not Populated**
**Symptoms:** Empty data, null values in API responses
**Solution:**
```bash
# Run the seed script
cd server
npm run seed
```

### **Issue 3: Server Not Running**
**Symptoms:** Network errors, connection refused
**Solution:**
```bash
# Start the server
cd server
npm run dev
```

### **Issue 4: CORS Issues**
**Symptoms:** CORS errors in browser console
**Solution:** Check that server is running on port 3000 and frontend on 5173

## 🧪 **Step-by-Step Debugging**

### **Step 1: Test Server Connection**
```bash
curl http://localhost:3000/
# Should return: "Hello World"
```

### **Step 2: Test Authentication**
```bash
curl http://localhost:3000/users/test-token
# Should return a JWT token
```

### **Step 3: Test Analytics Endpoints**
```bash
# Get token first
TOKEN=$(curl -s http://localhost:3000/users/test-token | jq -r '.token')

# Test summary endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/employer/analytics/summary

# Test jobs endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/employer/jobs
```

### **Step 4: Run Automated Tests**
```bash
cd server
npm run test-api
```

## 🔍 **Browser Debugging**

### **Check Network Tab:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for failed requests (red)
5. Check request headers for Authorization

### **Check Console:**
1. Look for JavaScript errors
2. Check for 401/403 errors
3. Verify API calls are being made

### **Check localStorage:**
```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'));
console.log('Token valid:', !!localStorage.getItem('token'));
```

## 📊 **Expected Data Structure**

### **Summary Endpoint Response:**
```json
{
  "totalJobs": 5,
  "openJobs": 2,
  "filledJobs": 1,
  "archivedJobs": 1,
  "applicantsTotal": 6,
  "interviews": 1,
  "hires": 1,
  "shortlisted": 1,
  "recentApplications": 4,
  "recentHires": 1
}
```

### **Jobs Endpoint Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439001",
    "title": "Senior React Developer",
    "status": "open",
    "employerId": "507f1f77bcf86cd799439011"
  }
]
```

## 🛠️ **Quick Fixes**

### **Fix 1: Clear and Re-seed Database**
```bash
cd server
npm run seed
```

### **Fix 2: Clear Browser Data**
```javascript
// In browser console
localStorage.clear();
// Then refresh and get new token
```

### **Fix 3: Restart Both Servers**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### **Fix 4: Check MongoDB Connection**
```bash
# Verify MongoDB is running
mongosh
# or
mongo
```

## 📋 **Checklist**

- [ ] MongoDB is running
- [ ] Backend server is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] Database is seeded with demo data
- [ ] Authentication token is present in localStorage
- [ ] No CORS errors in browser console
- [ ] API endpoints return data (not 401/404 errors)
- [ ] Frontend components are receiving data

## 🆘 **Still Having Issues?**

If you're still experiencing problems:

1. **Check the logs:**
   ```bash
   # Backend logs
   cd server && npm run dev
   
   # Frontend logs  
   cd client && npm run dev
   ```

2. **Run the test script:**
   ```bash
   cd server && npm run test-api
   ```

3. **Verify database collections:**
   ```bash
   mongosh employer-analytics
   db.jobs.find().count()
   db.applications.find().count()
   db.employers.find().count()
   ```

4. **Check environment variables:**
   - Make sure `MONGO_URI` is set (or defaults to localhost)
   - Make sure `JWT_SECRET` is set (or uses default)

## 📞 **Common Error Messages**

| Error | Cause | Solution |
|-------|-------|----------|
| "No token provided" | Missing JWT token | Get token via test login |
| "Invalid token" | Expired/corrupted token | Get new token |
| "Job not found" | Database not seeded | Run `npm run seed` |
| "Connection refused" | Server not running | Start server with `npm run dev` |
| "CORS error" | Wrong ports/configuration | Check server and frontend ports |

This troubleshooting guide should help you identify and fix the issue with data not showing on the UI. 