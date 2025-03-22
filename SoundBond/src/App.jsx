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

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeIniziale />} />
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
