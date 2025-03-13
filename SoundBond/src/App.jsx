import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Esplora from "./components/Esplora";
import { Footer } from "./components/Footer";
import Home from "./components/Home";
import Accedi from "./components/Accedi";
import Registrati from "./components/Registrati";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Esplora />} />
          <Route path="/accedi/registrati" element={<Registrati />} />
          <Route path="accedi" element={<Accedi />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
