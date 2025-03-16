import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GradientText from "../../animations/GradientText";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-3 bg-transparent sticky top-0 z-30">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between bg-transparent">
        <Link
          to="/"
          className="text-3xl font-extrabold SoundBond"
          style={{ color: "#d489e9", textShadow: "2px 2px 4px #0c0512" }}
        >
          SoundBond
        </Link>

        <button
          type="button"
          className="sm:hidden p-2 rounded-lg border"
          style={{
            borderColor: "rgba(184, 73, 214, 0.5)",
            backgroundColor: "rgba(12, 5, 18, 0.5)",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} color="rgba(184, 73, 214, 1)" />
          ) : (
            <Menu size={24} color="rgba(184, 73, 214, 1)" />
          )}
        </button>

        <div
          className={`absolute top-16 left-0 w-full sm:static sm:flex sm:w-auto sm:bg-transparent sm:dark:bg-transparent transition-transform duration-300 ease-in-out ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div
            className={`flex flex-col gap-5 py-3 px-15 sm:flex-row sm:items-center border rounded-3xl justify-center ${
              location.pathname !== "/accedi" &&
              location.pathname !== "/accedi/registrati" &&
              width > 670
                ? "mr-20"
                : "mr-0"
            }`}
            style={{
              borderColor: "rgba(184, 73, 214, 0.5)",
              backgroundColor: "rgba(12, 5, 18, 0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Link
              to="/"
              className="font-medium text-base navText"
              style={{ color: "#b849d6" }}
            >
              Home
            </Link>
            <Link
              className="font-medium text-base navText"
              style={{ color: "#b849d6" }}
            >
              Esplora
            </Link>
            <a
              href="#"
              className="font-medium text-base navText"
              style={{ color: "#b849d6" }}
            >
              Connessioni
            </a>
          </div>
        </div>

        {location.pathname !== "/accedi" &&
          location.pathname !== "/accedi/registrati" && (
            <div className="hidden sm:flex items-center">
              <GradientText
                colors={["#d489e9", "#b067a3", "#eda7f2", "#8d4a8c", "#f4caf9"]}
                animationSpeed={5}
                showBorder={true}
              >
                LOGIN
              </GradientText>
            </div>
          )}
      </nav>
    </header>
  );
};

export default Navbar;
