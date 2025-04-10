/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Card } from "../../animations/Card";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUtenti } from "../redux/actions/account.js";
import { Avatar, AvatarFallback, AvatarImage } from "../../animations/Avatar";

const TopMusicMatches = () => {
  const utenti = useSelector((state) => state.account.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUtenti());
  }, []);

  return (
    <div>
      <div className=" flex justify-between mx-4 xxl:mx-2 my-2">
        <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Potenziali match musicali
        </h2>
        <button
          className=" cursor-pointer"
          onClick={() => navigate("/connessioni")}
        >
          Vedi tutti
        </button>
      </div>
      <div className="grid grid-cols-2">
        {Array.isArray(utenti) &&
          utenti.slice(0, 4).map((utente) => {
            return (
              <Card
                onClick={() => navigate("/connessioni")}
                key={utente.id}
                className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg  gap-5 items-center"
              >
                <div className="flex items-center gap-x-4">
                  <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
                    <AvatarImage
                      src={utente.profilo?.immagine}
                      alt={utente.profilo?.nomeUtente}
                    />
                    <AvatarFallback className="bg-[#732880] text-2xl">
                      {utente.profilo?.nomeUtente?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">
                      {utente.nome.toUpperCase()} {utente.cognome.toUpperCase()}
                    </p>
                    <p className="text-xs sm:text-sm lg:text-base bioColorata">
                      {utente.profilo?.bio}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 ">
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="my-4 text-xs sm:text-sm md:text-base">
                      Artisti:
                    </p>
                    <div className="flex">
                      {utente?.artisti &&
                        utente.artisti?.slice(0, 5).map((artista) => {
                          return (
                            <Avatar
                              key={artista.id}
                              className="w-9 h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 m-[-10px] object-cover border-2 border-[#1C0721]"
                            >
                              <AvatarImage
                                src={artista.img}
                                alt={artista.nome}
                              />
                              <AvatarFallback className="bg-[#732880] text-2xl">
                                {artista.nome?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="my-4 text-xs sm:text-sm md:text-base">
                      Brani:
                    </p>
                    <div className="flex">
                      {utente?.brani &&
                        utente.brani?.slice(0, 5).map((brano) => {
                          return (
                            <Avatar
                              key={brano.id}
                              className="w-9 h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 m-[-10px] object-cover border-2 border-[#1C0721]"
                            >
                              <AvatarImage src={brano.img} alt={brano.nome} />
                              <AvatarFallback className="bg-[#732880] text-2xl">
                                {brano.nome?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default TopMusicMatches;
