import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const SpotlightCard = ({
  title,
  subtitle,
  svg,
  className = "",
  spotlightColor = "rgba(184, 73, 214, 0.25)",
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-neutral-800 bg-transparent overflow-hidden p-8 ${className} flex flex-col justify-evenly`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {svg}
      <h1 className="text-lg font-bold" style={{ color: "#f7ebfc" }}>
        {title}
      </h1>
      <p className=" text-sm opacity-50" style={{ color: "#f7ebfc" }}>
        {subtitle}
      </p>
      <div className="flex  mt-10 mb-5">
        <Link
          to={"/accedi"}
          className="font-semibold py-2 px-8 rounded-lg transition duration-300"
          id="btnCardsHome"
          style={{ backgroundColor: "rgba(184, 73, 214, 0.5)" }}
        >
          Scopri
        </Link>
      </div>
    </div>
  );
};

export default SpotlightCard;
