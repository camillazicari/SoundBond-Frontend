import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import HomeIniziale from "./components/HomeIniziale";
import Accedi from "./components/Accedi";
import Registrati from "./components/Registrati";
import Generi from "./components/Generi";
import Artisti from "./components/Artisti";
import Preferenze from "./components/Preferenze";
import Brani from "./components/Brani";
import Home from "./components/Home";
import Impostazioni from "./components/Impostazioni";
import Feedback from "./components/Feedback";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const loginSuccess = useSelector((state) => state.account.loginSuccess);
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      try {
        dispatch({ type: "LOGIN_SUCCESS", payload: true });
        const decodedToken = jwtDecode(storedToken);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("jwtToken");
          dispatch({ type: "LOGOUT" });
          return;
        }
      } catch {
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
      }
    }
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {!loginSuccess ? (
            <Route path="/" element={<HomeIniziale />} />
          ) : (
            <Route path="/" element={<Preferenze component={<Home />} />} />
          )}
          <Route path="/homeIniziale" element={<HomeIniziale />} />
          <Route path="accedi" element={<Accedi />} />
          <Route path="/accedi/registrati" element={<Registrati />} />
          <Route
            path="/generi"
            element={<Preferenze component={<Generi />} />}
          />
          <Route
            path="/artisti"
            element={<Preferenze component={<Artisti />} />}
          />
          <Route path="/brani" element={<Preferenze component={<Brani />} />} />
          <Route path="/home" element={<Preferenze component={<Home />} />} />
          <Route
            path="/impostazioni"
            element={<Preferenze component={<Impostazioni />} />}
          />
          <Route
            path="/feedback"
            element={<Preferenze component={<Feedback />} />}
          />
        </Routes>
        <Footer />
        <Toaster position="top-center" />
      </BrowserRouter>
    </>
  );
}

export default App;
