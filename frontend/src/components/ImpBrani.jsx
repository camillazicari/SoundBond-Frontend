import { DEEZER_PROXY_URL } from "../config";
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
import { Plus, Trash2 } from "lucide-react";
import { Input } from "./personalizedComponents/Input";
import { useDispatch, useSelector } from "react-redux";
import { getBrani, deleteBrano, postBrani } from "../redux/actions/brani.js";

const ImpBrani = () => {
  const dispatch = useDispatch();
  const brani = useSelector((state) => state.brani.brani);
  const [songs, setSongs] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    dispatch(getBrani());
    setSongs(brani);
  }, []);

  useEffect(() => {
    setSongs(brani);
  }, [brani]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    getSongs(value);
  };

  const handleSelectSong = (song) => {
    if (songs.length < 5) {
      if (!songs.some((s) => s.title === song.title)) {
        setSongs((prev) => [...prev, song]);
        dispatch(postBrani(song.title, song.name, song.image));
      }
      setSearch("");
      setSearchResults([]);
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
          &nbsp; Brano aggiunto ai preferiti!
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
          &nbsp; Puoi selezionare al massimo 5 brani!
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

  const handleRemoveSong = async (song) => {
    if (songs.length > 1) {
      try {
        dispatch(deleteBrano(song.titolo, song.artista));

        setSongs((prev) => prev.filter((item) => item.id !== song.id));

        toast(
          <p className="flex items-center text-white">
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
            &nbsp; Brano rimosso dai preferiti!
          </p>,
          {
            style: {
              background: "rgb(7, 176, 7)",
              border: "none",
            },
          }
        );
      } catch {
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
            &nbsp; Errore nella rimozione del brano!
          </p>,
          {
            style: {
              background: "rgb(255, 0, 0)",
              border: "none",
            },
          }
        );
      }
    } else {
      toast(
        <p className="flex items-center">
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
          &nbsp; Devi avere almeno 1 brano preferito!
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
    <Card className="surface p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="display text-3xl font-bold">
          I tuoi brani preferiti
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
            <button className="btn btn-primary">
              <Plus size={18} /> Aggiungi
            </button>
          </DialogTrigger>
          <DialogContent className="glass rounded-[var(--radius-card)] border-line">
            <DialogHeader>
              <DialogTitle className="text-fg">
                Aggiungi un brano preferito
              </DialogTitle>
              <DialogDescription className="text-fg">
                Inserisci il titolo del brano che vuoi aggiungere.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm">Titolo</label>
                <Input
                  onChange={handleSearchChange}
                  onSubmit={() => {}}
                  value={search}
                  className="h-11 rounded-xl border-line-strong bg-white/[0.03] focus:border-accent/70"
                />
              </div>
              <DialogClose>
                {searchResults.length > 0 && (
                  <ul className="glass rounded-2xl p-1.5 mt-2 w-[99%] max-h-60 overflow-y-auto absolute left-0.5 top-42 z-50">
                    {searchResults.map((song, index) => (
                      <li
                        key={index}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/[0.07]"
                        onClick={() => handleSelectSong(song)}
                      >
                        {song.image && (
                          <img
                            src={song.image}
                            alt="cover"
                            className="h-8 w-8 rounded-lg mr-2"
                          />
                        )}
                        {song.title} - {song.name}
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
        {brani.length > 0 ? (
          <div className="space-y-2">
            {brani.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between rounded-xl border border-line bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05]"
              >
                <div className="flex items-center">
                  {song.img ? (
                    <img
                      src={song.img}
                      alt="cover"
                      className="rounded-lg h-12 w-12 md:h-15 md:w-15 mr-3"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <div>
                    <h4 className="font-medium text-fg">
                      {song.titolo}
                    </h4>
                    <p className="text-sm text-fg">{song.artista}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSong(song)}
                  size="icon"
                  variant="ghost"
                  className="rounded-xl data-[hover=true]:bg-white/[0.06]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="italic text-muted">
              Non hai ancora aggiunto brani preferiti
            </p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ImpBrani;
