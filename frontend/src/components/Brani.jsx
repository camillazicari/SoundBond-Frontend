/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { BackgroundBeamsWithCollision } from "./personalizedComponents/BgBeams";
import { SearchAnimata } from "./SearchAnimata.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUtenteLoggato } from "../redux/actions/account.js";
import { deleteBrano, getBrani, postBrani } from "../redux/actions/brani.js";
import BondSpinner from "./BondSpinner.jsx";
import { postProfilo } from "../redux/actions/profilo.js";

const Brani = () => {
  const user = useSelector((state) => state.account.userLogged);
  const dispatch = useDispatch();
  const brani = useSelector((state) => state.brani.brani);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getBrani());
  }, []);

  const [error, setError] = useState("");

  const placeholders = [
    "All I Want",
    "My heart will go on",
    "Locked out of Heaven",
    "Amarena",
    "Sere nere",
  ];

  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getSongs = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const url = `http://localhost:5002/api/search?q=${query}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        if (data.data) {
          const newResults = data.data.map((song) => ({
            name: song.artist?.name || "Sconosciuto",
            title: song.title || "Senza titolo",
            image: song.artist?.picture_xl || null,
          }));
          setSearchResults(newResults);
        }
      } else {
        throw new Error("Errore nel recupero dei dati");
      }
    } catch (error) {
      console.log("errore", error);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    getSongs(value);
    setError("");
  };

  const handleSelectSong = (song) => {
    if (!songs.some((s) => s.title === song.title)) {
      setSongs((prev) => [...prev, song]);
    }
    setSearch("");
    setSearchResults([]);
  };

  const handleRemoveSong = (song) => {
    setSongs((prev) => prev.filter((item) => item !== song));
  };

  const handleNavigate = async () => {
    if (songs.length < 1) {
      setError("Devi selezionare almeno un brano!");
      return;
    }
    if (songs.length > 5) {
      setError("Puoi selezionare al massimo 5 brani.");
      return;
    }
    setIsLoading(true);
    try {
      if (brani.length > 0) {
        await Promise.all(
          brani.map((brano) =>
            dispatch(deleteBrano(brano.titolo, brano.artista))
          )
        );
      }

      await Promise.all(
        songs.map((song) =>
          dispatch(postBrani(song.title, song.name, song.image))
        ),
        dispatch(postProfilo())
      );
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      console.error("Errore nella navigazione:", err);
    }
  };

  return (
    <BackgroundBeamsWithCollision>
      <div
        className="flex flex-col justify-around fade-in"
        style={{ width: "100%", height: "100%" }}
      >
        {isLoading && <BondSpinner />}
        {!isLoading && (
          <>
            <div className="flex flex-col items-center mt-4 relative">
              {user && (
                <h2 className="text-xl z-20 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-center tracking-tight">
                  {user.nome}, benvenut* nella{" "}
                  <span style={{ color: "#9b1fff" }}>bonders</span> community.
                  <div className="bg-clip-text text-transparent bg-no-repeat">
                    <span className="">Conosciamoci meglio...</span>
                  </div>{" "}
                  <br />
                </h2>
              )}
              <br />
              <div className="relative w-full max-w-md">
                <SearchAnimata
                  text="Quali sono i tuoi brani preferiti?"
                  placeholders={placeholders}
                  onChange={handleSearchChange}
                  onSubmit={() => {}}
                  search={search}
                />
                {searchResults.length > 0 && (
                  <ul className="bg-zinc-800 shadow-lg rounded-lg mt-2 w-full max-h-60 overflow-y-auto absolute left-0 z-50">
                    {searchResults.map((song, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-zinc-500 cursor-pointer flex items-center"
                        onClick={() => handleSelectSong(song)}
                      >
                        {song.image && (
                          <img
                            src={song.image}
                            alt="cover"
                            className="h-8 w-8 rounded-lg mr-2 object-cover"
                          />
                        )}
                        {song.title} - {song.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {error && (
                <p className="text-sm text-center mt-1 Errors">{error}</p>
              )}
            </div>
            <div>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {songs.map((song, index) => (
                  <li
                    key={index}
                    className="m-3 py-1.5 px-3 rounded-4xl text-xs lg:text-base text-center cursor-pointer flex items-center justify-between"
                    style={{ border: "0.5px solid #9b1fff" }}
                    onClick={() => handleRemoveSong(song)}
                  >
                    {song.image ? (
                      <img
                        src={song.image}
                        alt="cover"
                        className="rounded-4xl h-10 w-10 lg:h-12.5 lg:w-12.5 object-cover"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    {song.title} - {song.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      fill="#9b1fff"
                      className="bi bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end w-[100%]">
              <button
                className="text-center w-48 rounded-2xl h-14 relative text-xl font-semibold group"
                type="button"
                onClick={() => {
                  handleNavigate();
                }}
              >
                <div
                  className="rounded-lg ms-5 sm:ms-0 sm:rounded-xl h-8 w-1/6 sm:h-10 sm:w-1/5 lg:w-1/4 lg:h-12 flex items-center justify-center absolute top-[4px] group-hover:w-[140px] sm:group-hover:w-[170px] lg:group-hover:w-[184px] z-10 duration-500"
                  style={{
                    backgroundColor: "#9b1fff",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-arrow-right-short"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                    />
                  </svg>
                </div>
                <p className="lg:translate-x-2 text-base pb-3.5 sm:text-xl lg-text-2xl sm:pb-1.5 lg:pb-0">
                  Completa
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Brani;
