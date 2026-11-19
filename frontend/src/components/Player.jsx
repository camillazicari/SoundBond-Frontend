/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useLocation } from "react-router-dom";
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";

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
  const location = useLocation();

  // brano prima
  const handlePrev = () => {
    if (playlist && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setNowPlaying(playlist[prevIndex]);
    }
  };

  // brano dopo
  const handleNext = () => {
    if (playlist && currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setNowPlaying(playlist[nextIndex]);
    }
  };

  useEffect(() => {
    if (nowPlaying) {
      // fermo quello di prima
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(nowPlaying.preview);

      newAudio.onended = () => {
        // se c'è un brano dopo lo faccio partire
        if (playlist && currentIndex < playlist.length - 1) {
          const nextSong = playlist[currentIndex + 1];
          setCurrentIndex(currentIndex + 1);
          setNowPlaying(nextSong);
        } else {
          // altrimenti mi fermo
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
    if (!audio || !isPlaying) return;
    let raf;
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      raf = requestAnimationFrame(updateProgress);
    };
    raf = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(raf);
  }, [audio, isPlaying]);

  const formatTime = (timeInSeconds) => {
    if (!Number.isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const hiddenRoute =
    location.pathname.startsWith("/chat") ||
    ["/generi", "/artisti", "/brani"].includes(location.pathname);
  if (!audio || !nowPlaying || hiddenRoute) return null;

  const cover = nowPlaying?.album?.cover_big ?? nowPlaying?.album?.cover_medium;
  const pct = isNaN(progress) ? 0 : progress;
  const bars = waveform(nowPlaying?.id ?? nowPlaying?.title ?? "");
  const hasPrev = playlist?.length > 0 && currentIndex > 0;
  const hasNext = playlist?.length > 0 && currentIndex < playlist.length - 1;

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={() => setIsHidden(false)}
        aria-label={`Mostra il player: ${nowPlaying?.title}`}
        className="glass fixed right-4 bottom-4 z-50 cursor-pointer rounded-full p-2 transition-transform hover:scale-105 active:scale-95"
      >
        <Disc cover={cover} spinning={isPlaying} size="size-14" />
      </button>
    );
  }

  return (
    <section
      aria-label="Player"
      className="glass fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-[1.75rem] p-2.5 pr-3 md:bottom-4"
    >
      <div className="flex items-center gap-3">
        <Disc cover={cover} spinning={isPlaying} size="size-12 md:size-14" />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-semibold md:text-base">
              {nowPlaying?.title}
              <span className="font-normal text-muted"> · {nowPlaying?.artist?.name}</span>
            </p>
            <p className="hidden shrink-0 font-mono text-[11px] text-subtle tabular-nums sm:block">
              {formatTime(audio.currentTime)} / {formatTime(audio.duration)}
            </p>
          </div>

          {/* barra di avanzamento a onda */}
          <div className="relative mt-1.5 h-7">
            <div aria-hidden="true" className="flex h-full items-center gap-[3px]">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-full transition-colors duration-150 ${
                    (i + 0.5) / bars.length <= pct / 100 ? "bg-accent" : "bg-white/15"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={pct}
              onChange={handleSeek}
              aria-label="Posizione nel brano"
              aria-valuetext={`${formatTime(audio.currentTime)} di ${formatTime(audio.duration)}`}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!hasPrev}
            aria-label="Brano precedente"
            className="hidden size-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.08] hover:text-fg disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent sm:grid"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            type="button"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pausa" : "Riproduci"}
            className="grid size-12 cursor-pointer place-items-center rounded-full bg-accent text-accent-ink transition-transform active:scale-90"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!hasNext}
            aria-label="Brano successivo"
            className="grid size-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.08] hover:text-fg disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
          <button
            type="button"
            onClick={() => setIsHidden(true)}
            aria-label="Riduci il player"
            className="grid size-10 cursor-pointer place-items-center rounded-full text-subtle transition-colors hover:bg-white/[0.08] hover:text-fg"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

// copertina a forma di disco (fuori dal Player sennò il click non funziona)
function Disc({ cover, spinning, size }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full ring-1 ring-line-strong ${size}`}>
      <img
        src={cover}
        alt=""
        className="size-full object-cover motion-safe:animate-[sb-spin_6s_linear_infinite]"
        style={{ animationPlayState: spinning ? "running" : "paused" }}
      />
      <span className="absolute top-1/2 left-1/2 size-[18%] -translate-1/2 rounded-full bg-ink ring-1 ring-white/20" />
    </span>
  );
}

// altezze delle barre, sempre uguali per lo stesso brano
function waveform(seed, n = 56) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Array.from({ length: n }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const noise = ((h >>> 0) % 1000) / 1000;
    const env = 0.55 + 0.45 * Math.sin((Math.PI * i) / (n - 1));
    return Math.round(18 + 82 * env * (0.35 + 0.65 * noise));
  });
}

export default Player;
