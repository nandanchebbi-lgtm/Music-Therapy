// src/api.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8888";

/**
 * Fetch playlists from backend API
 * @param {string} query - Mood or search term
 */
export async function searchPlaylists(query) {
  const res = await fetch(`${API_URL}/api/searchPlaylists?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}