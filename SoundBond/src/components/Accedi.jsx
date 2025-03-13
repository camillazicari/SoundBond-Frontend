import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

const Accedi = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();

    const errors = {};

    if (!username || !password) {
      errors.generic = "Compilare tutti i campi!";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    const payload = {
      id: username.toLowerCase().replace(/\s/g, ""),
      username,
      password,
    };
    dispatch({ type: "LOGIN_USER", payload });
    setUsername("");
    setPassword("");
    setErrorMessages({});
    e.target.reset();
  };

  return (
    <div className="container mx-auto my-22 flex justify-center">
      {errorMessages.generic && (
        <p className="Errors">{errorMessages.generic}</p>
      )}
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <span>Username</span>
        </label>

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
        <button className="submit">Accedi ora</button>
        <p className="signin">
          Non hai un account? <Link to={"/accedi/registrati"}>Registrati</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Accedi;
