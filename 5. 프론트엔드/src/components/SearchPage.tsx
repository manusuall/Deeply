'use client'
import React, { useState, useEffect } from 'react';
import { Input } from "./ui/input";
import MusicDelayedInsertCard from '@/components/music-delayed-insert-card-server-result';

export default function SearchPage() {
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [songTitles, setSongTitles] = useState([]);
  const [musics, setMusics] = useState([]); 

  useEffect(() => {
    if (playlistTitle) {
      handleSearch();
    }
  }, [playlistTitle]);
  
  
  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlist_title: playlistTitle }),
      });
      const data = await response.json();
      setSongTitles(data.song_titles);
      setMusics(data.son_titles);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return(
  <div>
  <Input 
    type="text"
    value={playlistTitle}
    onChange={(e) => setPlaylistTitle(e.target.value)}
    placeholder="Enter playlist title"
  />
  <ul>
    {songTitles.map((title, index) => (
      <li key={index}>{title}</li>
    ))}
  </ul>
  <MusicDelayedInsertCard musics={musics} />
</div>
);
}
