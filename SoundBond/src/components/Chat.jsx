import { useEffect, useState, useRef, useCallback } from "react";
import connection from "../services/signalR.js";
import { HubConnectionState } from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner.jsx";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { getConversazioni } from "@/redux/actions/chat.js";

const API_BASE_URL = "http://192.168.1.12:5220/api";

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

      return (
        <div key={`msg-${i}-${msg.timestamp}`}>
          {showDate && (
            <div className="flex justify-center text-sm mt-2 mb-4">
              <p className="badgini px-3 py-0.5 rounded-2xl flex items-center justify-center text-gray-400">
                {dateStr}
              </p>
            </div>
          )}
          <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-70 rounded-2xl py-2 px-3 ${
                isOwn
                  ? "bg-[#9b1fff] rounded-br-none"
                  : "bg-[#5d1093] rounded-bl-none"
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <div
                className={`flex items-center ${
                  isOwn ? "justify-between" : "justify-end"
                }`}
              >
                {isOwn && (
                  <span
                    className={`${
                      msg.letto ? "text-blue-500 font-bold" : "text-gray-300"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      fill="currentColor"
                      className="bi bi-check-all"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.091-1.028L9.477 9.417l-.485-.486z" />
                    </svg>
                  </span>
                )}
                <p
                  className={`text-[10px] text-gray-300 ms-5 ${
                    !isOwn && "pt-1"
                  }`}
                >
                  {time}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [messages, currentUserId, formatDate, formatTime]);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 fixed top-0 w-[100%] fade-in bg-[#9b1fff]">
        <div className="flex items-center">
          <svg
            onClick={() => navigate("/generali")}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left-icon lucide-chevron-left cursor-pointer"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <img
            src={
              ricevente?.profilo?.immagine.startsWith("http")
                ? ricevente?.profilo?.immagine
                : `http://192.168.1.12:5220${ricevente?.profilo?.immagine}`
            }
            className="w-10 h-10 md:w-15 md:h-15 object-cover rounded-full me-4"
            alt=""
          />
          <h1 className="text-center text-base md:text-xl">
            {ricevente?.nome} {ricevente?.cognome}
          </h1>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-ellipsis-icon lucide-ellipsis cursor-pointer"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </DropdownTrigger>
          <DropdownMenu
            className="flex justify-center p-2 border-[#ad42ff] border-[0.5px] rounded-lg"
            style={{
              backgroundColor: "rgba(12, 5, 18, 0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <DropdownItem
              className="text-sm text-start py-2 px-12 rounded-sm hover:bg-red-500"
              key="delete-chat"
              color="danger"
              textValue="Delete Chat"
            >
              <button
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleDeleteChat}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
                <p>Elimina chat</p>
              </button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {isLoading ? (
        <BondSpinner />
      ) : (
        <div className="messages-container h-[80vh] overflow-y-auto fixed top-20 w-[100%] px-4 space-y-2 fade-in">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-container flex p-4 fixed bottom-0 w-[100%] bg-transparent z-10 fade-in">
        <div className="messageBox mx-auto bg-[#9b1fff]">
          <input
            required
            placeholder="Scrivi un messaggio..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            id="messageInput"
          />
          <button
            id="sendButton"
            onClick={sendMessage}
            disabled={!connectionEstablished || input.trim() === ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 664 663"
            >
              <path
                fill="none"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              />
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="33.67"
                stroke="#6c6c6c"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
