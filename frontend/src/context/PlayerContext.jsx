/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [nowPlaying, setNowPlaying] = useState(null); // brano attuale
  const [audio, setAudio] = useState(null); // audio
  const [isPlaying, setIsPlaying] = useState(false); // sta suonando?
  const userLogged = useSelector((state) => state.account.userLogged);

  useEffect(() => {
    if (userLogged === null) {
      setNowPlaying(null);
      setIsPlaying(false);
      setAudio(null);
      setPlaylist([]);
      setCurrentIndex(0);
    }
  }, [userLogged]);

  // playlist in riproduzione
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // fermo l'audio quando cambia
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  // play/pausa
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
        // passo al brano dopo
        if (playlist && currentIndex < playlist.length - 1) {
          const nextSong = playlist[currentIndex + 1];
          setCurrentIndex((prev) => prev + 1);
          setNowPlaying(nextSong);
        } else {
          // era l'ultimo, mi fermo
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
