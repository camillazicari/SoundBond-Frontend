import { playlistCovers } from "../assets/playlistCovers";
import { DEEZER_PROXY_URL } from "../config";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./personalizedComponents/Dialog";
import { getGeneri } from "../redux/actions/generi.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BondSpinner from "./BondSpinner.jsx";
import PageHeader from "./ui/PageHeader.jsx";
import { Pause, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext.jsx";

const Esplora = () => {
  const dispatch = useDispatch();
  const generi = useSelector((state) => state.generi.generi);
  const [genres, setGenres] = useState([]);
  const [generiId, setGeneriId] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [match, setMatch] = useState([]);

  useEffect(() => {
    dispatch(getGeneri());
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${DEEZER_PROXY_URL}/api/genres`);
      if (!response.ok) throw new Error("Errore nel recupero dei dati");
      const data = await response.json();
      setGenres(data.data);
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  useEffect(() => {
    const matches = generi
      .map((genere) => {
        const found = genres?.find((g) =>
          g.name.toLowerCase().includes(genere.nome.toLowerCase())
        );
        return found;
      })
      .filter(Boolean);

    setMatch(matches);
    setGeneriId(matches.map((m) => m.id));
  }, [genres, generi]);

  // Per ogni genere: classifica dei brani del genere, 15 brani che cambiano ogni giorno
  useEffect(() => {
    if (generiId.length === 0) return;
    const giornoDellAnno = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    const PER_PLAYLIST = 15;

    const fetchSongs = async () => {
      try {
        const results = await Promise.all(
          generiId.map(async (id) => {
            const res = await fetch(`${DEEZER_PROXY_URL}/api/genre-tracks?genre_id=${id}`);
            if (!res.ok) throw new Error(`Errore brani genre_id: ${id}`);
            const data = await res.json();
            const all = (data.data || []).filter((t) => t.preview);
            if (all.length <= PER_PLAYLIST) return all;
            const start = (giornoDellAnno * PER_PLAYLIST) % all.length;
            return [...all.slice(start), ...all.slice(0, start)].slice(0, PER_PLAYLIST);
          })
        );
        setSongs(results);
      } catch (err) {
        console.error("Errore brani:", err);
      }
    };

    fetchSongs();
  }, [generiId]);

  const { nowPlaying, setNowPlaying, setPlaylist, setCurrentIndex, setAudio } =
    usePlayer();

  const handleSongSelect = (song, index, currentPlaylist) => {
    // Se il brano cliccato è già in riproduzione, fermarlo
    if (nowPlaying?.id === song.id) {
      setAudio(null);
      setNowPlaying(null);
    } else {
      // Imposta la playlist corrente nel contesto
      setPlaylist(currentPlaylist);

      // Imposta l'indice del brano selezionato
      setCurrentIndex(index);

      // Imposta la traccia corrente
      setNowPlaying(song);
    }
  };

  if (generi.length < 1) return <BondSpinner />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-16 md:pt-15">
      <PageHeader eyebrow="Esplora" title="Playlist" accent="pensate per te.">
        Ogni giorno nuove anteprime dai tuoi generi preferiti. Apri una playlist e premi play.
      </PageHeader>

      {match.length > 0 ? (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {match.map((genere, id) => (
            <li key={genere?.id}>
              <Dialog>
                <DialogTrigger
                  className="group block w-full cursor-pointer text-left"
                  onClick={() => setSelectedIndex(id)}
                >
                  <div className="relative overflow-hidden rounded-[var(--radius-card)] ring-1 ring-line">
                    <img
                      src={playlistCovers[id % playlistCovers.length]}
                      alt=""
                      className="aspect-square w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-105"
                    />
                    <span className="absolute right-4 bottom-4 grid size-12 translate-y-2 place-items-center rounded-full bg-accent text-accent-ink opacity-0 shadow-lg transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-subtle">Playlist del giorno</p>
                  <p className="display mt-1 text-2xl font-bold md:text-3xl">Il meglio di {genere?.name}</p>
                </DialogTrigger>
                <DialogContent
                  aria-label={`Playlist ${genere?.name}`}
                  className="glass max-w-lg gap-0 rounded-[var(--radius-card)] border-line p-0"
                >
                  <div className="flex items-center gap-4 border-b border-line p-5">
                    <img src={playlistCovers[id % playlistCovers.length]} alt="" className="size-16 rounded-xl object-cover" />
                    <div>
                      <DialogTitle className="display text-2xl font-bold">Il meglio di {genere?.name}</DialogTitle>
                      <DialogDescription className="text-sm text-muted">
                        {songs[selectedIndex]?.length ?? 0} anteprime da 30 secondi
                      </DialogDescription>
                    </div>
                  </div>
                  <ol className="max-h-[60dvh] overflow-y-auto p-2">
                    {songs[selectedIndex]?.length > 0 ? (
                      songs[selectedIndex].map((song, j) => {
                        const playing = nowPlaying?.id === song?.id;
                        return (
                          <li key={song?.id ?? j}>
                            <button
                              type="button"
                              onClick={() => handleSongSelect(song, j, songs[selectedIndex])}
                              aria-label={playing ? `Metti in pausa ${song?.title}` : `Ascolta ${song?.title}`}
                              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[0.05] ${playing ? "bg-accent-soft" : ""}`}
                            >
                              <span className={`w-6 shrink-0 text-right font-mono text-sm ${playing ? "text-accent" : "text-subtle"}`}>{j + 1}</span>
                              <img src={song?.album?.cover_big} alt="" className="size-11 rounded-lg object-cover" />
                              <span className="min-w-0 flex-1">
                                <span className={`block truncate font-medium ${playing ? "text-accent" : ""}`}>{song?.title}</span>
                                <span className="block truncate text-sm text-muted">{song?.artist?.name}</span>
                              </span>
                              <span className={`grid size-9 shrink-0 place-items-center rounded-full ${playing ? "bg-accent text-accent-ink" : "bg-white/[0.06]"}`}>
                                {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
                              </span>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="p-6 text-center text-muted">Nessun brano disponibile.</li>
                    )}
                  </ol>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface mt-12 p-10 text-center">
          <p className="display text-3xl font-bold">Gusti ricercati.</p>
          <p className="mt-2 text-muted">Non troviamo playlist per i tuoi generi. Aggiungine altri nelle impostazioni.</p>
        </div>
      )}
    </div>
  );
};

export default Esplora;
