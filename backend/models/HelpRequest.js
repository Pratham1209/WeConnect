const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  acceptedBy: String,
  acceptedById: String,
}, { timestamps: true });

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);
