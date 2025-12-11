const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables for keys
const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!YT_API_KEY || !OPENAI_API_KEY) {
  console.error("❌ Missing API keys in .env");
  process.exit(1);
}

// ---------------------------------------------------------
// ✅ PLAYLIST SEARCH (existing)
// ---------------------------------------------------------
app.get("/api/searchPlaylists", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query parameter required" });

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: YT_API_KEY,
        q: query,
        type: "playlist",
        part: "snippet",
        maxResults: 10
      }
    });

    const playlists = response.data.items.map(item => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || ""
    }));

    res.json(playlists);
  } catch (err) {
    console.error("YT API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// ---------------------------------------------------------
// ✅ NEW — VIDEO SEARCH (required for Music.js)
// ---------------------------------------------------------
app.get("/api/searchVideos", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query parameter required" });

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: YT_API_KEY,
        q: query,
        type: "video",
        part: "snippet",
        maxResults: 10,
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || ""
    }));

    res.json(videos);
  } catch (err) {
    console.error("YT Video API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// ---------------------------------------------------------
// Local server only
// ---------------------------------------------------------
if (!process.env.VERCEL) {
  const PORT = 8888;
  app.listen(PORT, () =>
    console.log(`✅ Local API running at http://localhost:${PORT}`)
  );
}

// ---------------------------------------------------------
// Export for Vercel
// ---------------------------------------------------------
module.exports = app;