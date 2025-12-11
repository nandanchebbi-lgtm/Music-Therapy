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
          videoId={videoId}   // ❗ Pass video into face
        />
      </div>

      {/* Text Section */}
      <div style={styles.textArea}>
        <h2>Now Playing: {mood} Music</h2>
        {loading && <p>Loading your personalized track… 🎵</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#1a1a1a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
  },

  backButton: {
    alignSelf: "flex-start",
    marginLeft: "40px",
    marginBottom: "20px",
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#333",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },

  faceWrapper: {
    width: "350px",
    height: "350px",
  },

  textArea: {
    marginTop: "30px",
    textAlign: "center",
  },
};