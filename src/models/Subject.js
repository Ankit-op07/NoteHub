const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  branch: {
    type: "string",
    enum: ["cse", "ece", "mech", "civil", "ee", "test"],
    required: true
  },
  semester: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
    required: true
  },
  credits: Number,
  description: String
});

// Ensure unique combination of branch + semester + subject code
subjectSchema.index(
  { branch: 1, semester: 1, code: 1 },
  { unique: true }
);

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
