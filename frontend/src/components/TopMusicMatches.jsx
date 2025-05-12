/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, memo } from "react";
import { Card } from "./personalizedComponents/Card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./personalizedComponents/Avatar";

// Componente memorizzato per gli item artista/brano
const MediaItem = memo(({ item, type }) => (
  <Avatar className="w-9 h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 m-[-10px] object-cover border-2 border-[#1C0721]">
    <AvatarImage
      src={item.img}
      alt={type === "artista" ? item.nome : item.titolo}
    />
    <AvatarFallback className="bg-[#732880] text-2xl">
      {(type === "artista" ? item.nome : item.titolo)
        ?.slice(0, 2)
        .toUpperCase()}
    </AvatarFallback>
  </Avatar>
));

// Componente memorizzato per la card utente
const UserCard = memo(({ utente, navigate }) => {
  const artisti = useMemo(() => utente?.artisti?.slice(0, 5) || [], [utente]);
  const brani = useMemo(() => utente?.brani?.slice(0, 5) || [], [utente]);

  return (
    <Card
      onClick={() => navigate("/connessioni")}
      className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg gap-5 items-center cursor-pointer"
    >
      <div className="flex items-center gap-x-4">
        <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
          <AvatarImage
            src={
              utente?.profilo?.immagine.startsWith("http")
                ? utente?.profilo?.immagine
                : `http://192.168.1.61:5220${utente?.profilo?.immagine}`
            }
            alt={utente.profilo?.nomeUtente}
          />
          <AvatarFallback className="bg-[#ad42ff] text-2xl">
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
      <div className="grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 place-items-center">
          <p className="my-4 text-xs sm:text-sm md:text-base">Artisti:</p>
          <div className="flex">
            {artisti.map((artista) => (
              <MediaItem key={artista.id} item={artista} type="artista" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 place-items-center">
          <p className="my-4 text-xs sm:text-sm md:text-base">Brani:</p>
          <div className="flex">
            {brani.map((brano) => (
              <MediaItem key={brano.id} item={brano} type="brano" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
});

const TopMusicMatches = ({ currentUserId }) => {
  const utenti = useSelector((state) => state.account.users);
  const bonders = useSelector((state) => state.bonders.bonders);
  const navigate = useNavigate();

  const nonBonders = useMemo(() => {
    if (!bonders || !utenti) return [];
    const bonderIds = new Set(bonders.map((bonder) => bonder.otherUser?.id));
    return utenti.filter((match) => !bonderIds.has(match.user?.id));
  }, [bonders, utenti, currentUserId]);

  const displayedUsers = useMemo(
    () => (Array.isArray(nonBonders) ? nonBonders.slice(0, 4) : []),
    [nonBonders]
  );

  return (
    <div>
      <div className="flex justify-between mx-4 xxl:mx-2 my-2">
        <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Potenziali match musicali
        </h2>
        <button
          className="cursor-pointer"
          onClick={() => navigate("/connessioni")}
        >
          Vedi tutti
        </button>
      </div>
      <div className="grid grid-cols-2">
        {displayedUsers.map((utente) => (
          <UserCard key={utente.id} utente={utente} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};

export default memo(TopMusicMatches);
