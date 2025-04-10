import { useEffect, useState } from "react";
import { useGetUserMatches } from "./data/matchMaking.js";
import { useDispatch, useSelector } from "react-redux";
import { getUtenteLoggato, getUtenti } from "@/redux/actions/account.js";
import { Card } from "../../animations/Card";
import BondSpinner from "./BondSpinner.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../animations/Avatar";
import Badge from "../../animations/Badge";

const Connessioni = () => {
  const user = useSelector((state) => state.account.userLogged);
  const matches = useGetUserMatches();
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();

  console.log(matches);

  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getUtenti());
  }, [dispatch]);

  const getFilteredMatches = () => {
    if (!matches || matches.length === 0) return [];

    let filtered = [];
    if (filter === "all") {
      filtered = matches;
    } else if (filter === "high") {
      filtered = matches.filter((match) => match.compatibility.score >= 70);
    } else if (filter === "medium") {
      filtered = matches.filter(
        (match) =>
          match.compatibility.score >= 40 && match.compatibility.score < 70
      );
    } else if (filter === "low") {
      filtered = matches.filter((match) => match.compatibility.score < 40);
    }

    return filtered;
  };

  const filteredMatches = getFilteredMatches();

  if (!matches || matches.length === 0) {
    return <BondSpinner />;
  }

  return (
    <div className="fade-in container mx-auto grid grid-cols-1 gap-y-6">
      <Card className="px-6 py-10 backdrop-blur-lg mx-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg grid grid-cols-1 gap-5 items-center">
        <div>
          {user && (
            <h2 className="font-extrabold text-xl sm:text-3xl lg:text-4xl textGradient">
              Trova le Tue Connessioni Musicali
            </h2>
          )}
          <p className="text-sm lg:text-base">
            Scopri persone che condividono i tuoi gusti musicali. Connettiti con
            loro, scambia consigli musicali ed espandi i tuoi orizzonti sonori.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-5">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm sm:text-base rounded-full py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "all"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Tutte le connessioni
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`text-sm sm:text-base rounded-full py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "high"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match alto (70% +)
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={`text-sm sm:text-base rounded-full py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "medium"
                ? "buttonGradient2"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match medio (40-70%)
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`text-sm sm:text-base rounded-full py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold ${
              filter === "low"
                ? "buttonGradient"
                : "bg-purple-500/10 hover:bg-purple-500/20"
            }`}
          >
            Match basso (&lt;40%)
          </button>
        </div>
      </Card>
      <div>
        {filteredMatches && filteredMatches.length > 0 ? (
          <div className="grid grid-cols-2">
            {filteredMatches.map((match) => (
              <Card
                key={match.user?.id}
                className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg gap-5 items-center"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
                    <AvatarImage
                      src={match.user?.profilo?.immagine}
                      alt={match.user?.profilo?.nomeUtente}
                    />
                    <AvatarFallback className="bg-[#732880] text-2xl">
                      {match.user?.profilo?.nomeUtente
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm sm:text-base lg:text-lg font-semibold">
                      {match.user?.nome.toUpperCase()}{" "}
                      {match.user?.cognome.toUpperCase()}
                    </p>
                    <p className="text-xs sm:text-sm lg:text-base bioColorata">
                      {match.user?.profilo?.bio}
                    </p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm md:text-sm lg:text-base text-center mt-1 lg:mt-0">
                  <p className="bioColorata text-center">
                    Compatibilità: {match.compatibility?.score}%
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-5 ">
                  <div className="grid grid-cols-1 place-items-center">
                    <p className="my-4 text-xs sm:text-sm md:text-base">
                      Artisti:
                    </p>
                    <div className="flex">
                      {match.user?.artisti &&
                        match.user?.artisti?.map((artista) => {
                          return (
                            <Avatar
                              key={artista.id}
                              className={`w-9 h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 m-[-10px] object-cover ${
                                match.compatibility.details.commonArtists?.includes(
                                  artista.nome?.toLowerCase()
                                )
                                  ? "border-[#b849d6] border-2"
                                  : "border-[#1C0721] border-2"
                              }`}
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
                      {match.user?.brani &&
                        match.user?.brani?.map((brano) => {
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
                <div className="grid grid-cols-1 place-items-center">
                  <p className="mt-4 mb-1 text-xs sm:text-sm md:text-base">
                    Generi:
                  </p>
                  <div className="flex">
                    {match.user?.generi &&
                      match.user?.generi?.map((genere) => {
                        return (
                          <Badge
                            key={genere.id}
                            className={`px-1.5 rounded-xl sm:rounded-full sm:px-3 sm:py-1 ${
                              match.compatibility.details.commonGenres?.includes(
                                genere.nome?.toLowerCase()
                              )
                                ? "border-[#b849d6]"
                                : "border-[#1C0721]"
                            }`}
                          >
                            {genere.nome}
                          </Badge>
                        );
                      })}
                  </div>
                </div>
                <div className="flex justify-center mt-5">
                  <button className=" bg-[#732880] px-4 py-2 rounded-md hover:bg-[#a43bbe] transition-colors">
                    Connetti
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg font-extrabold">
            Nessun match disponibile.
          </p>
        )}
      </div>
    </div>
  );
};

export default Connessioni;
