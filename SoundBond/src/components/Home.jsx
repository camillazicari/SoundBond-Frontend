/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../animations/Card";
import BondSpinner from "./BondSpinner";
import { useNavigate } from "react-router-dom";
import TopMusicMatches from "./TopMusicMatches";
import { useEffect } from "react";
import { getUtenteLoggato, getUtenti } from "@/redux/actions/account";
import RecommendedPlaylists from "./RecommendedPlaylists";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUtenti());
    dispatch(getUtenteLoggato());
  }, []);
  const user = useSelector((state) => state.account.userLogged);
  const users = useSelector((state) => state.account.users);
  const navigate = useNavigate();

  return users?.length > 0 ? (
    <div className="fade-in container mx-auto grid grid-cols-1 gap-y-6">
      <Card className="px-6 py-10 backdrop-blur-lg mx-3 xxl:mx-0 bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg grid grid-cols-2 gap-5 items-center">
        <div>
          {user && (
            <h2 className="font-extrabold text-xl sm:text-3xl lg:text-4xl textGradient">
              Benvenut* {user.nome} {user.cognome}!
            </h2>
          )}
          <p className="text-sm lg:text-base">
            Scopri nuove connessioni musicali e crea legami attraverso le tue
            canzoni preferite.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-5">
          <button
            className="text-sm sm:text-base rounded-full py-3 md:py-2 px-4 lg:px-5 lg:py-4 xl:px-7 xl:py-5 buttonGradient font-semibold"
            onClick={() => navigate("/esplora")}
          >
            Scopri nuova musica
          </button>
          <button
            className="text-sm sm:text-base rounded-full py-3 md:py-2 px-3 lg:px-5 lg:py-4 xl:px-7 xl:py-5 buttonGradient font-semibold"
            onClick={() => navigate("/connessioni")}
          >
            Trova nuove connessioni
          </button>
        </div>
      </Card>

      <TopMusicMatches />
      <RecommendedPlaylists />
    </div>
  ) : (
    <BondSpinner />
  );
};

export default Home;
