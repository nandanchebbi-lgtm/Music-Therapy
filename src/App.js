import React, { useState } from "react";
import axios from "axios";

import LandingPage from "./components/LandingPage";
import MoodPage from "./components/MoodPage";
import MusicPage from "./components/Music";

const moods = [
  { name: "Calm", color: "#4CAF50" },
  { name: "Happy", color: "#FF9800" },
  { name: "Focus", color: "#3F51B5" },
  { name: "Sleep", color: "#9C27B0" },
  { name: "Relaxed", color: "#009688" },
];

export default function App() {
  const [page, setPage] = useState(1); // 1=Landing, 2=Mood, 3=Music
  const [selectedMood, setSelectedMood] = useState("");

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleStart = () => setPage(2);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setPage(3);
  };

  const handleBack = () => {
    if (page === 3) {
      setSelectedMood("");
      setPage(2);
    } else if (page === 2) {
      setPage(1);
    }
  };

  // -------------------------------
  // Render pages
  // -------------------------------
  if (page === 1) return <LandingPage onStart={handleStart} />;

  if (page === 2)
    return <MoodPage moods={moods} onMoodSelect={handleMoodSelect} />;

  if (page === 3)
    return <MusicPage mood={selectedMood} onBack={handleBack} />;

  return null;
}