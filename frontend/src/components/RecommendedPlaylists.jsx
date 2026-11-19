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

  return (
    <div>
      <div className=" flex justify-between mx-4 xxl:mx-2 my-2">
        <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Le playlist che ti consigliamo
        </h2>
        <button
          className=" cursor-pointer"
          onClick={() => navigate("/esplora")}
        >
          Vedi tutti
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3">
        {match &&
          match?.map((genere, id) => {
            const shuff = shuffledCovers[id];
            return (
              <div
                className="m-3 xxl:mx-0 border-0 rounded-xl shadow-lg  gap-5 items-center cursor-pointer"
                key={genere?.id}
                onClick={() => navigate("/esplora")}
              >
                <img
                  src={shuff.img}
                  alt="cover"
                  className="w-[100%] h-60 md:h-70 lg:h-90 xl:h-110 object-cover rounded-2xl"
                />
                <p className="text-center my-2 md:text-md lg:text-lg font-bold text-[#daacff]">
                  {genere?.name}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RecommendedPlaylists;
