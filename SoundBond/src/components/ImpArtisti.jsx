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
import { Input } from "../../animations/Input";
import { Trash2, Plus } from "lucide-react";

const ImpArtisti = () => {
  const [artists, setArtists] = useState([
    { id: 1, name: "Queen" },
    { id: 2, name: "The Beatles" },
    { id: 3, name: "David Bowie" },
    { id: 4, name: "Daft Punk" },
  ]);

  const [newArtist, setNewArtist] = useState("");

  const addArtist = () => {
    if (newArtist.trim()) {
      setArtists([
        ...artists,
        {
          id: artists.length ? Math.max(...artists.map((a) => a.id)) + 1 : 1,
          name: newArtist,
        },
      ]);
      setNewArtist("");
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
          &nbsp; Artista aggiunto dai preferiti!
        </p>,
        {
          style: {
            background: "rgb(7, 176, 7)",
            border: "none",
          },
        }
      );
    }
  };

  const removeArtist = (id) => {
    setArtists(artists.filter((artist) => artist.id !== id));
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
        &nbsp; Artista rimosso dai preferiti!
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
        <h3
          className="text-lg font-semibold text-[#e4b5f2]"
          style={{ color: "#e4b5f2" }}
        >
          I tuoi artisti preferiti
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md flex items-center">
              <Plus size={18} className="mr-2" /> Aggiungi
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#3d0d45] border-[#732880]">
            <DialogHeader>
              <DialogTitle className="text-[#f7ebfc]">
                Aggiungi un artista preferito
              </DialogTitle>
              <DialogDescription className="text-[#efd6f8]">
                Inserisci il nome dell'artista che vuoi aggiungere.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm text-[#e4b5f2]">Nome artista</label>
                <Input
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="bg-[#60256a] border-[#732880] focus:border-[#b849d6] text-white"
                />
              </div>
            </div>
            <DialogClose>
              <button
                onClick={addArtist}
                className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md"
              >
                Aggiungi
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="pr-4">
        {artists.length > 0 ? (
          <div className="space-y-2">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#732880]/20 border border-[#732880]/30 hover:bg-[#732880]/30 transition-colors"
              >
                <span className="font-medium text-[#fbf5fe]">
                  {artist.name}
                </span>
                <button
                  onClick={() => removeArtist(artist.id)}
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
              Non hai ancora aggiunto artisti preferiti
            </p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ImpArtisti;
