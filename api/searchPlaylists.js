import axios from "axios";

export default async function handler(req, res) {
  const { query } = req.query;
  const YT_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!query) {
    return res.status(400).json({ error: "Query parameter required" });
  }

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: YT_API_KEY,
        q: query,
        type: "playlist",
        part: "snippet",
        maxResults: 10,
      },
    });

    const playlists = response.data.items.map((item) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
    }));

    res.status(200).json(playlists);

  } catch (err) {
    console.error("YouTube API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}