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
  noteDifficulty: { type: Number, default: 0, enum: [0, 1, 2] },
  extractedText: {
    type: String,
    default: null
  },
  summary: {
    type: String,
    default: null
  },
  keyTopics: [{
    type: String,
    trim: true
  }],
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  searchableContent: {
    type: String,
    default: function () {
      return `${this.title} ${this.description} ${this.subject} ${this.extractedText || ''}`.toLowerCase();
    }
  },
  hasTextExtraction: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  isPyq: { type: Boolean, default: false },
  pyqDuration: { type: Number, default: 0 },
  pyqYear: { type: String, default: '2025' },
  pyqTotalMarks: { type: Number, default: 0 },
  downloadUrl: { type: String, default: null },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
