const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (adjust later for security)
app.use(cors());
app.options("*", cors()); // Preflight request handler

// Parse incoming JSON with larger size support (for base64 data)
app.use(express.json({ limit: "50mb" }));

// Upload endpoint
app.post("/upload", async (req, res) => {
  try {
    const { data, mimeType, extraData } = req.body;

    // Validate required fields
    if (!data || !mimeType || !extraData || !extraData.name) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Create folder structure
    const folder = path.join(__dirname, "uploads", new Date().toISOString().split("T")[0]);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    // Decode base64 and save file
    const base64Data = data.replace(/^data:.*;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filePath = path.join(folder, extraData.name);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `https://wacrmupload.onrender.com/uploads/${new Date().toISOString().split("T")[0]}/${extraData.name}`;

    res.json({
      success: true,
      message: "File uploaded successfully",
      url: publicUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
