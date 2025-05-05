import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import GradientText from "./personalizedComponents/GradientText";
import NavAvatar from "./NavAvatar";
import { getRichiesteRicevute } from "../redux/actions/richieste.js";
import { getConversazioni } from "../redux/actions/chat.js";
import * as signalR from "@microsoft/signalr";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [nuoviBonders, setNuoviBonders] = useState([]);
  const hubConnectionRef = useRef(null);

  const [seenBonders, setSeenBonders] = useState(() => {
    const saved = localStorage.getItem("seenBonders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("seenBonders", JSON.stringify(seenBonders));
  }, [seenBonders]);

  const isLoggedIn = useSelector((state) => state.account.loginSuccess);
  const userId = useSelector((state) => state.account.user?.id);
  const shouldLogout = useSelector((state) => state.account.logout);
  const conversazioni = useSelector(
    (state) => state.conversazioni.conversazioni
  );
  const receivedRequests = useSelector(
    (state) => state.richieste.richiesteRicevute
  );
  const bonders = useSelector((state) => state.bonders.bonders);

  const messaggiNonLetti = (conversazioni || []).reduce(
    (total, conv) => total + (conv.messaggiNonLetti || 0),
    0
  );

  useEffect(() => {
    if (!bonders || bonders.length === 0) return;

    const nuovi = bonders.filter((bonder) => !seenBonders.includes(bonder.id));

    if (nuovi.length > 0) {
      setNuoviBonders(nuovi);

      setTimeout(() => {
        setSeenBonders((prev) => [...prev, ...nuovi.map((b) => b.id)]);
      }, 5000);
    }
  }, [bonders, seenBonders]);

  const requestCount =
    (receivedRequests?.length || 0) + messaggiNonLetti + nuoviBonders.length;

  const handleBonderClick = (bonderId) => {
    setSeenBonders((prev) => [...prev, bonderId]);
    setNuoviBonders((prev) => prev.filter((b) => b.id !== bonderId));
    navigate("/bonders");
  };

  useEffect(() => {
    if (isLoggedIn && userId) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub")
        .withAutomaticReconnect()
        .build();

      hubConnectionRef.current = connection;

      connection.on("ReceiveMessage", (senderId, message) => {
        console.log(`Nuovo messaggio ricevuto da ${senderId}: ${message}`);
        dispatch(getConversazioni());
      });

      connection.on("ReceiveRequest", () => {
        console.log("Nuova richiesta ricevuta");
        dispatch(getRichiesteRicevute());
      });

      connection
        .start()
        .then(() => {
          console.log("SignalR Connected");
          return connection.invoke("JoinUserGroup", userId);
        })
        .then(() => {
          console.log(`Utente ${userId} collegato al proprio gruppo`);
        })
        .catch((err) => console.error("SignalR Connection Error: ", err));

      return () => {
        if (connection.state === signalR.HubConnectionState.Connected) {
          connection.stop();
        }
      };
    }
  }, [isLoggedIn, userId, dispatch]);

  useEffect(() => {
    if (shouldLogout && hubConnectionRef.current) {
      hubConnectionRef.current.stop();
    }
  }, [shouldLogout]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (isLoggedIn) {
        try {
          await dispatch(getRichiesteRicevute());
          await dispatch(getConversazioni());
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchRequests();

    const intervalId = setInterval(fetchRequests, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch, isLoggedIn]);

  const NotificationBell =
    requestCount > 0 ? (
      <div className="relative me-4">
        <Dropdown>
          <DropdownTrigger>
            <div>
              <Bell
                className="text-[#ad42ff] cursor-pointer transition-all animate-pulse"
                size={30}
                onClick={() => setMenuOpen(false)}
              />
              {requestCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ad42ff] text-[#0C0512] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {requestCount > 9 ? "9+" : requestCount}
                </span>
              )}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Notifiche"
            className="flex justify-center p-2 border-[#ad42ff] border-[0.5px] rounded-lg"
            style={{
              backgroundColor: "rgba(12, 5, 18, 0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            {receivedRequests && receivedRequests.length > 0 && (
              <DropdownItem
                textValue={`${receivedRequests.length} nuove richieste`}
                className="hover:bg-[#ad42ff] cursor-pointer rounded-sm"
              >
                <Link to="/richieste">
                  {receivedRequests.length === 1
                    ? "Hai 1 nuova richiesta"
                    : `Hai ${receivedRequests.length} nuove richieste`}
                </Link>
              </DropdownItem>
            )}
            {messaggiNonLetti > 0 && (
              <DropdownItem
                textValue={`${messaggiNonLetti} nuovi messaggi`}
                className="hover:bg-[#ad42ff] cursor-pointer rounded-sm"
              >
                <Link to="/generali">
                  {messaggiNonLetti === 1
                    ? "Hai 1 nuovo messaggio"
                    : `Hai ${messaggiNonLetti} nuovi messaggi`}
                </Link>
              </DropdownItem>
            )}
            {nuoviBonders.length > 0 &&
              nuoviBonders.map((bonder) => (
                <DropdownItem
                  key={bonder.id}
                  textValue={`Hai 1 nuovo bonder`}
                  className="hover:bg-[#ad42ff] cursor-pointer rounded-sm"
                >
                  <Link
                    to={"/bonders"}
                    onClick={() => {
                      handleBonderClick();
                    }}
                  >
                    Hai 1 nuovo bonder: {bonder.otherUser.nome}{" "}
                    {bonder.otherUser.cognome}
                  </Link>
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    ) : (
      <div className="me-4">
        <Bell
          className="text-[#ad42ff] transition-all"
          size={30}
          onClick={() => setMenuOpen(false)}
        />
      </div>
    );

  const navLinks = isLoggedIn
    ? [
        { to: "/", label: "Home" },
        { to: "/esplora", label: "Esplora" },
        { to: "/connessioni", label: "Connessioni" },
        { to: "/richieste", label: "Richieste" },
        { to: "/generali", label: "Chat" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/accedi", label: "Esplora" },
        { to: "/accedi", label: "Connessioni" },
        { to: "/accedi", label: "Richieste" },
        { to: "/accedi", label: "Chat" },
      ];

  return (
    !location.pathname.startsWith("/chat") && (
      <header className="w-full sticky top-0 z-30 bg-transparent py-3 md:py-4">
        <nav className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex-1 md:flex-initial md:w-1/3">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img
                src="src/assets/SoundBond/SoundBondViola.png"
                alt="Logo"
                className="w-39 md:w-40 lg:w-48 h-auto transition-all duration-300"
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center items-center space-x-2 lg:space-x-4 border-[0.5px] border-[#ad42ff] rounded-4xl px-4 py-2 bg-[#0C0512]/50 backdrop-blur-lg">
            {navLinks.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-sm lg:text-base text-[#ad42ff] hover:text-[#c476ff] transition-colors px-1 py-2 rounded-lg"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex flex-1 justify-end items-center space-x-4 lg:space-x-6">
            {!isLoggedIn ? (
              <div>
                <GradientText
                  to="/accedi"
                  onClick={() => setMenuOpen(false)}
                  colors={[
                    "#C476FF",
                    "#D29CFF",
                    "#B060F0",
                    "#E2B8FF",
                    "#A94CE6",
                  ]}
                  animationSpeed={5}
                  showBorder={true}
                  className="text-base"
                >
                  LOGIN
                </GradientText>
              </div>
            ) : (
              <>
                {NotificationBell}
                <NavAvatar />
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2"
            style={{
              borderColor: "#ad42ff",
              backgroundColor: "rgba(12, 5, 18, 0.5)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={30} color="#ad42ff" />
            ) : (
              <Menu size={30} color="#ad42ff" />
            )}
          </button>

          {menuOpen && (
            <div className="md:hidden fixed inset-0 top-19 bg-[#0C0512]/95 backdrop-blur-lg z-20 overflow-y-auto">
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center space-y-6">
                  {navLinks.map(({ to, label }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
                      className="font-medium text-lg text-[#ad42ff] hover:text-[#c476ff] transition-colors px-1 py-2 rounded-lg"
                    >
                      {label}
                    </Link>
                  ))}

                  {!isLoggedIn ? (
                    <Link to="/accedi" onClick={() => setMenuOpen(false)}>
                      <GradientText
                        colors={[
                          "#C476FF",
                          "#D29CFF",
                          "#B060F0",
                          "#E2B8FF",
                          "#A94CE6",
                        ]}
                        animationSpeed={5}
                        showBorder={true}
                        className="text-xl"
                      >
                        LOGIN
                      </GradientText>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center space-x-8 pt-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/richieste");
                          setMenuOpen(false);
                        }}
                      >
                        {NotificationBell}
                      </div>
                      <NavAvatar />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    )
  );
};

export default Navbar;
