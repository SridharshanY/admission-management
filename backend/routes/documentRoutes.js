// routes/documentRoutes.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Route to handle a single file upload. The field name should match what the frontend sends.
router.post("/upload", upload.single("document"), (req, res) => {
  // Multer adds the file info to req.file
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  res.status(200).json({
    msg: "Document submitted successfully",
    file: req.file, // You can return file details if needed
  });
});

export default router;
