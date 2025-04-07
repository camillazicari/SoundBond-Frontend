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
} from "../../animations/Dialog";
import { Card } from "../../animations/Card";
import Badge from "../../animations/Badge";
import { Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGeneri,
  deleteGenere,
  postGeneri,
} from "../redux/actions/generi.js";
import BondSpinner from "./BondSpinner";

const ImpGeneri = () => {
  const generi = useSelector((state) => state.generi.generi);
  const dispatch = useDispatch();
  const [genres, setGenres] = useState([]);
  const generiList = [
    "Rock",
    "Pop",
    "Hip Hop",
    "R&B",
    "Country",
    "Electronic",
    "Jazz",
    "Classical",
    "Folk",
    "Metal",
    "Blues",
    "Reggae",
    "Punk",
    "Soul",
    "Funk",
    "Disco",
    "House",
    "Techno",
    "Ambient",
    "Indie",
    "Gospel",
    "Latin",
    "Trap",
    "K-Pop",
    "Dubstep",
    "Lo-Fi",
    "EDM",
    "Dance",
    "Reggaeton",
    "Hard Rock",
  ];

  useEffect(() => {
    dispatch(getGeneri());
    setGenres(generi);
  }, []);

  useEffect(() => {
    setGenres(generi);
  }, [generi]);

  const addGenre = (newGenre) => {
    if (newGenre.trim()) {
      setGenres([
        ...genres,
        {
          id: genres.length ? Math.max(...genres.map((g) => g.id)) + 1 : 1,
          name: newGenre,
        },
      ]);
      dispatch(postGeneri(newGenre));
      toast(
        <p className=" flex items-center">
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
    const genreToDelete = genres.find((genre) => genre.id === id);
    if (genreToDelete) {
      dispatch(deleteGenere(genreToDelete.nome));
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-check"
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
    }
  };
  return (
    <Card className="p-6 backdrop-blur-lg bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg">
      {generi.length > 0 ? (
        <>
          {" "}
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "#e4b5f2" }}
            >
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
                    Seleziona il genere musicale che vuoi aggiungere.
                  </DialogDescription>
                </DialogHeader>
                <DialogClose>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {generiList
                        .filter(
                          (genere) => !generi.some((g) => g.nome === genere)
                        )
                        .map((genere) => (
                          <Badge
                            key={genere}
                            className="px-3 py-1 bg-[#b849d6] hover:bg-[#8a2e9d] flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              addGenre(genere);
                            }}
                          >
                            {genere}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-2">
            {generi && generi.length > 0 ? (
              generi.map((genre) => (
                <Badge
                  key={genre.id}
                  className="px-3 py-1 bg-[#732880] hover:bg-[#8a2e9d] text-white flex items-center gap-2"
                >
                  {genre.nome}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeGenre(genre.id);
                    }}
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
          </div>{" "}
        </>
      ) : (
        <BondSpinner />
      )}
    </Card>
  );
};

export default ImpGeneri;
