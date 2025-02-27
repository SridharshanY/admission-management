// routes/adminAuthRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// Admin Registration
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("adminCode", "Admin code is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, adminCode } = req.body;
    try {
      // Validate the admin registration code (set this in your .env file)
      if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return res.status(401).json({ msg: "Invalid admin registration code" });
      }

      // Check if a user with the given email already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Create new admin user (force role to "admin")
      user = new User({ name, email, password, role: "admin" });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ token });
    } catch (error) {
      console.error("Admin registration error:", error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Admin Login
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // Find the user and ensure they are an admin
      const user = await User.findOne({ email });
      if (!user || user.role !== "admin") {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } catch (error) {
      console.error("Admin login error:", error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router;
