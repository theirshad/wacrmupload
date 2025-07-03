const express = require('express');
const app = express();
const axios = require('axios');

// Accept large JSON payloads (base64 files can be big)
app.use(express.json({ limit: '100mb' }));

// Upload endpoint
app.post('/upload', async (req, res) => {
  const {
    base64,
    name,
    mimeType,
    user_unique_id,
    user_fk_reseller_unique
  } = req.body;

  if (!base64 || !name || !mimeType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Forward the upload to your PHP API
    const response = await axios.post('https://reseller.digitalirshad.com/api/uploadv2.php', {
      base64,
      name,
      mimeType,
      user_unique_id,
      user_fk_reseller_unique
    });

    // Send PHP API response back to frontend
    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("Upload failed:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      detail: err.response?.data || null
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
