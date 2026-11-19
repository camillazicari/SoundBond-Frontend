import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUtenti, register } from "../redux/actions/account.js";
import BondSpinner from "./BondSpinner.jsx";
import AuthLayout from "./AuthLayout.jsx";
import Field from "./ui/Field.jsx";
import { ArrowRight } from "lucide-react";

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

    // regole per username, password ed email
    const usernameRegex = /^[a-zA-Z0-9._-]{5,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
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
    setConfirm("");
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

  const clear = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessages({});
  };
  const [confirm, setConfirm] = useState("");
  const filled =
    [firstName, lastName, dataDiNascita, username, email, password, confirm].filter(Boolean).length / 7;

  return isLoading ? (
    <BondSpinner label="Creazione dell'account" />
  ) : (
    <AuthLayout
      eyebrow="Crea un account"
      title="Trova chi"
      accent="suona come te."
      intro="Un minuto per il profilo, poi scegli generi, artisti e brani. Il resto lo fa il match."
      progress={filled}
      aside={
        <ol className="space-y-3 text-sm text-muted">
          {["Crea il profilo", "Scegli generi, artisti e brani", "Scopri chi è in sintonia con te"].map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-full border border-line-strong font-mono text-xs text-fg">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      }
    >
      <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSignUp} noValidate>
        {errorMessages.generic && (
          <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200 sm:col-span-2">
            {errorMessages.generic}
          </p>
        )}
        <Field label="Nome" autoComplete="given-name" value={firstName} onChange={clear(setFirstName)} required />
        <Field label="Cognome" autoComplete="family-name" value={lastName} onChange={clear(setLastName)} required />
        <Field
          className="sm:col-span-2"
          label="Data di nascita"
          type="date"
          autoComplete="bday"
          value={dataDiNascita}
          onChange={clear(setDataDiNascita)}
          required
        />
        <Field
          label="Nome utente"
          autoComplete="username"
          value={username}
          onChange={clear(setUsername)}
          error={errorMessages.username}
          hint="Almeno 5 caratteri"
          required
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={clear(setEmail)}
          error={errorMessages.email}
          required
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={clear(setPassword)}
          error={errorMessages.password && "Almeno 8 caratteri, con una maiuscola, una minuscola e un numero."}
          hint="Almeno 8 caratteri, con maiuscola, minuscola e numero"
          required
        />
        <Field
          label="Conferma password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirm}
          onChange={clear(setConfirm)}
          error={errorMessages.confirmPassword}
          required
        />
        <button type="submit" className="btn btn-primary mt-2 h-12 w-full sm:col-span-2">
          Crea l'account
          <ArrowRight size={18} />
        </button>
        <p className="text-center text-sm text-muted sm:col-span-2">
          Hai già un account?{" "}
          <Link to="/accedi" className="font-medium text-accent underline-offset-4 hover:underline">
            Accedi
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Registrati;
