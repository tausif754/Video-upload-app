const express = require("express");
const {
  uploadFiles,
  uploadToCloudinary,
  getUploads,
  getUploadById,
} = require("../controllers/uploadController");
const router = express.Router();

router.post("/", uploadFiles, uploadToCloudinary);
router.get("/", getUploads);
router.get("/:id", getUploadById);

module.exports = router;
