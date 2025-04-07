/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GradientText from "../../animations/GradientText";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import NavAvatar from "./NavAvatar";
import { useSelector } from "react-redux";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const loginSuccess = useSelector((state) => state.account.loginSuccess);
  const logout = useSelector((state) => state.account.logout);
  const navigate = useNavigate();

  const isAuthorized = loginSuccess;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (logout) {
      navigate("/");
    }
  }, [logout]);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full text-sm py-3 bg-transparent relative z-30">
      <nav className="w-full mx-auto px-4 flex items-center justify-between bg-transparent">
        <Link to="/">
          <img
            src="src/assets/SoundBond/SoundBond (100 x 50 px).png"
            alt=""
            className="w-40 md:w-40 lg:w-50"
          />
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
            className={`flex flex-col gap-5 py-3 px-8 md:px-15 sm:flex-row sm:items-center border rounded-3xl justify-center ${
              location.pathname !== "/accedi" &&
              location.pathname !== "/accedi/registrati" &&
              width > 1023
                ? "mr-37"
                : width > 670
                ? "mr-27"
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
              className="font-medium text-sm lg:text-base navText"
              style={{ color: "#b849d6" }}
            >
              Home
            </Link>

            {!isAuthorized ? (
              <Link
                to={"/accedi"}
                className="font-medium text-sm lg:text-base navText"
                style={{ color: "#b849d6" }}
              >
                Esplora
              </Link>
            ) : (
              <Link
                to={"/esplora"}
                className="font-medium text-sm lg:text-base navText"
                style={{ color: "#b849d6" }}
              >
                Esplora
              </Link>
            )}
            {!isAuthorized ? (
              <Link
                to={"/accedi"}
                className="font-medium text-sm lg:text-base navText"
                style={{ color: "#b849d6" }}
              >
                Connessioni
              </Link>
            ) : (
              <Link
                to={"/connessioni"}
                className="font-medium text-sm lg:text-base navText"
                style={{ color: "#b849d6" }}
              >
                Connessioni
              </Link>
            )}
            {(location.pathname === "/" ||
              location.pathname === "/homeIniziale") &&
              !isAuthorized && (
                <div className="flex sm:hidden items-center">
                  <GradientText
                    colors={[
                      "#d489e9",
                      "#b067a3",
                      "#eda7f2",
                      "#8d4a8c",
                      "#f4caf9",
                    ]}
                    animationSpeed={5}
                    showBorder={true}
                  >
                    LOGIN
                  </GradientText>
                </div>
              )}

            {isAuthorized &&
              location.pathname !== "/accedi" &&
              location.pathname !== "/artisti" &&
              location.pathname !== "/brani" &&
              location.pathname !== "/generi" &&
              location.pathname !== "/accedi/registrati" && (
                <div className="flex sm:hidden items-center">
                  <NavAvatar />
                </div>
              )}
          </div>
        </div>
        {(location.pathname === "/" || location.pathname === "/homeIniziale") &&
          !isAuthorized && (
            <div className="md:flex hidden items-center">
              <GradientText
                colors={["#d489e9", "#b067a3", "#eda7f2", "#8d4a8c", "#f4caf9"]}
                animationSpeed={5}
                showBorder={true}
              >
                LOGIN
              </GradientText>
            </div>
          )}

        {isAuthorized &&
          location.pathname !== "/accedi" &&
          location.pathname !== "/artisti" &&
          location.pathname !== "/brani" &&
          location.pathname !== "/generi" &&
          location.pathname !== "/accedi/registrati" && (
            <div className="sm:flex hidden items-center">
              <NavAvatar />
            </div>
          )}
      </nav>
    </header>
  );
};

export default Navbar;
