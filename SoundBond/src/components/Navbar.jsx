import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import GradientText from "../../animations/GradientText";
import NavAvatar from "./NavAvatar";
import { getRichiesteRicevute } from "@/redux/actions/richieste";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNewRequests, setHasNewRequests] = useState(false);

  const isLoggedIn = useSelector((state) => state.account.loginSuccess);
  const shouldLogout = useSelector((state) => state.account.logout);
  const receivedRequests = useSelector(
    (state) => state.richieste.richiesteRicevute
  );
  const requestCount = receivedRequests?.length || 0;

  useEffect(() => {
    if (shouldLogout);
  }, [shouldLogout]);

  const fetchRequests = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const result = await dispatch(getRichiesteRicevute());
        if (result?.payload?.length > requestCount) {
          setHasNewRequests(true);
          setTimeout(() => setHasNewRequests(false), 3000);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }
  }, [dispatch, isLoggedIn, requestCount]);

  useEffect(() => {
    fetchRequests();
    const intervalId = setInterval(fetchRequests, 30000);
    return () => clearInterval(intervalId);
  }, [fetchRequests]);

  useEffect(() => {
    const handleResize = () => window.innerWidth > 768 && setMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NotificationBell = (
    <div className="relative me-4">
      <Bell
        className={`text-[#b849d6] cursor-pointer transition-all ${
          hasNewRequests ? "animate-pulse" : ""
        }`}
        size={30}
        onClick={() => {
          navigate("/richieste");
          setMenuOpen(false);
        }}
      />
      {requestCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#b849d6] text-[#0C0512] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {requestCount > 9 ? "9+" : requestCount}
        </span>
      )}
    </div>
  );

  const navLinks = isLoggedIn
    ? [
        { to: "/", label: "Home" },
        { to: "/esplora", label: "Esplora" },
        { to: "/connessioni", label: "Connessioni" },
        { to: "/bonders", label: "Bonders" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/accedi", label: "Esplora" },
        { to: "/accedi", label: "Connessioni" },
        { to: "/accedi", label: "Bonders" },
      ];

  return (
    <header className="w-full sticky top-0 z-30 bg-transparent py-3 md:py-4">
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 md:flex-initial md:w-1/3">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="src/assets/SoundBond/SoundBond (100 x 50 px).png"
              alt="Logo"
              className="w-32 md:w-40 lg:w-48 h-auto transition-all duration-300"
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center space-x-2 lg:space-x-4 border-[0.5px] border-[#b849d6] rounded-4xl px-4 py-2 bg-[#0C0512]/50 backdrop-blur-lg">
          {navLinks.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="font-medium text-sm lg:text-base text-[#b849d6] hover:text-[#d489e9] transition-colors px-1 py-2 rounded-lg"
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
                colors={["#d489e9", "#b067a3", "#eda7f2", "#8d4a8c", "#f4caf9"]}
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
          className="md:hidden p-2 rounded-lg border"
          style={{
            borderColor: "rgba(184, 73, 214, 0.5)",
            backgroundColor: "rgba(12, 5, 18, 0.5)",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={24} color="rgba(184, 73, 214, 1)" />
          ) : (
            <Menu size={24} color="rgba(184, 73, 214, 1)" />
          )}
        </button>

        {menuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-[#0C0512]/95 backdrop-blur-lg z-20 overflow-y-auto">
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
                    className="font-medium text-lg text-[#b849d6] hover:text-[#d489e9] transition-colors px-1 py-2 rounded-lg"
                  >
                    {label}
                  </Link>
                ))}

                {!isLoggedIn ? (
                  <Link to="/accedi" onClick={() => setMenuOpen(false)}>
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
  );
};

export default Navbar;
