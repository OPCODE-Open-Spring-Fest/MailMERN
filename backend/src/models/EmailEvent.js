const mongoose = require('mongoose');

const emailEventSchema = new mongoose.Schema({
    email: { type: String, required: true },
    subject: { type: String },
    messageId: { type: String },
    status: { type: String, enum: ['sent', 'opened', 'clicked'], default: 'sent' },
    eventType: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailEvent', emailEventSchema);
