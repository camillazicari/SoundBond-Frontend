import { Link } from "react-router-dom";

export default function GradientBig({
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
      to={"accedi"}
      className="flex justify-center animated-gradient-text hover:scale-110 ease-in-out backdrop-blur-lg backdrop-brightness-75 transition-all"
      style={{ padding: "8px 20px 8px 20px" }}
    >
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div className="text-content text-2xl md:text-3xl" style={gradientStyle}>
        {children}
      </div>
    </Link>
  );
}
