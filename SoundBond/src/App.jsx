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

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("jwtToken");
          dispatch({ type: "LOGOUT" });
          navigate("/homeIniziale");
        } else {
          dispatch({ type: "LOGIN_SUCCESS", payload: true });
        }
      } catch {
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
        navigate("/homeIniziale");
      }
    } else {
      dispatch({ type: "LOGOUT" });
      navigate("/homeIniziale");
    }

    setIsAuthChecked(true);
  }, [dispatch]);

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
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
