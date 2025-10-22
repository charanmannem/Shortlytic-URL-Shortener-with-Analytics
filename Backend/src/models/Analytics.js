const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  referrer: {
    type: String,
    default: 'direct'
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    default: 'unknown'
  },
  browser: {
    type: String,
    default: 'Unknown'
  },
  os: {
    type: String,
    default: 'Unknown'
  }
}, {
  timestamps: false
});

analyticsSchema.index({ urlId: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);