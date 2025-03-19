import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Registrati = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.usersData);
  const [errorMessages, setErrorMessages] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    const errors = {};
    const confirmPassword = e.target.elements.confirmPassword.value;

    // Regex per validazione
    const usernameRegex = /^[a-zA-Z0-9._-]{5,}$/; // Almeno 5 caratteri, include ., -, _
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Almeno 8 caratteri, maiuscole, minuscole, numeri

    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      errors.generic = "Compilare tutti i campi!";
    }

    if (!usernameRegex.test(username)) {
      errors.username = "Il nome utente deve avere almeno 5 caratteri.";
    }
    if (users[username.toLowerCase().replace(/\s/g, "")]) {
      errors.username = "Username già in uso.";
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

    const payload = {
      id: username.toLowerCase().replace(/\s/g, ""), //serve per creare un id unico
      username,
      password,
      firstName,
      lastName,
      preferences: [],
    };
    dispatch({ type: "SIGNUP_USER", payload });
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setErrorMessages({});
    e.target.reset();
    navigate("/generi");
  };

  return (
    <div className="container mx-auto my-7 flex flex-col items-center justify-center">
      {errorMessages.generic && (
        <p className="Errors">{errorMessages.generic}</p>
      )}
      <form className="form" onSubmit={handleSignUp}>
        <p className="title">REGISTRATI</p>
        <p className="message">
          Registrati ora ed ottieni accesso completo alla nostra app.
        </p>
        <div className="flexible">
          <label>
            <input
              className="input"
              type="text"
              placeholder=" "
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span>Nome</span>
          </label>

          <label>
            <input
              className="input"
              type="text"
              placeholder=" "
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <span>Cognome</span>
          </label>
        </div>
        {errorMessages.user && <p className="Errors">{errorMessages.user}</p>}
        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>Username</span>
        </label>
        {errorMessages.username && (
          <p className="text-sm text-center Errors">{errorMessages.username}</p>
        )}

        <label>
          <input
            className="input"
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
