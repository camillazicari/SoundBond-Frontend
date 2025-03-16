import { BackgroundBeamsWithCollision } from "../../animations/BgBeams";
import { SearchAnimata } from "./SearchAnimata";

const Brani = () => {
  const placeholders = [
    "All I Want",
    "My heart will go on",
    "Locked out of Heaven",
    "Amarena",
    "Sere nere",
  ];

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
          <SearchAnimata
            text="Quali sono i tuoi brani preferiti?"
            placeholders={placeholders}
          />
        </div>
        <div className="flex justify-end w-[100%]">
          <button
            className="text-center w-48 rounded-2xl h-14 relative text-xl font-semibold group"
            type="button"
            onClick={() => {
              //handleNavigate();
            }}
          >
            <div
              className="rounded-lg ms-5 sm:ms-0 sm:rounded-xl h-8 w-1/6 sm:h-10 sm:w-1/5 lg:w-1/4 lg:h-12 flex items-center justify-center absolute top-[4px] group-hover:w-[140px] sm:group-hover:w-[170px] lg:group-hover:w-[184px] z-10 duration-500"
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
            <p className="lg:translate-x-2 text-base pb-3.5 sm:text-xl lg-text-2xl sm:pb-1.5 lg:pb-0">
              Continua
            </p>
          </button>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Brani;
