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
  const [songs, setSongs] = useState([
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
    { id: 2, title: "Imagine", artist: "John Lennon" },
    { id: 3, title: "Hotel California", artist: "Eagles" },
    { id: 4, title: "Billie Jean", artist: "Michael Jackson" },
  ]);

  const [newSong, setNewSong] = useState({ title: "", artist: "" });

  const addSong = () => {
    if (newSong.title && newSong.artist) {
      setSongs([
        ...songs,
        {
          id: songs.length ? Math.max(...songs.map((s) => s.id)) + 1 : 1,
          title: newSong.title,
          artist: newSong.artist,
        },
      ]);
      setNewSong({ title: "", artist: "" });
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
    }
  };

  const removeSong = (id) => {
    setSongs(songs.filter((song) => song.id !== id));
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
        <Dialog>
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
                Inserisci il titolo e l'artista del brano che vuoi aggiungere.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm">Titolo</label>
                <Input
                  value={newSong.title}
                  onChange={(e) =>
                    setNewSong({ ...newSong, title: e.target.value })
                  }
                  className="bg-[#60256a] border-[#732880] focus:border-[#b849d6] text-white"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-[#e4b5f2]">Artista</label>
                <Input
                  value={newSong.artist}
                  onChange={(e) =>
                    setNewSong({ ...newSong, artist: e.target.value })
                  }
                  className="bg-[#60256a] border-[#732880] focus:border-[#b849d6] text-white"
                />
              </div>
            </div>
            <DialogClose>
              <button
                onClick={addSong}
                className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md"
              >
                Aggiungi
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="pr-4">
        {songs.length > 0 ? (
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#732880]/20 border border-[#732880]/30 hover:bg-[#732880]/30 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-[#fbf5fe]">{song.title}</h4>
                  <p className="text-sm text-[#efd6f8]">{song.artist}</p>
                </div>
                <button
                  onClick={() => removeSong(song.id)}
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
