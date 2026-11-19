import { API_URL } from "../config";
import { useEffect, useState, useRef, useCallback } from "react";
import connection from "../services/signalR.js";
import { HubConnectionState } from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner.jsx";
import { CheckCheck, ChevronLeft, Ellipsis, SendHorizontal, Trash2 } from "lucide-react";
import { profileImage } from "./MatchCard.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./personalizedComponents/Avatar.jsx";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { getConversazioni } from "../redux/actions/chat.js";
import { getUtenti } from "../redux/actions/account.js";

const API_BASE_URL = `${API_URL}/api`;

const Chat = ({ otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const prevOtherUserRef = useRef(null);

  const token = localStorage.getItem("jwtToken");
  const userLogged = useSelector((state) => state.account.userLogged);
  const currentUserId = userLogged?.id;
  const users = useSelector((state) => state.account.users);
  const ricevente = users.find((u) => u.id === otherUser);

  useEffect(() => {
    if (currentUserId && !ricevente) dispatch(getUtenti());
  }, [currentUserId, ricevente, dispatch]);

  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.includes("Z") ? timestamp.replace("Z", "") : timestamp;
  };

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Oggi";
    if (date.toDateString() === yesterday.toDateString()) return "Ieri";
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const formatTime = useCallback((timestamp) => {
    const normalized = normalizeTimestamp(timestamp);
    if (!normalized) return "";
    const date = new Date(normalized + "Z");
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!token || !otherUser) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Messages/${otherUser}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const msgs = data.messaggi
        .filter((m) => m.content?.trim())
        .map((m) => ({
          content: m.content,
          senderId: m.senderId,
          receiverId: m.receiverId,
          timestamp: normalizeTimestamp(m.timestamp),
          letto: m.letto,
        }));
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, otherUser]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!currentUserId || !otherUser) return;

    const setupConnection = async () => {
      try {
        if (connection.state === HubConnectionState.Disconnected) {
          await connection.start();
        }
        if (prevOtherUserRef.current !== otherUser) {
          await connection.invoke("JoinPrivateChat", otherUser);
          prevOtherUserRef.current = otherUser;
        }
        setConnectionEstablished(true);
      } catch (err) {
        console.error(err);
        setTimeout(setupConnection, 3000);
      }
    };

    if (!connectionEstablished) setupConnection();

    return () => {
      prevOtherUserRef.current = null;
    };
  }, [currentUserId, otherUser, connectionEstablished]);

  useEffect(() => {
    if (!connectionEstablished) return;

    const onReceive = (fromUser, message, serverTimestamp) => {
      setMessages((prev) => [
        ...prev,
        {
          content: message,
          senderId: fromUser,
          receiverId: currentUserId,
          timestamp: normalizeTimestamp(serverTimestamp),
          letto: false,
        },
      ]);
    };

    const onRead = (readerId) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === currentUserId && m.receiverId === readerId && !m.letto
            ? { ...m, letto: true }
            : m
        )
      );
    };

    connection.on("ReceivePrivateMessage", onReceive);
    connection.on("MessaggiLetti", onRead);

    return () => {
      connection.off("ReceivePrivateMessage", onReceive);
      connection.off("MessaggiLetti", onRead);
    };
  }, [connectionEstablished, currentUserId]);

  useEffect(() => {
    if (!connectionEstablished || !otherUser) return;

    const unreadMessages = messages.filter(
      (m) =>
        m.senderId === otherUser && m.receiverId === currentUserId && !m.letto
    );

    if (unreadMessages.length > 0) {
      connection.invoke("SegnaComeLetti", otherUser).catch(console.error);
      console.log("SEGNATO COME LETTO!");
    }
  }, [messages, connectionEstablished, otherUser, currentUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    try {
      if (connection.state === HubConnectionState.Connected) {
        await connection.invoke("SendPrivateMessage", otherUser, text);
      } else {
        console.error("Connection not established");
      }
    } catch (err) {
      console.error(err);
    }
  }, [input, otherUser]);

  const handleDeleteChat = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Messages/deleteChat/${otherUser}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        dispatch(getConversazioni());
        setMessages([]);
        navigate("/generali");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderMessages = useCallback(() => {
    let lastDate = "";
    return messages.map((msg, i) => {
      const isOwn = msg.senderId === currentUserId;
      const time = formatTime(msg.timestamp);
      const dateStr = formatDate(msg.timestamp);
      const showDate = dateStr !== lastDate;
      if (showDate) lastDate = dateStr;

      const next = messages[i + 1];
      const lastOfGroup = !next || next.senderId !== msg.senderId || formatDate(next.timestamp) !== dateStr;

      return (
        <li key={`msg-${i}-${msg.timestamp}`} className={lastOfGroup ? "mb-3" : "mb-1"}>
          {showDate && (
            <p className="my-6 text-center font-mono text-xs uppercase tracking-[0.16em] text-subtle">{dateStr}</p>
          )}
          <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[min(80%,28rem)] rounded-3xl px-4 py-2.5 ${
                isOwn
                  ? `bg-accent text-accent-ink ${lastOfGroup ? "rounded-br-md" : ""}`
                  : `bg-surface-3 text-fg ${lastOfGroup ? "rounded-bl-md" : ""}`
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <p className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] ${isOwn ? "text-accent-ink/60" : "text-subtle"}`}>
                {time}
                {isOwn && (
                  <CheckCheck size={14} aria-label={msg.letto ? "Letto" : "Inviato"} className={msg.letto ? "text-accent-ink" : ""} />
                )}
              </p>
            </div>
          </div>
        </li>
      );
    });
  }, [messages, currentUserId, formatDate, formatTime]);

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-ink">
      <header className="glass relative z-10 mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-3xl items-center gap-3 rounded-full py-2 pr-2 pl-2">
        <button
          type="button"
          onClick={() => navigate("/generali")}
          aria-label="Torna alle chat"
          className="grid size-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.08] hover:text-fg"
        >
          <ChevronLeft size={22} />
        </button>
        <Avatar className="size-10 ring-1 ring-line-strong">
          <AvatarImage src={profileImage(ricevente?.profilo?.immagine)} alt="" className="object-cover" />
          <AvatarFallback className="bg-accent-soft text-sm font-semibold text-accent">
            {ricevente?.nome?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold">
            {ricevente?.nome} {ricevente?.cognome}
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`size-1.5 rounded-full ${connectionEstablished ? "bg-emerald-400" : "bg-subtle"}`} />
            {connectionEstablished ? "Connesso" : "Connessione…"}
          </p>
        </div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button
              type="button"
              aria-label="Opzioni della chat"
              className="grid size-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.08] hover:text-fg"
            >
              <Ellipsis size={20} />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Opzioni della chat" className="glass rounded-2xl p-1.5">
            <DropdownItem
              key="delete-chat"
              textValue="Elimina chat"
              className="rounded-xl px-3 py-2 text-rose-300 data-[hover=true]:bg-rose-400/10"
              startContent={<Trash2 size={16} />}
              onPress={handleDeleteChat}
            >
              Elimina chat
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </header>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <BondSpinner label="Caricamento dei messaggi" />
        ) : (
          <ol className="mx-auto max-w-3xl px-4 pt-6 pb-4" aria-live="polite">
            {messages.length === 0 && (
              <li className="py-20 text-center">
                <p className="display text-3xl font-bold">Rompi il ghiaccio.</p>
                <p className="mt-2 text-muted">Chiedi a {ricevente?.nome ?? "questa persona"} qual è il brano che ascolta in loop.</p>
              </li>
            )}
            {renderMessages()}
            <li ref={messagesEndRef} aria-hidden="true" />
          </ol>
        )}
      </div>

      <form
        className="mx-auto mb-3 flex w-[calc(100%-1.5rem)] max-w-3xl items-center gap-2 rounded-full border border-line-strong bg-surface p-1.5 pl-5 focus-within:border-accent/60"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <label htmlFor="messageInput" className="sr-only">Messaggio</label>
        <input
          id="messageInput"
          autoComplete="off"
          placeholder="Scrivi un messaggio"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-11 min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-subtle"
        />
        <button
          type="submit"
          aria-label="Invia"
          disabled={!connectionEstablished || input.trim() === ""}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-accent text-accent-ink transition-[transform,opacity] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
