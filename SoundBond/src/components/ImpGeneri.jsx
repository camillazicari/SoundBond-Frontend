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
import { Card } from "../../animations/Card";
import Badge from "../../animations/Badge";
import { Plus, X } from "lucide-react";
import { Input } from "../../animations/Input";

const ImpGeneri = () => {
  const [genres, setGenres] = useState([
    { id: 1, name: "Rock" },
    { id: 2, name: "Pop" },
    { id: 3, name: "Jazz" },
    { id: 4, name: "Elettronica" },
  ]);

  const [newGenre, setNewGenre] = useState("");

  const addGenre = () => {
    if (newGenre.trim()) {
      setGenres([
        ...genres,
        {
          id: genres.length ? Math.max(...genres.map((g) => g.id)) + 1 : 1,
          name: newGenre,
        },
      ]);
      setNewGenre("");
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
          &nbsp; Genere aggiunto ai preferiti!
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

  const removeGenre = (id) => {
    setGenres(genres.filter((genre) => genre.id !== id));
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
        &nbsp; Genere rimosso dai preferiti!
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
        <h3 className="text-lg font-semibold mb-3" style={{ color: "#e4b5f2" }}>
          I tuoi generi preferiti
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md flex items-center ">
              <Plus size={18} className="mr-2" /> Aggiungi
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#3d0d45] border-[#732880]">
            <DialogHeader>
              <DialogTitle className="text-[#f7ebfc]">
                Aggiungi un genere preferito
              </DialogTitle>
              <DialogDescription className="text-[#efd6f8]">
                Inserisci il nome del genere musicale che vuoi aggiungere.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm">Nome genere</label>
                <Input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="bg-[#60256a] border-[#732880] focus:border-[#b849d6] text-white"
                />
              </div>
            </div>
            <DialogClose>
              <button
                onClick={addGenre}
                className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md"
              >
                Aggiungi
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {genres.length > 0 ? (
          genres.map((genre) => (
            <Badge
              key={genre.id}
              className="px-3 py-1 bg-[#732880] hover:bg-[#8a2e9d] text-white flex items-center gap-2"
            >
              {genre.name}
              <button
                onClick={() => removeGenre(genre.id)}
                className="ml-1 hover:text-[#e4b5f2] transition-colors"
              >
                <X size={14} />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-[#efd6f8] italic w-full text-center py-4">
            Non hai ancora aggiunto generi preferiti
          </p>
        )}
      </div>
    </Card>
  );
};

export default ImpGeneri;
