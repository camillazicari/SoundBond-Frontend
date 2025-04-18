/* eslint-disable react-hooks/exhaustive-deps */
import { BackgroundBeamsWithCollision } from "../../animations/BgBeams";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUtenteLoggato } from "../redux/actions/account.js";
import { deleteGenere, postGeneri, getGeneri } from "@/redux/actions/generi";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner";

const Generi = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.userLogged);
  const generi = useSelector((state) => state.generi.generi);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getGeneri());
  }, []);

  const [error, setError] = useState("");

  const [buttons, setButtons] = useState([
    { id: "Pop", isLiked: false },
    { id: "Rap", isLiked: false },
    { id: "Rock", isLiked: false },
    { id: "Dance", isLiked: false },
    { id: "R&B", isLiked: false },
    { id: "Alternative", isLiked: false },
    { id: "Electro", isLiked: false },
    { id: "Folk", isLiked: false },
    { id: "Reggae", isLiked: false },
    { id: "Jazz", isLiked: false },
    { id: "Classica", isLiked: false },
    { id: "Metal", isLiked: false },
    { id: "Soul", isLiked: false },
    { id: "Funk", isLiked: false },
    { id: "Blues", isLiked: false },
    { id: "Cumbia", isLiked: false },
    { id: "House", isLiked: false },
    { id: "Techno", isLiked: false },
    { id: "Ambient", isLiked: false },
    { id: "Indie", isLiked: false },
    { id: "Gospel", isLiked: false },
    { id: "Latina", isLiked: false },
    { id: "Trap", isLiked: false },
    { id: "K-Pop", isLiked: false },
    { id: "Lo-Fi", isLiked: false },
    { id: "Hard Rock", isLiked: false },
    { id: "Brasiliana", isLiked: false },
    { id: "Indiana", isLiked: false },
    { id: "Asiatica", isLiked: false },
    { id: "Africana", isLiked: false },
  ]);

  const handleLikeClick = (id) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, isLiked: !button.isLiked } : button
      )
    );
    setError("");
  };

  const handleNavigate = async () => {
    const likedButtons = buttons.filter((button) => button.isLiked);

    if (likedButtons.length < 1) {
      setError("Devi selezionare almeno un genere!");
      return;
    }

    if (likedButtons.length > 10) {
      setError("Puoi selezionare al massimo 10 generi.");
      return;
    }
    setIsLoading(true);
    try {
      if (generi.length > 0) {
        await Promise.all(
          generi.map((genere) => dispatch(deleteGenere(genere.nome)))
        );
      }

      await Promise.all(
        likedButtons.map((button) => dispatch(postGeneri(button.id)))
      );

      setIsLoading(false);
      navigate("/artisti");
    } catch (err) {
      console.error("Errore nella navigazione:", err);
    }
  };

  return (
    <BackgroundBeamsWithCollision>
      <div
        className="flex flex-col justify-around fade-in"
        style={{ width: "100%", height: "100%" }}
      >
        {isLoading && <BondSpinner />}
        {!isLoading && (
          <>
            <div className="flex flex-col items-center mt-4">
              {user && (
                <h2 className="text-xl z-20 mb-5 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-center tracking-tight">
                  {user.nome}, benvenut* nella{" "}
                  <span style={{ color: "#9b1fff" }}>bonders</span> community.
                  <div className="bg-clip-text text-transparent bg-no-repeat">
                    <span className="">Conosciamoci meglio...</span>
                  </div>{" "}
                </h2>
              )}

              <p
                className=" text-center md:text-xl lg:text-2xl mb-5"
                style={{ color: "#9b1fff" }}
              >
                Che generi preferisci?
              </p>

              <div className="button-list grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 place-items-center">
                {buttons.map((button) => (
                  <div key={button.id} className="like-button m-3">
                    <input
                      type="checkbox"
                      id={button.id}
                      className="on hidden"
                      checked={button.isLiked}
                      onChange={() => handleLikeClick(button.id)}
                    />
                    <label htmlFor={button.id} className="like">
                      <svg
                        className="like-icon"
                        fillRule="nonzero"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path>
                      </svg>
                      <span className="text-sm">{button.id}</span>
                    </label>
                  </div>
                ))}
              </div>
              {error && (
                <p className="text-normal text-center Errors">{error}</p>
              )}
            </div>
            <div className="flex justify-end w-[100%]">
              <button
                className="text-center w-48 rounded-2xl h-14 relative text-xl font-semibold group"
                type="button"
                onClick={() => {
                  handleNavigate();
                }}
              >
                <div
                  className="rounded-lg ms-5 sm:ms-0 sm:rounded-xl h-8 w-1/6 sm:h-10 sm:w-1/5 lg:w-1/4 lg:h-12 flex items-center justify-center absolute top-[4px] group-hover:w-[140px] sm:group-hover:w-[170px] lg:group-hover:w-[184px] z-10 duration-500"
                  style={{
                    backgroundColor: "#9b1fff",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-arrow-right-short"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                    />
                  </svg>
                </div>
                <p className="lg:translate-x-2 text-base pb-3.5 sm:text-xl lg-text-2xl sm:pb-1.5 lg:pb-0">
                  Continua
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Generi;
