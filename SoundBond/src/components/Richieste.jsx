import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteRichiesta,
  getRichiesteInviate,
  getRichiesteRicevute,
} from "@/redux/actions/richieste";
import { postBonder } from "@/redux/actions/bonders";
import BondSpinner from "./BondSpinner";
import { TransitionPanel } from "../../animations/TrasitionPanel";
import { Card } from "../../animations/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../../animations/Avatar";
import { useGetUserMatches } from "./data/matchMaking";

// Componente memoizzato per gli elementi media
const MediaItem = React.memo(({ item, type }) => (
  <div className="flex flex-col items-center justify-center mx-2 text-[#f7ebfc] w-16 sm:w-20 md:w-23 lg:w-18 xl:w-23 2xl:w-28">
    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-23 md:h-23 lg:w-18 lg:h-18 xl:w-23 xl:h-23 2xl:w-28 2xl:h-28 object-cover">
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
    <p className="text-[11px] sm:text-[13px] md:text-[15px] 2xl:text-lg 2xl:leading-tight text-center mt-1 h-7 sm:h-11 md:h-12 2xl:h-17 overflow-auto">
      {type === "artista" ? item.nome : item.titolo}
    </p>
  </div>
));

// Componente memoizzato per la card di richiesta ricevuta
const RequestCard = React.memo(
  ({ richiesta, match, onAccept, onReject, isLoading }) => {
    const artisti = useMemo(
      () => richiesta.sender?.artisti || [],
      [richiesta.sender]
    );
    const brani = useMemo(
      () => richiesta.sender?.brani || [],
      [richiesta.sender]
    );

    return (
      <div className="flex justify-center px-4">
        <Card className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg gap-5 items-center cursor-pointer w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
                <AvatarImage
                  src={richiesta.sender?.profilo?.immagine}
                  alt={richiesta.sender?.nome}
                />
                <AvatarFallback className="bg-[#732880] text-2xl">
                  {richiesta.sender?.profilo?.nomeUtente
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#f7ebfc]">
                  {richiesta.sender?.nome?.toUpperCase()}{" "}
                  {richiesta.sender?.cognome?.toUpperCase()}
                </p>
                <p className="text-xs sm:text-sm lg:text-base bioColorata">
                  {richiesta.sender?.profilo?.bio}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                disabled={isLoading}
                className={`text-[#f7ebfc] text-xs sm:text-sm md:text-base 2xl:text-2xl rounded-xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold buttonGradient ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => onAccept(richiesta.sender?.id)}
              >
                {isLoading ? "PROCESSANDO..." : "ACCETTA"}
              </button>
              <button
                disabled={isLoading}
                className={`text-[#f7ebfc] text-xs sm:text-sm md:text-base 2xl:text-2xl rounded-xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold bg-red-600 hover:bg-red-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => onReject(richiesta.sender?.id)}
              >
                RIFIUTA
              </button>
            </div>
          </div>
          {match?.compatibility && (
            <div className="mt-4">
              <p className="text-center bioColorata md:text-lg">
                Compatibilità:{" "}
                <span className="font-bold">{match.compatibility.score}%</span>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center lg:gap-5">
            <div className="grid grid-cols-1 place-items-center">
              <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl mt-6 mb-2 font-semibold bioColorata">
                Artisti:
              </p>
              <div className="flex justify-center items-center flex-wrap">
                {artisti.map((artista) => (
                  <MediaItem
                    key={`artist-${artista.id}`}
                    item={artista}
                    type="artista"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 place-items-center">
              <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl lg:mt-6 mb-2 font-semibold bioColorata">
                Brani:
              </p>
              <div className="flex justify-center items-center flex-wrap">
                {brani.map((brano) => (
                  <MediaItem
                    key={`track-${brano.id}`}
                    item={brano}
                    type="brano"
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

// Componente memoizzato per la card di richiesta inviata
const RequestSentCard = React.memo(({ richiesta, match }) => {
  const artisti = useMemo(
    () => richiesta.receiver?.artisti || [],
    [richiesta.receiver]
  );
  const brani = useMemo(
    () => richiesta.receiver?.brani || [],
    [richiesta.receiver]
  );

  return (
    <div className="flex justify-center px-4">
      <Card className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg gap-5 items-center cursor-pointer w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
              <AvatarImage
                src={richiesta.receiver?.profilo?.immagine}
                alt={richiesta.receiver?.nome}
              />
              <AvatarFallback className="bg-[#732880] text-2xl">
                {richiesta.receiver?.profilo?.nomeUtente
                  ?.slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#f7ebfc]">
                {richiesta.receiver?.nome.toUpperCase()}{" "}
                {richiesta.receiver?.cognome.toUpperCase()}
              </p>
              <p className="text-xs sm:text-sm lg:text-base bioColorata">
                {richiesta.receiver?.profilo?.bio}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button className="text-[#f7ebfc] text-xs sm:text-sm md:text-base 2xl:text-2xl rounded-xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold bg-[#732880]">
              IN ATTESA
            </button>
          </div>
        </div>
        {match?.compatibility && (
          <div className="mt-4">
            <p className="text-center bioColorata md:text-lg">
              Compatibilità:{" "}
              <span className="font-bold">{match.compatibility.score}%</span>
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center lg:gap-5">
          <div className="grid grid-cols-1 place-items-center">
            <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl mt-6 mb-2 font-semibold bioColorata">
              Artisti:
            </p>
            <div className="flex justify-center items-center flex-wrap">
              {artisti.map((artista) => (
                <MediaItem
                  key={`artist-${artista.id}`}
                  item={artista}
                  type="artista"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 place-items-center">
            <p className="text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-xl lg:mt-6 mb-2 font-semibold bioColorata">
              Brani:
            </p>
            <div className="flex justify-center items-center flex-wrap">
              {brani.map((brano) => (
                <MediaItem
                  key={`track-${brano.id}`}
                  item={brano}
                  type="brano"
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

const Richieste = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState({});
  const [localRequests, setLocalRequests] = useState({
    inviate: [],
    ricevute: [],
  });

  const dispatch = useDispatch();
  const matches = useGetUserMatches();

  const richiesteInviate = useSelector(
    (state) => state.richieste.richiesteInviate,
    shallowEqual
  );
  const richiesteRicevute = useSelector(
    (state) => state.richieste.richiesteRicevute,
    shallowEqual
  );

  // Carica i dati iniziali
  const fetchRequests = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getRichiesteInviate()),
        dispatch(getRichiesteRicevute()),
      ]);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Gestione accettazione richiesta
  const handleAccept = useCallback(
    async (senderId) => {
      setLoadingStates((prev) => ({ ...prev, [senderId]: true }));

      try {
        // Optimistic update
        setLocalRequests((prev) => ({
          ...prev,
          ricevute:
            prev.ricevute?.filter((req) => req.sender.id !== senderId) ||
            richiesteRicevute?.filter((req) => req.sender.id !== senderId),
        }));

        dispatch(postBonder(senderId));
        dispatch(getRichiesteRicevute());
      } catch (error) {
        console.error("Error accepting request:", error);
        // Rollback in caso di errore
        setLocalRequests((prev) => ({ ...prev, ricevute: richiesteRicevute }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [senderId]: false }));
      }
    },
    [dispatch, richiesteRicevute]
  );

  useEffect(() => {
    console.log("Richieste inviate:", richiesteInviate);
    console.log("Richieste ricevute:", richiesteRicevute);
  }, [richiesteInviate, richiesteRicevute]);

  // Gestione rifiuto richiesta
  const handleReject = useCallback(
    async (senderId) => {
      setLoadingStates((prev) => ({ ...prev, [senderId]: true }));

      try {
        // Optimistic update
        setLocalRequests((prev) => ({
          ...prev,
          ricevute:
            prev.ricevute?.filter((req) => req.sender.id !== senderId) ||
            richiesteRicevute?.filter((req) => req.sender.id !== senderId),
        }));

        dispatch(deleteRichiesta(senderId));
        dispatch(getRichiesteRicevute());
      } catch (error) {
        console.error("Error rejecting request:", error);
        // Rollback in caso di errore
        setLocalRequests((prev) => ({ ...prev, ricevute: richiesteRicevute }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [senderId]: false }));
      }
    },
    [dispatch, richiesteRicevute]
  );

  // Memoizzazione delle richieste da mostrare
  const requestsToShow = useMemo(
    () => ({
      inviate:
        localRequests.inviate.length > 0
          ? localRequests.inviate
          : richiesteInviate,
      ricevute:
        localRequests.ricevute.length > 0
          ? localRequests.ricevute
          : richiesteRicevute,
    }),
    [localRequests, richiesteInviate, richiesteRicevute]
  );

  // Memoizzazione della funzione di render
  const renderRequestItem = useCallback(
    (richiesta) => {
      const match = matches.find((m) => m.user?.id === richiesta.sender?.id);
      const isLoading = loadingStates[richiesta.sender?.id];

      return (
        <RequestCard
          key={richiesta.id}
          richiesta={richiesta}
          match={match}
          onAccept={handleAccept}
          onReject={handleReject}
          isLoading={isLoading}
        />
      );
    },
    [matches, loadingStates, handleAccept, handleReject]
  );

  const renderRequestSentItem = useCallback(
    (richiesta) => {
      const match = matches.find((m) => m.user?.id === richiesta.receiver?.id);

      return (
        <RequestSentCard
          key={richiesta.id}
          richiesta={richiesta}
          match={match}
        />
      );
    },
    [matches]
  );

  // Memoizzazione degli items
  const ITEMS = useMemo(
    () => [
      {
        title: "Richieste Inviate",
        content: (
          <div key="sent-requests">
            {requestsToShow.inviate && requestsToShow.inviate?.length > 0 ? (
              requestsToShow.inviate.map(renderRequestSentItem)
            ) : (
              <p className="text-center py-10 text-xl text-[#f7ebfc]">
                Nessuna richiesta inviata
              </p>
            )}
          </div>
        ),
      },
      {
        title: "Richieste ricevute",
        content: (
          <div key="received-requests">
            {requestsToShow.ricevute && requestsToShow.ricevute?.length > 0 ? (
              requestsToShow.ricevute.map(renderRequestItem)
            ) : (
              <p className="text-center py-10 text-xl text-[#f7ebfc]">
                Nessuna richiesta ricevuta
              </p>
            )}
          </div>
        ),
      },
    ],
    [requestsToShow, renderRequestItem, renderRequestSentItem]
  );

  if (richiesteInviate === undefined || richiesteRicevute === undefined) {
    return <BondSpinner />;
  }

  return (
    <div className="container mx-auto fade-in">
      <h1
        className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tighter text-center mb-5"
        style={{
          backgroundImage: "linear-gradient(to right, #e4b5f2, #a43bbe)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Le tue richieste di connessione
      </h1>

      <div className="mt-9">
        {ITEMS.map((item, index) => (
          <button
            key={item.title}
            onClick={() => setActiveIndex(index)}
            className={`rounded-md px-3 py-3 text-xs sm:text-sm lg:text-base ms-2 mb-1 cursor-pointer ${
              activeIndex === index
                ? "bg-[#732880] text-[#f7ebfc]"
                : "text-zinc-600 bg-[#7328804D] dark:text-zinc-400"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="overflow-hidden border-t border-[#7328804D]">
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          variants={{
            enter: { opacity: 0, y: -20 },
            center: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
          }}
        >
          {ITEMS.map((item, index) => (
            <div key={index} className="py-2 h-100 overflow-auto">
              {item.content}
            </div>
          ))}
        </TransitionPanel>
      </div>
    </div>
  );
};

export default React.memo(Richieste);
