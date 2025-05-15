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
  rejectedBy: [
    {
      id: String,
      name: String,
    },
  ],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  time: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

HelpRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);



