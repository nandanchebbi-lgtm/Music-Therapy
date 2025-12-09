import React, { useState } from 'react';
import axios from 'axios';
import LandingPage from './LandingPage';

const moods = ['Calm', 'Happy', 'Focus', 'Sleep', 'Relaxed'];

function App() {
  const [started, setStarted] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  // -------------------------------
  // Function: handle mood selection
  // -------------------------------
  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setSelectedPlaylist('');
    setPlaylists([]);

    try {
      const response = await axios.get('http://localhost:8888/api/searchPlaylists', {
        params: { query: `${mood} music playlist` }
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      alert('Failed to fetch YouTube playlists. Check your API key or network.');
    }
  };

  const handlePlaylistSelect = (playlistId) => setSelectedPlaylist(playlistId);

  const handleBack = () => {
    if (selectedPlaylist) setSelectedPlaylist('');
    else if (selectedMood) {
      setSelectedMood('');
      setPlaylists([]);
    } else if (started) setStarted(false);
  };

  // -------------------------------
  // Render Logic
  // -------------------------------
  if (!started) return <LandingPage onStart={() => setStarted(true)} />;

  if (!selectedMood) {
    return (
      <div style={styles.container}>
        <h2>Select your mood</h2>
        {moods.map((m) => (
          <button key={m} onClick={() => handleMoodSelect(m)} style={styles.button}>
            {m}
          </button>
        ))}
      </div>
    );
  }

  if (!selectedPlaylist) {
    return (
      <div style={styles.container}>
        <button onClick={handleBack} style={styles.backButton}>
          ← Back
        </button>
        <h2>Recommended Playlists for {selectedMood}</h2>
        <div style={styles.playlistGrid}>
          {playlists.map((p) => (
            <button key={p.id} onClick={() => handlePlaylistSelect(p.id)} style={styles.playlistCard}>
              <img src={p.thumbnail} alt={p.title} width="160" height="90" style={{ marginBottom: '8px', borderRadius: '4px' }} />
              <div>{p.title}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ← Back
      </button>
      <h2>Playing YouTube playlist!</h2>
      <p>🎵 Enjoy your music therapy session.</p>
      <iframe
        width="800"
        height="450"
        src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist}&autoplay=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube player"
        style={{ border: 'none', borderRadius: '8px' }}
      />
    </div>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = {
  container: { textAlign: 'center', marginTop: '50px', fontFamily: "'Helvetica Neue', sans-serif" },
  button: {
    margin: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
  },
  backButton: { marginBottom: '20px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' },
  playlistGrid: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap' },
  playlistCard: {
    margin: '10px',
    padding: '10px',
    textAlign: 'center',
    width: '180px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};

export default App;