import React, { useEffect, useState } from "react";
import BreathingFace from "./Face";

function LandingPage({ onStart, elapsedTime = 0 }) {
  const [showMic, setShowMic] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMic(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (transcript.includes("wake")) {
        onStart();
        recognition.stop();
      }
    };

    recognition.onerror = (event) => console.error(event.error);

    recognition.start();
    return () => recognition.stop();
  }, [onStart]);

  return (
    <div style={styles.container}>
      <BreathingFace elapsedTime={elapsedTime} showEyes={!showMic}>
        {showMic && (
          <div style={styles.centerContent}>
            <span style={styles.micIcon}>🎤</span>
            <p style={styles.wakeText}>Say “Wake” to begin</p>
          </div>
        )}
      </BreathingFace>

      <div style={styles.panelContainer}>
        <button style={styles.startButton} onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #fff4ec 0%, #ffe0d4 50%, #ffd4d4 100%)",
    color: "#3a1f1f",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: `"Inter", "Segoe UI", system-ui, sans-serif`,
  },

  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    pointerEvents: "none",
    color: "#7b4b3a",
  },

  micIcon: {
    fontSize: "52px",
    marginBottom: "12px",
    filter: "drop-shadow(0 0 10px rgba(226,91,69,0.35))",
  },

  wakeText: {
    fontSize: "18px",
    fontStyle: "italic",
    opacity: 0.9,
  },

  panelContainer: {
    position: "absolute",
    right: "50px",
    top: "50%",
    transform: "translateY(-50%)",
  },

  startButton: {
    padding: "18px 42px",
    fontSize: "18px",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#e25b45",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 10px 25px rgba(226,91,69,0.35)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
};

export default LandingPage;