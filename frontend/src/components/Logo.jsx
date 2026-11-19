import lockup from "../assets/brand/soundbond-lockup.svg";

const Logo = ({ className = "h-[1.15rem]" }) => (
  <img src={lockup} alt="SoundBond" className={`w-auto ${className}`} />
);

export default Logo;
