import { API_URL } from "../config";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Logo from "./Logo";
import { Menu, X, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
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
  const location = useLocation();
  const reduceMotion = useReducedMotion();
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

  const closeSignalRConnection = async () => {
    if (
      hubConnectionRef.current &&
      hubConnectionRef.current.state === signalR.HubConnectionState.Connected
    ) {
      console.log("Closing SignalR connection");
      try {
        await hubConnectionRef.current.stop();
        console.log("SignalR connection closed successfully");
        hubConnectionRef.current = null;
      } catch (err) {
        console.error("Error closing SignalR connection:", err);
      }
    }
  };

  useEffect(() => {
    const setupConnection = async () => {
      await closeSignalRConnection();

      if (isLoggedIn && userId) {
        console.log(`Setting up new SignalR connection for user: ${userId}`);
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/chatHub`, {
          accessTokenFactory: () => localStorage.getItem("jwtToken"),
        })
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

        try {
          await connection.start();
          console.log("SignalR Connected");
          await connection.invoke("JoinUserGroup", userId);
          console.log(`Utente ${userId} collegato al proprio gruppo`);
        } catch (err) {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    setupConnection();

    return () => {
      closeSignalRConnection();
    };
  }, [isLoggedIn, userId, dispatch]);

  useEffect(() => {
    if (shouldLogout) {
      closeSignalRConnection();
      dispatch({ type: "RESET_LOGOUT" });
    }
  }, [shouldLogout, dispatch]);

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

  const bellButton = (
    <span className="relative grid size-10 place-items-center rounded-full border border-line bg-white/[0.04] text-fg transition-colors hover:bg-white/[0.08]">
      <Bell size={18} strokeWidth={1.75} />
      {requestCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink">
          {requestCount > 9 ? "9+" : requestCount}
        </span>
      )}
    </span>
  );

  const NotificationBell =
    requestCount > 0 ? (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button
            type="button"
            aria-label={`Notifiche: ${requestCount}`}
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer"
          >
            {bellButton}
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Notifiche"
          className="glass min-w-64 rounded-2xl p-1.5"
        >
          {receivedRequests && receivedRequests.length > 0 && (
            <DropdownItem
              key="richieste"
              textValue={`${receivedRequests.length} nuove richieste`}
              className="rounded-xl px-3 py-2.5 text-sm data-[hover=true]:bg-white/[0.06]"
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
              key="messaggi"
              textValue={`${messaggiNonLetti} nuovi messaggi`}
              className="rounded-xl px-3 py-2.5 text-sm data-[hover=true]:bg-white/[0.06]"
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
                textValue="Nuovo bonder"
                className="rounded-xl px-3 py-2.5 text-sm data-[hover=true]:bg-white/[0.06]"
              >
                <Link
                  to={"/bonders"}
                  onClick={() => {
                    handleBonderClick(bonder.id);
                  }}
                >
                  Nuovo bonder: {bonder.otherUser.nome}{" "}
                  {bonder.otherUser.cognome}
                </Link>
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>
    ) : (
      <span aria-label="Nessuna notifica">{bellButton}</span>
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

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring", bounce: 0, duration: 0.35 };

  return (
    !location.pathname.startsWith("/chat") && (
      <header className="sticky top-0 z-30 px-4 pt-3 md:pt-4">
        <nav className="glass mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full pr-2 pl-5">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="shrink-0"
            aria-label="SoundBond, home"
          >
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label }) => {
              const active = isLoggedIn && isActive(to);
              return (
                <li key={label} className="relative">
                  <Link
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            {!isLoggedIn ? (
              <Link to="/accedi" className="btn btn-primary">
                Accedi
              </Link>
            ) : (
              <>
                {NotificationBell}
                <NavAvatar />
              </>
            )}
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-fg md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0.15 } : { type: "spring", bounce: 0, duration: 0.3 }}
              style={{ transformOrigin: "top right" }}
              className="glass absolute inset-x-4 top-[5.25rem] z-20 rounded-3xl p-3 md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-base font-medium ${
                        isLoggedIn && isActive(to)
                          ? "bg-white/[0.07] text-fg"
                          : "text-muted"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between border-t border-line px-2 pt-3">
                {!isLoggedIn ? (
                  <Link
                    to="/accedi"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-primary w-full"
                  >
                    Accedi
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/richieste"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-sm text-muted"
                    >
                      {bellButton}
                      Notifiche
                    </Link>
                    <NavAvatar />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    )
  );
};

export default Navbar;
