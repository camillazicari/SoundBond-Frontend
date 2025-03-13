import { Link } from "react-router-dom";

export default function GradientBig({
  children,
  colors = ["#f4caf9, #d489e9, #b067a3, #eda7f2, #8d4a8c"],
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
      className="flex justify-center animated-gradient-text hover:scale-110 transition-transform ease-in-out backdrop-blur-lg backdrop-brightness-75"
      style={{ padding: "8px 20px 8px 20px" }}
    >
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div className="text-content text-3xl" style={gradientStyle}>
        {children}
      </div>
    </Link>
  );
}
