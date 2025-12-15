// Music.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import BreathingFace from "./Face";

export default function MusicPage({ mood, onBack }) {
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------
  // Fetch a random YouTube video for the selected mood
  // -------------------------------------------------
  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setVideoId("");

      try {
        const response = await axios.get("http://localhost:8888/api/searchVideos", {
          params: { query: `${mood} relaxing music` },
        });

        const videos = response.data;

        if (videos.length > 0) {
          const random = videos[Math.floor(Math.random() * videos.length)];
          setVideoId(random.id);
        } else {
          console.warn("No videos returned from API.");
        }
      } catch (err) {
        console.error("Video fetch error:", err);
      }

      setLoading(false);
    };

    fetchVideo();
  }, [mood]);

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button style={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      {/* Centered Face with embedded YouTube video */}
      <div style={styles.faceWrapper}>
        <BreathingFace
          elapsedTime={0}
          showEyes={false}
          videoId={videoId}
        />
      </div>

      {/* Text Section */}
      <div style={styles.textArea}>
        <h2 style={styles.title}>
          A moment for you
        </h2>
        <p style={styles.subtitle}>
          {mood} music, chosen gently for how you’re feeling
        </p>
        {loading && (
          <p style={styles.loadingText}>
            Finding something soothing… 🎶
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #fff4ec 0%, #ffe0d4 50%, #ffd4d4 100%)",
    color: "#3a1f1f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
    fontFamily: `"Inter", "Segoe UI", system-ui, sans-serif`,
  },

  backButton: {
    alignSelf: "flex-start",
    marginLeft: "40px",
    marginBottom: "20px",
    padding: "10px 22px",
    borderRadius: "14px",
    background: "rgba(226, 91, 69, 0.15)",
    color: "#7b4b3a",
    border: "1px solid rgba(226, 91, 69, 0.3)",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 500,
    transition: "background 0.3s, box-shadow 0.3s",
    boxShadow: "0 0 12px rgba(226,91,69,0.15)",
  },

  faceWrapper: {
    width: "360px",
    height: "360px",
    marginTop: "20px",
    filter: "drop-shadow(0 0 25px rgba(226,91,69,0.25))",
  },

  textArea: {
    marginTop: "30px",
    textAlign: "center",
    maxWidth: "420px",
  },

  title: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#e25b45",
    marginBottom: "6px",
    textShadow: "0 0 16px rgba(226,91,69,0.3)",
  },

  subtitle: {
    fontSize: "16px",
    color: "#7b4b3a",
    marginBottom: "12px",
  },

  loadingText: {
    fontSize: "14px",
    color: "#9a6a5a",
    fontStyle: "italic",
  },
};