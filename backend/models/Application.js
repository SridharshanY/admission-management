// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  // Academic Details
  class10Percentage: { type: Number, required: true },
  class12Percentage: { type: Number, required: true },
  // Additional Details
  gender: { type: String, required: true },
  caste: { type: String },
  religion: { type: String },
  passedOutYear: { type: Number },
  nationality: { type: String },
  // Guardian Details
  guardianName: { type: String, required: true },
  guardianContact: { type: String, required: true },
  guardianOccupation: { type: String },
  // Other Details
  disability: { type: Boolean, default: false },
  ugOrPg: { type: String, enum: ["UG", "PG"], required: true },
  // Application Specific
  documents: [String],
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
