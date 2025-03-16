import { BackgroundBeamsWithCollision } from "../../animations/BgBeams";
import { SearchAnimata } from "./SearchAnimata";

const Brani = () => {
  return (
    <BackgroundBeamsWithCollision>
      <div className=" flex flex-col">
        <h2 className="text-2xl z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white tracking-tight">
          Camilla, benvenuta tra i{" "}
          <span style={{ color: "#b849d6" }}>bonders</span>.
          <div className="bg-clip-text text-transparent bg-no-repeat">
            <span className="">Conosciamoci meglio...</span>
          </div>{" "}
          <br />
        </h2>
        <SearchAnimata text="Quali sono i tuoi brani preferiti?" />
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Brani;
