const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  response: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['general', 'support', 'sales', 'technical', 'other'],
    default: 'general'
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  isAutoReply: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index for better query performance
MessageSchema.index({ user: 1, timestamp: -1 });
MessageSchema.index({ category: 1 });
MessageSchema.index({ sentiment: 1 });

module.exports = mongoose.model('Message', MessageSchema);
