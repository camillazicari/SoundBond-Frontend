/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [nowPlaying, setNowPlaying] = useState(null); // Traccia corrente
  const [audio, setAudio] = useState(null); // Istanza Audio
  const [isPlaying, setIsPlaying] = useState(false); // Stato di riproduzione

  // Nuove variabili per gestire la playlist corrente
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Pulizia dell'audio al cambio o smontaggio
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  // Funzione per alternare play/pause (opzionale se usi il pulsante nel Player)
  const playPauseHandler = (previewUrl, song) => {
    if (isPlaying) {
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      newAudio.onended = () => {
        // Qui gestiamo la riproduzione della traccia successiva
        if (playlist && currentIndex < playlist.length - 1) {
          const nextSong = playlist[currentIndex + 1];
          setCurrentIndex((prev) => prev + 1);
          setNowPlaying(nextSong);
        } else {
          // Se siamo all'ultima traccia, stoppa o riparte da capo
          setIsPlaying(false);
          setAudio(null);
        }
      };
      setAudio(newAudio);
      setIsPlaying(true);
      setNowPlaying(song);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        nowPlaying,
        setNowPlaying,
        playPauseHandler,
        isPlaying,
        audio,
        setAudio,
        setIsPlaying,
        playlist,
        setPlaylist,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
