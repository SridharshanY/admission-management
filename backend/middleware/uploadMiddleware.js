// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files will be stored in the "uploads" directory (make sure this folder exists)
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Append a timestamp to the original filename for uniqueness
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    // Use path.extname to get the file extension
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Create the multer instance
const upload = multer({ storage });

export default upload;
