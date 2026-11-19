import { DEEZER_PROXY_URL } from "../config";
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout.jsx";
import SearchPicker from "./SearchPicker.jsx";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUtenteLoggato } from "../redux/actions/account.js";
import {
  deleteArtista,
  getArtisti,
  postArtisti,
} from "../redux/actions/artisti.js";
import BondSpinner from "./BondSpinner.jsx";

const Artisti = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.account.userLogged);
  const dispatch = useDispatch();
  const artistiPreferiti = useSelector((state) => state.artisti.artisti);

  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getArtisti());
  }, []);

  const placeholders = [
    "Bruno Mars",
    "Michael Jackson",
    "Billie Eilish",
    "Tiziano Ferro",
    "Pinguini Tattici Nucleari",
  ];

  const getArtist = async (query) => {
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
          const newResults = data.data.map((artist) => ({
            name: artist.artist?.name || "Sconosciuto",
            image: artist.album?.cover_xl || null,
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

  const uniqueArtists = searchResults.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.name === value.name)
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    getArtist(value);
    setError("");
  };

  const handleSelectArtist = (artist) => {
    if (!artists.some((s) => s.name === artist.name)) {
      setArtists((prev) => [...prev, artist]);
    }
    setSearch("");
    setSearchResults([]);
  };

  const handleRemoveArtist = (artist) => {
    setArtists((prev) => prev.filter((item) => item !== artist));
  };

  const handleNavigate = async () => {
    if (artists.length < 1) {
      setError("Devi selezionare almeno un artista!");
      return;
    }
    if (artists.length > 5) {
      setError("Puoi selezionare al massimo 5 artisti.");
      return;
    }
    setIsLoading(true);
    try {
      if (artistiPreferiti.length > 0) {
        await Promise.all(
          artistiPreferiti.map((artista) =>
            dispatch(deleteArtista(artista.nome))
          )
        );
      }

      await Promise.all(
        artists.map((artist) =>
          dispatch(postArtisti(artist.name, artist.image))
        )
      );
      setIsLoading(false), navigate("/brani");
    } catch (err) {
      console.error("Errore nella navigazione:", err);
    }
  };

  if (isLoading) return <BondSpinner label="Salvataggio degli artisti" />;

  return (
    <OnboardingLayout
      step={2}
      name={user?.nome}
      title="Chi non salti"
      accent="mai?"
      intro="Cerca fino a 5 artisti. Gli artisti in comune pesano più dei generi nel calcolo dell'affinità."
      count={artists.length}
      max={5}
      error={error}
      onNext={handleNavigate}
    >
      <SearchPicker
        label="Cerca un artista"
        placeholder={`Prova con ${placeholders[0]}`}
        value={search}
        onChange={handleSearchChange}
        results={uniqueArtists}
        onPick={handleSelectArtist}
        renderItem={(artist) => (
          <>
            {artist.image && <img src={artist.image} alt="" className="size-10 rounded-lg object-cover" />}
            <span className="truncate">{artist.name}</span>
          </>
        )}
      />
      {artists.length > 0 && (
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {artists.map((item) => (
            <li key={item.name} className="surface flex items-center gap-3 p-2 pr-3">
              {item.image && <img src={item.image} alt="" className="size-12 rounded-xl object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-sm text-subtle">Artista</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveArtist(item)}
                aria-label={`Rimuovi ${item.name}`}
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

export default Artisti;
