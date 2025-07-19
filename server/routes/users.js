const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// GET /users/login - Simple login for testing
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For development/testing purposes, accept any credentials
    // In production, you would validate against a database
    if (email && password) {
      // Generate a test token with employerId
      const token = jwt.sign(
        { 
          email, 
          employerId: '687b2580ea593440bbd92361', // Real employer ID from database
          role: 'employer' 
        },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token,
        user: { email, role: 'employer' }
      });
    } else {
      res.status(400).json({ message: 'Email and password are required' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /users/test-token - Generate a test token for development
router.get('/test-token', (req, res) => {
  try {
    const token = jwt.sign(
      { 
        email: 'test@employer.com', 
        employerId: '687b2580ea593440bbd92361', // Real employer ID from database
        role: 'employer' 
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      message: 'Test token generated. Use this token in localStorage.setItem("token", "YOUR_TOKEN")'
    });
  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
