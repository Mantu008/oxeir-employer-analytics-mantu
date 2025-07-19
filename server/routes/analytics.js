const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SkillScore = require('../models/SkillScore');
const CourseCompletion = require('../models/CourseCompletion');
const View = require('../models/View');
const mongoose = require('mongoose');

// Protect all analytics routes
router.use(auth);

// Helper function to get date range from query params
const getDateRange = (req) => {
  const { start, end, period } = req.query;
  let startDate, endDate;
  
  if (start && end) {
    startDate = new Date(start);
    endDate = new Date(end);
  } else if (period) {
    endDate = new Date();
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  } else {
    // Default to last 30 days
    endDate = new Date();
    startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate, endDate };
};

// GET /api/employer/analytics/summary
router.get('/summary', async (req, res) => {
  try {
    const employerId = req.user.employerId;
    const { startDate, endDate } = getDateRange(req);
    
    // Get job statistics
    const jobStats = await Job.aggregate([
      { $match: { employerId: employerId } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          openJobs: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          filledJobs: { $sum: { $cond: [{ $eq: ['$status', 'filled'] }, 1, 0] } },
          archivedJobs: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } }
        }
      }
    ]);

    // Get application statistics
    const applicationStats = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      { $match: { 'job.employerId': employerId } },
      {
        $group: {
          _id: null,
          applicantsTotal: { $sum: 1 },
          interviews: { $sum: { $cond: [{ $eq: ['$status', 'interviewed'] }, 1, 0] } },
          hires: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } }
        }
      }
    ]);

    // Get recent activity (last 30 days)
    const recentActivity = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      { $match: { 
        'job.employerId': employerId,
        appliedAt: { $gte: startDate, $lte: endDate }
      }},
      {
        $group: {
          _id: null,
          recentApplications: { $sum: 1 },
          recentHires: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
        }
      }
    ]);

    const stats = {
      ...jobStats[0],
      ...applicationStats[0],
      ...recentActivity[0],
      recentApplications: recentActivity[0]?.recentApplications || 0,
      recentHires: recentActivity[0]?.recentHires || 0
    };

    res.json(stats);
  } catch (err) {
    console.error('Summary analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/analytics/funnel/:jobId
router.get('/funnel/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.employerId;

    console.log('jobId param:', jobId);
    console.log('employerId from token:', employerId);

    const jobById = await Job.findById(jobId);
    console.log('Job by ID:', jobById);

    if (!jobById) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (jobById.employerId.toString() !== employerId) {
      return res.status(404).json({ message: 'Job not found or does not belong to employer' });
    }

    // Get views count
    const views = await View.countDocuments({ jobId });

    // Get application funnel data
    const funnelData = await Application.aggregate([
      { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transform to expected format
    const funnel = {
      views,
      applications: 0,
      shortlisted: 0,
      interviewed: 0,
      hired: 0
    };

    funnelData.forEach(item => {
      switch (item._id) {
        case 'applied':
          funnel.applications = item.count;
          break;
        case 'shortlisted':
          funnel.shortlisted = item.count;
          break;
        case 'interviewed':
          funnel.interviewed = item.count;
          break;
        case 'hired':
          funnel.hired = item.count;
          break;
      }
    });

    res.json(funnel);
  } catch (err) {
    console.error('Funnel analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/analytics/skill-gap/:jobId
router.get('/skill-gap/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.employerId;

    console.log('jobId:', jobId);
    console.log('employerId from token:', employerId);

    // Check job by ID
    const jobById = await Job.findById(jobId);
    console.log('Job by ID:', jobById);

    if (!jobById) {
      return res.status(404).json({ message: 'Job not found by ID' });
    }

    // Check ownership
    if (jobById.employerId.toString() !== employerId) {
      return res.status(404).json({ message: 'Job not found or not owned by employer' });
    }
    // Get skill gap analysis
    const skillGapData = await SkillScore.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: 'candidateId',
          foreignField: 'applicantId',
          as: 'application'
        }
      },
      { $unwind: '$application' },
      { $match: { 'application.jobId': new mongoose.Types.ObjectId(jobId) } },
      {
        $group: {
          _id: '$skill',
          avgSkillScore: { $avg: '$score' },
          candidateCount: { $sum: 1 },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' }
        }
      },
      { $sort: { avgSkillScore: -1 } }
    ]);

    res.json(skillGapData);
  } catch (err) {
    console.error('Skill gap analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/analytics/top-courses
router.get('/top-courses', auth, async (req, res) => {
  try {
    const employerId = req.user.employerId;
    const { startDate, endDate } = getDateRange(req);

    const topCourses = await CourseCompletion.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      { $match: { 
        'job.employerId': employerId,
        wasHired: true,
        completedAt: { $gte: startDate, $lte: endDate }
      }},
      {
        $group: {
          _id: '$courseId',
          courseName: { $first: '$course.name' },
          institution: { $first: '$course.institution' },
          hiresCount: { $sum: 1 },
          avgPerformanceRating: { $avg: '$performanceRating' }
        }
      },
      { $sort: { hiresCount: -1 } },
      { $limit: 10 }
    ]);

    res.json(topCourses);
  } catch (err) {
    console.error('Top courses analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/analytics/hiring-status
router.get('/hiring-status', auth, async (req, res) => {
  try {
    const employerId = req.user.employerId;
    const { startDate, endDate } = getDateRange(req);

    const hiringStatus = await Job.aggregate([
      { $match: { 
        employerId: employerId,
        createdAt: { $gte: startDate, $lte: endDate }
      }},
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(hiringStatus);
  } catch (err) {
    console.error('Hiring status analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/analytics/geography
router.get('/geography', auth, async (req, res) => {
  try {
    const employerId = req.user.employerId;
    const { startDate, endDate } = getDateRange(req);

    const geographyData = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      { $match: { 
        'job.employerId': employerId,
        appliedAt: { $gte: startDate, $lte: endDate },
        'location.country': { $exists: true, $ne: null }
      }},
      {
        $group: {
          _id: '$location.country',
          applications: { $sum: 1 },
          hires: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
        }
      },
      { $sort: { applications: -1 } }
    ]);

    res.json(geographyData);
  } catch (err) {
    console.error('Geography analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/analytics/export-report
router.get('/export-report', auth, async (req, res) => {
  try {
    const { format = 'csv', start, end } = req.query;
    const employerId = req.user.employerId;
    
    if (format === 'csv') {
      // Generate CSV report
      const reportData = await generateCSVReport(employerId, start, end);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.csv');
      res.send(reportData);
    } else if (format === 'pdf') {
      // Generate PDF report
      const reportData = await generatePDFReport(employerId, start, end);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.pdf');
      res.send(reportData);
    } else {
      res.status(400).json({ message: 'Unsupported format. Use csv or pdf.' });
    }
  } catch (err) {
    console.error('Export report error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Helper function to generate CSV report
const generateCSVReport = async (employerId, start, end) => {
  // Implementation for CSV generation
  const summary = await getSummaryData(employerId, start, end);
  
  let csv = 'Metric,Value\n';
  csv += `Total Jobs,${summary.totalJobs}\n`;
  csv += `Open Jobs,${summary.openJobs}\n`;
  csv += `Filled Jobs,${summary.filledJobs}\n`;
  csv += `Total Applications,${summary.applicantsTotal}\n`;
  csv += `Interviews,${summary.interviews}\n`;
  csv += `Hires,${summary.hires}\n`;
  
  return csv;
};

// Helper function to generate PDF report
const generatePDFReport = async (employerId, start, end) => {
  // Implementation for PDF generation
  // This would typically use a library like puppeteer or jsPDF
  return 'PDF report placeholder';
};

// Helper function to get summary data
const getSummaryData = async (employerId, start, end) => {
  // Use the same logic as the /summary endpoint
  // Get date range
  let startDate, endDate;
  if (start && end) {
    startDate = new Date(start);
    endDate = new Date(end);
  } else {
    endDate = new Date();
    startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // default: last 30 days
  }

  // Job statistics
  const jobStats = await Job.aggregate([
    { $match: { employerId: employerId } },
    {
      $group: {
        _id: null,
        totalJobs: { $sum: 1 },
        openJobs: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
        filledJobs: { $sum: { $cond: [{ $eq: ['$status', 'filled'] }, 1, 0] } },
        archivedJobs: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } }
      }
    }
  ]);

  // Application statistics
  const applicationStats = await Application.aggregate([
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job'
      }
    },
    { $unwind: '$job' },
    { $match: { 'job.employerId': employerId } },
    {
      $group: {
        _id: null,
        applicantsTotal: { $sum: 1 },
        interviews: { $sum: { $cond: [{ $eq: ['$status', 'interviewed'] }, 1, 0] } },
        hires: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } },
        shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } }
      }
    }
  ]);

  // Recent activity (last 30 days or custom range)
  const recentActivity = await Application.aggregate([
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job'
      }
    },
    { $unwind: '$job' },
    { $match: {
      'job.employerId': employerId,
      appliedAt: { $gte: startDate, $lte: endDate }
    }},
    {
      $group: {
        _id: null,
        recentApplications: { $sum: 1 },
        recentHires: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
      }
    }
  ]);

  return {
    ...jobStats[0],
    ...applicationStats[0],
    ...recentActivity[0],
    recentApplications: recentActivity[0]?.recentApplications || 0,
    recentHires: recentActivity[0]?.recentHires || 0
  };
};

module.exports = router; 