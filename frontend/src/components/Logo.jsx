import lockup from "../assets/brand/soundbond-lockup.svg";

// Logotipo SoundBond: simbolo "onda intrecciata" + nome, versione per fondo scuro
const Logo = ({ className = "h-[1.15rem]" }) => (
  <img src={lockup} alt="SoundBond" className={`w-auto ${className}`} />
);

export default Logo;
