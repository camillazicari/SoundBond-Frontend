/* eslint-disable react-hooks/exhaustive-deps */
import { getUtenti } from "../redux/actions/account.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BondSpinner from "./BondSpinner";
import { usePlayer } from "../context/PlayerContext";
import { deleteBonder, getBonders } from "../redux/actions/bonders";

const Dettagli = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.account.users);
  const bonders = useSelector((state) => state.bonders.bonders);
  const isBonder = bonders.find((u) => u.otherUser.id === id);
  const [isHover, setIsHover] = useState(false);
  const user = users.find((u) => u.id === id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUtenti());
    dispatch(getBonders());
  }, []);

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

  return user && user?.nome ? (
    <div className="p-6 md:p-8 max-w-screen-2xl mx-auto fade-in">
      {" "}
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <div className="w-34 h-34 rounded-full flex items-center justify-center overflow-hidden mb-4 md:mb-0 md:mr-6">
              {user?.profilo ? (
                <img
                  src={
                    user?.profilo?.immagine.startsWith("http")
                      ? user?.profilo?.immagine
                      : `http://192.168.1.63:5220${user?.profilo?.immagine}`
                  }
                  alt={user?.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-semibold">
                  {user?.nome?.charAt(0) || "U"}
                </span>
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {user?.nome}
              </h1>
              <p className="bioColorata mb-2">@{user?.nomeUtente}</p>
              <p className="bioColorata mb-2">{user?.profilo?.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                {user?.generi?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 badgini rounded-full text-xs"
                  >
                    {genre.nome}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {isBonder && (
            <button
              className={`md:ml-auto flex justify-center items-center p-2 md:p-4 rounded-full ${
                isHover ? "bg-red-700" : "buttonGradient2"
              }`}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={() => dispatch(deleteBonder(user?.id))}
            >
              {isHover ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-person-x me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708" />
                  </svg>
                  <p>Elimina</p>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-person-check me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                  </svg>
                  <p>Bonder</p>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="p-6 md:p-2 lg:p-5">
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl font-semibold bioColorata mb-2">
                Artisti preferiti
              </p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 place-items-center justify-center">
                {user?.artisti?.map((artist) => (
                  <div
                    key={artist?.id}
                    className="bg-gradient-to-br from-[#1e0a23] to-[#5d1093] rounded-lg overflow-hidden group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center">
                      {artist?.img ? (
                        <img
                          src={artist?.img}
                          alt={artist?.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 18V5l12-2v13"></path>
                          <circle cx="6" cy="18" r="3"></circle>
                          <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                      )}
                    </div>
                    <div className="p-3 flex justify-center">
                      <h4 className="font-medium text-[11px] sm:text-[13px] md:text-[13px] lg:text-[15px] 2xl:text-lg 2xl:leading-tight text-center mt-1 h-7 overflow-auto">
                        {artist?.nome}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl font-semibold bioColorata text-center mb-2">
                Brani preferiti
              </p>
              <div className="space-y-2">
                {user?.brani?.map((track) => (
                  <div
                    key={track?.id}
                    className="flex items-center p-3 rounded-lg bg-black/30 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden mr-3">
                      <img
                        src={track?.img || "/placeholder.svg"}
                        alt={track?.titolo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium md:text-lg">
                        {track?.titolo}
                      </div>
                      <div className="text-xs text-gray-600">
                        {track?.artista}
                      </div>
                    </div>
                    <button
                      className="cursor-pointer ml-auto"
                      onClick={() =>
                        handleSongClick(track?.titolo, track?.artista)
                      }
                    >
                      {isPlaying && nowPlaying?.title === track.titolo ? (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <BondSpinner />
  );
};

export default Dettagli;
