/* eslint-disable react-hooks/exhaustive-deps */
import OnboardingLayout from "./OnboardingLayout.jsx";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUtenteLoggato } from "../redux/actions/account.js";
import {
  deleteGenere,
  postGeneri,
  getGeneri,
} from "../redux/actions/generi.js";
import { useNavigate } from "react-router-dom";
import BondSpinner from "./BondSpinner.jsx";

const Generi = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.userLogged);
  const generi = useSelector((state) => state.generi.generi);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getGeneri());
  }, []);

  const [error, setError] = useState("");

  const [buttons, setButtons] = useState([
    { id: "Pop", isLiked: false },
    { id: "Rap", isLiked: false },
    { id: "Rock", isLiked: false },
    { id: "Dance", isLiked: false },
    { id: "R&B", isLiked: false },
    { id: "Alternative", isLiked: false },
    { id: "Electro", isLiked: false },
    { id: "Folk", isLiked: false },
    { id: "Reggae", isLiked: false },
    { id: "Jazz", isLiked: false },
    { id: "Classica", isLiked: false },
    { id: "Metal", isLiked: false },
    { id: "Soul", isLiked: false },
    { id: "Funk", isLiked: false },
    { id: "Blues", isLiked: false },
    { id: "Cumbia", isLiked: false },
    { id: "House", isLiked: false },
    { id: "Techno", isLiked: false },
    { id: "Ambient", isLiked: false },
    { id: "Indie", isLiked: false },
    { id: "Gospel", isLiked: false },
    { id: "Latina", isLiked: false },
    { id: "Trap", isLiked: false },
    { id: "K-Pop", isLiked: false },
    { id: "Lo-Fi", isLiked: false },
    { id: "Hard Rock", isLiked: false },
    { id: "Brasiliana", isLiked: false },
    { id: "Indiana", isLiked: false },
    { id: "Asiatica", isLiked: false },
    { id: "Africana", isLiked: false },
  ]);

  const handleLikeClick = (id) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, isLiked: !button.isLiked } : button
      )
    );
    setError("");
  };

  const handleNavigate = async () => {
    const likedButtons = buttons.filter((button) => button.isLiked);

    if (likedButtons.length < 1) {
      setError("Devi selezionare almeno un genere!");
      return;
    }

    if (likedButtons.length > 10) {
      setError("Puoi selezionare al massimo 10 generi.");
      return;
    }
    setIsLoading(true);
    try {
      if (generi.length > 0) {
        await Promise.all(
          generi.map((genere) => dispatch(deleteGenere(genere.nome)))
        );
      }

      await Promise.all(
        likedButtons.map((button) => dispatch(postGeneri(button.id)))
      );

      setIsLoading(false);
      navigate("/artisti");
    } catch (err) {
      console.error("Errore nella navigazione:", err);
    }
  };

  const selected = buttons.filter((b) => b.isLiked).length;

  if (isLoading) return <BondSpinner label="Salvataggio dei generi" />;

  return (
    <OnboardingLayout
      step={1}
      name={user?.nome}
      title="Che musica"
      accent="ti accende?"
      intro="Scegli fino a 10 generi. Sono il primo ingrediente del tuo match."
      count={selected}
      max={10}
      error={error}
      onNext={handleNavigate}
    >
      <ul className="flex flex-wrap gap-2.5">
        {buttons.map((button) => (
          <li key={button.id}>
            <button
              type="button"
              aria-pressed={button.isLiked}
              onClick={() => handleLikeClick(button.id)}
              className={`btn px-5 py-3 text-base ${
                button.isLiked
                  ? "bg-accent text-accent-ink"
                  : "border border-line-strong bg-white/[0.03] text-fg hover:bg-white/[0.07]"
              }`}
            >
              {button.isLiked && <Check size={16} strokeWidth={2.5} />}
              {button.id}
            </button>
          </li>
        ))}
      </ul>
    </OnboardingLayout>
  );
};

export default Generi;
