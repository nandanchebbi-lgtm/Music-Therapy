import React from "react";
import BreathingFace from "./Face";
import Panel from "./Panel";

export default function MoodPage({ moods, onMoodSelect }) {
  return (
    <div style={styles.container}>
      <BreathingFace elapsedTime={0} showEyes={false}>
        <div style={styles.centerContent}>How are you feeling right now?</div>
      </BreathingFace>

      <div style={styles.panelContainer}>
        <Panel
          layout="right"
          page={2}
          moods={moods}
          onMoodSelect={onMoodSelect}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #fff4ec 0%, #ffe0d4 50%, #ffd4d4 100%)",
    color: "#3a1f1f",
    height: "100vh",
    width: "100vw",
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
    color: "#7b4b3a",
    fontSize: "26px",
    fontWeight: 600,
    textAlign: "center",
    pointerEvents: "none",
    letterSpacing: "0.3px",
    textShadow: "0 0 18px rgba(226,91,69,0.25)",
  },

  panelContainer: {
    position: "absolute",
    right: "50px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};