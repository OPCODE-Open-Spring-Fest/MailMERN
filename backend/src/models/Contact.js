const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  phone: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

ContactSchema.index({ email: 1 });
ContactSchema.index({ name: 1 });

module.exports = mongoose.model('Contact', ContactSchema);