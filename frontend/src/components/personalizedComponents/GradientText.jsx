import { Link } from "react-router-dom";

export default function GradientText({
  children,
  colors = ["#C476FF", "#D29CFF", "#B060F0", "#E2B8FF", "#A94CE6"],
  animationSpeed = 8,
  showBorder = true,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <Link
      to={"/accedi"}
      className="flex justify-center animated-gradient-text hover:scale-110 text-lg transition-transform backdrop-blur-lg backdrop-brightness-75"
      style={{ padding: "8px 20px 8px 20px", transitionDuration: "1s" }}
    >
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </Link>
  );
}
