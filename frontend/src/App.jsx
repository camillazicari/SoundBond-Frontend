/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import HomeIniziale from "./components/HomeIniziale";
import Accedi from "./components/Accedi";
import Registrati from "./components/Registrati";
import Generi from "./components/Generi";
import Artisti from "./components/Artisti";
import Brani from "./components/Brani";
import Home from "./components/Home";
import Impostazioni from "./components/Impostazioni";
import Feedback from "./components/Feedback";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import BondSpinner from "./components/BondSpinner";
import PrivateRoute from "./components/PrivateRoute";
import Connessioni from "./components/Connessioni";
import Esplora from "./components/Esplora";
import { getUtenteLoggato } from "./redux/actions/account";
import Player from "./components/Player";
import Richieste from "./components/Richieste";
import Bonders from "./components/Bonders";
import Dettagli from "./components/Dettagli";
import Chat from "./components/Chat";
import ChatWrapper from "./components/ChatWrapper";
import ChatGenerali from "./components/ChatGenerali";

function App() {
  const dispatch = useDispatch();
  const loginSuccess = useSelector((state) => state.account.loginSuccess);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        const timeRemaining = decodedToken.exp - currentTime;

        if (timeRemaining < 0) {
          console.log("Token scaduto, rimuovo dal localStorage");
          localStorage.removeItem("jwtToken");
          dispatch({ type: "LOGOUT" });
          navigate("/homeIniziale");
        } else {
          console.log("Token valido, procedo con il login");
          dispatch({ type: "LOGIN_SUCCESS", payload: true });
          dispatch(getUtenteLoggato());
        }
      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
        navigate("/homeIniziale");
      }
    } else {
      console.log("Nessun token trovato, utente non loggato");
      dispatch({ type: "LOGOUT" });
      navigate("/homeIniziale");
    }

    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    return (
      <div
        style={{ width: "100vh", height: "100vh" }}
        className=" flex items-center justify-center"
      >
        <BondSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100vh]">
      <Navbar />
      <main className="flex-grow-1 flex flex-col justify-center">
        <Routes>
          {!loginSuccess ? (
            <Route path="/" element={<HomeIniziale />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}
          <Route path="/homeIniziale" element={<HomeIniziale />} />
          <Route path="/accedi" element={<Accedi />} />
          <Route path="/accedi/registrati" element={<Registrati />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/generi"
            element={
              <PrivateRoute>
                <Generi />
              </PrivateRoute>
            }
          />
          <Route
            path="/artisti"
            element={
              <PrivateRoute>
                <Artisti />
              </PrivateRoute>
            }
          />
          <Route
            path="/brani"
            element={
              <PrivateRoute>
                <Brani />
              </PrivateRoute>
            }
          />
          <Route
            path="/impostazioni"
            element={
              <PrivateRoute>
                <Impostazioni />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/connessioni"
            element={
              <PrivateRoute>
                <Connessioni />
              </PrivateRoute>
            }
          />
          <Route
            path="/esplora"
            element={
              <PrivateRoute>
                <Esplora />
              </PrivateRoute>
            }
          />

          <Route
            path="/richieste"
            element={
              <PrivateRoute>
                <Richieste />
              </PrivateRoute>
            }
          />

          <Route
            path="/bonders"
            element={
              <PrivateRoute>
                <Bonders />
              </PrivateRoute>
            }
          />

          <Route
            path="/dettagli/:id"
            element={
              <PrivateRoute>
                <Dettagli />
              </PrivateRoute>
            }
          />

          <Route
            path="/chat/:id"
            element={
              <PrivateRoute>
                <ChatWrapper />
              </PrivateRoute>
            }
          />

          <Route
            path="/generali"
            element={
              <PrivateRoute>
                <ChatGenerali />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Player />
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
