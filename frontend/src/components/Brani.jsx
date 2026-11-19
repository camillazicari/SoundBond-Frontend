import { DEEZER_PROXY_URL } from "../config";
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import OnboardingLayout from "./OnboardingLayout.jsx";
import SearchPicker from "./SearchPicker.jsx";
import { X } from "lucide-react";
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

    const url = `${DEEZER_PROXY_URL}/api/search?q=${query}`;
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

  if (isLoading) return <BondSpinner label="Salvataggio dei brani" />;

  return (
    <OnboardingLayout
      step={3}
      name={user?.nome}
      title="La tua"
      accent="colonna sonora."
      intro="Aggiungi fino a 5 brani. Saranno ascoltabili dal tuo profilo e da chi ti trova."
      count={songs.length}
      max={5}
      error={error}
      cta="Completa il profilo"
      onNext={handleNavigate}
    >
      <SearchPicker
        label="Cerca un brano"
        placeholder={`Prova con ${placeholders[0]}`}
        value={search}
        onChange={handleSearchChange}
        results={searchResults}
        onPick={handleSelectSong}
        renderItem={(song) => (
          <>
            {song.image && <img src={song.image} alt="" className="size-10 rounded-lg object-cover" />}
            <span className="min-w-0 truncate">
              {song.title} <span className="text-muted">· {song.name}</span>
            </span>
          </>
        )}
      />
      {songs.length > 0 && (
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {songs.map((item) => (
            <li key={`${item.title}-${item.name}`} className="surface flex items-center gap-3 p-2 pr-3">
              {item.image && <img src={item.image} alt="" className="size-12 rounded-xl object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                <p className="truncate text-sm text-muted">{item.name}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSong(item)}
                aria-label={`Rimuovi ${item.title}`}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.08] hover:text-fg"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </OnboardingLayout>
  );
};

export default Brani;
