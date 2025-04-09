/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../animations/Dialog";
import { getGeneri } from "../redux/actions/generi.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BondSpinner from "./BondSpinner.jsx";
import { usePlayer } from "../context/PlayerContext";

const Esplora = () => {
  const dispatch = useDispatch();
  const generi = useSelector((state) => state.generi.generi);
  const [genres, setGenres] = useState([]);
  const [generiId, setGeneriId] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [match, setMatch] = useState([]);
  const [dailyCovers, setDailyCovers] = useState([]);
  const covers = [
    { id: 1, img: "/src/assets/PLAYLISTS/P1.jpeg" },
    { id: 2, img: "/src/assets/PLAYLISTS/P2.jpeg" },
    { id: 3, img: "/src/assets/PLAYLISTS/P3.jpeg" },
    { id: 4, img: "/src/assets/PLAYLISTS/P4.jpeg" },
    { id: 5, img: "/src/assets/PLAYLISTS/P5.jpeg" },
    { id: 6, img: "/src/assets/PLAYLISTS/P6.jpeg" },
    { id: 7, img: "/src/assets/PLAYLISTS/P7.jpeg" },
    { id: 8, img: "/src/assets/PLAYLISTS/P8.jpeg" },
    { id: 9, img: "/src/assets/PLAYLISTS/P9.jpeg" },
    { id: 10, img: "/src/assets/PLAYLISTS/P10.jpeg" },
  ];

  // Funzione semplice per generare un numero casuale basato sul seed
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Funzione per mescolare un array con un seed dato
  function shuffleArray(array, seed) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      // Usa il seed combinato con l'indice per ottenere vari valori casuali
      const randomValue = seededRandom(seed + i);
      const j = Math.floor(randomValue * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  useEffect(() => {
    // Crea un seed basato sulla data nel formato YYYYMMDD
    const today = new Date();
    const seed =
      parseInt(
        `${today.getFullYear()}${("0" + (today.getMonth() + 1)).slice(-2)}${(
          "0" + today.getDate()
        ).slice(-2)}`
      ) || new Date().getTime(); // fallback
    const shuffled = shuffleArray(covers, seed);
    setDailyCovers(shuffled);
  }, []);

  // Dal contesto, ora abbiamo anche la possibilità di impostare la playlist corrente e l'indice della traccia selezionata
  const { nowPlaying, setNowPlaying, setPlaylist, setCurrentIndex, setAudio } =
    usePlayer();

  useEffect(() => {
    dispatch(getGeneri());
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/genres");
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
        if (!found) console.log(`Nessuna corrispondenza per: ${genere.nome}`);
        return found;
      })
      .filter(Boolean);

    setMatch(matches);
    setGeneriId(matches.map((m) => m.id));
  }, [genres, generi]);

  useEffect(() => {
    if (generiId.length === 0) return;
    const fetchArtists = async () => {
      try {
        const giornoCorrente = new Date().getDate() - 1;
        const step = 6;
        const start = giornoCorrente * step;
        const end = start + 5;
        const results = await Promise.all(
          generiId.map(async (id) => {
            const res = await fetch(
              `http://localhost:5002/api/artists?genre_id=${id}`
            );
            if (!res.ok) throw new Error(`Errore artisti genre_id: ${id}`);
            const data = await res.json();
            const artists =
              data.data?.length >= end
                ? data.data?.slice(start, end)
                : data.data?.slice(0, 5);
            return artists;
          })
        );
        setArtists(results);
      } catch (err) {
        console.error("Errore artisti:", err);
      }
    };
    fetchArtists();
  }, [generiId]);

  useEffect(() => {
    if (artists.length === 0) return;
    const fetchSongs = async () => {
      try {
        const results = await Promise.all(
          artists?.map(async (group) => {
            const songsInGroup = await Promise.all(
              group?.map(async (artist) => {
                const res = await fetch(
                  `http://localhost:5002/api/songs?artist_id=${artist.id}`
                );
                if (!res.ok)
                  throw new Error(`Errore canzoni artist_id: ${artist.id}`);
                const data = await res.json();
                return data.data;
              })
            );
            return songsInGroup.flat();
          })
        );
        setSongs(results);
      } catch (err) {
        console.error("Errore canzoni:", err);
      }
    };
    fetchSongs();
  }, [artists]);

  useEffect(() => {
    if (selectedIndex !== null && songs[selectedIndex]?.length > 0) {
      const shuffled = [...songs[selectedIndex]]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      setShuffledSongs(shuffled);
    }
  }, [songs, selectedIndex]);

  // Funzione che imposta la traccia corrente, la playlist e l'indice del brano
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

  return (
    <div className="container mx-auto">
      {generi.length < 1 ? (
        <BondSpinner />
      ) : (
        <div className="fade-in">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-center mt-2 mb-1"
            style={{
              backgroundImage: "linear-gradient(to right, #e4b5f2, #a43bbe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Playlist pensate per te
          </h1>
          {match.length > 0 ? (
            <>
              <p className="text-center mb-2 text-base lg:text-lg leading-4">
                Ogni giorno nuove anteprime di brani dei tuoi generi preferiti,
                da scoprire e amare!
              </p>
              <div className="mx-auto grid grid-cols-2 md:grid-cols-3">
                {match &&
                  match?.map((genere, id) => {
                    const cover = dailyCovers[id];
                    return (
                      <Dialog key={genere?.id}>
                        <DialogTrigger
                          className="my-2 place-items-center"
                          onClick={() => setSelectedIndex(id)}
                        >
                          <div>
                            <img
                              src={cover.img}
                              alt="cover"
                              className="w-50 sm:w-60 lg:w-75 xl:w-90 object-cover rounded-2xl"
                            />
                            <p className="my-2 md:text-md lg:text-lg font-bold text-[#e4b5f2]">
                              Il meglio di "{genere?.name}"
                            </p>
                          </div>
                        </DialogTrigger>
                        <DialogContent
                          aria-label={`Playlist ${genere?.name}`}
                          className="grid grid-cols-1 rounded-lg p-2"
                          style={{
                            borderColor: "rgba(184, 73, 214, 0.5)",
                            backgroundColor: "rgba(12, 5, 18, 0.5)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <DialogTitle></DialogTitle>
                          <DialogDescription className="text-lg font-bold text-center text-[#b849d6]">
                            Il meglio di "{genere?.name}"
                          </DialogDescription>
                          {songs[selectedIndex]?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 ">
                              {shuffledSongs?.map((song, j) => (
                                <div
                                  key={j}
                                  className="py-1.5 shadow flex items-center justify-between hoverBrani rounded-lg px-3"
                                >
                                  <div className="flex items-center w-[80%]">
                                    <p className="w-[30px]">{j + 1}.</p>
                                    <img
                                      src={song?.album?.cover_big}
                                      alt="cover canzone"
                                      className="rounded-lg h-10 w-10 lg:h-12.5 lg:w-12.5 mr-3 object-cover"
                                    />
                                    <div>
                                      <p className="font-semibold w-[100%]">
                                        {song?.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {song?.artist?.name}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Il bottone triggera il cambio di traccia */}
                                  <button
                                    onClick={() =>
                                      handleSongSelect(song, j, shuffledSongs)
                                    }
                                    className="cursor-pointer"
                                  >
                                    {nowPlaying?.id === song.id ? (
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
                                        fill="#b849d6"
                                        className="bi bi-play-circle-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-white">
                              Nessun brano disponibile.
                            </p>
                          )}
                        </DialogContent>
                      </Dialog>
                    );
                  })}
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-lg">
                Wow, che gusti ricercati… persino l’algoritmo si è arreso.
              </p>
              <p className="text-center">Riprova aggiungendo altri generi!</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Esplora;
