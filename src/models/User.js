const mongoose = require('mongoose');
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    select: false,
  },
  studentId: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    sparse: true, // Add this line
  },
  branch: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Branch',
    type: String,
    enum: ['cse', 'ece', 'mech', 'civil', 'eee'],
    lowercase: true,

  },
  semester: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  profilePicUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'manager'],
    default: 'student',
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  googleId: {
    type: String
  },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
