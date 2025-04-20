import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUtenti, login } from "../redux/actions/account.js";
import BondSpinner from "./BondSpinner.jsx";

const Accedi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const errore = useSelector((state) => state.account.isLoginError);
  const [isLoading, setIsLoading] = useState(false);
  const utenti = useSelector((state) => state.account.allUsers);

  useEffect(() => {
    dispatch(getAllUtenti());
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();

    const errors = {};

    if (!email || !password) {
      errors.generic = "Compilare tutti i campi!";
    }

    const utenteEsistente = utenti.find((u) => u.email === email);

    if (!utenteEsistente) {
      errors.generic = "Utente inesistente. Registrati per poter accedere.";
    }

    if (Object.keys(errors).length > 0 || errore) {
      setErrorMessages(errors);
      return;
    }
    setIsLoading(true);
    setEmail("");
    setPassword("");
    setErrorMessages({});
    e.target.reset();
    dispatch(login(email, password, navigate))
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Login fallito:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <BondSpinner />
  ) : (
    <div className="container mx-auto my-22 flex-col items-center justify-center fade-in">
      {errorMessages.generic && (
        <p className="Errors text-center mb-2">{errorMessages.generic}</p>
      )}
      {errore && <p className="Errors text-center">{errore}</p>}
      <form className="form signInForm mx-auto" onSubmit={handleLogin}>
        <p className="title">ACCEDI</p>
        <p className="message">
          Accedi ora ed ottieni accesso completo alla nostra app.{" "}
        </p>

        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span>Email</span>
        </label>
        {errorMessages.email && (
          <p className="text-sm text-center Errors">{errorMessages.email}</p>
        )}

        <label>
          <input
            className="input"
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>Password</span>
        </label>

        <button className="submit text-center">Accedi ora</button>

        <p className="signin">
          Non hai un account? <Link to={"/accedi/registrati"}>Registrati</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Accedi;
