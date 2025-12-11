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
            <p style={styles.wakeText}>Say “Wake” to start</p>
          </div>
        )}
      </BreathingFace>

      <div style={styles.panelContainer}>
        <button style={styles.startButton} onClick={onStart}>Start</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#fff",
    textAlign: "center",
    pointerEvents: "none",
  },
  micIcon: { fontSize: "48px", marginBottom: "10px" },
  wakeText: { fontSize: "18px", color: "#ccc" },
  panelContainer: {
    position: "absolute",
    right: "50px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  startButton: {
    padding: "20px 40px",
    fontSize: "20px",
    borderRadius: "50px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};

export default LandingPage;