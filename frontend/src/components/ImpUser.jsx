/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from "./personalizedComponents/Card";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./personalizedComponents/Avatar";
import { Edit2, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "./personalizedComponents/Input";
import { Textarea } from "./personalizedComponents/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { getProfilo, putProfilo } from "/src/redux/actions/profilo";
import { getUtenteLoggato, putNomeUtente } from "../redux/actions/account.js";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "./personalizedComponents/Dialog";
import BondSpinner from "./BondSpinner.jsx";

const ImpUser = () => {
  const [bio, setBio] = useState("");
  const [immagine, setImmagine] = useState("");
  const [username, setUsername] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [urlMode, setUrlMode] = useState(true);
  const profilo = useSelector((state) => state.profilo.profilo);
  const [editBio, setEditBio] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.account.userLogged);
  const fileInputRef = useRef(null);
  const utenti = useSelector((state) => state.account.allUsers);
  const [error, setError] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
      setUrlMode(false);

      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setImmagine(previewUrl);
    }
  };

  useEffect(() => {
    dispatch(getProfilo());
    dispatch(getUtenteLoggato());
  }, []);

  useEffect(() => {
    if (profilo) {
      setBio(profilo.bio);
      setImmagine(profilo.immagine);
    }

    if (profile) {
      setUsername(profile.nomeUtente);
    }
  }, [profilo, profile]);

  const handleImageUpload = () => {
    const formData = new FormData();

    formData.append("Bio", bio);

    if (urlMode) {
      if (!immagine) {
        toast.error("Per favore inserisci un URL valido");
        return;
      }
      formData.append("Immagine", immagine);

      const emptyBlob = new Blob([""], { type: "application/octet-stream" });
      formData.append("ImgFile", emptyBlob, "empty.txt");
    } else {
      if (!imgFile) {
        toast.error("Per favore seleziona un file");
        return;
      }
      formData.append("ImgFile", imgFile);
    }

    dispatch(putProfilo(formData))
      .then(() => {
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
            &nbsp; Profilo aggiornato!
          </p>,
          {
            style: {
              background: "rgb(7, 176, 7)",
              border: "none",
            },
          }
        );
        dispatch(getUtenteLoggato());
      })
      .catch((error) => {
        toast.error(error.message || "Errore durante l'aggiornamento");
      });
  };

  const saveBio = () => {
    const formData = new FormData();

    if (imgFile) {
      formData.append("ImgFile", imgFile);
    } else if (immagine) {
      if (immagine.startsWith("http")) {
        formData.append("Immagine", immagine);
      } else {
        formData.append("Immagine", `http://192.168.1.12:5220${immagine}`);
      }
    }

    formData.append("Bio", bio);

    const usernameInUso = utenti.find(
      (u) => u.nomeUtente === username && u.id !== profile.id
    );

    if (usernameInUso) {
      setError(true);

      return;
    }

    dispatch(putProfilo(formData));
    setEditBio(false);
    dispatch(putNomeUtente(username));
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
        &nbsp; Profilo aggiornato!
      </p>,
      {
        style: {
          background: "rgb(7, 176, 7)",
          border: "none",
        },
      }
    );
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-6 backdrop-blur-lg bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg">
      {profilo && profilo.immagine ? (
        <>
          <Card className="border-0">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-[#ad42ff] transition-all duration-300 group-hover:border-[#c476ff]">
                  <AvatarImage
                    src={
                      immagine && immagine.startsWith("/")
                        ? `http://192.168.1.12:5220${immagine}`
                        : immagine
                    }
                    alt={profile && profile.nomeUtente}
                  />
                  <AvatarFallback className="bg-[#ad42ff] text-2xl">
                    {profile && profile.nomeUtente?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger className="absolute bottom-0 right-0 bg-[#ad42ff] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera size={20} />
                  </DialogTrigger>
                  <DialogContent className="bg-[#3f006f]/30 border border-[#7112b7]/50">
                    <DialogHeader>
                      <DialogTitle className="text-[#f7ebfc]">
                        Aggiorna la tua immagine di profilo
                      </DialogTitle>
                      <DialogDescription className="text-[#efd6f8]">
                        Inserisci un URL o carica un'immagine dal tuo
                        dispositivo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                      <div className="flex justify-between mb-2">
                        <button
                          className={`py-1 px-3 rounded-md cursor-pointer ${
                            urlMode ? "bg-[#ad42ff]" : "bg-[#7112b7]/30"
                          }`}
                          onClick={() => setUrlMode(true)}
                        >
                          URL
                        </button>
                        <button
                          className={`py-1 px-3 rounded-md cursor-pointer ${
                            !urlMode ? "bg-[#ad42ff]" : "bg-[#7112b7]/30"
                          }`}
                          onClick={openFileSelector}
                        >
                          File
                        </button>
                      </div>

                      {urlMode ? (
                        <Input
                          onChange={(e) => setImmagine(e.target.value)}
                          value={immagine}
                          placeholder="Inserisci l'URL dell'immagine"
                          className="bg-[#7112b7]/30 border-[#3f006f] focus:border-[#ad42ff]"
                        />
                      ) : (
                        <div className="border border-dashed border-[#ad42ff] rounded-md p-4 text-center">
                          <p>
                            {imgFile ? imgFile.name : "Nessun file selezionato"}
                          </p>
                          <button
                            onClick={openFileSelector}
                            className="mt-2 text-[#ad42ff] hover:text-[#c476ff]"
                          >
                            Seleziona un altro file
                          </button>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />

                      <DialogClose
                        className="btn cursor-pointer w-[20%] mx-auto mt-2 py-1.5 rounded-md bg-[#ad42ff] hover:bg-[#7112b7]"
                        onClick={handleImageUpload}
                      >
                        Salva
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1">
                {!editBio ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <label
                        className="text-md font-semibold block text-center md:text-start"
                        style={{ color: "#c476ff" }}
                      >
                        Username
                      </label>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold mb-0">
                          {profile && profile.nomeUtente} &nbsp;
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditBio(true)}
                      className="hover:bg-[#7112b7]/30 p-2 rounded-2xl hidden md:block"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label
                      className="text-md font-semibold block text-center md:text-start mb-1"
                      style={{ color: "#c476ff" }}
                    >
                      Username
                    </label>
                    <Input
                      value={username}
                      onChange={(e) => {
                        setError(false);
                        setUsername(e.target.value);
                      }}
                      className="bg-[#7112b7]/30 border border-[#3f006f] focus:border-[#ad42ff] rounded-sm"
                      maxLength={10}
                      minLength={5}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs">
                        {username ? username.length : 0}/10 caratteri
                      </span>
                    </div>
                    {error && (
                      <p className="text-sm text-center Errors">
                        Username già in uso.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card className="border-0 mt-5">
            <div className="flex items-center justify-between">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#c476ff" }}
              >
                La tua biografia
              </h3>
              {!editBio && (
                <button
                  onClick={() => setEditBio(true)}
                  className="hover:bg-[#7112b7]/30 p-2 rounded-2xl block md:hidden"
                >
                  <Edit2 size={18} />
                </button>
              )}
            </div>
            {editBio ? (
              <div>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[120px] bg-[#7112b7]/30 border-[#3f006f] focus:border-[#ad42ff]"
                  placeholder="Racconta qualcosa su di te..."
                  maxLength={500}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs">
                    {bio ? bio.length : 0}/500 caratteri
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={saveBio}
                      className="bg-[#ad42ff] hover:bg-[#7112b7] py-1 px-3 rounded-md transition-colors"
                    >
                      Salva
                    </button>
                    <button
                      onClick={() => setEditBio(false)}
                      className="hover:bg-[#7112b7]/30 py-1 px-3 rounded-md"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#fbf5fe] leading-relaxed">
                {profilo && profilo.bio}
              </p>
            )}
          </Card>
        </>
      ) : (
        <BondSpinner />
      )}
    </div>
  );
};

export default ImpUser;
