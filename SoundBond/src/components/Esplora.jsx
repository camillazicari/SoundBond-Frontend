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
  const [match, setMatch] = useState([]);

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
        const giornoDellAnno = Math.floor(
          (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
        );

        const results = await Promise.all(
          generiId.map(async (id) => {
            const res = await fetch(
              `http://localhost:5002/api/artists?genre_id=${id}`
            );
            if (!res.ok) throw new Error(`Errore artisti genre_id: ${id}`);
            const data = await res.json();
            const allArtists = data.data || [];

            if (allArtists.length === 0) return [];

            // Numero di gruppi distinti possibili
            const groupsCount = Math.ceil(allArtists.length / 3);

            // Seleziona il gruppo del giorno in modo circolare
            const groupIndex = giornoDellAnno % groupsCount;
            const startIdx = groupIndex * 3;
            let artists = allArtists.slice(startIdx, startIdx + 5);

            // Se siamo alla fine dell'array e ne mancano, prendi i primi per completare
            if (artists.length < 3 && allArtists.length > 3) {
              const remaining = 3 - artists.length;
              artists = [...artists, ...allArtists.slice(0, remaining)];
            }
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
                    return (
                      <Dialog key={genere?.id}>
                        <DialogTrigger
                          className="my-2 place-items-center cursor-pointer"
                          onClick={() => setSelectedIndex(id)}
                        >
                          <div>
                            <img
                              src={`/src/assets/PLAYLISTS/P${id + 1}.jpeg`}
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
                          className="grid grid-cols-1 p-2"
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
                          <div className="h-140 overflow-auto">
                            {songs[selectedIndex]?.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2 ">
                                {songs[selectedIndex]?.map((song, j) => (
                                  <div
                                    key={j}
                                    className="py-1.5 shadow flex items-center justify-between hoverBrani rounded-lg px-3 cursor-pointer"
                                    onClick={() =>
                                      handleSongSelect(
                                        song,
                                        j,
                                        songs[selectedIndex]
                                      )
                                    }
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
                                    <button
                                      onClick={() =>
                                        handleSongSelect(
                                          song,
                                          j,
                                          songs[selectedIndex]
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      {nowPlaying?.id === song?.id ? (
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
                              <p>Nessun brano disponibile.</p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
              </div>
            </>
          ) : (
            <div>
              <p className="text-center text-lg">
                Wow che gusti ricercati... persino l'algoritmo si è arreso.
              </p>
              <p className="text-center">
                Prova ad aggiungere altri generi nelle impostazioni.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Esplora;
