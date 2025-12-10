import axios from "axios";

export default async function handler(req, res) {
  try {
    const query = req.query.query || "relaxing music playlist";

    const YT_URL = "https://www.googleapis.com/youtube/v3/search";

    const response = await axios.get(YT_URL, {
      params: {
        part: "snippet",
        q: query,
        type: "playlist",
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 10,
      },
    });

    const playlists = response.data.items.map((item) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    res.status(200).json(playlists);
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}