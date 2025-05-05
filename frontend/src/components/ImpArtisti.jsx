/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "./personalizedComponents/Dialog";
import { ScrollArea } from "./personalizedComponents/ScrollArea";
import { Card } from "./personalizedComponents/Card";
import { Input } from "./personalizedComponents/Input";
import { Trash2, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteArtista,
  getArtisti,
  postArtisti,
} from "../redux/actions/artisti.js";
import BondSpinner from "./BondSpinner";

const ImpArtisti = () => {
  const dispatch = useDispatch();
  const [artists, setArtists] = useState([]);
  const artisti = useSelector((state) => state.artisti.artisti);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const uniqueArtists = searchResults.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.name === value.name)
  );

  useEffect(() => {
    dispatch(getArtisti());
    setArtists(artisti);
  }, []);

  useEffect(() => {
    setArtists(artisti);
  }, [artisti]);

  const getArtist = async (query) => {
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    getArtist(value);
  };

  const handleSelectArtist = (artist) => {
    if (artists.length < 5) {
      if (!artists.some((s) => s.name === artist.name)) {
        setArtists((prev) => [...prev, artist]);
        dispatch(postArtisti(artist.name, artist.image));
        toast(
          <p className=" flex items-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-check"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>{" "}
            &nbsp; Artista aggiunto dai preferiti!
          </p>,
          {
            style: {
              background: "rgb(7, 176, 7)",
              border: "none",
            },
          }
        );
        setSearch("");
        setSearchResults([]);
      }
    } else {
      toast(
        <p className="flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="currentColor"
            class="bi bi-exclamation-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>{" "}
          &nbsp; Puoi selezionare al massimo 5 artisti!
        </p>,
        {
          style: {
            background: "rgb(255, 0, 0)",
            border: "none",
          },
        }
      );
    }
  };

  const handleRemoveArtist = (artist) => {
    if (artists.length > 1) {
      setArtists((prev) => prev.filter((item) => item !== artist));
      dispatch(deleteArtista(artist.nome));
      toast(
        <p className=" flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-check"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>{" "}
          &nbsp; Artista rimosso dai preferiti!
        </p>,
        {
          style: {
            background: "rgb(7, 176, 7)",
            border: "none",
          },
        }
      );
    } else {
      toast(
        <p className="flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="currentColor"
            class="bi bi-exclamation-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>{" "}
          &nbsp; Devi avere almeno 1 artista preferito!
        </p>,
        {
          style: {
            background: "rgb(255, 0, 0)",
            border: "none",
          },
        }
      );
    }
  };
  return (
    <Card className="p-6 backdrop-blur-lg bg-[#3f006f]/30 border border-[#9b1fff]/50 rounded-xl shadow-lg">
      {artisti.length > 0 ? (
        <>
          {" "}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#c476ff]">
              I tuoi artisti preferiti
            </h3>
            <Dialog
              onOpenChange={(open) => {
                if (!open) {
                  setSearch("");
                  setSearchResults([]);
                }
              }}
            >
              <DialogTrigger asChild>
                <button className="bg-[#ad42ff] hover:bg-[#9b1fff] transition-colors py-1.5 px-4 rounded-md flex items-center">
                  <Plus size={18} className="mr-2" /> Aggiungi
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#3f006f]/30 border border-[#7112b7]/50">
                <DialogHeader>
                  <DialogTitle className="text-[#f7ebfc]">
                    Aggiungi un artista preferito
                  </DialogTitle>
                  <DialogDescription className="text-[#efd6f8]">
                    Inserisci il nome dell'artista che vuoi aggiungere.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <label className="text-sm text-[#c476ff]">Nome artista</label>
                  <Input
                    onChange={handleSearchChange}
                    onSubmit={() => {}}
                    value={search}
                    className="bg-[#7112b7]/30 border-[#3f006f] focus:border-[#ad42ff]"
                  />
                  <DialogClose>
                    {searchResults.length > 0 && (
                      <ul className="bg-[#170228]  shadow-lg rounded-lg mt-2 w-[99%] max-h-60 overflow-y-auto absolute left-0.5 top-38 z-50">
                        {" "}
                        {uniqueArtists.map((artist, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-[#7112b7]/30 cursor-pointer flex items-center"
                            onClick={() => handleSelectArtist(artist)}
                          >
                            {artist.image && (
                              <img
                                src={artist.image}
                                alt="immagine"
                                className="h-8 w-8 rounded-lg mr-2"
                              />
                            )}
                            {artist.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="pr-4">
            {artisti.length > 0 ? (
              <div className="space-y-2">
                {artisti.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#3f006f]/30 border border-[#7112b7]/50 hover:bg-[#7112B7]/30 transition-colors"
                  >
                    <span className="font-medium text-[#fbf5fe] flex items-center">
                      {artist.img ? (
                        <img
                          src={artist.img}
                          alt="cover"
                          className="rounded-lg h-10 w-10 lg:h-12.5 lg:w-12.5 mr-3 object-cover"
                        />
                      ) : (
                        <p></p>
                      )}{" "}
                      {artist.nome}
                    </span>
                    <button
                      onClick={() => handleRemoveArtist(artist)}
                      size="icon"
                      variant="ghost"
                      className="hover:bg-[#9b1fff]/20 text-[#f7ebfc]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[#efd6f8] italic">
                  Non hai ancora aggiunto artisti preferiti
                </p>
              </div>
            )}
          </ScrollArea>{" "}
        </>
      ) : (
        <BondSpinner />
      )}
    </Card>
  );
};

export default ImpArtisti;
