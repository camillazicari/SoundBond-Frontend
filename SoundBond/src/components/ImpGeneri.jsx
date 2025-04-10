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
    "Pop",
    "Hip Hop",
    "Rap",
    "Rock",
    "Dance",
    "R&B",
    "Alternative",
    "Electro",
    "Folk",
    "Reggae",
    "Jazz",
    "Classica",
    "Metal",
    "Soul",
    "Funk",
    "Blues",
    "Cumbia",
    "House",
    "Techno",
    "Ambient",
    "Indie",
    "Gospel",
    "Latina",
    "Trap",
    "K-Pop",
    "Lo-Fi",
    "Hard Rock",
    "Brasiliana",
    "Indiana",
    "Asiatica",
  ];

  useEffect(() => {
    dispatch(getGeneri());
    setGenres(generi);
  }, []);

  useEffect(() => {
    setGenres(generi);
  }, [generi]);

  const addGenre = (newGenre) => {
    if (genres.length < 10) {
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
          &nbsp; Puoi selezionare al massimo 10 generi!
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

  const removeGenre = (id) => {
    if (genres.length > 1) {
      const genreToDelete = genres.find((genre) => genre.id === id);
      if (genreToDelete) {
        dispatch(deleteGenere(genreToDelete.nome));
        setGenres(genres.filter((genre) => genre.id !== id));
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
          &nbsp; Devi avere almeno 1 genere preferito!
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
                <button className="bg-[#b849d6] hover:bg-[#a43bbe] py-1.5 px-4 rounded-md flex items-center transition-colors">
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
