// models/Note.js
const mongoose = require('mongoose');
const { string } = require('zod');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  fileKey: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  semester: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tags: [String],
  views: { type: Number, default: 0, min: 0 },
  downloads: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  fileName: String,
  fileSize: Number,
  fileType: String,
  likes: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
