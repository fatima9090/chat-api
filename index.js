const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Static folder (uploads access ke liye)
app.use("/uploads", express.static("uploads"));

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({ storage });

// Upload API
app.post("/upload", uploads.single("file"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({
    message: "File uploaded successfully",
    url: fileUrl,
  });
});

// Delete API (optional)
const fs = require("fs");

app.delete("/delete/:filename", (req, res) => {
  const filePath = `uploads/${req.params.filename}`;

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "File not found" });

    res.json({ message: "File deleted" });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));