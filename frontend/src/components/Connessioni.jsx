import { useEffect, useMemo, useState } from "react";
import { useGetUserMatches } from "./data/matchMaking.js";
import { useDispatch, useSelector } from "react-redux";
import { getUtenteLoggato, getUtenti } from "../redux/actions/account.js";
import { Card } from "./personalizedComponents/Card.jsx";
import BondSpinner from "./BondSpinner.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./personalizedComponents/Avatar.jsx";
import Badge from "./personalizedComponents/Badge.jsx";
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
    const url = `http://localhost:5002/api/search?q=${titolo}%20${artista}`;
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

  return (
    <div className="fade-in container mx-auto grid grid-cols-1 gap-y-6">
      <Card className="px-6 py-10 backdrop-blur-lg mx-3 xxl:mx-0 bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg grid grid-cols-1 gap-5 items-center">
        <div>
          {user && (
            <h2 className="font-extrabold text-xl sm:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl textGradient">
              Trova le Tue Connessioni Musicali
            </h2>
          )}
          <p className="text-sm lg:text-base 2xl:text-2xl">
            Scopri persone che condividono i tuoi gusti musicali, scambia
            consigli musicali ed espandi i tuoi orizzonti sonori.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-5">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm sm:text-base 2xl:text-2xl rounded-full py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "all"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Tutte le connessioni
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`text-sm sm:text-base rounded-full 2xl:text-2xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "high"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match alto (70% +)
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={`text-sm sm:text-base rounded-full 2xl:text-2xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "medium"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match medio (40-70%)
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`text-sm sm:text-base rounded-full 2xl:text-2xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "low"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match basso (&lt;40%)
          </button>
        </div>
      </Card>
      {filteredMatches.length > 0 && (
        <div id="search-container" className="my-5">
          <div className="nebula"></div>
          <div className="starfield"></div>
          <div className="cosmic-dust"></div>
          <div className="cosmic-dust"></div>
          <div className="cosmic-dust"></div>

          <div className="stardust"></div>

          <div className="cosmic-ring"></div>

          <div id="mainCont">
            <input
              className="inputSearch"
              name="text"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca utenti..."
            />
            <div id="input-mask"></div>
            <div id="cosmic-glow"></div>
            <div className="wormhole-border"></div>
            <div id="wormhole-icon">
              <svg
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                stroke="#0C0512"
                fill="none"
                height="24"
                width="24"
                viewBox="0 0 24 24"
              >
                <circle r="10" cy="12" cx="12"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <div id="search-icon">
              <svg
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                stroke="url(#cosmic-search)"
                fill="none"
                height="24"
                width="24"
                viewBox="0 0 24 24"
              >
                <circle r="8" cy="11" cx="11"></circle>
                <line y2="16.65" x2="16.65" y1="21" x1="21"></line>
                <defs>
                  <linearGradient
                    gradientTransform="rotate(45)"
                    id="cosmic-search"
                  >
                    <stop stopColor="#d06bd9" offset="0%"></stop>
                    <stop stopColor="#ad42ff" offset="100%"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div>
        {filteredMatches && user?.nome && filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6">
            {filteredMatches.slice(0, page * itemsPerPage).map((match) => (
              <Card
                key={match.user?.id}
                className="py-3 backdrop-blur-lg mx-3 xxl:mx-0 bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg gap-5 items-center"
              >
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-25 h-25 md:w-30 md:h-30 lg:w-25 lg:h-25 xl:h-25 xl:w-25 2xl:w-30 2xl:h-30 transition-all duration-300 group-hover:border-[#7112b7]">
                      <AvatarImage
                        src={
                          match?.user?.profilo?.immagine.startsWith("http")
                            ? match?.user?.profilo?.immagine
                            : `http://192.168.1.61:5220${match?.user?.profilo?.immagine}`
                        }
                        alt={match.user?.profilo?.nomeUtente}
                      />
                      <AvatarFallback className="bg-[#ad42ff] text-2xl">
                        {match.user?.profilo?.nomeUtente
                          ?.slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg md:text-xl xl:text-xl 2xl:text-2xl font-semibold">
                        {match.user?.nome.toUpperCase()}{" "}
                        {match.user?.cognome.toUpperCase()}
                      </p>
                      <p className="text-base md:text-lg xl:text-lg 2xl:text-xl font-semibold">
                        @{match.user?.nomeUtente}
                      </p>
                      <p className="text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg bioColorata">
                        {match.user?.profilo?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#ad42ff] rounded-full h-15 w-15 flex justify-center items-center">
                    <p className=" font-bold">{match.compatibility?.score}%</p>
                  </div>
                </div>

                <div
                  className="relative z-10 flex flex-col"
                  ata-scroll-section="false"
                >
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl mb-2 font-semibold bioColorata">
                      Artisti:
                    </p>
                    <div className="flex justify-center items-center">
                      {match.user?.artisti &&
                        match.user.artisti.map((artista) => (
                          <div
                            key={artista.id}
                            className="flex flex-col items-center justify-center mx-2 w-18 sm:w-20 md:w-23 lg:w-20 xl:w-23 2xl:w-28"
                          >
                            <Avatar
                              className={`w-18 h-18 sm:w-20 sm:h-20 md:w-23 md:h-23 lg:w-20 lg:h-20 xl:w-23 xl:h-23 2xl:w-28 2xl:h-28 object-cover ${
                                match.compatibility.details.commonArtists?.includes(
                                  artista.nome?.toLowerCase()
                                )
                                  ? "border-[#ad42ff] border-3"
                                  : ""
                              }`}
                            >
                              <AvatarImage
                                src={artista.img}
                                alt={artista.nome}
                              />
                              <AvatarFallback className="bg-[#ad42ff] text-2xl">
                                {artista.nome?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-[11px] sm:text-[13px] md:text-[15px] 2xl:text-lg 2xl:leading-tight text-center mt-1 h-10 sm:h-11 md:h-12 2xl:h-17 overflow-auto flex items-center justify-center">
                              {artista.nome}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 place-items-center my-5">
                    <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl font-semibold bioColorata">
                      Brani:
                    </p>
                    <div className="w-[90%] max-h-40 sm:max-h-50 lg:max-h-30 overflow-auto">
                      {match.user?.brani &&
                        match.user?.brani?.map((brano) => {
                          return (
                            <div
                              key={brano.id}
                              className="py-1 shadow flex items-center justify-between rounded-lg"
                            >
                              <div className="flex items-center w-[80%]">
                                <img
                                  src={brano?.img}
                                  alt="cover canzone"
                                  className="rounded-full h-10 w-10 lg:h-12.5 lg:w-12.5 mr-3 object-cover"
                                />
                                <div>
                                  <p className="font-semibold w-[100%] xl:text-lg 2xl:text-lg">
                                    {brano?.titolo}
                                  </p>
                                  <p className="text-sm text-gray-600 xl:text-base">
                                    {brano?.artista}
                                  </p>
                                </div>
                              </div>
                              <button
                                className="cursor-pointer"
                                onClick={() =>
                                  handleSongClick(brano?.titolo, brano?.artista)
                                }
                              >
                                {isPlaying &&
                                nowPlaying?.title === brano.titolo ? (
                                  // Icona Pause se il brano è in riproduzione
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
                                ) : (
                                  // Icona Play se il brano non è in riproduzione
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="#ad42ff"
                                    className="bi bi-play-circle-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="mt-4 text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl mb-2 font-semibold bioColorata">
                      Generi:
                    </p>
                    <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-2 w-[80%] h-12">
                      {match.user?.generi &&
                        match.user?.generi?.map((genere) => {
                          return (
                            <Badge
                              key={genere.id}
                              className={`rounded-xl text-xs sm:text-sm xl:text-base 2xl:text-lg lg:rounded-full ${
                                match.compatibility.details.commonGenres?.includes(
                                  genere.nome?.toLowerCase()
                                )
                                  ? "badginiMatch"
                                  : "badgini"
                              }`}
                            >
                              {genere.nome}
                            </Badge>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-evenly pt-10 pb-8">
                  {checkIfRequestSent(match.user?.id) ? (
                    <button
                      onMouseEnter={() => handleMouseEnter(match.user?.id)}
                      onMouseLeave={() => handleMouseLeave(match.user?.id)}
                      className="bg-[#7112b7] px-9 py-2 rounded-xl hover:bg-red-700 transition-colors sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer"
                      onClick={() => dispatch(deleteRichiesta(match.user?.id))}
                    >
                      {hoverStates[match.user?.id]
                        ? "Annulla richiesta"
                        : "Richiesta inviata"}
                    </button>
                  ) : richiesteRicevute?.some(
                      (req) => req.sender.id === match.user?.id
                    ) ? (
                    <button
                      className="bg-[#7112b7] px-9 py-2 rounded-xl transition-colors sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl"
                      disabled={true}
                    >
                      Da accettare
                    </button>
                  ) : (
                    <button
                      className="bg-[#ad42ff] px-9 py-2 rounded-xl hover:bg-[#7112b7] transition-colors sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer"
                      onClick={() => {
                        dispatch(postRichiesta(match.user?.id));
                      }}
                    >
                      Connetti
                    </button>
                  )}
                  <button
                    className="flex items-center justify-center cursor-pointer hover:bg-[#7112b7]/30 transition-all px-9 rounded-xl"
                    onClick={() => navigate(`/dettagli/${match.user?.id}`)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="me-2 bi bi-info-circle"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    info
                  </button>
                </div>
              </Card>
            ))}
            {page * itemsPerPage < filteredMatches.length && (
              <button onClick={() => setPage((p) => p + 1)}>
                Carica altro
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-lg font-extrabold">
            Nessun match disponibile.
          </p>
        )}
      </div>
    </div>
  );
};

export default Connessioni;
