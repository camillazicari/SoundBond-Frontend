import { BackgroundBeamsWithCollision } from "../../animations/BgBeams";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Generi = () => {
  const navigate = useNavigate();
  const [buttons, setButtons] = useState([
    { id: "Jazz", isLiked: false },
    { id: "Pop", isLiked: false },
    { id: "Rock", isLiked: false },
    { id: "Metal", isLiked: false },
    { id: "Indie", isLiked: false },
    { id: "R&B", isLiked: false },
    { id: "Soul", isLiked: false },
    { id: "Classica", isLiked: false },
    { id: "Folk", isLiked: false },
    { id: "Funky", isLiked: false },
    { id: "Dance", isLiked: false },
    { id: "'90", isLiked: false },
  ]);

  const handleLikeClick = (id) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, isLiked: !button.isLiked } : button
      )
    );
  };

  const handleNavigate = () => {
    navigate("/artisti");
  };

  return (
    <BackgroundBeamsWithCollision>
      <div
        className="flex flex-col justify-around"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-2xl z-20 md:text-4xl lg:text-7xl font-bold text-center tracking-tight">
            Camilla, benvenuta tra i{" "}
            <span style={{ color: "#b849d6" }}>bonders</span>.
            <div className="bg-clip-text text-transparent bg-no-repeat">
              <span className="">Conosciamoci meglio...</span>
            </div>{" "}
            <br />
          </h2>
          <p
            className=" text-center md:text-xl lg:text-2xl"
            style={{ color: "#b849d6" }}
          >
            Che generi preferisci?
          </p>

          {/* Lista dei bottoni "mi piace" */}
          <div
            className="liked-list rounded-4xl my-4 flex items-center justify-evenly"
            style={{
              border: "0.5px solid #b849d6",
              minHeight: "60px",
              minWidth: "65%",
            }}
          >
            <ul className="grid grid-cols-10">
              {buttons
                .filter((button) => button.isLiked)
                .map((button) => (
                  <li
                    className="m-2 py-1.5 px-3 rounded-2xl text-center"
                    key={button.id}
                    style={{
                      border: "0.5px solid #b849d6",
                    }}
                  >
                    {button.id}
                  </li>
                ))}
            </ul>
          </div>

          <div className="button-list grid grid-cols-6 place-items-center">
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
                  <span className="like-text">{button.id}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className=" text-end mt-4 me-5">
          <button
            className="text-center w-48 rounded-2xl h-14 relative text-xl font-semibold group"
            type="button"
            onClick={() => {
              handleNavigate();
            }}
          >
            <div
              className="rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
              style={{
                backgroundColor: "#b849d6",
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
            <p className="translate-x-2">Continua</p>
          </button>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Generi;
