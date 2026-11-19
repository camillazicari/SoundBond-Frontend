import { API_URL } from "../config";
import { getConversazioni } from "../redux/actions/chat.js";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner.jsx";
import PageHeader from "./ui/PageHeader.jsx";
import { MessageCircle, Plus } from "lucide-react";
import { profileImage } from "./MatchCard.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./personalizedComponents/Avatar.jsx";
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
        .withUrl(`${API_URL}/chatHub`, {
          accessTokenFactory: () => localStorage.getItem("jwtToken"),
        })
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

  const NewChat = ({ people, children }) => (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass gap-0 rounded-[var(--radius-card)] border-line p-0">
        <DialogHeader className="border-b border-line p-5 text-left">
          <DialogTitle className="display text-2xl font-bold">Nuova chat</DialogTitle>
          <DialogDescription className="text-sm text-muted">Scegli un bonder con cui iniziare a scrivere.</DialogDescription>
        </DialogHeader>
        {people.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto p-2">
            {people.map((bonder) => (
              <li key={bonder?.id}>
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={() => navigate(`/chat/${bonder?.otherUser?.id}`)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[0.05]"
                  >
                    <Avatar className="size-10 ring-1 ring-line-strong">
                      <AvatarImage src={profileImage(bonder?.otherUser?.profilo?.immagine)} alt="" className="object-cover" />
                      <AvatarFallback className="bg-accent-soft text-sm text-accent">{bonder?.otherUser?.nome?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{bonder?.otherUser?.nome} {bonder?.otherUser?.cognome}</span>
                  </button>
                </DialogClose>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-muted">Non ci sono bonder con cui iniziare una conversazione.</p>
        )}
      </DialogContent>
    </Dialog>
  );

  if (isLoading) return <BondSpinner label="Caricamento delle chat" />;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-12 pb-16 md:pt-15">
      <PageHeader
        eyebrow="Chat"
        title="Le tue"
        accent="conversazioni."
        actions={
          conversazioni.length > 0 && (
            <NewChat people={nuoveConversazioni}>
              <button type="button" className="btn btn-primary">
                <Plus size={18} /> Nuova chat
              </button>
            </NewChat>
          )
        }
      >
        Scrivi ai tuoi bonders, consigliatevi brani, organizzate il prossimo concerto.
      </PageHeader>

      {conversazioni.length > 0 ? (
        <ul className="surface mt-12 divide-y divide-line overflow-hidden">
          {conversazioni.map((conv) => {
            const utcDate = new Date(conv.oraUltimoMessaggio);
            const localDate = new Date(utcDate.getTime() + 2 * 60 * 60 * 1000);
            const orario = localDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const unread = !conv.letto;
            return (
              <li key={conv?.chatWithUserId}>
                <button
                  type="button"
                  onClick={() => navigate(`/chat/${conv?.chatWithUserId}`)}
                  className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <Avatar className="size-12 shrink-0 ring-1 ring-line-strong">
                    <AvatarImage src={profileImage(conv?.immagine)} alt="" className="object-cover" />
                    <AvatarFallback className="bg-accent-soft text-sm text-accent">{conv?.nome?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{conv?.nome} {conv?.cognome}</span>
                    <span className={`block truncate text-sm ${unread ? "font-medium text-fg" : "text-muted"}`}>{conv.ultimoMessaggio}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className={`font-mono text-xs ${unread ? "text-accent" : "text-subtle"}`}>{orario}</span>
                    {unread && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-ink">
                        {conv.messaggiNonLetti}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="surface mt-12 flex flex-col items-center px-6 py-16 text-center">
          <MessageCircle size={36} className="text-accent" />
          <p className="display mt-5 text-3xl font-bold">Ancora silenzio.</p>
          <p className="mt-2 max-w-sm text-muted">Quando un match diventa bonder potete scrivervi qui.</p>
          <NewChat people={bonders}>
            <button type="button" className="btn btn-primary mt-8">Inizia una chat</button>
          </NewChat>
        </div>
      )}
    </div>
  );
};
export default ChatGenerali;
