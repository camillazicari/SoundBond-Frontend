/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteRichiesta,
  getRichiesteInviate,
  getRichiesteRicevute,
} from "../redux/actions/richieste.js";
import { postBonder } from "../redux/actions/bonders.js";
import BondSpinner from "./BondSpinner";
import { TransitionPanel } from "./personalizedComponents/TrasitionPanel";
import { Card } from "./personalizedComponents/Card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./personalizedComponents/Avatar";
import { useGetUserMatches } from "./data/matchMaking";

const MediaItem = React.memo(({ item, type }) => (
  <div className="flex flex-col items-center justify-center mx-2 text-[#f4e5ff] w-16 sm:w-20 md:w-23 lg:w-18 xl:w-23 2xl:w-28">
    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-23 md:h-23 lg:w-18 lg:h-18 xl:w-23 xl:h-23 2xl:w-28 2xl:h-28 object-cover">
      <AvatarImage
        src={item.img}
        alt={type === "artista" ? item.nome : item.titolo}
      />
      <AvatarFallback className="bg-[#ad42ff] text-2xl">
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

const RequestCard = React.memo(
  ({
    richiesta,
    match,
    onAccept,
    onReject,
    isAcceptLoading,
    isRejectLoading,
  }) => {
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
        <Card className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg gap-5 items-center w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
                <AvatarImage
                  src={richiesta.sender?.profilo?.immagine}
                  alt={richiesta.sender?.nome}
                />
                <AvatarFallback className="bg-[#ad42ff] text-2xl">
                  {richiesta.sender?.profilo?.nomeUtente
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#f4e5ff]">
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
                disabled={isAcceptLoading || isRejectLoading}
                className={`text-[#f4e5ff] text-xs sm:text-sm md:text-base 2xl:text-2xl rounded-xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold buttonGradient ${
                  isAcceptLoading || isRejectLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => onAccept(richiesta.sender?.id)}
              >
                {isAcceptLoading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-[#f4e5ff]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0116 0"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "ACCETTA"
                )}
              </button>

              <button
                disabled={isAcceptLoading || isRejectLoading}
                className={`text-[#f4e5ff] text-xs sm:text-sm md:text-base 2xl:text-2xl rounded-xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold bg-red-600 hover:bg-red-700 transition-colors ${
                  isAcceptLoading || isRejectLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => onReject(richiesta.sender?.id)}
              >
                {isRejectLoading ? (
                  <span className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-[#f4e5ff]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0116 0"
                      ></path>
                    </svg>
                  </span>
                ) : (
                  "RIFIUTA"
                )}
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
      <Card className="px-3 sm:px-6 py-6 backdrop-blur-lg m-3 xxl:mx-0 bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg gap-5 items-center w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Avatar className="w-15 h-15 md:w-20 md:h-20 lg:w-25 lg:h-25 transition-all duration-300 group-hover:border-[#d489e9]">
              <AvatarImage
                src={
                  richiesta.receiver?.profilo?.immagine.startsWith("http")
                    ? richiesta.receiver?.profilo?.immagine
                    : `http://192.168.1.12:5220${richiesta.receiver?.profilo?.immagine}`
                }
                alt={richiesta.receiver?.nome}
              />
              <AvatarFallback className="bg-[#ad42ff] text-2xl">
                {richiesta.receiver?.profilo?.nomeUtente
                  ?.slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#f4e5ff]">
                {richiesta.receiver?.nome?.toUpperCase()}{" "}
                {richiesta.receiver?.cognome?.toUpperCase()}
              </p>
              <p className="text-xs sm:text-sm lg:text-base bioColorata">
                {richiesta.receiver?.profilo?.bio}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button className="text-[#f4e5ff] text-xs sm:text-sm md:text-base 2xl:text-2xl rounded-xl py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 font-semibold bg-[#7112b7]">
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

  const handleAccept = useCallback(
    async (senderId) => {
      let startTime;
      try {
        setLoadingStates((prev) => ({
          ...prev,
          [senderId]: { ...prev[senderId], accept: true },
        }));

        startTime = Date.now();

        await dispatch(postBonder(senderId));
        await dispatch(getRichiesteRicevute());

        setLocalRequests((prev) => ({
          ...prev,
          ricevute: prev.ricevute?.filter((req) => req.sender.id !== senderId),
        }));
      } catch (error) {
        console.error("Error accepting request:", error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 800;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
          setLoadingStates((prev) => ({
            ...prev,
            [senderId]: { ...prev[senderId], accept: false },
          }));
        }, remainingTime);
      }
    },
    [dispatch, richiesteRicevute]
  );

  const handleReject = useCallback(
    async (senderId) => {
      let startTime;
      try {
        setLoadingStates((prev) => ({
          ...prev,
          [senderId]: { ...prev[senderId], reject: true },
        }));

        startTime = Date.now();

        await dispatch(deleteRichiesta(senderId));
        await dispatch(getRichiesteRicevute());

        setLocalRequests((prev) => ({
          ...prev,
          ricevute: prev.ricevute?.filter((req) => req.sender.id !== senderId),
        }));
      } catch (error) {
        console.error("Error rejecting request:", error);
        setLocalRequests((prev) => ({
          ...prev,
          ricevute: richiesteRicevute,
        }));
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 800;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
          setLoadingStates((prev) => ({
            ...prev,
            [senderId]: { ...prev[senderId], reject: false },
          }));
        }, remainingTime);
      }
    },
    [dispatch, richiesteRicevute]
  );

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

  const renderRequestItem = useCallback(
    (richiesta) => {
      const match = matches.find((m) => m.user?.id === richiesta.sender?.id);
      const senderId = richiesta.sender?.id;
      const isAcceptLoading = loadingStates[senderId]?.accept || false;
      const isRejectLoading = loadingStates[senderId]?.reject || false;

      return (
        <RequestCard
          key={richiesta.id}
          richiesta={richiesta}
          match={match}
          onAccept={handleAccept}
          onReject={handleReject}
          isAcceptLoading={isAcceptLoading}
          isRejectLoading={isRejectLoading}
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

  const ITEMS = useMemo(
    () => [
      {
        title: "Richieste ricevute",
        content: (
          <div key="received-requests">
            {requestsToShow.ricevute && requestsToShow.ricevute?.length > 0 ? (
              requestsToShow.ricevute.map(renderRequestItem)
            ) : (
              <p className="text-center py-10 text-xl text-[#f4e5ff]">
                Nessuna richiesta ricevuta
              </p>
            )}
          </div>
        ),
      },
      {
        title: "Richieste Inviate",
        content: (
          <div key="sent-requests">
            {requestsToShow.inviate && requestsToShow.inviate?.length > 0 ? (
              requestsToShow.inviate.map(renderRequestSentItem)
            ) : (
              <p className="text-center py-10 text-xl text-[#f4e5ff]">
                Nessuna richiesta inviata
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
          backgroundImage: "linear-gradient(to right, #daacff, #9b1fff)",
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
                ? "bg-[#9b1fff] text-[#f4e5ff]"
                : "text-zinc-600 bg-[#7112b7]/30 dark:text-zinc-400"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="overflow-hidden border-t border-[#7112b74D]">
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
