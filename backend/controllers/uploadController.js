const Upload = require("../models/Upload");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage with multer
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|mpg|avi|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Error: File type not supported!"), false);
  }
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20MB
});

// Export middleware to handle file uploads
exports.uploadFiles = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// Handler to upload files to Cloudinary
exports.uploadToCloudinary = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const { title, description } = req.body;

    if (!req.files["thumbnail"] || !req.files["video"]) {
      return res
        .status(400)
        .json({ error: "Both thumbnail and video are required" });
    }

    const thumbnailPath = req.files["thumbnail"][0].path;
    const videoPath = req.files["video"][0].path;

    console.log("Thumbnail Path:", thumbnailPath);
    console.log("Video Path:", videoPath);

    // Check file paths and contents
    if (!fs.existsSync(thumbnailPath)) {
      throw new Error("Thumbnail file does not exist");
    }
    if (!fs.existsSync(videoPath)) {
      throw new Error("Video file does not exist");
    }

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(thumbnailPath, {
      folder: "thumbnails",
      resource_type: "image",
    });
    console.log("Thumbnail Result:", thumbnailResult);

    let videoResult;

    try {
      // Upload video to Cloudinary
      videoResult = await cloudinary.uploader.upload(videoPath, {
        folder: "videos",
        resource_type: "video",
      });
      console.log("Video Result:", videoResult);
    } catch (videoUploadError) {
      console.error("Video Upload Error:", videoUploadError);
      return res.status(400).json({
        error: "Video upload failed",
        details: videoUploadError.message,
      });
    }

    // Save upload information to MongoDB
    const newUpload = new Upload({
      title,
      description,
      thumbnailUrl: thumbnailResult.secure_url,
      videoUrl: videoResult ? videoResult.secure_url : null, // Handle undefined videoResult
    });

    console.log(newUpload, "ssssssssss");

    await newUpload.save();

    // Clean up temporary files
    // fs.unlinkSync(thumbnailPath);
    // fs.unlinkSync(videoPath);

    res.status(201).json(newUpload);
  } catch (error) {
    console.error("Upload Error:", error.message); // Log error message for debugging
    res.status(500).json({ error: error.message || "Failed to upload files" });
  }
};

// Fetch all uploads
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

// Fetch upload by ID
exports.getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }
    res.status(200).json(upload);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upload" });
  }
};
