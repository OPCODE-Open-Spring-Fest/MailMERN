const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  html: { type: String },
  text: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  totalRecipients: { type: Number, default: 0 },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, 
  startedAt: { type: Date },
  completedAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipients: [{
    email: { type: String, required: true },
    name: { type: String },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    error: { type: String },
    sentAt: { type: Date }
  }],
  errors: [{ type: String }]
}, { timestamps: true });

campaignSchema.index({ userId: 1, createdAt: -1 });
campaignSchema.index({ status: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
