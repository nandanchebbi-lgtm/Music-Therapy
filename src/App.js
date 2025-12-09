// App.js
import React, { useState } from "react";
import axios from "axios";
import LandingPage from "./LandingPage";

const moods = [
  { name: "Calm", color: "#4CAF50" },
  { name: "Happy", color: "#FF9800" },
  { name: "Focus", color: "#3F51B5" },
  { name: "Sleep", color: "#9C27B0" },
  { name: "Relaxed", color: "#009688" },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setSelectedPlaylist("");
    setPlaylists([]);
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:8888/api/searchPlaylists", {
        params: { query: `${mood} music playlist` },
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("Failed to fetch playlists. Check API key or network.");
    }

    setLoading(false);
  };

  const handlePlaylistSelect = (playlistId) => setSelectedPlaylist(playlistId);

  const handleBack = () => {
    if (selectedPlaylist) setSelectedPlaylist("");
    else if (selectedMood) {
      setSelectedMood("");
      setPlaylists([]);
    } else if (started) setStarted(false);
  };

  // -------------------------------
  // Render Logic
  // -------------------------------
  if (!started) return <LandingPage onStart={() => setStarted(true)} />;

  // Mood selection
  if (!selectedMood) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>🎵 How are you feeling today?</h2>
        <div style={styles.moodGrid}>
          {moods.map((m) => (
            <div
              key={m.name}
              style={{ ...styles.moodCard, background: `linear-gradient(135deg, ${m.color} 0%, #fff 100%)` }}
              onClick={() => handleMoodSelect(m.name)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={styles.moodText}>{m.name}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Playlist selection
  if (!selectedPlaylist) {
    return (
      <div style={styles.container}>
        <button onClick={handleBack} style={styles.backButton}>
          ← Back
        </button>
        <h2>Playlists for {selectedMood}</h2>
        {loading ? (
          <p>Loading playlists… 🎧</p>
        ) : playlists.length === 0 ? (
          <p>No playlists found. Try another mood!</p>
        ) : (
          <div style={styles.playlistGrid}>
            {playlists.map((p) => (
              <div
                key={p.id}
                style={styles.playlistCard}
                onClick={() => handlePlaylistSelect(p.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  width="100%"
                  height="120"
                  style={{ borderRadius: "10px", objectFit: "cover" }}
                />
                <div style={styles.playlistTitle}>{p.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Now playing
  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ← Back
      </button>
      <h2>Now Playing</h2>
      <p>🎵 Enjoy your music therapy session.</p>
      <iframe
        width="800"
        height="450"
        src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist}&autoplay=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube playlist"
        style={{ border: "none", borderRadius: "12px" }}
      />
    </div>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "'Helvetica Neue', sans-serif",
    padding: "0 20px",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "40px",
  },
  moodGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  moodCard: {
    width: "140px",
    height: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  moodText: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  backButton: {
    marginBottom: "20px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  playlistGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "20px",
    gap: "20px",
  },
  playlistCard: {
    width: "200px",
    cursor: "pointer",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    textAlign: "center",
  },
  playlistTitle: {
    padding: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#333",
  },
};