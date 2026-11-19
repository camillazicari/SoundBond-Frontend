import { DEEZER_PROXY_URL } from "../config";
import { useEffect, useMemo, useState } from "react";
import { useGetUserMatches } from "./data/matchMaking.js";
import { useDispatch, useSelector } from "react-redux";
import { getUtenteLoggato, getUtenti } from "../redux/actions/account.js";
import BondSpinner from "./BondSpinner.jsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, UserPlus, Users } from "lucide-react";
import MatchCard from "./MatchCard.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import { getBonders } from "../redux/actions/bonders.js";
import {
  deleteRichiesta,
  getRichiesteInviate,
  getRichiesteRicevute,
  postRichiesta,
} from "../redux/actions/richieste.js";
import { useNavigate } from "react-router-dom";

const Connessioni = () => {
  const reduceMotion = useReducedMotion();
  const user = useSelector((state) => state.account.userLogged);
  const bonders = useSelector((state) => state.bonders.bonders);
  const richiesteInviate = useSelector(
    (state) => state.richieste.richiesteInviate
  );
  const richiesteRicevute = useSelector(
    (state) => state.richieste.richiesteRicevute
  );
  const matches = useGetUserMatches();
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [hoverStates, setHoverStates] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const {
    nowPlaying,
    setNowPlaying,
    setAudio,
    audio,
    setIsPlaying,
    isPlaying,
  } = usePlayer();

  const getSongs = async (titolo, artista) => {
    const url = `${DEEZER_PROXY_URL}/api/search?q=${titolo}%20${artista}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const firstSong = data.data[0];
          setNowPlaying(firstSong);
          setIsPlaying(true);

          const newAudio = new Audio(firstSong.preview);

          setAudio(newAudio);

          newAudio.addEventListener("ended", () => {
            setIsPlaying(false);
            setNowPlaying(null);
          });
          newAudio.play().catch((err) => {
            console.error("Errore nella riproduzione:", err);
          });
        }
      } else {
        throw new Error("Errore nel recupero dei dati");
      }
    } catch (error) {
      console.log("errore", error);
    }
  };

  const handleSongClick = (songTitle, artist) => {
    if (nowPlaying?.title === songTitle) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      getSongs(songTitle, artist);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getUtenteLoggato());
      await Promise.all([
        dispatch(getUtenti()),
        dispatch(getBonders()),
        dispatch(getRichiesteInviate()),
        dispatch(getRichiesteRicevute()),
      ]);
    };
    fetchData();
  }, [dispatch]);

  const nonBonders = useMemo(() => {
    if (!bonders || !matches) return [];

    const bonderIds = new Set(bonders.map((bonder) => bonder.otherUser.id));

    return matches.filter((match) => !bonderIds.has(match.user.id));
  }, [bonders, matches]);

  const getFilteredMatches = () => {
    if (!nonBonders || nonBonders.length === 0) return [];

    let filtered = [];
    if (filter === "all") {
      filtered = nonBonders;
    } else if (filter === "high") {
      filtered = nonBonders.filter((match) => match.compatibility.score >= 70);
    } else if (filter === "medium") {
      filtered = nonBonders.filter(
        (match) =>
          match.compatibility.score >= 40 && match.compatibility.score < 70
      );
    } else if (filter === "low") {
      filtered = nonBonders.filter((match) => match.compatibility.score < 40);
    }

    if (search) {
      filtered = filtered.filter((match) => {
        const userName = (
          match.user?.nome +
          " " +
          match.user?.cognome
        ).toLowerCase();
        const username = match.user?.profilo?.nomeUtente?.toLowerCase();
        const searchLower = search?.toLowerCase();

        // Controllo se il nome, cognome, nome utente, generi o artisti corrispondono al testo di ricerca
        const genresMatch = match.user?.generi?.some((genere) =>
          genere.nome.toLowerCase().includes(searchLower)
        );
        const artistsMatch = match.user?.artisti?.some((artista) =>
          artista.nome?.toLowerCase().includes(searchLower)
        );

        // Verifica se nome, cognome, nome utente, generi o artisti corrispondono alla ricerca
        return (
          userName?.includes(searchLower) ||
          username?.includes(searchLower) ||
          genresMatch ||
          artistsMatch
        );
      });
    }

    return filtered;
  };

  const filteredMatches = getFilteredMatches();

  if (!filteredMatches) {
    return <BondSpinner />;
  }

  const checkIfRequestSent = (userId) => {
    return richiesteInviate?.some(
      (req) =>
        req.receiver.id === userId || (req.isTemp && req.receiver.id === userId)
    );
  };

  const handleMouseEnter = (userId) => {
    setHoverStates((prev) => ({ ...prev, [userId]: true }));
  };

  const handleMouseLeave = (userId) => {
    setHoverStates((prev) => ({ ...prev, [userId]: false }));
  };

  const filters = [
    { id: "all", label: "Tutti" },
    { id: "high", label: "Alta, 70%+" },
    { id: "medium", label: "Media, 40-69%" },
    { id: "low", label: "Bassa, sotto 40%" },
  ];

  const requestAction = (match) => {
    const id = match.user?.id;
    if (checkIfRequestSent(id)) {
      return (
        <button
          type="button"
          onMouseEnter={() => handleMouseEnter(id)}
          onMouseLeave={() => handleMouseLeave(id)}
          onClick={() => dispatch(deleteRichiesta(id))}
          className="btn btn-ghost flex-1 hover:border-red-400/40 hover:text-red-300"
        >
          {hoverStates[id] ? "Annulla richiesta" : "Richiesta inviata"}
        </button>
      );
    }
    if (richiesteRicevute?.some((req) => req.sender.id === id)) {
      return (
        <button
          type="button"
          onClick={() => navigate(`/chat/${id}`)}
          className="btn btn-ghost flex-1"
        >
          Ti ha scritto: rispondi
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => dispatch(postRichiesta(id))}
        className="btn btn-primary flex-1"
      >
        <UserPlus size={16} />
        Connetti
      </button>
    );
  };

  const visible = filteredMatches.slice(0, page * itemsPerPage);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-6 md:pt-15">
      <header className="max-w-2xl">
        <h1 className="display text-6xl font-bold md:text-8xl">
          Connessioni
        </h1>
        <p className="mt-3 text-muted">
          Le persone ordinate per affinità con i tuoi gusti. Generi e artisti
          in comune sono evidenziati.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Filtra per affinità"
          className="flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setPage(1);
              }}
              className={`relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.id ? "text-accent-ink" : "text-muted hover:text-fg"
              }`}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="filter-pill"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", bounce: 0, duration: 0.35 }
                  }
                  className="absolute inset-0 rounded-full bg-accent"
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <label className="relative block md:w-72">
          <span className="sr-only">Cerca per nome, genere o artista</span>
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nome, genere o artista"
            className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-10 text-sm text-fg placeholder:text-subtle focus:border-accent/60"
          />
        </label>
      </div>

      {user?.nome && visible.length > 0 ? (
        <>
          <motion.ul layout className="mt-8 grid gap-4 lg:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((match, i) => (
                <motion.li
                  key={match.user?.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    bounce: 0,
                    duration: 0.45,
                    delay: reduceMotion ? 0 : Math.min(i, 6) * 0.04,
                  }}
                >
                  <MatchCard
                    match={match}
                    onSongClick={handleSongClick}
                    playingTitle={isPlaying ? nowPlaying?.title : undefined}
                    actions={
                      <>
                        {requestAction(match)}
                        <button
                          type="button"
                          onClick={() => navigate(`/dettagli/${match.user?.id}`)}
                          className="btn btn-ghost"
                        >
                          Profilo
                        </button>
                      </>
                    }
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {page * itemsPerPage < filteredMatches.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-ghost"
              >
                Mostra altri
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="surface mt-8 flex flex-col items-center px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
            <Users size={20} />
          </span>
          <p className="mt-4 font-semibold">Nessuna persona in questa fascia</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Prova un altro filtro o aggiungi qualche artista al tuo profilo per
            ampliare i risultati.
          </p>
          <button
            type="button"
            onClick={() => navigate("/impostazioni")}
            className="btn btn-ghost mt-6"
          >
            Modifica i tuoi gusti
          </button>
        </div>
      )}
    </div>
  );
};

export default Connessioni;
