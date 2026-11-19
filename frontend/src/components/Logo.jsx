import mark from "../assets/SoundBond/SBViola.png";

// Monogramma SB del brand + nome in Geist
const Logo = ({ className = "" }) => (
  <span className={`flex items-center gap-2 ${className}`}>
    <img src={mark} alt="" className="size-7" />
    <span className="text-[1.05rem] font-semibold tracking-[-0.03em] text-fg">
      SoundBond
    </span>
  </span>
);

export default Logo;
