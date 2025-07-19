const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  industry: { 
    type: String, 
    required: true 
  },
  size: { 
    type: String, 
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    required: true 
  },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    timezone: { type: String }
  },
  website: { 
    type: String,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  subscription: { 
    type: String, 
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
EmployerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Employer', EmployerSchema); 