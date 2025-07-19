const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const CourseCompletion = require('../models/CourseCompletion');
const Application = require('../models/Application');
const View = require('../models/View');
const Candidate = require('../models/Candidate');

// GET /api/employer/jobs
router.get('/jobs', auth, async (req, res) => {
  try {
    const employerIdStr = req.user.employerId;
    console.log('Employer ID from token:', employerIdStr);

    const employerJobs = await Job.find({}).sort({ createdAt: -1 });

    const jobs = employerJobs.filter(job => job.employerId.toString() === employerIdStr);

    console.log(`Jobs found for employer (${employerIdStr}):`, jobs.length);
    return res.json(jobs);

  } catch (err) {
    console.error('Jobs fetch error:', err);
    return res.status(500).json({
      message: 'Server error fetching jobs',
      error: err.message
    });
  }
});




// GET /api/employer/jobs/:id
router.get('/jobs/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.employerId;
    
    let job = await Job.findOne({ _id: id, employerId: new mongoose.Types.ObjectId(employerId) });
    if (!job) {
      // Try string comparison if ObjectId fails
      job = await Job.findOne({ _id: id, employerId: employerId });
    }
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (err) {
    console.error('Job fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/employer/courses
router.get('/courses', auth, async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error('Courses fetch error:', err);
    res.status(500).json({ message: 'Server error fetching courses', error: err.message });
  }
});

// GET /api/employer/course-completions
router.get('/course-completions', auth, async (req, res) => {
  try {
    const completions = await CourseCompletion.aggregate([
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
      { $sort: { completedAt: -1 } }
    ]);
    res.json(completions);
  } catch (err) {
    console.error('Course completions fetch error:', err);
    res.status(500).json({ message: 'Server error fetching course completions', error: err.message });
  }
});

// GET /api/employer/applications
router.get('/applications', auth, async (req, res) => {
  try {
    const applications = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      { $sort: { appliedAt: -1 } }
    ]);
    res.json(applications);
  } catch (err) {
    console.error('Applications fetch error:', err);
    res.status(500).json({ message: 'Server error fetching applications', error: err.message });
  }
});

// GET /api/employer/views
router.get('/views', auth, async (req, res) => {
  try {
    const views = await View.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      {
        $lookup: {
          from: 'applications',
          let: { jobId: '$jobId', applicantId: '$applicantId' },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ['$jobId', '$$jobId'] },
              { $eq: ['$applicantId', '$$applicantId'] }
            ] } } }
          ],
          as: 'application'
        }
      },
      { $unwind: { path: '$application', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'candidates',
          localField: 'applicantId',
          foreignField: '_id',
          as: 'candidate'
        }
      },
      { $unwind: { path: '$candidate', preserveNullAndEmptyArrays: true } },
      { $sort: { viewedAt: -1 } }
    ]);
    res.json(views);
  } catch (err) {
    console.error('Views fetch error:', err);
    res.status(500).json({ message: 'Server error fetching views', error: err.message });
  }
});

module.exports = router;
