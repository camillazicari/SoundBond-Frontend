import { getConversazioni } from "../redux/actions/chat.js";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner.jsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogTitle,
} from "./personalizedComponents/Dialog.jsx";
import { getBonders } from "../redux/actions/bonders.js";
import * as signalR from "@microsoft/signalr";

const ChatGenerali = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const hubConnectionRef = useRef(null);

  const conversazioni = useSelector(
    (state) => state.conversazioni.conversazioni
  );
  const bonders = useSelector((state) => state.bonders.bonders);
  const userId = useSelector((state) => state.account.user?.id);
  const isLoggedIn = useSelector((state) => state.account.loginSuccess);

  const nuoveConversazioni = bonders.filter(
    (b) => !conversazioni.some((c) => c.chatWithUserId === b.otherUser.id)
  );

  const navigate = useNavigate();

  const fetchConversazioni = useCallback(async () => {
    try {
      await dispatch(getConversazioni());
    } catch (error) {
      console.error("Errore nel recupero conversazioni:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn && userId) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub")
        .withAutomaticReconnect()
        .build();

      hubConnectionRef.current = connection;

      connection.on("ReceiveMessage", (senderId, message) => {
        console.log(
          `Nuovo messaggio ricevuto in ChatGenerali da ${senderId}: ${message}`
        );
        fetchConversazioni();
      });

      connection.on("MessaggiLetti", (otherUserId) => {
        console.log(`Messaggi di ${otherUserId} marcati come letti`);
        fetchConversazioni();
      });

      connection
        .start()
        .then(() => connection.invoke("JoinUserGroup", userId))
        .catch((err) => console.error("SignalR Error:", err));

      return () => {
        if (connection.state === signalR.HubConnectionState.Connected) {
          connection.stop();
        }
      };
    }
  }, [isLoggedIn, userId, fetchConversazioni]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getBonders());
        await fetchConversazioni();
      } catch (error) {
        console.error("Errore nel fetch iniziale:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, fetchConversazioni]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchConversazioni();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [fetchConversazioni]);

  return !isLoading ? (
    <div className="container mx-auto fade-in">
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-center mt-1 mb-1"
        style={{
          backgroundImage: "linear-gradient(to right, #daacff, #9b1fff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Le tue chat
      </h1>
      <p className="text-center mb-2 text-base lg:text-lg leading-4">
        Connettiti con i tuoi bonders. Chatta, condividi playlist e scopri nuova
        musica.
      </p>
      <div className="my-8 min-h-76 overflow-auto">
        {conversazioni.length > 0 && (
          <Dialog>
            <div className="flex justify-end">
              <DialogTrigger asChild>
                <button className="rounded-full py-3 px-3 me-2 font-semibold buttonGradient mb-4 cursor-pointer">
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
                    className="lucide lucide-plus-icon lucide-plus"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </DialogTrigger>
            </div>

            <DialogContent className="bg-[#170228] border border-[#7112b7]/50">
              <DialogHeader>
                <DialogTitle className="text-[#f7ebfc]">Bonders</DialogTitle>
                <DialogDescription className="text-[#efd6f8]">
                  Scegli il bonder con il quale iniziare una chat.
                </DialogDescription>
              </DialogHeader>
              <DialogClose>
                {nuoveConversazioni?.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto">
                    {nuoveConversazioni.map((bonder) => (
                      <li
                        key={bonder?.id}
                        className="p-2 hover:bg-[#7112b7]/30 cursor-pointer flex items-center"
                        onClick={() =>
                          navigate(`/chat/${bonder?.otherUser?.id}`)
                        }
                      >
                        {bonder?.otherUser?.profilo?.immagine && (
                          <img
                            src={bonder?.otherUser?.profilo?.immagine}
                            alt={bonder?.otherUser?.nome}
                            className="h-10 w-10 rounded-full mr-2 object-cover"
                          />
                        )}
                        <p>
                          {bonder?.otherUser?.nome} {bonder?.otherUser?.cognome}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Non ci sono bonder con cui iniziare una conversazione.</p>
                )}
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
        {conversazioni && conversazioni.length > 0 ? (
          conversazioni.map((conv, i) => {
            const utcDate = new Date(conv.oraUltimoMessaggio);
            const localDate = new Date(utcDate.getTime() + 2 * 60 * 60 * 1000);

            const orario = localDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={conv?.chatWithUserId}
                className={`py-3 px-2 flex items-center justify-between borderChat cursor-pointer ${
                  i < conversazioni.length && "borderBottomChat"
                }`}
                onClick={() => navigate(`/chat/${conv?.chatWithUserId}`)}
              >
                <div className="w-1/3 flex items-center justify-start">
                  <img
                    src={
                      conv?.immagine.startsWith("http")
                        ? conv?.immagine
                        : `http://192.168.1.12:5220${conv?.immagine}`
                    }
                    alt="avatar"
                    className="w-13 h-13 object-cover rounded-full me-4"
                  />
                  <p className=" text-sm md:text-base">
                    {conv?.nome} {conv?.cognome}
                  </p>
                </div>
                <p
                  className={`w-1/3 text-center text-sm md:text-base truncate ${
                    !conv.letto && "text-[#ad42ff]"
                  }`}
                >
                  {conv.ultimoMessaggio}
                </p>
                <div className="w-1/3">
                  <p
                    className={`text-xs flex items-center justify-end ${
                      !conv.letto && "text-[#ad42ff]"
                    }`}
                  >
                    {orario}{" "}
                    {!conv.letto && (
                      <span className="w-5 h-5 flex justify-center items-center text-xs text-[#f4e5ff] rounded-full bg-[#ad42ff] ms-2">
                        {conv.messaggiNonLetti}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="place-items-center my-7">
            <div className="bg-[#9b1fff] p-6 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                fill="currentColor"
                className="bi bi-chat-left"
                viewBox="0 0 16 16"
              >
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
              </svg>
            </div>
            <p className="mt-3 text-lg font-extrabold">
              Nessuna conversazione per ora.
            </p>
            <p className="text-base text-gray-400">
              Trova i tuoi match musicali ed inizia a conversare!
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm sm:text-base 2xl:text-2xl rounded-full py-3 px-3 font-semibold buttonGradient mt-7">
                  Inizia una chat
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#170228] border border-[#7112b7]/50">
                <DialogHeader>
                  <DialogTitle className="text-[#f7ebfc]">Bonders</DialogTitle>
                  <DialogDescription className="text-[#efd6f8]">
                    Scegli il bonder con il quale iniziare una chat.
                  </DialogDescription>
                </DialogHeader>
                <DialogClose>
                  {bonders.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto">
                      {bonders.map((bonder) => (
                        <li
                          key={bonder?.id}
                          className="p-2 hover:bg-[#7112b7]/30 cursor-pointer flex items-center"
                          onClick={() =>
                            navigate(`/chat/${bonder?.otherUser?.id}`)
                          }
                        >
                          {bonder?.otherUser?.profilo?.immagine && (
                            <img
                              src={bonder?.otherUser?.profilo?.immagine}
                              alt={bonder?.otherUser?.nome}
                              className="h-10 w-10 rounded-full mr-2 object-cover"
                            />
                          )}
                          <p>
                            {bonder?.otherUser?.nome}{" "}
                            {bonder?.otherUser?.cognome}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Non ci sono bonder con cui iniziare una conversazione.
                    </p>
                  )}
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  ) : (
    <BondSpinner />
  );
};
export default ChatGenerali;
