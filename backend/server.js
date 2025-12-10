// server.js (local only)
if (process.env.VERCEL) {
  console.log("Running on Vercel, skipping local Express server");
  return;
}

const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const { WebSocketServer } = require("ws");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8888;
const WS_PORT = 9001;

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!YT_API_KEY || !OPENAI_API_KEY) {
  console.error("❌ Missing API keys in .env");
  process.exit(1);
}

// ---------------- Playlist Search ----------------
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
        maxResults: 10,
      },
    });

    const playlists = response.data.items.map((item) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
    }));

    res.json(playlists);
  } catch (err) {
    console.error("YT API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

app.listen(PORT, () => console.log(`✅ Local API running at http://localhost:${PORT}`));

// ---------------- WebSocket Server ----------------
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`✅ WS listening at ws://localhost:${WS_PORT}`);

function toBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

wss.on("connection", async (ws) => {
  console.log("Client connected to WS");

  let realtime = null;

  ws.on("message", async (msg) => {
    if (msg instanceof Buffer) {
      if (!realtime) return;
      await realtime.send({ type: "input_audio_buffer.append", audio: toBase64(msg) });
      return;
    }

    const data = JSON.parse(msg.toString());

    if (data.type === "start_session") {
      try {
        const session = await openai.realtime.sessions.create({
          model: "gpt-4o-realtime-preview",
          instructions: `
You are a mood-detection assistant.
Respond ONLY with JSON like:
{"mood":"Calm"} or {"mood":"Happy"}
Never speak outside JSON.
If unsure, ask a clarifying question.
`,
        });

        realtime = await openai.realtime.connect({ session });

        realtime.on("response.output_text.delta", (ev) => ws.send(JSON.stringify(ev)));
        realtime.on("response", (ev) => ws.send(JSON.stringify(ev)));
        realtime.on("error", (err) =>
          ws.send(JSON.stringify({ type: "error", error: String(err) }))
        );

        ws.send(JSON.stringify({ type: "session_created" }));
      } catch (err) {
        console.error("Realtime create error:", err);
        ws.send(JSON.stringify({ type: "session_error", message: String(err) }));
      }
    }

    if (data.type === "commit") {
      await realtime.send({ type: "input_audio_buffer.commit" });
      await realtime.send({ type: "response.create" });
    }
  });

  ws.on("close", () => {
    if (realtime) realtime.close();
    realtime = null;
    console.log("WS client disconnected");
  });
});