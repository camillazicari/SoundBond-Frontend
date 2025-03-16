import { HeroParallaxDemo } from "./HeroParallaxDemo";
import HomeCards from "./HomeCards";
import GradientBig from "../../animations/GradientBig";

const Home = () => {
  return (
    <>
      <HeroParallaxDemo />
      <HomeCards />
      <div className=" my-11">
        <GradientBig
          colors={["#d489e9, #b067a3, #eda7f2, #8d4a8c, #f4caf9"]}
          animationSpeed={5}
          showBorder={true}
          className="custom-class"
        >
          INIZIA SUBITO
        </GradientBig>
      </div>
    </>
  );
};

export default Home;
