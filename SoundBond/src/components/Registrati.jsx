import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUtenti, register } from "../redux/actions/account.js";
import BondSpinner from "./BondSpinner.jsx";

const Registrati = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const utenti = useSelector((state) => state.account.allUsers);
  const [errorMessages, setErrorMessages] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dataDiNascita, setDataDiNascita] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllUtenti());
  }, [dispatch]);

  const handleSignUp = (e) => {
    e.preventDefault();
    const errors = {};
    const confirmPassword = e.target.elements.confirmPassword.value;

    // Regex per validazione
    const usernameRegex = /^[a-zA-Z0-9._-]{5,}$/; // Almeno 5 caratteri, include ., -, _
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Almeno 8 caratteri, maiuscole, minuscole, numeri
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      errors.generic = "Compilare tutti i campi!";
    }

    if (!usernameRegex.test(username)) {
      errors.username = "Il nome utente deve avere almeno 5 caratteri.";
    }

    const usernameEsistente = utenti.find((u) => u.nomeUtente === username);

    if (usernameEsistente) {
      errors.username = "Nome utente già in uso";
    }

    if (!emailRegex.test(email)) {
      errors.email = "Email non valida.";
    }

    const emailPresente = utenti.find((u) => u.email === email);

    if (emailPresente) {
      errors.email = "Email già in uso.";
    }

    if (!passwordRegex.test(password)) {
      errors.password = "La password deve contenere:";
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = "Le password non corrispondono.";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setIsLoading(true);
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setDataDiNascita("");
    setEmail("");
    setErrorMessages({});

    dispatch(
      register(
        firstName,
        lastName,
        email,
        dataDiNascita,
        username,
        password,
        navigate
      )
    )
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
    <div className="flex flex-col items-center justify-center fade-in">
      {errorMessages.generic && (
        <p className="Errors">{errorMessages.generic}</p>
      )}
      <form className="form" onSubmit={handleSignUp}>
        <p className="title">REGISTRATI</p>
        <p className="message">
          Registrati ora ed ottieni accesso completo alla nostra app.
        </p>
        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrorMessages({});
            }}
            required
          />
          <span>Nome</span>
        </label>

        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrorMessages({});
            }}
            required
          />
          <span>Cognome</span>
        </label>
        {errorMessages.user && (
          <p className="text-sm text-center Errors">{errorMessages.user}</p>
        )}

        <label>
          <input
            className="input"
            type="date"
            placeholder=" "
            value={dataDiNascita}
            onChange={(e) => {
              setDataDiNascita(e.target.value);
              setErrorMessages({});
            }}
            required
          />
          <span>Data di nascita</span>
        </label>

        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrorMessages({});
            }}
            required
          />
          <span>Username</span>
        </label>
        {errorMessages.username && (
          <p className="text-sm text-center Errors">{errorMessages.username}</p>
        )}

        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessages({});
            }}
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
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessages({});
            }}
            required
          />
          <span>Password</span>
        </label>
        {errorMessages.password && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-center Errors">
              {errorMessages.password}
            </p>
            <ol className="text-sm text-start">
              <li className="Errors">1. &nbsp;&nbsp; almeno 8 caratteri</li>
              <li className="Errors">2. &nbsp; almeno una lettera maiuscola</li>
              <li className="Errors">3. &nbsp; almeno una lettera minuscola</li>
              <li className="Errors">4. &nbsp; almeno un numero</li>
            </ol>
          </div>
        )}
        <label>
          <input
            className="input"
            type="password"
            placeholder=" "
            name="confirmPassword"
            required
          />
          <span>Conferma password</span>
        </label>
        {errorMessages.confirmPassword && (
          <p className="text-sm text-center Errors">
            {errorMessages.confirmPassword}
          </p>
        )}
        <button className="submit">Registrati ora</button>
        <p className="signin">
          Hai già un account? <Link to={"/accedi"}>Accedi</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Registrati;
