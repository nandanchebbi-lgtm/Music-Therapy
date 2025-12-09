// realtime-assistant.js
import WebSocket from "ws";
import fs from "fs";
import { spawn } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error("❌ OPENAI_API_KEY missing in .env");
  process.exit(1);
}

// ---------------------------
// Helper: convert Float32 -> PCM16
// ---------------------------
function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s * 0x7fff, true);
  }
  return Buffer.from(buffer);
}

// ---------------------------
// Connect to OpenAI Realtime API
// ---------------------------
const ws = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview", {
  headers: { Authorization: `Bearer ${OPENAI_KEY}` },
});

ws.on("open", () => {
  console.log("✅ Connected to OpenAI Realtime API");
});

ws.on("message", (msg) => {
  const data = JSON.parse(msg.toString());
  if (data.type === "response.output_text.delta") {
    process.stdout.write(data.delta); // stream assistant text live
  }
});

// ---------------------------
// Record microphone and send audio
// ---------------------------
ws.on("open", () => {
  console.log("🎙 Start speaking...");

  // Using 'arecord' on Linux or 'sox'/'rec' on Mac/Windows
  const mic = spawn("sox", ["-d", "-r", "16000", "-c", "1", "-b", "16", "-e", "signed-integer", "-t", "raw", "-"]);

  mic.stdout.on("data", (chunk) => {
    if (ws.readyState === WebSocket.OPEN) {
      const audio64 = chunk.toString("base64");
      ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: audio64 }));
    }
  });

  mic.stderr.on("data", (data) => {
    console.error("Mic error:", data.toString());
  });

  // Commit audio every few seconds
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
      ws.send(JSON.stringify({ type: "response.create" }));
    }
  }, 4000);
});

ws.on("close", () => console.log("Connection closed"));
ws.on("error", (err) => console.error("WS error:", err));