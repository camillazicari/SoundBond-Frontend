import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "../../animations/Dialog";
import { ScrollArea } from "../../animations/ScrollArea";
import { Card } from "../../animations/Card";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../../animations/Input";

const ImpBrani = () => {
  // TODO: CANZONI ESEMPIO!!!!!!!!
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    getSongs(value);
  };

  const handleSelectSong = (song) => {
    if (!songs.some((s) => s.title === song.title)) {
      setSongs((prev) => [...prev, song]);
    }
    setSearch("");
    setSearchResults([]);
    toast(
      <p className=" flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-circle-check"
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
  };

  const handleRemoveSong = (song) => {
    setSongs((prev) => prev.filter((item) => item !== song));
    toast(
      <p className=" flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-circle-check"
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
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "#e4b5f2" }}>
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
            <button className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md flex items-center">
              <Plus size={18} className="mr-2" /> Aggiungi
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#3d0d45] border-[#732880]">
            <DialogHeader>
              <DialogTitle className="text-[#f7ebfc]">
                Aggiungi un brano preferito
              </DialogTitle>
              <DialogDescription className="text-[#efd6f8]">
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
                  className="bg-[#60256a] border-[#732880] focus:border-[#b849d6] text-white"
                />
              </div>
              <DialogClose>
                {searchResults.length > 0 && (
                  <ul className="bg-[#3d0d45] border-[#732880] shadow-lg rounded-lg mt-2 w-[99%] max-h-60 overflow-y-auto absolute left-0.5 top-42 z-50">
                    {searchResults.map((song, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-[#60256a] cursor-pointer flex items-center"
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
        {songs.length > 0 ? (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[#732880]/20 border border-[#732880]/30 hover:bg-[#732880]/30 transition-colors"
              >
                <div className="flex items-center">
                  {song.image ? (
                    <img
                      src={song.image}
                      alt="cover"
                      className="rounded-lg h-10 w-10 lg:h-12.5 lg:w-12.5 mr-3"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <div>
                    <h4 className="font-medium text-[#fbf5fe]">{song.title}</h4>
                    <p className="text-sm text-[#efd6f8]">{song.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSong(song)}
                  size="icon"
                  variant="ghost"
                  className="hover:bg-[#a43bbe]/20 text-[#f7ebfc]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[#efd6f8] italic">
              Non hai ancora aggiunto brani preferiti
            </p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ImpBrani;
