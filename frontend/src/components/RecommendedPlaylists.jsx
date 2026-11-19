import { playlistCovers } from "../assets/playlistCovers";
import { DEEZER_PROXY_URL } from "../config";
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGeneri } from "../redux/actions/generi.js";

const RecommendedPlaylists = () => {
  const navigate = useNavigate();
  const generi = useSelector((state) => state.generi.generi);
  const [genres, setGenres] = useState([]);
  const [match, setMatch] = useState([]);
  const [shuffledCovers, setShuffledCovers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setShuffledCovers([...covers].sort(() => Math.random() - 0.5));
  }, []);

  const covers = [
    { id: 1, img: playlistCovers[0] },
    { id: 2, img: playlistCovers[1] },
    { id: 3, img: playlistCovers[2] },
    { id: 4, img: playlistCovers[3] },
    { id: 5, img: playlistCovers[4] },
    { id: 6, img: playlistCovers[5] },
    { id: 7, img: playlistCovers[6] },
    { id: 8, img: playlistCovers[7] },
    { id: 9, img: playlistCovers[8] },
    { id: 10, img: playlistCovers[9] },
  ];

  useEffect(() => {
    dispatch(getGeneri());
    fetchGenres();
  }, [dispatch]);

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
  }, [genres, generi]);

  if (!match.length) return null;

  return (
    <section className="mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="display text-4xl font-bold md:text-5xl">Da ascoltare</h2>
        <button type="button" onClick={() => navigate("/esplora")} className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-fg">
          Vedi tutti
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {match.map((genere, i) => (
          <li key={genere.id}>
            <button type="button" onClick={() => navigate("/esplora")} className="group block w-full cursor-pointer text-left">
              <div className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-line">
                <img
                  src={shuffledCovers[i % shuffledCovers.length]?.img}
                  alt=""
                  className="aspect-square w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-medium">{genere.name}</p>
              <p className="text-sm text-subtle">Playlist del giorno</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecommendedPlaylists;
