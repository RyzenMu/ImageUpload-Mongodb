require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mongo DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("The error is:", err);
  });

// Define Schema for Images
const imageSchema = new mongoose.Schema({
  images: [String], // Store image paths
});

const ImageModel = mongoose.model("Image", imageSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// API Route to Upload 4 Images
app.post("/upload", upload.array("images", 4), async (req, res) => {
  try {
    const filePaths = req.files.map((file) => file.path);
    const newImages = new ImageModel({ images: filePaths });
    await newImages.save();
    res.status(201).json({
      message: "Images uploaded successfully",
      data: newImages,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
