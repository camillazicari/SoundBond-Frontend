import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/account.js";
import BondSpinner from "./BondSpinner.jsx";

const Accedi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const errore = useSelector((state) => state.account.isLoginError);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const errors = {};

    if (!email || !password) {
      errors.generic = "Compilare tutti i campi!";
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
      .catch(() => {
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <BondSpinner />
  ) : (
    <div className="container mx-auto my-22 flex justify-center fade-in">
      {errorMessages.generic && (
        <p className="Errors">{errorMessages.generic}</p>
      )}
      {errore && <p className="Errors">{errore}</p>}
      <form className="form signInForm" onSubmit={handleLogin}>
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
