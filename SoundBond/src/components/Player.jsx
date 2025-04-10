/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";

const Player = () => {
  const {
    nowPlaying,
    isPlaying,
    setIsPlaying,
    audio,
    setAudio,
    playlist,
    currentIndex,
    setCurrentIndex,
    setNowPlaying,
  } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  // Handler per andare al brano precedente
  const handlePrev = () => {
    if (playlist && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setNowPlaying(playlist[prevIndex]);
    }
  };

  // Handler per andare al brano successivo
  const handleNext = () => {
    if (playlist && currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setNowPlaying(playlist[nextIndex]);
    }
  };

  useEffect(() => {
    if (nowPlaying) {
      // Ferma l'eventuale audio precedente
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(nowPlaying.preview);

      newAudio.onended = () => {
        // Se nella playlist esiste una traccia successiva, riproducila
        if (playlist && currentIndex < playlist.length - 1) {
          const nextSong = playlist[currentIndex + 1];
          setCurrentIndex(currentIndex + 1);
          setNowPlaying(nextSong);
        } else {
          // Altrimenti, stoppa il player o gestisci il replay
          setIsPlaying(false);
          setAudio(null);
        }
      };

      newAudio.ontimeupdate = () => {
        setProgress((newAudio.currentTime / newAudio.duration) * 100);
      };
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [nowPlaying]);

  const handlePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event) => {
    if (!audio) return;
    const newTime = (event.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(event.target.value);
  };

  useEffect(() => {
    if (!audio) return;

    const updateProgress = () => {
      if (!audio) return;
      setProgress((audio.currentTime / audio.duration) * 100);
      requestAnimationFrame(updateProgress);
    };

    if (isPlaying) {
      requestAnimationFrame(updateProgress);
    }

    return () => {
      cancelAnimationFrame(updateProgress);
    };
  }, [audio, isPlaying]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div
      className={`player-container ${
        audio === null
          ? "hidden"
          : isHidden
          ? "fixed bottom-[-10.5%] left-0 right-0 z-50 mx-2"
          : "fixed bottom-0 left-0 right-0 z-50 mx-2"
      }`}
    >
      <div className="cardPlayer border-1 border-[#b849d6] relative">
        <button
          className="cursor-pointer absolute top-0 right-2"
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#b849d6"
              className="bi bi-arrow-up-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#b849d6"
              className="bi bi-arrow-down-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"
              />
            </svg>
          )}
        </button>
        <div className="top">
          <div className="w-[10%]">
            <div
              className="pfp"
              style={{
                backgroundImage: `url(${nowPlaying?.album?.cover_big})`,
                backgroundSize: "cover",
              }}
            >
              {isPlaying ? (
                <div className="playing">
                  <div className="greenline line-1"></div>
                  <div className="greenline line-2"></div>
                  <div className="greenline line-3"></div>
                  <div className="greenline line-4"></div>
                  <div className="greenline line-5"></div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="texts text-center w-[60%]">
            <p className="title-1">{nowPlaying?.title}</p>
            <p className="title-2">{nowPlaying?.artist?.name}</p>
          </div>
          <div className="w-[10%] flex justify-end items-center"></div>
        </div>

        <div className="controls mb-1.5">
          {/* Freccia sinistra per il brano precedente */}
          <svg
            onClick={handlePrev}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height="35"
            width="35"
            className="frecciaSx cursor-pointer"
          >
            <path
              clipRule="evenodd"
              d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm.848-12.352a1.2 1.2 0 0 0-1.696-1.696l-3.6 3.6a1.2 1.2 0 0 0 0 1.696l3.6 3.6a1.2 1.2 0 0 0 1.696-1.696L11.297 13.2H15.6a1.2 1.2 0 1 0 0-2.4h-4.303l1.551-1.552Z"
              fillRule="evenodd"
            ></path>
          </svg>
          {/* Pulsante Play/Pause */}
          <button onClick={handlePlayPause} className="mx-2">
            {!isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-play-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-pause-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5" />
              </svg>
            )}
          </button>
          {/* Freccia destra per il brano successivo */}
          <svg
            onClick={handleNext}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height="35"
            width="35"
            className="frecciaDx cursor-pointer"
          >
            <path
              clipRule="evenodd"
              d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 1 0 1.696 1.696l3.6-3.6a1.2 1.2 0 0 0 0-1.696Z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          className="time"
          type="range"
          min="0"
          max="100"
          value={isNaN(progress) ? 0 : progress}
          onChange={handleSeek}
          style={{ "--progress": `${progress}%` }}
        />
        <p className="timetext time_now">
          {audio ? formatTime(audio.currentTime) : "0:00"}
        </p>
        <p className="timetext time_full">
          {audio ? formatTime(audio.duration) : "0:00"}
        </p>
      </div>
    </div>
  );
};

export default Player;
