import React from "react";
import BreathingFace from "./Face";
import Panel from "./Panel";

export default function MoodPage({ moods, onMoodSelect }) {
  return (
    <div style={styles.container}>
      <BreathingFace elapsedTime={0} showEyes={false}>
        <div style={styles.centerContent}>Select Your Mood</div>
      </BreathingFace>

      <div style={styles.panelContainer}>
        <Panel layout="right" page={2} moods={moods} onMoodSelect={onMoodSelect} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: "100vh",
    width: "100vw",
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
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    pointerEvents: "none",
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