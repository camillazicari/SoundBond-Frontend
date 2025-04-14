/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGeneri } from "@/redux/actions/generi";

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

  useEffect(() => {
    dispatch(getGeneri());
    fetchGenres();
  }, [dispatch]);

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
                <p className="text-center my-2 md:text-md lg:text-lg font-bold text-[#e4b5f2]">
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
