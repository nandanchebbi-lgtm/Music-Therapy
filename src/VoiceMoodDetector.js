// VoiceMoodDetector.js
import React, { useState, useRef } from "react";

export default function VoiceMoodDetector({ onMoodDetected }) {
  const [status, setStatus] = useState("🎤 Start Conversation");
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);

  const startConversation = () => {
    setStatus("Connecting…");

    wsRef.current = new WebSocket("ws://localhost:9001");

    wsRef.current.onopen = () => {
      // Start session handshake
      wsRef.current.send(JSON.stringify({ type: "start_session" }));
    };

    wsRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // 1. Listen for AI-generated JSON with mood
      if (msg.type === "response.output_text.delta") {
        try {
          const json = JSON.parse(msg.delta);
          if (json.mood) {
            onMoodDetected(json.mood);
          }
        } catch {}
      }

      // 2. When backend confirms session, start mic + have AI speak first
      if (msg.type === "session_created") {
        setStatus("🎙 Listening…");
        startMic();

        // Ask AI to start the conversation
        wsRef.current.send(
          JSON.stringify({
            type: "input_text",
            text: "Start a gentle conversation. Ask me: 'How was your day today?' Then continue interacting with me until you can detect my mood. Respond with JSON like: { \"mood\": \"Happy\" } when you're ready."
          })
        );
      }
    };
  };

  const startMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioCtxRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);

    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const bytes = floatToPCM16(input);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(bytes);
      }
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
  };

  function floatToPCM16(arr) {
    const buffer = new ArrayBuffer(arr.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < arr.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, arr[i]));
      view.setInt16(offset, s * 0x7fff, true);
    }
    return buffer;
  }

  return (
    <div style={{ marginBottom: 40 }}>
      <h3>{status}</h3>

      <button style={styles.btn} onClick={startConversation}>
        🎤 Start Conversation
      </button>
    </div>
  );
}

const styles = {
  btn: {
    padding: "15px 30px",
    fontSize: 20,
    borderRadius: 12,
    background: "#4CAF50",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  }
};