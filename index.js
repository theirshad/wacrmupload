// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.post("/upload", async (req, res) => {
  try {
    const response = await axios.post(
      "https://reseller.digitalirshad.com/api/uploadv2.php",
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ error: "Upload failed", details: error.message });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
