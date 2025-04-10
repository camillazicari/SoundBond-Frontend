/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useGetUserMatches } from "./data/matchMaking.js";
import { useDispatch, useSelector } from "react-redux";
import { getUtenteLoggato, getUtenti } from "@/redux/actions/account.js";
import { Card } from "../../animations/Card";
import BondSpinner from "./BondSpinner.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../animations/Avatar";
import Badge from "../../animations/Badge";
import { usePlayer } from "../context/PlayerContext";

const Connessioni = () => {
  const user = useSelector((state) => state.account.userLogged);
  const matches = useGetUserMatches();
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
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
          console.log(firstSong);
          setNowPlaying(firstSong);
          setIsPlaying(true);

          const newAudio = new Audio(firstSong.preview);

          setAudio(newAudio);

          newAudio.addEventListener("ended", () => {
            setIsPlaying(false);
            setNowPlaying(null);
            console.log("fine brano!");
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

  console.log(matches);

  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getUtenti());
  }, []);

  const getFilteredMatches = () => {
    if (!matches || matches.length === 0) return [];

    let filtered = [];
    if (filter === "all") {
      filtered = matches;
    } else if (filter === "high") {
      filtered = matches.filter((match) => match.compatibility.score >= 70);
    } else if (filter === "medium") {
      filtered = matches.filter(
        (match) =>
          match.compatibility.score >= 40 && match.compatibility.score < 70
      );
    } else if (filter === "low") {
      filtered = matches.filter((match) => match.compatibility.score < 40);
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

  if (!matches || matches.length === 0) {
    return <BondSpinner />;
  }

  return (
    <div className="fade-in container mx-auto grid grid-cols-1 gap-y-6">
      <Card className="px-6 py-10 backdrop-blur-lg mx-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg grid grid-cols-1 gap-5 items-center">
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
                ? "buttonGradient"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match basso (&lt;40%)
          </button>
        </div>
      </Card>
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
                  <stop stopColor="#b849d6" offset="100%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div>
        {filteredMatches && filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {filteredMatches.map((match) => (
              <Card
                key={match.user?.id}
                className="py-3 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg gap-5 items-center"
              >
                <div className="flex justify-between items-center p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-25 h-25 md:w-30 md:h-30 lg:w-25 lg:h-25 xl:h-25 xl:w-25 2xl:w-30 2xl:h-30 transition-all duration-300 group-hover:border-[#d489e9]">
                      <AvatarImage
                        src={match.user?.profilo?.immagine}
                        alt={match.user?.profilo?.nomeUtente}
                      />
                      <AvatarFallback className="bg-[#732880] text-2xl">
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
                  <div className="bg-[#b849d6] rounded-full h-15 w-15 flex justify-center items-center">
                    <p className=" font-bold">{match.compatibility?.score}%</p>
                  </div>
                </div>

                <div
                  className="relative z-10 flex flex-col"
                  ata-scroll-section="false"
                >
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl mb-2 font-semibold">
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
                                  ? "border-[#b849d6] border-3"
                                  : ""
                              }`}
                            >
                              <AvatarImage
                                src={artista.img}
                                alt={artista.nome}
                              />
                              <AvatarFallback className="bg-[#732880] text-2xl">
                                {artista.nome?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-[11px] sm:text-[13px] md:text-[15px] 2xl:text-lg 2xl:leading-tight text-center mt-1 h-10 sm:h-11 md:h-12 2xl:h-17 overflow-auto">
                              {artista.nome}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="mt-4 text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl font-semibold">
                      Brani:
                    </p>
                    <div className="w-[90%] max-h-40 sm:max-h-50 lg:max-h-30 overflow-auto">
                      {match.user?.brani &&
                        match.user?.brani?.map((brano) => {
                          return (
                            <div
                              key={brano.id}
                              className="py-1 px-3 shadow flex items-center justify-between hoverBrani rounded-lg"
                            >
                              <div className="flex items-center w-[80%]">
                                <img
                                  src={brano?.img}
                                  alt="cover canzone"
                                  className="rounded-lg h-10 w-10 lg:h-12.5 lg:w-12.5 mr-3 object-cover"
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
                                    fill="#b849d6"
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
                                    fill="#b849d6"
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
                    <p className="mt-4 text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl mb-2 font-semibold">
                      Generi:
                    </p>
                    <div className="grid grid-cols-5 place-items-center mx-1 gap-x-1 gap-y-2">
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

                <div className="flex justify-center pt-10">
                  <button className=" bg-[#b849d6] px-5 py-2 rounded-md hover:bg-[#732880] transition-colors sm:text-base md:text-lg lg:text-lg 2xl:text-2xl">
                    Connetti
                  </button>
                </div>
              </Card>
            ))}
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
