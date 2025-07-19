const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');

// POST /api/auth/employer/signup
router.post('/employer/signup', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      industry, 
      size, 
      location, 
      website, 
      phone 
    } = req.body;

    // Check if employer already exists
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Employer with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employer
    const employer = new Employer({
      name,
      email,
      password: hashedPassword,
      industry,
      size,
      location,
      website,
      phone,
      isActive: true,
      subscription: 'basic'
    });

    await employer.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: employer.email, 
        employerId: employer._id, 
        role: 'employer' 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Employer registered successfully',
      token,
      employer: {
        id: employer._id,
        name: employer.name,
        email: employer.email,
        industry: employer.industry,
        size: employer.size,
        location: employer.location
      }
    });

  } catch (err) {
    console.error('Employer signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/employer/login
router.post('/employer/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt received:', {
      body: req.body,
      contentType: req.get('Content-Type'),
      userAgent: req.get('User-Agent')
    });

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }

    console.log('🔍 Looking for employer with email:', email);

    // Check if employer exists
    const employer = await Employer.findOne({ email });
    if (!employer) {
      console.log('❌ Employer not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Employer found:', {
      id: employer._id,
      name: employer.name,
      isActive: employer.isActive
    });

    // Check if employer is active
    if (!employer.isActive) {
      console.log('❌ Employer account is deactivated');
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, employer.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for employer:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { 
        email: employer.email, 
        employerId: employer._id, 
        role: 'employer' 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', email);

    res.json({
      message: 'Login successful',
      token,
      employer: {
        id: employer._id,
        name: employer.name,
        email: employer.email,
        industry: employer.industry,
        size: employer.size,
        location: employer.location
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/employer/profile
router.get('/employer/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const employer = await Employer.findById(decoded.employerId).select('-password');
    
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json(employer);

  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router; 