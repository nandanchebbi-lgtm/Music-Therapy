import React, { useEffect } from 'react';

function LandingPage({ onStart }) {
  useEffect(() => {
    // Browser SpeechRecognition API
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Browser does not support Speech Recognition API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("Detected speech:", transcript);

      if (transcript.includes('wake')) {
        onStart();       // Trigger app start
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [onStart]); // <-- FIXED ESLINT WARNING

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎵 Music Therapy Voice Companion</h1>
      <p style={styles.subtitle}>
        Your personal music companion for mood-based relaxation and focus.
      </p>

      <div style={styles.micContainer}>
        <img
          src="https://img.icons8.com/ios-filled/100/000000/microphone.png"
          alt="Voice Mic"
          style={styles.micIcon}
        />
        <p style={styles.micText}>
          Say "Wake" to start your music session
        </p>
      </div>

      <button style={styles.startButton} onClick={onStart}>
        Start Music Therapy
      </button>

      <footer style={styles.footer}>
        <p>© 2025 Music Therapy | Powered by YouTube & Spotify</p>
      </footer>
    </div>
  );
}

// Styles (unchanged)
const styles = {
  container: {
    textAlign: 'center',
    padding: '100px 20px',
    fontFamily: "'Helvetica Neue', sans-serif",
    color: '#333',
    background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)',
    minHeight: '100vh',
  },
  title: { fontSize: '48px', marginBottom: '20px' },
  subtitle: {
    fontSize: '20px',
    marginBottom: '50px',
    color: '#555',
  },
  micContainer: { marginBottom: '40px' },
  micIcon: { width: '100px', height: '100px' },
  micText: { fontSize: '16px', marginTop: '10px', color: '#777' },
  startButton: {
    padding: '15px 40px',
    fontSize: '20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#4caf50',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s all ease',
  },
  footer: { marginTop: '100px', fontSize: '14px', color: '#999' },
};

export default LandingPage;