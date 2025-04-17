import { useEffect, useState, useRef } from "react";
import connection from "../services/signalR.js";
import { HubConnectionState } from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner.jsx";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

const Chat = ({ otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const token = localStorage.getItem("jwtToken");
  const userLogged = useSelector((state) => state.account.userLogged);
  const currentUserId = userLogged?.id;
  const users = useSelector((state) => state.account.users);
  const ricevente = users.find((u) => u.id === otherUser);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const setupConnection = async () => {
      try {
        if (connection.state === HubConnectionState.Disconnected) {
          await connection.start();
          console.log("Connection started successfully");
        }

        await connection.invoke("JoinPrivateChat", otherUser);
      } catch (error) {
        console.error("SignalR connection error:", error);
      }
    };

    connection.on("ReceivePrivateMessage", (fromUser, message) => {
      if (fromUser !== currentUserId) {
        setMessages((prev) => [
          ...prev,
          {
            content: message,
            senderId: fromUser,
            timestamp: new Date().toISOString().replace("Z", ""),
          },
        ]);
      }
    });

    setupConnection();

    return () => {
      connection.off("ReceivePrivateMessage");
    };
  }, [otherUser, currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://192.168.1.59:5220/api/Messages/${otherUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error fetching messages: ${res.status}`);
        }

        const data = await res.json();

        const filteredMessages = data.messaggi.filter(
          (msg) => msg.content && msg.content.trim() !== ""
        );

        setMessages(filteredMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && otherUser) fetchMessages();
  }, [otherUser, token, currentUserId]);

  const handleDeleteChat = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.59:5220/api/Messages/deleteChat/${otherUser}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setMessages([]);
        navigate("/bonders");
      } else {
        console.error("Errore nella cancellazione della chat");
      }
    } catch (error) {
      console.error("Errore nella cancellazione della chat:", error);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") {
      console.log("Messaggio vuoto, non inviato");
      return;
    }

    try {
      if (connection.state === HubConnectionState.Connected) {
        await connection.invoke("SendPrivateMessage", otherUser, input);

        setMessages((prev) => [
          ...prev,
          {
            content: input,
            senderId: currentUserId,
            timestamp: new Date().toISOString().replace("Z", ""),
          },
        ]);

        setInput("");
      } else {
        console.error("Cannot send message: connection not established");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return "";
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Oggi";
    if (isYesterday) return "Ieri";

    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp + "Z");
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {" "}
      <div className="flex items-center justify-between px-4 py-2 fixed top-0 w-[100%] fade-in bg-[#9b1fff]">
        <div className="flex items-center">
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
            className="lucide lucide-chevron-left-icon lucide-chevron-left cursor-pointer"
            onClick={() => navigate("/bonders")}
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <img
            src={ricevente?.profilo?.immagine}
            className="w-15 h-15 object-cover rounded-full me-4"
            alt=""
          />
          <h1 className="text-center text-xl">
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
              key="logout"
              color="danger"
              textValue="Logout"
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
                  class="bi bi-trash"
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
          {(() => {
            let lastDate = "";
            return messages.map((msg, i) => {
              const isOwnMessage = msg.senderId === currentUserId;
              const time = formatTime(msg.timestamp);
              const currentDate = formatDate(msg.timestamp);
              const showDate = currentDate !== lastDate;
              if (showDate) lastDate = currentDate;

              return (
                <div key={i}>
                  {showDate && (
                    <div className="flex justify-center text-sm mt-2 mb-4">
                      <p className="badgini px-3 py-0.5 rounded-2xl flex items-center justify-center text-gray-400">
                        {currentDate}
                      </p>
                    </div>
                  )}
                  <div
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-xl py-2 px-3 ${
                        isOwnMessage
                          ? "bg-[#9b1fff] rounded-br-none"
                          : "bg-[#5d1093] rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                      <p
                        className={`text-[10px] text-gray-300 pt-1 ${
                          isOwnMessage ? "text-start me-5" : "text-end ms-5"
                        }`}
                      >
                        {time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
          <div ref={messagesEndRef} />
        </div>
      )}
      <div className="input-container flex p-4 fixed bottom-0 w-[100%] bg-transparent z-10 fade-in">
        <div className="messageBox mx-auto bg-[#9b1fff]">
          <input
            required=""
            placeholder="Scrivi un messaggio..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            id="messageInput"
          />
          <button id="sendButton" onClick={sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 664 663"
            >
              <path
                fill="none"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="33.67"
                stroke="#6c6c6c"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
            </svg>
          </button>
        </div>
      </div>{" "}
    </>
  );
};

export default Chat;
