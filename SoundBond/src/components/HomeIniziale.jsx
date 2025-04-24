import { HeroParallaxDemo } from "./HeroParallaxDemo";
import HomeCards from "./HomeCards";
import GradientBig from "../../animations/GradientBig";

const HomeIniziale = () => {
  return (
    <div className="fade-in relative">
      <HeroParallaxDemo />
      <HomeCards />
      <div className="my-11">
        <GradientBig
          colors={["#C476FF", "#D29CFF", "#B060F0", "#E2B8FF", "#A94CE6"]}
          animationSpeed={5}
          showBorder={true}
          className="custom-class"
        >
          INIZIA SUBITO
        </GradientBig>
      </div>
    </div>
  );
};

export default HomeIniziale;
