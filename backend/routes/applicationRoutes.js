import express from "express";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// ✅ Admin: approve application
router.put("/:id/approve", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    res.json({ success: true, application: updatedApp });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// ✅ Admin: reject application
router.put("/:id/reject", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    res.json({ success: true, application: updatedApp });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// ✅ Student: Get their own applications
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id });
    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Admin: Get all applications
router.get("/all", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  try {
    const applications = await Application.find({}).populate("studentId", "name email");
    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Multer storage (ensures folder exists)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Student: Submit new application with additional fields
router.post("/submit", authMiddleware, upload.array("documents", 5), async (req, res) => {
  try {
    console.log("Received Files:", req.files);
    console.log("Request Body:", req.body);
    
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      address,
      class10Percentage,
      class12Percentage,
      gender,
      caste,
      religion,
      passedOutYear,
      nationality,
      guardianName,
      guardianContact,
      guardianOccupation,
      disability,
      ugOrPg,
    } = req.body;
    
    const documents = req.files ? req.files.map((file) => file.filename) : [];

    // Create new application document with all details
    const newApplication = new Application({
      studentId: req.user.id,
      firstName,
      lastName,
      email,
      phone,
      dob: new Date(dob),
      address,
      class10Percentage: Number(class10Percentage),
      class12Percentage: Number(class12Percentage),
      gender,
      caste,
      religion,
      passedOutYear: passedOutYear ? Number(passedOutYear) : undefined,
      nationality,
      guardianName,
      guardianContact,
      guardianOccupation,
      disability: disability === "true" || disability === true, // if sent as string or boolean
      ugOrPg,
      documents,
      status: "Pending",
    });

    await newApplication.save();
    res.status(201).json({ success: true, application: newApplication });
  } catch (error) {
    console.error("Error submitting application:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Student: Get a single application by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, application });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Student: Delete their application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    if (application.studentId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this application." });
    }

    await application.deleteOne();

    return res.status(200).json({ success: true, message: "Application deleted successfully." });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
