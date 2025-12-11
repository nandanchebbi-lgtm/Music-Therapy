import React from "react";
import "./Panel.css"; // ✅ Correct capitalization

export default function Panel({
  layout = "right",
  page = 1,
  onStart,
  moods = [],
  onMoodSelect,
}) {
  return (
    <div className={`panel-${layout}`}>
      {/* Page 1: Start button */}
      {page === 1 && layout === "right" && (
        <button className="panel-btn start-btn" onClick={onStart}>
          Start
        </button>
      )}

      {/* Page 2: Mood selection buttons */}
      {page === 2 && layout === "right" && moods.length > 0 && (
        <>
          {moods.map((m) => (
            <button
              key={m.name}
              className="mode-button"
              style={{ backgroundColor: m.color, color: "#fff" }}
              onClick={() => onMoodSelect(m.name)}
            >
              {m.name}
            </button>
          ))}
        </>
      )}
    </div>
  );
}