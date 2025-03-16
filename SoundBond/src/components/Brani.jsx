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
        <div className=" text-end mt-4 me-5">
          <button
            className="text-center w-48 rounded-2xl h-14 relative text-xl font-semibold group"
            type="button"
            // onClick={() => {
            //   handleNavigate();
            // }}
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
                className="bi bi-check2"
                viewBox="0 0 16 16"
              >
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
              </svg>
            </div>
            <p className="translate-x-2">Completa</p>
          </button>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Brani;
