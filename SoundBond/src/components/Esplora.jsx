/* eslint-disable react-hooks/exhaustive-deps */
import { getGeneri } from "../redux/actions/generi.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Esplora = () => {
  const dispatch = useDispatch();
  const generi = useSelector((state) => state.generi.generi);
  const [genres, setGenres] = useState([]);
  const [generiId, setGeneriId] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);

  const covers = []

  // Al mount
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

  // Match dei generi
  useEffect(() => {
    const ids = generi
      .map((genere) => {
        const match = genres?.find((g) =>
          g.name.toLowerCase().includes(genere.nome.toLowerCase())
        );
        if (!match) console.log(`Nessuna corrispondenza per: ${genere.nome}`);
        return match?.id;
      })
      .filter(Boolean);

    setGeneriId(ids);
  }, [genres, generi]);

  // Recupero artisti
  useEffect(() => {
    if (generiId.length === 0) return;

    const fetchArtists = async () => {
      try {
        const giornoCorrente = new Date().getDate() - 1;
        const step = 6;
        const start = giornoCorrente * step;
        const end = start + 5;

        const results = await Promise.all(
          generiId?.map(async (id) => {
            const res = await fetch(
              `http://localhost:5002/api/artists?genre_id=${id}`
            );
            if (!res.ok) throw new Error(`Errore artisti genre_id: ${id}`);
            const data = await res.json();

            const artists =
              data.data.length >= end
                ? data.data.slice(start, end)
                : data.data.slice(0, 5);

            return artists;
          })
        );

        const artistsFlat = results.flat();

        // Divido artisti in gruppi di 5
        const chunked = [];
        for (let i = 0; i < artistsFlat.length; i += 5) {
          chunked.push(artistsFlat.slice(i, i + 5));
        }

        setArtists(chunked);
      } catch (err) {
        console.error("Errore artisti:", err);
      }
    };

    fetchArtists();
  }, [generiId]);

  // Recupero canzoni
  useEffect(() => {
    if (artists.length === 0) return;

    const fetchSongs = async () => {
      try {
        const results = await Promise.all(
          artists?.map(async (group) => {
            const songsInGroup = await Promise.all(
              group.map(async (artist) => {
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

        // Log brani per ogni gruppo
        // results.forEach((gruppo, index) => {
        //   console.log(`GENERE ${index + 1} - brani:`, gruppo);
        // });
      } catch (err) {
        console.error("Errore canzoni:", err);
      }
    };

    fetchSongs();
  }, [artists]);

  console.log(songs);

  return (
    <div className="container mx-auto">
      {/* {songs &&
        songs?.map((group, i) => (
          <div key={i} className="mb-4">
            <h2 className="text-xl font-bold">Gruppo {i + 1}</h2>
            <div className="grid grid-cols-2 gap-4 mt-2 lg:hidden">
              {group.map((song, j) => (
                <div key={j} className="p-2 border rounded shadow">
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-600">{song.artist.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))} */}
    </div>
  );
};

export default Esplora;
