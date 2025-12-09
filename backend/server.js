const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 8888;
const YT_API_KEY = process.env.YOUTUBE_API_KEY;

// Verify API key is loaded
if (!YT_API_KEY) {
  console.error("❌ YOUTUBE_API_KEY is missing in .env");
  process.exit(1);
}

// Endpoint to search YouTube playlists by mood
app.get('/api/searchPlaylists', async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YT_API_KEY,
        q: query,
        type: 'playlist',
        part: 'snippet',
        maxResults: 5
      }
    });

    const playlists = response.data.items.map(item => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || ''
    }));

    res.json(playlists);
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));