// Face.jsx
import React from "react";
import "./face.css";

export default function BreathingFace({
  elapsedTime,
  showEyes = true,
  videoId = null,
  children, // external UI below the face
}) {
  const safeElapsed = Math.max(0, Number(elapsedTime) || 0);

  // PROGRESS RING SETTINGS
  const svgSize = 345;
  const strokeWidth = 14;
  const radius = svgSize / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const totalSessionTime = 10 * 60;
  const progressFraction = Math.min(safeElapsed / totalSessionTime, 1);
  const strokeDashoffset = circumference * (1 - progressFraction);

  return (
    <div className="face-container">
      
      {/* FACE LAYER */}
      <div className="face">
        
        {/* PROGRESS RING */}
        <svg className="progress-ring" width={svgSize} height={svgSize}>
          <circle
            className="progress-ring-bg"
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
          />
          <circle
            className="progress-ring-bar"
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>

        {/* INNER CIRCLE */}
        <div className="inner-circle">
          {!videoId && (
            <>
              <div
                className="eye left"
                style={{ opacity: showEyes ? 1 : 0 }}
              />
              <div
                className="eye right"
                style={{ opacity: showEyes ? 1 : 0 }}
              />
            </>
          )}

          {videoId && (
            <iframe
              className="video-frame"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="mood-video"
            />
          )}
        </div>
      </div>

      {/* CHILD CONTENT BELOW FACE */}
      <div className="face-overlay">
        {children}
      </div>
    </div>
  );
}