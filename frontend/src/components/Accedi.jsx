import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUtenti, login } from "../redux/actions/account.js";
import BondSpinner from "./BondSpinner.jsx";
import AuthLayout from "./AuthLayout.jsx";
import Field from "./ui/Field.jsx";
import { ArrowRight } from "lucide-react";

const Accedi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const errore = useSelector((state) => state.account.isLoginError);
  const [isLoading, setIsLoading] = useState(false);
  const utenti = useSelector((state) => state.account.allUsers);
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    // Carica gli utenti e imposta il flag quando completato
    dispatch(getAllUtenti())
      .then(() => setUsersLoaded(true))
      .catch((err) =>
        console.error("Errore nel caricamento degli utenti:", err)
      );
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();

    const errors = {};

    // Validazione campi vuoti
    if (!email || !password) {
      errors.generic = "Compilare tutti i campi!";
      setErrorMessages(errors);
      return;
    }

    // Verifica se gli utenti sono stati caricati
    if (!usersLoaded || utenti.length === 0) {
      errors.generic = "Caricamento utenti in corso, riprova tra un attimo...";
      setErrorMessages(errors);
      return;
    }

    // Cerca l'utente con email corrispondente (case insensitive)
    const utenteEsistente = utenti.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    // Verifica se l'utente esiste
    if (!utenteEsistente) {
      errors.generic = "Utente inesistente. Registrati per poter accedere.";
      setErrorMessages(errors);
      return;
    }

    // Se non ci sono errori, procedi con il login
    setIsLoading(true);
    setErrorMessages({});

    dispatch(login(email, password, navigate))
      .then(() => {
        setEmail("");
        setPassword("");
        e.target.reset();
      })
      .catch((err) => {
        console.error("Login fallito:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const filled = [email, password].filter(Boolean).length / 2;
  const message = errorMessages.generic || errore;

  return isLoading ? (
    <BondSpinner label="Accesso in corso" />
  ) : (
    <AuthLayout
      eyebrow="Accedi"
      title="Rimettiti"
      accent="in sintonia."
      intro="Le tue connessioni ti aspettano. Entra per vedere chi è in sintonia con te oggi."
      progress={filled}
      aside={
        <p className="display text-4xl font-bold">
          Due playlist.
          <br />
          <span className="text-accent">Un legame.</span>
        </p>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleLogin} noValidate>
        {message && (
          <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {message}
          </p>
        )}
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn btn-primary mt-2 h-12 w-full disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!usersLoaded || utenti.length === 0}
        >
          Accedi
          <ArrowRight size={18} />
        </button>
        <p className="text-center text-sm text-muted">
          Non hai un account?{" "}
          <Link to="/accedi/registrati" className="font-medium text-accent underline-offset-4 hover:underline">
            Registrati
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Accedi;
